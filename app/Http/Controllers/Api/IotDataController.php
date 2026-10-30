<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\SensorData;
use App\Models\SystemConfig;
use App\Models\UploadLog;
use App\Services\TelemetryNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class IotDataController extends Controller
{
    public function upload(Request $request)
    {
        $device = $request->device;

        // Validasi input: bisa dari file upload atau raw JSON body
        if ($request->hasFile('sensor_file')) {
            return $this->handleFileUpload($request, $device);
        }

        // Raw JSON body (Content-Type: application/json)
        return $this->handleJsonBody($request, $device);
    }

    /**
     * Handle upload via multipart/form-data (sensor_file)
     */
    private function handleFileUpload(Request $request, $device)
    {
        $validator = Validator::make($request->all(), [
            'sensor_file' => 'required|file|mimetypes:application/json,text/plain|max:10048',
        ]);

        if ($validator->fails()) {
            $this->logUpload($device->id, $request->file('sensor_file')?->getClientOriginalName(), 'failed', $validator->errors()->first(), $request->ip());

            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $file = $request->file('sensor_file');
        $fileName = $file->getClientOriginalName();
        $jsonContent = file_get_contents($file->getRealPath());
        $data = json_decode($jsonContent, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->logUpload($device->id, $fileName, 'failed', 'Invalid JSON format', $request->ip());

            return response()->json(['success' => false, 'message' => 'Invalid JSON format'], 400);
        }

        return $this->processPayload($data, $device, $fileName, $request->ip());
    }

    /**
     * Handle raw JSON body (application/json)
     */
    private function handleJsonBody(Request $request, $device)
    {
        $data = $request->json()->all();

        if (empty($data)) {
            return response()->json(['success' => false, 'message' => 'Empty or invalid JSON body'], 400);
        }

        return $this->processPayload($data, $device, 'raw-json-body', $request->ip());
    }

    /**
     * Process & persist payload.
     *
     * Supports two formats:
     *  1. Batch: { device_name, total_data, sensor_data: [ {...}, ... ] }
     *  2. Single: { device_name, datetime, pm25, ... }
     */
    private function processPayload(array $data, $device, string $fileName, string $ip)
    {
        // --- Validasi field wajib level atas ---
        $topValidator = Validator::make($data, [
            'device_name' => 'required|string',
        ]);

        if ($topValidator->fails()) {
            $this->logUpload($device->id, $fileName, 'failed', 'Missing device_name field', $ip);

            return response()->json([
                'success' => false,
                'message' => 'Missing device_name in JSON',
                'errors' => $topValidator->errors(),
            ], 422);
        }

        // --- Validasi device name match ---
        if ($data['device_name'] !== $device->device_code && $data['device_name'] !== $device->name) {
            $this->logUpload($device->id, $fileName, 'failed', "device_name '{$data['device_name']}' does not match device code '{$device->device_code}' or name '{$device->name}'", $ip);

            return response()->json([
                'success' => false,
                'message' => "Device name mismatch. Expected '{$device->device_code}' or '{$device->name}', got '{$data['device_name']}'.",
            ], 403);
        }

        // --- Tentukan mode: batch atau single ---
        $isBatch = isset($data['sensor_data']) && is_array($data['sensor_data']);

        $records = $isBatch
            ? $data['sensor_data']
            : [array_diff_key($data, array_flip(['device_name', 'total_data']))];

        if (empty($records)) {
            $this->logUpload($device->id, $fileName, 'failed', 'sensor_data array is empty', $ip);

            return response()->json(['success' => false, 'message' => 'sensor_data array is empty'], 422);
        }

        // --- Validasi setiap record ---
        $rowRules = [
            'datetime' => 'required|date_format:Y-m-d H:i:s',
            'pm25' => 'nullable|numeric',
            'pm10' => 'nullable|numeric',
            'pm1' => 'nullable|numeric',
            'gas_index' => 'nullable|numeric',
            'gps_lat' => 'nullable|numeric',
            'gps_lng' => 'nullable|numeric',
            'rain_status' => 'nullable|string',
            'air_pressure' => 'nullable|numeric',
            'temperature' => 'nullable|numeric',
            'humidity' => 'nullable|numeric',
            'battery_status' => 'nullable|numeric',
        ];

        foreach ($records as $index => $row) {
            $rowValidator = Validator::make($row, $rowRules);
            if ($rowValidator->fails()) {
                $errorMsg = "Row #{$index}: ".json_encode($rowValidator->errors()->all());
                $this->logUpload($device->id, $fileName, 'failed', $errorMsg, $ip);

                return response()->json([
                    'success' => false,
                    'message' => "Invalid data in row #{$index}",
                    'errors' => $rowValidator->errors(),
                ], 422);
            }
        }

        // --- Simpan semua records dalam satu transaksi ---
        try {
            $saved = [];

            DB::transaction(function () use ($records, $device, &$saved) {
                foreach ($records as $row) {
                    $saved[] = SensorData::updateOrCreate(
                        // Key unik: device_id + datetime (mencegah duplikat)
                        [
                            'device_id' => $device->id,
                            'datetime' => $row['datetime'],
                        ],
                        // Data yang di-insert/update
                        [
                            'pm25' => $row['pm25'] ?? null,
                            'pm10' => $row['pm10'] ?? null,
                            'pm1' => $row['pm1'] ?? null,
                            'gas_index' => $row['gas_index'] ?? null,
                            'gps_lat' => $row['gps_lat'] ?? null,
                            'gps_lng' => $row['gps_lng'] ?? null,
                            'rain_status' => $row['rain_status'] ?? null,
                            'air_pressure' => $row['air_pressure'] ?? null,
                            'temperature' => $row['temperature'] ?? null,
                            'humidity' => $row['humidity'] ?? null,
                            'battery_status' => $row['battery_status'] ?? null,
                        ]
                    );
                }
            });

            $this->logUpload($device->id, $fileName, 'success', null, $ip);

            // Update device status and last_seen_at
            $device->update([
                'status' => 'online',
                'last_seen_at' => now(),
            ]);

            // Check thresholds on latest record & trigger notifications if configured
            $latestSaved = end($saved);
            $alertTriggered = false;

            if ($latestSaved) {
                $thresholds = [
                    'PM2.5' => ['val' => $latestSaved->pm25, 'limit' => (float) SystemConfig::getValue('threshold_pm25', 100.0)],
                    'PM10' => ['val' => $latestSaved->pm10, 'limit' => (float) SystemConfig::getValue('threshold_pm10', 150.0)],
                    'MQ-135' => ['val' => $latestSaved->gas_index, 'limit' => (float) SystemConfig::getValue('threshold_mq135', 250.0)],
                ];

                foreach ($thresholds as $param => $check) {
                    if ($check['val'] !== null && (float) $check['val'] > $check['limit']) {
                        Alert::create([
                            'device_id' => $device->id,
                            'parameter' => $param,
                            'value' => (float) $check['val'],
                            'threshold' => $check['limit'],
                            'status' => 'active',
                            'notes' => "Automatic alert triggered on IoT upload ({$param}: {$check['val']} > {$check['limit']})",
                        ]);
                        $alertTriggered = true;
                    }
                }

                // Auto-dispatch telemetry notification if enabled in System Config
                $configs = SystemConfig::getAllConfigs();
                if (! empty($configs['autoNotifyOnUpload'])) {
                    $mode = $configs['autoNotifyMode'] ?? 'all';
                    if ($mode === 'all' || ($mode === 'threshold_only' && $alertTriggered)) {
                        try {
                            $title = $alertTriggered
                                ? '⚠️ PERINGATAN POLUSI & DATA TELEMETRI'
                                : 'LAPORAN TELEMETRI OTOMATIS (IOT SYNC)';
                            app(TelemetryNotificationService::class)->dispatchTelemetry('all', $device->id, $configs, $title);
                        } catch (\Throwable $notifyErr) {
                            Log::warning('Auto-notify telemetry failed: '.$notifyErr->getMessage());
                        }
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Data berhasil disimpan',
                'data' => [
                    'device_name' => $device->name,
                    'device_code' => $device->device_code,
                    'records_saved' => count($saved),
                    'mode' => $isBatch ? 'batch' : 'single',
                    'first_datetime' => $saved[0]->datetime->format('Y-m-d H:i:s'),
                    'last_datetime' => end($saved)->datetime->format('Y-m-d H:i:s'),
                ],
            ]);

        } catch (\Exception $e) {
            $this->logUpload($device->id, $fileName, 'failed', $e->getMessage(), $ip);

            return response()->json([
                'success' => false,
                'message' => 'Server error while saving data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function logUpload($deviceId, $fileName, $status, $errorMessage, $ip)
    {
        UploadLog::create([
            'device_id' => $deviceId,
            'file_name' => $fileName ?? 'unknown',
            'status' => $status,
            'error_message' => $errorMessage,
            'ip_address' => $ip,
        ]);
    }
}

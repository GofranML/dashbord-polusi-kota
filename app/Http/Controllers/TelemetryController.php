<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\SensorData;
use App\Models\Alert;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Response;

class TelemetryController extends Controller
{
    /**
     * Get welcome portal metrics (Public view)
     */
    public function welcome()
    {
        $devices = Device::all();
        $totalDevices = $devices->count();
        $activeDevices = $devices->where('status', 'online')->count();
        
        $activeAlerts = Alert::where('status', 'active')->count();

        // Get latest telemetry for each online/calibrating device
        $latestTelemetries = [];
        $pm25Sum = 0;
        $pm25Count = 0;

        foreach ($devices as $device) {
            $latest = SensorData::where('device_id', $device->id)
                ->orderBy('datetime', 'desc')
                ->first();

            if ($latest) {
                $latestTelemetries[] = [
                    'id' => $device->id,
                    'name' => $device->name,
                    'device_code' => $device->device_code,
                    'lat' => (double)$device->latitude,
                    'lng' => (double)$device->longitude,
                    'region' => $device->region,
                    'pm25' => (double)$latest->pm25,
                    'pm10' => (double)$latest->pm10,
                    'mq135' => (double)$latest->gas_index,
                    'humidity' => (double)$latest->humidity,
                    'pressure' => (double)$latest->air_pressure,
                    'rain' => $latest->rain_status,
                    'timestamp' => $latest->datetime->toIso8601String(),
                ];

                if ($device->status === 'online') {
                    $pm25Sum += $latest->pm25;
                    $pm25Count++;
                }
            }
        }

        // Calculate average city AQI based on PM2.5 (mock or simple index)
        $avgPm25 = $pm25Count > 0 ? round($pm25Sum / $pm25Count, 1) : 0;
        
        // Simple AQI logic based on US AQI for PM2.5
        $cityAqi = $this->calculateAqiFromPm25($avgPm25);

        // Get recent alerts
        $alerts = Alert::with('device')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'device_name' => $a->device->name,
                    'parameter' => $a->parameter,
                    'value' => $a->value,
                    'status' => $a->status,
                    'notes' => $a->notes,
                    'created_at' => $a->created_at->diffForHumans(),
                ];
            });

        // 24-hour chart trend data for Sudirman Tower A as default
        $sudirman = Device::where('name', 'Sudirman Tower A')->first();
        $trendData = [];
        if ($sudirman) {
            $trendData = SensorData::where('device_id', $sudirman->id)
                ->where('datetime', '>=', Carbon::now()->subHours(24))
                ->orderBy('datetime', 'asc')
                ->get()
                ->map(function ($log) {
                    return [
                        'time' => $log->datetime->format('H:i'),
                        'pm25' => $log->pm25,
                        'pm10' => $log->pm10,
                        'mq135' => $log->gas_index,
                        'humidity' => $log->humidity,
                    ];
                });
        }

        // General sensor cards values
        $sensorCards = [
            ['title' => 'PM2.5', 'value' => $avgPm25, 'unit' => 'µg/m³', 'status' => $this->getAqiStatusText($avgPm25), 'progress' => min(100, (int)($avgPm25 * 0.7)), 'battery' => 90, 'lastUpdate' => 'Just now'],
            ['title' => 'PM10', 'value' => round($avgPm25 * 0.65, 1), 'unit' => 'µg/m³', 'status' => $this->getAqiStatusText($avgPm25 * 0.6), 'progress' => min(100, (int)($avgPm25 * 0.5)), 'battery' => 92, 'lastUpdate' => 'Just now'],
            ['title' => 'MQ135', 'value' => round($avgPm25 * 2.8, 0), 'unit' => 'ppm', 'status' => $avgPm25 > 55 ? 'Tidak Sehat' : 'Baik', 'progress' => min(100, (int)($avgPm25 * 0.8)), 'battery' => 88, 'lastUpdate' => 'Just now'],
            ['title' => 'Humidity', 'value' => 64.5, 'unit' => '%', 'status' => 'Baik', 'progress' => 64, 'battery' => 95, 'lastUpdate' => 'Just now'],
            ['title' => 'Tekanan Udara', 'value' => 1011, 'unit' => 'hPa', 'status' => 'Baik', 'progress' => 50, 'battery' => 94, 'lastUpdate' => 'Just now'],
            ['title' => 'Status Hujan', 'value' => 'Cerah', 'unit' => '', 'status' => 'Baik', 'progress' => 0, 'battery' => 90, 'lastUpdate' => 'Just now'],
        ];

        return Inertia::render('welcome', [
            'mapNodes' => $latestTelemetries,
            'sensorData' => $sensorCards,
            'cityAqi' => $cityAqi,
            'activeAlertsCount' => $activeAlerts,
            'totalDevicesCount' => $totalDevices,
            'activeDevicesCount' => $activeDevices,
            'trendData' => $trendData,
            'alertsList' => $alerts,
        ]);
    }

    /**
     * Render the Full Maps view
     */
    public function maps()
    {
        $devices = Device::all();
        $latestTelemetries = [];

        foreach ($devices as $device) {
            $latest = SensorData::where('device_id', $device->id)
                ->orderBy('datetime', 'desc')
                ->first();

            if ($latest) {
                $latestTelemetries[] = [
                    'id' => $device->id,
                    'name' => $device->name,
                    'device_code' => $device->device_code,
                    'lat' => (double)$device->latitude,
                    'lng' => (double)$device->longitude,
                    'region' => $device->region,
                    'status' => $device->status,
                    'pm25' => (double)$latest->pm25,
                    'pm10' => (double)$latest->pm10,
                    'mq135' => (double)$latest->gas_index,
                    'humidity' => (double)$latest->humidity,
                    'pressure' => (double)$latest->air_pressure,
                    'rain' => $latest->rain_status,
                    'timestamp' => $latest->datetime->toIso8601String(),
                ];
            }
        }

        return Inertia::render('maps', [
            'mapNodes' => $latestTelemetries,
        ]);
    }

    /**
     * Render and load historical telemetry data filter page
     */
    public function history(Request $request)
    {
        $devices = Device::all(['id', 'name', 'device_code']);
        
        // Default filters
        $deviceId = $request->input('device_id', $devices->first()?->id);
        $startDate = $request->input('start_date', Carbon::now()->subDays(3)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->format('Y-m-d'));
        
        $query = SensorData::where('device_id', $deviceId)
            ->whereBetween('datetime', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay()
            ])
            ->orderBy('datetime', 'asc');

        $sensorDataLogs = $query->get();

        $chartData = $sensorDataLogs->map(function ($log) {
            return [
                'time' => $log->datetime->format('Y-m-d H:i'),
                'pm25' => $log->pm25,
                'pm10' => $log->pm10,
                'mq135' => $log->gas_index,
                'humidity' => $log->humidity,
                'pressure' => $log->air_pressure,
                'weather' => $log->rain_status,
            ];
        });

        return Inertia::render('dashboard/history', [
            'devices' => $devices,
            'selectedDeviceId' => (int)$deviceId,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'chartData' => $chartData,
        ]);
    }

    /**
     * Export CSV file
     */
    public function exportCsv(Request $request)
    {
        $deviceId = $request->input('device_id');
        $startDate = $request->input('start_date', Carbon::now()->subDays(7)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->format('Y-m-d'));

        $device = Device::findOrFail($deviceId);

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"sensor_history_{$device->device_code}.csv\"",
        ];

        $callback = function () use ($deviceId, $startDate, $endDate) {
            $file = fopen('php://output', 'w');
            
            // CSV Headers
            fputcsv($file, ['Timestamp', 'PM2.5 (ug/m3)', 'PM10 (ug/m3)', 'MQ-135 (ppm)', 'Humidity (%)', 'Pressure (hPa)', 'Weather']);

            SensorData::where('device_id', $deviceId)
                ->whereBetween('datetime', [
                    Carbon::parse($startDate)->startOfDay(),
                    Carbon::parse($endDate)->endOfDay()
                ])
                ->orderBy('datetime', 'asc')
                ->chunk(200, function ($logs) use ($file) {
                    foreach ($logs as $log) {
                        fputcsv($file, [
                            $log->datetime->toDateTimeString(),
                            $log->pm25,
                            $log->pm10,
                            $log->gas_index,
                            $log->humidity,
                            $log->air_pressure,
                            $log->rain_status,
                        ]);
                    }
                });

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    /**
     * Export Excel file
     */
    public function exportExcel(Request $request)
    {
        // Simple Excel file: Excel reads CSV files perfectly when named with .csv or streamed with proper excel headers.
        // We stream standard CSV with tab-separation or standard formatting, named .xls
        $deviceId = $request->input('device_id');
        $startDate = $request->input('start_date', Carbon::now()->subDays(7)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->format('Y-m-d'));

        $device = Device::findOrFail($deviceId);

        $headers = [
            'Content-Type' => 'application/vnd.ms-excel',
            'Content-Disposition' => "attachment; filename=\"sensor_history_{$device->device_code}.xls\"",
        ];

        $callback = function () use ($deviceId, $startDate, $endDate) {
            $file = fopen('php://output', 'w');
            
            // Excel-friendly Tab Separated Headers
            fwrite($file, "Timestamp\tPM2.5 (ug/m3)\tPM10 (ug/m3)\tMQ-135 (ppm)\tHumidity (%)\tPressure (hPa)\tWeather\n");

            SensorData::where('device_id', $deviceId)
                ->whereBetween('datetime', [
                    Carbon::parse($startDate)->startOfDay(),
                    Carbon::parse($endDate)->endOfDay()
                ])
                ->orderBy('datetime', 'asc')
                ->chunk(200, function ($logs) use ($file) {
                    foreach ($logs as $log) {
                        fwrite($file, sprintf(
                            "%s\t%s\t%s\t%s\t%s\t%s\t%s\n",
                            $log->datetime->toDateTimeString(),
                            $log->pm25,
                            $log->pm10,
                            $log->gas_index,
                            $log->humidity,
                            $log->air_pressure,
                            $log->rain_status
                        ));
                    }
                });

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    private function calculateAqiFromPm25($pm25)
    {
        if ($pm25 <= 12.0) {
            return round((50 - 0) / (12.0 - 0) * ($pm25 - 0) + 0);
        } elseif ($pm25 <= 35.4) {
            return round((100 - 51) / (35.4 - 12.1) * ($pm25 - 12.1) + 51);
        } elseif ($pm25 <= 55.4) {
            return round((150 - 101) / (55.4 - 35.5) * ($pm25 - 35.5) + 101);
        } elseif ($pm25 <= 150.4) {
            return round((200 - 151) / (150.4 - 55.5) * ($pm25 - 55.5) + 151);
        } else {
            return round((300 - 201) / (250.4 - 150.5) * ($pm25 - 150.5) + 201);
        }
    }

    private function getAqiStatusText($pm25)
    {
        if ($pm25 <= 12.0) return 'Baik';
        if ($pm25 <= 35.4) return 'Sedang';
        if ($pm25 <= 55.4) return 'Tidak Sehat';
        return 'Sangat Tidak Sehat';
    }
}

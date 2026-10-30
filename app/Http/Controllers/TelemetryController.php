<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\Device;
use App\Models\SensorData;
use App\Services\FuzzyService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class TelemetryController extends Controller
{
    protected $fuzzyService;

    public function __construct(FuzzyService $fuzzyService)
    {
        $this->fuzzyService = $fuzzyService;
    }

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
                $fuzzyResult = $this->fuzzyService->calculateHazard($latest->pm25, $latest->gas_index);
                $latestTelemetries[] = [
                    'id' => $device->id,
                    'name' => $device->name,
                    'device_code' => $device->device_code,
                    'lat' => (float) ($latest->gps_lat ?? $device->latitude),
                    'lng' => (float) ($latest->gps_lng ?? $device->longitude),
                    'region' => $device->region,
                    'pm25' => (float) $latest->pm25,
                    'pm10' => (float) $latest->pm10,
                    'pm1' => (float) $latest->pm1,
                    'mq135' => (float) $latest->gas_index,
                    'humidity' => (float) $latest->humidity,
                    'pressure' => (float) $latest->air_pressure,
                    'rain' => $latest->rain_status,
                    'timestamp' => $latest->datetime->toIso8601String(),
                    'fuzzy_score' => $fuzzyResult['score'],
                    'fuzzy_label' => $fuzzyResult['label'],
                    'fuzzy_color' => $fuzzyResult['color'],
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

        // Fetch all sensor data from the last 3 days for the interactive map
        $threeDaysAgo = Carbon::now()->subDays(3);
        $allSensorData = SensorData::with('device')
            ->where('datetime', '>=', $threeDaysAgo)
            ->orderBy('datetime', 'desc')
            ->get();

        $mapNodes = [];
        foreach ($allSensorData as $log) {
            if ($log->device) {
                $fuzzyResult = $this->fuzzyService->calculateHazard($log->pm25, $log->gas_index);
                $mapNodes[] = [
                    'id' => $log->id,
                    'device_id' => $log->device_id,
                    'name' => $log->device->name,
                    'device_code' => $log->device->device_code,
                    'lat' => (float) ($log->gps_lat ?? $log->device->latitude),
                    'lng' => (float) ($log->gps_lng ?? $log->device->longitude),
                    'region' => $log->device->region,
                    'status' => $log->device->status,
                    'pm25' => (float) $log->pm25,
                    'pm10' => (float) $log->pm10,
                    'pm1' => (float) $log->pm1,
                    'mq135' => (float) $log->gas_index,
                    'humidity' => (float) $log->humidity,
                    'pressure' => (float) $log->air_pressure,
                    'rain' => $log->rain_status,
                    'timestamp' => $log->datetime->toIso8601String(),
                    'fuzzy_score' => $fuzzyResult['score'],
                    'fuzzy_label' => $fuzzyResult['label'],
                    'fuzzy_color' => $fuzzyResult['color'],
                ];
            }
        }

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

        // 24-hour chart trend data for Kambang Iwak Park as default
        $sudirman = Device::where('name', 'Kambang Iwak Park')->first();
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

        // Calculate actual sensor averages from online devices
        $humiditySum = 0;
        $pressureSum = 0;
        $pm10Sum = 0;
        $pm1Sum = 0;
        $mq135Sum = 0;
        $rainyCount = 0;
        $totalOnlineCount = 0;

        foreach ($latestTelemetries as $telemetry) {
            $dev = $devices->firstWhere('id', $telemetry['id']);
            if ($dev && $dev->status === 'online') {
                $humiditySum += $telemetry['humidity'];
                $pressureSum += $telemetry['pressure'];
                $pm10Sum += $telemetry['pm10'];
                $pm1Sum += $telemetry['pm1'];
                $mq135Sum += $telemetry['mq135'];
                if ($telemetry['rain'] === 'Hujan' || $telemetry['rain'] === 'Gerimis') {
                    $rainyCount++;
                }
                $totalOnlineCount++;
            }
        }

        $avgHumidity = $totalOnlineCount > 0 ? round($humiditySum / $totalOnlineCount, 1) : 0;
        $avgPressure = $totalOnlineCount > 0 ? round($pressureSum / $totalOnlineCount, 1) : 0;
        $avgPm10 = $totalOnlineCount > 0 ? round($pm10Sum / $totalOnlineCount, 1) : 0;
        $avgPm1 = $totalOnlineCount > 0 ? round($pm1Sum / $totalOnlineCount, 1) : 0;
        $avgMq135 = $totalOnlineCount > 0 ? round($mq135Sum / $totalOnlineCount, 0) : 0;
        $weatherStatus = ($totalOnlineCount > 0 && ($rainyCount / $totalOnlineCount) > 0.3) ? 'Hujan' : 'Cerah';

        // General sensor cards values
        $sensorCards = [
            ['title' => 'PM2.5', 'value' => $avgPm25, 'unit' => 'µg/m³', 'status' => $this->getAqiStatusText($avgPm25), 'progress' => min(100, (int) ($avgPm25 * 100 / 250)), 'battery' => 90, 'lastUpdate' => 'Just now'],
            ['title' => 'PM10', 'value' => $avgPm10, 'unit' => 'µg/m³', 'status' => $this->getPm10StatusText($avgPm10), 'progress' => min(100, (int) ($avgPm10 * 100 / 430)), 'battery' => 92, 'lastUpdate' => 'Just now'],
            ['title' => 'PM1', 'value' => $avgPm1, 'unit' => 'µg/m³', 'status' => $this->getAqiStatusText($avgPm1), 'progress' => min(100, (int) ($avgPm1 * 100 / 250)), 'battery' => 91, 'lastUpdate' => 'Just now'],
            ['title' => 'MQ135', 'value' => $avgMq135, 'unit' => 'ppm', 'status' => $avgPm25 > 90 ? 'Rendah' : 'Baik', 'progress' => min(100, (int) ($avgPm25 * 0.8)), 'battery' => 88, 'lastUpdate' => 'Just now'],
            ['title' => 'Humidity', 'value' => $avgHumidity, 'unit' => '%', 'status' => 'Baik', 'progress' => min(100, (int) $avgHumidity), 'battery' => 95, 'lastUpdate' => 'Just now'],
            ['title' => 'Tekanan Udara', 'value' => $avgPressure, 'unit' => 'hPa', 'status' => 'Baik', 'progress' => 50, 'battery' => 94, 'lastUpdate' => 'Just now'],
            ['title' => 'Status Hujan', 'value' => $weatherStatus, 'unit' => '', 'status' => 'Baik', 'progress' => 0, 'battery' => 90, 'lastUpdate' => 'Just now'],
        ];

        // Calculate city highlights dynamically
        $bestDevice = null;
        $worstDevice = null;
        $lowestPm25 = 999999;
        $highestPm25 = -1;

        foreach ($latestTelemetries as $telemetry) {
            $dev = $devices->firstWhere('id', $telemetry['id']);
            if ($dev && $dev->status === 'online') {
                if ($telemetry['pm25'] < $lowestPm25) {
                    $lowestPm25 = $telemetry['pm25'];
                    $bestDevice = $telemetry['name'];
                }
                if ($telemetry['pm25'] > $highestPm25) {
                    $highestPm25 = $telemetry['pm25'];
                    $worstDevice = $telemetry['name'];
                }
            }
        }

        $aqiStatusText = $this->getAqiStatusText($avgPm25);

        $cityHighlights = [
            ['label' => 'Lokasi Udara Terbaik', 'val' => $bestDevice ?? 'Tidak Ada Data', 'color' => 'text-green-400'],
            ['label' => 'Polusi Tertinggi', 'val' => $worstDevice ?? 'Tidak Ada Data', 'color' => 'text-red-400'],
            ['label' => 'Rata-rata AQI Kota', 'val' => "{$cityAqi} ({$aqiStatusText})", 'color' => 'text-yellow-400'],
            ['label' => 'Status Cuaca', 'val' => $weatherStatus, 'color' => 'text-cyan-400'],
        ];

        return Inertia::render('welcome', [
            'mapNodes' => $mapNodes,
            'sensorData' => $sensorCards,
            'cityAqi' => $cityAqi,
            'activeAlertsCount' => $activeAlerts,
            'totalDevicesCount' => $totalDevices,
            'activeDevicesCount' => $activeDevices,
            'trendData' => $trendData,
            'alertsList' => $alerts,
            'cityHighlights' => $cityHighlights,
        ]);
    }

    /**
     * Render the Full Maps view
     */
    public function maps(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(3)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->format('Y-m-d'));

        $allSensorData = SensorData::with('device')
            ->whereBetween('datetime', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay(),
            ])
            ->orderBy('datetime', 'desc')
            ->get();

        $mapNodes = [];
        foreach ($allSensorData as $log) {
            if ($log->device) {
                $fuzzyResult = $this->fuzzyService->calculateHazard($log->pm25, $log->gas_index);
                $mapNodes[] = [
                    'id' => $log->id,
                    'device_id' => $log->device_id,
                    'name' => $log->device->name,
                    'device_code' => $log->device->device_code,
                    'lat' => (float) ($log->gps_lat ?? $log->device->latitude),
                    'lng' => (float) ($log->gps_lng ?? $log->device->longitude),
                    'region' => $log->device->region,
                    'status' => $log->device->status,
                    'pm25' => (float) $log->pm25,
                    'pm10' => (float) $log->pm10,
                    'pm1' => (float) $log->pm1,
                    'mq135' => (float) $log->gas_index,
                    'humidity' => (float) $log->humidity,
                    'pressure' => (float) $log->air_pressure,
                    'rain' => $log->rain_status,
                    'timestamp' => $log->datetime->toIso8601String(),
                    'fuzzy_score' => $fuzzyResult['score'],
                    'fuzzy_label' => $fuzzyResult['label'],
                    'fuzzy_color' => $fuzzyResult['color'],
                ];
            }
        }

        return Inertia::render('maps', [
            'mapNodes' => $mapNodes,
            'startDate' => $startDate,
            'endDate' => $endDate,
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
                Carbon::parse($endDate)->endOfDay(),
            ])
            ->orderBy('datetime', 'asc');

        $sensorDataLogs = $query->get();

        $chartData = $sensorDataLogs->map(function ($log) {
            return [
                'time' => $log->datetime->format('Y-m-d H:i'),
                'pm25' => $log->pm25,
                'pm10' => $log->pm10,
                'pm1' => $log->pm1,
                'mq135' => $log->gas_index,
                'humidity' => $log->humidity,
                'pressure' => $log->air_pressure,
                'weather' => $log->rain_status,
            ];
        });

        return Inertia::render('dashboard/history', [
            'devices' => $devices,
            'selectedDeviceId' => (int) $deviceId,
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
            fputcsv($file, ['Timestamp', 'PM2.5 (ug/m3)', 'PM10 (ug/m3)', 'PM1 (ug/m3)', 'MQ-135 (ppm)', 'Humidity (%)', 'Pressure (hPa)', 'Weather']);

            SensorData::where('device_id', $deviceId)
                ->whereBetween('datetime', [
                    Carbon::parse($startDate)->startOfDay(),
                    Carbon::parse($endDate)->endOfDay(),
                ])
                ->orderBy('datetime', 'asc')
                ->chunk(200, function ($logs) use ($file) {
                    foreach ($logs as $log) {
                        fputcsv($file, [
                            $log->datetime->toDateTimeString(),
                            $log->pm25,
                            $log->pm10,
                            $log->pm1,
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
            fwrite($file, "Timestamp\tPM2.5 (ug/m3)\tPM10 (ug/m3)\tPM1 (ug/m3)\tMQ-135 (ppm)\tHumidity (%)\tPressure (hPa)\tWeather\n");

            SensorData::where('device_id', $deviceId)
                ->whereBetween('datetime', [
                    Carbon::parse($startDate)->startOfDay(),
                    Carbon::parse($endDate)->endOfDay(),
                ])
                ->orderBy('datetime', 'asc')
                ->chunk(200, function ($logs) use ($file) {
                    foreach ($logs as $log) {
                        fwrite($file, sprintf(
                            "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n",
                            $log->datetime->toDateTimeString(),
                            $log->pm25,
                            $log->pm10,
                            $log->pm1,
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
        if ($pm25 <= 30) {
            return round((50 - 0) / (30 - 0) * ($pm25 - 0) + 0);
        } elseif ($pm25 <= 60) {
            return round((100 - 51) / (60 - 30) * ($pm25 - 30) + 51);
        } elseif ($pm25 <= 90) {
            return round((150 - 101) / (90 - 60) * ($pm25 - 60) + 101);
        } elseif ($pm25 <= 120) {
            return round((200 - 151) / (120 - 90) * ($pm25 - 90) + 151);
        } elseif ($pm25 <= 250) {
            return round((300 - 201) / (250 - 120) * ($pm25 - 120) + 201);
        } else {
            return round(min(500, (500 - 301) / (500 - 250) * ($pm25 - 250) + 301));
        }
    }

    private function getAqiStatusText($pm25)
    {
        if ($pm25 <= 30) {
            return 'Baik';
        }
        if ($pm25 <= 60) {
            return 'Memuaskan';
        }
        if ($pm25 <= 90) {
            return 'Sedang';
        }
        if ($pm25 <= 120) {
            return 'Rendah';
        }
        if ($pm25 <= 250) {
            return 'Sangat Rendah';
        }

        return 'Kritis';
    }

    private function getPm10StatusText($pm10)
    {
        if ($pm10 <= 50) {
            return 'Baik';
        }
        if ($pm10 <= 100) {
            return 'Memuaskan';
        }
        if ($pm10 <= 250) {
            return 'Sedang';
        }
        if ($pm10 <= 350) {
            return 'Rendah';
        }
        if ($pm10 <= 430) {
            return 'Sangat Rendah';
        }

        return 'Kritis';
    }
}

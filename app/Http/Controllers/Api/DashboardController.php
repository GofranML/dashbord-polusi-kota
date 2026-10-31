<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\SensorData;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function latest(Request $request)
    {
        $deviceId = $request->query('device_id');

        // 1. Efficiently query latest sensor data and device state to generate ETag & Last-Modified
        $sensorQuery = SensorData::query();
        if ($deviceId) {
            $sensorQuery->where('device_id', $deviceId);
        }
        $latestSensor = $sensorQuery->select('id', 'datetime')->orderBy('id', 'desc')->first();

        $deviceQuery = Device::query();
        if ($deviceId) {
            $deviceQuery->where('id', $deviceId);
        }
        $latestDevice = $deviceQuery->select('id', 'status', 'last_seen_at')->orderBy('last_seen_at', 'desc')->first();

        $latestTimestampStr = $latestSensor && $latestSensor->datetime
            ? Carbon::parse($latestSensor->datetime)->toIso8601String()
            : '1970-01-01T00:00:00Z';
        $latestDeviceSeen = $latestDevice && $latestDevice->last_seen_at
            ? Carbon::parse($latestDevice->last_seen_at)->toIso8601String()
            : '1970-01-01T00:00:00Z';

        // ETag is an MD5 hash of latest IDs and timestamps
        $etag = '"'.md5(
            ($deviceId ?? 'all').':'.
            ($latestSensor ? $latestSensor->id : 0).':'.
            $latestTimestampStr.':'.
            $latestDeviceSeen.':'.
            ($latestDevice ? $latestDevice->status : 'none')
        ).'"';

        $lastModified = $latestSensor && $latestSensor->datetime
            ? Carbon::parse($latestSensor->datetime)
            : Carbon::now();

        // 2. Conditional check for HTTP 304 Not Modified
        $clientEtag = $request->header('If-None-Match');
        $clientModifiedSince = $request->header('If-Modified-Since');

        $isEtagMatch = $clientEtag && (trim($clientEtag) === $etag || trim($clientEtag, '"') === trim($etag, '"'));
        $isTimeMatch = false;

        if ($clientModifiedSince) {
            try {
                $sinceDate = Carbon::parse($clientModifiedSince);
                if ($lastModified->lte($sinceDate)) {
                    $isTimeMatch = true;
                }
            } catch (\Exception $e) {
                $isTimeMatch = false;
            }
        }

        $headers = [
            'ETag' => $etag,
            'Last-Modified' => $lastModified->toRfc7231String(),
            'Cache-Control' => 'no-cache, private, must-revalidate',
        ];

        if ($isEtagMatch || $isTimeMatch) {
            return response('', 304, $headers);
        }

        // 3. Fetch data if changed or no cache headers
        $devicesQuery = Device::query();
        if ($deviceId) {
            $devicesQuery->where('id', $deviceId);
        }

        $devices = $devicesQuery->get()->map(function ($device) {
            return [
                'device' => [
                    'id' => $device->id,
                    'device_code' => $device->device_code,
                    'name' => $device->name,
                    'region' => $device->region,
                    'status' => $device->status,
                    'last_seen_at' => $device->last_seen_at,
                    'latitude' => $device->latitude,
                    'longitude' => $device->longitude,
                ],
                'latest_data' => SensorData::where('device_id', $device->id)
                    ->orderBy('datetime', 'desc')
                    ->first(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $devices,
        ], 200, $headers);
    }

    public function history(Request $request)
    {
        $query = SensorData::with('device')->orderBy('datetime', 'desc');

        if ($request->has('device_id')) {
            $query->where('device_id', $request->device_id);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('datetime', [
                $request->start_date.' 00:00:00',
                $request->end_date.' 23:59:59',
            ]);
        }

        $history = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $history,
        ]);
    }

    public function statistics(Request $request)
    {
        $deviceId = $request->device_id;
        $date = $request->date ?? Carbon::today()->toDateString();

        $query = SensorData::whereDate('datetime', $date);
        if ($deviceId) {
            $query->where('device_id', $deviceId);
        }

        $stats = [
            'pm25_avg' => $query->avg('pm25'),
            'pm10_avg' => $query->avg('pm10'),
            'temperature_avg' => $query->avg('temperature'),
            'humidity_avg' => $query->avg('humidity'),
            'total_readings' => $query->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    public function devices()
    {
        // Update offline status before returning
        $devices = Device::all();
        foreach ($devices as $device) {
            if ($device->last_seen_at && Carbon::parse($device->last_seen_at)->diffInMinutes(now()) > 5) {
                if ($device->status !== 'offline') {
                    $device->update(['status' => 'offline']);
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => $devices->map(function ($device) {
                return [
                    'id' => $device->id,
                    'name' => $device->name,
                    'status' => $device->status,
                    'last_seen_at' => $device->last_seen_at,
                    'is_online' => $device->status === 'online',
                ];
            }),
        ]);
    }

    public function allHistory(Request $request)
    {
        $query = SensorData::with('device')->orderBy('datetime', 'asc');

        if ($request->has('device_id')) {
            $query->where('device_id', $request->device_id);
        }

        $allData = $query->get();

        return response()->json([
            'success' => true,
            'count' => $allData->count(),
            'data' => $allData,
        ]);
    }
}

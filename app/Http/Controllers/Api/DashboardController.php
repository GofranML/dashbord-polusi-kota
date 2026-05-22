<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Device;
use App\Models\SensorData;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function latest()
    {
        // Get the latest data for all devices
        $devices = Device::all()->map(function ($device) {
            return [
                'device' => [
                    'id' => $device->id,
                    'name' => $device->name,
                    'status' => $device->status,
                    'last_seen_at' => $device->last_seen_at,
                ],
                'latest_data' => SensorData::where('device_id', $device->id)
                    ->orderBy('datetime', 'desc')
                    ->first()
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $devices
        ]);
    }

    public function history(Request $request)
    {
        $query = SensorData::with('device')->orderBy('datetime', 'desc');

        if ($request->has('device_id')) {
            $query->where('device_id', $request->device_id);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('datetime', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        }

        $history = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $history
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
            'total_readings' => $query->count()
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
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
                    'is_online' => $device->status === 'online'
                ];
            })
        ]);
    }
}

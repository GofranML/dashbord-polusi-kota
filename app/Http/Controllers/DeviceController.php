<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DeviceController extends Controller
{
    /**
     * Render the Device Management Panel
     */
    public function index()
    {
        $devices = Device::all()->map(function ($device) {
            return [
                'id' => $device->id,
                'device_code' => $device->device_code,
                'name' => $device->name,
                'api_token' => $device->api_token,
                'lat' => (float) $device->latitude,
                'lng' => (float) $device->longitude,
                'region' => $device->region,
                'status' => $device->status, // online, offline, calibrating
                'battery_voltage' => (float) $device->battery_voltage,
                'last_seen_at' => $device->last_seen_at?->toIso8601String(),
                'created_at' => $device->created_at->toIso8601String(),
            ];
        });

        return Inertia::render('dashboard/admin/devices', [
            'devicesList' => $devices,
        ]);
    }

    /**
     * Add a new device/sensor node
     */
    public function store(Request $request)
    {
        $request->validate([
            'device_code' => 'required|string|unique:devices|max:50',
            'name' => 'required|string|max:100',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'region' => 'required|string|max:100',
            'status' => 'required|string|in:online,offline,calibrating',
        ]);

        $device = Device::create([
            'device_code' => $request->device_code,
            'name' => $request->name,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'region' => $request->region,
            'status' => $request->status,
            'battery_voltage' => 4.2, // standard new battery
            'last_seen_at' => now(),
        ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Device Management',
            'description' => "Initialized and registered new IoT sensor: {$device->device_code} - {$device->name}.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Sensor initialized successfully.');
    }

    /**
     * Update sensor node configurations
     */
    public function update(Request $request, $id)
    {
        $device = Device::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'region' => 'required|string|max:100',
            'status' => 'required|string|in:online,offline,calibrating',
        ]);

        $device->update([
            'name' => $request->name,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'region' => $request->region,
            'status' => $request->status,
        ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Device Management',
            'description' => "Updated configurations for IoT sensor: {$device->device_code} ({$device->name}).",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Sensor settings updated successfully.');
    }

    /**
     * Delete a device node from registry
     */
    public function destroy($id)
    {
        $device = Device::findOrFail($id);
        $code = $device->device_code;
        $name = $device->name;
        $device->delete();

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Device Management',
            'description' => "De-registered and deleted sensor node: {$code} - {$name}.",
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Sensor node deleted.');
    }

    /**
     * Generate or regenerate the API token for the device
     */
    public function generateToken($id)
    {
        $device = Device::findOrFail($id);

        $newToken = Str::random(60);
        $device->api_token = $newToken;
        $device->save();

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Device Token Generated',
            'description' => "Generated new API Token for sensor {$device->device_code} ({$device->name}).",
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return redirect()->back()->with('success', 'New API Token generated successfully.');
    }
}

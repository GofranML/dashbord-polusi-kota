<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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
                'lat' => (double)$device->latitude,
                'lng' => (double)$device->longitude,
                'region' => $device->region,
                'status' => $device->status, // online, offline, calibrating
                'battery_voltage' => (double)$device->battery_voltage,
                'signal_strength' => (int)$device->signal_strength,
                'calibration_factor' => (double)$device->calibration_factor,
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
            'signal_strength' => -50,  // standard signal
            'calibration_factor' => 1.0,
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
     * Calibrate the sensor factor offset
     */
    public function calibrate(Request $request, $id)
    {
        $device = Device::findOrFail($id);

        $request->validate([
            'calibration_factor' => 'required|numeric|between:0.1,5.0',
        ]);

        $oldFactor = $device->calibration_factor;
        $device->calibration_factor = $request->input('calibration_factor');
        $device->save();

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Device Calibration',
            'description' => "Calibrated sensor {$device->device_code}. Factor offset adjusted from {$oldFactor} to {$device->calibration_factor}.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Calibration parameters saved successfully.');
    }
}

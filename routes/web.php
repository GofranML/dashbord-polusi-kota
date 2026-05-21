<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\TelemetryController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\TechnicianController;
use Inertia\Inertia;

// Public Views
Route::get('/', [TelemetryController::class, 'welcome'])->name('home');
Route::get('/maps', [TelemetryController::class, 'maps'])->name('maps');

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Core Dashboard Route (passes real DB metrics)
    Route::get('dashboard', function () {
        $devices = \App\Models\Device::all();
        $totalDevices = $devices->count();
        $activeDevices = $devices->where('status', 'online')->count();
        $activeAlerts = \App\Models\Alert::where('status', 'active')->count();
        
        $latestTelemetries = [];
        foreach ($devices as $device) {
            $latest = \App\Models\TelemetryLog::where('device_id', $device->id)
                ->orderBy('created_at', 'desc')
                ->first();
            if ($latest) {
                $latestTelemetries[] = [
                    'id' => $device->id,
                    'device_code' => $device->device_code,
                    'name' => $device->name,
                    'region' => $device->region,
                    'pm25' => (double)$latest->pm25,
                    'pm10' => (double)$latest->pm10,
                    'mq135' => (double)$latest->mq135,
                    'status' => $device->status,
                ];
            }
        }

        return Inertia::render('dashboard', [
            'latestTelemetries' => $latestTelemetries,
            'totalDevicesCount' => $totalDevices,
            'activeDevicesCount' => $activeDevices,
            'activeAlertsCount' => $activeAlerts,
        ]);
    })->name('dashboard');

    // Historical Telemetry Data Filter
    Route::get('dashboard/history', [TelemetryController::class, 'history'])->name('dashboard.history');
    Route::get('dashboard/export/csv', [TelemetryController::class, 'exportCsv'])->name('dashboard.export.csv');
    Route::get('dashboard/export/excel', [TelemetryController::class, 'exportExcel'])->name('dashboard.export.excel');

    // Alerts Panel
    Route::get('dashboard/alerts', [AlertController::class, 'index'])->name('dashboard.alerts');
    Route::post('dashboard/alerts/{id}/ack', [AlertController::class, 'acknowledge'])->name('dashboard.alerts.ack');
    Route::post('dashboard/alerts/{id}/resolve', [AlertController::class, 'resolve'])->name('dashboard.alerts.resolve');
    Route::post('dashboard/alerts/thresholds', [AlertController::class, 'updateThresholds'])->name('dashboard.alerts.thresholds');

    // Technician Routes
    Route::get('dashboard/technician/tickets', [TechnicianController::class, 'tickets'])->name('dashboard.technician.tickets');
    Route::post('dashboard/technician/tickets', [TechnicianController::class, 'storeTicket'])->name('dashboard.technician.tickets.store');
    Route::post('dashboard/technician/tickets/{id}/update', [TechnicianController::class, 'updateTicket'])->name('dashboard.technician.tickets.update');
    Route::get('dashboard/technician/health', [TechnicianController::class, 'health'])->name('dashboard.technician.health');

    // Admin Group
    Route::get('dashboard/admin/users', [AdminController::class, 'users'])->name('dashboard.admin.users');
    Route::post('dashboard/admin/users', [AdminController::class, 'storeUser'])->name('dashboard.admin.users.store');
    Route::post('dashboard/admin/users/{id}/update', [AdminController::class, 'updateUser'])->name('dashboard.admin.users.update');
    Route::delete('dashboard/admin/users/{id}', [AdminController::class, 'destroyUser'])->name('dashboard.admin.users.delete');

    Route::get('dashboard/admin/devices', [DeviceController::class, 'index'])->name('dashboard.admin.devices');
    Route::post('dashboard/admin/devices', [DeviceController::class, 'store'])->name('dashboard.admin.devices.store');
    Route::post('dashboard/admin/devices/{id}/update', [DeviceController::class, 'update'])->name('dashboard.admin.devices.update');
    Route::delete('dashboard/admin/devices/{id}', [DeviceController::class, 'destroy'])->name('dashboard.admin.devices.delete');
    Route::post('dashboard/admin/devices/{id}/calibrate', [DeviceController::class, 'calibrate'])->name('dashboard.admin.devices.calibrate');

    Route::get('dashboard/admin/config', [AdminController::class, 'config'])->name('dashboard.admin.config');
    Route::post('dashboard/admin/config', [AdminController::class, 'updateConfig'])->name('dashboard.admin.config.update');

    Route::get('dashboard/admin/security', [AdminController::class, 'security'])->name('dashboard.admin.security');
    Route::post('dashboard/admin/security/whitelist', [AdminController::class, 'updateIpWhitelist'])->name('dashboard.admin.security.whitelist');
    Route::get('dashboard/admin/security/backup', [AdminController::class, 'downloadBackup'])->name('dashboard.admin.security.backup');
});

require __DIR__.'/settings.php';

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
    Route::get('dashboard', function (\App\Services\FuzzyService $fuzzyService) {
        $devices = \App\Models\Device::all();
        $totalDevices = $devices->count();
        $activeDevices = $devices->where('status', 'online')->count();
        $activeAlerts = \App\Models\Alert::where('status', 'active')->count();
        
        $latestTelemetries = [];
        foreach ($devices as $device) {
            $latest = \App\Models\SensorData::where('device_id', $device->id)
                ->orderBy('datetime', 'desc')
                ->first();
            if ($latest) {
                $fuzzyResult = $fuzzyService->calculateHazard($latest->pm25, $latest->gas_index);
                $latestTelemetries[] = [
                    'id' => $device->id,
                    'device_code' => $device->device_code,
                    'name' => $device->name,
                    'region' => $device->region,
                    'pm25' => (double)$latest->pm25,
                    'pm10' => (double)$latest->pm10,
                    'pm1' => (double)$latest->pm1,
                    'mq135' => (double)$latest->gas_index,
                    'humidity' => (double)$latest->humidity,
                    'pressure' => (double)$latest->air_pressure,
                    'rain' => $latest->rain_status,
                    'status' => $device->status,
                    'fuzzy_score' => $fuzzyResult['score'],
                    'fuzzy_label' => $fuzzyResult['label'],
                    'fuzzy_color' => $fuzzyResult['color'],
                ];
            }
        }

        // Fetch 24-hour chart trend data for default device
        $defaultDevice = $devices->first();
        $trendData = [];
        if ($defaultDevice) {
            $trendData = \App\Models\SensorData::where('device_id', $defaultDevice->id)
                ->where('datetime', '>=', \Carbon\Carbon::now()->subHours(24))
                ->orderBy('datetime', 'asc')
                ->get()
                ->map(function ($log) {
                    return [
                        'time' => $log->datetime->format('H:i'),
                        'pm25' => (double)$log->pm25,
                        'pm10' => (double)$log->pm10,
                        'pm1' => (double)$log->pm1,
                        'mq135' => (double)$log->gas_index,
                        'humidity' => (double)$log->humidity,
                    ];
                })->toArray();
        }

        // Fetch actual system users
        $systemUsers = \App\Models\User::orderBy('name', 'asc')
            ->take(5)
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'role' => $u->role,
                    'email' => $u->email,
                ];
            })->toArray();

        return Inertia::render('dashboard', [
            'latestTelemetries' => $latestTelemetries,
            'totalDevicesCount' => $totalDevices,
            'activeDevicesCount' => $activeDevices,
            'activeAlertsCount' => $activeAlerts,
            'trendData' => $trendData,
            'systemUsers' => $systemUsers,
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

    Route::post('dashboard/admin/devices/{id}/token', [DeviceController::class, 'generateToken'])->name('dashboard.admin.devices.token');

    Route::get('dashboard/admin/config', [AdminController::class, 'config'])->name('dashboard.admin.config');
    Route::post('dashboard/admin/config', [AdminController::class, 'updateConfig'])->name('dashboard.admin.config.update');

    Route::get('dashboard/admin/security', [AdminController::class, 'security'])->name('dashboard.admin.security');
    Route::post('dashboard/admin/security/whitelist', [AdminController::class, 'updateIpWhitelist'])->name('dashboard.admin.security.whitelist');
    Route::get('dashboard/admin/security/backup', [AdminController::class, 'downloadBackup'])->name('dashboard.admin.security.backup');

    Route::get('dashboard/admin/api-docs', [AdminController::class, 'apiDocs'])->name('dashboard.admin.api-docs');
});

require __DIR__.'/settings.php';

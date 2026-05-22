<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\IotDataController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Middleware\IotDeviceAuth;

// IoT Device routes
Route::middleware([IotDeviceAuth::class, 'throttle:60,1'])->group(function () {
    Route::post('/iot/upload', [IotDataController::class, 'upload']);
});

// Dashboard routes (can be public or protected by user auth later)
Route::prefix('dashboard')->group(function () {
    Route::get('/latest', [DashboardController::class, 'latest']);
    Route::get('/history', [DashboardController::class, 'history']);
    Route::get('/statistics', [DashboardController::class, 'statistics']);
});

// Devices monitoring route
Route::get('/devices', [DashboardController::class, 'devices']);

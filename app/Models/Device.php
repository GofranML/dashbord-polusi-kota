<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Device extends Model
{
    protected $fillable = [
        'device_code',
        'name',
        'api_token',
        'latitude',
        'longitude',
        'region',
        'status',
        'battery_voltage',
        'signal_strength',
        'calibration_factor',
        'last_seen_at',
    ];

    protected $hidden = [
        'api_token',
    ];

    protected $casts = [
        'latitude' => 'double',
        'longitude' => 'double',
        'battery_voltage' => 'double',
        'signal_strength' => 'integer',
        'calibration_factor' => 'double',
        'last_seen_at' => 'datetime',
    ];

    public function telemetries(): HasMany
    {
        return $this->hasMany(TelemetryLog::class);
    }

    public function alerts(): HasMany
    {
        return $this->hasMany(Alert::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(MaintenanceTicket::class);
    }
}

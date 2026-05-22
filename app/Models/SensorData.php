<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SensorData extends Model
{
    protected $table = 'sensor_data';

    protected $fillable = [
        'device_id',
        'datetime',
        'pm25',
        'pm10',
        'pm1',
        'gas_index',
        'gps_lat',
        'gps_lng',
        'rain_status',
        'air_pressure',
        'temperature',
        'humidity',
        'battery_status',
    ];

    protected $casts = [
        'datetime' => 'datetime',
        'pm25' => 'float',
        'pm10' => 'float',
        'pm1' => 'float',
        'gas_index' => 'integer',
        'gps_lat' => 'decimal:7',
        'gps_lng' => 'decimal:7',
        'air_pressure' => 'float',
        'temperature' => 'float',
        'humidity' => 'float',
        'battery_status' => 'float',
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TelemetryLog extends Model
{
    // Disabling updated_at since it's a history log table
    public $timestamps = false;

    protected $fillable = [
        'device_id',
        'pm25',
        'pm10',
        'mq135',
        'humidity',
        'pressure',
        'weather',
        'created_at',
    ];

    protected $casts = [
        'pm25' => 'double',
        'pm10' => 'double',
        'mq135' => 'double',
        'humidity' => 'double',
        'pressure' => 'double',
        'created_at' => 'datetime',
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}

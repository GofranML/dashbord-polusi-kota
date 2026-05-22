<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UploadLog extends Model
{
    protected $table = 'upload_logs';

    protected $fillable = [
        'device_id',
        'file_name',
        'status',
        'error_message',
        'ip_address',
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}

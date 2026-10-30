<?php

use App\Services\TelemetryNotificationService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('telemetry:send {channel=all : Channel target (all, telegram, whatsapp, email)} {--device= : Optional device ID}', function (TelemetryNotificationService $service) {
    $channel = (string) $this->argument('channel');
    $deviceId = $this->option('device') ? (int) $this->option('device') : null;

    $result = $service->dispatchTelemetry($channel, $deviceId, null, 'LAPORAN TELEMETRI TERJADWAL POLLUTRACK');

    foreach ($result['results'] as $ch => $res) {
        if (! empty($res['success'])) {
            $this->info("[{$ch}] {$res['message']}");
        } else {
            $this->error("[{$ch}] {$res['message']}");
        }
    }
})->purpose('Send latest telemetry data to configured notification channels (Telegram, WhatsApp, Email)');

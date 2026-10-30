<?php

namespace App\Services;

use App\Models\Alert;
use App\Models\AuditLog;
use App\Models\Device;
use App\Models\SensorData;
use App\Models\SystemConfig;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class TelemetryNotificationService
{
    protected FuzzyService $fuzzyService;

    public function __construct(FuzzyService $fuzzyService)
    {
        $this->fuzzyService = $fuzzyService;
    }

    /**
     * Gather the latest telemetry snapshot for all devices or a specific device.
     */
    public function getTelemetrySnapshot(?int $deviceId = null): array
    {
        $devicesQuery = Device::query();
        if ($deviceId) {
            $devicesQuery->where('id', $deviceId);
        }
        $devices = $devicesQuery->get();

        $allDevicesData = [];
        $telemetries = [];

        $pm25Sum = 0;
        $pm10Sum = 0;
        $pm1Sum = 0;
        $mq135Sum = 0;
        $humiditySum = 0;
        $tempSum = 0;
        $pressureSum = 0;
        $dataCount = 0;

        foreach ($devices as $device) {
            $latest = SensorData::where('device_id', $device->id)
                ->orderBy('datetime', 'desc')
                ->first();

            if ($latest) {
                $pm25 = (float) ($latest->pm25 ?? 0);
                $pm10 = (float) ($latest->pm10 ?? 0);
                $pm1 = (float) ($latest->pm1 ?? 0);
                $mq135 = (float) ($latest->gas_index ?? 0);
                $humidity = (float) ($latest->humidity ?? 0);
                $temperature = (float) ($latest->temperature ?? 0);
                $pressure = (float) ($latest->air_pressure ?? 0);
                $rain = $latest->rain_status ?? 'Tidak Hujan';

                $fuzzyResult = $this->fuzzyService->calculateHazard($pm25, $mq135);

                $item = [
                    'device_id' => $device->id,
                    'device_code' => $device->device_code,
                    'device_name' => $device->name,
                    'region' => $device->region,
                    'status' => $device->status,
                    'has_data' => true,
                    'datetime' => $latest->datetime->format('Y-m-d H:i:s'),
                    'pm25' => round($pm25, 1),
                    'pm10' => round($pm10, 1),
                    'pm1' => round($pm1, 1),
                    'mq135' => round($mq135, 1),
                    'temperature' => round($temperature, 1),
                    'humidity' => round($humidity, 1),
                    'pressure' => round($pressure, 1),
                    'rain_status' => $rain,
                    'battery_status' => $latest->battery_status ?? $device->battery_voltage,
                    'fuzzy_score' => $fuzzyResult['score'],
                    'fuzzy_label' => $fuzzyResult['label'],
                    'fuzzy_color' => $fuzzyResult['color'],
                ];

                $telemetries[] = $item;
                $allDevicesData[] = $item;

                $pm25Sum += $pm25;
                $pm10Sum += $pm10;
                $pm1Sum += $pm1;
                $mq135Sum += $mq135;
                $humiditySum += $humidity;
                $tempSum += $temperature;
                $pressureSum += $pressure;
                $dataCount++;
            } else {
                $allDevicesData[] = [
                    'device_id' => $device->id,
                    'device_code' => $device->device_code,
                    'device_name' => $device->name,
                    'region' => $device->region,
                    'status' => $device->status,
                    'has_data' => false,
                    'datetime' => null,
                    'pm25' => null,
                    'pm10' => null,
                    'pm1' => null,
                    'mq135' => null,
                    'temperature' => null,
                    'humidity' => null,
                    'pressure' => null,
                    'rain_status' => null,
                    'battery_status' => $device->battery_voltage,
                    'fuzzy_score' => null,
                    'fuzzy_label' => 'Belum Ada Data',
                    'fuzzy_color' => 'gray',
                ];
            }
        }

        $avgPm25 = $dataCount > 0 ? round($pm25Sum / $dataCount, 1) : 0;
        $avgMq135 = $dataCount > 0 ? round($mq135Sum / $dataCount, 1) : 0;
        $overallFuzzy = $this->fuzzyService->calculateHazard($avgPm25, $avgMq135);

        return [
            'generated_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'devices' => $allDevicesData,
            'telemetries' => $telemetries,
            'summary' => [
                'total_devices' => $devices->count(),
                'devices_with_data' => $dataCount,
                'active_alerts' => Alert::where('status', 'active')->count(),
                'avg_pm25' => $avgPm25,
                'avg_pm10' => $dataCount > 0 ? round($pm10Sum / $dataCount, 1) : 0,
                'avg_pm1' => $dataCount > 0 ? round($pm1Sum / $dataCount, 1) : 0,
                'avg_mq135' => $avgMq135,
                'avg_temperature' => $dataCount > 0 ? round($tempSum / $dataCount, 1) : 0,
                'avg_humidity' => $dataCount > 0 ? round($humiditySum / $dataCount, 1) : 0,
                'avg_pressure' => $dataCount > 0 ? round($pressureSum / $dataCount, 1) : 0,
                'overall_fuzzy_score' => $overallFuzzy['score'],
                'overall_fuzzy_label' => $overallFuzzy['label'],
            ],
        ];
    }

    /**
     * Format HTML message for Telegram Bot API.
     */
    public function formatTelegramMessage(array $snapshot, string $title = 'LAPORAN TELEMETRI POLLUTRACK'): string
    {
        $lines = [];
        $lines[] = '📡 <b>'.htmlspecialchars($title).'</b>';
        $lines[] = '🕒 Waktu Kirim: <code>'.$snapshot['generated_at'].'</code>';
        $lines[] = '━━━━━━━━━━━━━━━━━━━━━━';

        $telemetries = $snapshot['telemetries'] ?? [];

        if (empty($telemetries)) {
            $lines[] = '⚠️ <i>Belum ada data sensor telemetri yang tersimpan pada perangkat yang dipilih.</i>';
        } else {
            foreach ($telemetries as $t) {
                $name = htmlspecialchars($t['device_name']);
                $code = htmlspecialchars($t['device_code']);
                $region = htmlspecialchars($t['region'] ?? '-');
                $rain = htmlspecialchars((string) ($t['rain_status'] ?? '-'));
                $label = htmlspecialchars((string) ($t['fuzzy_label'] ?? '-'));

                $lines[] = "📍 <b>{$name}</b> (<code>{$code}</code>)";
                $lines[] = "• Wilayah: {$region}";
                $lines[] = "• Waktu Data: <code>{$t['datetime']}</code>";
                $lines[] = "• PM2.5: <b>{$t['pm25']} µg/m³</b> | PM10: <b>{$t['pm10']} µg/m³</b> | PM1: <b>{$t['pm1']} µg/m³</b>";
                $lines[] = "• Gas (MQ-135): <b>{$t['mq135']} ppm</b>";
                $lines[] = "• Suhu: <b>{$t['temperature']} °C</b> | Kelembapan: <b>{$t['humidity']}%</b>";
                $lines[] = "• Tekanan Udara: <b>{$t['pressure']} hPa</b> | Cuaca: <b>{$rain}</b>";
                $lines[] = "• Status Bahaya (Fuzzy): <b>{$t['fuzzy_score']}% ({$label})</b>";
                $lines[] = '──────────────────────';
            }

            $sum = $snapshot['summary'];
            $lines[] = '📊 <b>RINGKASAN RATA-RATA KOTA</b>';
            $lines[] = "• Rata-rata PM2.5: <b>{$sum['avg_pm25']} µg/m³</b> | PM10: <b>{$sum['avg_pm10']} µg/m³</b>";
            $lines[] = "• Rata-rata MQ-135: <b>{$sum['avg_mq135']} ppm</b>";
            $lines[] = "• Status Kualitas Udara: <b>{$sum['overall_fuzzy_label']} ({$sum['overall_fuzzy_score']}%)</b>";
            $lines[] = "• Alert Aktif: <b>{$sum['active_alerts']}</b>";
        }

        return implode("\n", $lines);
    }

    /**
     * Format plain/WhatsApp markdown message.
     */
    public function formatWhatsAppMessage(array $snapshot, string $title = 'LAPORAN TELEMETRI POLLUTRACK'): string
    {
        $lines = [];
        $lines[] = "📡 *{$title}*";
        $lines[] = "🕒 Waktu Kirim: {$snapshot['generated_at']}";
        $lines[] = '━━━━━━━━━━━━━━━━━━━━━━';

        $telemetries = $snapshot['telemetries'] ?? [];

        if (empty($telemetries)) {
            $lines[] = '⚠️ _Belum ada data sensor telemetri pada perangkat yang dipilih._';
        } else {
            foreach ($telemetries as $t) {
                $lines[] = "📍 *{$t['device_name']}* ({$t['device_code']})";
                $lines[] = "• Wilayah: {$t['region']}";
                $lines[] = "• Waktu Data: {$t['datetime']}";
                $lines[] = "• PM2.5: *{$t['pm25']} µg/m³* | PM10: *{$t['pm10']} µg/m³* | PM1: *{$t['pm1']} µg/m³*";
                $lines[] = "• Gas (MQ-135): *{$t['mq135']} ppm*";
                $lines[] = "• Suhu: *{$t['temperature']} °C* | Kelembapan: *{$t['humidity']}%*";
                $lines[] = "• Tekanan: *{$t['pressure']} hPa* | Cuaca: *{$t['rain_status']}*";
                $lines[] = "• Indeks Fuzzy: *{$t['fuzzy_score']}% ({$t['fuzzy_label']})*";
                $lines[] = '──────────────────────';
            }

            $sum = $snapshot['summary'];
            $lines[] = '📊 *RINGKASAN KOTA*';
            $lines[] = "• Rata-rata PM2.5: *{$sum['avg_pm25']} µg/m³* | PM10: *{$sum['avg_pm10']} µg/m³*";
            $lines[] = "• Rata-rata MQ-135: *{$sum['avg_mq135']} ppm*";
            $lines[] = "• Status Udara: *{$sum['overall_fuzzy_label']} ({$sum['overall_fuzzy_score']}%)*";
            $lines[] = "• Alert Aktif: *{$sum['active_alerts']}*";
        }

        return implode("\n", $lines);
    }

    /**
     * Format HTML Email content for Telemetry Report.
     */
    public function formatEmailHtml(array $snapshot, string $title = 'Laporan Data Telemetri Kualitas Udara PolluTrack'): string
    {
        $telemetries = $snapshot['telemetries'] ?? [];
        $sum = $snapshot['summary'];

        $rowsHtml = '';
        if (empty($telemetries)) {
            $rowsHtml = '<tr><td colspan="10" style="padding:16px;text-align:center;color:#9ca3af;">Belum ada data telemetri pada perangkat yang dipilih.</td></tr>';
        } else {
            foreach ($telemetries as $t) {
                $rowsHtml .= sprintf(
                    '<tr style="border-bottom:1px solid #1f2937;">
                        <td style="padding:10px;font-weight:bold;color:#f9fafb;">%s<br><span style="font-size:11px;color:#9ca3af;">%s (%s)</span></td>
                        <td style="padding:10px;color:#d1d5db;font-size:12px;">%s</td>
                        <td style="padding:10px;color:#38bdf8;font-weight:bold;">%s µg/m³</td>
                        <td style="padding:10px;color:#c084fc;">%s µg/m³</td>
                        <td style="padding:10px;color:#818cf8;">%s µg/m³</td>
                        <td style="padding:10px;color:#fb923c;font-weight:bold;">%s ppm</td>
                        <td style="padding:10px;color:#d1d5db;">%s °C / %s%%</td>
                        <td style="padding:10px;color:#d1d5db;">%s hPa</td>
                        <td style="padding:10px;color:#d1d5db;">%s</td>
                        <td style="padding:10px;font-weight:bold;color:#facc15;">%s%% (%s)</td>
                    </tr>',
                    htmlspecialchars($t['device_name']),
                    htmlspecialchars($t['device_code']),
                    htmlspecialchars($t['region'] ?? '-'),
                    htmlspecialchars($t['datetime']),
                    $t['pm25'],
                    $t['pm10'],
                    $t['pm1'],
                    $t['mq135'],
                    $t['temperature'],
                    $t['humidity'],
                    $t['pressure'],
                    htmlspecialchars((string) ($t['rain_status'] ?? '-')),
                    $t['fuzzy_score'],
                    htmlspecialchars((string) ($t['fuzzy_label'] ?? '-'))
                );
            }
        }

        return <<<HTML
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>{$title}</title>
        </head>
        <body style="margin:0;padding:24px;background-color:#090d16;color:#f9fafb;font-family:Segoe UI,Arial,sans-serif;">
            <div style="max-width:900px;margin:0 auto;background-color:#111827;border:1px solid #1f2937;border-radius:16px;padding:24px;">
                <h2 style="margin-top:0;color:#22d3ee;letter-spacing:1px;">📡 {$title}</h2>
                <p style="color:#9ca3af;font-size:13px;margin-bottom:20px;">
                    Waktu Pengiriman: <strong>{$snapshot['generated_at']}</strong> |
                    Status Udara Rata-Rata: <strong>{$sum['overall_fuzzy_label']} ({$sum['overall_fuzzy_score']}%)</strong> |
                    Alert Aktif: <strong>{$sum['active_alerts']}</strong>
                </p>

                <div style="overflow-x:auto;">
                    <table style="width:100%;border-collapse:collapse;font-size:13px;text-align:left;">
                        <thead>
                            <tr style="background-color:#1f2937;color:#9ca3af;text-transform:uppercase;font-size:11px;">
                                <th style="padding:10px;">Perangkat</th>
                                <th style="padding:10px;">Waktu Data</th>
                                <th style="padding:10px;">PM2.5</th>
                                <th style="padding:10px;">PM10</th>
                                <th style="padding:10px;">PM1</th>
                                <th style="padding:10px;">MQ-135</th>
                                <th style="padding:10px;">Suhu / Hum</th>
                                <th style="padding:10px;">Tekanan</th>
                                <th style="padding:10px;">Cuaca</th>
                                <th style="padding:10px;">Fuzzy Hazard</th>
                            </tr>
                        </thead>
                        <tbody>
                            {$rowsHtml}
                        </tbody>
                    </table>
                </div>

                <p style="margin-top:24px;font-size:11px;color:#6b7280;border-top:1px solid #1f2937;padding-top:12px;">
                    Email ini dikirim otomatis oleh Sistem Monitoring Kualitas Udara PolluTrack.
                </p>
            </div>
        </body>
        </html>
        HTML;
    }

    /**
     * Auto-detect Telegram Chat ID from the bot's recent updates (getUpdates).
     */
    public function detectTelegramChatId(string $token, ?string $preferredUsername = null): array
    {
        $token = trim($token);
        if ($token === '' || $token === '87654321:AAE-MOCKTOKENHERE') {
            return [
                'success' => false,
                'message' => 'Masukkan Bot Token Telegram yang valid terlebih dahulu.',
            ];
        }

        try {
            $response = Http::timeout(15)
                ->withoutVerifying()
                ->get("https://api.telegram.org/bot{$token}/getUpdates");

            $json = $response->json();

            if (! $response->successful() || empty($json['ok'])) {
                $desc = $json['description'] ?? 'Token Telegram tidak valid atau gagal menghubungi API Telegram.';

                return [
                    'success' => false,
                    'message' => "Telegram API Error: {$desc}",
                ];
            }

            $results = $json['result'] ?? [];
            if (empty($results)) {
                return [
                    'success' => false,
                    'message' => 'Belum ada pesan masuk ke bot ini. Silakan buka bot Anda di Telegram lalu kirim pesan /start terlebih dahulu, kemudian klik Deteksi Chat ID lagi.',
                ];
            }

            $cleanUsername = $preferredUsername ? ltrim(strtolower(trim($preferredUsername)), '@') : null;
            $matchedChat = null;

            // Iterate from newest to oldest
            for ($i = count($results) - 1; $i >= 0; $i--) {
                $upd = $results[$i];
                $chat = $upd['message']['chat']
                    ?? $upd['channel_post']['chat']
                    ?? $upd['my_chat_member']['chat']
                    ?? null;

                if ($chat && isset($chat['id'])) {
                    if ($cleanUsername) {
                        $chatUsername = strtolower($chat['username'] ?? '');
                        if ($chatUsername === $cleanUsername) {
                            $matchedChat = $chat;
                            break;
                        }
                    }
                    if (! $matchedChat) {
                        $matchedChat = $chat;
                    }
                }
            }

            if (! $matchedChat) {
                return [
                    'success' => false,
                    'message' => 'Tidak ditemukan Chat ID dari riwayat bot. Kirim pesan /start ke bot Anda di Telegram terlebih dahulu.',
                ];
            }

            $chatId = (string) $matchedChat['id'];
            $chatName = $matchedChat['title']
                ?? trim(($matchedChat['first_name'] ?? '').' '.($matchedChat['last_name'] ?? ''))
                ?: ($matchedChat['username'] ?? $chatId);

            // Persist detected chat ID
            SystemConfig::setValue('telegramChatId', $chatId);

            return [
                'success' => true,
                'chat_id' => $chatId,
                'chat_name' => $chatName,
                'chat_type' => $matchedChat['type'] ?? 'private',
                'message' => "Chat ID berhasil terdeteksi: {$chatId} ({$chatName})",
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => 'Gagal menghubungi server Telegram: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Send Telemetry Snapshot to Telegram.
     */
    public function sendToTelegram(array $snapshot, array $config, string $title = 'LAPORAN TELEMETRI POLLUTRACK'): array
    {
        $token = trim((string) ($config['telegramToken'] ?? ''));
        $chatId = trim((string) ($config['telegramChatId'] ?? ''));

        if ($token === '' || $token === '87654321:AAE-MOCKTOKENHERE') {
            $msg = 'Bot Token Telegram belum dikonfigurasi. Masukkan Bot Token asli dari @BotFather.';
            $this->logNotification('Telegram', false, $msg);

            return ['success' => false, 'channel' => 'Telegram', 'message' => $msg];
        }

        // If chat ID is empty, attempt auto-detection via getUpdates
        if ($chatId === '' || $chatId === '@pollutrack_alerts') {
            $detected = $this->detectTelegramChatId($token);
            if ($detected['success']) {
                $chatId = $detected['chat_id'];
            } elseif ($chatId === '') {
                $this->logNotification('Telegram', false, $detected['message']);

                return ['success' => false, 'channel' => 'Telegram', 'message' => $detected['message']];
            }
        }

        $text = $this->formatTelegramMessage($snapshot, $title);

        try {
            $response = Http::timeout(15)
                ->withoutVerifying()
                ->post("https://api.telegram.org/bot{$token}/sendMessage", [
                    'chat_id' => $chatId,
                    'text' => $text,
                    'parse_mode' => 'HTML',
                ]);

            $json = $response->json();

            // If failed with 'chat not found', try resolving via getUpdates (e.g. user entered @username instead of numeric ID)
            if ((! $response->successful() || empty($json['ok'])) && str_contains(strtolower($json['description'] ?? ''), 'chat not found')) {
                $detected = $this->detectTelegramChatId($token, $chatId);
                if ($detected['success'] && $detected['chat_id'] !== $chatId) {
                    $chatId = $detected['chat_id'];
                    $response = Http::timeout(15)
                        ->withoutVerifying()
                        ->post("https://api.telegram.org/bot{$token}/sendMessage", [
                            'chat_id' => $chatId,
                            'text' => $text,
                            'parse_mode' => 'HTML',
                        ]);
                    $json = $response->json();
                }
            }

            if ($response->successful() && ! empty($json['ok'])) {
                $msg = "Data telemetri berhasil dikirim ke Telegram (Chat ID: {$chatId}).";
                $this->logNotification('Telegram', true, $msg);

                return [
                    'success' => true,
                    'channel' => 'Telegram',
                    'chat_id' => $chatId,
                    'message' => $msg,
                ];
            }

            $errDesc = $json['description'] ?? "HTTP {$response->status()}";
            $helpHint = '';
            if (str_contains(strtolower($errDesc), 'chat not found')) {
                $helpHint = ' Pastikan Anda sudah mengirim pesan /start ke bot Anda di Telegram, lalu klik tombol "Deteksi Chat ID".';
            } elseif (str_contains(strtolower($errDesc), 'unauthorized')) {
                $helpHint = ' Periksa kembali Bot Token dari @BotFather.';
            }

            $fullErr = "Gagal mengirim ke Telegram: {$errDesc}.{$helpHint}";
            $this->logNotification('Telegram', false, $fullErr);

            return [
                'success' => false,
                'channel' => 'Telegram',
                'message' => $fullErr,
            ];
        } catch (\Throwable $e) {
            $err = 'Gagal menghubungi API Telegram: '.$e->getMessage();
            $this->logNotification('Telegram', false, $err);

            return [
                'success' => false,
                'channel' => 'Telegram',
                'message' => $err,
            ];
        }
    }

    /**
     * Normalize Indonesian phone number to 628... format.
     */
    public function normalizePhone(string $phone): string
    {
        $clean = preg_replace('/[^0-9]/', '', $phone) ?? '';
        if (str_starts_with($clean, '08')) {
            return '62'.substr($clean, 1);
        }
        if (str_starts_with($clean, '8')) {
            return '62'.$clean;
        }

        return $clean;
    }

    /**
     * Send Telemetry Snapshot to WhatsApp Webhook / Gateway & generate direct wa.me link.
     */
    public function sendToWhatsapp(array $snapshot, array $config, string $title = 'LAPORAN TELEMETRI POLLUTRACK'): array
    {
        $webhook = trim((string) ($config['whatsappWebhook'] ?? ''));
        $token = trim((string) ($config['whatsappToken'] ?? ''));
        $rawTarget = trim((string) ($config['whatsappTarget'] ?? ''));
        $target = $this->normalizePhone($rawTarget);

        $text = $this->formatWhatsAppMessage($snapshot, $title);
        $waDirectUrl = $target !== ''
            ? "https://wa.me/{$target}?text=".rawurlencode($text)
            : 'https://wa.me/?text='.rawurlencode($text);

        $isMockUrl = $webhook === '' || str_contains($webhook, 'whatsapp-mock.com');
        $isFonnte = str_contains(strtolower($webhook), 'fonnte.com');

        // If using Fonnte without API token, or mock URL without real gateway
        if ($isMockUrl || ($isFonnte && $token === '')) {
            Log::info('[WhatsApp Telemetry Dispatch]', [
                'target' => $target ?: 'not-set',
                'webhook' => $webhook ?: 'direct-wa',
                'message' => $text,
            ]);

            if ($target !== '') {
                $msg = "Data telemetri siap dikirim ke nomor WhatsApp {$target} (Tercatat di sistem & siap dibuka via WhatsApp). Tambahkan API Token Fonnte/Webhook jika ingin pengiriman background otomatis.";
                $this->logNotification('WhatsApp', true, $msg);

                return [
                    'success' => true,
                    'channel' => 'WhatsApp',
                    'wa_url' => $waDirectUrl,
                    'mode' => 'direct',
                    'message' => $msg,
                ];
            }

            $msg = $isFonnte
                ? 'Untuk mengirim otomatis via Fonnte, isi Nomor WhatsApp Tujuan dan API Token Fonnte (atau isi Nomor Tujuan untuk kirim langsung via WhatsApp).'
                : 'Masukkan Nomor WhatsApp Tujuan atau URL Webhook WhatsApp yang valid terlebih dahulu.';
            $this->logNotification('WhatsApp', false, $msg);

            return [
                'success' => false,
                'channel' => 'WhatsApp',
                'wa_url' => $waDirectUrl,
                'message' => $msg,
            ];
        }

        try {
            $headers = [
                'Accept' => 'application/json',
            ];

            if ($token !== '') {
                $headers['Authorization'] = $token;
            }

            $payload = [
                'target' => $target ?: $rawTarget,
                'phone' => $target ?: $rawTarget,
                'to' => $target ?: $rawTarget,
                'countryCode' => '62',
                'message' => $text,
                'text' => $text,
                'content' => $text,
                'event' => 'telemetry_report',
                'generated_at' => $snapshot['generated_at'],
                'summary' => $snapshot['summary'],
                'telemetry' => $snapshot['telemetries'],
            ];

            $response = Http::timeout(15)
                ->withoutVerifying()
                ->withHeaders($headers)
                ->post($webhook, $payload);

            $json = $response->json();

            // Check provider-level status (e.g., Fonnte returns 200 with {"status": false, "reason": "..."})
            if (is_array($json) && array_key_exists('status', $json) && $json['status'] === false) {
                $reason = $json['reason'] ?? $json['message'] ?? 'Permintaan ditolak oleh gateway WhatsApp.';
                $errMsg = "Gateway WhatsApp menolak pengiriman: {$reason}";
                $this->logNotification('WhatsApp', false, $errMsg);

                return [
                    'success' => false,
                    'channel' => 'WhatsApp',
                    'wa_url' => $waDirectUrl,
                    'message' => $errMsg,
                ];
            }

            if ($response->successful()) {
                $destInfo = $target ? "ke nomor {$target} " : '';
                $msg = "Data telemetri berhasil dikirim {$destInfo}melalui WhatsApp Webhook ({$webhook}).";
                $this->logNotification('WhatsApp', true, $msg);

                return [
                    'success' => true,
                    'channel' => 'WhatsApp',
                    'wa_url' => $waDirectUrl,
                    'mode' => 'webhook',
                    'message' => $msg,
                ];
            }

            $errMsg = "Gagal mengirim ke WhatsApp Webhook (HTTP {$response->status()}): ".substr($response->body(), 0, 180);
            $this->logNotification('WhatsApp', false, $errMsg);

            return [
                'success' => false,
                'channel' => 'WhatsApp',
                'wa_url' => $waDirectUrl,
                'message' => $errMsg,
            ];
        } catch (\Throwable $e) {
            $errMsg = 'Gagal menghubungi WhatsApp Webhook: '.$e->getMessage();
            $this->logNotification('WhatsApp', false, $errMsg);

            return [
                'success' => false,
                'channel' => 'WhatsApp',
                'wa_url' => $waDirectUrl,
                'message' => $errMsg,
            ];
        }
    }

    /**
     * Send Telemetry Snapshot to Email.
     */
    public function sendToEmail(array $snapshot, array $config, string $title = 'Laporan Data Telemetri Kualitas Udara PolluTrack'): array
    {
        $rawRecipients = trim((string) ($config['emailRecipient'] ?? ''));
        if ($rawRecipients === '') {
            $msg = 'Alamat Email Tujuan belum diisi.';
            $this->logNotification('Email', false, $msg);

            return ['success' => false, 'channel' => 'Email', 'message' => $msg];
        }

        $recipients = array_values(array_filter(array_map('trim', explode(',', $rawRecipients))));
        foreach ($recipients as $email) {
            if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $msg = "Format alamat email tidak valid: {$email}";
                $this->logNotification('Email', false, $msg);

                return ['success' => false, 'channel' => 'Email', 'message' => $msg];
            }
        }

        $htmlBody = $this->formatEmailHtml($snapshot, $title);
        $subject = "📡 {$title} - ".Carbon::now()->format('d M Y H:i');

        $smtpHost = trim((string) ($config['smtpHost'] ?? ''));
        $smtpPort = (int) ($config['smtpPort'] ?? 587);
        $smtpUsername = trim((string) ($config['smtpUsername'] ?? ''));
        $smtpPassword = trim((string) ($config['smtpPassword'] ?? ''));
        $smtpEncryption = trim((string) ($config['smtpEncryption'] ?? 'tls'));
        $smtpFrom = trim((string) ($config['smtpFromAddress'] ?? config('mail.from.address', 'hello@example.com')));

        // Determine whether custom external SMTP is configured
        $hasCustomSmtp = $smtpHost !== ''
            && $smtpHost !== '127.0.0.1'
            && $smtpUsername !== ''
            && $smtpPassword !== '';

        try {
            if ($hasCustomSmtp) {
                config([
                    'mail.default' => 'smtp',
                    'mail.mailers.smtp.transport' => 'smtp',
                    'mail.mailers.smtp.host' => $smtpHost,
                    'mail.mailers.smtp.port' => $smtpPort ?: 587,
                    'mail.mailers.smtp.username' => $smtpUsername,
                    'mail.mailers.smtp.password' => $smtpPassword,
                    'mail.mailers.smtp.encryption' => $smtpEncryption === 'none' ? null : ($smtpEncryption ?: 'tls'),
                    'mail.from.address' => filter_var($smtpFrom, FILTER_VALIDATE_EMAIL) ? $smtpFrom : $smtpUsername,
                    'mail.from.name' => 'PolluTrack Monitoring System',
                ]);

                app('mail.manager')->forgetMailers();

                Mail::mailer('smtp')->html($htmlBody, function ($message) use ($recipients, $subject) {
                    $message->to($recipients)->subject($subject);
                });

                $msg = 'Data telemetri berhasil dikirim via SMTP ke '.implode(', ', $recipients).'.';
                $this->logNotification('Email', true, $msg);

                return [
                    'success' => true,
                    'channel' => 'Email',
                    'mode' => 'smtp',
                    'message' => $msg,
                ];
            }

            // Use configured default mailer (or fallback to log mailer if local 127.0.0.1 SMTP isn't running)
            $defaultMailer = config('mail.default', 'log');
            $usedMailer = $defaultMailer;

            try {
                Mail::mailer($defaultMailer)->html($htmlBody, function ($message) use ($recipients, $subject) {
                    $message->to($recipients)->subject($subject);
                });
            } catch (\Throwable $smtpErr) {
                // Fallback to 'log' mailer so local environment without mailpit/mailhog still records the email
                $usedMailer = 'log';
                Mail::mailer('log')->html($htmlBody, function ($message) use ($recipients, $subject) {
                    $message->to($recipients)->subject($subject);
                });
            }

            $modeLabel = $usedMailer === 'log'
                ? 'tercatat pada Mail Log sistem (isi pengaturan SMTP Host, Username & App Password jika ingin dikirim langsung ke kotak masuk Gmail/Email)'
                : "terkirim melalui mailer {$usedMailer}";

            $msg = 'Data telemetri ke '.implode(', ', $recipients)." berhasil diproses ({$modeLabel}).";
            $this->logNotification('Email', true, $msg);

            return [
                'success' => true,
                'channel' => 'Email',
                'mode' => $usedMailer,
                'message' => $msg,
            ];
        } catch (\Throwable $e) {
            $errMsg = 'Gagal mengirim Email ke '.implode(', ', $recipients).': '.$e->getMessage();
            $this->logNotification('Email', false, $errMsg);

            return [
                'success' => false,
                'channel' => 'Email',
                'message' => $errMsg,
            ];
        }
    }

    /**
     * Send telemetry data to a specific channel or all enabled channels.
     */
    public function dispatchTelemetry(string $channel = 'all', ?int $deviceId = null, ?array $overrideConfig = null, string $title = 'LAPORAN TELEMETRI POLLUTRACK'): array
    {
        $config = array_merge(SystemConfig::getAllConfigs(), $overrideConfig ?? []);
        $snapshot = $this->getTelemetrySnapshot($deviceId);

        if (empty($snapshot['telemetries'])) {
            // If specific device had no data, fallback to all devices with data
            if ($deviceId !== null) {
                $snapshot = $this->getTelemetrySnapshot(null);
            }
        }

        $channelNormalized = strtolower(trim($channel));
        $results = [];

        if ($channelNormalized === 'telegram' || ($channelNormalized === 'all' && ! empty($config['telegramEnabled']))) {
            $results['telegram'] = $this->sendToTelegram($snapshot, $config, $title);
        }

        if ($channelNormalized === 'whatsapp' || ($channelNormalized === 'all' && ! empty($config['whatsappEnabled']))) {
            $results['whatsapp'] = $this->sendToWhatsapp($snapshot, $config, $title);
        }

        if ($channelNormalized === 'email' || ($channelNormalized === 'all' && ! empty($config['emailEnabled']))) {
            $results['email'] = $this->sendToEmail($snapshot, $config, $title);
        }

        $successCount = collect($results)->where('success', true)->count();
        $totalCount = count($results);

        return [
            'overall_success' => $successCount > 0 && $successCount === $totalCount,
            'partial_success' => $successCount > 0 && $successCount < $totalCount,
            'success_count' => $successCount,
            'total_count' => $totalCount,
            'results' => $results,
            'snapshot' => $snapshot,
        ];
    }

    /**
     * Record notification attempt in AuditLog.
     */
    protected function logNotification(string $channel, bool $success, string $description): void
    {
        try {
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => $success ? "Notifikasi {$channel} Terkirim" : "Notifikasi {$channel} Gagal",
                'description' => $description,
                'ip_address' => request()?->ip() ?? '127.0.0.1',
                'user_agent' => request()?->userAgent() ?? 'System Telemetry Dispatcher',
            ]);
        } catch (\Throwable $e) {
            Log::warning('Failed to write AuditLog for telemetry notification: '.$e->getMessage());
        }
    }
}

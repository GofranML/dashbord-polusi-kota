<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class SystemConfig extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Default system configuration values.
     */
    public static function defaults(): array
    {
        return [
            'interval' => '1 hour',
            'telegramEnabled' => '1',
            'telegramToken' => env('TELEGRAM_BOT_TOKEN', ''),
            'telegramChatId' => env('TELEGRAM_CHAT_ID', ''),
            'whatsappEnabled' => '1',
            'whatsappWebhook' => env('WHATSAPP_WEBHOOK_URL', 'https://api.fonnte.com/send'),
            'whatsappToken' => env('WHATSAPP_API_TOKEN', ''),
            'whatsappTarget' => env('WHATSAPP_TARGET', ''),
            'emailEnabled' => '1',
            'emailRecipient' => env('ALERT_EMAIL_RECIPIENT', 'admin@pollutrack.gov.id'),
            'smtpHost' => env('MAIL_HOST', '127.0.0.1'),
            'smtpPort' => (string) env('MAIL_PORT', '2525'),
            'smtpUsername' => (string) env('MAIL_USERNAME', ''),
            'smtpPassword' => (string) env('MAIL_PASSWORD', ''),
            'smtpEncryption' => (string) env('MAIL_SCHEME', 'tls'),
            'smtpFromAddress' => (string) env('MAIL_FROM_ADDRESS', 'hello@example.com'),
            'autoNotifyOnUpload' => '1',
            'autoNotifyMode' => 'all', // 'all' or 'threshold_only'
            'threshold_pm25' => '100',
            'threshold_pm10' => '150',
            'threshold_mq135' => '250',
            'ip_whitelist' => '127.0.0.1, 192.168.1.1',
        ];
    }

    /**
     * Get a single config value by key.
     */
    public static function getValue(string $key, mixed $default = null): mixed
    {
        $defaults = self::defaults();
        $fallback = $default ?? ($defaults[$key] ?? null);

        try {
            if (! Schema::hasTable('system_configs')) {
                return $fallback;
            }

            $record = self::where('key', $key)->first();

            return $record !== null ? $record->value : $fallback;
        } catch (\Throwable $e) {
            return $fallback;
        }
    }

    /**
     * Set a single config value by key.
     */
    public static function setValue(string $key, mixed $value): void
    {
        if (! Schema::hasTable('system_configs')) {
            return;
        }

        self::updateOrCreate(
            ['key' => $key],
            ['value' => is_bool($value) ? ($value ? '1' : '0') : (string) ($value ?? '')]
        );
    }

    /**
     * Set multiple config key-value pairs at once.
     */
    public static function setMany(array $values): void
    {
        foreach ($values as $key => $value) {
            self::setValue($key, $value);
        }
    }

    /**
     * Get all configuration values merged with defaults.
     */
    public static function getAllConfigs(): array
    {
        $defaults = self::defaults();

        try {
            if (! Schema::hasTable('system_configs')) {
                return self::formatConfigs($defaults);
            }

            $stored = self::pluck('value', 'key')->toArray();
            $merged = array_merge($defaults, $stored);

            return self::formatConfigs($merged);
        } catch (\Throwable $e) {
            return self::formatConfigs($defaults);
        }
    }

    /**
     * Cast boolean and numeric config values appropriately for frontend/services.
     */
    protected static function formatConfigs(array $raw): array
    {
        return [
            'interval' => $raw['interval'] ?? '1 hour',
            'telegramEnabled' => filter_var($raw['telegramEnabled'] ?? true, FILTER_VALIDATE_BOOLEAN),
            'telegramToken' => (string) ($raw['telegramToken'] ?? ''),
            'telegramChatId' => (string) ($raw['telegramChatId'] ?? ''),
            'whatsappEnabled' => filter_var($raw['whatsappEnabled'] ?? true, FILTER_VALIDATE_BOOLEAN),
            'whatsappWebhook' => (string) ($raw['whatsappWebhook'] ?? ''),
            'whatsappToken' => (string) ($raw['whatsappToken'] ?? ''),
            'whatsappTarget' => (string) ($raw['whatsappTarget'] ?? ''),
            'emailEnabled' => filter_var($raw['emailEnabled'] ?? true, FILTER_VALIDATE_BOOLEAN),
            'emailRecipient' => (string) ($raw['emailRecipient'] ?? 'admin@pollutrack.gov.id'),
            'smtpHost' => (string) ($raw['smtpHost'] ?? ''),
            'smtpPort' => (string) ($raw['smtpPort'] ?? '587'),
            'smtpUsername' => (string) ($raw['smtpUsername'] ?? ''),
            'smtpPassword' => (string) ($raw['smtpPassword'] ?? ''),
            'smtpEncryption' => (string) ($raw['smtpEncryption'] ?? 'tls'),
            'smtpFromAddress' => (string) ($raw['smtpFromAddress'] ?? 'hello@example.com'),
            'autoNotifyOnUpload' => filter_var($raw['autoNotifyOnUpload'] ?? true, FILTER_VALIDATE_BOOLEAN),
            'autoNotifyMode' => (string) ($raw['autoNotifyMode'] ?? 'all'),
            'threshold_pm25' => (float) ($raw['threshold_pm25'] ?? 100.0),
            'threshold_pm10' => (float) ($raw['threshold_pm10'] ?? 150.0),
            'threshold_mq135' => (float) ($raw['threshold_mq135'] ?? 250.0),
            'ip_whitelist' => (string) ($raw['ip_whitelist'] ?? '127.0.0.1, 192.168.1.1'),
            'regions' => ['Ilir Barat', 'Ilir Timur', 'Seberang Ulu', 'Kalidoni', 'Kertapati', 'Plaju', 'Sukarami', 'Alang-Alang Lebar', 'Kemuning'],
        ];
    }
}

<?php

namespace Tests\Feature;

use App\Models\Device;
use App\Models\SensorData;
use App\Models\SystemConfig;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class SystemConfigNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_save_and_persist_system_config(): void
    {
        $user = User::factory()->create([
            'role' => 'Super Admin',
            'status' => 'active',
        ]);

        $response = $this->actingAs($user)->post('/dashboard/admin/config', [
            'interval' => '15 minutes',
            'telegramEnabled' => true,
            'telegramToken' => '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
            'telegramChatId' => '987654321',
            'whatsappEnabled' => true,
            'whatsappWebhook' => 'https://api.fonnte.com/send',
            'whatsappToken' => 'fonnte-secret-token',
            'whatsappTarget' => '081234567890',
            'emailEnabled' => true,
            'emailRecipient' => 'monitoring@palembang.go.id',
            'autoNotifyOnUpload' => true,
            'autoNotifyMode' => 'all',
        ]);

        $response->assertRedirect();

        $configs = SystemConfig::getAllConfigs();
        $this->assertSame('15 minutes', $configs['interval']);
        $this->assertSame('123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11', $configs['telegramToken']);
        $this->assertSame('987654321', $configs['telegramChatId']);
        $this->assertSame('https://api.fonnte.com/send', $configs['whatsappWebhook']);
        $this->assertSame('fonnte-secret-token', $configs['whatsappToken']);
        $this->assertSame('081234567890', $configs['whatsappTarget']);
        $this->assertSame('monitoring@palembang.go.id', $configs['emailRecipient']);
    }

    public function test_telemetry_data_can_be_sent_to_telegram_whatsapp_and_email(): void
    {
        Http::fake([
            'https://api.telegram.org/*' => Http::response(['ok' => true, 'result' => ['message_id' => 1]], 200),
            'https://api.fonnte.com/*' => Http::response(['status' => true, 'detail' => 'sent'], 200),
        ]);

        $user = User::factory()->create([
            'role' => 'Super Admin',
            'status' => 'active',
        ]);

        $device = Device::create([
            'device_code' => 'IOT-PLG-01',
            'name' => 'Palembang Station 1',
            'latitude' => -2.9761,
            'longitude' => 104.7754,
            'region' => 'Ilir Barat',
            'status' => 'online',
        ]);

        SensorData::create([
            'device_id' => $device->id,
            'datetime' => '2026-07-08 12:19:48',
            'pm25' => 42.5,
            'pm10' => 54.0,
            'pm1' => 28.0,
            'gas_index' => 52,
            'temperature' => 30.2,
            'humidity' => 76.0,
            'air_pressure' => 1008.5,
            'rain_status' => 'Tidak Hujan',
        ]);

        $response = $this->actingAs($user)->postJson('/dashboard/admin/config/send-telemetry', [
            'channel' => 'all',
            'device_id' => $device->id,
            'config' => [
                'telegramEnabled' => true,
                'telegramToken' => '123456:REALTOKEN',
                'telegramChatId' => '987654321',
                'whatsappEnabled' => true,
                'whatsappWebhook' => 'https://api.fonnte.com/send',
                'whatsappToken' => 'fonnte-token-123',
                'whatsappTarget' => '081234567890',
                'emailEnabled' => true,
                'emailRecipient' => 'admin@pollutrack.gov.id',
            ],
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'api.telegram.org/bot123456:REALTOKEN/sendMessage')
                && $request['chat_id'] === '987654321'
                && str_contains($request['text'], 'Palembang Station 1')
                && str_contains($request['text'], '42.5');
        });

        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'api.fonnte.com/send')
                && $request['target'] === '6281234567890'
                && str_contains($request['message'], 'Palembang Station 1');
        });
    }
}

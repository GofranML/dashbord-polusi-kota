<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Device;
use App\Models\TelemetryLog;
use App\Models\SensorData;
use App\Models\Alert;
use App\Models\MaintenanceTicket;
use App\Models\AuditLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Core Users
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@pollutrack.com',
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
            'status' => 'active',
            'preferences' => [
                'theme' => 'dark',
                'widgets' => ['telemetry', 'alerts', 'users', 'devices', 'analytics', 'security'],
                'bookmarks' => [1, 5, 11]
            ]
        ]);

        $operator = User::create([
            'name' => 'Petugas Monitoring',
            'email' => 'operator@pollutrack.com',
            'password' => Hash::make('password'),
            'role' => 'Petugas Monitoring',
            'status' => 'active',
            'preferences' => [
                'theme' => 'dark',
                'widgets' => ['telemetry', 'alerts', 'analytics'],
                'bookmarks' => [1, 7]
            ]
        ]);

        $viewer = User::create([
            'name' => 'Viewer / Operator',
            'email' => 'viewer@pollutrack.com',
            'password' => Hash::make('password'),
            'role' => 'Viewer / Operator',
            'status' => 'active',
            'preferences' => [
                'theme' => 'dark',
                'widgets' => ['telemetry', 'analytics'],
                'bookmarks' => [5]
            ]
        ]);

        $technician = User::create([
            'name' => 'Teknisi Lapangan',
            'email' => 'teknisi@pollutrack.com',
            'password' => Hash::make('password'),
            'role' => 'Teknisi Lapangan',
            'status' => 'active',
            'preferences' => [
                'theme' => 'dark',
                'widgets' => ['tickets', 'health'],
                'bookmarks' => [1, 5, 15]
            ]
        ]);

        // Seed a suspended user for testing
        User::create([
            'name' => 'Suspended Operator',
            'email' => 'suspended@pollutrack.com',
            'password' => Hash::make('password'),
            'role' => 'Petugas Monitoring',
            'status' => 'suspended',
        ]);

        // 2. Seed Devices / Sensors
        $devicesData = [
            // Ilir Barat
            ['device_code' => 'SC-N01v2', 'name' => 'Kambang Iwak Park', 'lat' => -2.9912, 'lng' => 104.7479, 'region' => 'Ilir Barat', 'status' => 'online', 'batt' => 4.1, 'sig' => -62],
            ['device_code' => 'SC-N02v2', 'name' => 'Kambang Iwak Residential', 'lat' => -2.9916, 'lng' => 104.7485, 'region' => 'Ilir Barat', 'status' => 'online', 'batt' => 4.0, 'sig' => -68],
            ['device_code' => 'SC-N03v2', 'name' => 'Palembang Icon Mall', 'lat' => -2.9754, 'lng' => 104.7505, 'region' => 'Ilir Barat', 'status' => 'online', 'batt' => 3.9, 'sig' => -70],
            ['device_code' => 'SC-N04v2', 'name' => 'Benteng Kuto Besak', 'lat' => -2.9904, 'lng' => 104.7592, 'region' => 'Ilir Barat', 'status' => 'calibrating', 'batt' => 4.2, 'sig' => -55],

            // Seberang Ulu
            ['device_code' => 'SC-N05v2', 'name' => 'Ampera Bridge', 'lat' => -2.9918, 'lng' => 104.7634, 'region' => 'Seberang Ulu', 'status' => 'online', 'batt' => 3.8, 'sig' => -75],
            ['device_code' => 'SC-N06v2', 'name' => 'Jakabaring Lake', 'lat' => -3.0211, 'lng' => 104.7925, 'region' => 'Seberang Ulu', 'status' => 'online', 'batt' => 3.7, 'sig' => -82],

            // Ilir Timur
            ['device_code' => 'SC-N07v2', 'name' => 'Masjid Agung Palembang', 'lat' => -2.9888, 'lng' => 104.7570, 'region' => 'Ilir Timur', 'status' => 'online', 'batt' => 4.0, 'sig' => -60],
            ['device_code' => 'SC-N08v2', 'name' => 'Boom Baru Port', 'lat' => -2.9691, 'lng' => 104.7885, 'region' => 'Ilir Timur', 'status' => 'calibrating', 'batt' => 3.6, 'sig' => -85],
            ['device_code' => 'SC-N09v2', 'name' => 'Pusri Industrial Area', 'lat' => -2.9723, 'lng' => 104.8118, 'region' => 'Kalidoni', 'status' => 'online', 'batt' => 3.9, 'sig' => -65],

            // Plaju / Kertapati
            ['device_code' => 'SC-N10v2', 'name' => 'Plaju Refinery Zone', 'lat' => -3.0039, 'lng' => 104.8152, 'region' => 'Plaju', 'status' => 'online', 'batt' => 4.1, 'sig' => -58],
            ['device_code' => 'SC-N11v2', 'name' => 'Kertapati Station', 'lat' => -3.0195, 'lng' => 104.7431, 'region' => 'Kertapati', 'status' => 'online', 'batt' => 3.8, 'sig' => -72],
            ['device_code' => 'SC-N12v2', 'name' => 'Bukit Siguntang', 'lat' => -2.9972, 'lng' => 104.7294, 'region' => 'Ilir Barat', 'status' => 'online', 'batt' => 4.0, 'sig' => -64],

            // Alang-Alang Lebar / Sukarami / Kemuning
            ['device_code' => 'SC-N13v2', 'name' => 'Punti Kayu Forest', 'lat' => -2.9431, 'lng' => 104.7251, 'region' => 'Alang-Alang Lebar', 'status' => 'online', 'batt' => 3.9, 'sig' => -78],
            ['device_code' => 'SC-N14v2', 'name' => 'Sultan Mahmud Badaruddin Airport', 'lat' => -2.8986, 'lng' => 104.7014, 'region' => 'Sukarami', 'status' => 'online', 'batt' => 4.2, 'sig' => -52],
            ['device_code' => 'SC-N15v2', 'name' => 'Simpang Polda', 'lat' => -2.9556, 'lng' => 104.7377, 'region' => 'Kemuning', 'status' => 'offline', 'batt' => 3.1, 'sig' => -95],
        ];

        $devices = [];
        foreach ($devicesData as $data) {
            $devices[] = Device::create([
                'device_code' => $data['device_code'],
                'name' => $data['name'],
                'latitude' => $data['lat'],
                'longitude' => $data['lng'],
                'region' => $data['region'],
                'status' => $data['status'],
                'battery_voltage' => $data['batt'],
                'signal_strength' => $data['sig'],
                'calibration_factor' => 1.0,
                'last_seen_at' => $data['status'] !== 'offline' ? Carbon::now()->subMinutes(rand(1, 15)) : Carbon::now()->subHours(24),
            ]);
        }

        // 3. Seed Telemetry Logs (3 Days, Hourly)
        $now = Carbon::now();
        $telemetries = [];
        $sensorDataRecords = [];
        
        // Loop over the last 3 days
        for ($day = 2; $day >= 0; $day--) {
            $date = Carbon::now()->subDays($day);
            
            // For each hour in the day
            for ($hour = 0; $hour < 24; $hour++) {
                $timestamp = Carbon::create($date->year, $date->month, $date->day, $hour, 0, 0);
                
                // Do not seed future records for today
                if ($day == 0 && $timestamp->isAfter($now)) {
                    continue;
                }

                foreach ($devices as $device) {
                    // Skip offline devices for telemetry
                    if ($device->status === 'offline' && $day == 0) {
                        continue;
                    }

                    // Define baseline characteristics based on region and station type
                    $isIndustrial = in_array($device->name, ['Plaju Refinery Zone', 'Boom Baru Port', 'Simpang Polda']);
                    $isPark = in_array($device->name, ['Punti Kayu Forest', 'Jakabaring Lake', 'Sultan Mahmud Badaruddin Airport']);
                    
                    // Diurnal patterns (peaks at rush hour: 7-9 AM, 5-8 PM)
                    $isPeakHour = ($hour >= 7 && $hour <= 9) || ($hour >= 17 && $hour <= 20);
                    
                    if ($isIndustrial) {
                        $pm25Base = $isPeakHour ? rand(110, 160) : rand(70, 110);
                        $pm10Base = $pm25Base * 0.65 + rand(-5, 5);
                        $mq135Base = $isPeakHour ? rand(380, 580) : rand(220, 380);
                    } elseif ($isPark) {
                        $pm25Base = $isPeakHour ? rand(15, 30) : rand(5, 18);
                        $pm10Base = $pm25Base * 0.65 + rand(-2, 2);
                        $mq135Base = $isPeakHour ? rand(50, 90) : rand(30, 60);
                    } else { // Standard city spots
                        $pm25Base = $isPeakHour ? rand(65, 95) : rand(35, 65);
                        $pm10Base = $pm25Base * 0.65 + rand(-3, 3);
                        $mq135Base = $isPeakHour ? rand(180, 270) : rand(100, 180);
                    }

                    // Weather Baseline
                    $weather = 'Cerah';
                    if ($hour >= 13 && $hour <= 16) {
                        $weather = rand(1, 10) > 7 ? 'Gerimis' : (rand(1, 10) > 8 ? 'Hujan' : 'Berawan');
                    } elseif ($hour >= 19 || $hour <= 5) {
                        $weather = rand(1, 10) > 8 ? 'Berawan' : 'Cerah';
                    }

                    $humidity = $weather === 'Hujan' ? rand(80, 95) : ($weather === 'Gerimis' ? rand(70, 85) : rand(50, 70));
                    $pressure = rand(1005, 1015);

                    $telemetries[] = [
                        'device_id' => $device->id,
                        'pm25' => round($pm25Base, 1),
                        'pm10' => round(max(5, $pm10Base), 1),
                        'mq135' => round($mq135Base, 0),
                        'humidity' => round($humidity, 1),
                        'pressure' => round($pressure, 0),
                        'weather' => $weather,
                        'created_at' => $timestamp,
                    ];

                    $sensorDataRecords[] = [
                        'device_id' => $device->id,
                        'datetime' => $timestamp,
                        'pm25' => round($pm25Base, 1),
                        'pm10' => round(max(5, $pm10Base), 1),
                        'pm1' => round($pm25Base * 0.45, 1),
                        'gas_index' => (int)round($mq135Base, 0),
                        'gps_lat' => $device->latitude,
                        'gps_lng' => $device->longitude,
                        'rain_status' => $weather,
                        'air_pressure' => round($pressure, 0),
                        'temperature' => round(28.0 + rand(-2, 2), 1),
                        'humidity' => round($humidity, 1),
                        'battery_status' => rand(80, 100),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ];
                }
            }
        }

        // Chunk insert telemetry logs for speed and memory efficiency
        $chunks = array_chunk($telemetries, 250);
        foreach ($chunks as $chunk) {
            TelemetryLog::insert($chunk);
        }

        // Chunk insert sensor data for speed and memory efficiency
        $sensorChunks = array_chunk($sensorDataRecords, 250);
        foreach ($sensorChunks as $chunk) {
            SensorData::insert($chunk);
        }

        // 4. Seed Alerts
        // Let's create an active alert, an acknowledged alert, and a resolved alert
        Alert::create([
            'device_id' => Device::where('name', 'Plaju Refinery Zone')->first()->id,
            'parameter' => 'PM2.5',
            'value' => 145.2,
            'threshold' => 100.0,
            'status' => 'active',
            'notes' => 'Tingkat partikulat PM2.5 sangat tinggi di area kilang Plaju.',
        ]);

        Alert::create([
            'device_id' => Device::where('name', 'Simpang Polda')->first()->id,
            'parameter' => 'PM2.5',
            'value' => 110.1,
            'threshold' => 100.0,
            'status' => 'acknowledged',
            'notes' => 'Laporan masuk dari Simpang Polda, sedang dipantau oleh petugas.',
        ]);

        Alert::create([
            'device_id' => Device::where('name', 'Kambang Iwak Park')->first()->id,
            'parameter' => 'MQ-135',
            'value' => 280.0,
            'threshold' => 250.0,
            'status' => 'resolved',
            'resolved_by' => $operator->id,
            'resolved_at' => Carbon::now()->subHours(5),
            'notes' => 'Tingkat gas telah menurun ke batas aman (210 ppm). Status resolved oleh Petugas Monitoring.',
        ]);

        // 5. Seed Maintenance Tickets
        MaintenanceTicket::create([
            'device_id' => Device::where('name', 'Benteng Kuto Besak')->first()->id,
            'technician_id' => $technician->id,
            'title' => 'Kalibrasi Ulang Sensor PM2.5',
            'description' => 'Lakukan kalibrasi ulang sensor PM2.5 di area Benteng Kuto Besak karena adanya deviasi pembacaan sebesar 15%.',
            'status' => 'pending',
            'scheduled_at' => Carbon::now()->addDays(1),
        ]);

        MaintenanceTicket::create([
            'device_id' => Device::where('name', 'Simpang Polda')->first()->id,
            'technician_id' => $technician->id,
            'title' => 'Perbaikan Sensor Offline',
            'description' => 'Sensor Simpang Polda dilaporkan offline sejak 24 jam lalu. Cek koneksi baterai dan modul Lora/GSM.',
            'status' => 'in_progress',
            'scheduled_at' => Carbon::now(),
        ]);

        MaintenanceTicket::create([
            'device_id' => Device::where('name', 'Punti Kayu Forest')->first()->id,
            'technician_id' => $technician->id,
            'title' => 'Ganti Baterai LiPo 3.7V',
            'description' => 'Baterai sensor Punti Kayu Forest telah drop di bawah 3.5V. Lakukan penggantian baterai LiPo baru.',
            'status' => 'completed',
            'scheduled_at' => Carbon::now()->subDays(2),
            'completed_at' => Carbon::now()->subDays(1),
        ]);

        // 6. Seed Audit & Security Logs
        AuditLog::create([
            'user_id' => $admin->id,
            'action' => 'User Management',
            'description' => 'Created user account for operator@pollutrack.com with Petugas Monitoring role.',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ]);

        AuditLog::create([
            'user_id' => $admin->id,
            'action' => 'Security',
            'description' => 'Database backup created and saved locally.',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ]);

        AuditLog::create([
            'user_id' => $operator->id,
            'action' => 'Alert Resolution',
            'description' => 'Resolved breach alert on Kambang Iwak Park.',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ]);
    }
}

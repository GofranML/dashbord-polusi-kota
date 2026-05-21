<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Device;
use App\Models\TelemetryLog;
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
            'email' => 'admin@smartcity.com',
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
            'email' => 'operator@smartcity.com',
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
            'email' => 'viewer@smartcity.com',
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
            'email' => 'teknisi@smartcity.com',
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
            'email' => 'suspended@smartcity.com',
            'password' => Hash::make('password'),
            'role' => 'Petugas Monitoring',
            'status' => 'suspended',
        ]);

        // 2. Seed Devices / Sensors
        $devicesData = [
            // CENTRAL (Jakarta Pusat)
            ['device_code' => 'SC-N01v2', 'name' => 'Sudirman Tower A', 'lat' => -6.2146, 'lng' => 106.8202, 'region' => 'Jakarta Pusat', 'status' => 'online', 'batt' => 4.1, 'sig' => -62],
            ['device_code' => 'SC-N02v2', 'name' => 'Sudirman Tower B', 'lat' => -6.2150, 'lng' => 106.8210, 'region' => 'Jakarta Pusat', 'status' => 'online', 'batt' => 4.0, 'sig' => -68],
            ['device_code' => 'SC-N03v2', 'name' => 'Thamrin Center', 'lat' => -6.1950, 'lng' => 106.8230, 'region' => 'Jakarta Pusat', 'status' => 'online', 'batt' => 3.9, 'sig' => -70],
            ['device_code' => 'SC-N04v2', 'name' => 'Monas Gateway', 'lat' => -6.1754, 'lng' => 106.8271, 'region' => 'Jakarta Pusat', 'status' => 'calibrating', 'batt' => 4.2, 'sig' => -55],

            // SOUTH (Jakarta Selatan)
            ['device_code' => 'SC-N05v2', 'name' => 'Tebet Eco Park', 'lat' => -6.2372, 'lng' => 106.8524, 'region' => 'Jakarta Selatan', 'status' => 'online', 'batt' => 3.8, 'sig' => -75],
            ['device_code' => 'SC-N06v2', 'name' => 'Kemang Square', 'lat' => -6.2550, 'lng' => 106.8150, 'region' => 'Jakarta Selatan', 'status' => 'online', 'batt' => 3.7, 'sig' => -82],

            // NORTH (Jakarta Utara)
            ['device_code' => 'SC-N07v2', 'name' => 'PIK Waterfront', 'lat' => -6.1100, 'lng' => 106.7400, 'region' => 'Jakarta Utara', 'status' => 'online', 'batt' => 4.0, 'sig' => -60],
            ['device_code' => 'SC-N08v2', 'name' => 'Ancol Marina', 'lat' => -6.1200, 'lng' => 106.8300, 'region' => 'Jakarta Utara', 'status' => 'calibrating', 'batt' => 3.6, 'sig' => -85],
            ['device_code' => 'SC-N09v2', 'name' => 'Tanjung Priok Port', 'lat' => -6.1033, 'lng' => 106.8845, 'region' => 'Jakarta Utara', 'status' => 'online', 'batt' => 3.9, 'sig' => -65],

            // EAST (Jakarta Timur)
            ['device_code' => 'SC-N10v2', 'name' => 'Kelapa Gading Mall', 'lat' => -6.1550, 'lng' => 106.9050, 'region' => 'Jakarta Timur', 'status' => 'online', 'batt' => 4.1, 'sig' => -58],
            ['device_code' => 'SC-N11v2', 'name' => 'Industrial Zone Pulogadung', 'lat' => -6.1850, 'lng' => 106.9150, 'region' => 'Jakarta Timur', 'status' => 'online', 'batt' => 3.8, 'sig' => -72],
            ['device_code' => 'SC-N12v2', 'name' => 'Jatinegara Station', 'lat' => -6.2150, 'lng' => 106.8700, 'region' => 'Jakarta Timur', 'status' => 'online', 'batt' => 4.0, 'sig' => -64],

            // WEST (Jakarta Barat)
            ['device_code' => 'SC-N13v2', 'name' => 'Grogol Crossing', 'lat' => -6.1650, 'lng' => 106.7880, 'region' => 'Jakarta Barat', 'status' => 'online', 'batt' => 3.9, 'sig' => -78],
            ['device_code' => 'SC-N14v2', 'name' => 'Kebon Jeruk', 'lat' => -6.1900, 'lng' => 106.7700, 'region' => 'Jakarta Barat', 'status' => 'online', 'batt' => 4.2, 'sig' => -52],
            ['device_code' => 'SC-N15v2', 'name' => 'Tomang Interchange', 'lat' => -6.1750, 'lng' => 106.7950, 'region' => 'Jakarta Barat', 'status' => 'offline', 'batt' => 3.1, 'sig' => -95],
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
                    $isIndustrial = in_array($device->name, ['Industrial Zone Pulogadung', 'Tanjung Priok Port', 'Grogol Crossing']);
                    $isPark = in_array($device->name, ['Tebet Eco Park', 'PIK Waterfront', 'Kebon Jeruk']);
                    
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
                }
            }
        }

        // Chunk insert telemetry logs for speed and memory efficiency
        $chunks = array_chunk($telemetries, 250);
        foreach ($chunks as $chunk) {
            TelemetryLog::insert($chunk);
        }

        // 4. Seed Alerts
        // Let's create an active alert, an acknowledged alert, and a resolved alert
        Alert::create([
            'device_id' => Device::where('name', 'Industrial Zone Pulogadung')->first()->id,
            'parameter' => 'PM2.5',
            'value' => 145.2,
            'threshold' => 100.0,
            'status' => 'active',
            'notes' => 'Tingkat partikulat PM2.5 sangat tinggi di area industri Pulogadung.',
        ]);

        Alert::create([
            'device_id' => Device::where('name', 'Grogol Crossing')->first()->id,
            'parameter' => 'PM2.5',
            'value' => 110.1,
            'threshold' => 100.0,
            'status' => 'acknowledged',
            'notes' => 'Laporan masuk dari Grogol, sedang dipantau oleh petugas.',
        ]);

        Alert::create([
            'device_id' => Device::where('name', 'Sudirman Tower A')->first()->id,
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
            'device_id' => Device::where('name', 'Monas Gateway')->first()->id,
            'technician_id' => $technician->id,
            'title' => 'Kalibrasi Ulang Sensor PM2.5',
            'description' => 'Lakukan kalibrasi ulang sensor PM2.5 di area Monas Gateway karena adanya deviasi pembacaan sebesar 15%.',
            'status' => 'pending',
            'scheduled_at' => Carbon::now()->addDays(1),
        ]);

        MaintenanceTicket::create([
            'device_id' => Device::where('name', 'Tomang Interchange')->first()->id,
            'technician_id' => $technician->id,
            'title' => 'Perbaikan Sensor Offline',
            'description' => 'Sensor Tomang Interchange dilaporkan offline sejak 24 jam lalu. Cek koneksi baterai dan modul Lora/GSM.',
            'status' => 'in_progress',
            'scheduled_at' => Carbon::now(),
        ]);

        MaintenanceTicket::create([
            'device_id' => Device::where('name', 'Tebet Eco Park')->first()->id,
            'technician_id' => $technician->id,
            'title' => 'Ganti Baterai LiPo 3.7V',
            'description' => 'Baterai sensor Tebet Eco Park telah drop di bawah 3.5V. Lakukan penggantian baterai LiPo baru.',
            'status' => 'completed',
            'scheduled_at' => Carbon::now()->subDays(2),
            'completed_at' => Carbon::now()->subDays(1),
        ]);

        // 6. Seed Audit & Security Logs
        AuditLog::create([
            'user_id' => $admin->id,
            'action' => 'User Management',
            'description' => 'Created user account for operator@smartcity.com with Petugas Monitoring role.',
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
            'description' => 'Resolved breach alert on Sudirman Tower A.',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ]);
    }
}

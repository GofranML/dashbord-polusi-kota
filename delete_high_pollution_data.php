<?php

/**
 * Script untuk menghapus data sensor_data dengan nilai > 100
 * (kecuali battery_status)
 */

require __DIR__.'/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;

try {
    // Tampilkan data yang akan dihapus terlebih dahulu
    $dataToDelete = DB::select('
        SELECT COUNT(*) as total FROM sensor_data 
        WHERE pm25 > 100 OR pm10 > 100 OR pm1 > 100 OR gas_index > 100 OR humidity > 100
    ');

    $totalRecords = $dataToDelete[0]->total;

    echo "╔════════════════════════════════════════════════════════════╗\n";
    echo "║   Menghapus Data Sensor dengan Nilai > 100                 ║\n";
    echo "╚════════════════════════════════════════════════════════════╝\n\n";

    echo 'Total record yang akan dihapus: '.$totalRecords."\n";
    echo "Kolom yang diperiksa:\n";
    echo "  ✓ pm25 (PM2.5 Partikulat Halus)\n";
    echo "  ✓ pm10 (PM10 Partikulat Kasar)\n";
    echo "  ✓ pm1 (PM1 Ultra Halus)\n";
    echo "  ✓ gas_index (MQ-135 Gas Sensor)\n";
    echo "  ✓ humidity (Kelembaban Udara)\n";
    echo "  ✗ battery_status (DIKECUALIKAN)\n\n";

    if ($totalRecords > 0) {
        // Jalankan delete
        $deleted = DB::delete('
            DELETE FROM sensor_data 
            WHERE pm25 > 100 OR pm10 > 100 OR pm1 > 100 OR gas_index > 100 OR humidity > 100
        ');

        echo "✓ Operasi berhasil!\n";
        echo '✓ Total record dihapus: '.$deleted."\n\n";

        // Tampilkan sisa data
        $remainingCount = DB::select('SELECT COUNT(*) as total FROM sensor_data');
        echo 'Total record tersisa di sensor_data: '.$remainingCount[0]->total."\n";
    } else {
        echo "✓ Tidak ada data yang memenuhi kriteria penghapusan.\n";
    }

} catch (Exception $e) {
    echo '✗ Error: '.$e->getMessage()."\n";
    exit(1);
}

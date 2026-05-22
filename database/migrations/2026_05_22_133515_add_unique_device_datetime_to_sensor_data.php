<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Hapus data duplikat yang sudah ada (simpan yang id paling kecil)
        DB::statement("
            DELETE s1 FROM sensor_data s1
            INNER JOIN sensor_data s2
            WHERE s1.id > s2.id
              AND s1.device_id = s2.device_id
              AND s1.datetime = s2.datetime
        ");

        Schema::table('sensor_data', function (Blueprint $table) {
            $table->unique(['device_id', 'datetime'], 'sensor_data_device_datetime_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sensor_data', function (Blueprint $table) {
            $table->dropUnique('sensor_data_device_datetime_unique');
        });
    }
};

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
        if (DB::getDriverName() === 'sqlite') {
            DB::statement("
                DELETE FROM sensor_data
                WHERE id NOT IN (
                    SELECT MIN(id)
                    FROM sensor_data
                    GROUP BY device_id, datetime
                )
            ");
        } else {
            DB::statement("
                DELETE s1 FROM sensor_data s1
                INNER JOIN sensor_data s2
                WHERE s1.id > s2.id
                  AND s1.device_id = s2.device_id
                  AND s1.datetime = s2.datetime
            ");
        }

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

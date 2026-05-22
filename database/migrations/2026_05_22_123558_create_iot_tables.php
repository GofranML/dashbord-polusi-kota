<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sensor_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->onDelete('cascade');
            $table->dateTime('datetime');
            $table->double('pm25')->nullable();
            $table->double('pm10')->nullable();
            $table->double('pm1')->nullable();
            $table->integer('gas_index')->nullable();
            $table->decimal('gps_lat', 10, 7)->nullable();
            $table->decimal('gps_lng', 10, 7)->nullable();
            $table->string('rain_status')->nullable();
            $table->double('air_pressure')->nullable();
            $table->double('temperature')->nullable();
            $table->double('humidity')->nullable();
            $table->double('battery_status')->nullable();
            $table->timestamps();
        });

        Schema::create('upload_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->nullable()->constrained('devices')->onDelete('set null');
            $table->string('file_name');
            $table->string('status'); // success, failed
            $table->text('error_message')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('upload_logs');
        Schema::dropIfExists('sensor_data');
    }
};

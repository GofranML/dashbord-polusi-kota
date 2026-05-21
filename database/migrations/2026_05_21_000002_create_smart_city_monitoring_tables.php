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
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->string('device_code')->unique();
            $table->string('name');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->string('region'); // Jakarta Pusat, Jakarta Selatan, etc.
            $table->string('status')->default('online'); // online, offline, calibrating
            $table->double('battery_voltage')->default(4.2); // health check
            $table->integer('signal_strength')->default(-50); // signal strength in dBm
            $table->double('calibration_factor')->default(1.0); // sensor calibration
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamps();
        });

        Schema::create('telemetry_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->onDelete('cascade');
            $table->double('pm25');
            $table->double('pm10');
            $table->double('mq135');
            $table->double('humidity');
            $table->double('pressure');
            $table->string('weather'); // Cerah, Berawan, Gerimis, Hujan
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->onDelete('cascade');
            $table->string('parameter'); // PM2.5, MQ-135, PM10
            $table->double('value');
            $table->double('threshold');
            $table->string('status')->default('active'); // active, acknowledged, resolved
            $table->foreignId('resolved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('resolved_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('maintenance_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->onDelete('cascade');
            $table->foreignId('technician_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('status')->default('pending'); // pending, in_progress, completed
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('action');
            $table->text('description');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('maintenance_tickets');
        Schema::dropIfExists('alerts');
        Schema::dropIfExists('telemetry_logs');
        Schema::dropIfExists('devices');
    }
};

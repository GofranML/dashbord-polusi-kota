<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\AuditLog;
use App\Models\SystemConfig;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AlertController extends Controller
{
    /**
     * Render the Alert Management Panel
     */
    public function index()
    {
        $alerts = Alert::with(['device', 'resolver'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'device_name' => $a->device->name,
                    'device_code' => $a->device->device_code,
                    'parameter' => $a->parameter,
                    'value' => (float) $a->value,
                    'threshold' => (float) $a->threshold,
                    'status' => $a->status, // active, acknowledged, resolved
                    'resolved_by_name' => $a->resolver?->name,
                    'resolved_at' => $a->resolved_at?->toIso8601String(),
                    'notes' => $a->notes,
                    'created_at' => $a->created_at->toIso8601String(),
                ];
            });

        // Get current system configuration threshold settings
        $thresholds = [
            'pm25' => (float) SystemConfig::getValue('threshold_pm25', 100.0),
            'pm10' => (float) SystemConfig::getValue('threshold_pm10', 150.0),
            'mq135' => (float) SystemConfig::getValue('threshold_mq135', 250.0),
        ];

        return Inertia::render('dashboard/alerts', [
            'alerts' => $alerts,
            'globalThresholds' => $thresholds,
        ]);
    }

    /**
     * Acknowledge an alert (ACK)
     */
    public function acknowledge($id)
    {
        $alert = Alert::findOrFail($id);
        $alert->status = 'acknowledged';
        $alert->save();

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Alert Acknowledged',
            'description' => "Acknowledged alert ID: {$alert->id} on Device: {$alert->device->name}",
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Alert acknowledged successfully.');
    }

    /**
     * Resolve an alert
     */
    public function resolve(Request $request, $id)
    {
        $request->validate([
            'notes' => 'required|string|max:500',
        ]);

        $alert = Alert::findOrFail($id);
        $alert->status = 'resolved';
        $alert->resolved_by = Auth::id();
        $alert->resolved_at = Carbon::now();
        $alert->notes = $request->input('notes');
        $alert->save();

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Alert Resolved',
            'description' => "Resolved alert ID: {$alert->id} on Device: {$alert->device->name}. Notes: {$alert->notes}",
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Alert resolved successfully.');
    }

    /**
     * Save custom dynamic threshold values
     */
    public function updateThresholds(Request $request)
    {
        $request->validate([
            'pm25' => 'required|numeric|min:1',
            'pm10' => 'required|numeric|min:1',
            'mq135' => 'required|numeric|min:1',
        ]);

        SystemConfig::setMany([
            'threshold_pm25' => $request->pm25,
            'threshold_pm10' => $request->pm10,
            'threshold_mq135' => $request->mq135,
        ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'System Config Change',
            'description' => "Updated custom thresholds: PM2.5={$request->pm25}, PM10={$request->pm10}, MQ-135={$request->mq135}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Threshold limits updated successfully.');
    }
}

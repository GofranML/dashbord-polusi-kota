<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\MaintenanceTicket;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TechnicianController extends Controller
{
    /**
     * Render the Maintenance Tickets panel
     */
    public function tickets()
    {
        $tickets = MaintenanceTicket::with(['device', 'technician'])
            ->orderBy('scheduled_at', 'asc')
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'device_id' => $t->device_id,
                    'device_name' => $t->device->name,
                    'device_code' => $t->device->device_code,
                    'technician_name' => $t->technician->name,
                    'title' => $t->title,
                    'description' => $t->description,
                    'status' => $t->status, // pending, in_progress, completed
                    'scheduled_at' => $t->scheduled_at?->toIso8601String(),
                    'completed_at' => $t->completed_at?->toIso8601String(),
                    'created_at' => $t->created_at->toIso8601String(),
                ];
            });

        $devices = Device::all(['id', 'name', 'device_code']);

        return Inertia::render('dashboard/technician/tickets', [
            'ticketsList' => $tickets,
            'devices' => $devices,
        ]);
    }

    /**
     * Create a new maintenance ticket (Admin action or internal)
     */
    public function storeTicket(Request $request)
    {
        $request->validate([
            'device_id' => 'required|exists:devices,id',
            'title' => 'required|string|max:200',
            'description' => 'required|string',
            'scheduled_at' => 'required|date',
        ]);

        // Default: Assign to the logged-in technician or standard technician
        $techId = Auth::user()->role === 'Teknisi Lapangan' ? Auth::id() : \App\Models\User::where('role', 'Teknisi Lapangan')->first()?->id ?? Auth::id();

        $ticket = MaintenanceTicket::create([
            'device_id' => $request->device_id,
            'technician_id' => $techId,
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'pending',
            'scheduled_at' => Carbon::parse($request->scheduled_at),
        ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Maintenance Ticket',
            'description' => "Created and scheduled new maintenance work order #{$ticket->id} for {$ticket->device->name}.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Maintenance ticket scheduled.');
    }

    /**
     * Update maintenance ticket status
     */
    public function updateTicket(Request $request, $id)
    {
        $ticket = MaintenanceTicket::findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:pending,in_progress,completed',
            'description' => 'nullable|string',
        ]);

        $oldStatus = $ticket->status;
        $ticket->status = $request->status;

        if ($request->status === 'completed' && $oldStatus !== 'completed') {
            $ticket->completed_at = Carbon::now();
        }

        if ($request->has('description') && $request->description) {
            $ticket->description = $request->description;
        }

        $ticket->save();

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Maintenance Ticket',
            'description' => "Updated work order #{$ticket->id} status: {$oldStatus} -> {$ticket->status}.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Ticket status updated.');
    }

    /**
     * Render the Device Health check statistics page
     */
    public function health()
    {
        $devices = Device::all()->map(function ($device) {
            return [
                'id' => $device->id,
                'device_code' => $device->device_code,
                'name' => $device->name,
                'status' => $device->status, // online, offline, calibrating
                'battery_voltage' => (double)$device->battery_voltage,
                'last_seen_at' => $device->last_seen_at?->toIso8601String(),
                'region' => $device->region,
                'latitude' => (double)$device->latitude,
                'longitude' => (double)$device->longitude,
            ];
        });

        return Inertia::render('dashboard/technician/health', [
            'devicesList' => $devices,
        ]);
    }
}

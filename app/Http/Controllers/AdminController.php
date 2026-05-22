<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;

class AdminController extends Controller
{
    /**
     * Render the User Management & Audit Logs panel
     */
    public function users()
    {
        $users = User::all()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'status' => $u->status,
                'email_verified_at' => $u->email_verified_at?->toIso8601String(),
                'created_at' => $u->created_at->toIso8601String(),
            ];
        });

        $auditLogs = AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'user_name' => $log->user?->name ?? 'System',
                    'action' => $log->action,
                    'description' => $log->description,
                    'ip_address' => $log->ip_address,
                    'created_at' => $log->created_at->toIso8601String(),
                ];
            });

        return Inertia::render('dashboard/admin/users', [
            'usersList' => $users,
            'auditLogs' => $auditLogs,
        ]);
    }

    /**
     * Store a newly created user (Admin action)
     */
    public function storeUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:Super Admin,Petugas Monitoring,Viewer / Operator,Teknisi Lapangan',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 'active',
        ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'User Created',
            'description' => "Created user {$user->name} ({$user->email}) with role {$user->role}.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'User created successfully.');
    }

    /**
     * Update user details (Admin action)
     */
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string|in:Super Admin,Petugas Monitoring,Viewer / Operator,Teknisi Lapangan',
            'status' => 'required|string|in:active,suspended',
        ]);

        $oldRole = $user->role;
        $oldStatus = $user->status;

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'status' => $request->status,
        ]);

        // Audit Trail
        $changes = [];
        if ($oldRole !== $request->role) $changes[] = "Role: {$oldRole} -> {$request->role}";
        if ($oldStatus !== $request->status) $changes[] = "Status: {$oldStatus} -> {$request->status}";

        $desc = "Updated user {$user->name} details. " . implode(', ', $changes);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'User Updated',
            'description' => $desc,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    /**
     * Delete a user account (Admin action)
     */
    public function destroyUser($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === Auth::id()) {
            return redirect()->back()->withErrors(['error' => 'You cannot delete your own account.']);
        }

        $userName = $user->name;
        $userEmail = $user->email;
        $user->delete();

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'User Deleted',
            'description' => "Deleted user account: {$userName} ({$userEmail})",
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return redirect()->back()->with('success', 'User deleted successfully.');
    }

    /**
     * Render the Global System Configurations panel
     */
    public function config()
    {
        return Inertia::render('dashboard/admin/config', [
            'config' => [
                'interval' => '1 hour',
                'telegramToken' => '87654321:AAE-MOCKTOKENHERE',
                'telegramChatId' => '@smartcity_air_alerts',
                'whatsappWebhook' => 'https://api.whatsapp-mock.com/send',
                'regions' => ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Timur', 'Jakarta Selatan', 'Jakarta Barat'],
            ]
        ]);
    }

    /**
     * Save Notification configs
     */
    public function updateConfig(Request $request)
    {
        $request->validate([
            'telegramToken' => 'nullable|string',
            'telegramChatId' => 'nullable|string',
            'whatsappWebhook' => 'nullable|url',
            'interval' => 'required|string',
        ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'System Config Change',
            'description' => "Updated notification channels and telemetry sync interval to {$request->interval}.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Global configuration settings updated.');
    }

    /**
     * Render Security settings panel
     */
    public function security()
    {
        $securityLogs = AuditLog::whereIn('action', ['Security', 'User Created', 'User Deleted'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'user_name' => $log->user?->name ?? 'System',
                    'action' => $log->action,
                    'description' => $log->description,
                    'ip_address' => $log->ip_address,
                    'created_at' => $log->created_at->toIso8601String(),
                ];
            });

        return Inertia::render('dashboard/admin/security', [
            'securityLogs' => $securityLogs,
            'ipWhitelist' => ['127.0.0.1', '192.168.1.1'],
        ]);
    }

    /**
     * Save Simulated IP Whitelist
     */
    public function updateIpWhitelist(Request $request)
    {
        $request->validate([
            'ips' => 'required|string',
        ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Security',
            'description' => "Updated simulated IP restrictions whitelist.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'IP whitelist restrictions updated successfully.');
    }

    /**
     * Download database backup directly
     */
    public function downloadBackup()
    {
        $dbPath = config('database.connections.sqlite.database');

        if ($dbPath === ':memory:' || !file_exists($dbPath)) {
            return redirect()->back()->withErrors(['error' => 'Database SQLite is set to memory or file not found.']);
        }

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Security',
            'description' => "Downloaded local database backup file.",
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return Response::download($dbPath, 'smartcity_backup_' . date('Y-m-d_H-i-s') . '.sqlite');
    }

    /**
     * Render the API Documentation panel
     */
    public function apiDocs()
    {
        $content = file_get_contents(base_path('API_DOCUMENTATION.md'));
        $html = \Illuminate\Support\Str::markdown($content);

        return Inertia::render('dashboard/admin/ApiDocs', [
            'htmlContent' => $html,
        ]);
    }
}

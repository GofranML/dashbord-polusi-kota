<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\SystemConfig;
use App\Models\User;
use App\Services\TelemetryNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use Inertia\Inertia;

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
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
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
        if ($oldRole !== $request->role) {
            $changes[] = "Role: {$oldRole} -> {$request->role}";
        }
        if ($oldStatus !== $request->status) {
            $changes[] = "Status: {$oldStatus} -> {$request->status}";
        }

        $desc = "Updated user {$user->name} details. ".implode(', ', $changes);

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
    public function config(TelemetryNotificationService $notificationService)
    {
        $config = SystemConfig::getAllConfigs();
        $telemetrySnapshot = $notificationService->getTelemetrySnapshot();

        $notificationLogs = AuditLog::with('user')
            ->where(function ($q) {
                $q->where('action', 'like', 'Notifikasi %')
                    ->orWhere('action', 'System Config Change');
            })
            ->orderBy('created_at', 'desc')
            ->take(15)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'user_name' => $log->user?->name ?? 'System',
                    'action' => $log->action,
                    'description' => $log->description,
                    'created_at' => $log->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('dashboard/admin/config', [
            'config' => $config,
            'telemetrySnapshot' => $telemetrySnapshot,
            'notificationLogs' => $notificationLogs,
        ]);
    }

    /**
     * Save Notification configs
     */
    public function updateConfig(Request $request)
    {
        $validated = $request->validate([
            'interval' => 'required|string',
            'telegramEnabled' => 'nullable|boolean',
            'telegramToken' => 'nullable|string|max:255',
            'telegramChatId' => 'nullable|string|max:255',
            'whatsappEnabled' => 'nullable|boolean',
            'whatsappWebhook' => 'nullable|url|max:500',
            'whatsappToken' => 'nullable|string|max:500',
            'whatsappTarget' => 'nullable|string|max:100',
            'emailEnabled' => 'nullable|boolean',
            'emailRecipient' => 'nullable|string|max:500',
            'smtpHost' => 'nullable|string|max:255',
            'smtpPort' => 'nullable|string|max:20',
            'smtpUsername' => 'nullable|string|max:255',
            'smtpPassword' => 'nullable|string|max:255',
            'smtpEncryption' => 'nullable|string|max:20',
            'smtpFromAddress' => 'nullable|string|max:255',
            'autoNotifyOnUpload' => 'nullable|boolean',
            'autoNotifyMode' => 'nullable|string|in:all,threshold_only',
        ]);

        SystemConfig::setMany([
            'interval' => $validated['interval'],
            'telegramEnabled' => $request->boolean('telegramEnabled', true),
            'telegramToken' => $validated['telegramToken'] ?? '',
            'telegramChatId' => $validated['telegramChatId'] ?? '',
            'whatsappEnabled' => $request->boolean('whatsappEnabled', true),
            'whatsappWebhook' => $validated['whatsappWebhook'] ?? '',
            'whatsappToken' => $validated['whatsappToken'] ?? '',
            'whatsappTarget' => $validated['whatsappTarget'] ?? '',
            'emailEnabled' => $request->boolean('emailEnabled', true),
            'emailRecipient' => $validated['emailRecipient'] ?? '',
            'smtpHost' => $validated['smtpHost'] ?? '',
            'smtpPort' => $validated['smtpPort'] ?? '587',
            'smtpUsername' => $validated['smtpUsername'] ?? '',
            'smtpPassword' => $validated['smtpPassword'] ?? '',
            'smtpEncryption' => $validated['smtpEncryption'] ?? 'tls',
            'smtpFromAddress' => $validated['smtpFromAddress'] ?? '',
            'autoNotifyOnUpload' => $request->boolean('autoNotifyOnUpload', true),
            'autoNotifyMode' => $validated['autoNotifyMode'] ?? 'all',
        ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'System Config Change',
            'description' => "Updated notification channels (Telegram, WhatsApp, Email) and telemetry sync interval to {$validated['interval']}.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Konfigurasi sistem berhasil disimpan.');
    }

    /**
     * Send existing telemetry data to Telegram, WhatsApp, Email, or all channels.
     */
    public function sendTelemetry(Request $request, TelemetryNotificationService $notificationService)
    {
        $request->validate([
            'channel' => 'required|string|in:telegram,whatsapp,email,all,Telegram,WhatsApp,Email,All',
            'device_id' => 'nullable|integer',
            'config' => 'nullable|array',
        ]);

        // If frontend passed unsaved config values from form, persist them first so the user doesn't have to click Save separately
        $incomingConfig = $request->input('config');
        if (is_array($incomingConfig)) {
            $allowedKeys = [
                'interval',
                'telegramEnabled',
                'telegramToken',
                'telegramChatId',
                'whatsappEnabled',
                'whatsappWebhook',
                'whatsappToken',
                'whatsappTarget',
                'emailEnabled',
                'emailRecipient',
                'smtpHost',
                'smtpPort',
                'smtpUsername',
                'smtpPassword',
                'smtpEncryption',
                'smtpFromAddress',
                'autoNotifyOnUpload',
                'autoNotifyMode',
            ];
            $toSave = [];
            foreach ($allowedKeys as $k) {
                if (array_key_exists($k, $incomingConfig)) {
                    $toSave[$k] = $incomingConfig[$k];
                }
            }
            if (! empty($toSave)) {
                SystemConfig::setMany($toSave);
            }
        }

        $channel = strtolower($request->input('channel', 'all'));
        $deviceId = $request->input('device_id') ? (int) $request->input('device_id') : null;

        $dispatchResult = $notificationService->dispatchTelemetry($channel, $deviceId);
        $results = $dispatchResult['results'];

        $messages = [];
        $errors = [];
        $waUrl = null;
        $detectedChatId = null;

        foreach ($results as $ch => $res) {
            if (! empty($res['wa_url'])) {
                $waUrl = $res['wa_url'];
            }
            if (! empty($res['chat_id'])) {
                $detectedChatId = $res['chat_id'];
            }
            if (! empty($res['success'])) {
                $messages[] = $res['message'];
            } else {
                $errors[] = $res['message'];
            }
        }

        if ($request->wantsJson()) {
            $notificationLogs = AuditLog::with('user')
                ->where(function ($q) {
                    $q->where('action', 'like', 'Notifikasi %')
                        ->orWhere('action', 'System Config Change');
                })
                ->orderBy('created_at', 'desc')
                ->take(15)
                ->get()
                ->map(function ($log) {
                    return [
                        'id' => $log->id,
                        'user_name' => $log->user?->name ?? 'System',
                        'action' => $log->action,
                        'description' => $log->description,
                        'created_at' => $log->created_at->format('Y-m-d H:i:s'),
                    ];
                });

            return response()->json([
                'success' => empty($errors) && ! empty($messages),
                'partial_success' => ! empty($errors) && ! empty($messages),
                'message' => ! empty($messages) ? implode(' | ', $messages) : implode(' | ', $errors),
                'errors' => $errors,
                'results' => $results,
                'wa_url' => $waUrl,
                'detected_chat_id' => $detectedChatId,
                'notificationLogs' => $notificationLogs,
            ], (empty($errors) || ! empty($messages)) ? 200 : 422);
        }

        if (! empty($errors) && empty($messages)) {
            return redirect()->back()
                ->with('wa_url', $waUrl)
                ->withErrors(['delivery' => implode(' | ', $errors)]);
        }

        return redirect()->back()
            ->with('wa_url', $waUrl)
            ->with('detected_chat_id', $detectedChatId)
            ->with('success', implode(' | ', array_merge($messages, $errors)));
    }

    /**
     * Auto-detect Telegram Chat ID from Bot updates (getUpdates).
     */
    public function detectTelegramChat(Request $request, TelemetryNotificationService $notificationService)
    {
        $request->validate([
            'telegramToken' => 'required|string',
            'telegramChatId' => 'nullable|string',
        ]);

        $token = trim($request->input('telegramToken'));
        SystemConfig::setValue('telegramToken', $token);

        $result = $notificationService->detectTelegramChatId($token, $request->input('telegramChatId'));

        if ($request->wantsJson()) {
            return response()->json($result, $result['success'] ? 200 : 422);
        }

        if (! $result['success']) {
            return redirect()->back()->withErrors(['telegramChatId' => $result['message']]);
        }

        return redirect()->back()
            ->with('detected_chat_id', $result['chat_id'] ?? null)
            ->with('success', $result['message']);
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

        $rawWhitelist = (string) SystemConfig::getValue('ip_whitelist', '127.0.0.1, 192.168.1.1');
        $ipWhitelist = array_values(array_filter(array_map('trim', explode(',', $rawWhitelist))));

        return Inertia::render('dashboard/admin/security', [
            'securityLogs' => $securityLogs,
            'ipWhitelist' => $ipWhitelist,
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

        SystemConfig::setValue('ip_whitelist', $request->input('ips'));

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Security',
            'description' => 'Updated simulated IP restrictions whitelist.',
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

        if ($dbPath === ':memory:' || ! file_exists($dbPath)) {
            return redirect()->back()->withErrors(['error' => 'Database SQLite is set to memory or file not found.']);
        }

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Security',
            'description' => 'Downloaded local database backup file.',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return Response::download($dbPath, 'pollutrack_backup_'.date('Y-m-d_H-i-s').'.sqlite');
    }

    /**
     * Render the API Documentation panel
     */
    public function apiDocs()
    {
        $content = file_get_contents(base_path('API_DOCUMENTATION.md'));
        $html = Str::markdown($content);

        return Inertia::render('dashboard/admin/ApiDocs', [
            'htmlContent' => $html,
        ]);
    }
}

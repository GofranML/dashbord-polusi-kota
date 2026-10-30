import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Shield,
    Download,
    Lock,
    Globe,
    Plus,
    Trash2,
    Clock,
    AlertTriangle,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

interface SecurityLog {
    id: number;
    user_name: string;
    action: string;
    description: string;
    ip_address: string;
    created_at: string;
}

export default function SecurityPage() {
    const { securityLogs = [], ipWhitelist: initialWhitelist = [] } = usePage()
        .props as any;

    const [whitelist, setWhitelist] = useState<string[]>(initialWhitelist);
    const [newIp, setNewIp] = useState('');

    const addIp = () => {
        const trimmed = newIp.trim();

        if (!trimmed) {
            return;
        }

        if (whitelist.includes(trimmed)) {
            toast.error('IP already in whitelist.');

            return;
        }

        setWhitelist((prev) => [...prev, trimmed]);
        setNewIp('');
    };

    const removeIp = (ip: string) =>
        setWhitelist((prev) => prev.filter((x) => x !== ip));

    const handleSaveWhitelist = () => {
        router.post(
            '/dashboard/admin/security/whitelist',
            { ips: whitelist.join(',') },
            {
                onSuccess: () =>
                    toast.success('IP whitelist restrictions saved!'),
                onError: () => toast.error('Failed to save IP whitelist.'),
            },
        );
    };

    return (
        <div className="space-y-8 bg-transparent p-4 lg:p-10">
            <Head title="Keamanan & Backup" />
            <Toaster position="top-right" theme="dark" />

            <header className="space-y-1">
                <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase">
                    <Shield className="h-8 w-8 text-emerald-400" />
                    Keamanan &amp; Backup
                </h1>
                <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                    2FA audit · IP Whitelist · SQLite database backup
                </p>
            </header>

            <div className="grid gap-8 xl:grid-cols-12">
                {/* Left: Controls */}
                <div className="space-y-6 xl:col-span-5">
                    {/* SQLite Backup */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <GlassCard className="space-y-5 border-emerald-500/20 bg-emerald-500/5 p-8">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-emerald-500/20 p-2.5">
                                    <Download className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black tracking-widest text-emerald-400 uppercase">
                                        Database Backup
                                    </h3>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase">
                                        SQLite file download
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs leading-relaxed text-neutral-400">
                                Unduh salinan database SQLite lokal secara
                                langsung. File backup akan diberi nama dengan
                                timestamp saat diunduh.
                            </p>
                            <Link
                                href="/dashboard/admin/security/backup"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-[10px] font-black tracking-widest text-black uppercase shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-600"
                            >
                                <Download className="h-4 w-4" />
                                Download pollutrack.sqlite
                            </Link>
                        </GlassCard>
                    </motion.div>

                    {/* IP Whitelist */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <GlassCard className="space-y-5 border-indigo-500/20 bg-indigo-500/5 p-8">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-indigo-500/20 p-2.5">
                                    <Globe className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black tracking-widest text-indigo-400 uppercase">
                                        IP Whitelist
                                    </h3>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase">
                                        Simulated network access control
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {whitelist.map((ip) => (
                                    <div
                                        key={ip}
                                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5"
                                    >
                                        <span className="font-mono text-[10px] text-white">
                                            {ip}
                                        </span>
                                        <button
                                            onClick={() => removeIp(ip)}
                                            className="rounded-lg p-1 hover:bg-white/10"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newIp}
                                    onChange={(e) => setNewIp(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' &&
                                        (e.preventDefault(), addIp())
                                    }
                                    placeholder="192.168.x.x atau 10.0.0.x"
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-indigo-500/50 focus:outline-none"
                                />
                                <button
                                    onClick={addIp}
                                    className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-2.5 text-indigo-400 transition-all hover:bg-indigo-500/20"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleSaveWhitelist}
                                className="w-full rounded-xl bg-indigo-500 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600"
                            >
                                Simpan IP Restrictions
                            </button>
                        </GlassCard>
                    </motion.div>

                    {/* 2FA Status Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <GlassCard className="space-y-5 border-cyan-500/20 p-8">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-cyan-500/20 p-2.5">
                                    <Lock className="h-5 w-5 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black tracking-widest text-cyan-400 uppercase">
                                        Two-Factor Auth
                                    </h3>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase">
                                        TOTP authentication status
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4">
                                <p className="text-[10px] leading-relaxed font-bold tracking-widest text-cyan-400 uppercase">
                                    ✅ 2FA is system-wide enabled. Manage your
                                    personal 2FA in{' '}
                                    <Link
                                        href="/settings/profile"
                                        className="underline"
                                    >
                                        Account Settings
                                    </Link>
                                    .
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Right: Security Logs */}
                <div className="xl:col-span-7">
                    <GlassCard className="p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-orange-400" />
                            <h3 className="text-sm font-black tracking-widest text-orange-400 uppercase">
                                Security Event Log
                            </h3>
                            <span className="ml-auto text-[9px] font-bold text-neutral-500 uppercase">
                                {securityLogs.length} events
                            </span>
                        </div>
                        <div className="max-h-[600px] space-y-3 overflow-y-auto pr-2">
                            {securityLogs.length === 0 ? (
                                <div className="py-12 text-center text-neutral-600">
                                    <Shield className="mx-auto mb-3 h-12 w-12 opacity-30" />
                                    <p className="text-xs font-bold tracking-widest uppercase">
                                        No security events recorded
                                    </p>
                                </div>
                            ) : (
                                securityLogs.map((log: SecurityLog) => (
                                    <div
                                        key={log.id}
                                        className="space-y-1.5 rounded-xl border border-white/5 bg-white/5 p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={cn(
                                                    'rounded-full px-2 py-0.5 text-[8px] font-black uppercase',
                                                    log.action === 'Security'
                                                        ? 'bg-orange-500/10 text-orange-400'
                                                        : log.action ===
                                                            'User Created'
                                                          ? 'bg-cyan-500/10 text-cyan-400'
                                                          : 'bg-red-500/10 text-red-400',
                                                )}
                                            >
                                                {log.action}
                                            </span>
                                            <span className="flex items-center gap-1 text-[8px] text-neutral-600">
                                                <Clock className="h-2.5 w-2.5" />
                                                {new Date(
                                                    log.created_at,
                                                ).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <p className="text-[10px] leading-relaxed text-neutral-300">
                                            {log.description}
                                        </p>
                                        <p className="font-mono text-[8px] text-neutral-600">
                                            by {log.user_name} · IP:{' '}
                                            {log.ip_address}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

SecurityPage.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Keamanan & Backup', href: '/dashboard/admin/security' },
        ]}
    >
        {page}
    </AppLayout>
);

import { Head, Link, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    Shield,
    Download,
    Lock,
    Globe,
    Plus,
    Trash2,
    Clock,
    AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { toast, Toaster } from 'sonner';

interface SecurityLog {
    id: number;
    user_name: string;
    action: string;
    description: string;
    ip_address: string;
    created_at: string;
}

export default function SecurityPage() {
    const { securityLogs = [], ipWhitelist: initialWhitelist = [] } = usePage().props as any;

    const [whitelist, setWhitelist] = useState<string[]>(initialWhitelist);
    const [newIp, setNewIp] = useState('');

    const addIp = () => {
        const trimmed = newIp.trim();
        if (!trimmed) return;
        if (whitelist.includes(trimmed)) { toast.error('IP already in whitelist.'); return; }
        setWhitelist(prev => [...prev, trimmed]);
        setNewIp('');
    };

    const removeIp = (ip: string) => setWhitelist(prev => prev.filter(x => x !== ip));

    const handleSaveWhitelist = () => {
        router.post('/dashboard/admin/security/whitelist', { ips: whitelist.join(',') }, {
            onSuccess: () => toast.success('IP whitelist restrictions saved!'),
            onError: () => toast.error('Failed to save IP whitelist.')
        });
    };

    return (
        <div className="p-4 lg:p-10 space-y-8 bg-transparent">
            <Head title="Keamanan & Backup" />
            <Toaster position="top-right" theme="dark" />

            <header className="space-y-1">
                <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <Shield className="w-8 h-8 text-emerald-400" />
                    Keamanan &amp; Backup
                </h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    2FA audit · IP Whitelist · SQLite database backup
                </p>
            </header>

            <div className="grid xl:grid-cols-12 gap-8">
                {/* Left: Controls */}
                <div className="xl:col-span-5 space-y-6">
                    {/* SQLite Backup */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <GlassCard className="p-8 bg-emerald-500/5 border-emerald-500/20 space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500/20">
                                    <Download className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase tracking-widest text-sm text-emerald-400">Database Backup</h3>
                                    <p className="text-[9px] text-neutral-500 uppercase font-bold">SQLite file download</p>
                                </div>
                            </div>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                                Unduh salinan database SQLite lokal secara langsung. File backup akan diberi nama dengan timestamp saat diunduh.
                            </p>
                            <Link
                                href="/dashboard/admin/security/backup"
                                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download pollutrack.sqlite
                            </Link>
                        </GlassCard>
                    </motion.div>

                    {/* IP Whitelist */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <GlassCard className="p-8 bg-indigo-500/5 border-indigo-500/20 space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-indigo-500/20">
                                    <Globe className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase tracking-widest text-sm text-indigo-400">IP Whitelist</h3>
                                    <p className="text-[9px] text-neutral-500 uppercase font-bold">Simulated network access control</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {whitelist.map((ip) => (
                                    <div key={ip} className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5">
                                        <span className="font-mono text-[10px] text-white">{ip}</span>
                                        <button onClick={() => removeIp(ip)} className="p-1 hover:bg-white/10 rounded-lg">
                                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newIp}
                                    onChange={(e) => setNewIp(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIp())}
                                    placeholder="192.168.x.x atau 10.0.0.x"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500/50"
                                />
                                <button
                                    onClick={addIp}
                                    className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl hover:bg-indigo-500/20 transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleSaveWhitelist}
                                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                            >
                                Simpan IP Restrictions
                            </button>
                        </GlassCard>
                    </motion.div>

                    {/* 2FA Status Panel */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <GlassCard className="p-8 space-y-5 border-cyan-500/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-cyan-500/20">
                                    <Lock className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase tracking-widest text-sm text-cyan-400">Two-Factor Auth</h3>
                                    <p className="text-[9px] text-neutral-500 uppercase font-bold">TOTP authentication status</p>
                                </div>
                            </div>
                            <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
                                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest leading-relaxed">
                                    ✅ 2FA is system-wide enabled. Manage your personal 2FA in <Link href="/settings/profile" className="underline">Account Settings</Link>.
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Right: Security Logs */}
                <div className="xl:col-span-7">
                    <GlassCard className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="w-5 h-5 text-orange-400" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-orange-400">Security Event Log</h3>
                            <span className="text-[9px] text-neutral-500 font-bold uppercase ml-auto">{securityLogs.length} events</span>
                        </div>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {securityLogs.length === 0 ? (
                                <div className="text-center py-12 text-neutral-600">
                                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="text-xs uppercase font-bold tracking-widest">No security events recorded</p>
                                </div>
                            ) : (
                                securityLogs.map((log: SecurityLog) => (
                                    <div key={log.id} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className={cn(
                                                'px-2 py-0.5 rounded-full text-[8px] font-black uppercase',
                                                log.action === 'Security' ? 'bg-orange-500/10 text-orange-400' :
                                                log.action === 'User Created' ? 'bg-cyan-500/10 text-cyan-400' :
                                                'bg-red-500/10 text-red-400'
                                            )}>
                                                {log.action}
                                            </span>
                                            <span className="text-[8px] text-neutral-600 flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5" />
                                                {new Date(log.created_at).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-neutral-300 leading-relaxed">{log.description}</p>
                                        <p className="text-[8px] text-neutral-600 font-mono">
                                            by {log.user_name} · IP: {log.ip_address}
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
    <AppLayout breadcrumbs={[{ title: 'Keamanan & Backup', href: '/dashboard/admin/security' }]}>
        {page}
    </AppLayout>
);

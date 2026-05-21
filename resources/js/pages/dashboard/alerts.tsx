import { Head, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { 
    AlertTriangle,
    CheckCircle,
    Clock,
    Shield,
    Sliders,
    X,
    Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { toast, Toaster } from 'sonner';

interface Alert {
    id: number;
    device_name: string;
    device_code: string;
    parameter: string;
    value: number;
    threshold: number;
    status: 'active' | 'acknowledged' | 'resolved';
    resolved_by_name: string | null;
    resolved_at: string | null;
    notes: string | null;
    created_at: string;
}

export default function AlertsPage() {
    const { alerts = [], globalThresholds = {} } = usePage().props as any;

    const [resolveModal, setResolveModal] = useState<Alert | null>(null);
    const [resolveNotes, setResolveNotes] = useState('');
    const [thresholds, setThresholds] = useState({
        pm25: globalThresholds.pm25 ?? 100,
        pm10: globalThresholds.pm10 ?? 150,
        mq135: globalThresholds.mq135 ?? 250,
    });
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const handleAck = (id: number) => {
        router.post(`/dashboard/alerts/${id}/ack`, {}, {
            onSuccess: () => toast.success('Alert acknowledged!'),
            onError: () => toast.error('Failed to acknowledge alert.')
        });
    };

    const handleResolve = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resolveModal) return;
        router.post(`/dashboard/alerts/${resolveModal.id}/resolve`, {
            notes: resolveNotes
        }, {
            onSuccess: () => {
                toast.success('Alert resolved successfully!');
                setResolveModal(null);
                setResolveNotes('');
            },
            onError: () => toast.error('Failed to resolve alert.')
        });
    };

    const handleSaveThresholds = () => {
        router.post('/dashboard/alerts/thresholds', thresholds, {
            onSuccess: () => toast.success('Alert thresholds saved!'),
            onError: () => toast.error('Failed to save thresholds.')
        });
    };

    const filtered = filterStatus === 'all' ? alerts : alerts.filter((a: Alert) => a.status === filterStatus);

    const statusConfig = {
        active: { label: 'Active', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-500' },
        acknowledged: { label: 'Acknowledged', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-500' },
        resolved: { label: 'Resolved', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', dot: 'bg-green-500' },
    };

    return (
        <div className="p-4 lg:p-10 space-y-8 bg-transparent">
            <Head title="Alert & Notifikasi" />
            <Toaster position="top-right" theme="dark" />

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <Bell className="w-8 h-8 text-red-400" />
                        Alert &amp; Notifikasi
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        Environmental breach monitoring · ACK / Resolve workflow
                    </p>
                </div>
                <div className="flex gap-2">
                    {(['all', 'active', 'acknowledged', 'resolved'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={cn(
                                'px-3 py-1.5 border rounded-lg text-[9px] font-black uppercase tracking-widest transition-all',
                                filterStatus === s
                                    ? 'bg-white text-black border-white'
                                    : 'border-white/10 text-neutral-500 hover:border-white/20'
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid xl:grid-cols-12 gap-8">
                {/* Alert List */}
                <div className="xl:col-span-8 space-y-4">
                    <AnimatePresence>
                        {filtered.length === 0 ? (
                            <GlassCard className="p-12 text-center">
                                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                <p className="text-sm font-black uppercase text-neutral-400">No alerts in this category</p>
                            </GlassCard>
                        ) : (
                            filtered.map((alert: Alert, idx: number) => {
                                const cfg = statusConfig[alert.status];
                                return (
                                    <motion.div
                                        key={alert.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                    >
                                        <GlassCard className={cn('p-6 border', cfg.bg)}>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5', cfg.bg)}>
                                                        <AlertTriangle className={cn('w-5 h-5', cfg.color)} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-mono text-[10px] text-neutral-500">{alert.device_code}</span>
                                                            <span className={cn('px-2 py-0.5 rounded-full text-[8px] font-black uppercase border', cfg.bg, cfg.color)}>
                                                                <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1', cfg.dot)} />
                                                                {cfg.label}
                                                            </span>
                                                        </div>
                                                        <h4 className="font-black text-white text-sm">{alert.device_name}</h4>
                                                        <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">
                                                            {alert.parameter} exceeded threshold · Value: <span className={cfg.color}>{alert.value}</span> / Limit: {alert.threshold}
                                                        </p>
                                                        <p className="text-[9px] text-neutral-600 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(alert.created_at).toLocaleString('id-ID')}
                                                        </p>
                                                        {alert.notes && (
                                                            <p className="text-[9px] text-neutral-500 italic">Note: {alert.notes}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 flex-shrink-0">
                                                    {alert.status === 'active' && (
                                                        <button
                                                            onClick={() => handleAck(alert.id)}
                                                            className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-yellow-500/20 transition-all"
                                                        >
                                                            Acknowledge
                                                        </button>
                                                    )}
                                                    {(alert.status === 'active' || alert.status === 'acknowledged') && (
                                                        <button
                                                            onClick={() => setResolveModal(alert)}
                                                            className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-green-500/20 transition-all"
                                                        >
                                                            Resolve
                                                        </button>
                                                    )}
                                                    {alert.status === 'resolved' && (
                                                        <span className="px-4 py-2 text-[9px] font-black uppercase text-neutral-600 tracking-widest">
                                                            Closed by {alert.resolved_by_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>

                {/* Threshold Sliders */}
                <div className="xl:col-span-4">
                    <GlassCard className="p-8 bg-indigo-500/5 border-indigo-500/20 space-y-6 sticky top-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-500/20">
                                <Sliders className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400">Alert Thresholds</h3>
                                <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest">Global trigger limits</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { key: 'pm25' as const, label: 'PM2.5 Threshold', unit: 'µg/m³', max: 300, color: '#06b6d4' },
                                { key: 'pm10' as const, label: 'PM10 Threshold', unit: 'µg/m³', max: 400, color: '#a855f7' },
                                { key: 'mq135' as const, label: 'MQ-135 Threshold', unit: 'ppm', max: 1000, color: '#f97316' },
                            ].map(field => (
                                <div key={field.key} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-neutral-400">{field.label}</label>
                                        <span className="font-mono text-sm font-black" style={{ color: field.color }}>
                                            {thresholds[field.key]} <span className="text-[9px] text-neutral-600">{field.unit}</span>
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min={1}
                                        max={field.max}
                                        value={thresholds[field.key]}
                                        onChange={(e) => setThresholds(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                                        className="w-full accent-cyan-500"
                                    />
                                    <div className="flex justify-between text-[8px] text-neutral-700 font-mono">
                                        <span>0</span><span>{field.max}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleSaveThresholds}
                            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                        >
                            Save Threshold Configuration
                        </button>
                    </GlassCard>
                </div>
            </div>

            {/* Resolve Modal */}
            <AnimatePresence>
                {resolveModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={(e) => e.target === e.currentTarget && setResolveModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0c1425] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-6 h-6 text-green-400" />
                                    <h3 className="font-black uppercase tracking-widest text-sm">Resolve Alert</h3>
                                </div>
                                <button onClick={() => setResolveModal(null)} className="p-1 hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>
                            <p className="text-xs text-neutral-400 mb-6">
                                Resolving: <span className="text-white font-bold">{resolveModal.device_name}</span> — {resolveModal.parameter} breach
                            </p>
                            <form onSubmit={handleResolve} className="space-y-5">
                                <div>
                                    <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-2 block">Resolution Notes *</label>
                                    <textarea
                                        rows={4}
                                        value={resolveNotes}
                                        onChange={(e) => setResolveNotes(e.target.value)}
                                        placeholder="Describe the corrective action taken..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-green-500/50 resize-none"
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full py-3 bg-green-500 hover:bg-green-600 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                                    Confirm Resolution
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

AlertsPage.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Alert & Notifikasi', href: '/dashboard/alerts' }]}>
        {page}
    </AppLayout>
);

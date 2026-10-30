import { Head, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Shield,
    Sliders,
    X,
    Bell,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

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
        router.post(
            `/dashboard/alerts/${id}/ack`,
            {},
            {
                onSuccess: () => toast.success('Alert acknowledged!'),
                onError: () => toast.error('Failed to acknowledge alert.'),
            },
        );
    };

    const handleResolve = (e: React.FormEvent) => {
        e.preventDefault();

        if (!resolveModal) {
            return;
        }

        router.post(
            `/dashboard/alerts/${resolveModal.id}/resolve`,
            {
                notes: resolveNotes,
            },
            {
                onSuccess: () => {
                    toast.success('Alert resolved successfully!');
                    setResolveModal(null);
                    setResolveNotes('');
                },
                onError: () => toast.error('Failed to resolve alert.'),
            },
        );
    };

    const handleSaveThresholds = () => {
        router.post('/dashboard/alerts/thresholds', thresholds, {
            onSuccess: () => toast.success('Alert thresholds saved!'),
            onError: () => toast.error('Failed to save thresholds.'),
        });
    };

    const filtered =
        filterStatus === 'all'
            ? alerts
            : alerts.filter((a: Alert) => a.status === filterStatus);

    const statusConfig = {
        active: {
            label: 'Active',
            color: 'text-red-400',
            bg: 'bg-red-500/10 border-red-500/20',
            dot: 'bg-red-500',
        },
        acknowledged: {
            label: 'Acknowledged',
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10 border-yellow-500/20',
            dot: 'bg-yellow-500',
        },
        resolved: {
            label: 'Resolved',
            color: 'text-green-400',
            bg: 'bg-green-500/10 border-green-500/20',
            dot: 'bg-green-500',
        },
    };

    return (
        <div className="space-y-8 bg-transparent p-4 lg:p-10">
            <Head title="Alert & Notifikasi" />
            <Toaster position="top-right" theme="dark" />

            <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase">
                        <Bell className="h-8 w-8 text-red-400" />
                        Alert &amp; Notifikasi
                    </h1>
                    <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                        Environmental breach monitoring · ACK / Resolve workflow
                    </p>
                </div>
                <div className="flex gap-2">
                    {(
                        ['all', 'active', 'acknowledged', 'resolved'] as const
                    ).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={cn(
                                'rounded-lg border px-3 py-1.5 text-[9px] font-black tracking-widest uppercase transition-all',
                                filterStatus === s
                                    ? 'border-white bg-white text-black'
                                    : 'border-white/10 text-neutral-500 hover:border-white/20',
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid gap-8 xl:grid-cols-12">
                {/* Alert List */}
                <div className="space-y-4 xl:col-span-8">
                    <AnimatePresence>
                        {filtered.length === 0 ? (
                            <GlassCard className="p-12 text-center">
                                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-400" />
                                <p className="text-sm font-black text-neutral-400 uppercase">
                                    No alerts in this category
                                </p>
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
                                        <GlassCard
                                            className={cn('border p-6', cfg.bg)}
                                        >
                                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className={cn(
                                                            'mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl',
                                                            cfg.bg,
                                                        )}
                                                    >
                                                        <AlertTriangle
                                                            className={cn(
                                                                'h-5 w-5',
                                                                cfg.color,
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="font-mono text-[10px] text-neutral-500">
                                                                {
                                                                    alert.device_code
                                                                }
                                                            </span>
                                                            <span
                                                                className={cn(
                                                                    'rounded-full border px-2 py-0.5 text-[8px] font-black uppercase',
                                                                    cfg.bg,
                                                                    cfg.color,
                                                                )}
                                                            >
                                                                <span
                                                                    className={cn(
                                                                        'mr-1 inline-block h-1.5 w-1.5 rounded-full',
                                                                        cfg.dot,
                                                                    )}
                                                                />
                                                                {cfg.label}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-sm font-black text-white">
                                                            {alert.device_name}
                                                        </h4>
                                                        <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                                            {alert.parameter}{' '}
                                                            exceeded threshold ·
                                                            Value:{' '}
                                                            <span
                                                                className={
                                                                    cfg.color
                                                                }
                                                            >
                                                                {alert.value}
                                                            </span>{' '}
                                                            / Limit:{' '}
                                                            {alert.threshold}
                                                        </p>
                                                        <p className="flex items-center gap-1 text-[9px] text-neutral-600">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(
                                                                alert.created_at,
                                                            ).toLocaleString(
                                                                'id-ID',
                                                            )}
                                                        </p>
                                                        {alert.notes && (
                                                            <p className="text-[9px] text-neutral-500 italic">
                                                                Note:{' '}
                                                                {alert.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-shrink-0 gap-2">
                                                    {alert.status ===
                                                        'active' && (
                                                        <button
                                                            onClick={() =>
                                                                handleAck(
                                                                    alert.id,
                                                                )
                                                            }
                                                            className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-[9px] font-black tracking-widest text-yellow-400 uppercase transition-all hover:bg-yellow-500/20"
                                                        >
                                                            Acknowledge
                                                        </button>
                                                    )}
                                                    {(alert.status ===
                                                        'active' ||
                                                        alert.status ===
                                                            'acknowledged') && (
                                                        <button
                                                            onClick={() =>
                                                                setResolveModal(
                                                                    alert,
                                                                )
                                                            }
                                                            className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2 text-[9px] font-black tracking-widest text-green-400 uppercase transition-all hover:bg-green-500/20"
                                                        >
                                                            Resolve
                                                        </button>
                                                    )}
                                                    {alert.status ===
                                                        'resolved' && (
                                                        <span className="px-4 py-2 text-[9px] font-black tracking-widest text-neutral-600 uppercase">
                                                            Closed by{' '}
                                                            {
                                                                alert.resolved_by_name
                                                            }
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
                    <GlassCard className="sticky top-8 space-y-6 border-indigo-500/20 bg-indigo-500/5 p-8">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-indigo-500/20 p-2">
                                <Sliders className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black tracking-widest text-indigo-400 uppercase">
                                    Alert Thresholds
                                </h3>
                                <p className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">
                                    Global trigger limits
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    key: 'pm25' as const,
                                    label: 'PM2.5 Threshold',
                                    unit: 'µg/m³',
                                    max: 300,
                                    color: '#06b6d4',
                                },
                                {
                                    key: 'pm10' as const,
                                    label: 'PM10 Threshold',
                                    unit: 'µg/m³',
                                    max: 400,
                                    color: '#a855f7',
                                },
                                {
                                    key: 'mq135' as const,
                                    label: 'MQ-135 Threshold',
                                    unit: 'ppm',
                                    max: 1000,
                                    color: '#f97316',
                                },
                            ].map((field) => (
                                <div key={field.key} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                                            {field.label}
                                        </label>
                                        <span
                                            className="font-mono text-sm font-black"
                                            style={{ color: field.color }}
                                        >
                                            {thresholds[field.key]}{' '}
                                            <span className="text-[9px] text-neutral-600">
                                                {field.unit}
                                            </span>
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min={1}
                                        max={field.max}
                                        value={thresholds[field.key]}
                                        onChange={(e) =>
                                            setThresholds((prev) => ({
                                                ...prev,
                                                [field.key]: Number(
                                                    e.target.value,
                                                ),
                                            }))
                                        }
                                        className="w-full accent-cyan-500"
                                    />
                                    <div className="flex justify-between font-mono text-[8px] text-neutral-700">
                                        <span>0</span>
                                        <span>{field.max}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleSaveThresholds}
                            className="w-full rounded-xl bg-indigo-500 py-3 text-[10px] font-black tracking-widest text-white uppercase shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:bg-indigo-600"
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
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
                        onClick={(e) =>
                            e.target === e.currentTarget &&
                            setResolveModal(null)
                        }
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c1425] p-8 shadow-2xl"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-6 w-6 text-green-400" />
                                    <h3 className="text-sm font-black tracking-widest uppercase">
                                        Resolve Alert
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setResolveModal(null)}
                                    className="rounded-lg p-1 hover:bg-white/10"
                                >
                                    <X className="h-5 w-5 text-neutral-500" />
                                </button>
                            </div>
                            <p className="mb-6 text-xs text-neutral-400">
                                Resolving:{' '}
                                <span className="font-bold text-white">
                                    {resolveModal.device_name}
                                </span>{' '}
                                — {resolveModal.parameter} breach
                            </p>
                            <form
                                onSubmit={handleResolve}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="mb-2 block text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                                        Resolution Notes *
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={resolveNotes}
                                        onChange={(e) =>
                                            setResolveNotes(e.target.value)
                                        }
                                        placeholder="Describe the corrective action taken..."
                                        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white focus:border-green-500/50 focus:outline-none"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-green-500 py-3 text-[10px] font-black tracking-widest text-black uppercase transition-all hover:bg-green-600"
                                >
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
    <AppLayout
        breadcrumbs={[
            { title: 'Alert & Notifikasi', href: '/dashboard/alerts' },
        ]}
    >
        {page}
    </AppLayout>
);

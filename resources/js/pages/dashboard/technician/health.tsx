import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Activity,
    Battery,
    Wifi,
    WifiOff,
    AlertCircle,
    MapPin,
    Clock,
    Cpu,
    Search,
    QrCode,
} from 'lucide-react';
import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

interface DeviceHealth {
    id: number;
    device_code: string;
    name: string;
    status: 'online' | 'offline' | 'calibrating';
    battery_voltage: number;
    last_seen_at: string | null;
    region: string;
    latitude: number;
    longitude: number;
}

export default function HealthPage() {
    const { devicesList = [] } = usePage().props as any;
    const [search, setSearch] = useState('');
    const [qrTarget, setQrTarget] = useState<DeviceHealth | null>(null);

    const filtered = devicesList.filter(
        (d: DeviceHealth) =>
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.device_code.toLowerCase().includes(search.toLowerCase()) ||
            d.region.toLowerCase().includes(search.toLowerCase()),
    );

    const getBatteryPct = (v: number) =>
        Math.min(100, Math.max(0, Math.round(((v - 3.0) / (4.2 - 3.0)) * 100)));
    const getBatteryColor = (v: number) => {
        const pct = getBatteryPct(v);

        if (pct >= 60) {
            return 'text-green-400';
        }

        if (pct >= 30) {
            return 'text-yellow-400';
        }

        return 'text-red-400';
    };

    const statusConfig = {
        online: {
            label: 'Online',
            color: 'text-green-400',
            bg: 'bg-green-500/10 border-green-500/20',
            icon: <Wifi className="h-3.5 w-3.5" />,
        },
        offline: {
            label: 'Offline',
            color: 'text-red-400',
            bg: 'bg-red-500/10 border-red-500/20',
            icon: <WifiOff className="h-3.5 w-3.5" />,
        },
        calibrating: {
            label: 'Calibrating',
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10 border-yellow-500/20',
            icon: <AlertCircle className="h-3.5 w-3.5" />,
        },
    };

    const onlineCount = devicesList.filter(
        (d: DeviceHealth) => d.status === 'online',
    ).length;
    const offlineCount = devicesList.filter(
        (d: DeviceHealth) => d.status === 'offline',
    ).length;
    const calibCount = devicesList.filter(
        (d: DeviceHealth) => d.status === 'calibrating',
    ).length;

    const handleShowQr = (device: DeviceHealth) => {
        setQrTarget(device);
        toast.success(`QR Code generated for ${device.device_code}`);
    };

    return (
        <div className="space-y-8 bg-transparent p-4 lg:p-10">
            <Head title="Device Health Status" />
            <Toaster position="top-right" theme="dark" />

            <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase">
                        <Activity className="h-8 w-8 text-cyan-400" />
                        Device Health Status
                    </h1>
                    <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                        Battery gauges · Signal meters · QR node lookup
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari node, kode, wilayah..."
                        className="w-64 rounded-xl border border-white/10 bg-white/5 py-2.5 pr-4 pl-10 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                    />
                </div>
            </header>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    {
                        label: 'Online',
                        count: onlineCount,
                        color: 'text-green-400',
                        bg: 'bg-green-500/5 border-green-500/20',
                    },
                    {
                        label: 'Offline',
                        count: offlineCount,
                        color: 'text-red-400',
                        bg: 'bg-red-500/5 border-red-500/20',
                    },
                    {
                        label: 'Calibrating',
                        count: calibCount,
                        color: 'text-yellow-400',
                        bg: 'bg-yellow-500/5 border-yellow-500/20',
                    },
                ].map((s) => (
                    <GlassCard
                        key={s.label}
                        className={cn('border p-5 text-center', s.bg)}
                    >
                        <p
                            className={cn(
                                'text-3xl font-black tracking-tighter',
                                s.color,
                            )}
                        >
                            {s.count}
                        </p>
                        <p className="mt-1 text-[9px] font-black tracking-widest text-neutral-500 uppercase">
                            {s.label}
                        </p>
                    </GlassCard>
                ))}
            </div>

            {/* Device Health Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((device: DeviceHealth, idx: number) => {
                    const cfg = statusConfig[device.status];
                    const battPct = getBatteryPct(device.battery_voltage);
                    const battColor = getBatteryColor(device.battery_voltage);

                    return (
                        <motion.div
                            key={device.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                        >
                            <GlassCard
                                className={cn('space-y-5 border p-6', cfg.bg)}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                'flex h-10 w-10 items-center justify-center rounded-xl',
                                                cfg.bg,
                                            )}
                                        >
                                            <Cpu
                                                className={cn(
                                                    'h-5 w-5',
                                                    cfg.color,
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-mono text-[9px] tracking-widest text-neutral-500">
                                                {device.device_code}
                                            </p>
                                            <h4 className="text-sm font-black text-white">
                                                {device.name}
                                            </h4>
                                        </div>
                                    </div>
                                    <span
                                        className={cn(
                                            'flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-black uppercase',
                                            cfg.bg,
                                            cfg.color,
                                        )}
                                    >
                                        {cfg.icon} {cfg.label}
                                    </span>
                                </div>

                                {/* Battery Gauge */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-neutral-500 uppercase">
                                            <Battery className="h-3.5 w-3.5" />
                                            Battery
                                        </div>
                                        <span
                                            className={cn(
                                                'font-mono text-sm font-black',
                                                battColor,
                                            )}
                                        >
                                            {device.battery_voltage}V ·{' '}
                                            {battPct}%
                                        </span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${battPct}%` }}
                                            transition={{
                                                duration: 1,
                                                ease: 'easeOut',
                                                delay: idx * 0.04,
                                            }}
                                            className={cn(
                                                'h-full rounded-full',
                                                battPct >= 60
                                                    ? 'bg-green-500'
                                                    : battPct >= 30
                                                      ? 'bg-yellow-500'
                                                      : 'bg-red-500',
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Meta */}
                                <div className="space-y-1 text-[9px] text-neutral-600">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-2.5 w-2.5" />
                                        <span>
                                            {device.region} ·{' '}
                                            {device.latitude.toFixed(4)},{' '}
                                            {device.longitude.toFixed(4)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-2.5 w-2.5" />
                                        <span>
                                            Last seen:{' '}
                                            {device.last_seen_at
                                                ? new Date(
                                                      device.last_seen_at,
                                                  ).toLocaleString('id-ID')
                                                : 'Unknown'}
                                        </span>
                                    </div>
                                </div>

                                {/* QR Button */}
                                <button
                                    onClick={() => handleShowQr(device)}
                                    className={cn(
                                        'flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-[9px] font-black tracking-widest uppercase transition-all',
                                        cfg.bg,
                                        cfg.color,
                                        'hover:opacity-80',
                                    )}
                                >
                                    <QrCode className="h-3.5 w-3.5" />
                                    Generate QR Node Card
                                </button>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </div>

            {/* QR Modal */}
            {qrTarget && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
                    onClick={() => setQrTarget(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="w-full max-w-sm space-y-5 rounded-2xl border border-white/10 bg-[#0c1425] p-8 text-center shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="flex items-center justify-center gap-2 text-sm font-black tracking-widest text-cyan-400 uppercase">
                            <QrCode className="h-5 w-5" /> Node QR Card
                        </h3>
                        {/* Simulated QR Code using CSS grid pattern */}
                        <div className="mx-auto grid h-40 w-40 grid-cols-10 grid-rows-10 gap-0.5 rounded-xl bg-white p-3">
                            {Array.from({ length: 100 }).map((_, i) => {
                                // Simulate a QR-like pattern based on device id and position
                                const seed = (qrTarget.id * 7 + i * 13) % 100;
                                const isBorder =
                                    Math.floor(i / 10) < 2 ||
                                    Math.floor(i / 10) > 7 ||
                                    i % 10 < 2 ||
                                    i % 10 > 7;
                                const isCorner =
                                    (Math.floor(i / 10) < 2 && i % 10 < 2) ||
                                    (Math.floor(i / 10) < 2 && i % 10 > 7) ||
                                    (Math.floor(i / 10) > 7 && i % 10 < 2);
                                const filled =
                                    isCorner ||
                                    (isBorder && seed > 30) ||
                                    (!isBorder && seed > 55);

                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            'rounded-sm',
                                            filled
                                                ? 'bg-black'
                                                : 'bg-transparent',
                                        )}
                                    />
                                );
                            })}
                        </div>
                        <div className="space-y-1">
                            <p className="font-mono font-black tracking-widest text-white">
                                {qrTarget.device_code}
                            </p>
                            <p className="text-xs text-neutral-400">
                                {qrTarget.name}
                            </p>
                            <p className="text-[9px] text-neutral-600">
                                {qrTarget.region}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-[9px]">
                            <div className="col-span-2 rounded-lg bg-white/5 p-2">
                                <p className="font-bold text-neutral-600 uppercase">
                                    Battery
                                </p>
                                <p
                                    className={cn(
                                        'font-mono font-black',
                                        getBatteryColor(
                                            qrTarget.battery_voltage,
                                        ),
                                    )}
                                >
                                    {qrTarget.battery_voltage}V
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setQrTarget(null)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-[10px] font-black uppercase transition-all hover:bg-white/10"
                        >
                            Tutup
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}

HealthPage.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Device Health Status',
                href: '/dashboard/technician/health',
            },
        ]}
    >
        {page}
    </AppLayout>
);

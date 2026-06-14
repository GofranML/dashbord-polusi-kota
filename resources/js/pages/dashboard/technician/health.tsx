import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
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
    QrCode
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Toaster, toast } from 'sonner';

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

    const filtered = devicesList.filter((d: DeviceHealth) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.device_code.toLowerCase().includes(search.toLowerCase()) ||
        d.region.toLowerCase().includes(search.toLowerCase())
    );



    const getBatteryPct = (v: number) => Math.min(100, Math.max(0, Math.round(((v - 3.0) / (4.2 - 3.0)) * 100)));
    const getBatteryColor = (v: number) => {
        const pct = getBatteryPct(v);
        if (pct >= 60) return 'text-green-400';
        if (pct >= 30) return 'text-yellow-400';
        return 'text-red-400';
    };

    const statusConfig = {
        online: { label: 'Online', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: <Wifi className="w-3.5 h-3.5" /> },
        offline: { label: 'Offline', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: <WifiOff className="w-3.5 h-3.5" /> },
        calibrating: { label: 'Calibrating', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: <AlertCircle className="w-3.5 h-3.5" /> },
    };

    const onlineCount = devicesList.filter((d: DeviceHealth) => d.status === 'online').length;
    const offlineCount = devicesList.filter((d: DeviceHealth) => d.status === 'offline').length;
    const calibCount = devicesList.filter((d: DeviceHealth) => d.status === 'calibrating').length;

    const handleShowQr = (device: DeviceHealth) => {
        setQrTarget(device);
        toast.success(`QR Code generated for ${device.device_code}`);
    };

    return (
        <div className="p-4 lg:p-10 space-y-8 bg-transparent">
            <Head title="Device Health Status" />
            <Toaster position="top-right" theme="dark" />

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <Activity className="w-8 h-8 text-cyan-400" />
                        Device Health Status
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        Battery gauges · Signal meters · QR node lookup
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari node, kode, wilayah..."
                        className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500/50 w-64"
                    />
                </div>
            </header>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Online', count: onlineCount, color: 'text-green-400', bg: 'bg-green-500/5 border-green-500/20' },
                    { label: 'Offline', count: offlineCount, color: 'text-red-400', bg: 'bg-red-500/5 border-red-500/20' },
                    { label: 'Calibrating', count: calibCount, color: 'text-yellow-400', bg: 'bg-yellow-500/5 border-yellow-500/20' },
                ].map(s => (
                    <GlassCard key={s.label} className={cn('p-5 text-center border', s.bg)}>
                        <p className={cn('text-3xl font-black tracking-tighter', s.color)}>{s.count}</p>
                        <p className="text-[9px] uppercase font-black tracking-widest text-neutral-500 mt-1">{s.label}</p>
                    </GlassCard>
                ))}
            </div>

            {/* Device Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                            <GlassCard className={cn('p-6 border space-y-5', cfg.bg)}>
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', cfg.bg)}>
                                            <Cpu className={cn('w-5 h-5', cfg.color)} />
                                        </div>
                                        <div>
                                            <p className="font-mono text-[9px] text-neutral-500 tracking-widest">{device.device_code}</p>
                                            <h4 className="font-black text-white text-sm">{device.name}</h4>
                                        </div>
                                    </div>
                                    <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase border', cfg.bg, cfg.color)}>
                                        {cfg.icon} {cfg.label}
                                    </span>
                                </div>

                                {/* Battery Gauge */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase font-black">
                                            <Battery className="w-3.5 h-3.5" />
                                            Battery
                                        </div>
                                        <span className={cn('font-mono font-black text-sm', battColor)}>{device.battery_voltage}V · {battPct}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${battPct}%` }}
                                            transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.04 }}
                                            className={cn('h-full rounded-full', battPct >= 60 ? 'bg-green-500' : battPct >= 30 ? 'bg-yellow-500' : 'bg-red-500')}
                                        />
                                    </div>
                                </div>



                                {/* Meta */}
                                <div className="space-y-1 text-[9px] text-neutral-600">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-2.5 h-2.5" />
                                        <span>{device.region} · {device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-2.5 h-2.5" />
                                        <span>Last seen: {device.last_seen_at ? new Date(device.last_seen_at).toLocaleString('id-ID') : 'Unknown'}</span>
                                    </div>
                                </div>

                                {/* QR Button */}
                                <button
                                    onClick={() => handleShowQr(device)}
                                    className={cn(
                                        'w-full flex items-center justify-center gap-2 py-2.5 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all',
                                        cfg.bg, cfg.color,
                                        'hover:opacity-80'
                                    )}
                                >
                                    <QrCode className="w-3.5 h-3.5" />
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
                    className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
                    onClick={() => setQrTarget(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-[#0c1425] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center space-y-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="font-black uppercase tracking-widest text-sm text-cyan-400 flex items-center justify-center gap-2">
                            <QrCode className="w-5 h-5" /> Node QR Card
                        </h3>
                        {/* Simulated QR Code using CSS grid pattern */}
                        <div className="mx-auto w-40 h-40 bg-white rounded-xl p-3 grid grid-cols-10 grid-rows-10 gap-0.5">
                            {Array.from({ length: 100 }).map((_, i) => {
                                // Simulate a QR-like pattern based on device id and position
                                const seed = (qrTarget.id * 7 + i * 13) % 100;
                                const isBorder = Math.floor(i / 10) < 2 || Math.floor(i / 10) > 7 || i % 10 < 2 || i % 10 > 7;
                                const isCorner = (Math.floor(i / 10) < 2 && i % 10 < 2) || (Math.floor(i / 10) < 2 && i % 10 > 7) || (Math.floor(i / 10) > 7 && i % 10 < 2);
                                const filled = isCorner || (isBorder && seed > 30) || (!isBorder && seed > 55);
                                return (
                                    <div key={i} className={cn('rounded-sm', filled ? 'bg-black' : 'bg-transparent')} />
                                );
                            })}
                        </div>
                        <div className="space-y-1">
                            <p className="font-mono font-black text-white tracking-widest">{qrTarget.device_code}</p>
                            <p className="text-xs text-neutral-400">{qrTarget.name}</p>
                            <p className="text-[9px] text-neutral-600">{qrTarget.region}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-[9px]">
                            <div className="p-2 bg-white/5 rounded-lg col-span-2">
                                <p className="text-neutral-600 uppercase font-bold">Battery</p>
                                <p className={cn('font-mono font-black', getBatteryColor(qrTarget.battery_voltage))}>{qrTarget.battery_voltage}V</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setQrTarget(null)}
                            className="w-full py-2.5 bg-white/5 border border-white/10 text-[10px] font-black uppercase rounded-xl hover:bg-white/10 transition-all"
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
    <AppLayout breadcrumbs={[{ title: 'Device Health Status', href: '/dashboard/technician/health' }]}>
        {page}
    </AppLayout>
);

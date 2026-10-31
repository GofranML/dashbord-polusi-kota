import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Wind,
    Droplets,
    Thermometer,
    CloudRain,
    MapPin,
    Search,
    Filter,
    Download,
    Wifi,
    AlertTriangle,
    PlusCircle,
    Settings,
    MoreHorizontal,
    Users,
    Cpu,
    Database,
    History,
    FileDown,
    LayoutGrid,
    ArrowUpRight,
    Bus,
    Shield,
    Clock,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import { toast, Toaster } from 'sonner';
import { GlassCard } from '@/components/GlassCard';
import { SensorCard } from '@/components/SensorCard';
import { LiveSyncIndicator } from '@/components/LiveSyncIndicator';
import { useLiveTelemetry } from '@/hooks/use-live-telemetry';
import AppLayout from '@/layouts/app-layout';
import { calculateIspuFromPm25, calculateIspuFromPm10 } from '@/lib/ispu';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';

export default function Dashboard() {
    const {
        auth,
        latestTelemetries = [],
        totalDevicesCount = 0,
        activeDevicesCount = 0,
        activeAlertsCount = 0,
        trendData = [],
        systemUsers = [],
    } = usePage().props as any;

    const userRole = auth.user?.role || 'Viewer / Operator';

    // Connect real-time telemetry polling hook (15s interval)
    const {
        telemetry: liveTelemetry,
        allDevices,
        isLive,
        isSyncing,
        syncStatus,
        syncStatusText,
        secondsSinceLastSync,
        hasLiveGpsFix,
        refetch: refreshTelemetry,
        togglePolling,
    } = useLiveTelemetry({
        pollingIntervalMs: 15000,
        initialData: latestTelemetries.length > 0 ? {
            device: {
                id: latestTelemetries[0].id,
                name: latestTelemetries[0].name,
                status: latestTelemetries[0].status,
                last_seen_at: null,
            },
            latest_data: {
                id: 0,
                device_id: latestTelemetries[0].id,
                datetime: new Date().toISOString(),
                pm25: latestTelemetries[0].pm25,
                pm10: latestTelemetries[0].pm10,
                pm1: latestTelemetries[0].pm1,
                gas_index: latestTelemetries[0].mq135,
                gps_lat: latestTelemetries[0].gps_lat ?? null,
                gps_lng: latestTelemetries[0].gps_lng ?? null,
                rain_status: latestTelemetries[0].rain,
                air_pressure: latestTelemetries[0].pressure,
                temperature: null,
                humidity: latestTelemetries[0].humidity,
                battery_status: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
        } : null,
    });

    // Derive current telemetries dynamically from allDevices or initial props
    const currentTelemetries = useMemo(() => {
        if (!allDevices || allDevices.length === 0) return latestTelemetries;
        return allDevices
            .filter((d) => d.latest_data !== null)
            .map((d) => {
                const ld = d.latest_data!;
                const dev = d.device;
                return {
                    id: dev.id,
                    device_code: dev.device_code || `IOT-${dev.name}`,
                    name: dev.name,
                    region: dev.region || dev.name,
                    pm25: ld.pm25 !== null ? Number(ld.pm25) : 0,
                    pm10: ld.pm10 !== null ? Number(ld.pm10) : 0,
                    pm1: ld.pm1 !== null ? Number(ld.pm1) : 0,
                    mq135: ld.gas_index !== null ? Number(ld.gas_index) : 0,
                    humidity: ld.humidity !== null ? Number(ld.humidity) : 0,
                    pressure: ld.air_pressure !== null ? Number(ld.air_pressure) : 0,
                    rain: ld.rain_status || 'Tidak Hujan',
                    status: dev.status,
                    fuzzy_score: 50,
                    fuzzy_label: 'Normal',
                    fuzzy_color: '#10B981',
                    gps_lat: ld.gps_lat,
                    gps_lng: ld.gps_lng,
                    timestamp: ld.datetime,
                };
            });
    }, [allDevices, latestTelemetries]);

    // Calculate dynamic averages based on real online telemetries
    const onlineTelemetries = currentTelemetries.filter(
        (t: any) => t.status === 'online',
    );

    const avgPm25 =
        onlineTelemetries.length > 0
            ? parseFloat(
                  (
                      onlineTelemetries.reduce(
                          (acc: number, t: any) => acc + Number(t.pm25 || 0),
                          0,
                      ) / onlineTelemetries.length
                  ).toFixed(1),
              )
            : 0;

    const avgPm10 =
        onlineTelemetries.length > 0
            ? parseFloat(
                  (
                      onlineTelemetries.reduce(
                          (acc: number, t: any) => acc + Number(t.pm10 || 0),
                          0,
                      ) / onlineTelemetries.length
                  ).toFixed(1),
              )
            : 0;

    const avgPm1 =
        onlineTelemetries.length > 0
            ? parseFloat(
                  (
                      onlineTelemetries.reduce(
                          (acc: number, t: any) => acc + Number(t.pm1 || 0),
                          0,
                      ) / onlineTelemetries.length
                  ).toFixed(1),
              )
            : 0;

    const avgMq135 =
        onlineTelemetries.length > 0
            ? Math.round(
                  onlineTelemetries.reduce(
                      (acc: number, t: any) => acc + Number(t.mq135 || 0),
                      0,
                  ) / onlineTelemetries.length,
              )
            : 0;

    const avgHumidity =
        onlineTelemetries.length > 0
            ? parseFloat(
                  (
                      onlineTelemetries.reduce(
                          (acc: number, t: any) => acc + Number(t.humidity || 0),
                          0,
                      ) / onlineTelemetries.length
                  ).toFixed(1),
              )
            : 0;

    const avgPressure =
        onlineTelemetries.length > 0
            ? parseFloat(
                  (
                      onlineTelemetries.reduce(
                          (acc: number, t: any) => acc + Number(t.pressure || 0),
                          0,
                      ) / onlineTelemetries.length
                  ).toFixed(1),
              )
            : 0;

    const rainStatus =
        onlineTelemetries.length > 0
            ? onlineTelemetries.some(
                  (t: any) => t.rain === 'Hujan' || t.rain === 'Gerimis',
              )
                ? 'Hujan/Gerimis'
                : 'Cerah'
            : 'Cerah';

    // ISPU Evaluations using official KLHK Permen LHK No. 14/2020
    const pm25Ispu = calculateIspuFromPm25(avgPm25, false);
    const pm10Ispu = calculateIspuFromPm10(avgPm10);

    const sensorData = [
        {
            title: 'PM2.5 Rata-rata',
            value: avgPm25,
            unit: 'µg/m³',
            status: pm25Ispu.category,
            icon: Wind,
            lastUpdate: 'Telemetri Terkini',
        },
        {
            title: 'PM10 Rata-rata',
            value: avgPm10,
            unit: 'µg/m³',
            status: pm10Ispu.category,
            icon: Activity,
            lastUpdate: 'Telemetri Terkini',
        },
        {
            title: 'PM1 Rata-rata',
            value: avgPm1,
            unit: 'µg/m³',
            status: avgPm1 <= 15.5 ? 'Baik' : 'Sedang',
            icon: Wind,
            lastUpdate: 'Telemetri Terkini',
        },
        {
            title: 'Indeks Gas (MQ-135)',
            value: avgMq135,
            unit: 'Index',
            status: avgMq135 > 200 ? 'Perhatian' : 'Normal',
            icon: Activity,
            lastUpdate: 'Sensitivitas Gas',
        },
        {
            title: 'Kelembapan Rata-rata',
            value: avgHumidity,
            unit: '% RH',
            status: 'Normal',
            icon: Droplets,
            lastUpdate: 'Mikroklimat',
        },
        {
            title: 'Tekanan Udara',
            value: avgPressure,
            unit: 'hPa',
            status: 'Normal',
            icon: Thermometer,
            lastUpdate: 'Barometrik',
        },
        {
            title: 'Status Cuaca',
            value: rainStatus,
            unit: '',
            status: rainStatus === 'Cerah' ? 'Normal' : 'Perhatian',
            icon: CloudRain,
            lastUpdate: 'Sensor Presipitasi',
        },
    ];

    // RBAC Permissions
    const canManageUsers = userRole === 'Super Admin';
    const canManageDevices = userRole === 'Super Admin';
    const canExportFull = ['Super Admin', 'Petugas Monitoring'].includes(
        userRole,
    );
    const canEditSettings = userRole === 'Super Admin';

    // Reactive 24-Hour Trend Data (Synthesized from DB + Live Updates)
    const liveChartData = useMemo(() => {
        if (!liveTelemetry || !liveTelemetry.datetime) return trendData;
        const timeStr = new Date(liveTelemetry.datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const existingIdx = (trendData || []).findIndex((p: any) => p.time === timeStr);
        const livePoint = {
            time: timeStr,
            pm25: Number(liveTelemetry.pm25 || 0),
            pm10: Number(liveTelemetry.pm10 || 0),
            pm1: Number(liveTelemetry.pm1 || 0),
            mq135: Number(liveTelemetry.gas_index || 0),
            humidity: Number(liveTelemetry.humidity || 0),
        };
        if (existingIdx >= 0) {
            const copy = [...trendData];
            copy[existingIdx] = livePoint;
            return copy;
        }
        return [...(trendData || []), livePoint].slice(-24);
    }, [trendData, liveTelemetry]);

    // Validate 24-Hour Trend Data sufficiency (Requirement B.5)
    const hasSufficientTrendData = Array.isArray(liveChartData) && liveChartData.length >= 2;

    return (
        <div className="space-y-8 bg-transparent p-4 lg:p-8 font-sans">
            <Head title={`PolluTrack — Pusat Kendali (${userRole})`} />
            <Toaster position="top-right" theme="dark" />

            {/* Header: Greeting & Role Information */}
            <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center border-b border-slate-800/80 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                            Sistem Intelijen Kualitas Udara
                        </span>
                        <span className="text-slate-600">•</span>
                        <div className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-cyan-400">
                            Mode: {userRole}
                        </div>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                        Pusat Kendali Telemetri Lingkungan
                    </h1>
                    <p className="text-xs text-slate-400">
                        Monitoring armada IoT bergerak Kota Palembang — Koridor Trans Musi
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/maps"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
                    >
                        <MapPin className="size-4 text-cyan-400" />
                        Buka Peta Koridor
                    </Link>
                    {canManageDevices && (
                        <Link
                            href="/dashboard/admin/devices"
                            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400"
                        >
                            <PlusCircle className="size-4" />
                            Kelola Device
                        </Link>
                    )}
                </div>
            </header>

            {/* Live Real-time Sync Status Banner */}
            <LiveSyncIndicator
                variant="full"
                isLive={isLive}
                isSyncing={isSyncing}
                syncStatus={syncStatus}
                syncStatusText={syncStatusText}
                secondsSinceLastSync={secondsSinceLastSync}
                hasLiveGpsFix={hasLiveGpsFix}
                onRefresh={refreshTelemetry}
                onToggleLive={togglePolling}
            />

            {/* Critical Environmental Alert Banner */}
            <AnimatePresence>
                {activeAlertsCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <GlassCard
                            neonColor="red"
                            className="flex flex-col justify-between gap-4 border-rose-500/30 bg-rose-500/10 p-5 md:flex-row md:items-center"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                                    <AlertTriangle className="size-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-sm font-semibold text-rose-300">
                                        Peringatan Ambang Batas Kualitas Udara
                                    </h4>
                                    <p className="text-xs text-slate-400">
                                        Sistem mendeteksi {activeAlertsCount} peringatan aktif melebihi ambang batas kategori ISPU.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard/alerts"
                                className="inline-flex items-center justify-center rounded-lg bg-rose-500/20 border border-rose-500/30 px-4 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/30"
                            >
                                Analisis Notifikasi Alert
                            </Link>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="grid gap-8 xl:grid-cols-12 items-start">
                {/* Left: Sensor Grid & Telemetry Table */}
                <div className="space-y-8 xl:col-span-8">
                    {/* Real Aggregated Sensor Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {sensorData.map((sensor, idx) => (
                            <SensorCard key={idx} {...sensor} />
                        ))}
                    </div>

                    {/* Live Telemetry Log Table */}
                    <GlassCard className="p-6 space-y-6">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-800 pb-4">
                            <div className="flex items-center gap-2.5">
                                <Database className="size-4 text-cyan-400" />
                                <h2 className="text-base font-semibold text-white">
                                    Log Telemetri Armada Terkini
                                </h2>
                            </div>
                            <div className="text-xs text-slate-400 font-mono">
                                Total Node: {totalDevicesCount} | Aktif: {activeDevicesCount}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                                    <tr>
                                        <th className="px-3 pb-3">Kode Node</th>
                                        <th className="px-3 pb-3">Lokasi / Koridor</th>
                                        <th className="px-3 pb-3 text-right">PM2.5</th>
                                        <th className="px-3 pb-3 text-center">ISPU</th>
                                        <th className="px-3 pb-3 text-center">Koneksi</th>
                                        <th className="px-3 pb-3 text-right">Waktu</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {currentTelemetries.map((telemetry: any) => {
                                        const nodeIspu = calculateIspuFromPm25(Number(telemetry.pm25 || 0), true);
                                        return (
                                            <tr
                                                key={telemetry.id}
                                                className="group transition-colors hover:bg-slate-800/40"
                                            >
                                                <td className="px-3 py-3.5 font-mono font-semibold text-cyan-400">
                                                    {telemetry.device_code}
                                                </td>
                                                <td className="px-3 py-3.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="size-3 text-slate-500" />
                                                        <span className="font-medium text-slate-300">
                                                            {telemetry.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 font-mono">
                                                            ({telemetry.region})
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3.5 text-right font-mono font-bold text-slate-100 tabular-nums">
                                                    {Number(telemetry.pm25 || 0).toFixed(1)} µg/m³
                                                </td>
                                                <td className="px-3 py-3.5 text-center">
                                                    <span
                                                        className={cn(
                                                            'inline-block px-2 py-0.5 rounded text-[10px] font-semibold border',
                                                            nodeIspu.bgClass,
                                                            nodeIspu.colorClass,
                                                            nodeIspu.borderClass
                                                        )}
                                                    >
                                                        {nodeIspu.category} ({nodeIspu.ispu})
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3.5 text-center">
                                                    <span
                                                        className={cn(
                                                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono',
                                                            telemetry.status === 'online'
                                                                ? 'text-emerald-400 bg-emerald-500/10'
                                                                : 'text-slate-400 bg-slate-800'
                                                        )}
                                                    >
                                                        <span
                                                            className={cn(
                                                                'size-1.5 rounded-full',
                                                                telemetry.status === 'online'
                                                                    ? 'bg-emerald-400'
                                                                    : 'bg-slate-500'
                                                            )}
                                                        ></span>
                                                        {telemetry.status}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3.5 text-right font-mono text-[11px] text-slate-400 tabular-nums">
                                                    {telemetry.timestamp
                                                        ? new Date(telemetry.timestamp).toLocaleTimeString('id-ID')
                                                        : 'Terkini'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>

                {/* Right: Operational Analytics & Fleet Summary */}
                <div className="space-y-8 xl:col-span-4">
                    {/* Fleet Overview Card */}
                    <GlassCard className="p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                                Ringkasan Armada Transit
                            </h3>
                            <Bus className="size-4 text-cyan-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/80">
                                <div className="text-[11px] text-slate-400 font-medium">ISPU Wilayah</div>
                                <div className="text-2xl font-bold text-white tabular-nums mt-0.5">
                                    {pm25Ispu.ispu}
                                </div>
                                <div className={cn('text-[10px] font-semibold mt-0.5', pm25Ispu.colorClass)}>
                                    {pm25Ispu.category}
                                </div>
                            </div>
                            <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/80">
                                <div className="text-[11px] text-slate-400 font-medium">Node Terhubung</div>
                                <div className="text-2xl font-bold text-cyan-400 tabular-nums mt-0.5">
                                    {activeDevicesCount}/{totalDevicesCount}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                    Palembang 1
                                </div>
                            </div>
                        </div>
                        <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                            Data telemetri disinkronisasi berkala dari armada Trans Musi di koridor Palembang.
                        </div>
                    </GlassCard>

                    {/* 24-Hour Trend Chart (Validated - Requirement B.4 & B.5) */}
                    <GlassCard className="p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div>
                                <h3 className="text-sm font-semibold text-white">
                                    Tren Temporal 24 Jam
                                </h3>
                                <p className="text-[10px] font-mono text-slate-400">
                                    Parameter PM2.5 (µg/m³)
                                </p>
                            </div>
                            <Activity className="size-4 text-cyan-400" />
                        </div>

                        {hasSufficientTrendData ? (
                            <div className="h-[220px] w-full pt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={liveChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="dashTrendGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                                        <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#0F172A',
                                                borderColor: '#334155',
                                                borderRadius: '8px',
                                                fontSize: '11px',
                                                color: '#fff',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="pm25"
                                            stroke="#06B6D4"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#dashTrendGrad)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-5 text-center space-y-2">
                                <Clock className="size-6 text-slate-500 mx-auto" />
                                <div className="text-xs font-semibold text-slate-300">
                                    Data Tren 24 Jam Belum Mencukupi
                                </div>
                                <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                                    Memerlukan akumulasi berkala titik telemetri dari armada transit untuk membentuk kurva variasi temporal harian.
                                </p>
                            </div>
                        )}
                    </GlassCard>

                    {/* Quick System Links */}
                    {canManageUsers && (
                        <GlassCard className="p-6 space-y-3">
                            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                                Akses Cepat Operasional
                            </h3>
                            <div className="space-y-2 text-xs">
                                <Link
                                    href="/dashboard/admin/devices"
                                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 hover:bg-slate-800/60 transition"
                                >
                                    <span className="text-slate-300">Manajemen Perangkat IoT</span>
                                    <ArrowUpRight className="size-3.5 text-slate-500" />
                                </Link>
                                <Link
                                    href="/dashboard/admin/users"
                                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 hover:bg-slate-800/60 transition"
                                >
                                    <span className="text-slate-300">Manajemen Akun Petugas</span>
                                    <ArrowUpRight className="size-3.5 text-slate-500" />
                                </Link>
                                <Link
                                    href="/dashboard/history"
                                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 hover:bg-slate-800/60 transition"
                                >
                                    <span className="text-slate-300">Arsip Riwayat Telemetri</span>
                                    <ArrowUpRight className="size-3.5 text-slate-500" />
                                </Link>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </main>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'PolluTrack', href: dashboard() }]}>
        {page}
    </AppLayout>
);

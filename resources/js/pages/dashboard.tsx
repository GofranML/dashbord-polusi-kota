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
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
} from 'recharts';
import { toast, Toaster } from 'sonner';
import { GlassCard } from '@/components/GlassCard';
import type { AQIStatus } from '@/components/SensorCard';
import { SensorCard } from '@/components/SensorCard';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';

// Mock Data
const chartData = [
    { time: '10:00', pm25: 45, pm10: 32, mq135: 120, humidity: 65 },
    { time: '11:00', pm25: 52, pm10: 38, mq135: 145, humidity: 62 },
    { time: '12:00', pm25: 48, pm10: 35, mq135: 130, humidity: 60 },
    { time: '13:00', pm25: 65, pm10: 42, mq135: 180, humidity: 58 },
    { time: '14:00', pm25: 78, pm10: 55, mq135: 210, humidity: 55 },
    { time: '15:00', pm25: 60, pm10: 45, mq135: 160, humidity: 57 },
    { time: '16:00', pm25: 55, pm10: 40, mq135: 140, humidity: 59 },
];

// No static sensorData, we will declare it dynamically inside the component function to access props.

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

    // Calculate dynamic averages based on latestTelemetries
    const onlineTelemetries = latestTelemetries.filter(
        (t: any) => t.status === 'online',
    );
    const avgPm25 =
        onlineTelemetries.length > 0
            ? parseFloat(
                  (
                      onlineTelemetries.reduce(
                          (acc: number, t: any) => acc + t.pm25,
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
                          (acc: number, t: any) => acc + t.pm10,
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
                          (acc: number, t: any) => acc + (t.pm1 || 0),
                          0,
                      ) / onlineTelemetries.length
                  ).toFixed(1),
              )
            : 0;
    const avgMq135 =
        onlineTelemetries.length > 0
            ? Math.round(
                  onlineTelemetries.reduce(
                      (acc: number, t: any) => acc + t.mq135,
                      0,
                  ) / onlineTelemetries.length,
              )
            : 0;

    const getAqiStatus = (pm25: number): AQIStatus => {
        if (pm25 <= 30) {
            return 'Baik';
        }

        if (pm25 <= 60) {
            return 'Memuaskan';
        }

        if (pm25 <= 90) {
            return 'Sedang';
        }

        if (pm25 <= 120) {
            return 'Rendah';
        }

        if (pm25 <= 250) {
            return 'Sangat Rendah';
        }

        return 'Kritis';
    };

    const getPm10Status = (pm10: number): AQIStatus => {
        if (pm10 <= 50) {
            return 'Baik';
        }

        if (pm10 <= 100) {
            return 'Memuaskan';
        }

        if (pm10 <= 250) {
            return 'Sedang';
        }

        if (pm10 <= 350) {
            return 'Rendah';
        }

        if (pm10 <= 430) {
            return 'Sangat Rendah';
        }

        return 'Kritis';
    };

    const getBadgeStyle = (status: AQIStatus) => {
        if (status === 'Baik') {
            return 'bg-green-500/10 text-green-400';
        }

        if (status === 'Memuaskan') {
            return 'bg-cyan-500/10 text-cyan-400';
        }

        if (status === 'Sedang') {
            return 'bg-yellow-500/10 text-yellow-400';
        }

        if (status === 'Rendah') {
            return 'bg-orange-500/10 text-orange-400';
        }

        if (status === 'Sangat Rendah') {
            return 'bg-red-500/10 text-red-400';
        }

        return 'bg-purple-500/10 text-purple-400';
    };

    const avgHumidity =
        onlineTelemetries.length > 0
            ? parseFloat(
                  (
                      onlineTelemetries.reduce(
                          (acc: number, t: any) => acc + (t.humidity || 0),
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
                          (acc: number, t: any) => acc + (t.pressure || 0),
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

    const sensorData = [
        {
            title: 'PM2.5 Rata-rata',
            value: avgPm25,
            unit: 'µg/m³',
            status: getAqiStatus(avgPm25),
            icon: Wind,
            progress: Math.min(100, Math.round((avgPm25 * 100) / 250)),
            lastUpdate: 'Just now',
        },
        {
            title: 'PM10 Rata-rata',
            value: avgPm10,
            unit: 'µg/m³',
            status: getPm10Status(avgPm10),
            icon: Wind,
            progress: Math.min(100, Math.round((avgPm10 * 100) / 430)),
            lastUpdate: 'Just now',
        },
        {
            title: 'PM1 Rata-rata',
            value: avgPm1,
            unit: 'µg/m³',
            status: getAqiStatus(avgPm1),
            icon: Wind,
            progress: Math.min(100, Math.round((avgPm1 * 100) / 250)),
            lastUpdate: 'Just now',
        },
        {
            title: 'MQ135 Rata-rata',
            value: avgMq135,
            unit: 'ppm',
            status:
                avgPm25 > 90 ? ('Rendah' as AQIStatus) : ('Baik' as AQIStatus),
            icon: Activity,
            progress: Math.min(100, Math.round(avgPm25 * 0.8)),
            lastUpdate: 'Just now',
        },
        {
            title: 'Humidity',
            value: avgHumidity,
            unit: '%',
            status: 'Baik' as AQIStatus,
            icon: Droplets,
            progress: Math.min(100, Math.round(avgHumidity)),
            lastUpdate: 'Just now',
        },
        {
            title: 'Tekanan Udara',
            value: avgPressure,
            unit: 'hPa',
            status: 'Baik' as AQIStatus,
            icon: Thermometer,
            progress: 50,
            lastUpdate: 'Just now',
        },
        {
            title: 'Status Hujan',
            value: rainStatus,
            unit: '',
            status: 'Baik' as AQIStatus,
            icon: CloudRain,
            progress: rainStatus === 'Cerah' ? 0 : 70,
            lastUpdate: 'Just now',
        },
    ];

    // RBAC Permissions
    const canManageUsers = userRole === 'Super Admin';
    const canManageDevices = userRole === 'Super Admin';
    const canExportFull = ['Super Admin', 'Petugas Monitoring'].includes(
        userRole,
    );
    const canEditSettings = userRole === 'Super Admin';

    return (
        <div className="space-y-8 bg-transparent p-4 lg:p-10">
            <Head title={`PolluTrack - ${userRole}`} />
            <Toaster position="top-right" theme="dark" />

            {/* Header: Greeting & Action */}
            <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter uppercase">
                        PolluTrack Command Center
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                            Node Cluster: Alpha //{' '}
                        </span>
                        <div className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[8px] font-black tracking-widest text-cyan-400 uppercase">
                            {userRole} Mode
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {canManageDevices && (
                        <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[10px] font-black tracking-widest text-black uppercase shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform hover:scale-105">
                            <PlusCircle className="h-4 w-4" />
                            Initialize Device
                        </button>
                    )}
                    <button className="group rounded-xl border border-white/10 bg-white/5 p-2.5 transition-colors hover:bg-white/10">
                        <Download className="h-4 w-4 text-neutral-400 group-hover:text-white" />
                    </button>
                </div>
            </header>

            {/* Critical Alert Banner (Visible for all, but action depends on role) */}
            <AnimatePresence>
                {activeAlertsCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="overflow-hidden"
                    >
                        <GlassCard
                            neonColor="red"
                            className="flex flex-col justify-between gap-6 border-red-500/20 bg-red-500/10 p-5 md:flex-row md:items-center"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
                                    <AlertTriangle className="h-6 w-6 animate-pulse text-red-500" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-sm font-black tracking-widest text-red-500 uppercase">
                                        Breach Detected: AQI Threshold Exceeded
                                    </h4>
                                    <p className="text-[10px] leading-relaxed font-bold tracking-widest text-neutral-500 uppercase">
                                        System reported {activeAlertsCount}{' '}
                                        active environmental breach alerts.{' '}
                                        {userRole === 'Super Admin'
                                            ? 'Please authorize emergency protocols.'
                                            : 'Awaiting admin instructions.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href="/dashboard/alerts"
                                    className="flex items-center justify-center rounded-lg bg-white/5 px-5 py-2 text-[10px] font-black tracking-widest uppercase transition-colors hover:bg-white/10"
                                >
                                    Analyze Alerts
                                </Link>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="grid gap-8 xl:grid-cols-12">
                {/* Left: Sensor Grid & Logs */}
                <div className="space-y-8 xl:col-span-8">
                    {/* Sensor Cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {sensorData.map((sensor, idx) => (
                            <SensorCard key={idx} {...sensor} />
                        ))}
                    </div>

                    {/* Table View (Logs) */}
                    <GlassCard className="p-8">
                        <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <Database className="h-5 w-5 text-cyan-400" />
                                <h2 className="text-lg font-black tracking-widest uppercase">
                                    Live Telemetry Log
                                </h2>
                            </div>
                            <div className="flex w-full items-center gap-2 sm:w-auto">
                                <div className="relative flex-1 sm:flex-initial">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                                    <input
                                        type="text"
                                        placeholder="Filter by Node ID..."
                                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pr-4 pl-10 text-xs focus:border-cyan-500/50 focus:outline-none"
                                    />
                                </div>
                                <button className="group rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10">
                                    <Filter className="h-4 w-4 text-neutral-500 group-hover:text-white" />
                                </button>
                                {canExportFull && (
                                    <button className="group rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10">
                                        <FileDown className="h-4 w-4 text-neutral-500 group-hover:text-white" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-white/5 text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase">
                                    <tr>
                                        <th className="px-4 pb-5">Node ID</th>
                                        <th className="px-4 pb-5">Cluster</th>
                                        <th className="px-4 pb-5 text-right">
                                            Value (PM2.5)
                                        </th>
                                        <th className="px-4 pb-5 text-center">
                                            Fuzzy Hazard Index
                                        </th>
                                        <th className="px-4 pb-5 text-center">
                                            Connection
                                        </th>
                                        <th className="px-4 pb-5 text-center">
                                            Status
                                        </th>
                                        <th className="px-4 pb-5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {latestTelemetries.map((telemetry: any) => (
                                        <tr
                                            key={telemetry.id}
                                            className="group transition-colors hover:bg-white/5"
                                        >
                                            <td className="px-4 py-5 font-mono font-bold tracking-widest text-cyan-400">
                                                {telemetry.device_code}
                                            </td>
                                            <td className="px-4 py-5">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3 w-3 text-neutral-600" />
                                                    <span className="font-bold text-neutral-300">
                                                        {telemetry.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 text-right font-mono font-black">
                                                {telemetry.pm25} µg/m³
                                            </td>
                                            <td className="px-4 py-5 text-center">
                                                <span
                                                    className={`rounded border px-2 py-0.5 text-[8px] font-black uppercase ${
                                                        telemetry.fuzzy_label ===
                                                        'Bahaya'
                                                            ? 'border-red-500/20 bg-red-500/10 text-red-400'
                                                            : telemetry.fuzzy_label ===
                                                                'Waspada'
                                                              ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'
                                                              : 'border-green-500/20 bg-green-500/10 text-green-400'
                                                    }`}
                                                >
                                                    {telemetry.fuzzy_score}% (
                                                    {telemetry.fuzzy_label})
                                                </span>
                                            </td>
                                            <td className="px-4 py-5 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Wifi
                                                        className={cn(
                                                            'h-3 w-3',
                                                            telemetry.status ===
                                                                'online'
                                                                ? 'text-green-500'
                                                                : 'text-red-500',
                                                        )}
                                                    />
                                                    <span
                                                        className={cn(
                                                            'text-[8px] font-black uppercase',
                                                            telemetry.status ===
                                                                'online'
                                                                ? 'text-green-500'
                                                                : 'text-red-500',
                                                        )}
                                                    >
                                                        {telemetry.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 text-center">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase ${getBadgeStyle(getAqiStatus(telemetry.pm25))}`}
                                                >
                                                    {getAqiStatus(
                                                        telemetry.pm25,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-4 py-5 text-right">
                                                <Link
                                                    href={`/dashboard/history?device_id=${telemetry.id}`}
                                                    className="group/btn inline-flex items-center justify-center rounded-lg p-1.5 hover:bg-white/10"
                                                >
                                                    <ArrowUpRight className="h-4 w-4 text-neutral-600 group-hover/btn:text-white" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>

                {/* Right: RBAC Specific Tools & Charts */}
                <div className="space-y-8 xl:col-span-4">
                    {/* Management Sections based on Role */}
                    <AnimatePresence mode="wait">
                        {canManageUsers ? (
                            <motion.div
                                key="admin"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <GlassCard className="border-cyan-500/20 bg-cyan-500/5 p-8">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="flex items-center gap-2 text-sm font-black tracking-widest text-cyan-400 uppercase">
                                            <Users className="h-4 w-4" />
                                            System Access
                                        </h3>
                                        <span className="text-[8px] font-black tracking-widest text-neutral-500 uppercase">
                                            {systemUsers.length > 0
                                                ? systemUsers.length
                                                : 3}{' '}
                                            Active
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {(systemUsers.length > 0
                                            ? systemUsers
                                            : [
                                                  {
                                                      id: 1,
                                                      name: 'Petugas A',
                                                      role: 'Petugas Monitoring',
                                                  },
                                                  {
                                                      id: 2,
                                                      name: 'Petugas B',
                                                      role: 'Petugas Monitoring',
                                                  },
                                                  {
                                                      id: 3,
                                                      name: 'Viewer X',
                                                      role: 'Viewer / Operator',
                                                  },
                                              ]
                                        ).map((user: any, i: number) => (
                                            <div
                                                key={user.id || i}
                                                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-black">
                                                        {user.name[0]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold">
                                                            {user.name}
                                                        </span>
                                                        <span className="text-[8px] font-black tracking-widest text-neutral-500 uppercase">
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Settings className="h-3 w-3 cursor-pointer text-neutral-500" />
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="stats"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <GlassCard className="space-y-4 p-8">
                                    <h3 className="text-sm font-black tracking-widest text-neutral-500 uppercase">
                                        Quick Statistics
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1 rounded-xl border border-white/5 bg-white/5 p-4">
                                            <p className="text-[10px] font-black text-neutral-600 uppercase">
                                                Avg AQI
                                            </p>
                                            <p className="text-2xl font-black text-orange-400">
                                                {avgPm25}
                                            </p>
                                        </div>
                                        <div className="space-y-1 rounded-xl border border-white/5 bg-white/5 p-4">
                                            <p className="text-[10px] font-black text-neutral-600 uppercase">
                                                Active Nodes
                                            </p>
                                            <p className="text-2xl font-black text-cyan-400">
                                                {activeDevicesCount}/
                                                {totalDevicesCount}
                                            </p>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Network Analytics Graph */}
                    <GlassCard className="flex h-[400px] flex-col p-8">
                        <div className="mb-8 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-black tracking-widest uppercase">
                                    Network Pulse
                                </h3>
                                <p className="text-[8px] font-black tracking-[0.3em] tracking-widest text-neutral-500 uppercase">
                                    Latency Monitor
                                </p>
                            </div>
                            <Activity className="h-4 w-4 text-cyan-400" />
                        </div>
                        <div className="w-full flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={
                                        trendData.length > 0
                                            ? trendData
                                            : chartData
                                    }
                                >
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide />
                                    <Area
                                        type="monotone"
                                        dataKey="pm25"
                                        stroke="#06b6d4"
                                        strokeWidth={3}
                                        fill="#06b6d415"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="pm10"
                                        stroke="#a855f7"
                                        strokeWidth={2}
                                        fillOpacity={0}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="pm1"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        fillOpacity={0}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-8 text-center">
                            <div>
                                <p className="text-[8px] font-black text-neutral-600 uppercase">
                                    Success Rate
                                </p>
                                <p className="text-lg font-black tracking-tighter text-green-400">
                                    99.82%
                                </p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-neutral-600 uppercase">
                                    Sync Time
                                </p>
                                <p className="text-lg font-black tracking-tighter text-white">
                                    15ms
                                </p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Export Tools Section */}
                    {canExportFull && (
                        <GlassCard className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent p-8">
                            <h3 className="mb-6 flex items-center gap-3 text-sm font-black tracking-widest uppercase">
                                <FileDown className="h-4 w-4 text-indigo-400" />
                                Export Center
                            </h3>
                            <div className="space-y-3">
                                {[
                                    'Detailed Environmental Report',
                                    'Sensor Health Analytics',
                                    'Citizen Interaction Log',
                                ].map((r, i) => (
                                    <button
                                        key={i}
                                        className="group flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10"
                                    >
                                        <span className="text-[10px] font-black tracking-widest uppercase transition-colors group-hover:text-cyan-400">
                                            {r}
                                        </span>
                                        <ArrowUpRight className="h-4 w-4 text-neutral-700 group-hover:text-white" />
                                    </button>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    {/* System Settings (Admin Only) */}
                    {canEditSettings && (
                        <GlassCard className="border-cyan-500/30 p-8">
                            <h3 className="mb-4 text-sm font-black tracking-widest uppercase">
                                System Preferences
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-2">
                                    <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                                        Alert Sensitivity
                                    </span>
                                    <span className="text-xs font-black text-cyan-400 uppercase">
                                        High
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-2">
                                    <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                                        Update Frequency
                                    </span>
                                    <span className="text-xs font-black text-cyan-400 uppercase">
                                        1s (Live)
                                    </span>
                                </div>
                                <button className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-[10px] font-black tracking-widest uppercase hover:bg-white/10">
                                    Configure Global Hooks
                                </button>
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

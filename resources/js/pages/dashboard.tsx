import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
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
    ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts';
import { SensorCard, AQIStatus } from '@/components/SensorCard';
import { GlassCard } from '@/components/GlassCard';
import { toast, Toaster } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { cn } from '@/lib/utils';

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
        systemUsers = []
    } = usePage().props as any;

    const userRole = auth.user?.role || 'Viewer / Operator';
    
    // Calculate dynamic averages based on latestTelemetries
    const onlineTelemetries = latestTelemetries.filter((t: any) => t.status === 'online');
    const avgPm25 = onlineTelemetries.length > 0 
        ? parseFloat((onlineTelemetries.reduce((acc: number, t: any) => acc + t.pm25, 0) / onlineTelemetries.length).toFixed(1))
        : 0;
    const avgPm10 = onlineTelemetries.length > 0 
        ? parseFloat((onlineTelemetries.reduce((acc: number, t: any) => acc + t.pm10, 0) / onlineTelemetries.length).toFixed(1))
        : 0;
    const avgPm1 = onlineTelemetries.length > 0 
        ? parseFloat((onlineTelemetries.reduce((acc: number, t: any) => acc + (t.pm1 || 0), 0) / onlineTelemetries.length).toFixed(1))
        : 0;
    const avgMq135 = onlineTelemetries.length > 0 
        ? Math.round(onlineTelemetries.reduce((acc: number, t: any) => acc + t.mq135, 0) / onlineTelemetries.length)
        : 0;

    const getAqiStatus = (pm25: number): AQIStatus => {
        if (pm25 <= 30) return 'Baik';
        if (pm25 <= 60) return 'Memuaskan';
        if (pm25 <= 90) return 'Sedang';
        if (pm25 <= 120) return 'Rendah';
        if (pm25 <= 250) return 'Sangat Rendah';
        return 'Kritis';
    };

    const getPm10Status = (pm10: number): AQIStatus => {
        if (pm10 <= 50) return 'Baik';
        if (pm10 <= 100) return 'Memuaskan';
        if (pm10 <= 250) return 'Sedang';
        if (pm10 <= 350) return 'Rendah';
        if (pm10 <= 430) return 'Sangat Rendah';
        return 'Kritis';
    };

    const getBadgeStyle = (status: AQIStatus) => {
        if (status === 'Baik') return 'bg-green-500/10 text-green-400';
        if (status === 'Memuaskan') return 'bg-cyan-500/10 text-cyan-400';
        if (status === 'Sedang') return 'bg-yellow-500/10 text-yellow-400';
        if (status === 'Rendah') return 'bg-orange-500/10 text-orange-400';
        if (status === 'Sangat Rendah') return 'bg-red-500/10 text-red-400';
        return 'bg-purple-500/10 text-purple-400';
    };

    const avgHumidity = onlineTelemetries.length > 0
        ? parseFloat((onlineTelemetries.reduce((acc: number, t: any) => acc + (t.humidity || 0), 0) / onlineTelemetries.length).toFixed(1))
        : 0;
    const avgPressure = onlineTelemetries.length > 0
        ? parseFloat((onlineTelemetries.reduce((acc: number, t: any) => acc + (t.pressure || 0), 0) / onlineTelemetries.length).toFixed(1))
        : 0;
    const rainStatus = onlineTelemetries.length > 0
        ? (onlineTelemetries.some((t: any) => t.rain === 'Hujan' || t.rain === 'Gerimis') ? 'Hujan/Gerimis' : 'Cerah')
        : 'Cerah';

    const sensorData = [
        { title: 'PM2.5 Rata-rata', value: avgPm25, unit: 'µg/m³', status: getAqiStatus(avgPm25), icon: Wind, progress: Math.min(100, Math.round(avgPm25 * 100 / 250)), lastUpdate: 'Just now' },
        { title: 'PM10 Rata-rata', value: avgPm10, unit: 'µg/m³', status: getPm10Status(avgPm10), icon: Wind, progress: Math.min(100, Math.round(avgPm10 * 100 / 430)), lastUpdate: 'Just now' },
        { title: 'PM1 Rata-rata', value: avgPm1, unit: 'µg/m³', status: getAqiStatus(avgPm1), icon: Wind, progress: Math.min(100, Math.round(avgPm1 * 100 / 250)), lastUpdate: 'Just now' },
        { title: 'MQ135 Rata-rata', value: avgMq135, unit: 'ppm', status: avgPm25 > 90 ? 'Rendah' as AQIStatus : 'Baik' as AQIStatus, icon: Activity, progress: Math.min(100, Math.round(avgPm25 * 0.8)), lastUpdate: 'Just now' },
        { title: 'Humidity', value: avgHumidity, unit: '%', status: 'Baik' as AQIStatus, icon: Droplets, progress: Math.min(100, Math.round(avgHumidity)), lastUpdate: 'Just now' },
        { title: 'Tekanan Udara', value: avgPressure, unit: 'hPa', status: 'Baik' as AQIStatus, icon: Thermometer, progress: 50, lastUpdate: 'Just now' },
        { title: 'Status Hujan', value: rainStatus, unit: '', status: 'Baik' as AQIStatus, icon: CloudRain, progress: rainStatus === 'Cerah' ? 0 : 70, lastUpdate: 'Just now' },
    ];

    // RBAC Permissions
    const canManageUsers = userRole === 'Super Admin';
    const canManageDevices = userRole === 'Super Admin';
    const canExportFull = ['Super Admin', 'Petugas Monitoring'].includes(userRole);
    const canEditSettings = userRole === 'Super Admin';

    return (
        <div className="p-4 lg:p-10 space-y-8 bg-transparent">
            <Head title={`Dashboard - ${userRole}`} />
            <Toaster position="top-right" theme="dark" />

            {/* Header: Greeting & Action */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Command Center</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Node Cluster: Alpha // </span>
                        <div className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase tracking-widest">
                            {userRole} Mode
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {canManageDevices && (
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <PlusCircle className="w-4 h-4" />
                            Initialize Device
                        </button>
                    )}
                    <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                        <Download className="w-4 h-4 text-neutral-400 group-hover:text-white" />
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
                        <GlassCard neonColor="red" className="p-5 bg-red-500/10 border-red-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                                    <AlertTriangle className="text-red-500 w-6 h-6 animate-pulse" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-sm font-black text-red-500 uppercase tracking-widest">Breach Detected: AQI Threshold Exceeded</h4>
                                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">
                                        System reported {activeAlertsCount} active environmental breach alerts. {userRole === 'Super Admin' ? 'Please authorize emergency protocols.' : 'Awaiting admin instructions.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link href="/dashboard/alerts" className="px-5 py-2 rounded-lg bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center">Analyze Alerts</Link>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="grid xl:grid-cols-12 gap-8">
                {/* Left: Sensor Grid & Logs */}
                <div className="xl:col-span-8 space-y-8">
                    {/* Sensor Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sensorData.map((sensor, idx) => (
                            <SensorCard key={idx} {...sensor} />
                        ))}
                    </div>

                    {/* Table View (Logs) */}
                    <GlassCard className="p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                            <div className="flex items-center gap-3">
                                <Database className="w-5 h-5 text-cyan-400" />
                                <h2 className="text-lg font-black uppercase tracking-widest">Live Telemetry Log</h2>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-initial">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                    <input 
                                        type="text" 
                                        placeholder="Filter by Node ID..." 
                                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-cyan-500/50 w-full"
                                    />
                                </div>
                                <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 group">
                                    <Filter className="w-4 h-4 text-neutral-500 group-hover:text-white" />
                                </button>
                                {canExportFull && (
                                    <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 group">
                                        <FileDown className="w-4 h-4 text-neutral-500 group-hover:text-white" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="text-[10px] uppercase text-neutral-500 font-black tracking-[0.2em] border-b border-white/5">
                                    <tr>
                                        <th className="pb-5 px-4">Node ID</th>
                                        <th className="pb-5 px-4">Cluster</th>
                                        <th className="pb-5 px-4 text-right">Value (PM2.5)</th>
                                        <th className="pb-5 px-4 text-center">Fuzzy Hazard Index</th>
                                        <th className="pb-5 px-4 text-center">Connection</th>
                                        <th className="pb-5 px-4 text-center">Status</th>
                                        <th className="pb-5 px-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {latestTelemetries.map((telemetry: any) => (
                                        <tr key={telemetry.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="py-5 px-4 font-mono text-cyan-400 font-bold tracking-widest">{telemetry.device_code}</td>
                                            <td className="py-5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-3 h-3 text-neutral-600" />
                                                    <span className="font-bold text-neutral-300">{telemetry.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4 text-right font-mono font-black">{telemetry.pm25} µg/m³</td>
                                            <td className="py-5 px-4 text-center">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                                                    telemetry.fuzzy_label === 'Bahaya' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                    telemetry.fuzzy_label === 'Waspada' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                                    'bg-green-500/10 border-green-500/20 text-green-400'
                                                }`}>
                                                    {telemetry.fuzzy_score}% ({telemetry.fuzzy_label})
                                                </span>
                                            </td>
                                            <td className="py-5 px-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Wifi className={cn("w-3 h-3", telemetry.status === 'online' ? 'text-green-500' : 'text-red-500')} />
                                                    <span className={cn("text-[8px] font-black uppercase", telemetry.status === 'online' ? 'text-green-500' : 'text-red-500')}>
                                                        {telemetry.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${getBadgeStyle(getAqiStatus(telemetry.pm25))}`}>
                                                    {getAqiStatus(telemetry.pm25)}
                                                </span>
                                            </td>
                                            <td className="py-5 px-4 text-right">
                                                <Link href={`/dashboard/history?device_id=${telemetry.id}`} className="p-1.5 hover:bg-white/10 rounded-lg group/btn inline-flex items-center justify-center">
                                                    <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover/btn:text-white" />
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
                <div className="xl:col-span-4 space-y-8">
                    {/* Management Sections based on Role */}
                    <AnimatePresence mode="wait">
                        {canManageUsers ? (
                            <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <GlassCard className="p-8 bg-cyan-500/5 border-cyan-500/20">
                                    <div className="flex items-center justify-between mb-6">
                                         <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                                             <Users className="w-4 h-4" />
                                             System Access
                                         </h3>
                                         <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">{systemUsers.length > 0 ? systemUsers.length : 3} Active</span>
                                    </div>
                                    <div className="space-y-3">
                                        {(systemUsers.length > 0 ? systemUsers : [
                                            { id: 1, name: 'Petugas A', role: 'Petugas Monitoring' },
                                            { id: 2, name: 'Petugas B', role: 'Petugas Monitoring' },
                                            { id: 3, name: 'Viewer X', role: 'Viewer / Operator' }
                                        ]).map((user: any, i: number) => (
                                            <div key={user.id || i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-black">{user.name[0]}</div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold">{user.name}</span>
                                                        <span className="text-[8px] text-neutral-500 uppercase font-black tracking-widest">{user.role}</span>
                                                    </div>
                                                </div>
                                                <Settings className="w-3 h-3 text-neutral-500 cursor-pointer" />
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ) : (
                            <motion.div key="stats" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <GlassCard className="p-8 space-y-4">
                                     <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">Quick Statistics</h3>
                                     <div className="grid grid-cols-2 gap-4">
                                         <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-1">
                                             <p className="text-[10px] text-neutral-600 font-black uppercase">Avg AQI</p>
                                             <p className="text-2xl font-black text-orange-400">{avgPm25}</p>
                                         </div>
                                         <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-1">
                                             <p className="text-[10px] text-neutral-600 font-black uppercase">Active Nodes</p>
                                             <p className="text-2xl font-black text-cyan-400">{activeDevicesCount}/{totalDevicesCount}</p>
                                         </div>
                                     </div>
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Network Analytics Graph */}
                    <GlassCard className="p-8 h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                             <div className="space-y-0.5">
                                 <h3 className="text-sm font-black uppercase tracking-widest">Network Pulse</h3>
                                 <p className="text-[8px] text-neutral-500 uppercase font-black tracking-widest tracking-[0.3em]">Latency Monitor</p>
                             </div>
                             <Activity className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData.length > 0 ? trendData : chartData}>
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide />
                                    <Area type="monotone" dataKey="pm25" stroke="#06b6d4" strokeWidth={3} fill="#06b6d415" />
                                    <Area type="monotone" dataKey="pm10" stroke="#a855f7" strokeWidth={2} fillOpacity={0} />
                                    <Area type="monotone" dataKey="pm1" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4 text-center">
                             <div>
                                 <p className="text-[8px] text-neutral-600 uppercase font-black">Success Rate</p>
                                 <p className="text-lg font-black text-green-400 tracking-tighter">99.82%</p>
                             </div>
                             <div>
                                 <p className="text-[8px] text-neutral-600 uppercase font-black">Sync Time</p>
                                 <p className="text-lg font-black text-white tracking-tighter">15ms</p>
                             </div>
                        </div>
                    </GlassCard>

                    {/* Export Tools Section */}
                    {canExportFull && (
                        <GlassCard className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                                <FileDown className="w-4 h-4 text-indigo-400" />
                                Export Center
                            </h3>
                            <div className="space-y-3">
                                {['Detailed Environmental Report', 'Sensor Health Analytics', 'Citizen Interaction Log'].map((r, i) => (
                                    <button key={i} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-cyan-400 transition-colors">{r}</span>
                                        <ArrowUpRight className="w-4 h-4 text-neutral-700 group-hover:text-white" />
                                    </button>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    {/* System Settings (Admin Only) */}
                    {canEditSettings && (
                        <GlassCard className="p-8 border-cyan-500/30">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-4">System Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-2">
                                     <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Alert Sensitivity</span>
                                     <span className="text-xs font-black text-cyan-400 uppercase">High</span>
                                </div>
                                <div className="flex items-center justify-between p-2">
                                     <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Update Frequency</span>
                                     <span className="text-xs font-black text-cyan-400 uppercase">1s (Live)</span>
                                </div>
                                <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10">Configure Global Hooks</button>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </main>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Command Center', href: dashboard() }]}>
        {page}
    </AppLayout>
);

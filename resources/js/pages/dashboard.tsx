import { Head, usePage } from '@inertiajs/react';
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

const sensorData = [
    { title: 'PM2.5', value: 78.4, unit: 'µg/m³', status: 'Tidak Sehat' as AQIStatus, icon: Wind, progress: 75, battery: 85, lastUpdate: '2m ago' },
    { title: 'PM10', value: 45.2, unit: 'µg/m³', status: 'Sedang' as AQIStatus, icon: Wind, progress: 45, battery: 92, lastUpdate: '1m ago' },
    { title: 'MQ135', value: 210, unit: 'ppm', status: 'Tidak Sehat' as AQIStatus, icon: Activity, progress: 68, battery: 78, lastUpdate: '5m ago' },
    { title: 'Humidity', value: 65, unit: '%', status: 'Baik' as AQIStatus, icon: Droplets, progress: 65, battery: 88, lastUpdate: '30s ago' },
    { title: 'Tekanan Udara', value: 1012, unit: 'hPa', status: 'Baik' as AQIStatus, icon: Thermometer, progress: 50, battery: 95, lastUpdate: '4m ago' },
    { title: 'Status Hujan', value: 'Cerah', unit: '', status: 'Baik' as AQIStatus, icon: CloudRain, progress: 0, battery: 90, lastUpdate: '10s ago' },
];

export default function Dashboard() {
    const { auth } = usePage().props;
    const userRole = auth.user?.role || 'Viewer / Operator';
    
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
                {sensorData[0].status === 'Tidak Sehat' && (
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
                                        Sudirman Sector SC-001 reported 78.4 PM2.5. {userRole === 'Super Admin' ? 'Please authorize emergency protocols.' : 'Awaiting admin instructions.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-5 py-2 rounded-lg bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">Analyze</button>
                                {canManageDevices && (
                                    <button className="px-5 py-2 rounded-lg bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                        Action
                                    </button>
                                )}
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
                                        <th className="pb-5 px-4 text-center">Connection</th>
                                        <th className="pb-5 px-4 text-center">Status</th>
                                        <th className="pb-5 px-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="py-5 px-4 font-mono text-cyan-400 font-bold tracking-widest">SC-N{i}v2</td>
                                            <td className="py-5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-3 h-3 text-neutral-600" />
                                                    <span className="font-bold text-neutral-300">Sector {i === 1 ? 'Sudirman' : 'Thamrin'}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4 text-right font-mono font-black">{78 + i}.{i}</td>
                                            <td className="py-5 px-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Wifi className="w-3 h-3 text-green-500" />
                                                    <span className="text-[8px] font-black uppercase text-green-500">Live</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${i === 1 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                                    {i === 1 ? 'Alert' : 'Nominal'}
                                                </span>
                                            </td>
                                            <td className="py-5 px-4 text-right">
                                                <button className="p-1.5 hover:bg-white/10 rounded-lg group/btn">
                                                    <MoreHorizontal className="w-4 h-4 text-neutral-600 group-hover/btn:text-white" />
                                                </button>
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
                                         <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">6 Active</span>
                                    </div>
                                    <div className="space-y-3">
                                        {['Petugas A', 'Petugas B', 'Viewer X'].map((n, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-black">{n[0]}</div>
                                                    <span className="text-xs font-bold">{n}</span>
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
                                             <p className="text-2xl font-black text-orange-400">72.4</p>
                                         </div>
                                         <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-1">
                                             <p className="text-[10px] text-neutral-600 font-black uppercase">Active Nodes</p>
                                             <p className="text-2xl font-black text-cyan-400">24/24</p>
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
                                <AreaChart data={chartData}>
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide />
                                    <Area type="monotone" dataKey="pm25" stroke="#06b6d4" strokeWidth={3} fill="#06b6d415" />
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

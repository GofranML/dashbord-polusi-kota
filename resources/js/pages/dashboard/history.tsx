import { Head, Link, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { 
    History as HistoryIcon,
    Calendar,
    Cpu,
    Download,
    FileDown,
    Activity,
    Wind,
    Droplets,
    Thermometer
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { cn } from '@/lib/utils';
import { toast, Toaster } from 'sonner';

export default function HistoryPage() {
    const { 
        devices = [], 
        selectedDeviceId, 
        startDate, 
        endDate, 
        chartData = [] 
    } = usePage().props as any;

    const [deviceId, setDeviceId] = useState(selectedDeviceId || '');
    const [start, setStart] = useState(startDate || '');
    const [end, setEnd] = useState(endDate || '');
    
    // Series active toggles
    const [activeSeries, setActiveSeries] = useState({
        pm25: true,
        pm10: false,
        pm1: false,
        mq135: false,
        humidity: false
    });

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/dashboard/history', {
            device_id: deviceId,
            start_date: start,
            end_date: end
        }, {
            preserveState: true,
            onSuccess: () => toast.success('Filters applied successfully.')
        });
    };

    const handleExport = (type: 'csv' | 'excel') => {
        if (!deviceId) {
            toast.error('Please select a device node first.');
            return;
        }
        const route = type === 'csv' ? '/dashboard/export/csv' : '/dashboard/export/excel';
        const url = `${route}?device_id=${deviceId}&start_date=${start}&end_date=${end}`;
        window.open(url, '_blank');
        toast.success(`Downloading ${type.toUpperCase()} telemetry log...`);
    };

    const toggleSeries = (key: keyof typeof activeSeries) => {
        setActiveSeries(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="p-4 lg:p-10 space-y-8 bg-transparent">
            <Head title="Riwayat Telemetri IoT" />
            <Toaster position="top-right" theme="dark" />

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <HistoryIcon className="w-8 h-8 text-cyan-400" />
                        Riwayat Telemetri
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        Historical charts & Multi-node telemetry logs exporter
                    </p>
                </div>
            </header>

            {/* Filter Panel */}
            <GlassCard className="p-6">
                <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 flex items-center gap-2">
                            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                            Pilih Node Stasiun
                        </label>
                        <select 
                            value={deviceId} 
                            onChange={(e) => setDeviceId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                        >
                            <option value="" className="bg-neutral-950">-- Pilih Sensor Node --</option>
                            {devices.map((dev: any) => (
                                <option key={dev.id} value={dev.id} className="bg-neutral-950">
                                    {dev.device_code} - {dev.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                            Tanggal Mulai
                        </label>
                        <input 
                            type="date"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                            Tanggal Selesai
                        </label>
                        <input 
                            type="date"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    >
                        Terapkan Filter
                    </button>
                </form>
            </GlassCard>

            {/* Visualizer & Exports */}
            {chartData.length > 0 ? (
                <div className="grid xl:grid-cols-12 gap-8">
                    {/* Recharts Analytics Panel */}
                    <div className="xl:col-span-8 space-y-6">
                        <GlassCard className="p-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black uppercase tracking-tight text-white">Visualisasi Tren Parameter</h3>
                                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">Tekan tombol parameter untuk menyembunyikan/menampilkan data</p>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { key: 'pm25', label: 'PM2.5', color: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/5', activeColor: 'bg-cyan-500 text-black' },
                                        { key: 'pm10', label: 'PM10', color: 'border-purple-500/50 text-purple-400 bg-purple-500/5', activeColor: 'bg-purple-500 text-white' },
                                        { key: 'pm1', label: 'PM1', color: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/5', activeColor: 'bg-emerald-500 text-black' },
                                        { key: 'mq135', label: 'MQ135', color: 'border-orange-500/50 text-orange-400 bg-orange-500/5', activeColor: 'bg-orange-500 text-white' },
                                        { key: 'humidity', label: 'Kelembaban', color: 'border-blue-500/50 text-blue-400 bg-blue-500/5', activeColor: 'bg-blue-500 text-white' }
                                    ].map(btn => (
                                        <button 
                                            key={btn.key} 
                                            onClick={() => toggleSeries(btn.key as any)}
                                            className={cn(
                                                "px-3 py-1.5 border rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                                activeSeries[btn.key as keyof typeof activeSeries] ? btn.activeColor : btn.color
                                            )}
                                        >
                                            {btn.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="time" stroke="#ffffff10" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#ffffff10" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '10px' }}
                                            itemStyle={{ fontWeight: 'bold' }}
                                        />
                                        {activeSeries.pm25 && <Line type="monotone" dataKey="pm25" name="PM2.5" stroke="#06b6d4" strokeWidth={3} activeDot={{ r: 6 }} dot={false} />}
                                        {activeSeries.pm10 && <Line type="monotone" dataKey="pm10" name="PM10" stroke="#a855f7" strokeWidth={2} dot={false} />}
                                        {activeSeries.pm1 && <Line type="monotone" dataKey="pm1" name="PM1" stroke="#10b981" strokeWidth={2} dot={false} />}
                                        {activeSeries.mq135 && <Line type="monotone" dataKey="mq135" name="MQ135 (ppm)" stroke="#f97316" strokeWidth={2} dot={false} />}
                                        {activeSeries.humidity && <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#3b82f6" strokeWidth={2} dot={false} />}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Export Center Side Column */}
                    <div className="xl:col-span-4 space-y-6">
                        <GlassCard className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
                            <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-3">
                                <FileDown className="w-5 h-5" />
                                Export Center
                            </h3>
                            <p className="text-xs text-neutral-400 mb-6 uppercase tracking-widest font-bold leading-relaxed">
                                Unduh berkas telemetri sesuai dengan filter rentang tanggal yang Anda tetapkan.
                            </p>
                            
                            <div className="space-y-3">
                                <button 
                                    onClick={() => handleExport('csv')}
                                    className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300 group-hover:text-cyan-400 transition-colors">
                                        Unduh Log Telemetri (.CSV)
                                    </span>
                                    <Download className="w-4 h-4 text-neutral-500 group-hover:text-white" />
                                </button>

                                <button 
                                    onClick={() => handleExport('excel')}
                                    className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300 group-hover:text-cyan-400 transition-colors">
                                        Unduh Spreadsheet Excel (.XLS)
                                    </span>
                                    <Download className="w-4 h-4 text-neutral-500 group-hover:text-white" />
                                </button>
                            </div>
                        </GlassCard>

                        {/* Summary Info */}
                        <GlassCard className="p-6 space-y-4">
                            <h4 className="text-[10px] uppercase font-black tracking-widest text-neutral-500">Metadata Pencarian</h4>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-neutral-500">Jumlah Sampel</span>
                                    <span className="font-mono font-bold text-white">{chartData.length} Data</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-neutral-500">Rata-rata PM2.5</span>
                                    <span className="font-mono font-bold text-cyan-400">
                                        {(chartData.reduce((acc: number, log: any) => acc + log.pm25, 0) / chartData.length).toFixed(2)} µg/m³
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-neutral-500">Rata-rata PM1</span>
                                    <span className="font-mono font-bold text-emerald-400">
                                        {(chartData.reduce((acc: number, log: any) => acc + (log.pm1 || 0), 0) / chartData.length).toFixed(2)} µg/m³
                                    </span>
                                </div>
                                <div className="flex justify-between pb-1">
                                    <span className="text-neutral-500">Kondisi Dominan</span>
                                    <span className="font-bold text-white">
                                        {chartData[0]?.weather || 'Cerah'}
                                    </span>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            ) : (
                <GlassCard className="p-12 text-center flex flex-col items-center justify-center space-y-4 border-dashed border-white/10">
                    <Activity className="w-12 h-12 text-neutral-600 animate-pulse" />
                    <div className="space-y-1">
                        <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Tidak Ada Data Telemetri</h3>
                        <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Silakan pilih stasiun node dan rentang tanggal yang valid untuk memuat grafik.</p>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}

HistoryPage.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Riwayat Telemetri', href: '/dashboard/history' }]}>
        {page}
    </AppLayout>
);

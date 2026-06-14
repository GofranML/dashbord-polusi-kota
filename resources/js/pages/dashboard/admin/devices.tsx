import { Head, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    Cpu,
    PlusCircle,
    Edit3,
    Trash2,
    X,
    Sliders,
    MapPin,
    Wifi,
    WifiOff,
    AlertCircle,
    Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { toast, Toaster } from 'sonner';

interface DeviceRecord {
    id: number;
    device_code: string;
    name: string;
    lat: number;
    lng: number;
    region: string;
    status: 'online' | 'offline' | 'calibrating';
    battery_voltage: number;
    api_token: string;
    last_seen_at: string | null;
    created_at: string;
}

const emptyDeviceForm = {
    device_code: '', name: '', latitude: '', longitude: '', region: '', status: 'online'
};

export default function DevicesPage() {
    const { devicesList = [] } = usePage().props as any;

    const [modal, setModal] = useState<'create' | 'edit' | 'delete' | 'token' | null>(null);
    const [selected, setSelected] = useState<DeviceRecord | null>(null);
    const [form, setForm] = useState({ ...emptyDeviceForm });

    const openCreate = () => { setForm({ ...emptyDeviceForm }); setModal('create'); };
    const openEdit = (d: DeviceRecord) => {
        setSelected(d);
        setForm({ device_code: d.device_code, name: d.name, latitude: String(d.lat), longitude: String(d.lng), region: d.region, status: d.status });
        setModal('edit');
    };
    const openDelete = (d: DeviceRecord) => { setSelected(d); setModal('delete'); };
    const openToken = (d: DeviceRecord) => { setSelected(d); setModal('token'); };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/dashboard/admin/devices', form, {
            onSuccess: () => { toast.success('Sensor node berhasil diinisialisasi!'); setModal(null); },
            onError: (errs) => toast.error(Object.values(errs)[0] as string)
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;
        router.post(`/dashboard/admin/devices/${selected.id}/update`, form, {
            onSuccess: () => { toast.success('Konfigurasi sensor diperbarui!'); setModal(null); },
            onError: (errs) => toast.error(Object.values(errs)[0] as string)
        });
    };

    const handleDelete = () => {
        if (!selected) return;
        router.delete(`/dashboard/admin/devices/${selected.id}`, {
            onSuccess: () => { toast.success('Sensor node dihapus dari registry.'); setModal(null); },
            onError: () => toast.error('Gagal menghapus sensor.')
        });
    };



    const handleGenerateToken = () => {
        if (!selected) return;
        router.post(`/dashboard/admin/devices/${selected.id}/token`, {}, {
            onSuccess: () => toast.success('API Token baru berhasil digenerate!'),
            onError: () => toast.error('Gagal generate token baru.')
        });
    };

    const statusIcon = (status: string) => {
        if (status === 'online') return <Wifi className="w-4 h-4 text-green-400" />;
        if (status === 'offline') return <WifiOff className="w-4 h-4 text-red-400" />;
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    };

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            online: 'bg-green-500/10 text-green-400 border-green-500/20',
            offline: 'bg-red-500/10 text-red-400 border-red-500/20',
            calibrating: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
        };
        return map[status] ?? 'bg-white/5 text-neutral-400 border-white/10';
    };

    const getBatteryColor = (v: number) => v >= 3.8 ? 'text-green-400' : v >= 3.3 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="p-4 lg:p-10 space-y-8 bg-transparent">
            <Head title="Device IoT Management" />
            <Toaster position="top-right" theme="dark" />

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <Cpu className="w-8 h-8 text-cyan-400" />
                        Device IoT CRUD
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        {devicesList.filter((d: DeviceRecord) => d.status === 'online').length} online · {devicesList.length} total registered nodes
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                >
                    <PlusCircle className="w-4 h-4" />
                    Register Sensor Node
                </button>
            </header>

            {/* Device Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {devicesList.map((device: DeviceRecord, idx: number) => (
                    <motion.div
                        key={device.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                    >
                        <GlassCard className={cn('p-6 space-y-4 border', statusBadge(device.status))}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    {statusIcon(device.status)}
                                    <div>
                                        <p className="font-mono text-[9px] text-neutral-500 tracking-widest">{device.device_code}</p>
                                        <h4 className="font-black text-white text-sm">{device.name}</h4>
                                    </div>
                                </div>
                                <span className={cn('px-2 py-0.5 rounded-full text-[8px] font-black uppercase border', statusBadge(device.status))}>
                                    {device.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-[10px]">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <p className="text-neutral-600 font-bold uppercase">Battery</p>
                                    <p className={cn('font-mono font-black', getBatteryColor(device.battery_voltage))}>
                                        {device.battery_voltage}V
                                    </p>
                                </div>
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <p className="text-neutral-600 font-bold uppercase">Region</p>
                                    <p className="font-bold text-neutral-300 truncate">{device.region}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-[9px] text-neutral-600">
                                <MapPin className="w-3 h-3" />
                                <span>{device.lat.toFixed(4)}, {device.lng.toFixed(4)}</span>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-white/5">
                                <button
                                    onClick={() => openToken(device)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase rounded-lg hover:bg-emerald-500/20 transition-all"
                                >
                                    <Key className="w-3 h-3" /> Token
                                </button>
                                <button
                                    onClick={() => openEdit(device)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase rounded-lg hover:bg-cyan-500/20 transition-all"
                                >
                                    <Edit3 className="w-3 h-3" /> Edit
                                </button>
                                <button
                                    onClick={() => openDelete(device)}
                                    className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {(modal === 'create' || modal === 'edit') && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={(e) => e.target === e.currentTarget && setModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-[#0c1425] border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                                    <Cpu className="w-5 h-5 text-cyan-400" />
                                    {modal === 'create' ? 'Register Sensor Node' : 'Edit Sensor Node'}
                                </h3>
                                <button onClick={() => setModal(null)}><X className="w-5 h-5 text-neutral-500" /></button>
                            </div>
                            <form onSubmit={modal === 'create' ? handleCreate : handleEdit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { key: 'device_code', label: 'Kode Sensor', disabled: modal === 'edit' },
                                        { key: 'name', label: 'Nama Lokasi' },
                                        { key: 'latitude', label: 'Latitude' },
                                        { key: 'longitude', label: 'Longitude' },
                                        { key: 'region', label: 'Region/Wilayah' },
                                    ].map(f => (
                                        <div key={f.key} className={f.key === 'region' ? 'col-span-2' : ''}>
                                            <label className="text-[9px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">{f.label}</label>
                                            <input
                                                type="text"
                                                value={(form as any)[f.key]}
                                                onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                                disabled={f.disabled}
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50 disabled:opacity-50"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">Status</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                                    >
                                        {['online', 'offline', 'calibrating'].map(s => (
                                            <option key={s} value={s} className="bg-neutral-950 capitalize">{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all mt-2">
                                    {modal === 'create' ? 'Register Node' : 'Simpan Konfigurasi'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}



                {modal === 'delete' && selected && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={(e) => e.target === e.currentTarget && setModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-[#0c1425] border border-red-500/20 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center"
                        >
                            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="font-black uppercase text-sm mb-2">Hapus Sensor Node?</h3>
                            <p className="text-xs text-neutral-400 mb-6">
                                Node <span className="text-white font-bold">{selected.device_code}</span> ({selected.name}) akan dihapus permanen beserta seluruh histori telemetrinya.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setModal(null)} className="flex-1 py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase rounded-xl hover:bg-white/10">Batal</button>
                                <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase rounded-xl transition-all">Hapus Node</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {modal === 'token' && selected && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={(e) => e.target === e.currentTarget && setModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-[#0c1425] border border-emerald-500/20 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                                    <Key className="w-5 h-5 text-emerald-400" /> Device API Token
                                </h3>
                                <button onClick={() => setModal(null)}><X className="w-5 h-5 text-neutral-500" /></button>
                            </div>
                            <p className="text-xs text-neutral-400 mb-6">Device: <span className="text-white font-bold">{selected.device_code}</span> ({selected.name})</p>
                            
                            <div className="space-y-6">
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-emerald-500">Current Token (Bearer)</label>
                                    <div className="font-mono text-xs text-emerald-400 bg-black/50 p-3 rounded-lg break-all select-all">
                                        {selected.api_token || <span className="text-neutral-500 italic">No token assigned yet.</span>}
                                    </div>
                                    <p className="text-[9px] text-neutral-400 italic">Use this token in the Authorization header to authenticate requests from this device.</p>
                                </div>
                                <button onClick={handleGenerateToken} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                                    Generate New Token
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

DevicesPage.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Device IoT CRUD', href: '/dashboard/admin/devices' }]}>
        {page}
    </AppLayout>
);

import { Head, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Key,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

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
    device_code: '',
    name: '',
    latitude: '',
    longitude: '',
    region: '',
    status: 'online',
};

export default function DevicesPage() {
    const { devicesList = [] } = usePage().props as any;

    const [modal, setModal] = useState<
        'create' | 'edit' | 'delete' | 'token' | null
    >(null);
    const [selected, setSelected] = useState<DeviceRecord | null>(null);
    const [form, setForm] = useState({ ...emptyDeviceForm });

    const openCreate = () => {
        setForm({ ...emptyDeviceForm });
        setModal('create');
    };
    const openEdit = (d: DeviceRecord) => {
        setSelected(d);
        setForm({
            device_code: d.device_code,
            name: d.name,
            latitude: String(d.lat),
            longitude: String(d.lng),
            region: d.region,
            status: d.status,
        });
        setModal('edit');
    };
    const openDelete = (d: DeviceRecord) => {
        setSelected(d);
        setModal('delete');
    };
    const openToken = (d: DeviceRecord) => {
        setSelected(d);
        setModal('token');
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/dashboard/admin/devices', form, {
            onSuccess: () => {
                toast.success('Sensor node berhasil diinisialisasi!');
                setModal(null);
            },
            onError: (errs) => toast.error(Object.values(errs)[0] as string),
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selected) {
            return;
        }

        router.post(`/dashboard/admin/devices/${selected.id}/update`, form, {
            onSuccess: () => {
                toast.success('Konfigurasi sensor diperbarui!');
                setModal(null);
            },
            onError: (errs) => toast.error(Object.values(errs)[0] as string),
        });
    };

    const handleDelete = () => {
        if (!selected) {
            return;
        }

        router.delete(`/dashboard/admin/devices/${selected.id}`, {
            onSuccess: () => {
                toast.success('Sensor node dihapus dari registry.');
                setModal(null);
            },
            onError: () => toast.error('Gagal menghapus sensor.'),
        });
    };

    const handleGenerateToken = () => {
        if (!selected) {
            return;
        }

        router.post(
            `/dashboard/admin/devices/${selected.id}/token`,
            {},
            {
                onSuccess: () =>
                    toast.success('API Token baru berhasil digenerate!'),
                onError: () => toast.error('Gagal generate token baru.'),
            },
        );
    };

    const statusIcon = (status: string) => {
        if (status === 'online') {
            return <Wifi className="h-4 w-4 text-green-400" />;
        }

        if (status === 'offline') {
            return <WifiOff className="h-4 w-4 text-red-400" />;
        }

        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    };

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            online: 'bg-green-500/10 text-green-400 border-green-500/20',
            offline: 'bg-red-500/10 text-red-400 border-red-500/20',
            calibrating:
                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        };

        return map[status] ?? 'bg-white/5 text-neutral-400 border-white/10';
    };

    const getBatteryColor = (v: number) =>
        v >= 3.8
            ? 'text-green-400'
            : v >= 3.3
              ? 'text-yellow-400'
              : 'text-red-400';

    return (
        <div className="space-y-8 bg-transparent p-4 lg:p-10">
            <Head title="PolluTrack Device Management" />
            <Toaster position="top-right" theme="dark" />

            <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase">
                        <Cpu className="h-8 w-8 text-cyan-400" />
                        Device IoT CRUD
                    </h1>
                    <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                        {
                            devicesList.filter(
                                (d: DeviceRecord) => d.status === 'online',
                            ).length
                        }{' '}
                        online · {devicesList.length} total registered nodes
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[10px] font-black tracking-widest text-black uppercase transition-transform hover:scale-105"
                >
                    <PlusCircle className="h-4 w-4" />
                    Register Sensor Node
                </button>
            </header>

            {/* Device Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {devicesList.map((device: DeviceRecord, idx: number) => (
                    <motion.div
                        key={device.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                    >
                        <GlassCard
                            className={cn(
                                'space-y-4 border p-6',
                                statusBadge(device.status),
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    {statusIcon(device.status)}
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
                                        'rounded-full border px-2 py-0.5 text-[8px] font-black uppercase',
                                        statusBadge(device.status),
                                    )}
                                >
                                    {device.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-[10px]">
                                <div className="rounded-lg bg-white/5 p-2">
                                    <p className="font-bold text-neutral-600 uppercase">
                                        Battery
                                    </p>
                                    <p
                                        className={cn(
                                            'font-mono font-black',
                                            getBatteryColor(
                                                device.battery_voltage,
                                            ),
                                        )}
                                    >
                                        {device.battery_voltage}V
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white/5 p-2">
                                    <p className="font-bold text-neutral-600 uppercase">
                                        Region
                                    </p>
                                    <p className="truncate font-bold text-neutral-300">
                                        {device.region}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-[9px] text-neutral-600">
                                <MapPin className="h-3 w-3" />
                                <span>
                                    {device.lat.toFixed(4)},{' '}
                                    {device.lng.toFixed(4)}
                                </span>
                            </div>

                            <div className="flex gap-2 border-t border-white/5 pt-2">
                                <button
                                    onClick={() => openToken(device)}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 py-2 text-[9px] font-black text-emerald-400 uppercase transition-all hover:bg-emerald-500/20"
                                >
                                    <Key className="h-3 w-3" /> Token
                                </button>
                                <button
                                    onClick={() => openEdit(device)}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 py-2 text-[9px] font-black text-cyan-400 uppercase transition-all hover:bg-cyan-500/20"
                                >
                                    <Edit3 className="h-3 w-3" /> Edit
                                </button>
                                <button
                                    onClick={() => openDelete(device)}
                                    className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500/20"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
                        onClick={(e) =>
                            e.target === e.currentTarget && setModal(null)
                        }
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c1425] p-8 shadow-2xl"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-sm font-black tracking-widest uppercase">
                                    <Cpu className="h-5 w-5 text-cyan-400" />
                                    {modal === 'create'
                                        ? 'Register Sensor Node'
                                        : 'Edit Sensor Node'}
                                </h3>
                                <button onClick={() => setModal(null)}>
                                    <X className="h-5 w-5 text-neutral-500" />
                                </button>
                            </div>
                            <form
                                onSubmit={
                                    modal === 'create'
                                        ? handleCreate
                                        : handleEdit
                                }
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        {
                                            key: 'device_code',
                                            label: 'Kode Sensor',
                                            disabled: modal === 'edit',
                                        },
                                        { key: 'name', label: 'Nama Lokasi' },
                                        { key: 'latitude', label: 'Latitude' },
                                        {
                                            key: 'longitude',
                                            label: 'Longitude',
                                        },
                                        {
                                            key: 'region',
                                            label: 'Region/Wilayah',
                                        },
                                    ].map((f) => (
                                        <div
                                            key={f.key}
                                            className={
                                                f.key === 'region'
                                                    ? 'col-span-2'
                                                    : ''
                                            }
                                        >
                                            <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-500 uppercase">
                                                {f.label}
                                            </label>
                                            <input
                                                type="text"
                                                value={(form as any)[f.key]}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        [f.key]: e.target.value,
                                                    }))
                                                }
                                                disabled={f.disabled}
                                                required
                                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-500/50 focus:outline-none disabled:opacity-50"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-500 uppercase">
                                        Status
                                    </label>
                                    <select
                                        value={form.status}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                status: e.target.value,
                                            }))
                                        }
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                                    >
                                        {[
                                            'online',
                                            'offline',
                                            'calibrating',
                                        ].map((s) => (
                                            <option
                                                key={s}
                                                value={s}
                                                className="bg-neutral-950 capitalize"
                                            >
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="mt-2 w-full rounded-xl bg-cyan-500 py-3 text-[10px] font-black tracking-widest text-black uppercase transition-all hover:bg-cyan-600"
                                >
                                    {modal === 'create'
                                        ? 'Register Node'
                                        : 'Simpan Konfigurasi'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {modal === 'delete' && selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
                        onClick={(e) =>
                            e.target === e.currentTarget && setModal(null)
                        }
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#0c1425] p-8 text-center shadow-2xl"
                        >
                            <Trash2 className="mx-auto mb-4 h-12 w-12 text-red-500" />
                            <h3 className="mb-2 text-sm font-black uppercase">
                                Hapus Sensor Node?
                            </h3>
                            <p className="mb-6 text-xs text-neutral-400">
                                Node{' '}
                                <span className="font-bold text-white">
                                    {selected.device_code}
                                </span>{' '}
                                ({selected.name}) akan dihapus permanen beserta
                                seluruh histori telemetrinya.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setModal(null)}
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-[10px] font-black uppercase hover:bg-white/10"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 rounded-xl bg-red-500 py-3 text-[10px] font-black text-white uppercase transition-all hover:bg-red-600"
                                >
                                    Hapus Node
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {modal === 'token' && selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
                        onClick={(e) =>
                            e.target === e.currentTarget && setModal(null)
                        }
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="w-full max-w-lg rounded-2xl border border-emerald-500/20 bg-[#0c1425] p-8 shadow-2xl"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-sm font-black tracking-widest uppercase">
                                    <Key className="h-5 w-5 text-emerald-400" />{' '}
                                    Device API Token
                                </h3>
                                <button onClick={() => setModal(null)}>
                                    <X className="h-5 w-5 text-neutral-500" />
                                </button>
                            </div>
                            <p className="mb-6 text-xs text-neutral-400">
                                Device:{' '}
                                <span className="font-bold text-white">
                                    {selected.device_code}
                                </span>{' '}
                                ({selected.name})
                            </p>

                            <div className="space-y-6">
                                <div className="space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                                    <label className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">
                                        Current Token (Bearer)
                                    </label>
                                    <div className="rounded-lg bg-black/50 p-3 font-mono text-xs break-all text-emerald-400 select-all">
                                        {selected.api_token || (
                                            <span className="text-neutral-500 italic">
                                                No token assigned yet.
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[9px] text-neutral-400 italic">
                                        Use this token in the Authorization
                                        header to authenticate requests from
                                        this device.
                                    </p>
                                </div>
                                <button
                                    onClick={handleGenerateToken}
                                    className="w-full rounded-xl bg-emerald-500 py-3 text-[10px] font-black tracking-widest text-black uppercase transition-all hover:bg-emerald-600"
                                >
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
    <AppLayout
        breadcrumbs={[
            { title: 'Device IoT CRUD', href: '/dashboard/admin/devices' },
        ]}
    >
        {page}
    </AppLayout>
);

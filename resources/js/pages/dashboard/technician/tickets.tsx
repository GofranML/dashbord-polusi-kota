import { Head, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList,
    PlusCircle,
    Clock,
    CheckCircle2,
    Loader2,
    Calendar,
    Cpu,
    X,
    ChevronRight,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

interface Ticket {
    id: number;
    device_id: number;
    device_name: string;
    device_code: string;
    technician_name: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    scheduled_at: string | null;
    completed_at: string | null;
    created_at: string;
}

interface Device {
    id: number;
    name: string;
    device_code: string;
}

const STATUS_COLUMNS: {
    key: Ticket['status'];
    label: string;
    icon: React.ReactNode;
    color: string;
}[] = [
    {
        key: 'pending',
        label: 'Antrian',
        icon: <Clock className="h-4 w-4" />,
        color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5',
    },
    {
        key: 'in_progress',
        label: 'Dikerjakan',
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5',
    },
    {
        key: 'completed',
        label: 'Selesai',
        icon: <CheckCircle2 className="h-4 w-4" />,
        color: 'text-green-400 border-green-500/30 bg-green-500/5',
    },
];

const emptyForm = {
    device_id: '',
    title: '',
    description: '',
    scheduled_at: '',
};

export default function TicketsPage() {
    const { ticketsList = [], devices = [] } = usePage().props as any;

    const [createModal, setCreateModal] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });

    const getByStatus = (status: string) =>
        ticketsList.filter((t: Ticket) => t.status === status);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/dashboard/technician/tickets', form, {
            onSuccess: () => {
                toast.success('Work order berhasil dibuat!');
                setCreateModal(false);
                setForm({ ...emptyForm });
            },
            onError: (errs) => toast.error(Object.values(errs)[0] as string),
        });
    };

    const handleStatusChange = (ticket: Ticket, newStatus: string) => {
        router.post(
            `/dashboard/technician/tickets/${ticket.id}/update`,
            { status: newStatus },
            {
                onSuccess: () =>
                    toast.success(
                        `Status tiket #${ticket.id} diperbarui ke "${newStatus}"`,
                    ),
                onError: () => toast.error('Gagal memperbarui status tiket.'),
            },
        );
    };

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            in_progress: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
            completed: 'bg-green-500/10 text-green-400 border-green-500/20',
        };

        return map[status] ?? 'bg-white/5 text-neutral-400 border-white/10';
    };

    return (
        <div className="space-y-8 bg-transparent p-4 lg:p-10">
            <Head title="Maintenance Tickets" />
            <Toaster position="top-right" theme="dark" />

            <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase">
                        <ClipboardList className="h-8 w-8 text-cyan-400" />
                        Maintenance Tickets
                    </h1>
                    <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                        Kanban work orders · {ticketsList.length} total tickets
                    </p>
                </div>
                <button
                    onClick={() => setCreateModal(true)}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[10px] font-black tracking-widest text-black uppercase transition-transform hover:scale-105"
                >
                    <PlusCircle className="h-4 w-4" />
                    Buat Work Order
                </button>
            </header>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {STATUS_COLUMNS.map((col) => (
                    <div key={col.key} className="space-y-4">
                        {/* Column Header */}
                        <div
                            className={cn(
                                'flex items-center gap-3 rounded-2xl border p-4',
                                col.color,
                            )}
                        >
                            {col.icon}
                            <h3 className="text-sm font-black tracking-widest uppercase">
                                {col.label}
                            </h3>
                            <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-black">
                                {getByStatus(col.key).length}
                            </span>
                        </div>

                        {/* Ticket Cards */}
                        <div className="min-h-[200px] space-y-3">
                            <AnimatePresence>
                                {getByStatus(col.key).length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-white/5 p-6 text-center text-[9px] font-bold tracking-widest text-neutral-700 uppercase">
                                        Tidak ada tiket
                                    </div>
                                ) : (
                                    getByStatus(col.key).map(
                                        (ticket: Ticket, idx: number) => (
                                            <motion.div
                                                key={ticket.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: idx * 0.05,
                                                }}
                                            >
                                                <GlassCard className="cursor-default space-y-3 p-5 transition-all hover:border-white/20">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 space-y-0.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-[8px] text-neutral-600">
                                                                    #{ticket.id}
                                                                </span>
                                                                <span
                                                                    className={cn(
                                                                        'rounded border px-1.5 py-0.5 text-[7px] font-black uppercase',
                                                                        statusBadge(
                                                                            ticket.status,
                                                                        ),
                                                                    )}
                                                                >
                                                                    {ticket.status.replace(
                                                                        '_',
                                                                        ' ',
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <h4 className="text-sm leading-tight font-black text-white">
                                                                {ticket.title}
                                                            </h4>
                                                        </div>
                                                    </div>

                                                    <p className="line-clamp-2 text-[9px] leading-relaxed text-neutral-500">
                                                        {ticket.description}
                                                    </p>

                                                    <div className="space-y-1.5 text-[9px] text-neutral-600">
                                                        <div className="flex items-center gap-1.5">
                                                            <Cpu className="h-2.5 w-2.5" />
                                                            <span className="text-neutral-400">
                                                                {
                                                                    ticket.device_code
                                                                }
                                                            </span>
                                                            <span>·</span>
                                                            <span>
                                                                {
                                                                    ticket.device_name
                                                                }
                                                            </span>
                                                        </div>
                                                        {ticket.scheduled_at && (
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="h-2.5 w-2.5" />
                                                                <span>
                                                                    Dijadwalkan:{' '}
                                                                    {new Date(
                                                                        ticket.scheduled_at,
                                                                    ).toLocaleDateString(
                                                                        'id-ID',
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1.5">
                                                            <span>
                                                                Teknisi:{' '}
                                                                {
                                                                    ticket.technician_name
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Status advance buttons */}
                                                    {ticket.status !==
                                                        'completed' && (
                                                        <div className="flex gap-2 border-t border-white/5 pt-2">
                                                            {ticket.status ===
                                                                'pending' && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            ticket,
                                                                            'in_progress',
                                                                        )
                                                                    }
                                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 py-2 text-[8px] font-black text-cyan-400 uppercase transition-all hover:bg-cyan-500/20"
                                                                >
                                                                    <ChevronRight className="h-3 w-3" />{' '}
                                                                    Mulai
                                                                    Kerjakan
                                                                </button>
                                                            )}
                                                            {ticket.status ===
                                                                'in_progress' && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            ticket,
                                                                            'completed',
                                                                        )
                                                                    }
                                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/10 py-2 text-[8px] font-black text-green-400 uppercase transition-all hover:bg-green-500/20"
                                                                >
                                                                    <CheckCircle2 className="h-3 w-3" />{' '}
                                                                    Tandai
                                                                    Selesai
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {ticket.status ===
                                                        'completed' &&
                                                        ticket.completed_at && (
                                                            <div className="flex items-center gap-1.5 border-t border-white/5 pt-2 text-[8px] text-green-400/70">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Selesai:{' '}
                                                                {new Date(
                                                                    ticket.completed_at,
                                                                ).toLocaleString(
                                                                    'id-ID',
                                                                )}
                                                            </div>
                                                        )}
                                                </GlassCard>
                                            </motion.div>
                                        ),
                                    )
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Ticket Modal */}
            <AnimatePresence>
                {createModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
                        onClick={(e) =>
                            e.target === e.currentTarget &&
                            setCreateModal(false)
                        }
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9 }}
                            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c1425] p-8 shadow-2xl"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-sm font-black tracking-widest uppercase">
                                    <ClipboardList className="h-5 w-5 text-cyan-400" />
                                    Buat Work Order
                                </h3>
                                <button onClick={() => setCreateModal(false)}>
                                    <X className="h-5 w-5 text-neutral-500" />
                                </button>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-500 uppercase">
                                        Sensor Node
                                    </label>
                                    <select
                                        value={form.device_id}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                device_id: e.target.value,
                                            }))
                                        }
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                                    >
                                        <option
                                            value=""
                                            className="bg-neutral-950"
                                        >
                                            -- Pilih Sensor Node --
                                        </option>
                                        {devices.map((d: Device) => (
                                            <option
                                                key={d.id}
                                                value={d.id}
                                                className="bg-neutral-950"
                                            >
                                                {d.device_code} — {d.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-500 uppercase">
                                        Judul Work Order
                                    </label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                title: e.target.value,
                                            }))
                                        }
                                        placeholder="Contoh: Penggantian sensor PM2.5"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-500 uppercase">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        placeholder="Jelaskan pekerjaan yang perlu dilakukan..."
                                        required
                                        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-500 uppercase">
                                        Jadwal Pemeliharaan
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={form.scheduled_at}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                scheduled_at: e.target.value,
                                            }))
                                        }
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-cyan-500 py-3 text-[10px] font-black tracking-widest text-black uppercase transition-all hover:bg-cyan-600"
                                >
                                    Buat & Jadwalkan Work Order
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

TicketsPage.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Maintenance Tickets',
                href: '/dashboard/technician/tickets',
            },
        ]}
    >
        {page}
    </AppLayout>
);

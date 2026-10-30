import { Head, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    PlusCircle,
    Edit3,
    Trash2,
    ShieldOff,
    ShieldCheck,
    X,
    Clock,
    ScrollText,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

interface UserRecord {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'suspended';
    email_verified_at: string | null;
    created_at: string;
}

interface AuditLog {
    id: number;
    user_name: string;
    action: string;
    description: string;
    ip_address: string;
    created_at: string;
}

const ROLES = [
    'Super Admin',
    'Petugas Monitoring',
    'Viewer / Operator',
    'Teknisi Lapangan',
];

const emptyForm = {
    name: '',
    email: '',
    password: '',
    role: 'Viewer / Operator',
    status: 'active',
};

export default function UsersPage() {
    const { usersList = [], auditLogs = [] } = usePage().props as any;

    const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(
        null,
    );
    const [selected, setSelected] = useState<UserRecord | null>(null);
    const [form, setForm] = useState({ ...emptyForm });

    const openCreate = () => {
        setForm({ ...emptyForm });
        setModal('create');
    };
    const openEdit = (u: UserRecord) => {
        setSelected(u);
        setForm({
            name: u.name,
            email: u.email,
            password: '',
            role: u.role,
            status: u.status,
        });
        setModal('edit');
    };
    const openDelete = (u: UserRecord) => {
        setSelected(u);
        setModal('delete');
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/dashboard/admin/users', form, {
            onSuccess: () => {
                toast.success('User berhasil dibuat!');
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

        router.post(`/dashboard/admin/users/${selected.id}/update`, form, {
            onSuccess: () => {
                toast.success('User berhasil diperbarui!');
                setModal(null);
            },
            onError: (errs) => toast.error(Object.values(errs)[0] as string),
        });
    };

    const handleDelete = () => {
        if (!selected) {
            return;
        }

        router.delete(`/dashboard/admin/users/${selected.id}`, {
            onSuccess: () => {
                toast.success('User dihapus.');
                setModal(null);
            },
            onError: () => toast.error('Gagal menghapus user.'),
        });
    };

    const roleColors: Record<string, string> = {
        'Super Admin': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        'Petugas Monitoring': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        'Viewer / Operator': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'Teknisi Lapangan':
            'bg-orange-500/10 text-orange-400 border-orange-500/20',
    };

    return (
        <div className="space-y-8 bg-transparent p-4 lg:p-10">
            <Head title="Manajemen User" />
            <Toaster position="top-right" theme="dark" />

            <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase">
                        <Users className="h-8 w-8 text-cyan-400" />
                        Manajemen User
                    </h1>
                    <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                        RBAC control · {usersList.length} registered accounts
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[10px] font-black tracking-widest text-black uppercase transition-transform hover:scale-105"
                >
                    <PlusCircle className="h-4 w-4" />
                    Tambah User Baru
                </button>
            </header>

            <div className="grid gap-8 xl:grid-cols-12">
                {/* Users Table */}
                <div className="xl:col-span-7">
                    <GlassCard className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-white/5 text-[9px] font-black tracking-[0.2em] text-neutral-500 uppercase">
                                    <tr>
                                        <th className="px-3 pb-4">Nama</th>
                                        <th className="px-3 pb-4">Role</th>
                                        <th className="px-3 pb-4 text-center">
                                            Status
                                        </th>
                                        <th className="px-3 pb-4 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {usersList.map((u: UserRecord) => (
                                        <tr
                                            key={u.id}
                                            className="transition-colors hover:bg-white/5"
                                        >
                                            <td className="px-3 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 text-[10px] font-black text-white">
                                                        {u.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">
                                                            {u.name}
                                                        </p>
                                                        <p className="text-[9px] text-neutral-500">
                                                            {u.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4">
                                                <span
                                                    className={cn(
                                                        'rounded-full border px-2 py-0.5 text-[8px] font-black uppercase',
                                                        roleColors[u.role] ||
                                                            'border-white/10 bg-white/5 text-neutral-400',
                                                    )}
                                                >
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 text-center">
                                                <span
                                                    className={cn(
                                                        'rounded-full px-2 py-0.5 text-[8px] font-black uppercase',
                                                        u.status === 'active'
                                                            ? 'bg-green-500/10 text-green-400'
                                                            : 'bg-red-500/10 text-red-400',
                                                    )}
                                                >
                                                    {u.status === 'active'
                                                        ? '● Active'
                                                        : '● Suspended'}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openEdit(u)
                                                        }
                                                        className="group rounded-lg p-1.5 hover:bg-white/10"
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5 text-neutral-500 group-hover:text-cyan-400" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openDelete(u)
                                                        }
                                                        className="group rounded-lg p-1.5 hover:bg-white/10"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 text-neutral-500 group-hover:text-red-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>

                {/* Audit Log Feed */}
                <div className="xl:col-span-5">
                    <GlassCard className="border-neutral-500/20 bg-neutral-500/5 p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <ScrollText className="h-5 w-5 text-neutral-400" />
                            <h3 className="text-sm font-black tracking-widest text-neutral-400 uppercase">
                                Audit Trail
                            </h3>
                        </div>
                        <div className="max-h-[500px] space-y-3 overflow-y-auto pr-2">
                            {auditLogs.map((log: AuditLog) => (
                                <div
                                    key={log.id}
                                    className="space-y-1 rounded-xl border border-white/5 bg-white/5 p-3"
                                >
                                    <div className="flex items-start justify-between">
                                        <span className="text-[9px] font-black text-cyan-400 uppercase">
                                            {log.action}
                                        </span>
                                        <span className="flex items-center gap-1 text-[8px] text-neutral-600">
                                            <Clock className="h-2.5 w-2.5" />
                                            {new Date(
                                                log.created_at,
                                            ).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <p className="text-[9px] leading-relaxed text-neutral-400">
                                        {log.description}
                                    </p>
                                    <p className="text-[8px] text-neutral-600">
                                        by {log.user_name} · {log.ip_address}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
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
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9 }}
                            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c1425] p-8 shadow-2xl"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-sm font-black tracking-widest uppercase">
                                    {modal === 'create' ? (
                                        <>
                                            <PlusCircle className="h-5 w-5 text-cyan-400" />{' '}
                                            Tambah User
                                        </>
                                    ) : (
                                        <>
                                            <Edit3 className="h-5 w-5 text-cyan-400" />{' '}
                                            Edit User
                                        </>
                                    )}
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
                                {[
                                    {
                                        key: 'name',
                                        label: 'Nama Lengkap',
                                        type: 'text',
                                    },
                                    {
                                        key: 'email',
                                        label: 'Email Address',
                                        type: 'email',
                                    },
                                    {
                                        key: 'password',
                                        label:
                                            modal === 'create'
                                                ? 'Password'
                                                : 'Password (kosongkan jika tidak diubah)',
                                        type: 'password',
                                    },
                                ].map((f) => (
                                    <div key={f.key}>
                                        <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-500 uppercase">
                                            {f.label}
                                        </label>
                                        <input
                                            type={f.type}
                                            value={(form as any)[f.key]}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    [f.key]: e.target.value,
                                                }))
                                            }
                                            required={
                                                f.key !== 'password' ||
                                                modal === 'create'
                                            }
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-500 uppercase">
                                        Role
                                    </label>
                                    <select
                                        value={form.role}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                role: e.target.value,
                                            }))
                                        }
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                                    >
                                        {ROLES.map((r) => (
                                            <option
                                                key={r}
                                                value={r}
                                                className="bg-neutral-950"
                                            >
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {modal === 'edit' && (
                                    <div>
                                        <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-500 uppercase">
                                            Status Akun
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
                                            <option
                                                value="active"
                                                className="bg-neutral-950"
                                            >
                                                Active
                                            </option>
                                            <option
                                                value="suspended"
                                                className="bg-neutral-950"
                                            >
                                                Suspended
                                            </option>
                                        </select>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="mt-2 w-full rounded-xl bg-cyan-500 py-3 text-[10px] font-black tracking-widest text-black uppercase transition-all hover:bg-cyan-600"
                                >
                                    {modal === 'create'
                                        ? 'Buat User'
                                        : 'Simpan Perubahan'}
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
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9 }}
                            className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#0c1425] p-8 text-center shadow-2xl"
                        >
                            <Trash2 className="mx-auto mb-4 h-12 w-12 text-red-500" />
                            <h3 className="mb-2 text-sm font-black uppercase">
                                Hapus User?
                            </h3>
                            <p className="mb-6 text-xs text-neutral-400">
                                Aksi ini permanen. User{' '}
                                <span className="font-bold text-white">
                                    {selected.name}
                                </span>{' '}
                                akan dihapus dari sistem.
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
                                    Hapus
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

UsersPage.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Manajemen User', href: '/dashboard/admin/users' },
        ]}
    >
        {page}
    </AppLayout>
);

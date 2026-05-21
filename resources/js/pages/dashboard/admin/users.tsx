import { Head, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    Users,
    PlusCircle,
    Edit3,
    Trash2,
    ShieldOff,
    ShieldCheck,
    X,
    Clock,
    ScrollText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { toast, Toaster } from 'sonner';

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

const ROLES = ['Super Admin', 'Petugas Monitoring', 'Viewer / Operator', 'Teknisi Lapangan'];

const emptyForm = { name: '', email: '', password: '', role: 'Viewer / Operator', status: 'active' };

export default function UsersPage() {
    const { usersList = [], auditLogs = [] } = usePage().props as any;

    const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null);
    const [selected, setSelected] = useState<UserRecord | null>(null);
    const [form, setForm] = useState({ ...emptyForm });

    const openCreate = () => { setForm({ ...emptyForm }); setModal('create'); };
    const openEdit = (u: UserRecord) => {
        setSelected(u);
        setForm({ name: u.name, email: u.email, password: '', role: u.role, status: u.status });
        setModal('edit');
    };
    const openDelete = (u: UserRecord) => { setSelected(u); setModal('delete'); };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/dashboard/admin/users', form, {
            onSuccess: () => { toast.success('User berhasil dibuat!'); setModal(null); },
            onError: (errs) => toast.error(Object.values(errs)[0] as string)
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;
        router.post(`/dashboard/admin/users/${selected.id}/update`, form, {
            onSuccess: () => { toast.success('User berhasil diperbarui!'); setModal(null); },
            onError: (errs) => toast.error(Object.values(errs)[0] as string)
        });
    };

    const handleDelete = () => {
        if (!selected) return;
        router.delete(`/dashboard/admin/users/${selected.id}`, {
            onSuccess: () => { toast.success('User dihapus.'); setModal(null); },
            onError: () => toast.error('Gagal menghapus user.')
        });
    };

    const roleColors: Record<string, string> = {
        'Super Admin': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        'Petugas Monitoring': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        'Viewer / Operator': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'Teknisi Lapangan': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    };

    return (
        <div className="p-4 lg:p-10 space-y-8 bg-transparent">
            <Head title="Manajemen User" />
            <Toaster position="top-right" theme="dark" />

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <Users className="w-8 h-8 text-cyan-400" />
                        Manajemen User
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        RBAC control · {usersList.length} registered accounts
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                >
                    <PlusCircle className="w-4 h-4" />
                    Tambah User Baru
                </button>
            </header>

            <div className="grid xl:grid-cols-12 gap-8">
                {/* Users Table */}
                <div className="xl:col-span-7">
                    <GlassCard className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="text-[9px] uppercase text-neutral-500 font-black tracking-[0.2em] border-b border-white/5">
                                    <tr>
                                        <th className="pb-4 px-3">Nama</th>
                                        <th className="pb-4 px-3">Role</th>
                                        <th className="pb-4 px-3 text-center">Status</th>
                                        <th className="pb-4 px-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {usersList.map((u: UserRecord) => (
                                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 flex items-center justify-center text-[10px] font-black text-white">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{u.name}</p>
                                                        <p className="text-[9px] text-neutral-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-3">
                                                <span className={cn('px-2 py-0.5 rounded-full text-[8px] font-black uppercase border', roleColors[u.role] || 'bg-white/5 text-neutral-400 border-white/10')}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-3 text-center">
                                                <span className={cn('px-2 py-0.5 rounded-full text-[8px] font-black uppercase',
                                                    u.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                                )}>
                                                    {u.status === 'active' ? '● Active' : '● Suspended'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-3">
                                                <div className="flex gap-2 justify-end">
                                                    <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-white/10 group">
                                                        <Edit3 className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400" />
                                                    </button>
                                                    <button onClick={() => openDelete(u)} className="p-1.5 rounded-lg hover:bg-white/10 group">
                                                        <Trash2 className="w-3.5 h-3.5 text-neutral-500 group-hover:text-red-400" />
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
                    <GlassCard className="p-6 bg-neutral-500/5 border-neutral-500/20">
                        <div className="flex items-center gap-3 mb-6">
                            <ScrollText className="w-5 h-5 text-neutral-400" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Audit Trail</h3>
                        </div>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {auditLogs.map((log: AuditLog) => (
                                <div key={log.id} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[9px] font-black uppercase text-cyan-400">{log.action}</span>
                                        <span className="text-[8px] text-neutral-600 flex items-center gap-1">
                                            <Clock className="w-2.5 h-2.5" />
                                            {new Date(log.created_at).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-neutral-400 leading-relaxed">{log.description}</p>
                                    <p className="text-[8px] text-neutral-600">by {log.user_name} · {log.ip_address}</p>
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
                        className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={(e) => e.target === e.currentTarget && setModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9 }}
                            className="bg-[#0c1425] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                                    {modal === 'create' ? <><PlusCircle className="w-5 h-5 text-cyan-400" /> Tambah User</> : <><Edit3 className="w-5 h-5 text-cyan-400" /> Edit User</>}
                                </h3>
                                <button onClick={() => setModal(null)}><X className="w-5 h-5 text-neutral-500" /></button>
                            </div>
                            <form onSubmit={modal === 'create' ? handleCreate : handleEdit} className="space-y-4">
                                {[
                                    { key: 'name', label: 'Nama Lengkap', type: 'text' },
                                    { key: 'email', label: 'Email Address', type: 'email' },
                                    { key: 'password', label: modal === 'create' ? 'Password' : 'Password (kosongkan jika tidak diubah)', type: 'password' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="text-[9px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">{f.label}</label>
                                        <input
                                            type={f.type}
                                            value={(form as any)[f.key]}
                                            onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                            required={f.key !== 'password' || modal === 'create'}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className="text-[9px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">Role</label>
                                    <select
                                        value={form.role}
                                        onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                                    >
                                        {ROLES.map(r => <option key={r} value={r} className="bg-neutral-950">{r}</option>)}
                                    </select>
                                </div>
                                {modal === 'edit' && (
                                    <div>
                                        <label className="text-[9px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">Status Akun</label>
                                        <select
                                            value={form.status}
                                            onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                                        >
                                            <option value="active" className="bg-neutral-950">Active</option>
                                            <option value="suspended" className="bg-neutral-950">Suspended</option>
                                        </select>
                                    </div>
                                )}
                                <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all mt-2">
                                    {modal === 'create' ? 'Buat User' : 'Simpan Perubahan'}
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
                        className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={(e) => e.target === e.currentTarget && setModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9 }}
                            className="bg-[#0c1425] border border-red-500/20 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center"
                        >
                            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="font-black uppercase text-sm mb-2">Hapus User?</h3>
                            <p className="text-xs text-neutral-400 mb-6">Aksi ini permanen. User <span className="text-white font-bold">{selected.name}</span> akan dihapus dari sistem.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setModal(null)} className="flex-1 py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase rounded-xl hover:bg-white/10">Batal</button>
                                <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase rounded-xl transition-all">Hapus</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

UsersPage.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Manajemen User', href: '/dashboard/admin/users' }]}>
        {page}
    </AppLayout>
);

import { Head, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    Settings,
    MessageSquare,
    Phone,
    Mail,
    Clock,
    Save,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';
import { toast, Toaster } from 'sonner';

export default function ConfigPage() {
    const { config = {} } = usePage().props as any;

    const [form, setForm] = useState({
        interval: config.interval ?? '1 hour',
        telegramToken: config.telegramToken ?? '',
        telegramChatId: config.telegramChatId ?? '',
        whatsappWebhook: config.whatsappWebhook ?? '',
        emailRecipient: config.emailRecipient ?? 'admin@smartcity.go.id',
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/dashboard/admin/config', form, {
            onSuccess: () => toast.success('Konfigurasi sistem berhasil disimpan!'),
            onError: (errs) => toast.error(Object.values(errs)[0] as string)
        });
    };

    const handleTestChannel = (channel: string) => {
        toast.success(`Simulasi notifikasi ${channel} terkirim ke endpoint yang dikonfigurasi!`);
    };

    return (
        <div className="p-4 lg:p-10 space-y-8 bg-transparent">
            <Head title="Konfigurasi Sistem" />
            <Toaster position="top-right" theme="dark" />

            <header className="space-y-1">
                <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <Settings className="w-8 h-8 text-cyan-400" />
                    Konfigurasi Sistem
                </h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    Notification channels · Telemetry sync interval · System parameters
                </p>
            </header>

            <form onSubmit={handleSave} className="grid xl:grid-cols-2 gap-8">
                {/* Telegram Config */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <GlassCard className="p-8 bg-blue-500/5 border-blue-500/20 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-blue-500/20">
                                <MessageSquare className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-black uppercase tracking-widest text-sm text-blue-400">Telegram Bot</h3>
                                <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest">Notifikasi channel utama</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                { key: 'telegramToken', label: 'Bot Token', placeholder: '123456789:ABCDEF...' },
                                { key: 'telegramChatId', label: 'Chat / Group ID', placeholder: '@channel_name atau -100xxx' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-[9px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">{f.label}</label>
                                    <input
                                        type="text"
                                        value={(form as any)[f.key]}
                                        onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                        placeholder={f.placeholder}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/50 font-mono"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleTestChannel('Telegram')}
                                className="w-full py-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Zap className="w-3.5 h-3.5" /> Test Telegram Channel
                            </button>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* WhatsApp Config */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <GlassCard className="p-8 bg-green-500/5 border-green-500/20 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-green-500/20">
                                <Phone className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-black uppercase tracking-widest text-sm text-green-400">WhatsApp Webhook</h3>
                                <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest">Via WA Business API mock</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">Webhook URL</label>
                                <input
                                    type="url"
                                    value={form.whatsappWebhook}
                                    onChange={(e) => setForm(prev => ({ ...prev, whatsappWebhook: e.target.value }))}
                                    placeholder="https://api.your-wa-provider.com/send"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-green-500/50 font-mono"
                                />
                            </div>
                            <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                                <p className="text-[9px] text-green-400/70 uppercase font-bold tracking-widest leading-relaxed">
                                    ℹ️ Sistem akan mengirim payload JSON POST ke webhook ini setiap kali threshold terlampaui.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleTestChannel('WhatsApp')}
                                className="w-full py-2.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-green-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Zap className="w-3.5 h-3.5" /> Test WhatsApp Webhook
                            </button>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Email Config */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <GlassCard className="p-8 bg-orange-500/5 border-orange-500/20 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-orange-500/20">
                                <Mail className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                                <h3 className="font-black uppercase tracking-widest text-sm text-orange-400">Email Alerts</h3>
                                <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest">SMTP notification recipient</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">Email Recipient</label>
                                <input
                                    type="email"
                                    value={form.emailRecipient}
                                    onChange={(e) => setForm(prev => ({ ...prev, emailRecipient: e.target.value }))}
                                    placeholder="admin@smartcity.go.id"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500/50"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleTestChannel('Email')}
                                className="w-full py-2.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Zap className="w-3.5 h-3.5" /> Test Email Delivery
                            </button>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Sync Interval */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <GlassCard className="p-8 bg-cyan-500/5 border-cyan-500/20 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-cyan-500/20">
                                <Clock className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="font-black uppercase tracking-widest text-sm text-cyan-400">Sync Interval</h3>
                                <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest">Frekuensi pengambilan data sensor</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">Interval</label>
                                <select
                                    value={form.interval}
                                    onChange={(e) => setForm(prev => ({ ...prev, interval: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                                >
                                    {['1 minute', '5 minutes', '15 minutes', '30 minutes', '1 hour', '6 hours'].map(v => (
                                        <option key={v} value={v} className="bg-neutral-950">{v}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
                                <p className="text-[9px] text-cyan-400/70 uppercase font-bold tracking-widest leading-relaxed">
                                    Interval lebih pendek memberikan data lebih realtime namun meningkatkan konsumsi bandwidth dan daya baterai sensor.
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Save Button spanning full width */}
                <div className="xl:col-span-2">
                    <button
                        type="submit"
                        className="w-full py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.01] transition-transform shadow-[0_10px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
                    >
                        <Save className="w-5 h-5" />
                        Simpan Semua Konfigurasi
                    </button>
                </div>
            </form>
        </div>
    );
}

ConfigPage.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Konfigurasi Sistem', href: '/dashboard/admin/config' }]}>
        {page}
    </AppLayout>
);

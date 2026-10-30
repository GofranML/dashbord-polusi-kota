import { Head, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Settings,
    MessageSquare,
    Phone,
    Mail,
    Clock,
    Save,
    Zap,
    Send,
    Radio,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    RefreshCw,
    Server,
    History,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';

interface TelemetryItem {
    device_id: number;
    device_code: string;
    device_name: string;
    region: string;
    status: string;
    has_data: boolean;
    datetime: string | null;
    pm25: number | null;
    pm10: number | null;
    pm1: number | null;
    mq135: number | null;
    temperature: number | null;
    humidity: number | null;
    pressure: number | null;
    rain_status: string | null;
    fuzzy_score: number | null;
    fuzzy_label: string;
}

interface NotificationLogItem {
    id: number;
    user_name: string;
    action: string;
    description: string;
    created_at: string;
}

export default function ConfigPage() {
    const {
        config = {},
        telemetrySnapshot = {},
        notificationLogs = [],
    } = usePage().props as any;

    const [form, setForm] = useState({
        interval: config.interval ?? '1 hour',
        telegramEnabled: config.telegramEnabled ?? true,
        telegramToken: config.telegramToken ?? '',
        telegramChatId: config.telegramChatId ?? '',
        whatsappEnabled: config.whatsappEnabled ?? true,
        whatsappWebhook: config.whatsappWebhook ?? 'https://api.fonnte.com/send',
        whatsappToken: config.whatsappToken ?? '',
        whatsappTarget: config.whatsappTarget ?? '',
        emailEnabled: config.emailEnabled ?? true,
        emailRecipient: config.emailRecipient ?? 'admin@pollutrack.gov.id',
        smtpHost: config.smtpHost ?? '',
        smtpPort: config.smtpPort ?? '587',
        smtpUsername: config.smtpUsername ?? '',
        smtpPassword: config.smtpPassword ?? '',
        smtpEncryption: config.smtpEncryption ?? 'tls',
        smtpFromAddress: config.smtpFromAddress ?? '',
        autoNotifyOnUpload: config.autoNotifyOnUpload ?? true,
        autoNotifyMode: config.autoNotifyMode ?? 'all',
    });

    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('all');
    const [sendingChannel, setSendingChannel] = useState<string | null>(null);
    const [detectingChat, setDetectingChat] = useState<boolean>(false);
    const [savingConfig, setSavingConfig] = useState<boolean>(false);
    const [showSmtpConfig, setShowSmtpConfig] = useState<boolean>(false);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            interval: config.interval ?? prev.interval,
            telegramEnabled: config.telegramEnabled ?? prev.telegramEnabled,
            telegramToken: config.telegramToken ?? prev.telegramToken,
            telegramChatId: config.telegramChatId ?? prev.telegramChatId,
            whatsappEnabled: config.whatsappEnabled ?? prev.whatsappEnabled,
            whatsappWebhook: config.whatsappWebhook ?? prev.whatsappWebhook,
            whatsappToken: config.whatsappToken ?? prev.whatsappToken,
            whatsappTarget: config.whatsappTarget ?? prev.whatsappTarget,
            emailEnabled: config.emailEnabled ?? prev.emailEnabled,
            emailRecipient: config.emailRecipient ?? prev.emailRecipient,
            smtpHost: config.smtpHost ?? prev.smtpHost,
            smtpPort: config.smtpPort ?? prev.smtpPort,
            smtpUsername: config.smtpUsername ?? prev.smtpUsername,
            smtpPassword: config.smtpPassword ?? prev.smtpPassword,
            smtpEncryption: config.smtpEncryption ?? prev.smtpEncryption,
            smtpFromAddress: config.smtpFromAddress ?? prev.smtpFromAddress,
            autoNotifyOnUpload:
                config.autoNotifyOnUpload ?? prev.autoNotifyOnUpload,
            autoNotifyMode: config.autoNotifyMode ?? prev.autoNotifyMode,
        }));
    }, [config]);

    const devicesList: TelemetryItem[] = telemetrySnapshot?.devices ?? [];
    const activeTelemetries: TelemetryItem[] =
        telemetrySnapshot?.telemetries ?? [];
    const summary = telemetrySnapshot?.summary ?? {};

    const previewTelemetries =
        selectedDeviceId === 'all'
            ? activeTelemetries
            : activeTelemetries.filter(
                  (d) => String(d.device_id) === selectedDeviceId,
              );

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSavingConfig(true);
        router.post('/dashboard/admin/config', form, {
            preserveScroll: true,
            onSuccess: () => {
                setSavingConfig(false);
                toast.success('Konfigurasi sistem berhasil disimpan!');
            },
            onError: (errs) => {
                setSavingConfig(false);
                toast.error(
                    (Object.values(errs)[0] as string) ||
                        'Gagal menyimpan konfigurasi.',
                );
            },
        });
    };

    const handleSendTelemetry = (
        channel: 'telegram' | 'whatsapp' | 'email' | 'all',
    ) => {
        setSendingChannel(channel);
        router.post(
            '/dashboard/admin/config/send-telemetry',
            {
                channel,
                device_id:
                    selectedDeviceId === 'all'
                        ? null
                        : Number(selectedDeviceId),
                config: form,
            },
            {
                preserveScroll: true,
                onSuccess: (page: any) => {
                    setSendingChannel(null);
                    const flashSuccess = page?.props?.flash?.success;
                    const detectedChatId =
                        page?.props?.flash?.detected_chat_id;

                    if (detectedChatId) {
                        setForm((prev) => ({
                            ...prev,
                            telegramChatId: String(detectedChatId),
                        }));
                    }

                    toast.success(
                        flashSuccess ||
                            `Data telemetri berhasil dikirim ke ${channel.toUpperCase()}!`,
                    );
                },
                onError: (errs) => {
                    setSendingChannel(null);
                    const errMsg =
                        (Object.values(errs)[0] as string) ||
                        `Gagal mengirim data telemetri ke ${channel}.`;
                    toast.error(errMsg);
                },
            },
        );
    };

    const handleDetectTelegramChat = () => {
        if (!form.telegramToken.trim()) {
            toast.error('Masukkan Bot Token Telegram terlebih dahulu.');
            return;
        }
        setDetectingChat(true);
        router.post(
            '/dashboard/admin/config/detect-telegram-chat',
            {
                telegramToken: form.telegramToken,
                telegramChatId: form.telegramChatId,
            },
            {
                preserveScroll: true,
                onSuccess: (page: any) => {
                    setDetectingChat(false);
                    const detectedId = page?.props?.flash?.detected_chat_id;
                    const flashMsg = page?.props?.flash?.success;
                    if (detectedId) {
                        setForm((prev) => ({
                            ...prev,
                            telegramChatId: String(detectedId),
                        }));
                    }
                    toast.success(
                        flashMsg || 'Chat ID Telegram berhasil terdeteksi!',
                    );
                },
                onError: (errs) => {
                    setDetectingChat(false);
                    toast.error(
                        (Object.values(errs)[0] as string) ||
                            'Gagal mendeteksi Chat ID Telegram.',
                    );
                },
            },
        );
    };

    const buildDirectWhatsAppUrl = () => {
        const items =
            previewTelemetries.length > 0
                ? previewTelemetries
                : activeTelemetries;
        const lines: string[] = [
            '📡 *LAPORAN TELEMETRI POLLUTRACK*',
            `🕒 Waktu: ${new Date().toLocaleString('id-ID')}`,
            '━━━━━━━━━━━━━━━━━━━━━━',
        ];

        if (items.length === 0) {
            lines.push(
                '⚠️ _Belum ada data sensor telemetri pada perangkat yang dipilih._',
            );
        } else {
            items.forEach((t) => {
                lines.push(`📍 *${t.device_name}* (${t.device_code})`);
                lines.push(`• Wilayah: ${t.region}`);
                lines.push(`• Waktu Data: ${t.datetime}`);
                lines.push(
                    `• PM2.5: *${t.pm25} µg/m³* | PM10: *${t.pm10} µg/m³* | PM1: *${t.pm1} µg/m³*`,
                );
                lines.push(`• Gas (MQ-135): *${t.mq135} ppm*`);
                lines.push(
                    `• Suhu: *${t.temperature} °C* | Kelembapan: *${t.humidity}%*`,
                );
                lines.push(
                    `• Tekanan: *${t.pressure} hPa* | Cuaca: *${t.rain_status}*`,
                );
                lines.push(
                    `• Indeks Fuzzy: *${t.fuzzy_score}% (${t.fuzzy_label})*`,
                );
                lines.push('──────────────────────');
            });
        }

        let cleanPhone = form.whatsappTarget.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('08')) {
            cleanPhone = '62' + cleanPhone.slice(1);
        } else if (cleanPhone.startsWith('8')) {
            cleanPhone = '62' + cleanPhone;
        }

        const encoded = encodeURIComponent(lines.join('\n'));
        return cleanPhone
            ? `https://wa.me/${cleanPhone}?text=${encoded}`
            : `https://wa.me/?text=${encoded}`;
    };

    const handleDirectWhatsApp = () => {
        const url = buildDirectWhatsAppUrl();
        window.open(url, '_blank', 'noopener,noreferrer');
        toast.success(
            'Membuka WhatsApp dengan laporan data telemetri terkini!',
        );
    };

    return (
        <div className="space-y-8 bg-transparent p-4 lg:p-10">
            <Head title="Konfigurasi Sistem" />
            <Toaster position="top-right" theme="dark" />

            <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase">
                        <Settings className="h-8 w-8 text-cyan-400" />
                        Konfigurasi Sistem
                    </h1>
                    <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                        Notification channels · Telemetry data dispatch · Sync
                        interval
                    </p>
                </div>

                <button
                    type="button"
                    disabled={sendingChannel !== null}
                    onClick={() => handleSendTelemetry('all')}
                    className="btn flex items-center gap-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-5 py-3 text-[10px] font-black tracking-widest text-cyan-300 uppercase transition-all hover:bg-cyan-500/25 disabled:opacity-50"
                >
                    {sendingChannel === 'all' ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                    Kirim Telemetri ke Semua Channel Aktif
                </button>
            </header>

            {/* Live Telemetry Data Selector & Preview Card */}
            <GlassCard className="space-y-5 border-cyan-500/20 bg-cyan-500/5 p-6 lg:p-8">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-cyan-500/20 p-2.5">
                            <Radio className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black tracking-widest text-cyan-400 uppercase">
                                Sumber Data Telemetri yang Akan Dikirim
                            </h3>
                            <p className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">
                                Pilih perangkat sensor untuk mengirim data
                                telemetri aktual ke Telegram, Email &amp;
                                WhatsApp
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={selectedDeviceId}
                            onChange={(e) =>
                                setSelectedDeviceId(e.target.value)
                            }
                            className="select rounded-xl border border-white/10 bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white focus:border-cyan-500/50 focus:outline-none"
                        >
                            <option value="all" className="bg-neutral-950">
                                Semua Perangkat Berdata (
                                {activeTelemetries.length} Node Aktif)
                            </option>
                            {devicesList.map((d) => (
                                <option
                                    key={d.device_id}
                                    value={String(d.device_id)}
                                    className="bg-neutral-950"
                                >
                                    {d.device_name} ({d.device_code}){' '}
                                    {d.has_data
                                        ? `— PM2.5: ${d.pm25} µg/m³`
                                        : '— [Belum Ada Data]'}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {previewTelemetries.length === 0 ? (
                    <div
                        role="alert"
                        className="alert rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-xs text-yellow-300"
                    >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>
                            Perangkat yang dipilih belum memiliki rekaman data
                            sensor. Sistem otomatis akan menyertakan perangkat
                            lain yang memiliki data telemetri saat pengiriman.
                        </span>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {previewTelemetries.map((item) => (
                            <div
                                key={item.device_id}
                                className="rounded-xl border border-white/10 bg-black/30 p-4"
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-black text-white uppercase">
                                            {item.device_name}
                                        </span>
                                        <span className="ml-2 font-mono text-[10px] text-cyan-400">
                                            ({item.device_code})
                                        </span>
                                    </div>
                                    <span className="badge rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[9px] font-black text-cyan-300 uppercase">
                                        Fuzzy: {item.fuzzy_score}% (
                                        {item.fuzzy_label})
                                    </span>
                                </div>
                                <p className="mb-3 font-mono text-[10px] text-neutral-400">
                                    Wilayah: {item.region} · Waktu Data:{' '}
                                    {item.datetime}
                                </p>
                                <div className="grid grid-cols-3 gap-2 text-center sm:grid-cols-6">
                                    <div className="rounded-lg bg-white/5 p-2">
                                        <div className="text-[8px] font-bold text-neutral-500 uppercase">
                                            PM2.5
                                        </div>
                                        <div className="font-mono text-xs font-black text-cyan-400">
                                            {item.pm25}
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-white/5 p-2">
                                        <div className="text-[8px] font-bold text-neutral-500 uppercase">
                                            PM10
                                        </div>
                                        <div className="font-mono text-xs font-black text-purple-400">
                                            {item.pm10}
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-white/5 p-2">
                                        <div className="text-[8px] font-bold text-neutral-500 uppercase">
                                            PM1
                                        </div>
                                        <div className="font-mono text-xs font-black text-indigo-400">
                                            {item.pm1}
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-white/5 p-2">
                                        <div className="text-[8px] font-bold text-neutral-500 uppercase">
                                            MQ-135
                                        </div>
                                        <div className="font-mono text-xs font-black text-orange-400">
                                            {item.mq135}
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-white/5 p-2">
                                        <div className="text-[8px] font-bold text-neutral-500 uppercase">
                                            Suhu/Hum
                                        </div>
                                        <div className="font-mono text-xs font-black text-emerald-400">
                                            {item.temperature}°/{item.humidity}%
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-white/5 p-2">
                                        <div className="text-[8px] font-bold text-neutral-500 uppercase">
                                            Cuaca
                                        </div>
                                        <div className="truncate font-mono text-[10px] font-black text-white">
                                            {item.rain_status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </GlassCard>

            <form onSubmit={handleSave} className="grid gap-8 xl:grid-cols-2">
                {/* Telegram Config */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <GlassCard className="space-y-6 border-blue-500/20 bg-blue-500/5 p-8">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-blue-500/20 p-2.5">
                                    <MessageSquare className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black tracking-widest text-blue-400 uppercase">
                                        Telegram Bot
                                    </h3>
                                    <p className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">
                                        Integrasi Telegram Bot API Resmi
                                    </p>
                                </div>
                            </div>
                            <label className="flex cursor-pointer items-center gap-2 text-[9px] font-black tracking-widest text-neutral-400 uppercase">
                                <input
                                    type="checkbox"
                                    checked={form.telegramEnabled}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            telegramEnabled: e.target.checked,
                                        }))
                                    }
                                    className="toggle toggle-info toggle-sm"
                                />
                                {form.telegramEnabled ? 'Aktif' : 'Nonaktif'}
                            </label>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-400 uppercase">
                                    Bot Token (Dari @BotFather)
                                </label>
                                <input
                                    type="text"
                                    value={form.telegramToken}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            telegramToken: e.target.value,
                                        }))
                                    }
                                    placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxYZ..."
                                    className="input w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs text-white focus:border-blue-500/50 focus:outline-none"
                                />
                            </div>

                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label className="block text-[9px] font-black tracking-widest text-neutral-400 uppercase">
                                        Chat ID / Group ID / Channel
                                    </label>
                                    <button
                                        type="button"
                                        disabled={detectingChat}
                                        onClick={handleDetectTelegramChat}
                                        className="text-[9px] font-black tracking-wider text-blue-400 uppercase underline hover:text-blue-300 disabled:opacity-50"
                                    >
                                        {detectingChat
                                            ? 'Mendeteksi...'
                                            : '🔍 Deteksi Chat ID Otomatis'}
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={form.telegramChatId}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            telegramChatId: e.target.value,
                                        }))
                                    }
                                    placeholder="Contoh: 123456789 atau -100123456789 atau @channel"
                                    className="input w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs text-white focus:border-blue-500/50 focus:outline-none"
                                />
                                <p className="mt-1.5 text-[9px] text-neutral-500">
                                    💡 Tips: Buka bot Anda di Telegram dan kirim{' '}
                                    <code className="text-blue-400">
                                        /start
                                    </code>
                                    , lalu klik{' '}
                                    <strong>Deteksi Chat ID Otomatis</strong>.
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={sendingChannel !== null}
                                onClick={() => handleSendTelemetry('telegram')}
                                className="btn flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/15 py-3 text-[10px] font-black tracking-widest text-blue-300 uppercase transition-all hover:bg-blue-500/25 disabled:opacity-50"
                            >
                                {sendingChannel === 'telegram' ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Zap className="h-4 w-4" />
                                )}
                                Kirim Data Telemetri ke Telegram
                            </button>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* WhatsApp Config */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <GlassCard className="space-y-6 border-green-500/20 bg-green-500/5 p-8">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-green-500/20 p-2.5">
                                    <Phone className="h-5 w-5 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black tracking-widest text-green-400 uppercase">
                                        WhatsApp Gateway &amp; Direct
                                    </h3>
                                    <p className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">
                                        Fonnte / Webhook API &amp; Direct WA
                                    </p>
                                </div>
                            </div>
                            <label className="flex cursor-pointer items-center gap-2 text-[9px] font-black tracking-widest text-neutral-400 uppercase">
                                <input
                                    type="checkbox"
                                    checked={form.whatsappEnabled}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            whatsappEnabled: e.target.checked,
                                        }))
                                    }
                                    className="toggle toggle-success toggle-sm"
                                />
                                {form.whatsappEnabled ? 'Aktif' : 'Nonaktif'}
                            </label>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-400 uppercase">
                                    Nomor WhatsApp Tujuan (Penerima)
                                </label>
                                <input
                                    type="text"
                                    value={form.whatsappTarget}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            whatsappTarget: e.target.value,
                                        }))
                                    }
                                    placeholder="081234567890 atau 6281234567890"
                                    className="input w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs text-white focus:border-green-500/50 focus:outline-none"
                                />
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-400 uppercase">
                                        Webhook / Gateway URL
                                    </label>
                                    <input
                                        type="url"
                                        value={form.whatsappWebhook}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                whatsappWebhook: e.target.value,
                                            }))
                                        }
                                        placeholder="https://api.fonnte.com/send"
                                        className="input w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs text-white focus:border-green-500/50 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-400 uppercase">
                                        API Token Gateway (Opsional)
                                    </label>
                                    <input
                                        type="password"
                                        value={form.whatsappToken}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                whatsappToken: e.target.value,
                                            }))
                                        }
                                        placeholder="Token Fonnte / Wablas / Bearer"
                                        className="input w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs text-white focus:border-green-500/50 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    disabled={sendingChannel !== null}
                                    onClick={() =>
                                        handleSendTelemetry('whatsapp')
                                    }
                                    className="btn flex w-full items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/15 py-3 text-[9px] font-black tracking-widest text-green-300 uppercase transition-all hover:bg-green-500/25 disabled:opacity-50"
                                >
                                    {sendingChannel === 'whatsapp' ? (
                                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <Zap className="h-3.5 w-3.5" />
                                    )}
                                    Kirim via API / Webhook
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDirectWhatsApp}
                                    className="btn flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/20 py-3 text-[9px] font-black tracking-widest text-emerald-200 uppercase transition-all hover:bg-emerald-500/30"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Kirim via WhatsApp Web/App
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Email Config */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <GlassCard className="space-y-6 border-orange-500/20 bg-orange-500/5 p-8">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-orange-500/20 p-2.5">
                                    <Mail className="h-5 w-5 text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black tracking-widest text-orange-400 uppercase">
                                        Email Alerts &amp; Telemetry
                                    </h3>
                                    <p className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">
                                        Laporan Tabel HTML Telemetri via Email
                                    </p>
                                </div>
                            </div>
                            <label className="flex cursor-pointer items-center gap-2 text-[9px] font-black tracking-widest text-neutral-400 uppercase">
                                <input
                                    type="checkbox"
                                    checked={form.emailEnabled}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            emailEnabled: e.target.checked,
                                        }))
                                    }
                                    className="toggle toggle-warning toggle-sm"
                                />
                                {form.emailEnabled ? 'Aktif' : 'Nonaktif'}
                            </label>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-400 uppercase">
                                    Email Penerima (Pisahkan dengan koma jika
                                    lebih dari satu)
                                </label>
                                <input
                                    type="text"
                                    value={form.emailRecipient}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            emailRecipient: e.target.value,
                                        }))
                                    }
                                    placeholder="admin@pollutrack.gov.id, operator@gmail.com"
                                    className="input w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-orange-500/50 focus:outline-none"
                                />
                            </div>

                            <div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowSmtpConfig((prev) => !prev)
                                    }
                                    className="flex items-center gap-1.5 text-[9px] font-black tracking-widest text-orange-400 uppercase hover:text-orange-300"
                                >
                                    <Server className="h-3.5 w-3.5" />
                                    {showSmtpConfig
                                        ? 'Sembunyikan Pengaturan SMTP Server'
                                        : 'Konfigurasi SMTP Server (Opsional - Gmail / Custom SMTP)'}
                                </button>

                                {showSmtpConfig && (
                                    <div className="mt-3 grid gap-3 rounded-xl border border-white/10 bg-black/30 p-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-[8px] font-black text-neutral-400 uppercase">
                                                SMTP Host
                                            </label>
                                            <input
                                                type="text"
                                                value={form.smtpHost}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        smtpHost:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="smtp.gmail.com"
                                                className="input w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[8px] font-black text-neutral-400 uppercase">
                                                SMTP Port &amp; Enkripsi
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={form.smtpPort}
                                                    onChange={(e) =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            smtpPort:
                                                                e.target.value,
                                                        }))
                                                    }
                                                    placeholder="587"
                                                    className="input w-1/2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white"
                                                />
                                                <select
                                                    value={form.smtpEncryption}
                                                    onChange={(e) =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            smtpEncryption:
                                                                e.target.value,
                                                        }))
                                                    }
                                                    className="select w-1/2 rounded-lg border border-white/10 bg-neutral-900 px-2 py-2 text-xs text-white"
                                                >
                                                    <option value="tls">
                                                        TLS
                                                    </option>
                                                    <option value="ssl">
                                                        SSL
                                                    </option>
                                                    <option value="none">
                                                        None
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[8px] font-black text-neutral-400 uppercase">
                                                SMTP Username / Email
                                            </label>
                                            <input
                                                type="text"
                                                value={form.smtpUsername}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        smtpUsername:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="email@gmail.com"
                                                className="input w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[8px] font-black text-neutral-400 uppercase">
                                                SMTP Password / App Password
                                            </label>
                                            <input
                                                type="password"
                                                value={form.smtpPassword}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        smtpPassword:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="16 digit Gmail App Password"
                                                className="input w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                disabled={sendingChannel !== null}
                                onClick={() => handleSendTelemetry('email')}
                                className="btn flex w-full items-center justify-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/15 py-3 text-[10px] font-black tracking-widest text-orange-300 uppercase transition-all hover:bg-orange-500/25 disabled:opacity-50"
                            >
                                {sendingChannel === 'email' ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Zap className="h-4 w-4" />
                                )}
                                Kirim Data Telemetri ke Email
                            </button>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Sync Interval & Auto-Broadcast */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <GlassCard className="space-y-6 border-cyan-500/20 bg-cyan-500/5 p-8">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-cyan-500/20 p-2.5">
                                <Clock className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black tracking-widest text-cyan-400 uppercase">
                                    Sync Interval &amp; Otomatisasi
                                </h3>
                                <p className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">
                                    Frekuensi sinkronisasi &amp; aturan
                                    notifikasi otomatis
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-[9px] font-black tracking-widest text-neutral-400 uppercase">
                                    Interval Pengambilan Data Sensor
                                </label>
                                <select
                                    value={form.interval}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            interval: e.target.value,
                                        }))
                                    }
                                    className="select w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-2.5 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                                >
                                    {[
                                        '1 minute',
                                        '5 minutes',
                                        '15 minutes',
                                        '30 minutes',
                                        '1 hour',
                                        '6 hours',
                                    ].map((v) => (
                                        <option
                                            key={v}
                                            value={v}
                                            className="bg-neutral-950"
                                        >
                                            {v}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3 rounded-xl border border-cyan-500/15 bg-black/30 p-4">
                                <label className="flex cursor-pointer items-center justify-between">
                                    <span className="text-[10px] font-black tracking-wider text-white uppercase">
                                        Otomatis Kirim Saat Data IoT Masuk
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={form.autoNotifyOnUpload}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                autoNotifyOnUpload:
                                                    e.target.checked,
                                            }))
                                        }
                                        className="toggle toggle-info toggle-sm"
                                    />
                                </label>

                                {form.autoNotifyOnUpload && (
                                    <div>
                                        <label className="mb-1 block text-[9px] font-bold tracking-widest text-neutral-400 uppercase">
                                            Mode Pengiriman Otomatis
                                        </label>
                                        <select
                                            value={form.autoNotifyMode}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    autoNotifyMode:
                                                        e.target.value,
                                                }))
                                            }
                                            className="select w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-xs text-white"
                                        >
                                            <option value="all">
                                                Kirim Setiap Data Telemetri Baru
                                                Diunggah
                                            </option>
                                            <option value="threshold_only">
                                                Hanya Kirim Saat Melebihi Ambang
                                                Batas Polusi (Alert)
                                            </option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Save Button spanning full width */}
                <div className="xl:col-span-2">
                    <button
                        type="submit"
                        disabled={savingConfig}
                        className="btn flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 text-[11px] font-black tracking-[0.3em] text-black uppercase shadow-[0_10px_40px_rgba(255,255,255,0.1)] transition-transform hover:scale-[1.01] disabled:opacity-50"
                    >
                        <Save className="h-5 w-5" />
                        {savingConfig
                            ? 'Menyimpan Konfigurasi...'
                            : 'Simpan Semua Konfigurasi'}
                    </button>
                </div>
            </form>

            {/* Riwayat Pengiriman Notifikasi Telemetri */}
            <GlassCard className="space-y-4 border-white/10 bg-white/[0.02] p-6 lg:p-8">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/10 p-2.5">
                        <History className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black tracking-widest text-white uppercase">
                            Riwayat Pengiriman Notifikasi &amp; Perubahan
                            Konfigurasi
                        </h3>
                        <p className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">
                            Log status pengiriman data telemetri ke Telegram,
                            WhatsApp &amp; Email
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-white/10 text-[9px] font-black tracking-widest text-neutral-500 uppercase">
                                <th className="py-3 pr-4">Waktu</th>
                                <th className="py-3 pr-4">Status / Aksi</th>
                                <th className="py-3 pr-4">Detail Pengiriman</th>
                                <th className="py-3">Oleh</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {(notificationLogs as NotificationLogItem[])
                                .length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-6 text-center text-neutral-500"
                                    >
                                        Belum ada riwayat pengiriman notifikasi
                                        telemetri.
                                    </td>
                                </tr>
                            ) : (
                                (notificationLogs as NotificationLogItem[]).map(
                                    (log) => {
                                        const isSuccess =
                                            log.action.includes('Terkirim') ||
                                            log.action.includes('Config');
                                        const isFail =
                                            log.action.includes('Gagal');

                                        return (
                                            <tr key={log.id}>
                                                <td className="py-3 pr-4 font-mono text-[10px] whitespace-nowrap text-neutral-400">
                                                    {log.created_at}
                                                </td>
                                                <td className="py-3 pr-4 whitespace-nowrap">
                                                    <span
                                                        className={`badge inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase ${
                                                            isFail
                                                                ? 'border border-red-500/30 bg-red-500/10 text-red-400'
                                                                : isSuccess
                                                                  ? 'border border-green-500/30 bg-green-500/10 text-green-400'
                                                                  : 'border border-white/10 bg-white/5 text-neutral-300'
                                                        }`}
                                                    >
                                                        {isFail ? (
                                                            <AlertCircle className="h-3 w-3" />
                                                        ) : (
                                                            <CheckCircle2 className="h-3 w-3" />
                                                        )}
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 text-neutral-300">
                                                    {log.description}
                                                </td>
                                                <td className="py-3 font-mono text-[10px] text-neutral-400">
                                                    {log.user_name}
                                                </td>
                                            </tr>
                                        );
                                    },
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}

ConfigPage.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Konfigurasi Sistem', href: '/dashboard/admin/config' },
        ]}
    >
        {page}
    </AppLayout>
);

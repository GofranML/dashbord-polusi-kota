import type { LucideIcon } from 'lucide-react';
import { Clock } from 'lucide-react';
import React from 'react';
import type { IspuCategory } from '@/lib/ispu';
import { cn } from '@/lib/utils';
import { GlassCard } from './GlassCard';

export type AQIStatus = IspuCategory | string;

interface SensorCardProps {
    title: string;
    value: string | number;
    unit: string;
    status: AQIStatus;
    icon?: LucideIcon;
    progress?: number;
    battery?: number;
    lastUpdate?: string;
    className?: string;
}

const statusBadgeStyles: Record<string, string> = {
    Baik: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    Sedang: 'text-blue-400 bg-blue-500/10 border-blue-500/25',
    'Tidak Sehat': 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    'Sangat Tidak Sehat': 'text-rose-400 bg-rose-500/10 border-rose-500/25',
    Berbahaya: 'text-red-400 bg-red-950/40 border-red-800/40',
    // Fallback for legacy status if any
    Memuaskan: 'text-blue-400 bg-blue-500/10 border-blue-500/25',
    Rendah: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    'Sangat Rendah': 'text-rose-400 bg-rose-500/10 border-rose-500/25',
    Kritis: 'text-rose-500 bg-rose-950/40 border-rose-800/40',
};

const borderAccentMap: Record<string, 'green' | 'blue' | 'orange' | 'red' | 'cyan'> = {
    Baik: 'green',
    Sedang: 'blue',
    'Tidak Sehat': 'orange',
    'Sangat Tidak Sehat': 'red',
    Berbahaya: 'red',
};

export function SensorCard({
    title,
    value,
    unit,
    status,
    icon: Icon,
    lastUpdate,
    className,
}: SensorCardProps) {
    const isGasSensor = title.toLowerCase().includes('mq135') || title.toLowerCase().includes('gas');
    const badgeStyle = statusBadgeStyles[status] || 'text-slate-300 bg-slate-800 border-slate-700';
    const accent = borderAccentMap[status] || 'cyan';

    return (
        <GlassCard neonColor={accent} className={cn('p-5 space-y-4 hover:border-slate-700 transition-colors', className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {Icon && (
                        <div className="rounded-lg bg-slate-800/80 p-2 text-cyan-400 border border-slate-700/60">
                            <Icon className="size-4" />
                        </div>
                    )}
                    <span className="text-xs font-medium text-slate-300 truncate max-w-[140px]">
                        {title}
                    </span>
                </div>
                <span className={cn('rounded px-2 py-0.5 text-[10px] font-semibold tracking-wide border', badgeStyle)}>
                    {status}
                </span>
            </div>

            <div className="space-y-1">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold tracking-tight text-white tabular-nums">
                        {typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(1) : value}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                        {unit}
                    </span>
                </div>

                {isGasSensor && (
                    <p className="text-[10px] text-slate-400 leading-tight">
                        Indeks resistansi gas analog (uncalibrated sensitivity index).
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                    <Clock className="size-3 text-slate-400" />
                    <span>{lastUpdate || 'Telemetri Terkini'}</span>
                </div>
                <span className="text-slate-400 font-sans">Empiris</span>
            </div>
        </GlassCard>
    );
}

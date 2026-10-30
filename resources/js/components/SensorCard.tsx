import type { LucideIcon } from 'lucide-react';
import { Battery, Clock } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from './GlassCard';

export type AQIStatus =
    | 'Baik'
    | 'Memuaskan'
    | 'Sedang'
    | 'Rendah'
    | 'Sangat Rendah'
    | 'Kritis';

interface SensorCardProps {
    title: string;
    value: string | number;
    unit: string;
    status: AQIStatus;
    icon: LucideIcon;
    progress: number;
    battery?: number;
    lastUpdate?: string;
    className?: string;
}

const statusColors = {
    Baik: 'text-green-400',
    Memuaskan: 'text-cyan-400',
    Sedang: 'text-yellow-400',
    Rendah: 'text-orange-400',
    'Sangat Rendah': 'text-red-400',
    Kritis: 'text-purple-400',
};

const neonMap = {
    Baik: 'green' as const,
    Memuaskan: 'cyan' as const,
    Sedang: 'blue' as const,
    Rendah: 'orange' as const,
    'Sangat Rendah': 'red' as const,
    Kritis: 'purple' as const,
};

export function SensorCard({
    title,
    value,
    unit,
    status,
    icon: Icon,
    progress,
    battery,
    lastUpdate,
    className,
}: SensorCardProps) {
    return (
        <GlassCard neonColor={neonMap[status]} className={cn('p-5', className)}>
            <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-white/5 p-2">
                    {/* <Icon className={cn('w-6 h-6', statusColors[status])} /> */}
                </div>
                <div className="flex flex-col items-end">
                    <span
                        className={cn(
                            'rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold tracking-tighter uppercase',
                            statusColors[status],
                        )}
                    >
                        {status}
                    </span>
                    {battery !== undefined && (
                        <div className="mt-1 flex items-center gap-1 font-mono text-[8px] text-neutral-500">
                            <Battery
                                className={cn(
                                    'h-3 w-3',
                                    battery < 20
                                        ? 'text-red-500'
                                        : 'text-green-500',
                                )}
                            />
                            {battery}%
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                    {title}
                </h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black tracking-tighter text-white">
                        {value}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">
                        {unit}
                    </span>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all duration-1000 ease-out',
                            statusColors[status].replace('text', 'bg'),
                            'shadow-[0_0_8px_currentColor]',
                        )}
                        style={{ width: `${progress}%`, color: 'inherit' }}
                    />
                </div>
                <div className="flex items-center justify-between text-[8px] font-black tracking-widest text-neutral-500 uppercase">
                    <div className="flex items-center gap-1">
                        <Clock className="h-2 w-2" />
                        {lastUpdate || 'Just Now'}
                    </div>
                    <span>{progress}% Capacity</span>
                </div>
            </div>
        </GlassCard>
    );
}

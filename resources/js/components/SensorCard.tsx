import React from 'react';
import { GlassCard } from './GlassCard';
import { LucideIcon, Battery, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AQIStatus = 'Baik' | 'Sedang' | 'Tidak Sehat' | 'Berbahaya' | 'Sangat Tidak Sehat';

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
    'Baik': 'text-green-400',
    'Sedang': 'text-yellow-400',
    'Tidak Sehat': 'text-orange-400',
    'Berbahaya': 'text-red-400',
    'Sangat Tidak Sehat': 'text-red-400',
};

const neonMap = {
    'Baik': 'green' as const,
    'Sedang': 'blue' as const,
    'Tidak Sehat': 'orange' as const,
    'Berbahaya': 'red' as const,
    'Sangat Tidak Sehat': 'red' as const,
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
    className 
}: SensorCardProps) {
    return (
        <GlassCard neonColor={neonMap[status]} className={cn('p-5', className)}>
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-white/5">
                    {/* <Icon className={cn('w-6 h-6', statusColors[status])} /> */}
                </div>
                <div className="flex flex-col items-end">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 uppercase tracking-tighter', statusColors[status])}>
                        {status}
                    </span>
                    {battery !== undefined && (
                        <div className="flex items-center gap-1 mt-1 text-[8px] text-neutral-500 font-mono">
                            <Battery className={cn('w-3 h-3', battery < 20 ? 'text-red-500' : 'text-green-500')} />
                            {battery}%
                        </div>
                    )}
                </div>
            </div>
            
            <div className="space-y-1">
                <h3 className="text-xs text-neutral-400 font-bold uppercase tracking-widest">{title}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white tracking-tighter">{value}</span>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase">{unit}</span>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className={cn('h-full transition-all duration-1000 ease-out rounded-full', statusColors[status].replace('text', 'bg'), 'shadow-[0_0_8px_currentColor]')}
                        style={{ width: `${progress}%`, color: 'inherit' }}
                    />
                </div>
                <div className="flex justify-between items-center text-[8px] text-neutral-500 uppercase font-black tracking-widest">
                    <div className="flex items-center gap-1">
                        <Clock className="w-2 h-2" />
                        {lastUpdate || 'Just Now'}
                    </div>
                    <span>{progress}% Capacity</span>
                </div>
            </div>
        </GlassCard>
    );
}

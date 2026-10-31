import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    neonColor?: 'cyan' | 'purple' | 'green' | 'orange' | 'red' | 'blue';
}

// Clean border accent mapping without glowing drop-shadow halos
const borderAccentStyles = {
    cyan: 'border-cyan-500/30 hover:border-cyan-500/50',
    purple: 'border-slate-700 hover:border-slate-600',
    green: 'border-emerald-500/30 hover:border-emerald-500/50',
    orange: 'border-amber-500/30 hover:border-amber-500/50',
    red: 'border-rose-500/30 hover:border-rose-500/50',
    blue: 'border-blue-500/30 hover:border-blue-500/50',
};

export function GlassCard({ children, className, neonColor }: GlassCardProps) {
    return (
        <div
            className={cn(
                'relative rounded-xl border border-slate-800 bg-slate-900/80 transition-colors',
                neonColor ? borderAccentStyles[neonColor] : 'hover:border-slate-700',
                className,
            )}
        >
            <div className="relative z-10">{children}</div>
        </div>
    );
}

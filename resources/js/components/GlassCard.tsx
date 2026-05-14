import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    neonColor?: 'cyan' | 'purple' | 'green' | 'orange' | 'red' | 'blue';
}

const neonStyles = {
    cyan: 'shadow-[0_0_15px_rgba(34,211,238,0.2)] border-cyan-500/30',
    purple: 'shadow-[0_0_15px_rgba(168,85,247,0.2)] border-purple-500/30',
    green: 'shadow-[0_0_15px_rgba(34,197,94,0.2)] border-green-500/30',
    orange: 'shadow-[0_0_15px_rgba(249,115,22,0.2)] border-orange-500/30',
    red: 'shadow-[0_0_15px_rgba(239,68,68,0.2)] border-red-500/30',
    blue: 'shadow-[0_0_15px_rgba(59,130,246,0.2)] border-blue-500/30',
};

export function GlassCard({ children, className, neonColor }: GlassCardProps) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10',
                neonColor && neonStyles[neonColor],
                className
            )}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

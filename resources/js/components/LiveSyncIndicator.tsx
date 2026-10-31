import React from 'react';
import { RefreshCw, Radio, WifiOff, AlertCircle, CheckCircle2, Pause, Play, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SyncStatus } from '@/hooks/use-live-telemetry';

export interface LiveSyncIndicatorProps {
    isLive: boolean;
    isSyncing: boolean;
    syncStatus: SyncStatus;
    syncStatusText: string;
    secondsSinceLastSync: number;
    hasLiveGpsFix?: boolean;
    onRefresh?: () => void;
    onToggleLive?: () => void;
    className?: string;
    variant?: 'compact' | 'full' | 'navbar';
}

export function LiveSyncIndicator({
    isLive,
    isSyncing,
    syncStatus,
    syncStatusText,
    secondsSinceLastSync,
    hasLiveGpsFix,
    onRefresh,
    onToggleLive,
    className,
    variant = 'compact',
}: LiveSyncIndicatorProps) {
    const isError = syncStatus === 'error' || syncStatus === 'stale';
    const isOffline = syncStatus === 'offline';

    // Dot color and animation
    let dotColor = 'bg-emerald-500';
    let ringColor = 'bg-emerald-400';
    let textColor = 'text-emerald-400';
    let borderColor = 'border-emerald-500/20';
    let bgColor = 'bg-emerald-500/10';

    if (isOffline) {
        dotColor = 'bg-slate-500';
        ringColor = 'bg-slate-400';
        textColor = 'text-slate-400';
        borderColor = 'border-slate-700';
        bgColor = 'bg-slate-800/60';
    } else if (isError) {
        dotColor = 'bg-amber-500';
        ringColor = 'bg-amber-400';
        textColor = 'text-amber-400';
        borderColor = 'border-amber-500/30';
        bgColor = 'bg-amber-500/10';
    } else if (isSyncing) {
        dotColor = 'bg-cyan-500';
        ringColor = 'bg-cyan-400';
        textColor = 'text-cyan-400';
        borderColor = 'border-cyan-500/30';
        bgColor = 'bg-cyan-500/10';
    }

    if (variant === 'navbar') {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <div className={cn(
                    "flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs transition-colors backdrop-blur-sm",
                    borderColor,
                    bgColor
                )}>
                    {isOffline ? (
                        <WifiOff className="size-3 text-slate-400" />
                    ) : (
                        <span className="relative flex size-2">
                            {isLive && !isOffline && (
                                <span className={cn(
                                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                                    ringColor
                                )} />
                            )}
                            <span className={cn("relative inline-flex size-2 rounded-full", dotColor)} />
                        </span>
                    )}

                    <span className={cn("font-medium text-[11px] select-none", textColor)}>
                        {isSyncing ? 'Sinkronisasi...' : syncStatusText}
                    </span>

                    {onRefresh && (
                        <button
                            type="button"
                            onClick={onRefresh}
                            disabled={isSyncing}
                            title="Perbarui telemetri sekarang"
                            className="ml-1 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={cn("size-3", isSyncing && "animate-spin text-cyan-400")} />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={cn(
            "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-md",
            className
        )}>
            {/* Left Status Information */}
            <div className="flex items-center gap-3">
                <span className="relative flex size-2.5">
                    {isLive && !isOffline && (
                        <span className={cn(
                            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                            ringColor
                        )} />
                    )}
                    <span className={cn("relative inline-flex size-2.5 rounded-full", dotColor)} />
                </span>

                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200">
                            Pembaruan Telemetri Otomatis
                        </span>
                        <span className={cn(
                            "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                            borderColor,
                            bgColor,
                            textColor
                        )}>
                            {isLive ? 'Aktif (15s)' : 'Dijeda'}
                        </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                        {syncStatusText}
                    </span>
                </div>
            </div>

            {/* Right Status Actions & GPS Info */}
            <div className="flex items-center gap-2">
                {typeof hasLiveGpsFix === 'boolean' && (
                    <div className={cn(
                        "hidden sm:flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px]",
                        hasLiveGpsFix
                            ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                            : "border-amber-500/20 bg-amber-500/5 text-amber-400"
                    )}>
                        <Navigation className="size-3" />
                        <span>{hasLiveGpsFix ? 'GPS Fix Terhubung' : 'Menunggu GPS Fix'}</span>
                    </div>
                )}

                {onToggleLive && (
                    <button
                        type="button"
                        onClick={onToggleLive}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-750 hover:text-white"
                        title={isLive ? 'Jeda pembaruan otomatis' : 'Lanjutkan pembaruan otomatis'}
                    >
                        {isLive ? (
                            <>
                                <Pause className="size-3 text-amber-400" />
                                <span className="hidden md:inline">Jeda</span>
                            </>
                        ) : (
                            <>
                                <Play className="size-3 text-emerald-400" />
                                <span className="hidden md:inline">Lanjutkan</span>
                            </>
                        )}
                    </button>
                )}

                {onRefresh && (
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={isSyncing}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
                        title="Tarik data terbaru dari server"
                    >
                        <RefreshCw className={cn("size-3.5", isSyncing && "animate-spin")} />
                        <span>Sinkron Sekarang</span>
                    </button>
                )}
            </div>
        </div>
    );
}

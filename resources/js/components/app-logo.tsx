import { PolluTrackSymbol } from '@/components/PolluTrackLogo';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 shadow-xs">
                <PolluTrackSymbol className="size-5" />
            </div>
            <div className="flex flex-col text-left leading-none">
                <div className="flex items-center gap-1">
                    <span className="font-sans text-sm font-bold tracking-wider text-sidebar-foreground">
                        POLLU<span className="text-cyan-500">TRACK</span>
                    </span>
                    <span className="rounded bg-cyan-500/10 px-1 py-0.5 text-[8px] font-mono font-medium text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                        IoT
                    </span>
                </div>
                <span className="mt-0.5 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                    Mobile Transit
                </span>
            </div>
        </div>
    );
}

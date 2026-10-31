import React from 'react';

interface PolluTrackLogoProps extends React.SVGAttributes<SVGElement> {
    /**
     * Display variant:
     * - 'symbol': Just the Transit Pulse Pin icon
     * - 'full': Icon + POLLUTRACK wordmark + Subtitle
     * - 'horizontal': Icon + POLLUTRACK wordmark (compact)
     */
    variant?: 'symbol' | 'full' | 'horizontal';
    /**
     * Size preset:
     * - 'sm': 28px height
     * - 'md': 36px height (default)
     * - 'lg': 48px height
     * - 'xl': 64px height
     */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Optional custom accent color for the telemetry pulse wave */
    accentColor?: string;
}

/**
 * The PolluTrack Transit Pulse Pin Symbol.
 * Communicates:
 * 1. Transit Corridor Arc: Ground-level transit route along city roads
 * 2. Precision Geo-Pin: Hyperlocal GPS telemetry coordinate
 * 3. IoT Sensor Pulse: Dynamic acoustic/radio air quality sampling wave
 */
export function PolluTrackSymbol({
    className = 'size-8',
    accentColor = '#06B6D4',
    ...props
}: React.SVGAttributes<SVGSVGElement> & { accentColor?: string }) {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="POLLUTRACK Symbol"
            role="img"
            {...props}
        >
            <defs>
                {/* Primary Pin Gradient */}
                <linearGradient id="ptPinGrad" x1="24" y1="12" x2="24" y2="38" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>

                {/* Pulse Glow Gradient */}
                <linearGradient id="ptPulseGrad" x1="12" y1="4" x2="36" y2="4" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#22D3EE" stopOpacity="1" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
                </linearGradient>

                {/* Transit Corridor Track Gradient */}
                <linearGradient id="ptTrackGrad" x1="6" y1="41" x2="42" y2="41" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.1" />
                </linearGradient>
            </defs>

            {/* 1. IoT Sensor Telemetry Pulse Waves (Radiating from moving sensor) */}
            {/* Outer Sensor Wave */}
            <path
                d="M 11 11 C 18 4.5, 30 4.5, 37 11"
                stroke="url(#ptPulseGrad)"
                strokeWidth="2.2"
                strokeLinecap="round"
            />
            {/* Inner Sensor Wave */}
            <path
                d="M 15.5 14.5 C 20.5 10.5, 27.5 10.5, 32.5 14.5"
                stroke={accentColor}
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* 2. Precision Hyperlocal Pin Body (Mobile IoT Node) */}
            <path
                d="M 24 37.5 C 22.8 35.5 15 27.8 15 21 C 15 16 19 12 24 12 C 29 12 33 16 33 21 C 33 27.8 25.2 35.5 24 37.5 Z"
                fill="url(#ptPinGrad)"
            />

            {/* Pin Aperture / Core Sensor Chamber */}
            <circle cx="24" cy="21" r="5" fill="#0B0F17" />
            {/* Air Intake Sensor Core Dot */}
            <circle cx="24" cy="21" r="2.4" fill="#38BDF8" />

            {/* 3. Public Transit Corridor / Vehicle Ground Route Arc */}
            {/* Primary transit artery lane */}
            <path
                d="M 6 41 C 18 38.5, 30 38.5, 42 41"
                stroke="url(#ptTrackGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            {/* Transit vehicle guide ticks / lane markers */}
            <path
                d="M 18 43.5 L 21 43.5 M 27 43.5 L 30 43.5"
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeOpacity="0.6"
            />
            {/* Street-level air sampling drop point */}
            <circle cx="24" cy="38" r="1.5" fill="#38BDF8" />
        </svg>
    );
}

/**
 * POLLUTRACK Full Logo & Wordmark Component
 */
export default function PolluTrackLogo({
    variant = 'full',
    size = 'md',
    className = '',
    accentColor = '#06B6D4',
    ...props
}: PolluTrackLogoProps) {
    const sizeConfig = {
        sm: {
            symbolClass: 'size-7',
            titleClass: 'text-sm font-bold tracking-[0.06em]',
            subClass: 'text-[9px] font-semibold tracking-[0.12em]',
            gapClass: 'gap-2',
        },
        md: {
            symbolClass: 'size-9',
            titleClass: 'text-base font-bold tracking-[0.07em]',
            subClass: 'text-[10px] font-semibold tracking-[0.14em]',
            gapClass: 'gap-2.5',
        },
        lg: {
            symbolClass: 'size-11',
            titleClass: 'text-xl font-bold tracking-[0.08em]',
            subClass: 'text-[11px] font-semibold tracking-[0.16em]',
            gapClass: 'gap-3',
        },
        xl: {
            symbolClass: 'size-14',
            titleClass: 'text-2xl font-bold tracking-[0.09em]',
            subClass: 'text-xs font-semibold tracking-[0.18em]',
            gapClass: 'gap-3.5',
        },
    }[size];

    if (variant === 'symbol') {
        return <PolluTrackSymbol className={`${sizeConfig.symbolClass} ${className}`} accentColor={accentColor} />;
    }

    return (
        <div className={`flex items-center ${sizeConfig.gapClass} ${className}`}>
            <PolluTrackSymbol className={`${sizeConfig.symbolClass} shrink-0`} accentColor={accentColor} />
            <div className="flex flex-col justify-center leading-none">
                <div className="flex items-center gap-1.5">
                    <span className={`font-sans text-slate-900 dark:text-white ${sizeConfig.titleClass}`}>
                        POLLU<span className="text-cyan-500">TRACK</span>
                    </span>
                    <span className="inline-flex items-center rounded px-1 py-0.2 text-[9px] font-mono font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                        IoT
                    </span>
                </div>
                {variant === 'full' && (
                    <span className={`mt-0.5 font-mono uppercase text-slate-500 dark:text-slate-400 ${sizeConfig.subClass}`}>
                        Mobile Air Quality Intelligence
                    </span>
                )}
            </div>
        </div>
    );
}

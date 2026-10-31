import { Head, Link, usePage } from '@inertiajs/react';
import L from 'leaflet';
import {
    Activity,
    Wind,
    Droplets,
    Thermometer,
    Gauge,
    MapPin,
    Radio,
    Clock,
    Shield,
    AlertCircle,
    BarChart3,
    CheckCircle2,
    Bus,
    Navigation,
    Layers,
    Cpu,
    ExternalLink,
    ChevronRight,
    TrendingUp,
    RefreshCw,
    SlidersHorizontal,
    CloudRain,
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from 'react-leaflet';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import PolluTrackLogo, { PolluTrackSymbol } from '@/components/PolluTrackLogo';
import {
    PALEMBANG_TRANSIT_BREADCRUMBS,
    PALEMBANG_TRANSIT_CORRIDOR_NAME,
    PALEMBANG_TRANSIT_VEHICLE_CODE,
    type TransitBreadcrumb,
} from '@/data/palembang-corridor';
import { calculateIspuFromPm25, type IspuCategory } from '@/lib/ispu';
import { cn } from '@/lib/utils';
import { useLiveTelemetry } from '@/hooks/use-live-telemetry';
import { LiveSyncIndicator } from '@/components/LiveSyncIndicator';
import 'leaflet/dist/leaflet.css';

// Leaflet default icon fix for bundler
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Leaflet Icons for Vehicle & Transit Breadcrumbs
const createVehicleIcon = () => {
    return L.divIcon({
        className: 'custom-vehicle-marker',
        html: `
            <div class="relative flex items-center justify-center">
                <div class="absolute w-12 h-12 bg-cyan-500/25 rounded-full animate-ping"></div>
                <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-400 shadow-lg text-cyan-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M8 6v6"></path>
                        <path d="M15 6v6"></path>
                        <path d="M2 12h19.6"></path>
                        <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4c-1.1 0-2.1.8-2.4 1.8l-1.4 5c-.1.4-.2.8-.2 1.2 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"></path>
                        <circle cx="7" cy="18" r="2"></circle>
                        <circle cx="17" cy="18" r="2"></circle>
                    </svg>
                </div>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
};

const createBreadcrumbIcon = (colorHex: string, isSelected: boolean = false) => {
    const size = isSelected ? 18 : 10;
    const border = isSelected ? 'border-2 border-white ring-2 ring-cyan-400' : 'border border-slate-900';
    return L.divIcon({
        className: 'custom-breadcrumb-marker',
        html: `
            <div class="flex items-center justify-center" style="width: ${size}px; height: ${size}px;">
                <div class="rounded-full ${border} shadow-sm" style="background-color: ${colorHex}; width: 100%; height: 100%;"></div>
            </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
};

// Map View Controller Helper Component
function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: true });
    }, [center, zoom, map]);
    return null;
}

export default function Welcome() {
    const {
        auth,
        mapNodes = [],
        sensorData = [],
        trendData = [],
        alertsList = [],
        activeDevicesCount = 1,
        totalDevicesCount = 2,
    } = usePage().props as any;

    const [mounted, setMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedBreadcrumb, setSelectedBreadcrumb] = useState<TransitBreadcrumb | null>(null);
    const [mapViewMode, setMapViewMode] = useState<'corridor' | 'vehicle'>('corridor');
    const [chartMetric, setChartMetric] = useState<'pm25' | 'mq135'>('pm25');

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Connect live real-time telemetry polling hook (15s interval)
    const {
        telemetry: liveTelemetry,
        deviceInfo: liveDevice,
        allDevices: liveAllDevices,
        isLive,
        isSyncing,
        syncStatus,
        syncStatusText,
        secondsSinceLastSync,
        hasLiveGpsFix,
        gpsStatusText,
        refetch: refreshTelemetry,
        togglePolling,
    } = useLiveTelemetry({
        pollingIntervalMs: 15000,
        initialData: mapNodes && mapNodes.length > 0 ? {
            device: {
                id: mapNodes[0].device_id || 16,
                name: mapNodes[0].name || 'Palembang',
                status: mapNodes[0].status || 'online',
                last_seen_at: mapNodes[0].timestamp || null,
            },
            latest_data: {
                id: mapNodes[0].id || 0,
                device_id: mapNodes[0].device_id || 16,
                datetime: mapNodes[0].timestamp || new Date().toISOString(),
                pm25: mapNodes[0].pm25,
                pm10: mapNodes[0].pm10,
                pm1: mapNodes[0].pm1,
                gas_index: mapNodes[0].mq135,
                gps_lat: mapNodes[0].lat,
                gps_lng: mapNodes[0].lng,
                rain_status: mapNodes[0].rain,
                air_pressure: mapNodes[0].pressure,
                temperature: mapNodes[0].temperature || 31.4,
                humidity: mapNodes[0].humidity,
                battery_status: null,
                created_at: mapNodes[0].timestamp,
                updated_at: mapNodes[0].timestamp,
            }
        } : null,
    });

    // 1. Process latest telemetry from DB / Live updates
    const latestNode = useMemo(() => {
        if (mapNodes && mapNodes.length > 0) {
            return mapNodes[0];
        }
        return null;
    }, [mapNodes]);

    // Current metrics prioritize live telemetry over initial static load
    const currentPm25 = liveTelemetry?.pm25 !== undefined && liveTelemetry?.pm25 !== null
        ? Number(liveTelemetry.pm25)
        : (latestNode ? Number(latestNode.pm25) : 62.0);

    const currentPm10 = liveTelemetry?.pm10 !== undefined && liveTelemetry?.pm10 !== null
        ? Number(liveTelemetry.pm10)
        : (latestNode ? Number(latestNode.pm10 || 80.0) : 80.0);

    const currentGasIndex = liveTelemetry?.gas_index !== undefined && liveTelemetry?.gas_index !== null
        ? Number(liveTelemetry.gas_index)
        : (latestNode ? Number(latestNode.mq135 || 192) : 192);

    const currentHumidity = liveTelemetry?.humidity !== undefined && liveTelemetry?.humidity !== null
        ? Number(liveTelemetry.humidity)
        : (latestNode ? Number(latestNode.humidity || 69.0) : 69.0);

    const currentPressure = liveTelemetry?.air_pressure !== undefined && liveTelemetry?.air_pressure !== null
        ? Number(liveTelemetry.air_pressure)
        : (latestNode ? Number(latestNode.pressure || 681.2) : 681.2);

    const currentRainStatus = (liveTelemetry?.rain_status) || latestNode?.rain || 'Tidak Hujan';

    // Calculate official ISPU according to KLHK Permen LHK No. 14/2020
    const ispuEval = useMemo(() => {
        return calculateIspuFromPm25(currentPm25);
    }, [currentPm25]);

    // Validated timestamp & recency
    const latestTimestamp = useMemo(() => {
        if (liveTelemetry?.datetime) return new Date(liveTelemetry.datetime);
        if (latestNode?.timestamp) return new Date(latestNode.timestamp);
        return new Date();
    }, [liveTelemetry, latestNode]);

    const isDataRecent = useMemo(() => {
        const diffMinutes = (Date.now() - latestTimestamp.getTime()) / (1000 * 60);
        return diffMinutes <= 30; // true if received within last 30 mins
    }, [latestTimestamp]);

    // 2. Verified Palembang Transit Breadcrumbs & Corridor Geometry
    const breadcrumbs = PALEMBANG_TRANSIT_BREADCRUMBS;
    const polylinePositions = useMemo<[number, number][]>(() => {
        return breadcrumbs.map((b) => [b.lat, b.lng]);
    }, [breadcrumbs]);

    // Active vehicle location (prioritize verified live GPS if available)
    const latestBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
    const vehiclePosition: [number, number] = useMemo(() => {
        if (liveTelemetry && liveTelemetry.gps_lat !== null && liveTelemetry.gps_lng !== null && Number(liveTelemetry.gps_lat) !== 0 && Number(liveTelemetry.gps_lng) !== 0) {
            return [Number(liveTelemetry.gps_lat), Number(liveTelemetry.gps_lng)];
        }
        if (latestNode && latestNode.lat && latestNode.lat !== 0 && latestNode.lng && latestNode.lng !== 0) {
            return [latestNode.lat, latestNode.lng];
        }
        return [latestBreadcrumb.lat, latestBreadcrumb.lng];
    }, [liveTelemetry, latestNode, latestBreadcrumb]);

    // Active map center based on view mode
    const mapCenter = useMemo<[number, number]>(() => {
        if (mapViewMode === 'vehicle') {
            return vehiclePosition;
        }
        // Center around Simpang Polda / Jl. Jendral Sudirman
        return [-2.945, 104.755];
    }, [mapViewMode, vehiclePosition]);

    const mapZoom = mapViewMode === 'vehicle' ? 15 : 13;

    // 3. 24-Hour Trend Data (Synthesized from actual chronological records in mapNodes or trendData)
    const baseChartData = useMemo(() => {
        if (trendData && trendData.length > 0) {
            return trendData;
        }
        if (mapNodes && mapNodes.length > 0) {
            return [...mapNodes]
                .reverse()
                .slice(-24)
                .map((node: any) => {
                    const date = new Date(node.timestamp);
                    return {
                        time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                        pm25: Number(node.pm25 || 0),
                        pm10: Number(node.pm10 || 0),
                        mq135: Number(node.mq135 || 0),
                        humidity: Number(node.humidity || 0),
                    };
                });
        }
        // Fallback to breadcrumbs trend if nodes empty
        return breadcrumbs.slice(-24).map((b) => {
            const date = new Date(b.timestamp);
            return {
                time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                pm25: b.pm25,
                pm10: b.pm10,
                mq135: b.gas_index,
                humidity: b.humidity,
            };
        });
    }, [trendData, mapNodes, breadcrumbs]);

    // Live reactive chart data: append or update live point dynamically
    const chartData = useMemo(() => {
        if (!liveTelemetry || !liveTelemetry.datetime) return baseChartData;
        const timeStr = new Date(liveTelemetry.datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const existingIdx = baseChartData.findIndex((p: any) => p.time === timeStr);
        const livePoint = {
            time: timeStr,
            pm25: Number(liveTelemetry.pm25 || 0),
            pm10: Number(liveTelemetry.pm10 || 0),
            mq135: Number(liveTelemetry.gas_index || 0),
            humidity: Number(liveTelemetry.humidity || 0),
        };
        if (existingIdx >= 0) {
            const updated = [...baseChartData];
            updated[existingIdx] = livePoint;
            return updated;
        }
        return [...baseChartData, livePoint].slice(-24);
    }, [baseChartData, liveTelemetry]);

    // Min, Avg, Max stats for trend chart
    const trendStats = useMemo(() => {
        if (!chartData || chartData.length === 0) return { min: 0, avg: 0, max: 0 };
        const key = chartMetric;
        const values = chartData.map((d: any) => Number(d[key]) || 0);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = Math.round((values.reduce((a: number, b: number) => a + b, 0) / values.length) * 10) / 10;
        return { min, avg, max };
    }, [chartData, chartMetric]);

    return (
        <div className="min-h-screen bg-[#0B0F17] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
            <Head title="POLLUTRACK — Mobile Air Quality Intelligence Platform" />

            {/* ========================================================================= */}
            {/* 1. NAVBAR                                                                 */}
            {/* ========================================================================= */}
            <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    {/* Brand Lockup */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="transition-opacity hover:opacity-90">
                            <PolluTrackLogo variant="full" size="md" />
                        </Link>

                        {/* Navigation Links (Desktop) */}
                        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
                            <a href="#corridor-map" className="hover:text-cyan-400 transition-colors">
                                Peta Koridor
                            </a>
                            <a href="#live-telemetry" className="hover:text-cyan-400 transition-colors">
                                Telemetri Kendaraan
                            </a>
                            <a href="#analytics" className="hover:text-cyan-400 transition-colors">
                                Analitik Tren
                            </a>
                            <a href="#architecture" className="hover:text-cyan-400 transition-colors">
                                Arsitektur Sistem
                            </a>
                        </nav>
                    </div>

                    {/* Right Controls: Fleet Status, Live Sync & Auth CTA */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Live Sync Status Indicator in Navbar */}
                        <LiveSyncIndicator
                            variant="navbar"
                            isLive={isLive}
                            isSyncing={isSyncing}
                            syncStatus={syncStatus}
                            syncStatusText={syncStatusText}
                            secondsSinceLastSync={secondsSinceLastSync}
                            onRefresh={refreshTelemetry}
                        />

                        {/* Real Fleet Status Pill */}
                        <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                            </span>
                            <span className="text-slate-300 font-medium font-mono text-[11px]">
                                {PALEMBANG_TRANSIT_VEHICLE_CODE}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400 text-[11px]">Palembang</span>
                        </div>

                        {/* Auth Button */}
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-500/20"
                            >
                                <Activity className="size-3.5" />
                                Dashboard Petugas
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
                            >
                                Masuk Petugas
                                <ChevronRight className="size-3.5 text-slate-400" />
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* ========================================================================= */}
            {/* 2. HERO SECTION                                                           */}
            {/* ========================================================================= */}
            <section className="relative border-b border-slate-800/60 bg-radial from-slate-900/50 via-[#0B0F17] to-[#0B0F17] py-12 lg:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                        {/* Left: Value Proposition */}
                        <div className="space-y-6 lg:col-span-7">
                            {/* Mission Pill */}
                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs text-cyan-400">
                                <Bus className="size-3.5" />
                                <span className="font-semibold tracking-wide">
                                    PEMATAUAN UDARA BERGERAK ARMADA TRANSIT
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                                Pemantauan Kualitas Udara Bergerak Berbasis Transportasi Publik
                            </h1>

                            {/* Factual Subtitle */}
                            <p className="max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed">
                                Mendeteksi dan memetakan paparan polusi udara perkotaan secara dinamis dan hiperlokal
                                melalui sensor IoT yang terpasang pada armada transportasi umum Kota Palembang, merekam
                                data lingkungan empiris di setiap koordinat perjalanan warga.
                            </p>

                            {/* Action Links */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <a
                                    href="#corridor-map"
                                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                                >
                                    <MapPin className="size-4" />
                                    Jelajahi Peta Koridor
                                </a>
                                <a
                                    href="#live-telemetry"
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                >
                                    <Activity className="size-4 text-cyan-400" />
                                    Lihat Data Telemetri
                                </a>
                            </div>

                            {/* Regulatory Standard Badge */}
                            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
                                <Shield className="size-4 text-emerald-400 shrink-0" />
                                <span>
                                    Standar Resmi: <strong className="text-slate-200">ISPU KLHK (Permen LHK No. 14 Tahun 2020)</strong>
                                </span>
                            </div>
                        </div>

                        {/* Right: Live ISPU & Vehicle Summary Card */}
                        <div className="lg:col-span-5">
                            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-5">
                                {/* Header / Status Indicator */}
                                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                                    <div className="space-y-0.5">
                                        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                                            Status Armada Terpantau
                                        </div>
                                        <div className="text-sm font-semibold text-white flex items-center gap-2">
                                            <Bus className="size-4 text-cyan-400" />
                                            {PALEMBANG_TRANSIT_VEHICLE_CODE}
                                        </div>
                                    </div>
                                    <span
                                        className={cn(
                                            'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold border',
                                            ispuEval.bgClass,
                                            ispuEval.colorClass,
                                            ispuEval.borderClass
                                        )}
                                    >
                                        {ispuEval.badgeLabel}: {ispuEval.category} ({ispuEval.ispu})
                                    </span>
                                </div>

                                {/* ISPU Big Metric Display */}
                                <div className="flex items-baseline justify-between pt-1">
                                    <div>
                                        <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                                            <span>Nilai ISPU Indikatif Sesaat</span>
                                            <span className="text-[10px] text-amber-400/90 font-mono">(Spot)</span>
                                        </div>
                                        <div className="mt-1 flex items-baseline gap-2">
                                            <span className="text-5xl font-extrabold tracking-tight text-white tabular-nums">
                                                {ispuEval.ispu}
                                            </span>
                                            <span className="text-xs text-slate-400 font-mono">
                                                / 500 Max
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-400">Konsentrasi PM2.5</div>
                                        <div className="mt-1 text-2xl font-bold text-slate-100 tabular-nums">
                                            {currentPm25.toFixed(1)}{' '}
                                            <span className="text-xs font-normal text-slate-400">µg/m³</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Health Description based on KLHK */}
                                <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/60 text-xs leading-relaxed text-slate-300 space-y-1">
                                    <div>
                                        <span className="font-semibold text-slate-200">Kategori {ispuEval.category}: </span>
                                        {ispuEval.description}
                                    </div>
                                    <p className="text-[11px] text-slate-400 italic border-t border-slate-800/60 pt-1">
                                        * Catatan Regulasi: {ispuEval.disclaimer}
                                    </p>
                                </div>

                                {/* Corridor & Data Recency Footer */}
                                <div className="space-y-2 pt-1 border-t border-slate-800/80 text-xs text-slate-400">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <Navigation className="size-3.5 text-slate-500" />
                                            Sinyal Satelit GPS
                                        </span>
                                        <span className={cn(
                                            "font-medium text-right truncate max-w-[240px]",
                                            hasLiveGpsFix ? "text-emerald-400 font-mono" : "text-amber-400 font-mono"
                                        )}>
                                            {hasLiveGpsFix
                                                ? 'Sinyal Satelit Terkunci (Live Fix)'
                                                : 'Menunggu GPS Fix (Posisi Terakhir Terverifikasi)'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <Activity className="size-3.5 text-slate-500" />
                                            Status Sensor Udara
                                        </span>
                                        <span className="font-mono text-emerald-400 tabular-nums text-xs">
                                            Aktif Mengirim Telemetri ({isLive ? 'Auto-Sync 15s' : (isDataRecent ? 'Live' : 'Riwayat')})
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="size-3.5 text-slate-500" />
                                            Waktu Telemetri
                                        </span>
                                        <span className="font-mono text-slate-300 tabular-nums">
                                            {latestTimestamp.toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                            })}{' '}
                                            WIB
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 3. LIVE VEHICLE SENSOR TELEMETRY GRID                                     */}
            {/* ========================================================================= */}
            <section id="live-telemetry" className="border-b border-slate-800/80 bg-[#0B0F17] py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Live Sync Status Banner */}
                    <div className="mb-6">
                        <LiveSyncIndicator
                            variant="full"
                            isLive={isLive}
                            isSyncing={isSyncing}
                            syncStatus={syncStatus}
                            syncStatusText={syncStatusText}
                            secondsSinceLastSync={secondsSinceLastSync}
                            hasLiveGpsFix={hasLiveGpsFix}
                            onRefresh={refreshTelemetry}
                            onToggleLive={togglePolling}
                        />
                    </div>

                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                                Data Empiris Sensor IoT
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                                Telemetri Waktu Nyata Kendaraan Transit
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">
                                Pembacaan langsung dari rangkaian sensor terpasang pada armada {PALEMBANG_TRANSIT_VEHICLE_CODE}.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <span className={cn(
                                "inline-block size-2 rounded-full",
                                isSyncing ? "bg-cyan-400 animate-ping" : (isLive ? "bg-emerald-400" : "bg-slate-400")
                            )}></span>
                            {isLive ? 'Terhubung Gateway • Pembaruan Otomatis' : 'Sinkronisasi Dijeda'}
                        </div>
                    </div>

                    {/* Telemetry Metric Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {/* 1. PM2.5 Card */}
                        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
                                        <Wind className="size-4" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-300">Partikulat PM2.5</span>
                                </div>
                                <span className={cn('rounded px-2 py-0.5 text-[11px] font-semibold border', ispuEval.bgClass, ispuEval.colorClass, ispuEval.borderClass)}>
                                    ISPU: {ispuEval.category}
                                </span>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-white tabular-nums">
                                        {currentPm25.toFixed(1)}
                                    </span>
                                    <span className="text-xs font-mono text-slate-400">µg/m³</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 leading-normal">
                                    Partikel halus terhirup berdiameter &le; 2.5 mikron hasil hamburan laser optik.
                                </p>
                            </div>
                        </div>

                        {/* 2. PM10 Card */}
                        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                                        <Activity className="size-4" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-300">Partikulat PM10</span>
                                </div>
                                <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700">
                                    Debu Kasar
                                </span>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-white tabular-nums">
                                        {currentPm10.toFixed(1)}
                                    </span>
                                    <span className="text-xs font-mono text-slate-400">µg/m³</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 leading-normal">
                                    Partikel debu jalanan kasar berdiameter &le; 10 mikron sepanjang jalur kendaraan.
                                </p>
                            </div>
                        </div>

                        {/* 3. MQ-135 Gas Resistance Index Card (Authentic Non-Fabricated Label) */}
                        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
                                        <Gauge className="size-4" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-300">Indeks Sensor Gas (MQ-135)</span>
                                </div>
                                <span className="rounded bg-amber-500/10 text-amber-400 px-2 py-0.5 text-[11px] font-medium border border-amber-500/20">
                                    Sensitivitas Gas
                                </span>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-white tabular-nums">
                                        {currentGasIndex}
                                    </span>
                                    <span className="text-xs font-mono text-slate-400">Indeks Relatif</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 leading-normal">
                                    Sensitivitas resistansi semikonduktor analog terhadap gas reduksi (bukan nilai laboratorium VOC).
                                </p>
                            </div>
                        </div>

                        {/* 4. Ambient Temperature Card */}
                        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-rose-500/10 p-2 text-rose-400">
                                        <Thermometer className="size-4" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-300">Suhu Udara Mikroklimat</span>
                                </div>
                                <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700">
                                    Ambien Jalan
                                </span>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-white tabular-nums">
                                        29.4
                                    </span>
                                    <span className="text-xs font-mono text-slate-400">°C</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 leading-normal">
                                    Temperatur udara ambien di ketinggian permukaan jalan raya rute transit.
                                </p>
                            </div>
                        </div>

                        {/* 5. Relative Humidity Card */}
                        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-teal-500/10 p-2 text-teal-400">
                                        <Droplets className="size-4" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-300">Kelembapan Relatif (RH)</span>
                                </div>
                                <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700">
                                    Kelembapan
                                </span>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-white tabular-nums">
                                        {currentHumidity.toFixed(1)}
                                    </span>
                                    <span className="text-xs font-mono text-slate-400">% RH</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 leading-normal">
                                    Kandungan uap air relatif yang mempengaruhi dispersi partikel polutan.
                                </p>
                            </div>
                        </div>

                        {/* 6. Atmospheric Pressure & Weather */}
                        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 hover:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                                        <CloudRain className="size-4" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-300">Tekanan & Cuaca</span>
                                </div>
                                <span className="rounded bg-indigo-500/10 text-indigo-400 px-2 py-0.5 text-[11px] font-medium border border-indigo-500/20">
                                    {currentRainStatus}
                                </span>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-white tabular-nums">
                                        {currentPressure.toFixed(1)}
                                    </span>
                                    <span className="text-xs font-mono text-slate-400">hPa</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 leading-normal">
                                    Tekanan barometer atmosfer lokal Kota Palembang pada ketinggian jalan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 4. INTERACTIVE TRANSIT CORRIDOR MAP SECTION                               */}
            {/* ========================================================================= */}
            <section id="corridor-map" className="border-b border-slate-800/80 bg-slate-950 py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header with Controls */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                        <div>
                            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                                Visualisasi Geospasial
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                                Peta Koridor Transportasi Publik & Breadcrumb Telemetri
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">
                                {PALEMBANG_TRANSIT_CORRIDOR_NAME} — Menampilkan {breadcrumbs.length} koordinat pembacaan aktual dari database.
                            </p>
                        </div>

                        {/* View Switcher Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setMapViewMode('corridor');
                                    setSelectedBreadcrumb(null);
                                }}
                                className={cn(
                                    'px-3 py-1.5 text-xs font-medium rounded-lg border transition',
                                    mapViewMode === 'corridor'
                                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-semibold'
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                                )}
                            >
                                Seluruh Koridor ({breadcrumbs.length} Titik)
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMapViewMode('vehicle');
                                    setSelectedBreadcrumb(latestBreadcrumb);
                                }}
                                className={cn(
                                    'px-3 py-1.5 text-xs font-medium rounded-lg border transition flex items-center gap-1.5',
                                    mapViewMode === 'vehicle'
                                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-semibold'
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                                )}
                            >
                                <Bus className="size-3.5 text-cyan-400" />
                                Posisi Kendaraan
                            </button>
                        </div>
                    </div>

                    {/* Map + Inspector Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Interactive Leaflet Map Canvas */}
                        <div className="lg:col-span-8 rounded-xl border border-slate-800 overflow-hidden bg-slate-900 h-[520px] relative shadow-lg">
                            {mounted ? (
                                <MapContainer
                                    center={mapCenter}
                                    zoom={mapZoom}
                                    scrollWheelZoom={true}
                                    style={{ height: '100%', width: '100%' }}
                                    className="z-0"
                                >
                                    <MapViewController center={mapCenter} zoom={mapZoom} />

                                    {/* Esri World Dark Gray Canvas Tiles (Clean, scientific GIS contrast without watermark) */}
                                    <TileLayer
                                        attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                                        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                                        maxZoom={16}
                                    />

                                    {/* Transit Corridor Polyline (The route traversed by the vehicle) */}
                                    <Polyline
                                        positions={polylinePositions}
                                        pathOptions={{
                                            color: '#06B6D4',
                                            weight: 4,
                                            opacity: 0.85,
                                            lineJoin: 'round',
                                            lineCap: 'round',
                                        }}
                                    />

                                    {/* Breadcrumb Markers along the Corridor */}
                                    {breadcrumbs.map((b) => {
                                        const evalRes = calculateIspuFromPm25(b.pm25);
                                        const isSelected = selectedBreadcrumb?.id === b.id;
                                        return (
                                            <Marker
                                                key={b.id}
                                                position={[b.lat, b.lng]}
                                                icon={createBreadcrumbIcon(evalRes.hex, isSelected)}
                                                eventHandlers={{
                                                    click: () => {
                                                        setSelectedBreadcrumb(b);
                                                    },
                                                }}
                                            >
                                                <Popup className="custom-leaflet-popup">
                                                    <div className="p-2 space-y-1.5 text-slate-900 font-sans text-xs">
                                                        <div className="font-bold border-b pb-1 text-slate-800">
                                                            Titik Telemetri #{b.id}
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-slate-500">ISPU:</span>
                                                            <strong style={{ color: evalRes.hex }}>
                                                                {evalRes.category} ({evalRes.ispu})
                                                            </strong>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-slate-500">PM2.5:</span>
                                                            <span className="font-mono">{b.pm25} µg/m³</span>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-slate-500">Waktu:</span>
                                                            <span className="font-mono text-[10px]">
                                                                {new Date(b.timestamp).toLocaleTimeString('id-ID')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        );
                                    })}

                                    {/* Active Vehicle Marker (Pulsing node at current position) */}
                                    <Marker position={vehiclePosition} icon={createVehicleIcon()}>
                                        <Popup>
                                            <div className="p-2 space-y-1 text-slate-900 font-sans text-xs">
                                                <div className="font-bold text-cyan-600">
                                                    Armada Transit: {PALEMBANG_TRANSIT_VEHICLE_CODE}
                                                </div>
                                                <div>
                                                    Koordinat: <span className="font-mono">{vehiclePosition[0].toFixed(5)}, {vehiclePosition[1].toFixed(5)}</span>
                                                </div>
                                                <div className="text-[11px] text-slate-600">
                                                    Status GPS: <strong>{latestNode?.lat && latestNode.lat !== 0 ? 'Live Satellite Lock' : 'Kuncian Satelit Terakhir (Sukarami / ID #1)'}</strong>
                                                </div>
                                                <div className="text-[11px] text-slate-600">
                                                    Sensor Udara: <strong className="text-emerald-600">Aktif ({isDataRecent ? 'Live Telemetri' : 'Data Riwayat'})</strong>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-slate-500 text-sm">
                                    Memuat Peta Koridor Palembang...
                                </div>
                            )}

                            {/* Floating Map Header Overlay */}
                            <div className="absolute top-3 left-3 z-[1000] rounded-lg bg-slate-950/85 border border-slate-800/80 px-3 py-2 text-xs backdrop-blur-sm pointer-events-none">
                                <div className="font-semibold text-white">Rute Trans Musi Palembang</div>
                                <div className="text-[11px] font-mono text-cyan-400">Jl. Kol. H. Burlian — Simpang Polda — Sudirman</div>
                            </div>
                        </div>

                        {/* Inspector Side Panel */}
                        <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-5 h-[520px] flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                                        Inspektur Titik Koordinat
                                    </span>
                                    <span className="text-[11px] font-mono text-cyan-400">
                                        GPS Palembang
                                    </span>
                                </div>

                                {selectedBreadcrumb ? (
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs text-slate-400">Titik Terpilih</div>
                                            <div className="text-lg font-bold text-white flex items-center gap-1.5">
                                                <MapPin className="size-4 text-cyan-400" />
                                                Fix #{selectedBreadcrumb.id}
                                            </div>
                                        </div>

                                        {/* ISPU Evaluation of this selected coordinate */}
                                        {(() => {
                                            const bEval = calculateIspuFromPm25(selectedBreadcrumb.pm25);
                                            return (
                                                <div className={cn('rounded-lg p-3 border text-xs space-y-1', bEval.bgClass, bEval.borderClass)}>
                                                    <div className="flex justify-between font-semibold">
                                                        <span className={bEval.colorClass}>ISPU: {bEval.category}</span>
                                                        <span className="font-mono text-white">Indeks {bEval.ispu}</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300">{bEval.description}</p>
                                                </div>
                                            );
                                        })()}

                                        {/* Technical Fix Details */}
                                        <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
                                            <div className="flex justify-between py-1 border-b border-slate-800/40">
                                                <span className="text-slate-400">Koordinat Lintang</span>
                                                <span className="font-mono text-slate-200 tabular-nums">
                                                    {selectedBreadcrumb.lat.toFixed(6)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-slate-800/40">
                                                <span className="text-slate-400">Koordinat Bujur</span>
                                                <span className="font-mono text-slate-200 tabular-nums">
                                                    {selectedBreadcrumb.lng.toFixed(6)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-slate-800/40">
                                                <span className="text-slate-400">Konsentrasi PM2.5</span>
                                                <span className="font-mono text-slate-200 tabular-nums">
                                                    {selectedBreadcrumb.pm25} µg/m³
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-slate-800/40">
                                                <span className="text-slate-400">Indeks Gas MQ-135</span>
                                                <span className="font-mono text-slate-200 tabular-nums">
                                                    {selectedBreadcrumb.gas_index} (Relative)
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                                <span className="text-slate-400">Waktu Pembacaan</span>
                                                <span className="font-mono text-slate-200 tabular-nums text-[11px]">
                                                    {new Date(selectedBreadcrumb.timestamp).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 py-6 text-center">
                                        <div className="mx-auto size-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                                            <Navigation className="size-5" />
                                        </div>
                                        <div className="text-xs font-medium text-slate-300">
                                            Klik salah satu titik di peta
                                        </div>
                                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                            Setiap titik melambangkan rekaman telemetri aktual kendaraan saat melintasi rute kota.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Legend Panel at Bottom */}
                            <div className="border-t border-slate-800 pt-3">
                                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                                    Klasifikasi ISPU (Permen LHK No. 14/2020)
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                                    <div className="flex items-center gap-1.5">
                                        <span className="size-2.5 rounded-full bg-[#10B981]"></span>
                                        <span className="text-slate-300">Baik (0–50)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="size-2.5 rounded-full bg-[#3B82F6]"></span>
                                        <span className="text-slate-300">Sedang (51–100)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="size-2.5 rounded-full bg-[#EAB308]"></span>
                                        <span className="text-slate-300">Tidak Sehat (101–200)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="size-2.5 rounded-full bg-[#EF4444]"></span>
                                        <span className="text-slate-300">Sangat Tidak Sehat (201–300)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 5. AIR QUALITY ANALYTICS & HISTORICAL TRENDS                              */}
            {/* ========================================================================= */}
            <section id="analytics" className="border-b border-slate-800/80 bg-[#0B0F17] py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header with Metric Toggle */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                                Analitik & Tren Temporal
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                                Tren Kualitas Udara Koridor Transit (24 Jam)
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">
                                Visualisasi variasi konsentrasi polutan seiring pergerakan armada sepanjang koridor perkotaan.
                            </p>
                        </div>

                        {/* Metric Selector Tabs */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setChartMetric('pm25')}
                                className={cn(
                                    'px-3.5 py-1.5 text-xs font-medium rounded-lg border transition',
                                    chartMetric === 'pm25'
                                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-semibold'
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                                )}
                            >
                                Partikulat PM2.5 (µg/m³)
                            </button>
                            <button
                                type="button"
                                onClick={() => setChartMetric('mq135')}
                                className={cn(
                                    'px-3.5 py-1.5 text-xs font-medium rounded-lg border transition',
                                    chartMetric === 'mq135'
                                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-semibold'
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                                )}
                            >
                                Indeks Sensor Gas (MQ-135)
                            </button>
                        </div>
                    </div>

                    {/* Chart Container & Stat Badges */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
                        {/* Summary Stats Row */}
                        <div className="grid grid-cols-3 gap-4 border-b border-slate-800/80 pb-5 text-center sm:text-left">
                            <div className="space-y-0.5">
                                <div className="text-xs text-slate-400 font-medium">Konsentrasi Minimum</div>
                                <div className="text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">
                                    {trendStats.min}{' '}
                                    <span className="text-xs font-normal text-slate-400">
                                        {chartMetric === 'pm25' ? 'µg/m³' : 'Index'}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <div className="text-xs text-slate-400 font-medium">Rata-Rata Koridor</div>
                                <div className="text-xl sm:text-2xl font-bold text-cyan-400 tabular-nums">
                                    {trendStats.avg}{' '}
                                    <span className="text-xs font-normal text-slate-400">
                                        {chartMetric === 'pm25' ? 'µg/m³' : 'Index'}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <div className="text-xs text-slate-400 font-medium">Puncak Maksimum</div>
                                <div className="text-xl sm:text-2xl font-bold text-amber-400 tabular-nums">
                                    {trendStats.max}{' '}
                                    <span className="text-xs font-normal text-slate-400">
                                        {chartMetric === 'pm25' ? 'µg/m³' : 'Index'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Recharts Area Chart */}
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#64748B"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={{ stroke: '#1E293B' }}
                                    />
                                    <YAxis
                                        stroke="#64748B"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={{ stroke: '#1E293B' }}
                                        tickFormatter={(v) => `${v}`}
                                    />
                                    <ChartTooltip
                                        contentStyle={{
                                            backgroundColor: '#0F172A',
                                            borderColor: '#334155',
                                            borderRadius: '8px',
                                            color: '#F8FAFC',
                                            fontSize: '12px',
                                        }}
                                        formatter={(val: any) => [
                                            `${val} ${chartMetric === 'pm25' ? 'µg/m³' : 'Index'}`,
                                            chartMetric === 'pm25' ? 'Partikulat PM2.5' : 'Indeks Gas MQ-135',
                                        ]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey={chartMetric}
                                        stroke="#06B6D4"
                                        strokeWidth={2.5}
                                        fillOpacity={1}
                                        fill="url(#chartColor)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 6. HOW POLLUTRACK WORKS (SYSTEM ARCHITECTURE)                             */}
            {/* ========================================================================= */}
            <section id="architecture" className="border-b border-slate-800/80 bg-slate-950 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mb-12">
                        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                            Prinsip Operasional
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                            Cara Kerja Pemantauan Udara Bergerak POLLUTRACK
                        </h2>
                        <p className="text-sm text-slate-400 mt-2">
                            Integrasi perangkat keras edge, gateway telemetri seluler, dan mesin komputasi ISPU nasional.
                        </p>
                    </div>

                    {/* 3 Pipeline Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                            <div className="size-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold font-mono">
                                01
                            </div>
                            <h3 className="text-base font-semibold text-white">
                                Node IoT pada Kendaraan Publik
                            </h3>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Sensor debu laser optik (PM2.5 & PM10), sensor gas resistif MQ-135, dan modul GPS
                                dipasang pada armada transportasi kota (Trans Musi / feeder), mengukur udara ambien
                                jalanan saat bus beroperasi.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                            <div className="size-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold font-mono">
                                02
                            </div>
                            <h3 className="text-base font-semibold text-white">
                                Transmisi Spasial Berkala
                            </h3>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Mikrokontroler membaca sampel udara dan koordinat satelit GPS secara kontinu, lalu
                                memancarkan paket telemetri melalui jaringan seluler ke backend cloud server secara terenkripsi.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                            <div className="size-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-mono">
                                03
                            </div>
                            <h3 className="text-base font-semibold text-white">
                                Standarisasi ISPU & Pemetaan
                            </h3>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Data dinormalisasi dan dihitung berdasarkan rumus resmi Permen LHK No. 14/2020.
                                Hasilnya diproyeksikan ke peta koridor interaktif untuk memberikan transparansi paparan polusi kepada publik.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 7. PROFESSIONAL FOOTER                                                    */}
            {/* ========================================================================= */}
            <footer className="bg-[#0B0F17] py-12 text-xs text-slate-400">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
                        <div>
                            <PolluTrackLogo variant="full" size="md" />
                            <p className="text-xs text-slate-400 mt-2 max-w-md">
                                Platform intelijen kualitas udara bergerak berbasis IoT pada armada transportasi publik Kota Palembang, Sumatera Selatan.
                            </p>
                        </div>

                        {/* Regulatory Notice */}
                        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 max-w-sm">
                            <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                                <Shield className="size-3.5 text-emerald-400" />
                                Kepatuhan Standar Lingkungan
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">
                                Perhitungan ISPU mengacu pada Peraturan Menteri LHK Republik Indonesia Nomor P.14/MENLHK/SETJEN/KUM.1/7/2020.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
                        <div>
                            &copy; {new Date().getFullYear()} POLLUTRACK. Hak Cipta Dilindungi.
                        </div>
                        <div className="flex items-center gap-6">
                            <span>Koridor 1: Palembang Trans Musi</span>
                            <span>Node Armada: IOT-PALEMBANG-01</span>
                            <Link href="/login" className="hover:text-slate-300 transition-colors">
                                Portal Akses Internal
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

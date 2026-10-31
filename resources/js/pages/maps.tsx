import { Head, Link, usePage, router } from '@inertiajs/react';
import L from 'leaflet';
import {
    MapPin,
    Clock,
    Calendar,
    ArrowLeft,
    Bus,
    Navigation,
    Layers,
    Filter,
    Activity,
    Shield,
    ChevronRight,
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
import PolluTrackLogo from '@/components/PolluTrackLogo';
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

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons for Vehicle & Breadcrumbs
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

function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: true });
    }, [center, zoom, map]);
    return null;
}

export default function Maps() {
    const { auth, mapNodes = [], startDate, endDate } = usePage().props as any;
    const [mounted, setMounted] = useState(false);
    const [selectedBreadcrumb, setSelectedBreadcrumb] = useState<TransitBreadcrumb | null>(null);
    const [mapViewMode, setMapViewMode] = useState<'corridor' | 'vehicle'>('corridor');

    // Connect real-time telemetry polling hook (15s interval)
    const {
        telemetry: liveTelemetry,
        deviceInfo: liveDevice,
        allDevices,
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
                temperature: null,
                humidity: mapNodes[0].humidity,
                battery_status: null,
                created_at: mapNodes[0].timestamp,
                updated_at: mapNodes[0].timestamp,
            }
        } : null,
    });

    // Breadcrumbs dataset from actual database records
    const breadcrumbs = PALEMBANG_TRANSIT_BREADCRUMBS;
    const polylinePositions = useMemo<[number, number][]>(() => {
        return breadcrumbs.map((b) => [b.lat, b.lng]);
    }, [breadcrumbs]);

    // Latest verified vehicle position (prioritizes live verified GPS fix)
    const latestBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
    const vehiclePosition: [number, number] = useMemo(() => {
        if (liveTelemetry && liveTelemetry.gps_lat !== null && liveTelemetry.gps_lng !== null && Number(liveTelemetry.gps_lat) !== 0 && Number(liveTelemetry.gps_lng) !== 0) {
            return [Number(liveTelemetry.gps_lat), Number(liveTelemetry.gps_lng)];
        }
        return [latestBreadcrumb.lat, latestBreadcrumb.lng];
    }, [liveTelemetry, latestBreadcrumb]);

    const mapCenter = useMemo<[number, number]>(() => {
        if (mapViewMode === 'vehicle') {
            return vehiclePosition;
        }
        return [-2.945, 104.755];
    }, [mapViewMode, vehiclePosition]);

    const mapZoom = mapViewMode === 'vehicle' ? 15 : 13;

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex h-screen w-screen flex-col bg-[#0B0F17] text-slate-100 font-sans overflow-hidden">
            <Head title="POLLUTRACK — Peta Geospasial Koridor Transit Palembang" />

            {/* Top Toolbar */}
            <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-[#0B0F17]/95 px-4 lg:px-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={auth?.user ? '/dashboard' : '/'}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                        <ArrowLeft className="size-3.5" />
                        {auth?.user ? 'Kembali ke Dashboard' : 'Kembali ke Beranda'}
                    </Link>

                    <div className="hidden sm:block h-4 w-px bg-slate-800" />

                    <div className="flex items-center gap-2">
                        <PolluTrackLogo variant="symbol" size="sm" />
                        <span className="text-xs font-semibold text-white tracking-wide">
                            Peta Koridor Geospasial
                        </span>
                        <span className="hidden md:inline text-xs text-slate-500 font-mono">
                            • {PALEMBANG_TRANSIT_CORRIDOR_NAME}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Live Sync Status Indicator in Toolbar */}
                    <LiveSyncIndicator
                        variant="navbar"
                        isLive={isLive}
                        isSyncing={isSyncing}
                        syncStatus={syncStatus}
                        syncStatusText={syncStatusText}
                        secondsSinceLastSync={secondsSinceLastSync}
                        onRefresh={refreshTelemetry}
                    />

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
                        Seluruh Rute ({breadcrumbs.length} Titik)
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
                        Fokus Kendaraan
                    </button>
                </div>
            </header>

            {/* Main Interactive Map Area with Floating Sidebar */}
            <div className="relative flex-1 w-full h-full">
                {mounted ? (
                    <MapContainer
                        center={mapCenter}
                        zoom={mapZoom}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <MapViewController center={mapCenter} zoom={mapZoom} />

                        {/* Esri World Dark Gray Canvas Tiles */}
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                            maxZoom={16}
                        />

                        {/* Transit Corridor Polyline */}
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

                        {/* Breadcrumbs */}
                        {breadcrumbs.map((b) => {
                            const bEval = calculateIspuFromPm25(b.pm25, true);
                            const isSelected = selectedBreadcrumb?.id === b.id;
                            return (
                                <Marker
                                    key={b.id}
                                    position={[b.lat, b.lng]}
                                    icon={createBreadcrumbIcon(bEval.hex, isSelected)}
                                    eventHandlers={{
                                        click: () => {
                                            setSelectedBreadcrumb(b);
                                        },
                                    }}
                                >
                                    <Popup>
                                        <div className="p-2 space-y-1.5 text-slate-900 font-sans text-xs">
                                            <div className="font-bold border-b pb-1 text-slate-800">
                                                Titik Telemetri #{b.id}
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <span className="text-slate-500">ISPU Indikatif:</span>
                                                <strong style={{ color: bEval.hex }}>
                                                    {bEval.category} ({bEval.ispu})
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

                        {/* Vehicle Marker */}
                        <Marker position={vehiclePosition} icon={createVehicleIcon()}>
                            <Popup>
                                <div className="p-2 space-y-1.5 text-slate-900 font-sans text-xs min-w-[200px]">
                                    <div className="font-bold text-cyan-600 flex items-center justify-between">
                                        <span>Armada: {PALEMBANG_TRANSIT_VEHICLE_CODE}</span>
                                        <span className={cn(
                                            "text-[10px] px-1.5 py-0.5 rounded font-mono font-medium",
                                            hasLiveGpsFix ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                        )}>
                                            {hasLiveGpsFix ? 'GPS Fix' : 'Posisi Terakhir'}
                                        </span>
                                    </div>
                                    <div className="text-[11px] font-mono text-slate-600">
                                        Koordinat: {vehiclePosition[0].toFixed(5)}, {vehiclePosition[1].toFixed(5)}
                                    </div>
                                    <div className="text-[11px] text-slate-700">
                                        Status GPS: {hasLiveGpsFix ? 'Sinyal Satelit Terkunci (Live)' : 'Kuncian Terakhir (Sukarami)'}
                                    </div>
                                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                                        Telemetri Sensor: {isLive ? 'Aktif Sinkron (15s)' : 'Tersimpan'}
                                    </div>
                                    {liveTelemetry?.pm25 !== undefined && liveTelemetry?.pm25 !== null && (
                                        <div className="text-xs font-semibold text-slate-800 flex justify-between">
                                            <span>PM2.5 Saat Ini:</span>
                                            <span className="font-mono text-cyan-700">{Number(liveTelemetry.pm25).toFixed(1)} µg/m³</span>
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-500 text-sm">
                        Memuat Peta GIS Palembang...
                    </div>
                )}

                {/* Floating Bottom Legend */}
                <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-slate-950/90 border border-slate-800/80 p-3.5 shadow-xl backdrop-blur-md max-w-sm">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                        Standar ISPU KLHK (Permen LHK No. 14/2020)
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
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

                {/* Floating Inspector Panel (Right) */}
                {selectedBreadcrumb && (
                    <div className="absolute top-4 right-4 z-[1000] rounded-xl bg-slate-950/95 border border-slate-800/80 p-5 shadow-2xl backdrop-blur-md w-80 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                                Titik Fix #{selectedBreadcrumb.id}
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedBreadcrumb(null)}
                                className="text-slate-500 hover:text-white text-xs font-mono"
                            >
                                Tutup ✕
                            </button>
                        </div>

                        {(() => {
                            const bEval = calculateIspuFromPm25(selectedBreadcrumb.pm25, true);
                            return (
                                <div className={cn('rounded-lg p-3 border text-xs space-y-1', bEval.bgClass, bEval.borderClass)}>
                                    <div className="flex justify-between font-semibold">
                                        <span className={bEval.colorClass}>{bEval.badgeLabel}: {bEval.category}</span>
                                        <span className="font-mono text-white">Indeks {bEval.ispu}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-300">{bEval.description}</p>
                                </div>
                            );
                        })()}

                        <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
                            <div className="flex justify-between py-1 border-b border-slate-800/40">
                                <span className="text-slate-400">Lintang</span>
                                <span className="font-mono text-slate-200 tabular-nums">{selectedBreadcrumb.lat.toFixed(6)}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-800/40">
                                <span className="text-slate-400">Bujur</span>
                                <span className="font-mono text-slate-200 tabular-nums">{selectedBreadcrumb.lng.toFixed(6)}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-800/40">
                                <span className="text-slate-400">PM2.5</span>
                                <span className="font-mono text-slate-200 tabular-nums">{selectedBreadcrumb.pm25} µg/m³</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-800/40">
                                <span className="text-slate-400">Indeks Gas MQ-135</span>
                                <span className="font-mono text-slate-200 tabular-nums">{selectedBreadcrumb.gas_index} (Relative)</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-slate-400">Waktu Pembacaan</span>
                                <span className="font-mono text-slate-200 tabular-nums text-[10px]">
                                    {new Date(selectedBreadcrumb.timestamp).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

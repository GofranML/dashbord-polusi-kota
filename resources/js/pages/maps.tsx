import { Head, Link, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { 
    MapPin, 
    Clock,
    Calendar,
    ArrowLeft
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Component to track zoom level
function ZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
    const map = useMapEvents({
        zoomend: () => {
            onZoomChange(map.getZoom());
        },
    });
    return null;
}

// Fix Leaflet marker icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Distance calculation helper (Haversine)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Custom Icons for different pollution levels
const createPulseIcon = (color: 'red' | 'green' | 'yellow' | 'cyan' | 'orange' | 'purple') => {
    const colorClasses = {
        red: 'bg-red-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        cyan: 'bg-cyan-500',
        orange: 'bg-orange-500',
        purple: 'bg-purple-500'
    };
    const pulseClasses = {
        red: 'bg-red-500/30',
        green: 'bg-green-500/30',
        yellow: 'bg-yellow-500/30',
        cyan: 'bg-cyan-500/30',
        orange: 'bg-orange-500/30',
        purple: 'bg-purple-500/30'
    };

    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="relative flex items-center justify-center">
                 <div class="absolute w-8 h-8 ${pulseClasses[color]} rounded-full animate-ping"></div>
                 <div class="relative w-4 h-4 ${colorClasses[color]} rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
               </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
};

const getAqiLabel = (pm25: number) => {
    if (pm25 <= 30) return 'Baik';
    if (pm25 <= 60) return 'Memuaskan';
    if (pm25 <= 90) return 'Sedang';
    if (pm25 <= 120) return 'Rendah';
    if (pm25 <= 250) return 'Sangat Rendah';
    return 'Kritis';
};

const getAqiColorName = (pm25: number) => {
    if (pm25 <= 30) return 'green';
    if (pm25 <= 60) return 'cyan';
    if (pm25 <= 90) return 'yellow';
    if (pm25 <= 120) return 'orange';
    if (pm25 <= 250) return 'red';
    return 'purple';
};

const getAqiHexColor = (pm25: number) => {
    if (pm25 <= 30) return '#22c55e'; // Green
    if (pm25 <= 60) return '#06b6d4'; // Cyan/Biru
    if (pm25 <= 90) return '#eab308'; // Yellow
    if (pm25 <= 120) return '#f97316'; // Orange
    if (pm25 <= 250) return '#ef4444'; // Red
    return '#a855f7'; // Purple
};

const getAqiBadgeClass = (pm25: number) => {
    const color = getAqiColorName(pm25);
    if (color === 'green') return 'bg-green-500/20 text-green-400';
    if (color === 'cyan') return 'bg-cyan-500/20 text-cyan-400';
    if (color === 'yellow') return 'bg-yellow-500/20 text-yellow-400';
    if (color === 'orange') return 'bg-orange-500/20 text-orange-400';
    if (color === 'red') return 'bg-red-500/20 text-red-400';
    return 'bg-purple-500/20 text-purple-400';
};

const getFormattedDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
};

const getFormattedLabel = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};


export default function Maps() {
    const { auth, mapNodes = [], startDate, endDate } = usePage().props as any;
    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);
    const [selectedDate, setSelectedDate] = useState('Today');
    const [selectedTime, setSelectedTime] = useState('Live');
    const [currentZoom, setCurrentZoom] = useState(13);

    const [backUrl, setBackUrl] = useState('/');
    const [backLabel, setBackLabel] = useState('Back to Home');

    // Custom date range inputs
    const [customStartDate, setCustomStartDate] = useState(startDate || getFormattedDate(3));
    const [customEndDate, setCustomEndDate] = useState(endDate || getFormattedDate(0));

    useEffect(() => {
        if (startDate) setCustomStartDate(startDate);
        if (endDate) setCustomEndDate(endDate);
    }, [startDate, endDate]);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setTime(new Date()), 1000);
        
        const params = new URLSearchParams(window.location.search);
        if (params.has('start_date') || params.has('end_date')) {
            setSelectedDate('Custom');
        } else if (params.has('preset')) {
            setSelectedDate(params.get('preset') || 'Today');
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            // Auto-select latest date with data if today has no data and no custom range is provided
            const todayStr = getFormattedDate(0);
            const yesterdayStr = getFormattedDate(1);
            const date2Str = getFormattedDate(2);
            
            const hasToday = mapNodes.some((n: any) => n.timestamp.startsWith(todayStr));
            if (!hasToday) {
                const hasYesterday = mapNodes.some((n: any) => n.timestamp.startsWith(yesterdayStr));
                if (hasYesterday) {
                    setSelectedDate('Yesterday');
                } else {
                    const hasDate2 = mapNodes.some((n: any) => n.timestamp.startsWith(date2Str));
                    if (hasDate2) {
                        setSelectedDate(getFormattedLabel(2));
                    }
                }
            }
        }

        if (params.get('from') === 'dashboard') {
            setBackUrl('/dashboard');
            setBackLabel('Back to Dashboard');
        }
        
        return () => clearInterval(timer);
    }, []);

    const handleDateSelectionChange = (val: string) => {
        setSelectedDate(val);
        if (val !== 'Custom') {
            const params = new URLSearchParams(window.location.search);
            if (params.has('start_date') || params.has('end_date')) {
                router.get('/maps', { preset: val }, { preserveState: false });
            }
        }
    };

    const handleApplyCustomRange = () => {
        router.get('/maps', {
            start_date: customStartDate,
            end_date: customEndDate
        }, {
            preserveState: true
        });
    };

    // Dynamic radius based on zoom
    const getDynamicRadius = (zoom: number) => {
        if (zoom >= 16) return 0.2;
        if (zoom >= 14) return 0.8;
        if (zoom >= 12) return 2.5;
        if (zoom >= 10) return 6.0;
        return 15.0;
    };

    const radiusKm = getDynamicRadius(currentZoom);

    // Dynamic Clustering Logic
    const clusters: any[] = [];
    const usedIds = new Set();

    // Filtering logic for the map nodes
    const filteredNodes = mapNodes.filter((node: any) => {
        const dateMap: Record<string, string> = {
            'Today': getFormattedDate(0),
            'Yesterday': getFormattedDate(1),
            [getFormattedLabel(2)]: getFormattedDate(2)
        };
        
        const targetDate = dateMap[selectedDate];
        const nodeDate = node.timestamp.split('T')[0];
        const nodeTime = node.timestamp.split('T')[1].substring(0, 5); // HH:mm

        // Date must match
        if (selectedDate !== 'Custom' && nodeDate !== targetDate) return false;

        // If time is not "Live", time must match exactly (hour)
        if (selectedTime !== 'Live') {
            const targetHour = selectedTime; // "10:00", "09:00", etc.
            if (nodeTime !== targetHour) return false;
        }

        return true;
    });

    filteredNodes.forEach(node => {
        if (usedIds.has(node.id)) return;

        const clusterNodes = filteredNodes.filter(n => 
            !usedIds.has(n.id) && getDistance(node.lat, node.lng, n.lat, n.lng) < radiusKm
        );

        if (clusterNodes.length > 0) {
            const avgPm25 = clusterNodes.reduce((acc, n) => acc + n.pm25, 0) / clusterNodes.length;
            const avgPm10 = clusterNodes.reduce((acc, n) => acc + (n.pm10 || 0), 0) / clusterNodes.length;
            const avgPm1 = clusterNodes.reduce((acc, n) => acc + (n.pm1 || 0), 0) / clusterNodes.length;
            const avgMq135 = clusterNodes.reduce((acc, n) => acc + (n.mq135 || 0), 0) / clusterNodes.length;
            const avgHumidity = clusterNodes.reduce((acc, n) => acc + (n.humidity || 0), 0) / clusterNodes.length;
            const avgPressure = clusterNodes.reduce((acc, n) => acc + (n.pressure || 0), 0) / clusterNodes.length;
            const rainStatus = clusterNodes.some(n => n.rain === 'Hujan' || n.rain === 'Gerimis') ? 'Hujan/Gerimis' : 'Cerah/Berawan';
            const avgFuzzyScore = clusterNodes.reduce((acc, n) => acc + (n.fuzzy_score || 0), 0) / clusterNodes.length;
            const fuzzyLabel = avgFuzzyScore > 65 ? 'Bahaya' : avgFuzzyScore > 35 ? 'Waspada' : 'Aman';
            const fuzzyColor = avgFuzzyScore > 65 ? 'text-red-400' : avgFuzzyScore > 35 ? 'text-yellow-400' : 'text-green-400';

            const avgLat = clusterNodes.reduce((acc, n) => acc + n.lat, 0) / clusterNodes.length;
            const avgLng = clusterNodes.reduce((acc, n) => acc + n.lng, 0) / clusterNodes.length;
            
            const timestamps = clusterNodes.map(n => n.timestamp.split('T')[1].substring(0, 5));
            const minTime = timestamps.sort()[0];
            const maxTime = timestamps.sort()[timestamps.length - 1];
            
            clusterNodes.forEach(n => usedIds.add(n.id));
            
            clusters.push({
                lat: avgLat,
                lng: avgLng,
                pm25: avgPm25,
                pm10: avgPm10,
                pm1: avgPm1,
                mq135: avgMq135,
                humidity: avgHumidity,
                pressure: avgPressure,
                rain: rainStatus,
                fuzzyScore: avgFuzzyScore,
                fuzzyLabel: fuzzyLabel,
                fuzzyColor: fuzzyColor,
                count: clusterNodes.length,
                areaName: clusterNodes.length > 1 ? (node.name.split(' ')[0] + ' Cluster') : node.name,
                timeRange: minTime === maxTime ? minTime : `${minTime} - ${maxTime}`,
                nodes: clusterNodes
            });
        }
    });

    const getColor = (pm: number) => {
        return getAqiHexColor(pm);
    };

    if (!mounted) {
        return (
            <div className="w-screen h-screen bg-[#020617] text-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-screen h-screen bg-[#020617] text-white overflow-hidden relative">
            <Head title="Full Map - Smart City Air Monitoring" />

            {/* Top Navigation Overlay */}
            <div className="absolute top-4 left-20 z-[1000] flex gap-2">
                <Link href={backUrl} className="px-4 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-4 h-4 text-white" />
                    <span className="text-sm font-black uppercase tracking-widest text-white">{backLabel}</span>
                </Link>
                <div className="px-4 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-white">Full Screen GIS Monitor</h2>
                </div>
            </div>

            <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end gap-2">
                <div className="flex gap-2">
                    <div className="px-3 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-3">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        <select 
                            value={selectedDate}
                            onChange={(e) => handleDateSelectionChange(e.target.value)}
                            className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white focus:outline-none border-none p-0 cursor-pointer"
                        >
                            <option value="Today" className="bg-neutral-900">Today</option>
                            <option value="Yesterday" className="bg-neutral-900">Yesterday</option>
                            <option value={getFormattedLabel(2)} className="bg-neutral-900">{getFormattedLabel(2)}</option>
                            <option value="Custom" className="bg-neutral-900">Custom Range</option>
                        </select>
                    </div>
                    <div className="px-3 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-3">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <select 
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white focus:outline-none border-none p-0 cursor-pointer"
                        >
                            <option value="Live" className="bg-neutral-900">Live</option>
                            <option value="10:00" className="bg-neutral-900">10:00 AM</option>
                            <option value="09:00" className="bg-neutral-900">09:00 AM</option>
                            <option value="08:00" className="bg-neutral-900">08:00 AM</option>
                        </select>
                    </div>
                </div>

                {selectedDate === 'Custom' && (
                    <div className="px-4 py-3 bg-black/85 backdrop-blur-xl rounded-xl border border-white/10 flex flex-col gap-3 w-72 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Custom Date Range</div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] text-neutral-400 uppercase font-black">Start Date</label>
                                <input 
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="bg-neutral-900 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] text-neutral-400 uppercase font-black">End Date</label>
                                <input 
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="bg-neutral-900 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleApplyCustomRange}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black text-[10px] uppercase py-1.5 rounded-lg tracking-widest transition-colors shadow-lg shadow-cyan-600/20"
                        >
                            Apply Filter
                        </button>
                    </div>
                )}
            </div>

            <div className="absolute bottom-6 left-6 z-[1000] flex gap-2">
                {[
                    { label: 'Baik', color: 'bg-green-500' },
                    { label: 'Memuaskan', color: 'bg-cyan-500' },
                    { label: 'Sedang', color: 'bg-yellow-500' },
                    { label: 'Rendah', color: 'bg-orange-500' },
                    { label: 'Sangat Rendah', color: 'bg-red-500' },
                    { label: 'Kritis', color: 'bg-purple-500' }
                ].map((l, i) => (
                    <div key={i} className="px-3 py-2 bg-black/60 backdrop-blur-sm rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-white">
                        <div className={`w-2 h-2 rounded-full ${l.color}`} />
                        {l.label}
                    </div>
                ))}
            </div>

            <div className="absolute bottom-6 right-6 z-[1000] text-[10px] font-mono text-neutral-500 uppercase bg-black/60 px-3 py-2 rounded-xl backdrop-blur-sm border border-white/5 flex flex-col items-end">
                <span>Map: Live GIS // CartoDB Dark</span>
                <span>Filter: {selectedDate === 'Custom' ? `${startDate || ''} to ${endDate || ''}` : selectedDate} @ {selectedTime}</span>
                <span>Zoom: {currentZoom}x</span>
            </div>

            {/* Map Container */}
            <div className="w-full h-full relative z-0">
                <MapContainer 
                    center={[-2.9909, 104.7566]} 
                    zoom={13} 
                    scrollWheelZoom={true}
                    style={{ height: '100vh', width: '100vw', background: '#030816' }}
                    className="z-0"
                >
                    <ZoomTracker onZoomChange={setCurrentZoom} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    
                    {clusters.map((cluster, idx) => (
                        <React.Fragment key={idx}>
                            <Circle 
                                center={[cluster.lat, cluster.lng]}
                                radius={1000}
                                pathOptions={{ 
                                    fillColor: getColor(cluster.pm25),
                                    fillOpacity: 0.2,
                                    color: getColor(cluster.pm25),
                                    weight: 1
                                }}
                            />
                            
                            <Marker position={[cluster.lat, cluster.lng]} icon={createPulseIcon(
                                getAqiColorName(cluster.pm25)
                            )}>
                                <Popup className="custom-popup">
                                    <div className="p-3 w-56 bg-[#020617] text-white rounded-lg">
                                        <div className="flex justify-between items-start mb-3 border-b border-white/10 pb-2">
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest">{cluster.areaName}</h4>
                                                <p className="text-[8px] text-neutral-500 uppercase">{cluster.count} Nodes averaged</p>
                                            </div>
                                            <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${getAqiBadgeClass(cluster.pm25)}`}>
                                                {getAqiLabel(cluster.pm25)}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 mb-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-neutral-500 uppercase font-bold">Avg PM2.5:</span>
                                                <span className="text-[12px] font-black text-white">{cluster.pm25.toFixed(1)} <span className="text-[8px] text-neutral-600">µg/m³</span></span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-neutral-500 uppercase font-bold">Avg PM10:</span>
                                                <span className="text-[12px] font-black text-white">{cluster.pm10.toFixed(1)} <span className="text-[8px] text-neutral-600">µg/m³</span></span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-neutral-500 uppercase font-bold">Avg PM1:</span>
                                                <span className="text-[12px] font-black text-white">{cluster.pm1.toFixed(1)} <span className="text-[8px] text-neutral-600">µg/m³</span></span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-neutral-500 uppercase font-bold">MQ-135:</span>
                                                <span className="text-[12px] font-black text-orange-400">{cluster.mq135.toFixed(0)} <span className="text-[8px] text-neutral-600">ppm</span></span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-neutral-500 uppercase font-black">Humidity:</span>
                                                <span className="text-[12px] font-black text-cyan-400">{cluster.humidity.toFixed(1)}%</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-neutral-500 uppercase font-black">Tekanan:</span>
                                                <span className="text-[12px] font-black text-purple-400">{cluster.pressure.toFixed(0)} <span className="text-[8px] text-neutral-600">hPa</span></span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-neutral-500 uppercase font-black">Cuaca:</span>
                                                <span className="text-[12px] font-black text-white">{cluster.rain}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-t border-white/10 pt-1.5 mt-1.5">
                                                <span className="text-[10px] text-neutral-400 uppercase font-black">Fuzzy Index:</span>
                                                <span className={`text-[12px] font-black ${cluster.fuzzyColor}`}>
                                                    {cluster.fuzzyScore.toFixed(1)} <span className="text-[8px] opacity-65">({cluster.fuzzyLabel})</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-[8px] text-neutral-600 uppercase font-bold bg-white/5 p-1.5 rounded-lg">
                                            <span>Time Window:</span>
                                            <span className="text-cyan-400">{cluster.timeRange}</span>
                                        </div>
                                        <div className="pt-2 border-t border-white/5">
                                            <p className="text-[8px] text-neutral-600 uppercase mb-1">Contributing Nodes:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {cluster.nodes.slice(0, 3).map((n: any) => (
                                                    <span key={n.id} className="text-[7px] bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                                        {n.name}
                                                    </span>
                                                ))}
                                                {cluster.count > 3 && <span className="text-[7px] text-neutral-500">+{cluster.count - 3} more</span>}
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
import { Head, Link, usePage } from '@inertiajs/react';
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
const createPulseIcon = (color: 'red' | 'green' | 'yellow' | 'cyan') => {
    const colorClasses = {
        red: 'bg-red-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        cyan: 'bg-cyan-500'
    };
    const pulseClasses = {
        red: 'bg-red-500/30',
        green: 'bg-green-500/30',
        yellow: 'bg-yellow-500/30',
        cyan: 'bg-cyan-500/30'
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

// Mock Data for GIS Nodes
const mapNodes = [
    // --- TODAY (2024-05-14) ---
    // CENTRAL
    { id: 1, name: 'Sudirman Tower A', lat: -6.2146, lng: 106.8202, pm25: 78.4, pm10: 45.2, mq135: 210, humidity: 65, pressure: 1012, rain: 'Cerah', timestamp: '2024-05-14T10:00:00' },
    { id: 2, name: 'Sudirman Tower B', lat: -6.2150, lng: 106.8210, pm25: 72.1, pm10: 40.5, mq135: 195, humidity: 64, pressure: 1011, rain: 'Cerah', timestamp: '2024-05-14T10:00:00' },
    { id: 3, name: 'Sudirman Crossing', lat: -6.2130, lng: 106.8190, pm25: 85.3, pm10: 52.8, mq135: 240, humidity: 68, pressure: 1010, rain: 'Berawan', timestamp: '2024-05-14T09:00:00' },
    { id: 4, name: 'Thamrin Center', lat: -6.1950, lng: 106.8230, pm25: 92.5, pm10: 58.2, mq135: 280, humidity: 70, pressure: 1008, rain: 'Gerimis', timestamp: '2024-05-14T08:00:00' },
    { id: 5, name: 'Monas Gateway', lat: -6.1754, lng: 106.8271, pm25: 65.2, pm10: 38.4, mq135: 150, humidity: 62, pressure: 1012, rain: 'Cerah', timestamp: '2024-05-14T10:00:00' },
    
    // SOUTH
    { id: 7, name: 'Tebet Eco Park', lat: -6.2372, lng: 106.8524, pm25: 12.5, pm10: 8.2, mq135: 45, humidity: 72, pressure: 1013, rain: 'Cerah', timestamp: '2024-05-14T10:00:00' },
    { id: 8, name: 'Tebet Residential', lat: -6.2380, lng: 106.8540, pm25: 10.1, pm10: 6.5, mq135: 38, humidity: 74, pressure: 1013, rain: 'Cerah', timestamp: '2024-05-14T09:00:00' },
    { id: 9, name: 'Kemang Square', lat: -6.2550, lng: 106.8150, pm25: 35.6, pm10: 22.4, mq135: 85, humidity: 68, pressure: 1011, rain: 'Berawan', timestamp: '2024-05-14T08:00:00' },
    { id: 10, name: 'Kemang Timur', lat: -6.2560, lng: 106.8160, pm25: 42.1, pm10: 28.5, mq135: 92, humidity: 67, pressure: 1010, rain: 'Berawan', timestamp: '2024-05-14T08:00:00' },
    
    // NORTH
    { id: 11, name: 'PIK Waterfront', lat: -6.1100, lng: 106.7400, pm25: 15.2, pm10: 10.1, mq135: 55, humidity: 75, pressure: 1014, rain: 'Cerah', timestamp: '2024-05-14T10:00:00' },
    { id: 12, name: 'Ancol Marina', lat: -6.1200, lng: 106.8300, pm25: 25.4, pm10: 18.2, mq135: 75, humidity: 78, pressure: 1013, rain: 'Gerimis', timestamp: '2024-05-14T10:00:00' },
    { id: 13, name: 'Tanjung Priok', lat: -6.1033, lng: 106.8845, pm25: 115.6, pm10: 82.4, mq135: 420, humidity: 60, pressure: 1009, rain: 'Cerah', timestamp: '2024-05-14T10:00:00' },
    { id: 14, name: 'Kelapa Gading Mall', lat: -6.1550, lng: 106.9050, pm25: 68.2, pm10: 42.1, mq135: 185, humidity: 64, pressure: 1011, rain: 'Cerah', timestamp: '2024-05-14T10:00:00' },

    // EAST
    { id: 15, name: 'Industrial Zone Pulogadung', lat: -6.1850, lng: 106.9150, pm25: 145.2, pm10: 95.8, mq135: 550, humidity: 55, pressure: 1007, rain: 'Hujan', timestamp: '2024-05-14T09:00:00' },
    { id: 16, name: 'Jatinegara Station', lat: -6.2150, lng: 106.8700, pm25: 98.4, pm10: 62.1, mq135: 310, humidity: 62, pressure: 1009, rain: 'Berawan', timestamp: '2024-05-14T10:00:00' },
    { id: 17, name: 'Rawamangun Bus Terminal', lat: -6.1950, lng: 106.8850, pm25: 88.2, pm10: 55.4, mq135: 275, humidity: 65, pressure: 1010, rain: 'Berawan', timestamp: '2024-05-14T08:00:00' },

    // WEST
    { id: 18, name: 'Grogol Crossing', lat: -6.1650, lng: 106.7880, pm25: 110.1, pm10: 72.4, mq135: 380, humidity: 58, pressure: 1008, rain: 'Cerah', timestamp: '2024-05-14T10:00:00' },
    { id: 19, name: 'Kebon Jeruk', lat: -6.1900, lng: 106.7700, pm25: 75.2, pm10: 48.1, mq135: 215, humidity: 66, pressure: 1011, rain: 'Cerah', timestamp: '2024-05-14T09:00:00' },
    { id: 20, name: 'Tomang Interchange', lat: -6.1750, lng: 106.7950, pm25: 125.4, pm10: 85.2, mq135: 440, humidity: 54, pressure: 1007, rain: 'Berawan', timestamp: '2024-05-14T10:00:00' },

    // --- YESTERDAY (2024-05-13) ---
    { id: 101, name: 'Sudirman Tower A', lat: -6.2146, lng: 106.8202, pm25: 45.2, pm10: 28.4, mq135: 110, humidity: 60, pressure: 1012, rain: 'Cerah', timestamp: '2024-05-13T10:00:00' },
    { id: 102, name: 'Tebet Eco Park', lat: -6.2372, lng: 106.8524, pm25: 5.4, pm10: 3.2, mq135: 25, humidity: 65, pressure: 1014, rain: 'Cerah', timestamp: '2024-05-13T10:00:00' },
    { id: 103, name: 'Menteng Area', lat: -6.1950, lng: 106.8320, pm25: 15.2, pm10: 8.5, mq135: 35, humidity: 62, pressure: 1012, rain: 'Cerah', timestamp: '2024-05-13T09:00:00' },
    { id: 104, name: 'Grogol Crossing', lat: -6.1650, lng: 106.7880, pm25: 42.1, pm10: 25.4, mq135: 95, humidity: 60, pressure: 1011, rain: 'Berawan', timestamp: '2024-05-13T08:00:00' },
    { id: 105, name: 'Industrial Zone Pulogadung', lat: -6.1850, lng: 106.9150, pm25: 180.5, pm10: 115.2, mq135: 680, humidity: 50, pressure: 1005, rain: 'Hujan', timestamp: '2024-05-13T10:00:00' },
    { id: 106, name: 'Kelapa Gading Mall', lat: -6.1550, lng: 106.9050, pm25: 55.4, pm10: 32.1, mq135: 140, humidity: 68, pressure: 1012, rain: 'Cerah', timestamp: '2024-05-13T10:00:00' },

    // --- MAY 12 (2024-05-12) ---
    { id: 201, name: 'Sudirman Tower A', lat: -6.2146, lng: 106.8202, pm25: 120.4, pm10: 78.5, mq135: 390, humidity: 55, pressure: 1007, rain: 'Gerimis', timestamp: '2024-05-12T10:00:00' },
    { id: 202, name: 'Bundaran HI', lat: -6.1924, lng: 106.8227, pm25: 110.1, pm10: 70.2, mq135: 350, humidity: 58, pressure: 1008, rain: 'Berawan', timestamp: '2024-05-12T10:00:00' },
    { id: 203, name: 'Tanjung Priok Port', lat: -6.1033, lng: 106.8845, pm25: 155.4, pm10: 105.2, mq135: 580, humidity: 62, pressure: 1006, rain: 'Cerah', timestamp: '2024-05-12T09:00:00' },
    { id: 204, name: 'Kelapa Gading', lat: -6.1550, lng: 106.9050, pm25: 82.1, pm10: 55.4, mq135: 240, humidity: 60, pressure: 1010, rain: 'Cerah', timestamp: '2024-05-12T08:00:00' },
    { id: 205, name: 'Tebet Eco Park', lat: -6.2372, lng: 106.8524, pm25: 45.4, pm10: 28.5, mq135: 115, humidity: 65, pressure: 1012, rain: 'Cerah', timestamp: '2024-05-12T10:00:00' },
];

export default function Maps() {
    const { auth } = usePage().props;
    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);
    const [selectedDate, setSelectedDate] = useState('Today');
    const [selectedTime, setSelectedTime] = useState('Live');
    const [currentZoom, setCurrentZoom] = useState(13);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

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
    const filteredNodes = mapNodes.filter(node => {
        const dateMap: Record<string, string> = {
            'Today': '2024-05-14',
            'Yesterday': '2024-05-13',
            'May 12': '2024-05-12'
        };
        
        const targetDate = dateMap[selectedDate];
        const nodeDate = node.timestamp.split('T')[0];
        const nodeTime = node.timestamp.split('T')[1].substring(0, 5); // HH:mm

        // Date must match
        if (nodeDate !== targetDate) return false;

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
            const avgMq135 = clusterNodes.reduce((acc, n) => acc + (n.mq135 || 0), 0) / clusterNodes.length;
            const avgHumidity = clusterNodes.reduce((acc, n) => acc + (n.humidity || 0), 0) / clusterNodes.length;
            const avgPressure = clusterNodes.reduce((acc, n) => acc + (n.pressure || 0), 0) / clusterNodes.length;
            const rainStatus = clusterNodes.some(n => n.rain === 'Hujan' || n.rain === 'Gerimis') ? 'Hujan/Gerimis' : 'Cerah/Berawan';

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
                mq135: avgMq135,
                humidity: avgHumidity,
                pressure: avgPressure,
                rain: rainStatus,
                count: clusterNodes.length,
                areaName: clusterNodes.length > 1 ? (node.name.split(' ')[0] + ' Cluster') : node.name,
                timeRange: minTime === maxTime ? minTime : `${minTime} - ${maxTime}`,
                nodes: clusterNodes
            });
        }
    });

    const getColor = (pm: number) => {
        if (pm <= 20) return '#22c55e'; // Green
        if (pm <= 50) return '#eab308'; // Yellow
        return '#ef4444'; // Red
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
                <Link href="/" className="px-4 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-4 h-4 text-white" />
                    <span className="text-sm font-black uppercase tracking-widest text-white">Back to Home</span>
                </Link>
                <div className="px-4 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-white">Full Screen GIS Monitor</h2>
                </div>
            </div>

            <div className="absolute top-4 right-4 z-[1000] flex gap-2">
                <div className="px-3 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-3">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <select 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white focus:outline-none border-none p-0 cursor-pointer"
                    >
                        <option value="Today" className="bg-neutral-900">Today</option>
                        <option value="Yesterday" className="bg-neutral-900">Yesterday</option>
                        <option value="May 12" className="bg-neutral-900">May 12</option>
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

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-6 left-6 z-[1000] flex gap-2">
                {['Hijau (Aman)', 'Kuning (Sedang)', 'Merah (Bahaya)'].map((l, i) => (
                    <div key={i} className="px-3 py-2 bg-black/60 backdrop-blur-sm rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-white">
                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        {l}
                    </div>
                ))}
            </div>

            <div className="absolute bottom-6 right-6 z-[1000] text-[10px] font-mono text-neutral-500 uppercase bg-black/60 px-3 py-2 rounded-xl backdrop-blur-sm border border-white/5 flex flex-col items-end">
                <span>Map: Live GIS // CartoDB Dark</span>
                <span>Filter: {selectedDate} @ {selectedTime}</span>
                <span>Zoom: {currentZoom}x</span>
            </div>

            {/* Map Container */}
            <div className="w-full h-full relative z-0">
                <MapContainer 
                    center={[-6.2088, 106.8456]} 
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
                                cluster.pm25 > 50 ? 'red' : cluster.pm25 > 20 ? 'yellow' : 'green'
                            )}>
                                <Popup className="custom-popup">
                                    <div className="p-3 w-56 bg-[#020617] text-white rounded-lg">
                                        <div className="flex justify-between items-start mb-3 border-b border-white/10 pb-2">
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest">{cluster.areaName}</h4>
                                                <p className="text-[8px] text-neutral-500 uppercase">{cluster.count} Nodes averaged</p>
                                            </div>
                                            <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                                cluster.pm25 > 50 ? 'bg-red-500/20 text-red-500' : cluster.pm25 > 20 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'
                                            }`}>
                                                {cluster.pm25 > 50 ? 'High' : cluster.pm25 > 20 ? 'Moderate' : 'Good'}
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
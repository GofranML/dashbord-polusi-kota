import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { 
    Activity, 
    Wind, 
    Droplets, 
    Thermometer, 
    CloudRain, 
    MapPin, 
    Wifi,
    Clock,
    User,
    Globe,
    Zap,
    Shield,
    AlertTriangle,
    BarChart3,
    ArrowUpRight,
    Calendar,
    
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { SensorCard, AQIStatus } from '@/components/SensorCard';
import { GlassCard } from '@/components/GlassCard';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
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

const chartData = [
    { time: '10:00', pm25: 45, pm10: 32, mq135: 120, humidity: 65 },
    { time: '11:00', pm25: 52, pm10: 38, mq135: 145, humidity: 62 },
    { time: '12:00', pm25: 48, pm10: 35, mq135: 130, humidity: 60 },
    { time: '13:00', pm25: 65, pm10: 42, mq135: 180, humidity: 58 },
    { time: '14:00', pm25: 78, pm10: 55, mq135: 210, humidity: 55 },
    { time: '15:00', pm25: 60, pm10: 45, mq135: 160, humidity: 57 },
    { time: '16:00', pm25: 55, pm10: 40, mq135: 140, humidity: 59 },
];

const sensorData = [
    { title: 'PM2.5', value: 78.4, unit: 'µg/m³', status: 'Tidak Sehat' as AQIStatus, icon: Wind, progress: 75, battery: 85, lastUpdate: '2m ago' },
    { title: 'PM10', value: 45.2, unit: 'µg/m³', status: 'Sedang' as AQIStatus, icon: Wind, progress: 45, battery: 92, lastUpdate: '1m ago' },
    { title: 'MQ135', value: 210, unit: 'ppm', status: 'Tidak Sehat' as AQIStatus, icon: Activity, progress: 68, battery: 78, lastUpdate: '5m ago' },
    { title: 'Humidity', value: 65, unit: '%', status: 'Baik' as AQIStatus, icon: Droplets, progress: 65, battery: 88, lastUpdate: '30s ago' },
    { title: 'Tekanan Udara', value: 1012, unit: 'hPa', status: 'Baik' as AQIStatus, icon: Thermometer, progress: 50, battery: 95, lastUpdate: '4m ago' },
    { title: 'Status Hujan', value: 'Cerah', unit: '', status: 'Baik' as AQIStatus, icon: CloudRain, progress: 0, battery: 90, lastUpdate: '10s ago' },
];

export default function Welcome() {
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
    // Zoom 15+ (Very close) -> small radius (0.2km)
    // Zoom 13 (Default) -> medium radius (2km)
    // Zoom 11 (City) -> large radius (5km)
    // Zoom 9- (Regional) -> huge radius (15km)
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
        // Map UI filter to ISO Date part
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

    // Color helper
    const getColor = (pm: number) => {
        if (pm <= 20) return '#22c55e'; // Green
        if (pm <= 50) return '#eab308'; // Yellow
        return '#ef4444'; // Red
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 overflow-x-hidden">
            <Head title="Smart City Air Monitoring - Public Portal" />
            <Toaster position="top-right" theme="dark" />

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-xl bg-black/40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group cursor-pointer">
                        <Globe className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black tracking-tighter text-xl uppercase leading-none">SmartCity<span className="text-cyan-400">Air</span></span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                             <span className="text-[8px] text-neutral-500 uppercase tracking-widest font-black">Public Command Center // Live</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {time.toLocaleTimeString()}
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                            AQI City: <span className="text-orange-400">78 (Moderate)</span>
                        </span>
                    </div>
                    {auth.user ? (
                        <Link href="/dashboard" className="px-5 py-2 bg-white text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Dashboard</Link>
                    ) : (
                        <Link href="/login" className="px-5 py-2 bg-cyan-500 text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all">Member Login</Link>
                    )}
                </div>
            </nav>

            <main className="relative z-10 p-6 lg:p-10 max-w-[1800px] mx-auto space-y-10">
                <section className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            <AlertTriangle className="w-3 h-3" />
                            Environmental Warning: Moderate Pollution
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl lg:text-7xl font-black leading-[0.9] tracking-tighter uppercase"
                        >
                            Condition: <span className="text-orange-400 underline decoration-orange-500/20 underline-offset-8">Unhealthy</span> for Sensitive Groups.
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-neutral-500 text-lg max-w-lg leading-relaxed font-medium"
                        >
                            Monitoring realtime polusi udara di seluruh titik strategis kota menggunakan sensor IoT berpresisi tinggi.
                        </motion.p>
                        
                        <div className="flex items-center gap-8 pt-4">
                             <div className="flex flex-col">
                                 <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">Main AQI Index</span>
                                 <div className="flex items-baseline gap-2">
                                     <span className="text-5xl font-black text-orange-400 tracking-tighter">78</span>
                                     <span className="text-xs font-bold text-neutral-600 uppercase">Points</span>
                                 </div>
                             </div>
                             <div className="w-px h-12 bg-white/10" />
                             <div className="flex flex-col">
                                 <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">Active Stations</span>
                                 <div className="flex items-baseline gap-2">
                                     <span className="text-5xl font-black text-white tracking-tighter">24</span>
                                     <span className="text-xs font-bold text-neutral-600 uppercase">Online</span>
                                 </div>
                             </div>
                        </div>
                    </div>

                    <div className="relative group">
                         <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full group-hover:bg-cyan-500/20 transition-colors" />
                         <GlassCard className="p-4 border-white/20 shadow-2xl relative overflow-hidden h-[400px]">
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="relative">
                                    <motion.div 
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="w-64 h-64 rounded-full border-2 border-orange-500/30"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Activity className="w-24 h-24 text-orange-400 opacity-50" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                 <div className="space-y-1">
                                     <h3 className="text-sm font-black uppercase tracking-widest">Live Pulse</h3>
                                     <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">System heartbeat healthy</p>
                                 </div>
                                 <BarChart3 className="w-8 h-8 text-cyan-400" />
                            </div>
                         </GlassCard>
                    </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    {sensorData.map((sensor, idx) => (
                        <SensorCard key={idx} {...sensor} />
                    ))}
                </section>

                <section className="grid xl:grid-cols-12 gap-8">
                    <div className="xl:col-span-8 space-y-6">
                        <GlassCard className="h-[600px] relative overflow-hidden group border-white/10">
                            <div className="absolute top-1 left-20 z-[1000] space-y-2">
                                 <div className="px-4 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-3">
                                     <MapPin className="w-4 h-4 text-cyan-400" />
                                     <h2 className="text-sm font-black uppercase tracking-widest text-white">Interaktif GIS Monitor</h2>
                                 </div>
                                 <div className="flex gap-2">
                                     {['Hijau (Aman)', 'Kuning (Sedang)', 'Merah (Bahaya)'].map((l, i) => (
                                         <div key={i} className="px-2 py-1 bg-black/40 backdrop-blur-sm rounded-lg border border-white/5 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 text-neutral-400">
                                             <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                             {l}
                                         </div>
                                     ))}
                                 </div>
                            </div>

                            <div className="absolute top-1 right-6 z-[1000] flex gap-2">
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
                            
                            <div className="w-full h-full relative z-0">
                                <MapContainer 
                                    center={[-6.2088, 106.8456]} 
                                    zoom={13} 
                                    scrollWheelZoom={true}
                                    style={{ height: '600px', width: '100%', background: '#030816' }}
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

                                <div className="absolute bottom-6 right-6 z-[1000] text-[10px] font-mono text-neutral-500 uppercase bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-white/5 flex flex-col items-end">
                                    <span>Map: Live GIS // CartoDB Dark</span>
                                    <span>Filter: {selectedDate} @ {selectedTime}</span>
                                    <span>Zoom: {currentZoom}x</span>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Chart Grid */}
                        <GlassCard className="p-8">
                             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                                 <div className="space-y-1">
                                     <h2 className="text-xl font-black uppercase tracking-tight">Analitik Tren Polusi</h2>
                                     <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-black">History visualizer // Sector 01</p>
                                 </div>
                                 <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                                     {['1 Hour', '24 Hours', '7 Days'].map((f) => (
                                         <button key={f} className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors text-neutral-500 hover:text-white">
                                             {f}
                                         </button>
                                     ))}
                                 </div>
                             </div>
                             <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorPmPublic" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="time" stroke="#ffffff10" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#ffffff10" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '10px' }}
                                            itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="pm25" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorPmPublic)" />
                                        <Area type="monotone" dataKey="pm10" stroke="#a855f7" strokeWidth={2} fillOpacity={0} />
                                    </AreaChart>
                                </ResponsiveContainer>
                             </div>
                        </GlassCard>
                    </div>

                    {/* Statistics Column */}
                    <div className="xl:col-span-4 space-y-8">
                         {/* City Stats */}
                         <GlassCard className="p-8 space-y-6 border-cyan-500/20">
                             <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-3">
                                 <BarChart3 className="w-5 h-5 text-cyan-400" />
                                 City Highlights
                             </h3>
                             <div className="space-y-4">
                                 {[
                                     { label: 'Lokasi Udara Terbaik', val: 'Tebet Eco Park', color: 'text-green-400' },
                                     { label: 'Polusi Tertinggi', val: 'Bundaran HI', color: 'text-red-400' },
                                     { label: 'Rata-rata AQI Kota', val: '62 (Moderate)', color: 'text-yellow-400' },
                                     { label: 'Status Cuaca', val: 'Cerah Berawan', color: 'text-cyan-400' },
                                 ].map((s, i) => (
                                     <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                                         <div className="space-y-1">
                                             <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">{s.label}</p>
                                             <p className={cn("text-sm font-black", s.color)}>{s.val}</p>
                                         </div>
                                         <ArrowUpRight className="w-4 h-4 text-neutral-700 group-hover:text-white transition-colors" />
                                     </div>
                                 ))}
                             </div>
                         </GlassCard>

                         {/* Alerts Summary */}
                         <GlassCard className="p-8 space-y-6 bg-red-500/5 border-red-500/20">
                             <div className="flex items-center gap-3">
                                 <div className="p-2 rounded-lg bg-red-500/20">
                                     <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                                 </div>
                                 <h3 className="text-lg font-black uppercase tracking-widest text-red-500">Active Alerts</h3>
                             </div>
                             <div className="space-y-3">
                                 <div className="p-4 rounded-xl bg-black/40 border border-red-500/20 text-[10px] leading-relaxed uppercase tracking-widest text-neutral-400 font-bold">
                                     Warning: Kadar MQ-135 di area industri Jakarta Utara meningkat 15% dari batas normal.
                                 </div>
                                 <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-[10px] leading-relaxed uppercase tracking-widest text-neutral-400 font-bold">
                                     Info: Perawatan sensor di sektor 04 dijadwalkan pada 15 Mei 2026.
                                 </div>
                             </div>
                         </GlassCard>

                         {/* CTA Section */}
                         <GlassCard className="p-8 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20 border-cyan-500/40">
                             <Zap className="w-10 h-10 text-cyan-400 mb-4" />
                             <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Empowering Smart Governance.</h3>
                             <p className="text-xs text-neutral-400 mb-8 uppercase tracking-widest font-bold leading-relaxed">Dapatkan akses ke instrumen monitoring profesional dan alat analisis lanjutan untuk petugas lapangan.</p>
                             <Link href="/register" className="block w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-center rounded-2xl hover:scale-[1.02] transition-transform shadow-[0_10px_40px_rgba(255,255,255,0.1)]">
                                 Register Account
                             </Link>
                         </GlassCard>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 py-16 border-t border-white/5 bg-black/40 backdrop-blur-xl">
                 <div className="max-w-[1800px] mx-auto px-10 grid md:grid-cols-4 gap-12 text-[10px] uppercase font-black tracking-widest text-neutral-500">
                     <div className="space-y-6">
                         <div className="flex items-center gap-2">
                             <div className="w-6 h-6 bg-white rounded-lg" />
                             <span className="text-white font-black text-sm">SMARTCITY</span>
                         </div>
                         <p className="leading-loose">Optimasi lingkungan perkotaan melalui teknologi IoT dan analisis data realtime untuk kehidupan yang lebih baik.</p>
                     </div>
                     <div className="space-y-4">
                         <h4 className="text-white">Resources</h4>
                         <p className="hover:text-cyan-400 cursor-pointer">API Documentation</p>
                         <p className="hover:text-cyan-400 cursor-pointer">Open Data Portal</p>
                         <p className="hover:text-cyan-400 cursor-pointer">Security Protocol</p>
                     </div>
                     <div className="space-y-4">
                         <h4 className="text-white">Legal</h4>
                         <p className="hover:text-cyan-400 cursor-pointer">Privacy Policy</p>
                         <p className="hover:text-cyan-400 cursor-pointer">Terms of Service</p>
                         <p className="hover:text-cyan-400 cursor-pointer">Cookie Settings</p>
                     </div>
                     <div className="space-y-4">
                         <h4 className="text-white">Contact</h4>
                         <p>Command Center: (021) 123-4567</p>
                         <p>support@smartcity-air.gov</p>
                         <div className="flex gap-4 pt-2">
                             <Globe className="w-4 h-4" />
                             <Shield className="w-4 h-4" />
                             <Wifi className="w-4 h-4" />
                         </div>
                     </div>
                 </div>
                 <div className="mt-16 text-center text-[8px] text-neutral-700 font-black uppercase tracking-[0.5em]">
                     © 2026 Smart City Air Monitoring System // Department of Environment
                 </div>
            </footer>
        </div>
    );
}

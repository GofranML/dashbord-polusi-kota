import { useState, useEffect, useRef, useCallback } from 'react';

export interface DeviceTelemetryItem {
    device: {
        id: number;
        device_code?: string;
        name: string;
        region?: string;
        status: string;
        last_seen_at: string | null;
        latitude?: number | null;
        longitude?: number | null;
    };
    latest_data: {
        id: number;
        device_id: number;
        datetime: string;
        pm25: number | null;
        pm10: number | null;
        pm1: number | null;
        gas_index: number | null;
        gps_lat: number | null;
        gps_lng: number | null;
        rain_status: string | null;
        air_pressure: number | null;
        temperature: number | null;
        humidity: number | null;
        battery_status: number | null;
        created_at: string;
        updated_at: string;
    } | null;
}

export interface UseLiveTelemetryOptions {
    deviceId?: number;
    initialData?: any;
    pollingIntervalMs?: number; // Default: 15000 (15 seconds)
    enabled?: boolean;
    onDataUpdate?: (updatedItem: DeviceTelemetryItem, allDevices: DeviceTelemetryItem[]) => void;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'unmodified' | 'stale' | 'offline' | 'error';

export interface UseLiveTelemetryReturn {
    telemetry: DeviceTelemetryItem['latest_data'] | null;
    deviceInfo: DeviceTelemetryItem['device'] | null;
    allDevices: DeviceTelemetryItem[];
    isLive: boolean;
    isSyncing: boolean;
    syncStatus: SyncStatus;
    syncStatusText: string;
    lastSyncTime: Date | null;
    secondsSinceLastSync: number;
    error: string | null;
    hasLiveGpsFix: boolean;
    gpsStatusText: string;
    refetch: () => Promise<void>;
    togglePolling: () => void;
}

export function useLiveTelemetry(options: UseLiveTelemetryOptions = {}): UseLiveTelemetryReturn {
    const {
        deviceId,
        initialData = null,
        pollingIntervalMs = 15000,
        enabled = true,
        onDataUpdate,
    } = options;

    const [isLive, setIsLive] = useState<boolean>(enabled);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(() => (initialData ? new Date() : null));
    const [secondsSinceLastSync, setSecondsSinceLastSync] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    // Initial state setup from initialData if provided
    const [telemetry, setTelemetry] = useState<DeviceTelemetryItem['latest_data'] | null>(() => {
        if (!initialData) return null;
        if (initialData.latest_data) return initialData.latest_data;
        if (Array.isArray(initialData)) {
            const found = deviceId ? initialData.find((d: any) => d.device?.id === deviceId) : initialData[0];
            return found?.latest_data || null;
        }
        return initialData;
    });

    const [deviceInfo, setDeviceInfo] = useState<DeviceTelemetryItem['device'] | null>(() => {
        if (!initialData) return null;
        if (initialData.device) return initialData.device;
        if (Array.isArray(initialData)) {
            const found = deviceId ? initialData.find((d: any) => d.device?.id === deviceId) : initialData[0];
            return found?.device || null;
        }
        return null;
    });

    const [allDevices, setAllDevices] = useState<DeviceTelemetryItem[]>(() => {
        if (Array.isArray(initialData)) return initialData;
        return [];
    });

    // Refs for caching headers, cancellation, and race condition prevention
    const etagRef = useRef<string | null>(null);
    const lastModifiedRef = useRef<string | null>(null);
    const requestSeqRef = useRef<number>(0);
    const lastTimestampRef = useRef<number>(
        telemetry?.datetime ? new Date(telemetry.datetime).getTime() : 0,
    );
    const pollingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isTabActiveRef = useRef<boolean>(typeof document !== 'undefined' ? !document.hidden : true);
    const isOnlineRef = useRef<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

    // Update secondsSinceLastSync counter every second
    useEffect(() => {
        const timer = setInterval(() => {
            if (lastSyncTime) {
                const diff = Math.max(0, Math.floor((Date.now() - lastSyncTime.getTime()) / 1000));
                setSecondsSinceLastSync(diff);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [lastSyncTime]);

    // Primary Fetch Function
    const fetchTelemetry = useCallback(async () => {
        if (!isOnlineRef.current) {
            setSyncStatus('offline');
            return;
        }

        const currentSeq = ++requestSeqRef.current;
        setIsSyncing(true);
        setSyncStatus('syncing');

        // Setup 10-second timeout
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), 10000);

        try {
            const url = new URL('/api/dashboard/latest', window.location.origin);
            if (deviceId) {
                url.searchParams.set('device_id', String(deviceId));
            }

            const headers: HeadersInit = {
                'Accept': 'application/json',
            };
            if (etagRef.current) {
                headers['If-None-Match'] = etagRef.current;
            }
            if (lastModifiedRef.current) {
                headers['If-Modified-Since'] = lastModifiedRef.current;
            }

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers,
                signal: abortController.signal,
            });

            clearTimeout(timeoutId);

            // Ignore response if a newer request already resolved
            if (currentSeq !== requestSeqRef.current) {
                return;
            }

            // Case 1: HTTP 304 Not Modified -> No change in DB
            if (response.status === 304) {
                const now = new Date();
                setLastSyncTime(now);
                setSyncStatus('unmodified');
                setError(null);
                setIsSyncing(false);
                return;
            }

            // Case 2: HTTP 200 OK -> New or updated data
            if (response.status === 200) {
                const newEtag = response.headers.get('ETag');
                const newLastModified = response.headers.get('Last-Modified');
                if (newEtag) etagRef.current = newEtag;
                if (newLastModified) lastModifiedRef.current = newLastModified;

                const json = await response.json();
                if (json.success && Array.isArray(json.data)) {
                    const devicesList: DeviceTelemetryItem[] = json.data;
                    setAllDevices(devicesList);

                    // Find target device (either matching deviceId or first available)
                    const target = deviceId
                        ? devicesList.find((d) => d.device?.id === deviceId) || devicesList[0]
                        : devicesList[0];

                    if (target) {
                        setDeviceInfo(target.device);

                        if (target.latest_data) {
                            const newDateTime = new Date(target.latest_data.datetime).getTime();
                            const prevDateTime = lastTimestampRef.current || 0;

                            // Prevent out-of-order stale overwrite
                            if (newDateTime >= prevDateTime) {
                                lastTimestampRef.current = newDateTime;
                                setTelemetry(target.latest_data);
                                if (onDataUpdate) {
                                    onDataUpdate(target, devicesList);
                                }
                            }
                        }
                    }

                    const now = new Date();
                    setLastSyncTime(now);
                    setSyncStatus('synced');
                    setError(null);
                } else {
                    setSyncStatus('stale');
                }
            } else {
                setSyncStatus('error');
                setError(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (err: any) {
            clearTimeout(timeoutId);
            if (currentSeq === requestSeqRef.current) {
                if (err.name === 'AbortError') {
                    setSyncStatus('stale');
                    setError('Koneksi timeout (10s)');
                } else if (!navigator.onLine) {
                    setSyncStatus('offline');
                    setError('Koneksi internet terputus');
                } else {
                    setSyncStatus('error');
                    setError(err.message || 'Gagal memuat telemetri');
                }
            }
        } finally {
            if (currentSeq === requestSeqRef.current) {
                setIsSyncing(false);
            }
        }
    }, [deviceId, onDataUpdate]);

    // Polling Interval Lifecycle with Visibility Guard
    useEffect(() => {
        if (!isLive) {
            if (pollingTimerRef.current) {
                clearInterval(pollingTimerRef.current);
                pollingTimerRef.current = null;
            }
            return;
        }

        const startPolling = () => {
            if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
            pollingTimerRef.current = setInterval(() => {
                // Only poll when browser tab is actively visible and online
                if (isTabActiveRef.current && isOnlineRef.current) {
                    fetchTelemetry();
                }
            }, pollingIntervalMs);
        };

        startPolling();

        // Page Visibility API event listener
        const handleVisibilityChange = () => {
            const isVisible = !document.hidden;
            isTabActiveRef.current = isVisible;

            if (isVisible) {
                // Revalidate immediately when returning to the tab
                fetchTelemetry();
                startPolling();
            } else {
                // Pause polling to conserve bandwidth & DB connections
                if (pollingTimerRef.current) {
                    clearInterval(pollingTimerRef.current);
                    pollingTimerRef.current = null;
                }
            }
        };

        // Online/Offline detection listeners
        const handleOnline = () => {
            isOnlineRef.current = true;
            fetchTelemetry();
            startPolling();
        };

        const handleOffline = () => {
            isOnlineRef.current = false;
            setSyncStatus('offline');
            if (pollingTimerRef.current) {
                clearInterval(pollingTimerRef.current);
                pollingTimerRef.current = null;
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            if (pollingTimerRef.current) {
                clearInterval(pollingTimerRef.current);
                pollingTimerRef.current = null;
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [isLive, pollingIntervalMs, fetchTelemetry]);

    // GPS Status computation
    const hasLiveGpsFix = Boolean(
        telemetry &&
        telemetry.gps_lat !== null &&
        telemetry.gps_lng !== null &&
        Number(telemetry.gps_lat) !== 0 &&
        Number(telemetry.gps_lng) !== 0
    );

    const gpsStatusText = hasLiveGpsFix
        ? 'GPS Fix Aktif'
        : 'Menunggu GPS Fix (Sinyal Satelit Lemah)';

    // Indonesian human-readable sync status label
    let syncStatusText = 'Tersinkronisasi';
    switch (syncStatus) {
        case 'syncing':
            syncStatusText = 'Memeriksa pembaruan...';
            break;
        case 'unmodified':
            syncStatusText = secondsSinceLastSync > 0
                ? `Sinkron (${secondsSinceLastSync}s lalu • Tidak ada data baru)`
                : 'Sinkron (Data tidak berubah)';
            break;
        case 'synced':
            syncStatusText = secondsSinceLastSync > 0
                ? `Tersinkronisasi (${secondsSinceLastSync}s lalu)`
                : 'Tersinkronisasi (Baru saja)';
            break;
        case 'offline':
            syncStatusText = 'Mode Offline (Menunggu jaringan)';
            break;
        case 'stale':
            syncStatusText = 'Data Historis (Koneksi tertunda)';
            break;
        case 'error':
            syncStatusText = error || 'Gangguan sinkronisasi';
            break;
        case 'idle':
        default:
            syncStatusText = isLive ? 'Siaga Real-time (15s)' : 'Sinkronisasi Dijeda';
            break;
    }

    const togglePolling = useCallback(() => {
        setIsLive((prev) => !prev);
    }, []);

    return {
        telemetry,
        deviceInfo,
        allDevices,
        isLive,
        isSyncing,
        syncStatus,
        syncStatusText,
        lastSyncTime,
        secondsSinceLastSync,
        error,
        hasLiveGpsFix,
        gpsStatusText,
        refetch: fetchTelemetry,
        togglePolling,
    };
}

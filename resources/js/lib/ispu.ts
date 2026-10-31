/**
 * Standar Perhitungan Indeks Standar Pencemar Udara (ISPU)
 * Berdasarkan Peraturan Menteri Lingkungan Hidup dan Kehutanan Republik Indonesia
 * Nomor P.14/MENLHK/SETJEN/KUM.1/7/2020
 */

export type IspuCategory = 'Baik' | 'Sedang' | 'Tidak Sehat' | 'Sangat Tidak Sehat' | 'Berbahaya';

export interface IspuEvaluation {
    ispu: number;
    category: IspuCategory;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    hex: string;
    description: string;
    healthAdvice: string;
    badgeLabel: string;
    disclaimer: string;
}

interface IspuBreakpoint {
    ispuMin: number;
    ispuMax: number;
    pm25Min: number;
    pm25Max: number;
    category: IspuCategory;
    hex: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    description: string;
    healthAdvice: string;
}

const ISPU_PM25_BREAKPOINTS: IspuBreakpoint[] = [
    {
        ispuMin: 0,
        ispuMax: 50,
        pm25Min: 0.0,
        pm25Max: 15.5,
        category: 'Baik',
        hex: '#10B981',
        colorClass: 'text-emerald-500 dark:text-emerald-400',
        bgClass: 'bg-emerald-500/10',
        borderClass: 'border-emerald-500/20',
        description: 'Tingkat kualitas udara sangat baik, tidak memberikan efek negatif terhadap manusia, hewan, dan tumbuhan.',
        healthAdvice: 'Aktivitas luar ruangan aman untuk semua kelompok masyarakat.',
    },
    {
        ispuMin: 51,
        ispuMax: 100,
        pm25Min: 15.6,
        pm25Max: 55.4,
        category: 'Sedang',
        hex: '#3B82F6',
        colorClass: 'text-blue-500 dark:text-blue-400',
        bgClass: 'bg-blue-500/10',
        borderClass: 'border-blue-500/20',
        description: 'Kualitas udara masih dapat diterima pada kesehatan manusia, hewan, dan tumbuhan.',
        healthAdvice: 'Kelompok sangat sensitif disarankan membatasi aktivitas fisik berat jangka panjang di luar ruangan.',
    },
    {
        ispuMin: 101,
        ispuMax: 200,
        pm25Min: 55.5,
        pm25Max: 150.4,
        category: 'Tidak Sehat',
        hex: '#EAB308',
        colorClass: 'text-amber-500 dark:text-amber-400',
        bgClass: 'bg-amber-500/10',
        borderClass: 'border-amber-500/20',
        description: 'Bersifat merugikan pada manusia atau kelompok rentan dan dapat menimbulkan kerusakan pada tumbuhan.',
        healthAdvice: 'Masyarakat umum disarankan mengurangi aktivitas luar ruang; gunakan masker saat bepergian.',
    },
    {
        ispuMin: 201,
        ispuMax: 300,
        pm25Min: 150.5,
        pm25Max: 250.4,
        category: 'Sangat Tidak Sehat',
        hex: '#EF4444',
        colorClass: 'text-rose-500 dark:text-rose-400',
        bgClass: 'bg-rose-500/10',
        borderClass: 'border-rose-500/20',
        description: 'Tingkat kualitas udara yang dapat meningkatkan risiko kesehatan pada sejumlah segmen populasi yang terpapar.',
        healthAdvice: 'Hindari aktivitas di luar ruangan, terutama bagi anak-anak, lansia, dan penderita penyakit pernapasan.',
    },
    {
        ispuMin: 301,
        ispuMax: 500,
        pm25Min: 250.5,
        pm25Max: 500.0,
        category: 'Berbahaya',
        hex: '#7F1D1D',
        colorClass: 'text-red-700 dark:text-red-400',
        bgClass: 'bg-red-950/40',
        borderClass: 'border-red-800/40',
        description: 'Tingkat kualitas udara berbahaya secara umum dan berpotensi menimbulkan dampak kesehatan serius.',
        healthAdvice: 'Tetap berada di dalam ruangan dan tutup ventilasi luar; gunakan pembersih udara jika tersedia.',
    },
];

/**
 * Menghitung nilai ISPU dari konsentrasi PM2.5 menggunakan interpolasi linier KLHK.
 *
 * @param pm25 Konsentrasi partikulat PM2.5 (µg/m³)
 * @param isSpotReading Apakah data merupakan pembacaan sesaat (spot) atau rata-rata bergerak 24 jam
 */
export function calculateIspuFromPm25(pm25: number, isSpotReading: boolean = true): IspuEvaluation {
    const concentration = Math.max(0, pm25);

    // Cari bracket yang sesuai
    let bracket = ISPU_PM25_BREAKPOINTS.find(
        (b) => concentration >= b.pm25Min && concentration <= b.pm25Max
    );

    if (!bracket) {
        if (concentration > 500) {
            bracket = ISPU_PM25_BREAKPOINTS[ISPU_PM25_BREAKPOINTS.length - 1];
            return {
                ispu: 500,
                category: bracket.category,
                colorClass: bracket.colorClass,
                bgClass: bracket.bgClass,
                borderClass: bracket.borderClass,
                hex: bracket.hex,
                description: bracket.description,
                healthAdvice: bracket.healthAdvice,
                badgeLabel: isSpotReading ? 'ISPU Indikatif (Spot Reading)' : 'ISPU Rata-rata 24 Jam (KLHK)',
                disclaimer: isSpotReading
                    ? 'Dihitung dari konsentrasi sesaat terkini. Penetapan status resmi KLHK memerlukan data rata-rata bergerak 24 jam.'
                    : 'Berdasarkan data rata-rata bergerak 24 jam sesuai ketentuan Permen LHK No. 14/2020.',
            };
        }
        bracket = ISPU_PM25_BREAKPOINTS[0];
    }

    // Rumus: I = ((Ia - Ib) / (Xa - Xb)) * (Xx - Xb) + Ib
    const { ispuMin, ispuMax, pm25Min, pm25Max } = bracket;
    const ispuCalculated = Math.round(
        ((ispuMax - ispuMin) / (pm25Max - pm25Min)) * (concentration - pm25Min) + ispuMin
    );

    return {
        ispu: Math.min(500, Math.max(0, ispuCalculated)),
        category: bracket.category,
        colorClass: bracket.colorClass,
        bgClass: bracket.bgClass,
        borderClass: bracket.borderClass,
        hex: bracket.hex,
        description: bracket.description,
        healthAdvice: bracket.healthAdvice,
        badgeLabel: isSpotReading ? 'ISPU Indikatif (Spot Reading)' : 'ISPU Rata-rata 24 Jam (KLHK)',
        disclaimer: isSpotReading
            ? 'Dihitung dari konsentrasi sesaat terkini. Penetapan status resmi KLHK memerlukan data rata-rata bergerak 24 jam.'
            : 'Berdasarkan data rata-rata bergerak 24 jam sesuai ketentuan Permen LHK No. 14/2020.',
    };
}

/**
 * Menghitung kategori ISPU PM10 (µg/m³) berdasarkan Permen LHK No. 14/2020
 */
export function calculateIspuFromPm10(pm10: number): { ispu: number; category: IspuCategory; hex: string } {
    const val = Math.max(0, pm10);
    if (val <= 50) return { ispu: Math.round((val / 50) * 50), category: 'Baik', hex: '#10B981' };
    if (val <= 150) return { ispu: Math.round(51 + ((val - 51) / (150 - 51)) * 49), category: 'Sedang', hex: '#3B82F6' };
    if (val <= 350) return { ispu: Math.round(101 + ((val - 151) / (350 - 151)) * 99), category: 'Tidak Sehat', hex: '#EAB308' };
    if (val <= 420) return { ispu: Math.round(201 + ((val - 351) / (420 - 351)) * 99), category: 'Sangat Tidak Sehat', hex: '#EF4444' };
    return { ispu: 301, category: 'Berbahaya', hex: '#7F1D1D' };
}

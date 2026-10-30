# 🌐 PolluTrack - Air Quality Monitoring Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-v13.7-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel Version" />
  <img src="https://img.shields.io/badge/React-v19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Version" />
  <img src="https://img.shields.io/badge/TypeScript-v5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Inertia.js-v3.0-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Leaflet-v1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
</p>

**PolluTrack** adalah platform pemantauan kualitas udara real-time futuristik dengan estetika premium **Glassmorphism**. Dashboard ini mengintegrasikan data sensor IoT secara *real-time* dengan visualisasi GIS (*Geographic Information System*) interaktif berbasis peta digital dinamis.

Dirancang khusus untuk kebutuhan ruang kendali (*Command Center*), aplikasi ini menyajikan wawasan mendalam mengenai sebaran polutan, tren kualitas udara, status cuaca, hingga sistem deteksi dini (*Alerting*) otomatis di wilayah DKI Jakarta.

---

## 🚀 Fitur Utama

### 🗺️ 1. GIS Interaktif & Dynamic Clustering
*   **Dynamic Clustering Engine**: Mengelompokkan puluhan titik sensor secara otomatis berdasarkan tingkat perbesaran (*zoom level*) peta untuk mengoptimalkan kinerja render dan keterbacaan data.
*   **Pulsing Marker System**: Indikator titik lokasi sensor yang dilengkapi animasi denyut (*pulsing*) dinamis dengan skema warna cerdas standar indeks kualitas udara:
    *   🟢 **Hijau (Baik)**: Rentang kualitas udara sehat dengan tingkat polutan minimal.
    *   🟡 **Kuning (Sedang)**: Kualitas udara masih dapat diterima dengan sedikit polutan.
    *   🔴 **Merah (Tidak Sehat/Bahaya)**: Tingkat pencemaran tinggi yang memerlukan penanganan khusus.
*   **Interactive Data Popups**: Panel info detail saat marker/cluster diklik, menampilkan metrik rata-rata sensor dalam klaster, rentang waktu kontribusi data (*Time Window*), serta daftar sensor yang aktif.

### 🔌 2. Integrasi Sensor Lingkungan Multi-Parameter
Dashboard memantau **6 parameter krusial** secara bersamaan untuk memberikan analisis lingkungan yang komprehensif:

| Parameter | Nama Metrik | Unit | Deskripsi & Dampak Lingkungan |
| :--- | :--- | :--- | :--- |
| **PM2.5** | Partikulat Halus | $\mu g/m^3$ | Debu mikro (<2.5 $\mu m$) berisiko tinggi masuk ke paru-paru |
| **PM10** | Partikulat Kasar | $\mu g/m^3$ | Partikel debu kasar (<10 $\mu m$) seperti serbuk sari & debu jalan |
| **MQ-135** | Air Quality / Gas | PPM | Sensor deteksi gas polutan berbahaya (CO2, Alkohol, Amonia, Benzena) |
| **Humidity** | Kelembaban | % | Tingkat kandungan uap air di udara sekitar |
| **Air Pressure** | Tekanan Udara | hPa | Tekanan atmosfer yang memengaruhi stabilitas udara |
| **Weather** | Status Cuaca | *Status* | Status otomatis terklasifikasi (*Cerah, Berawan, Gerimis, Hujan*) |

### 🔍 3. Advanced Data Filtering & Mock Engine
*   **Temporal Filter**: Filter interaktif berdasarkan hari (*Today, Yesterday, 12 May*) dan jam operasional (*Live, 08:00, 09:00, 10:00*).
*   **Data Window Calculation**: Logika komputasi dinamis untuk memproses rentang waktu data aktif pada visualisasi grafik.
*   **Massive Jakarta Mock Dataset**: Dataset yang menyimulasikan data riil di **35+ titik strategis Jakarta** (Jakarta Pusat, Utara, Timur, Selatan, Barat) lengkap dengan variasi fluktuasi historis.

### 💎 4. Desain UI/UX Futuristik (Glassmorphism)
*   **Premium Glassmorphism**: Estetika modern menggunakan efek kaca transparan (*backdrop-blur*), pencahayaan tepi (*subtle borders*), dan gradasi neon kontras tinggi.
*   **Responsive Command Center Layout**: Tata letak grid dinamis yang dioptimalkan untuk layar monitor besar (*Command Center TV*) maupun perangkat seluler.
*   **Real-time Analytics Charts**: Visualisasi fluktuasi PM2.5 dan PM10 secara berkala menggunakan grafik garis responsif dari **Recharts**.
*   **Fluid Micro-Animations**: Interaksi lembut dan transisi halus pada setiap card dan tombol menggunakan **Framer Motion**.

### ⚠️ 5. PolluTrack Alerts & Highlights
*   **City Highlights Stats**: Panel ringkasan otomatis yang menampilkan wilayah dengan kualitas udara terbaik, lokasi dengan polusi tertinggi, serta rata-rata AQI kota.
*   **Active Alert System**: Notifikasi instan (menggunakan **Sonner**) saat sensor mendeteksi kadar gas (MQ-135) atau partikulat (PM2.5) melebihi ambang batas aman.

---

## 🛠️ Stack Teknologi

Sistem dibangun menggunakan arsitektur modern berkinerja tinggi:

*   **Backend & Router**: [Laravel v13.7](https://laravel.com) & [Inertia.js v3.0](https://inertiajs.com) (Menghubungkan Laravel dengan React tanpa API REST manual).
*   **Frontend Library**: [React.js v19.2](https://react.dev) & [TypeScript v5.7](https://www.typescriptlang.org).
*   **Styling & UI**: [Tailwind CSS v4.0](https://tailwindcss.com) & [Headless UI](https://headlessui.com) / [Radix UI primitives](https://www.radix-ui.com).
*   **Maps & GIS**: [React Leaflet v5.0](https://react-leaflet.js.org) dengan tile standar OpenStreetMap, tanpa API key.
*   **Grafik**: [Recharts v3.8](https://recharts.org).
*   **Animasi**: [Framer Motion v12.38](https://www.framer.com/motion/).
*   **Notifikasi**: [Sonner](https://sonner.emilkowal.ski).

---

## 💻 Panduan Instalasi & Pengaturan

Ikuti langkah-langkah di bawah ini untuk memasang aplikasi di lingkungan lokal Anda.

### Persyaratan Sistem
*   **PHP** $\ge$ 8.3
*   **Composer**
*   **Node.js** $\ge$ 18 (disarankan Node.js LTS)
*   **SQLite** (atau DBMS lain seperti MySQL/PostgreSQL)

---

### Cara Cepat (One-Command Setup)

Repositori ini telah dilengkapi dengan script otomatis untuk melakukan instalasi semua dependensi, penyalinan berkas `.env`, pembuatan *application key*, migrasi database, hingga proses kompilasi awal *assets*:

```bash
composer setup
```

---

### Cara Manual (Step-by-Step)

Jika Anda ingin menjalankan instalasi secara bertahap, ikuti instruksi berikut:

1.  **Clone Repositori**:
    ```bash
    git clone https://github.com/username/dashboard-polusi-kota.git
    cd dashboard-polusi-kota
    ```

2.  **Instal Dependensi PHP (Composer)**:
    ```bash
    composer install
    ```

3.  **Konfigurasi Environment**:
    Salin file `.env.example` menjadi `.env`:
    ```bash
    cp .env.example .env
    ```

4.  **Generate Application Key**:
    ```bash
    php artisan key:generate
    ```

5.  **Setup Database (SQLite)**:
    Pastikan file database SQLite kosong telah dibuat:
    *   **Windows (PowerShell)**: `New-Item -Path "database/database.sqlite" -ItemType "file"`
    *   **Linux/macOS**: `touch database/database.sqlite`

    Setelah itu, jalankan migrasi tabel:
    ```bash
    php artisan migrate --force
    ```

6.  **Instal Dependensi Node (NPM)**:
    ```bash
    npm install
    ```

7.  **Bangun Frontend Assets**:
    ```bash
    npm run build
    ```

---

## 🚀 Menjalankan Aplikasi di Lingkungan Pengembangan

Untuk mempermudah pengembangan, Anda dapat menjalankan server web Laravel, *Queue Listener*, dan server *Vite dev* secara **bersamaan** menggunakan perintah tunggal:

```bash
composer dev
```

> [!TIP]
> Perintah `composer dev` menggunakan package `concurrently` di balik layar untuk menjalankan proses-proses berikut secara paralel:
> 1.  `php artisan serve` (Server Backend) di `http://127.0.0.1:8000`
> 2.  `php artisan queue:listen` (Antrean Background)
> 3.  `npm run dev` (Kompilasi Frontend HMR - Hot Module Replacement)

Buka peramban (browser) Anda dan akses **[http://127.0.0.1:8000](http://127.0.0.1:8000)**.

---

## 📂 Struktur Folder Penting

Berikut adalah peta struktur folder utama dari aplikasi ini untuk membantu mempermudah navigasi:

```text
dashboard-polusi-kota/
├── app/                       # Logika Utama Laravel (Controllers, Models, Middleware)
│   ├── Http/
│   │   └── Controllers/       # Controller untuk interaksi data
│   └── Models/                # Eloquent Models (User, dll.)
├── config/                    # File konfigurasi Laravel
├── database/                  # Skema Database & Migrasi
│   ├── migrations/            # Tabel database
│   └── database.sqlite        # SQLite Database (lingkungan lokal)
├── resources/
│   ├── css/                   # File styling utama (Tailwind entrypoint)
│   ├── js/                    # Kode Sumber React + TypeScript
│   │   ├── components/        # Komponen UI Reusable (SensorCard, GlassCard, dll.)
│   │   ├── layouts/           # Tata letak halaman (Sidebar, Shell)
│   │   ├── pages/             # Halaman Inertia (welcome.tsx, maps.tsx, dashboard.tsx)
│   │   ├── types/             # Deklarasi Type TypeScript
│   │   └── app.tsx            # Inisialisasi Aplikasi React & Inertia
│   └── views/                 # Blade Template utama (app.blade.php)
├── routes/
│   ├── web.php                # Rute aplikasi web utama
│   └── settings.php           # Rute untuk pengaturan profil & akun
├── vite.config.ts             # Konfigurasi Bundler Vite
└── package.json               # Dependensi & script NPM
```

---

## 📈 Pembuatan Produksi (Production Build)

Sebelum mengunggah aplikasi ke lingkungan produksi, kompilasi seluruh aset front-end agar berukuran minimal dan optimal:

```bash
npm run build
```

Setelah build selesai, pastikan Anda juga mengoptimalkan konfigurasi Laravel:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

*Developed for PolluTrack Command Center Environment - 2026*

# Smart City Air Monitoring Dashboard

Dashboard pemantauan kualitas udara kota pintar (Smart City) futuristik yang mengintegrasikan data IoT sensor secara real-time dengan visualisasi GIS (Geographic Information System) yang interaktif.

## 🚀 Fitur Utama yang Telah Diimplementasikan

### 1. GIS Interaktif & Dynamic Clustering
*   **Dynamic Clustering Engine**: Algoritma pengelompokan titik sensor otomatis yang menyesuaikan radius berdasarkan level zoom peta.
*   **Pulsing Marker System**: Marker peta yang memiliki animasi detak (pulse) dengan kode warna dinamis:
    *   🟢 **Hijau**: Kualitas Udara Baik.
    *   🟡 **Kuning**: Kualitas Udara Sedang.
    *   🔴 **Merah**: Kualitas Udara Tidak Sehat/Bahaya.
*   **Interactive Data Popups**: Popup detail pada peta yang menampilkan:
    *   Rata-rata metrik seluruh sensor dalam satu cluster.
    *   Rentang waktu (Time Window) kontribusi data.
    *   Daftar titik sensor yang berkontribusi dalam cluster tersebut.

### 2. Multi-Parameter IoT Sensor Integration
Sistem mendukung pemantauan 6 parameter krusial lingkungan secara bersamaan:
*   **PM2.5 & PM10**: Partikulat debu halus dan kasar.
*   **MQ-135 (Air Quality/Gas)**: Deteksi gas polutan dalam satuan PPM.
*   **Humidity**: Kelembaban udara real-time.
*   **Air Pressure (Tekanan)**: Tekanan udara dalam satuan hPa.
*   **Rain/Weather Status**: Status cuaca otomatis (Cerah, Berawan, Gerimis, Hujan).

### 3. Advanced Data Filtering System
*   **Temporal Filter**: Pengguna dapat memfilter data berdasarkan tanggal (Today, Yesterday, 12 May) dan waktu spesifik (Live, 08:00, 09:00, 10:00).
*   **Data Window Calculation**: Logika cerdas untuk menentukan rentang waktu data yang aktif pada tampilan dashboard.
*   **Massive Mock Dataset**: Dataset yang diperluas mencakup 35+ lokasi strategis di Jakarta (Pusat, Utara, Timur, Selatan, Barat) dengan variasi data historis.

### 4. Futuristic UI/UX Design (Glassmorphism)
*   **Glassmorphism Interface**: Tampilan premium dengan efek kaca transparan, blur, dan gradien vibran.
*   **Responsive Command Center**: Tata letak yang dioptimalkan untuk pengalaman layar besar maupun perangkat mobile.
*   **Real-time Analytics Charts**: Grafik tren polusi menggunakan Recharts yang menunjukkan fluktuasi PM2.5 dan PM10.
*   **Micro-Animations**: Penggunaan Framer Motion untuk transisi halus dan elemen UI yang terasa "hidup".

### 5. Smart City Logic & Alerts
*   **City Highlights**: Statistik otomatis untuk lokasi dengan udara terbaik, polusi tertinggi, dan rata-rata AQI kota.
*   **Active Alert System**: Notifikasi otomatis jika kadar gas (MQ-135) atau partikulat (PM2.5) melebihi batas aman di area tertentu.

## 🛠️ Stack Teknologi
*   **Frontend**: React.js, TypeScript, Inertia.js.
*   **Styling**: Tailwind CSS (Custom Theme).
*   **Maps**: React Leaflet (OpenStreetMap & CartoDB Dark).
*   **Animations**: Framer Motion.
*   **Charts**: Recharts.
*   **Icons**: Lucide React.
*   **Notifications**: Sonner.

---
*Developed for Smart City Command Center Environment - 2026*

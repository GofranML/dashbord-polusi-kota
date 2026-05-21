# 📌 Pembagian Fitur Berdasarkan Hak Akses User
## Smart City Air Monitoring Dashboard

Dokumen ini menjelaskan pembagian fitur berdasarkan jenis pengguna (*User Access Level*) pada sistem Smart City Air Monitoring Dashboard.

Tujuan utama pembagian hak akses:
- meningkatkan keamanan sistem
- mempermudah operasional
- membatasi akses fitur sensitif
- meningkatkan pengalaman pengguna

---

# 🌍 1. Public User (Tanpa Login)

Bagian publik ditujukan untuk masyarakat umum agar dapat memantau kualitas udara kota secara realtime tanpa perlu membuat akun.

---

## ✅ Fitur Public Dashboard

### 🗺️ Realtime Air Monitoring Map
- Peta kualitas udara realtime
- Marker sensor
- Dynamic clustering
- Heatmap polusi
- Layer wilayah

---

### 📊 Statistik Kota
- AQI rata-rata kota
- Wilayah terbaik
- Wilayah terburuk
- Jumlah sensor aktif
- Jumlah alert aktif

---

### 📈 Grafik Realtime
- PM2.5
- PM10
- MQ-135
- Humidity
- Air Pressure

---

### 🌦️ Informasi Cuaca
- Status cuaca realtime
- Suhu
- Kelembaban udara
- Tekanan udara

---

### ⚠️ Public Alert System
- Notifikasi udara buruk
- Informasi area berbahaya
- Alert realtime kualitas udara

---

### 🔍 Filter Dasar
- Filter wilayah
- Filter parameter sensor
- Filter waktu sederhana

---

### 📱 Mobile Dashboard
- Tampilan mobile friendly
- Dashboard ringan untuk smartphone

---

# 🔐 2. Authenticated User (Dengan Login)

Bagian ini ditujukan untuk operator monitoring, petugas lingkungan, dan pengguna internal.

---

## ✅ Fitur User Login

### 📈 Historical Data
- Riwayat data sensor
- Grafik mingguan
- Grafik bulanan
- Perbandingan antar sensor

---

### 📄 Export Data
- Export PDF
- Export Excel
- Export CSV

---

### 🔔 Alert Management
- Riwayat alert
- Resolve alert
- ACK alert
- Threshold custom

---

### ⚙️ Personal Dashboard
- Custom widget
- Bookmark lokasi sensor
- Pengaturan tema dashboard

---

### 📬 Notification Integration
- Email notification
- Telegram notification
- WhatsApp notification

---

# 🛠️ 3. Admin / Operator Dashboard

Role ini digunakan oleh pengelola sistem dan command center.

---

## ✅ Fitur Admin

### 👥 User Management
- Tambah user
- Edit user
- Suspend akun
- Manajemen role
- Audit log

---

### 📡 Device Management
- Tambah sensor
- Edit sensor
- Monitoring sensor
- Kalibrasi perangkat
- Monitoring online/offline

---

### ⚙️ System Configuration
- Pengaturan threshold
- Pengaturan interval data
- Pengaturan notifikasi
- Pengaturan wilayah monitoring

---

### 📊 Smart Analytics
- AI prediction
- AQI forecasting
- Trend analysis
- Statistical analysis

---

### 🔒 Security Management
- 2FA authentication
- Backup database
- IP restriction
- Security log

---

# 🔧 4. Teknisi Lapangan

Role khusus untuk maintenance dan pengecekan perangkat IoT di lapangan.

---

## ✅ Fitur Teknisi

### 🛠️ Maintenance Management
- Ticket maintenance
- Jadwal maintenance
- Histori perbaikan
- Histori kalibrasi

---

### 📍 Lokasi Sensor
- Navigasi sensor
- Tracking lokasi perangkat
- QR Code sensor

---

### 🔋 Device Health Monitoring
- Tegangan baterai
- Kekuatan sinyal
- Status koneksi
- Last seen sensor

---

# 📌 Struktur URL Dashboard

## 🌐 Public Dashboard

```text
/
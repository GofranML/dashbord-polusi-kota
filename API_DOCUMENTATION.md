# Dokumentasi API Dashboard Monitoring Kualitas Udara (IoT)

API ini digunakan untuk komunikasi antara perangkat IoT dengan server untuk mengirim data sensor, dan antara server dengan frontend dashboard untuk menampilkan data secara realtime dan historis.

## Base URL
`http://localhost:8000/api`

---

## 1. Upload Data Sensor dari Perangkat IoT

Endpoint ini menerima data sensor dari perangkat IoT. Mendukung **dua mode**:
1. **Batch Mode** — satu file berisi banyak data (array `sensor_data`)
2. **Single Mode** — satu file atau body berisi satu data sensor

Endpoint ini mendukung dua metode pengiriman:
- **File Upload** (multipart/form-data) → cocok untuk perangkat yang menulis file dulu ke SD card
- **Raw JSON Body** (application/json) → cocok untuk perangkat yang langsung POST JSON

---

### Mode 1: Upload via File (multipart/form-data)

**Endpoint:** `POST /iot/upload`

**Headers:**
- `Authorization`: Bearer `[API_TOKEN_DEVICE]`
- `Content-Type`: `multipart/form-data`

**Body Params:**
- `sensor_file`: File (wajib, format `.json`, maksimal 10MB)

**Contoh Request cURL:**
```bash
curl -X POST http://localhost:8000/api/iot/upload \
-H "Authorization: Bearer TOKEN_API" \
-F "sensor_file=@sensor-data.json"
```

---

### Mode 2: Upload via Raw JSON Body (application/json)

**Endpoint:** `POST /iot/upload`

**Headers:**
- `Authorization`: Bearer `[API_TOKEN_DEVICE]`
- `Content-Type`: `application/json`

**Contoh Request cURL:**
```bash
curl -X POST http://localhost:8000/api/iot/upload \
-H "Authorization: Bearer TOKEN_API" \
-H "Content-Type: application/json" \
-d @sensor-data.json
```

---

### Format Payload JSON — Batch (Direkomendasikan)

Kirim banyak data sekaligus dalam satu request menggunakan `sensor_data` array:

```json
{
  "device_name": "IOT-PALEMBANG-01",
  "total_data": 2,
  "sensor_data": [
    {
      "datetime": "2026-05-22 20:15:00",
      "pm25": 35,
      "pm10": 42,
      "pm1": 20,
      "gas_index": 410,
      "gps_lat": -2.9761,
      "gps_lng": 104.7754,
      "rain_status": "Tidak Hujan",
      "air_pressure": 1008.5,
      "temperature": 29.4,
      "humidity": 78,
      "battery_status": 87
    },
    {
      "datetime": "2026-05-22 20:20:00",
      "pm25": 37,
      "pm10": 45,
      "pm1": 21,
      "gas_index": 430,
      "gps_lat": -2.9761,
      "gps_lng": 104.7754,
      "rain_status": "Hujan Ringan",
      "air_pressure": 1007.9,
      "temperature": 28.9,
      "humidity": 82,
      "battery_status": 85
    }
  ]
}
```

### Format Payload JSON — Single (Legacy)

Kirim satu data langsung (tanpa array `sensor_data`):

```json
{
  "device_name": "IOT-PALEMBANG-01",
  "datetime": "2026-05-22 20:15:00",
  "pm25": 35,
  "pm10": 42,
  "pm1": 20,
  "gas_index": 410,
  "gps_lat": -2.9761,
  "gps_lng": 104.7754,
  "rain_status": "Tidak Hujan",
  "air_pressure": 1008.5,
  "temperature": 29.4,
  "humidity": 78,
  "battery_status": 87
}
```

---

### Penjelasan Field JSON

| Field | Tipe | Keterangan |
|---|---|---|
| `device_name` | string | **Wajib**. Harus cocok dengan `device_code` atau nama device yang terdaftar |
| `total_data` | integer | Opsional. Jumlah baris data (hanya informasi, tidak divalidasi server) |
| `sensor_data` | array | Wajib untuk mode Batch. Isi: array objek data sensor |
| `datetime` | string | Format: `Y-m-d H:i:s` — contoh: `2026-05-22 20:15:00` |
| `pm25` | float | Partikel PM2.5 (µg/m³) |
| `pm10` | float | Partikel PM10 (µg/m³) |
| `pm1` | float | Partikel PM1.0 (µg/m³) |
| `gas_index` | integer | Indeks gas MQ135 (ppm) |
| `gps_lat` | float | Koordinat latitude GPS |
| `gps_lng` | float | Koordinat longitude GPS |
| `rain_status` | string | Status hujan (misal: `"Tidak Hujan"`, `"Hujan Ringan"`) |
| `air_pressure` | float | Tekanan udara (hPa) |
| `temperature` | float | Suhu (°C) |
| `humidity` | float | Kelembaban (%) |
| `battery_status` | float | Level baterai (%) |

---

### Response Sukses (200 OK)

```json
{
  "success": true,
  "message": "Data berhasil disimpan",
  "data": {
    "device_name": "Sensor Palembang 01",
    "device_code": "IOT-PALEMBANG-01",
    "records_saved": 2,
    "mode": "batch",
    "first_datetime": "2026-05-22 20:15:00",
    "last_datetime": "2026-05-22 20:20:00"
  }
}
```

### Response Error — Device Name Mismatch (403 Forbidden)

```json
{
  "success": false,
  "message": "Device name mismatch. Expected 'IOT-PALEMBANG-01' or 'Sensor Palembang 01', got 'IOT-WRONG-01'."
}
```

### Response Error — Validasi JSON Gagal (422 Unprocessable Entity)

```json
{
  "success": false,
  "message": "Invalid data in row #0",
  "errors": {
    "datetime": ["The datetime field must match the format Y-m-d H:i:s."]
  }
}
```

### Response Error — Token Tidak Valid (401 Unauthorized)

```json
{
  "success": false,
  "message": "Unauthorized. Invalid token."
}
```

---

## 2. Dashboard - Ambil Data Terbaru

Mengambil data sensor paling baru (terakhir masuk) untuk semua perangkat.

**Endpoint:** `GET /dashboard/latest`

**Response Sukses:**
```json
{
  "success": true,
  "data": [
    {
      "device": {
        "id": 1,
        "name": "IOT-PALEMBANG-01",
        "status": "online",
        "last_seen_at": "2026-05-22T13:40:55.000000Z"
      },
      "latest_data": {
        "id": 1,
        "datetime": "2026-05-22T20:15:00.000000Z",
        "pm25": 35,
        "temperature": 29.4
      }
    }
  ]
}
```

---

## 3. Dashboard - Ambil Histori Data Sensor

Mengambil histori data secara *paginated* (berhalaman). Mendukung filter berdasarkan tanggal dan perangkat.

**Endpoint:** `GET /dashboard/history`

**Query Params (Opsional):**
- `device_id`: ID perangkat
- `start_date`: Tanggal mulai (format: `Y-m-d`)
- `end_date`: Tanggal akhir (format: `Y-m-d`)
- `page`: Nomor halaman

---

## 4. Dashboard - Ambil Semua Histori Data Sensor (Tanpa Paginasi)

Mengambil histori data sensor secara lengkap dari awal sampai akhir. Mendukung filter opsional berdasarkan stasiun node.

**Endpoint:** `GET /dashboard/history/all`

**Query Params (Opsional):**
- `device_id`: ID stasiun node

**Response Sukses:**
```json
{
  "success": true,
  "count": 888,
  "data": [
    {
      "id": 1,
      "device_id": 1,
      "datetime": "2026-06-10T10:00:00.000000Z",
      "pm25": 35.5,
      "pm10": 42.1,
      "pm1": 20.3,
      "gas_index": 410,
      "gps_lat": -2.9909,
      "gps_lng": 104.7566,
      "rain_status": "Tidak Hujan",
      "air_pressure": 1008.5,
      "temperature": 29.4,
      "humidity": 78,
      "battery_status": 87,
      "created_at": "2026-06-12T12:00:00.000000Z",
      "updated_at": "2026-06-12T12:00:00.000000Z",
      "device": {
        "id": 1,
        "device_code": "IOT-PALEMBANG-01",
        "name": "Kambang Iwak Park",
        "status": "online"
      }
    }
  ]
}
```

---

## 5. Dashboard - Statistik

Mendapatkan ringkasan/rata-rata data (seperti rata-rata PM2.5, suhu) untuk satu hari penuh.

**Endpoint:** `GET /dashboard/statistics`

**Query Params (Opsional):**
- `date`: Tanggal (format: `Y-m-d`, default hari ini)
- `device_id`: Filter spesifik perangkat

**Response:**
```json
{
  "success": true,
  "data": {
    "pm25_avg": 35.0,
    "pm10_avg": 42.0,
    "temperature_avg": 29.4,
    "humidity_avg": 78.0,
    "total_readings": 2
  }
}
```

---

## 6. Monitoring Status Device (Online/Offline)

Mengambil daftar semua perangkat dan status terakhirnya. Jika perangkat tidak mengirim data selama lebih dari 5 menit, maka statusnya otomatis menjadi `offline`.

**Endpoint:** `GET /devices`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "IOT-PALEMBANG-01",
      "status": "online",
      "last_seen_at": "2026-05-22T13:40:55.000000Z",
      "is_online": true
    }
  ]
}
```

---

## 7. Menu Dashboard (Akses Khusus Super Admin)

Endpoint ini digunakan oleh frontend untuk merender struktur menu dashboard navigasi yang hanya boleh diakses oleh pengguna dengan role **Super Admin** (misalnya pengelola pusat kota atau admin sistem).

**Endpoint:** `GET /dashboard/menu`

**Headers:**
- `Authorization`: Bearer `[TOKEN_LOGIN_ADMIN]`

**Penjelasan:**
Data JSON yang dikirimkan berisikan konfigurasi menu, link (URL), dan ikon yang akan dirender secara dinamis di *sidebar* frontend. Endpoint ini dilindungi oleh middleware *Role Based Access Control* (RBAC) yang memastikan hanya user "Super Admin" yang bisa mengaksesnya.

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    { "title": "Monitoring Utama", "icon": "monitor-icon", "url": "/dashboard/main" },
    { "title": "Manajemen Perangkat IoT", "icon": "device-icon", "url": "/dashboard/devices" },
    { "title": "Laporan & Statistik", "icon": "report-icon", "url": "/dashboard/reports" },
    { "title": "Manajemen Pengguna", "icon": "users-icon", "url": "/dashboard/users", "is_super_admin_only": true },
    { "title": "Pengaturan Sistem", "icon": "settings-icon", "url": "/dashboard/settings", "is_super_admin_only": true }
  ]
}
```

---

## Penjelasan Alur Integrasi & Keamanan

### 1. Alur Upload Device IoT (Batch Mode)
- Perangkat bangun dari *sleep mode*, membaca sensor setiap interval (misal: 5 menit).
- Perangkat mengumpulkan semua pembacaan ke dalam array `sensor_data`.
- Perangkat membentuk file `sensor-data.json` dengan format batch.
- Perangkat mengirim file ke server menggunakan metode `POST multipart/form-data` **atau** `POST application/json`.
- Server mengautentikasi perangkat melalui Bearer Token di header.
- Server memvalidasi `device_name` cocok dengan token perangkat (bisa nama atau device code).
- Server memvalidasi setiap baris di `sensor_data` secara iteratif.
- Semua baris disimpan ke database dalam **satu transaksi atomik** — jika satu baris gagal, semuanya dibatalkan.
- Server mengupdate `last_seen_at` dan status perangkat menjadi `online`.
- Server mencatat log upload di tabel `upload_logs`.

### 2. Integrasi Realtime Dashboard
- Dashboard frontend bisa melakukan *polling* ke endpoint `/api/dashboard/latest` setiap beberapa detik (misal 5 detik).
- Karena setiap kali perangkat upload data, tabel `sensor_data` dan waktu `last_seen_at` diperbarui, frontend akan mendapatkan data yang up-to-date setiap kali *polling*.
- Pendekatan alternatif adalah menggunakan WebSockets (Laravel Reverb / Pusher), yang mana akan membroadcast Event `NewSensorData` ketika ada upload berhasil di `IotDataController`.

### 3. Best Practice Keamanan API IoT
- **Token Based Device Auth:** API dienkapsulasi middleware custom yang mewajibkan `Authorization: Bearer <API_TOKEN_DEVICE>`. Token ini berbeda untuk tiap alat (Device-specific), dan terpisah dari manajemen autentikasi user (Sanctum/Session). Ini mengurangi celah peretasan bila 1 alat bocor.
- **Validasi Device Identity:** Payload JSON memuat `device_name`. Server mencocokkan `device_name` yang diupload dengan `device_code` **atau** nama device yang ditautkan pada token. Ini mencegah device dengan token X mengirim data atas nama device Y.
- **Transaksi Atomik:** Semua baris batch disimpan dalam satu DB transaction. Jika satu baris gagal, tidak ada data yang tersimpan setengah-jalan.
- **Validasi Input Ketat:** Setiap baris di `sensor_data` divalidasi tipe datanya (numeric, datetime format) menggunakan Laravel Validator.

### 4. Rate Limiting
- API Upload diproteksi dengan `throttle:60,1` di routing (`routes/api.php`). Ini berarti satu alamat IP atau device hanya dapat mengirim maksimal 60 permintaan upload file setiap 1 menit. Jika melebihi batas, server akan memberikan respon `429 Too Many Requests`.

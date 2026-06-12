# 🎨 Panduan Ekspor & Impor Flowchart ke Draw.io

Draw.io mendukung impor diagram **Mermaid** secara langsung. Anda dapat menyalin kode Mermaid dari diagram di bawah ini dan memasukkannya ke dalam Draw.io untuk menghasilkan flowchart yang dapat diedit secara visual.

## 🚀 Cara Impor ke Draw.io (Langkah-langkah)

1. Buka [draw.io](https://app.diagrams.net/).
2. Buat diagram baru atau buka diagram yang sudah ada.
3. Di menu bagian atas, klik: **Arrange** -> **Insert** -> **Advanced** -> **Mermaid...** (atau klik ikon **`+` (Insert)** di toolbar -> **Advanced** -> **Mermaid**).
4. **Hapus contoh kode** yang ada di dalam kotak teks tersebut.
5. **Salin salah satu kode Mermaid** dari daftar di bawah ini, lalu **tempel (paste)** ke dalam kotak teks tersebut.
6. Klik tombol **Insert** (atau **Ok**).
7. Draw.io akan secara otomatis menghasilkan diagram flowchart berbentuk komponen yang bisa digeser, diedit teksnya, diubah warnanya, dan disimpan.

---

## 🗂️ Daftar Kode Mermaid untuk Draw.io

### 1. Gambaran Umum Sistem (System Architecture Overview)
```mermaid
graph TD
    subgraph Perangkat_IoT [Perangkat IoT]
        IoT[Sensor Node / Device]
    end

    subgraph Backend_Server [Backend Server - Laravel 13]
        Router[API/Web Routes]
        Middleware[IotDeviceAuth & Rate Limiting]
        Controller[Controllers: IotDataController, DashboardController]
        DB[(Database: SQLite/MySQL)]
    end

    subgraph Frontend_Client [Frontend Client - React 19 + Inertia]
        Welcome[Welcome Page / Public Map Node]
        Dashboard[Admin Dashboard Panel]
        History[History & Export Panel]
        AlertPanel[Alert & Configuration Panel]
    end

    IoT -->|1. POST Upload Data / File JSON| Router
    Router -->|2. Cek Token & Throttle| Middleware
    Middleware -->|3. Validasi & Simpan| Controller
    Controller -->|4. Insert/Update Data| DB

    Welcome & Dashboard & History & AlertPanel -->|Request View / JSON API| Router
    Controller -->|Query Metrics| DB
    Controller -->|Send Page Props / JSON Response| Welcome & Dashboard & History & AlertPanel
```

---

### 2. Alur Upload Data Sensor dari Perangkat IoT (Data Ingestion Flow)
```mermaid
flowchart TD
    Start([Mulai: IoT Kirim Data]) --> Request[Kirim HTTP POST ke /api/iot/upload]
    
    Request --> CheckThrottle{Apakah request <= 60 per menit?}
    CheckThrottle -- Tidak --> Error429[Error 429: Too Many Requests] --> End([Selesai])
    CheckThrottle -- Ya --> CheckToken{Cek Bearer Token di Header}
    
    CheckToken -- Tidak Ada / Invalid --> Error401[Error 401: Unauthorized] --> End
    CheckToken -- Token Valid --> GetDevice[Dapatkan Data Device dari DB]
    
    GetDevice --> UpdateOnline[Update Device status = online & last_seen_at = NOW]
    
    UpdateOnline --> DetectPayload{Ada File 'sensor_file'?}
    
    DetectPayload -- Ya --> ValidateFile{Validasi tipe file JSON & ukuran <= 10MB}
    ValidateFile -- Gagal --> LogFailFile[Log Upload: failed] --> Error422[Error 422: Validation Error] --> End
    ValidateFile -- Sukses --> ParseJSON{Parse isi file JSON}
    ParseJSON -- JSON Invalid --> LogFailJSON[Log Upload: failed] --> Error400[Error 400: Invalid JSON format] --> End
    ParseJSON -- JSON Valid --> CheckDeviceName
    
    DetectPayload -- Tidak --> ParseBody{Ambil Raw JSON Body}
    ParseBody -- Kosong / Invalid --> ErrorJSON[Error 400: Empty or invalid JSON body] --> End
    ParseBody -- JSON Valid --> CheckDeviceName
    
    CheckDeviceName{Apakah device_name cocok dengan DB?}
    CheckDeviceName -- Tidak Cocok --> LogFailMismatch[Log Upload: failed] --> Error403[Error 403: Device name mismatch] --> End
    CheckDeviceName -- Cocok --> DetermineMode{Apakah ada array sensor_data? \n Batch vs Single}
    
    DetermineMode -- Ya Batch --> ValidateRows{Validasi tipe data setiap baris secara iteratif}
    DetermineMode -- Tidak Single --> ValidateRows
    
    ValidateRows -- Ada Baris Gagal --> LogFailValidation[Log Upload: failed] --> Error422_Rows[Error 422: Invalid data in row] --> End
    
    ValidateRows -- Semua Baris Valid --> DBTransaction[Mulai DB Transaction]
    DBTransaction --> SaveLoop[Loop: Simpan menggunakan SensorData::updateOrCreate]
    SaveLoop --> Commit{Apakah semua baris berhasil ditulis?}
    Commit -- Gagal --> Rollback[Rollback DB Transaction] --> LogFailDB[Log Upload: failed] --> Error500[Error 500: Server Error] --> End
    Commit -- Sukses --> CommitDB[Commit DB Transaction]
    
    CommitDB --> LogSuccess[Log Upload: success]
    LogSuccess --> SuccessResponse[Status 200 OK: Data berhasil disimpan] --> End
```

---

### 3. Alur Visualisasi Data Real-time & Dashboard (Client View Flow)
```mermaid
flowchart TD
    Start([User Membuka Halaman]) --> AccessView{Halaman apa yang diakses?}
    
    AccessView -- Welcome / Maps Publik --> LoadPublicController[Panggil TelemetryController welcome/maps]
    LoadPublicController --> QueryLatest[Query Telemetry Sensor Terakhir untuk Semua Device]
    QueryLatest --> CalcCityAQI[Hitung rata-rata AQI Kota berdasarkan PM2.5]
    CalcCityAQI --> LoadAlerts[Query 5 Alert Aktif Terakhir]
    LoadAlerts --> LoadTrend[Query Data Tren 24 Jam Sudirman Tower A]
    LoadTrend --> RenderPublicReact[Kirim data via Inertia Props ke React]
    
    AccessView -- Private Dashboard Admin --> CheckAuth{Apakah User Terautentikasi?}
    CheckAuth -- Belum Login --> RedirectLogin[Redirect ke Halaman Login]
    CheckAuth -- Sudah Login --> LoadPrivateController[Inisialisasi Data Dashboard]
    LoadPrivateController --> QueryMetrics[Query Jumlah Device & Alert Aktif]
    QueryMetrics --> QueryLatestTelemetry[Query Sensor Terbaru tiap Device]
    QueryLatestTelemetry --> RenderPrivateReact[Kirim data via Inertia ke React Page]
    
    RenderPublicReact & RenderPrivateReact --> ReactRender[React Merender Tampilan: Map, Cards, Charts]
    
    ReactRender --> InitPolling[Jalankan API Polling setiap 5 detik]
    InitPolling --> FetchLatestAPI[Request HTTP GET ke /api/dashboard/latest & /api/devices]
    FetchLatestAPI --> CheckDeviceStatus{Apakah status device \n last_seen_at > 5 menit?}
    CheckDeviceStatus -- Ya --> UpdateOffline[Update status device menjadi offline di DB]
    CheckDeviceStatus -- Tidak --> NoUpdate[Biarkan status tetap]
    
    UpdateOffline & NoUpdate --> ReturnJSON[Kembalikan data sensor & status terbaru]
    ReturnJSON --> UpdateReactState[Update State React & Render ulang component]
```

---

### 4. Alur Deteksi Dini & Manajemen Peringatan (Alert System Flow)
```mermaid
flowchart TD
    Start([IoT Data Berhasil Disimpan]) --> CheckThreshold{Apakah nilai PM2.5, PM10, atau MQ-135 \n melebihi batas konfigurasi global?}
    
    CheckThreshold -- Tidak --> End([Selesai])
    CheckThreshold -- Ya --> CheckExistingActive{Apakah alert aktif untuk parameter & device \n ini sudah ada?}
    
    CheckExistingActive -- Ya --> End
    CheckExistingActive -- Tidak --> CreateAlert[Buat Alert Baru status = active]
    CreateAlert --> Notify[Tampilkan Notifikasi Toast realtime via Sonner]
    
    Notify --> OperatorAction{Tindakan Operator/Admin di Alert Panel}
    
    OperatorAction -- Acknowledge --> UpdateAck[Update Alert status = acknowledged]
    UpdateAck --> LogAck[Catat AuditLog: Alert Acknowledged oleh User] --> End
    
    OperatorAction -- Resolve --> RequestResolve[Kirim notes penyelesaian via Form]
    RequestResolve --> ValidateNotes{Validasi notes wajib diisi}
    ValidateNotes -- Gagal --> ShowValidation[Tampilkan error validasi] --> RequestResolve
    ValidateNotes -- Sukses --> UpdateResolve[Update Alert status = resolved, resolved_by, resolved_at, notes]
    UpdateResolve --> LogResolve[Catat AuditLog: Alert Resolved oleh User] --> End
```

---

### 5. Alur Manajemen Perangkat & Kalibrasi (Device Management Flow)
```mermaid
flowchart TD
    Start([Admin mengakses /dashboard/admin/devices]) --> Action{Tindakan Admin}
    
    Action -- Registrasi Device Baru --> FormCreate[Isi form: device_code, nama, lat, lng, region, status]
    FormCreate --> ValidateCreate{Validasi input & keunikan device_code}
    ValidateCreate -- Gagal --> ShowErrorCreate[Tampilkan Error Form]
    ValidateCreate -- Sukses --> InsertDevice[Simpan Device Baru ke DB]
    InsertDevice --> LogCreate[Catat AuditLog: Register New IoT Sensor] --> SuccessMsg[Tampilkan Pesan Sukses]
    
    Action -- Generate API Token --> TokenReq[Kirim request generate API Token]
    TokenReq --> GenToken[Buat random token 60 karakter]
    GenToken --> SaveToken[Simpan token di field api_token device]
    SaveToken --> LogToken[Catat AuditLog: Device Token Generated] --> SuccessMsg
    
    Action -- Kalibrasi Sensor --> FormCalib[Kirim nilai calibration_factor \n Rentang: 0.1 s/d 5.0]
    FormCalib --> ValidateCalib{Validasi numerik & rentang}
    ValidateCalib -- Gagal --> ShowErrorCalib[Tampilkan Error Form]
    ValidateCalib -- Sukses --> SaveCalib[Update calibration_factor device]
    SaveCalib --> LogCalib[Catat AuditLog: Device Calibration adjusted] --> SuccessMsg
```

---

### 6. Alur Tiket Pemeliharaan Teknisi (Maintenance Ticket Flow)
```mermaid
flowchart TD
    Start([Kerusakan/Kebutuhan Kalibrasi Fisik]) --> CreateTicket[Admin/Operator Membuat Tiket Pemeliharaan]
    CreateTicket --> Assign[Assign ke Teknisi, Tentukan Device, Deskripsi, & Jadwal]
    Assign --> InitialStatus[Tiket berstatus pending]
    
    InitialStatus --> TechLogin[Teknisi Lapangan login & masuk panel /technician/tickets]
    TechLogin --> ActionTech{Tindakan Teknisi}
    
    ActionTech -- Mulai Pekerjaan --> UpdateInProgress[Update Tiket status = in_progress]
    UpdateInProgress --> RenderProgress[Status berubah di dashboard]
    
    ActionTech -- Selesai Pekerjaan --> FormComplete[Kirim formulir penyelesaian tiket]
    FormComplete --> UpdateComplete[Update Tiket status = completed, completed_at = NOW]
    UpdateComplete --> LogComplete[Catat histori pemeliharaan device]
```

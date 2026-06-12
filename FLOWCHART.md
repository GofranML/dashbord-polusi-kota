# 📊 Flowchart Alur Program - Smart City Air Monitoring Dashboard

Dokumen ini menjelaskan alur program, arsitektur, dan aliran data (*data flow*) pada aplikasi **Smart City Air Monitoring Dashboard**. Diagram dalam dokumen ini menggunakan format **Mermaid** yang dapat dirender secara visual pada editor Markdown modern.

---

## 🗺️ Gambaran Umum Sistem (System Architecture Overview)

Aplikasi ini menggunakan arsitektur hybrid **Laravel (Backend)** dan **React + TypeScript + Inertia.js (Frontend)**, yang berkomunikasi dengan perangkat **IoT (Sensors)** melalui API HTTP RESTful.

```mermaid
graph TD
    subgraph "Perangkat IoT"
        IoT[Sensor Node / Device]
    end

    subgraph "Backend Server (Laravel 13)"
        Router[API/Web Routes]
        Middleware[IotDeviceAuth & Rate Limiting]
        Controller[Controllers: IotDataController, DashboardController, etc.]
        DB[(Database: SQLite/MySQL)]
    end

    subgraph "Frontend Client (React 19 + Inertia)"
        Welcome[Welcome Page / Public Map Node]
        Dashboard[Admin Dashboard Panel]
        History[History & Export Panel]
        AlertPanel[Alert & Configuration Panel]
    end

    %% IoT Upload Flow
    IoT -->|1. POST Upload Data / File JSON| Router
    Router -->|2. Cek Token & Throttle| Middleware
    Middleware -->|3. Validasi & Simpan| Controller
    Controller -->|4. Insert/Update Data| DB

    %% Web Client Request Flow
    Welcome & Dashboard & History & AlertPanel -->|Request View / JSON API| Router
    Controller -->|Query Metrics| DB
    Controller -->|Send Page Props / JSON Response| Welcome & Dashboard & History & AlertPanel
```

---

## 🔌 1. Alur Upload Data Sensor dari Perangkat IoT (Data Ingestion Flow)

Perangkat IoT mengirim data kualitas udara secara berkala (misal: setiap 5 menit) menggunakan token khusus perangkat (*Device Token*). Upload mendukung mode **File Upload (JSON)** atau **Raw JSON Body** dengan format **Batch** (direkomendasikan) atau **Single**.

```mermaid
flowchart TD
    Start([Mulai: IoT Kirim Data]) --> Request[Kirim HTTP POST ke `/api/iot/upload`]
    
    %% Middleware Auth & Throttle
    Request --> CheckThrottle{Apakah request <= 60 per menit?}
    CheckThrottle -- Tidak --> Error429[Kembalikan Error 429: Too Many Requests] --> End[Selesai]
    CheckThrottle -- Ya --> CheckToken{Cek Bearer Token di Header}
    
    CheckToken -- Tidak Ada / Invalid Token --> Error401[Kembalikan Error 401: Unauthorized] --> End
    CheckToken -- Token Valid --> GetDevice[Dapatkan Data Device dari DB]
    
    %% Update status device menjadi online
    GetDevice --> UpdateOnline[Update Device status = 'online' & last_seen_at = NOW]
    
    %% Controller logic: Payload Detection
    UpdateOnline --> DetectPayload{Ada File 'sensor_file'?}
    
    %% File Upload Flow
    DetectPayload -- Ya --> ValidateFile{Validasi tipe file JSON & ukuran <= 10MB}
    ValidateFile -- Gagal --> LogFailFile[Log Upload: failed] --> Error422[Kembalikan Error 422: Validation Error] --> End
    ValidateFile -- Sukses --> ParseJSON{Parse isi file JSON}
    ParseJSON -- JSON Invalid --> LogFailJSON[Log Upload: failed] --> Error400[Kembalikan Error 400: Invalid JSON format] --> End
    ParseJSON -- JSON Valid --> CheckDeviceName
    
    %% Raw JSON Body Flow
    DetectPayload -- Tidak --> ParseBody{Ambil Raw JSON Body}
    ParseBody -- Kosong / Invalid --> ErrorJSON[Kembalikan Error 400: Empty or invalid JSON body] --> End
    ParseBody -- JSON Valid --> CheckDeviceName
    
    %% Device Name Matching
    CheckDeviceName{Apakah `device_name` sesuai dengan device_code/name di DB?}
    CheckDeviceName -- Tidak Cocok --> LogFailMismatch[Log Upload: failed] --> Error403[Kembalikan Error 403: Device name mismatch] --> End
    CheckDeviceName -- Cocok --> DetermineMode{Apakah ada array `sensor_data`? \n Batch Mode vs Single Mode}
    
    %% Data Formatting & Validation
    DetermineMode -- Ya (Batch) --> ValidateRows{Validasi tipe data setiap baris secara iteratif}
    DetermineMode -- Tidak (Single) --> ValidateRows
    
    ValidateRows -- Ada Baris Gagal --> LogFailValidation[Log Upload: failed dengan detail baris] --> Error422_Rows[Kembalikan Error 422: Invalid data in row] --> End
    
    %% Transaction Persistence
    ValidateRows -- Semua Baris Valid --> DBTransaction[Mulai DB Transaction]
    DBTransaction --> SaveLoop[Loop: Simpan menggunakan `SensorData::updateOrCreate` \n Key Unik: device_id + datetime]
    SaveLoop --> Commit{Apakah semua baris berhasil ditulis?}
    Commit -- Gagal (Server Error) --> Rollback[Rollback DB Transaction] --> LogFailDB[Log Upload: failed] --> Error500[Kembalikan Error 500: Server Error] --> End
    Commit -- Sukses --> CommitDB[Commit DB Transaction]
    
    %% Success Response
    CommitDB --> LogSuccess[Log Upload: success]
    LogSuccess --> SuccessResponse[Kembalikan Status 200 OK: Data berhasil disimpan] --> End
```

---

## 📊 2. Alur Visualisasi Data Real-time & Dashboard (Client View Flow)

Visualisasi data pada dashboard frontend (menggunakan React + Leaflet Map) memiliki dua cara utama dalam memuat data: melalui **Inertia.js (Server-Side Rendered Props)** untuk halaman awal, atau **API Polling (JSON HTTP Client)** untuk pembaruan real-time.

```mermaid
flowchart TD
    Start([User Membuka Aplikasi]) --> AccessView{Halaman apa yang diakses?}
    
    %% Welcome Portal / Public Map Flow
    AccessView -- Welcome Portal / Maps (Publik) --> LoadPublicController[Panggil TelemetryController welcome/maps]
    LoadPublicController --> QueryLatest[Query Telemetry Sensor Terakhir untuk Semua Device]
    QueryLatest --> CalcCityAQI[Hitung rata-rata AQI Kota berdasarkan PM2.5]
    CalcCityAQI --> LoadAlerts[Query 5 Alert Aktif Terakhir]
    LoadAlerts --> LoadTrend[Query Data Tren 24 Jam Sudirman Tower A]
    LoadTrend --> RenderPublicReact[Kirim data via Inertia Props ke frontend React]
    
    %% Protected Dashboard Flow
    AccessView -- Private Dashboard (Perlu Login) --> CheckAuth{Apakah User Terautentikasi?}
    CheckAuth -- Belum Login --> RedirectLogin[Redirect ke Halaman Login]
    CheckAuth -- Sudah Login --> LoadPrivateController[Inisialisasi Data Dashboard]
    LoadPrivateController --> QueryMetrics[Query Jumlah Device & Alert Aktif]
    QueryMetrics --> QueryLatestTelemetry[Query Sensor Terbaru tiap Device]
    QueryLatestTelemetry --> RenderPrivateReact[Kirim data via Inertia ke React Page]
    
    %% Frontend Rendering & Polling
    RenderPublicReact & RenderPrivateReact --> ReactRender[React Merender Tampilan: \n - GIS Dark Map Leaflet \n - Sensor Metric Cards \n - Trend Charts Recharts]
    
    ReactRender --> InitPolling[Jalankan API Polling setiap 5 detik \n atau WebSocket Broadcast Listener]
    InitPolling --> FetchLatestAPI[Request HTTP GET ke `/api/dashboard/latest` & `/api/devices`]
    FetchLatestAPI --> CheckDeviceStatus{Apakah status device \n last_seen_at > 5 menit?}
    CheckDeviceStatus -- Ya --> UpdateOffline[Update status device menjadi 'offline' di DB]
    CheckDeviceStatus -- Tidak --> NoUpdate[Biarkan status tetap]
    
    UpdateOffline & NoUpdate --> ReturnJSON[Kembalikan data sensor & status terbaru]
    ReturnJSON --> UpdateReactState[Update State React & Render ulang component secara visual]
```

---

## ⚠️ 3. Alur Deteksi Dini & Manajemen Peringatan (Alert System Flow)

Sistem peringatan berfungsi mendeteksi anomali/polusi berlebih, memberi tahu petugas monitoring, dan melacak langkah penyelesaian (*resolution*).

```mermaid
flowchart TD
    Start([IoT Data Berhasil Disimpan]) --> CheckThreshold{Apakah nilai PM2.5, PM10, atau MQ-135 \n melebihi batas konfigurasi global?}
    
    %% Deteksi & Pembuatan Alert
    CheckThreshold -- Tidak --> End[Selesai]
    CheckThreshold -- Ya --> CheckExistingActive{Apakah alert aktif untuk parameter & device \n ini sudah ada?}
    
    CheckExistingActive -- Ya (Sudah Ada) --> End
    CheckExistingActive -- Tidak Ada --> CreateAlert[Buat Alert Baru status = 'active']
    CreateAlert --> Notify[Tampilkan Notifikasi Toast realtime \n di Frontend menggunakan Sonner]
    
    %% Acknowledge & Resolution Flow
    Notify --> OperatorAction{Tindakan Operator/Admin di Alert Panel}
    
    OperatorAction -- Acknowledge (Tandai Sedang Ditinjau) --> UpdateAck[Update Alert status = 'acknowledged']
    UpdateAck --> LogAck[Catat AuditLog: Alert Acknowledged oleh User] --> End
    
    OperatorAction -- Resolve (Tandai Selesai) --> RequestResolve[Kirim notes penyelesaian via Form]
    RequestResolve --> ValidateNotes{Validasi notes wajib diisi}
    ValidateNotes -- Gagal --> ShowValidation[Tampilkan error validasi] --> RequestResolve
    ValidateNotes -- Sukses --> UpdateResolve[Update Alert status = 'resolved', \n resolved_by = UserID, \n resolved_at = NOW, \n notes = InputUser]
    UpdateResolve --> LogResolve[Catat AuditLog: Alert Resolved oleh User] --> End
```

---

## 🔧 4. Alur Manajemen Perangkat & Kalibrasi (Device Management Flow)

Alur penambahan device baru, pembuatan API token autentikasi, serta kalibrasi sensor oleh Administrator.

```mermaid
flowchart TD
    Start([Admin mengakses /dashboard/admin/devices]) --> Action{Tindakan Admin}
    
    %% Registrasi Device Baru
    Action -- Registrasi Device Baru --> FormCreate[Isi form: device_code, nama, lat, lng, region, status]
    FormCreate --> ValidateCreate{Validasi input & keunikan device_code}
    ValidateCreate -- Gagal --> ShowErrorCreate[Tampilkan Error Form]
    ValidateCreate -- Sukses --> InsertDevice[Simpan Device Baru ke DB]
    InsertDevice --> LogCreate[Catat AuditLog: Register New IoT Sensor] --> SuccessMsg[Tampilkan Pesan Sukses]
    
    %% Generate Token
    Action -- Generate API Token --> TokenReq[Kirim request generate API Token]
    TokenReq --> GenToken[Buat random token 60 karakter]
    GenToken --> SaveToken[Simpan token di field api_token device]
    SaveToken --> LogToken[Catat AuditLog: Device Token Generated] --> SuccessMsg
    
    %% Kalibrasi Sensor
    Action -- Kalibrasi Sensor --> FormCalib[Kirim nilai `calibration_factor` \n Rentang: 0.1 s/d 5.0]
    FormCalib --> ValidateCalib{Validasi numerik & rentang}
    ValidateCalib -- Gagal --> ShowErrorCalib[Tampilkan Error Form]
    ValidateCalib -- Sukses --> SaveCalib[Update calibration_factor device]
    SaveCalib --> LogCalib[Catat AuditLog: Device Calibration adjusted] --> SuccessMsg
```

---

## 🛠️ 5. Alur Tiket Pemeliharaan Teknisi (Maintenance Ticket Flow)

Digunakan untuk mendistribusikan penugasan perbaikan atau kalibrasi fisik sensor di lapangan kepada teknisi.

```mermaid
flowchart TD
    Start([Kerusakan/Kebutuhan Kalibrasi Fisik]) --> CreateTicket[Admin/Operator Membuat Tiket Pemeliharaan]
    CreateTicket --> Assign[Assign ke Teknisi, Tentukan Device, Deskripsi, & Jadwal]
    Assign --> InitialStatus[Tiket berstatus 'pending']
    
    %% Technician view & process
    InitialStatus --> TechLogin[Teknisi Lapangan login & masuk panel /technician/tickets]
    TechLogin --> ActionTech{Tindakan Teknisi}
    
    ActionTech -- Mulai Pekerjaan --> UpdateInProgress[Update Tiket status = 'in_progress']
    UpdateInProgress --> RenderProgress[Status berubah di dashboard, \n menandakan teknisi sedang di lokasi]
    
    ActionTech -- Selesai Pekerjaan --> FormComplete[Kirim formulir penyelesaian tiket]
    FormComplete --> UpdateComplete[Update Tiket status = 'completed', \n completed_at = NOW]
    UpdateComplete --> LogComplete[Catat histori pemeliharaan device]
```

---

> [!NOTE]
> Seluruh aksi administrator (seperti konfigurasi, pengelolaan pengguna, backup database, update whitelisting IP, dan edit device) secara otomatis tercatat di tabel `audit_logs` demi alasan keamanan dan kepatuhan sistem (*compliance*).

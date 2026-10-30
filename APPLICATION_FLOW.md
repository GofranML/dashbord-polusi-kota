# 📊 Alur Aplikasi PolluTrack - Monitoring Kualitas Udara

## 📑 Daftar Isi
1. [Ringkasan Aplikasi](#ringkasan-aplikasi)
2. [Arsitektur Sistem](#arsitektur-sistem)
3. [Alur Data Umum](#alur-data-umum)
4. [Alur Fitur Utama](#alur-fitur-utama)
5. [Alur Berdasarkan Role Pengguna](#alur-berdasarkan-role-pengguna)
6. [Integrasi IoT & Sensor](#integrasi-iot--sensor)
7. [Sistem Alert & Notifikasi](#sistem-alert--notifikasi)
8. [Database & Model](#database--model)
9. [Alur Fuzzy Logic](#alur-fuzzy-logic)
10. [Keamanan & Autentikasi](#keamanan--autentikasi)

---

## 🎯 Ringkasan Aplikasi

**PolluTrack - Dashboard Monitoring Kualitas Udara Palembang** adalah platform pemantauan kualitas udara real-time berbasis web yang mengintegrasikan:
- Data sensor IoT dari 15+ lokasi strategis di Palembang
- Visualisasi GIS interaktif dengan dynamic clustering
- Sistem alert otomatis untuk deteksi dini pencemaran
- Manajemen user dengan role-based access control
- Analisis fuzzy logic untuk penentuan tingkat bahaya

**Stack Teknologi:**
- **Backend**: Laravel 13.7 + Inertia.js 3.0
- **Frontend**: React 19.2 + TypeScript 5.7
- **Database**: SQLite / MySQL
- **UI Framework**: Tailwind CSS 4.0
- **Maps**: React Leaflet 5.0 + OpenStreetMap
- **Grafik**: Recharts 3.8

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Browser)                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  React Components (TypeScript + Tailwind CSS)               │ │
│  │  - Dashboard                                                │ │
│  │  - Maps (Leaflet)                                          │ │
│  │  - Alerts Panel                                            │ │
│  │  - Device Management                                       │ │
│  │  - User Management                                         │ │
│  │  - Maintenance Tickets                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↕
        ┌──────────────────────────────────────────┐
        │   Inertia.js (SSR Framework)             │
        │   - Request/Response Handling            │
        │   - Props Management                     │
        └──────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER (Server)                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Laravel Routing & Middleware                               │ │
│  │  ┌─────────────────────────────────────────────────────┐   │ │
│  │  │  Web Routes (/routes/web.php)                       │   │ │
│  │  │  - Public: welcome, maps                            │   │ │
│  │  │  - Dashboard: telemetry, alerts, devices, users     │   │ │
│  │  │  - API Routes (/routes/api.php)                     │   │ │
│  │  │  - IoT: /api/iot/upload                             │   │ │
│  │  │  - Dashboard: /api/dashboard/*                      │   │ │
│  │  └─────────────────────────────────────────────────────┘   │ │
│  │                                                              │ │
│  │  ┌─────────────────────────────────────────────────────┐   │ │
│  │  │  Controllers                                         │   │ │
│  │  │  - TelemetryController        (Monitoring)          │   │ │
│  │  │  - AlertController            (Alerts)              │   │ │
│  │  │  - DeviceController           (Device Management)   │   │ │
│  │  │  - AdminController            (Admin Panel)         │   │ │
│  │  │  - TechnicianController       (Maintenance)         │   │ │
│  │  │  - Api/IotDataController      (IoT Upload)          │   │ │
│  │  │  - Api/DashboardController    (API Endpoints)       │   │ │
│  │  └─────────────────────────────────────────────────────┘   │ │
│  │                                                              │ │
│  │  ┌─────────────────────────────────────────────────────┐   │ │
│  │  │  Services                                            │   │ │
│  │  │  - FuzzyService               (Hazard Calculation)  │   │ │
│  │  └─────────────────────────────────────────────────────┘   │ │
│  │                                                              │ │
│  │  ┌─────────────────────────────────────────────────────┐   │ │
│  │  │  Models (Eloquent ORM)                               │   │ │
│  │  │  - User, Device, SensorData                          │   │ │
│  │  │  - Alert, MaintenanceTicket                          │   │ │
│  │  │  - TelemetryLog, AuditLog                            │   │ │
│  │  └─────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (SQLite/MySQL)                 │
│  - users, devices, sensor_data, alerts                          │
│  - maintenance_tickets, telemetry_logs, audit_logs              │
│  - upload_logs, telemetry_logs                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    IoT SENSOR LAYER (External)                   │
│  - 15+ Sensor Nodes di lokasi strategis Palembang               │
│  - Upload data via API /api/iot/upload                          │
│  - Parameters: PM2.5, PM10, PM1, Gas Index, etc.                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Alur Data Umum

### 1. **Alur Pengumpulan Data dari Sensor**

```
┌─────────────────────┐
│  IoT Sensor Device  │
│  (LoRa/GSM Module)  │
└──────────┬──────────┘
           │
           │ Collect sensor readings
           │ (PM2.5, PM10, Gas, etc.)
           ↓
┌──────────────────────────────┐
│  Sensor Data Accumulation    │
│  (Stored in SD Card)         │
└──────────┬───────────────────┘
           │
           │ Periodic upload (hourly/daily)
           │ POST /api/iot/upload
           ↓
┌──────────────────────────────────────────────┐
│  Backend API: IotDataController              │
│  - Validate device token                     │
│  - Parse JSON/File                           │
│  - Store to SensorData & TelemetryLog        │
└──────────┬───────────────────────────────────┘
           │
           │ Insert batch records
           │ via Eloquent ORM
           ↓
┌──────────────────────────────────────────────┐
│  Database: sensor_data, telemetry_logs       │
│  - Indexed by device_id & datetime           │
└──────────────────────────────────────────────┘
```

### 2. **Alur Penyajian Data ke Dashboard**

```
┌──────────────────────────────────────┐
│  User Akses Dashboard (/dashboard)   │
└──────────┬───────────────────────────┘
           │
           │ HTTP GET Request
           ↓
┌──────────────────────────────────────────────────────────┐
│  TelemetryController / Route Handler                     │
│  - Query latest SensorData per device                    │
│  - Load 24-hour trend data                               │
│  - Calculate fuzzy hazard scores                         │
│  - Fetch active alerts & users                           │
└──────────┬───────────────────────────────────────────────┘
           │
           │ Inertia::render('dashboard', [...props])
           ↓
┌────────────────────────────────────────────────────────────┐
│  React Component (dashboard.tsx)                           │
│  - Render telemetry table                                 │
│  - Display trend charts (Recharts)                        │
│  - Show alert badges                                      │
│  - Update UI with real-time data                          │
└──────────┬───────────────────────────────────────────────┘
           │
           │ Display to user
           ↓
┌──────────────────────────────────────┐
│  Browser / User Interface             │
└──────────────────────────────────────┘
```

---

## 🎯 Alur Fitur Utama

### **A. Fitur: Monitoring Telemetri Real-Time**

```
Step 1: User navigates to /dashboard (authenticated)
Step 2: TelemetryController retrieves:
        - All devices from Device table
        - Latest sensor data per device from SensorData
        - 24-hour historical data for trend chart
Step 3: FuzzyService calculates hazard level for each device
        - Input: PM2.5, Gas Index
        - Output: Hazard Score (0-100%), Label (Aman/Waspada/Bahaya)
Step 4: Props sent to React dashboard component
Step 5: React renders:
        - Device telemetry table with latest readings
        - Trend chart showing 24-hour PM2.5 trend
        - Color-coded status (green/yellow/red)
        - Active alerts count badge
Step 6: User can filter by device or time range (frontend)
```

### **B. Fitur: GIS Maps Interaktif**

```
Step 1: User navigates to /maps (public view)
Step 2: TelemetryController fetches:
        - All devices with latest sensor readings
        - 3-day historical sensor data
Step 3: React component initializes:
        - Leaflet map with standard OpenStreetMap tiles (no API key)
        - Dynamic clustering engine (Leaflet.markercluster)
Step 4: Render map with:
        - Clustered markers grouped by zoom level
        - Pulsing animation on marker icons
        - Color-coded based on fuzzy hazard index
Step 5: User interactions:
        - Click cluster → zoom in / show avg stats
        - Click marker → show popup with device details
        - Drag/pan map → clusters re-calculate
        - Zoom in/out → dynamic clustering adjusts
Step 6: Popup displays:
        - Device name, location, region
        - Latest PM2.5, PM10, Gas readings
        - Fuzzy hazard score & label
        - Chart showing 3-day trend
```

### **C. Fitur: Sistem Alert Otomatis**

```
Step 1: Sensor data uploaded to /api/iot/upload
Step 2: Backend processes:
        - Validate and store sensor readings in SensorData
        - Check if readings exceed thresholds
Step 3: If threshold exceeded:
        - Create new Alert record with status='active'
        - Store parameter, value, threshold, device_id
        - Log to AuditLog
Step 4: Alert displayed in:
        - Dashboard alerts panel
        - Alert list page (/dashboard/alerts)
        - Browser notification (Sonner toast)
Step 5: User actions on alert:
        - Acknowledge → status='acknowledged'
        - Resolve → status='resolved', record resolver & time
        - Update thresholds → modify alert parameters
Step 6: Alert history maintained in database
        - For compliance & audit trail
```

### **D. Fitur: Manajemen Device**

```
Step 1: Super Admin navigates to /dashboard/admin/devices
Step 2: DeviceController retrieves all devices
Step 3: Display device list with:
        - Device code, name, location (lat/lng)
        - Region, status (online/offline/calibrating)
        - Battery voltage, signal strength
        - Last seen timestamp
Step 4: Admin actions:
        a) Add Device:
           - Form submit with device details
           - POST to /dashboard/admin/devices
           - Create Device record
           - Generate unique device_code & calibration_factor
        b) Update Device:
           - Modify location, status, calibration factor
           - POST to /dashboard/admin/devices/{id}/update
        c) Delete Device:
           - DELETE /dashboard/admin/devices/{id}
           - Cascade delete related data
        d) Generate API Token:
           - POST /dashboard/admin/devices/{id}/token
           - Generate JWT/bearer token for device auth
           - Store in UploadLog for tracking
Step 5: Device added to monitoring system
        - Ready to receive & upload sensor data
```

### **E. Fitur: Manajemen User**

```
Step 1: Super Admin navigates to /dashboard/admin/users
Step 2: AdminController retrieves all users
Step 3: Display user list with:
        - Name, email, role, status (active/suspended)
        - Created date, last login
Step 4: Admin actions:
        a) Create User:
           - Form submit via CreateNewUser action
           - Validate name, email, password
           - Hash password using bcrypt
           - Create User record with role & preferences
        b) Update User:
           - Change role, status, preferences
           - POST to /dashboard/admin/users/{id}/update
        c) Suspend User:
           - Set status='suspended'
           - User cannot login via CheckUserStatus middleware
        d) Delete User:
           - DELETE /dashboard/admin/users/{id}
Step 5: Audit logged for compliance
        - Record admin action in AuditLog
```

### **F. Fitur: Maintenance Tickets**

```
Step 1: Technician navigates to /dashboard/technician/tickets
Step 2: TechnicianController retrieves tickets assigned to technician
Step 3: Display ticket list with:
        - Device, title, description
        - Status (pending/in_progress/completed)
        - Scheduled date & completion date
Step 4: Technician actions:
        a) Create Ticket:
           - Admin creates ticket for device
           - Assign to technician
           - Set scheduled maintenance date
        b) Update Status:
           - pending → in_progress (start work)
           - in_progress → completed (mark done)
           - POST to /dashboard/technician/tickets/{id}/update
        c) View Health Dashboard:
           - GET /dashboard/technician/health
           - See device battery levels, signal strength
           - Identify devices needing maintenance
Step 5: Ticket history tracked for auditing
```

### **G. Fitur: Export Data**

```
Step 1: User navigates to dashboard history
Step 2: User applies filters:
        - Date range (today, yesterday, specific date)
        - Device selection
        - Parameters (PM2.5, PM10, Gas)
Step 3: User clicks export button:
        - CSV export: /dashboard/export/csv
        - Excel export: /dashboard/export/excel
Step 4: Backend processes:
        - Query SensorData with filters
        - Format data into CSV/Excel rows
        - Generate file with headers & formatting
Step 5: File downloaded to user's computer
        - Can import to spreadsheet/analysis tools
```

---

## 👥 Alur Berdasarkan Role Pengguna

### **1. Super Admin**

```
┌─────────────────────────────────────────┐
│         Super Admin Workflow              │
└─────────────────────────────────────────┘

Login → Dashboard
  ├─ Telemetry Monitoring
  │  ├─ View all device readings
  │  ├─ Check alert status
  │  └─ Export data
  │
  ├─ Admin Panel
  │  ├─ User Management
  │  │  ├─ Create user
  │  │  ├─ Assign role (Super Admin / Petugas Monitoring / Viewer / Teknisi)
  │  │  ├─ Suspend/delete user
  │  │  └─ View audit logs
  │  │
  │  ├─ Device Management
  │  │  ├─ Register device
  │  │  ├─ Generate API token
  │  │  ├─ Update calibration
  │  │  ├─ View device health
  │  │  └─ Decommission device
  │  │
  │  ├─ Configuration
  │  │  ├─ Set alert thresholds
  │  │  ├─ Manage system settings
  │  │  └─ Configure fuzzy logic parameters
  │  │
  │  ├─ Security
  │  │  ├─ IP whitelist management
  │  │  ├─ API token rotation
  │  │  ├─ Database backup
  │  │  └─ Download backup file
  │  │
  │  └─ API Documentation
  │     └─ View API endpoints & usage
  │
  └─ Audit Logs
     ├─ User actions
     ├─ System changes
     └─ Alert management history
```

### **2. Petugas Monitoring (Operator)**

```
┌──────────────────────────────────────┐
│     Petugas Monitoring Workflow        │
└──────────────────────────────────────┘

Login → Dashboard
  ├─ Real-time Telemetry
  │  ├─ View all device readings
  │  ├─ Monitor trend charts
  │  └─ Export data
  │
  ├─ Alert Management
  │  ├─ View active alerts
  │  ├─ Acknowledge alert
  │  ├─ Resolve alert
  │  └─ Update threshold
  │
  ├─ Device Monitoring
  │  ├─ Check device status (online/offline)
  │  ├─ View device health metrics
  │  ├─ See last sync time
  │  └─ Monitor battery & signal
  │
  └─ Maps View
     ├─ See all sensors on map
     ├─ Click marker for details
     └─ View region statistics
```

### **3. Viewer / Operator (Read-Only)**

```
┌──────────────────────────────────┐
│    Viewer / Operator Workflow     │
└──────────────────────────────────┘

Login → Dashboard
  ├─ View Telemetry (Read-Only)
  │  ├─ See all device readings
  │  ├─ View trend charts
  │  └─ Export data
  │
  ├─ View Alerts (Read-Only)
  │  └─ See alert history & status
  │
  └─ Maps View (Read-Only)
     └─ See all sensors on map
```

### **4. Teknisi Lapangan (Field Technician)**

```
┌──────────────────────────────────┐
│   Teknisi Lapangan Workflow       │
└──────────────────────────────────┘

Login → Dashboard
  ├─ Maintenance Tickets
  │  ├─ View assigned tickets
  │  ├─ Update ticket status
  │  │  ├─ pending → in_progress
  │  │  └─ in_progress → completed
  │  ├─ Add maintenance notes
  │  └─ Record completion time
  │
  └─ Device Health Dashboard
     ├─ View device battery levels
     ├─ Check signal strength
     ├─ See offline devices
     ├─ Monitor calibration status
     └─ Identify devices needing service
```

---

## 📡 Integrasi IoT & Sensor

### **Alur Pengiriman Data dari Sensor**

```
┌──────────────────────────────────────────┐
│      IoT Sensor Device (LoRa/GSM)         │
│  - Model: MultiSensor v2                  │
│  - Components:                            │
│    • PM2.5 sensor (laser particle count)  │
│    • PM10 sensor (coarse dust)            │
│    • PM1 sensor (ultra-fine particles)    │
│    • MQ-135 sensor (gas index)            │
│    • BME680 sensor (temp, humidity, etc)  │
│    • GPS module (latitude/longitude)      │
│    • LoRa/GSM module (upload data)        │
│    • SD card (local storage)              │
│    • Li-Po battery (3.7V)                 │
└──────────┬───────────────────────────────┘
           │
           │ 1. Collect readings every 5 min
           │ 2. Aggregate & store to SD card
           │ 3. Every hour (or on interval):
           ↓
        ┌─────────────────────┐
        │  Data Upload Logic  │
        │  JSON format:       │
        │  {                  │
        │    device_name,     │
        │    total_data,      │
        │    sensor_data: []  │
        │  }                  │
        └────────┬────────────┘
                 │
         4. POST to /api/iot/upload
            Headers:
            - Authorization: Bearer DEVICE_TOKEN
            - Content-Type: application/json
                 │
                 ↓
        ┌───────────────────────────────────┐
        │  Backend: IotDataController       │
        ├───────────────────────────────────┤
        │  1. Validate device token         │
        │  2. Parse JSON payload            │
        │  3. Extract sensor_data array     │
        │  4. Batch insert to SensorData    │
        │  5. Log upload to UploadLog       │
        │  6. Return 200 OK response        │
        └────────┬────────────────────────┘
                 │
                 ↓
        ┌──────────────────────────────────┐
        │  Database Tables Updated:         │
        │  - sensor_data (latest readings) │
        │  - telemetry_logs (trending)     │
        │  - upload_logs (audit trail)     │
        └─────────────────────────────────┘
```

### **Data Format yang Diterima**

```json
{
  "device_name": "SC-N01v2",
  "total_data": 2,
  "sensor_data": [
    {
      "datetime": "2026-05-22 20:15:00",
      "pm25": 35.2,
      "pm10": 42.1,
      "pm1": 20.5,
      "gas_index": 410,
      "gps_lat": -2.9912,
      "gps_lng": 104.7479,
      "rain_status": "Cerah",
      "air_pressure": 1008.5,
      "temperature": 29.4,
      "humidity": 78.2,
      "battery_status": 87
    },
    {
      "datetime": "2026-05-22 20:20:00",
      "pm25": 36.1,
      "pm10": 43.2,
      "pm1": 21.0,
      "gas_index": 420,
      "gps_lat": -2.9912,
      "gps_lng": 104.7479,
      "rain_status": "Cerah",
      "air_pressure": 1008.4,
      "temperature": 29.2,
      "humidity": 79.1,
      "battery_status": 86
    }
  ]
}
```

---

## 🚨 Sistem Alert & Notifikasi

### **Alur Deteksi dan Pengiriman Alert**

```
┌────────────────────────────────┐
│  Sensor Data Received & Stored  │
│  (via /api/iot/upload)          │
└────────┬───────────────────────┘
         │
         ↓
┌────────────────────────────────────────┐
│  Check Against Alert Thresholds        │
│  (Admin configured in /dashboard/      │
│   admin/config)                        │
│                                        │
│  Standard thresholds:                  │
│  - PM2.5: 100 µg/m³ (Unhealthy)       │
│  - PM10: 150 µg/m³ (Unhealthy)        │
│  - Gas Index: 300 ppm (High)          │
└────────┬───────────────────────────────┘
         │
    ┌─ If Threshold Exceeded?
    │
    YES ↓
         │
┌────────────────────────────────────┐
│  Create Alert Record               │
│  - device_id: [device ID]          │
│  - parameter: "PM2.5" or "MQ-135" │
│  - value: [actual reading]         │
│  - threshold: [configured limit]   │
│  - status: "active"                │
│  - notes: [description]            │
│  - created_at: [timestamp]         │
└────────┬───────────────────────────┘
         │
         ↓
┌────────────────────────────────────┐
│  Log to AuditLog                   │
│  - Record alert creation           │
│  - For compliance tracking         │
└────────┬───────────────────────────┘
         │
         ↓
┌────────────────────────────────────┐
│  Display Alert to User             │
│                                    │
│  a) Alert Panel (/alerts)          │
│     - Shows active alerts          │
│     - Red/orange badge             │
│     - Device name & parameter      │
│     - Current value vs threshold   │
│                                    │
│  b) Dashboard Badge                │
│     - "Active Alerts: 3"           │
│     - Link to alert panel          │
│                                    │
│  c) Browser Notification           │
│     (Sonner Toast)                 │
│     - "⚠️ PM2.5 Alert: Device X"   │
│     - Auto-dismiss after 5 sec     │
└────────┬───────────────────────────┘
         │
         ↓
┌────────────────────────────────────┐
│  User Actions                      │
│                                    │
│  Option 1: Acknowledge             │
│  - POST /dashboard/alerts/{id}/ack │
│  - status: "acknowledged"          │
│  - acknowledged_by: [user_id]      │
│  - acknowledged_at: [timestamp]    │
│                                    │
│  Option 2: Resolve                 │
│  - POST /dashboard/alerts/{id}/... │
│  - status: "resolved"              │
│  - resolved_by: [user_id]          │
│  - resolved_at: [timestamp]        │
│  - Alert removed from active list  │
│                                    │
│  Option 3: Update Threshold        │
│  - POST /dashboard/alerts/...      │
│  - Modify parameter limit          │
│  - Changes apply globally          │
└────────────────────────────────────┘
```

### **Alert Status Lifecycle**

```
CREATE (status = "active")
   │
   ├─→ Operator acknowledges
   │      (status = "acknowledged")
   │         │
   │         └─→ Data improves, user resolves
   │              (status = "resolved")
   │                 │
   │                 └─→ [END - Archived]
   │
   └─→ Data improves automatically
      (status = "resolved" via auto-resolve)
         │
         └─→ [END - Archived]
```

---

## 💾 Database & Model

### **Database Schema Overview**

```
┌─────────────────┐
│      users      │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email (UNIQUE)  │
│ password        │
│ role            │  ← Super Admin, Petugas Monitoring,
│ status          │    Viewer/Operator, Teknisi Lapangan
│ preferences(JSON)│
│ created_at      │
│ updated_at      │
└─────────────────┘
        ↓
        
┌──────────────────────┐
│      devices         │
├──────────────────────┤
│ id (PK)              │
│ device_code (UNIQUE) │
│ name                 │
│ latitude             │
│ longitude            │
│ region               │
│ status               │  ← online, offline, calibrating
│ battery_voltage      │
│ signal_strength      │
│ calibration_factor   │
│ last_seen_at         │
│ created_at           │
│ updated_at           │
└──────────────────────┘
        ↓
        
┌──────────────────────────────┐
│      sensor_data             │
├──────────────────────────────┤
│ id (PK)                      │
│ device_id (FK)               │
│ datetime                     │
│ pm25                         │
│ pm10                         │
│ pm1                          │
│ gas_index (mq135)            │
│ gps_lat                      │
│ gps_lng                      │
│ rain_status                  │
│ air_pressure                 │
│ temperature                  │
│ humidity                     │
│ battery_status               │
│ created_at / updated_at      │
│ Indexes: device_id, datetime │
└──────────────────────────────┘
        ↓
        
┌──────────────────────────────┐
│      alerts                  │
├──────────────────────────────┤
│ id (PK)                      │
│ device_id (FK)               │
│ parameter (PM25, MQ135, etc) │
│ value                        │
│ threshold                    │
│ status                       │
│ resolved_by (FK users)       │
│ resolved_at                  │
│ notes                        │
│ created_at                   │
│ Indexes: status, device_id   │
└──────────────────────────────┘
        ↓
        
┌────────────────────────────────┐
│   maintenance_tickets          │
├────────────────────────────────┤
│ id (PK)                        │
│ device_id (FK)                 │
│ technician_id (FK users)       │
│ title                          │
│ description                    │
│ status (pending, in_prog, etc) │
│ scheduled_at                   │
│ completed_at                   │
│ created_at                     │
│ Indexes: technician_id, status │
└────────────────────────────────┘
        ↓
        
┌──────────────────────────┐
│    audit_logs            │
├──────────────────────────┤
│ id (PK)                  │
│ user_id (FK)             │
│ action                   │
│ description              │
│ ip_address               │
│ user_agent               │
│ created_at               │
│ Indexes: user_id, action │
└──────────────────────────┘

Additional Tables:
- telemetry_logs: Historical data snapshots
- upload_logs: IoT upload audit trail
- cache / jobs / failed_jobs: Laravel internals
```

### **Model Relationships**

```
User
├─ hasMany(Alerts, resolved_by)
├─ hasMany(MaintenanceTickets, technician_id)
└─ hasMany(AuditLogs)

Device
├─ hasMany(SensorData)
├─ hasMany(TelemetryLogs)
├─ hasMany(Alerts)
└─ hasMany(MaintenanceTickets)

SensorData
└─ belongsTo(Device)

Alert
├─ belongsTo(Device)
└─ belongsTo(User, resolved_by)

MaintenanceTicket
├─ belongsTo(Device)
└─ belongsTo(User, technician_id)

AuditLog
└─ belongsTo(User)
```

---

## 📊 Alur Fuzzy Logic

### **Proses Perhitungan Hazard Level**

```
┌────────────────────────────────────┐
│  Sensor Data Retrieved              │
│  - PM2.5: [value] µg/m³            │
│  - Gas Index (MQ-135): [value] ppm │
└────────┬─────────────────────────────┘
         │
         ↓
┌────────────────────────────────────────┐
│  FuzzyService::calculateHazard()        │
├────────────────────────────────────────┤
│  Step 1: Fuzzification                 │
│  ─────────────────────                 │
│                                        │
│  PM2.5 Membership Functions:           │
│  - good: trapezoid(0, 0, 12, 20)      │
│  - moderate: triangle(15, 30, 45)     │
│  - unhealthy: trapezoid(40, 55, 300)  │
│                                        │
│  MQ-135 Membership Functions:          │
│  - low: trapezoid(0, 0, 100, 200)     │
│  - medium: triangle(150, 250, 350)    │
│  - high: trapezoid(300, 400, 1000)    │
│                                        │
│  → Calculate membership degree         │
│    for input in each function          │
└────────┬─────────────────────────────────┘
         │
         ↓
┌────────────────────────────────────────┐
│  Step 2: Rule Evaluation (Mamdani FIS) │
│  ─────────────────────────────────────  │
│                                        │
│  Rule Matrix (3x3 = 9 rules):          │
│                                        │
│  ┌─────────┬────────┬────────┬────────┐
│  │ PM2.5 \ │ Low    │ Medium │ High   │
│  │ MQ-135  │        │        │        │
│  ├─────────┼────────┼────────┼────────┤
│  │Good     │Low Risk│Low Risk│Moderate│
│  │Moderate │Low Risk│Moderate│High    │
│  │Unhealthy│Moderate│High    │High    │
│  └─────────┴────────┴────────┴────────┘
│                                        │
│  For each rule:                        │
│  - Antecedent: MIN(membership_pm25,   │
│                    membership_mq135)  │
│  - Consequent: Apply rule output      │
│                                        │
│  Example:                              │
│  If PM2.5=good AND MQ135=low          │
│    → Then Hazard = Low Risk            │
│    → Strength = MIN(0.8, 0.9) = 0.8   │
└────────┬─────────────────────────────────┘
         │
         ↓
┌────────────────────────────────────────┐
│  Step 3: Defuzzification (Centroid)    │
│  ────────────────────────────────────  │
│                                        │
│  Output Membership Functions:          │
│  - Low Risk: trapezoid(0, 0, 25, 45)  │
│  - Moderate: triangle(35, 50, 65)     │
│  - High Risk: trapezoid(55, 75, 100)  │
│                                        │
│  Center of Gravity (COG) calculation:  │
│                                        │
│  Y_crisp = Σ(Y_i × µ(Y_i))            │
│           ───────────────            │
│            Σ µ(Y_i)                   │
│                                        │
│  Discretize output space Y from        │
│  0 to 100 with step = 2                │
│                                        │
│  For each Y value, find max            │
│  membership from all rules             │
│                                        │
│  Calculate weighted average            │
│  → Crisp output (0-100)                │
└────────┬─────────────────────────────────┘
         │
         ↓
┌────────────────────────────────────────┐
│  Step 4: Label Classification          │
│  ────────────────────────────────────  │
│                                        │
│  If score < 33.3%                      │
│    → Label = "Aman" (Safe)             │
│    → Color = Green (#10b981)           │
│                                        │
│  If 33.3% ≤ score < 66.6%              │
│    → Label = "Waspada" (Caution)       │
│    → Color = Yellow (#eab308)          │
│                                        │
│  If score ≥ 66.6%                      │
│    → Label = "Bahaya" (Danger)         │
│    → Color = Red (#ef4444)             │
└────────┬─────────────────────────────────┘
         │
         ↓
┌────────────────────────────────────────┐
│  Step 5: Return Result                 │
│  ────────────────────────────────────  │
│                                        │
│  [                                     │
│    'score' => 72.5,          (0-100)  │
│    'label' => 'Bahaya',                │
│    'color' => '#ef4444'                │
│  ]                                     │
│                                        │
│  → Displayed on UI:                    │
│    • Map marker color                  │
│    • Table cell badge                  │
│    • Alert popup                       │
│    • Dashboard card                    │
└────────────────────────────────────────┘
```

### **Contoh Perhitungan Konkret**

```
INPUT:
  PM2.5 = 32.0 µg/m³
  MQ-135 = 280 ppm

FUZZIFICATION:
  PM2.5 = 32.0:
    - good: 0.0 (outside range)
    - moderate: 0.45 (on triangle slope)
    - unhealthy: 0.15 (light membership)
  
  MQ-135 = 280:
    - low: 0.0 (outside range)
    - medium: 0.6 (on triangle peak area)
    - high: 0.0 (outside range)

RULE EVALUATION:
  Rule 1: If PM2.5=good AND MQ135=low → Low Risk
          Min(0.0, 0.0) = 0.0 → INACTIVE
  
  Rule 2: If PM2.5=good AND MQ135=medium → Low Risk
          Min(0.0, 0.6) = 0.0 → INACTIVE
  
  Rule 3: If PM2.5=good AND MQ135=high → Moderate
          Min(0.0, 0.0) = 0.0 → INACTIVE
  
  Rule 4: If PM2.5=moderate AND MQ135=low → Low Risk
          Min(0.45, 0.0) = 0.0 → INACTIVE
  
  Rule 5: If PM2.5=moderate AND MQ135=medium → Moderate
          Min(0.45, 0.6) = 0.45 → ACTIVE (Moderate)
  
  Rule 6: If PM2.5=moderate AND MQ135=high → High Risk
          Min(0.45, 0.0) = 0.0 → INACTIVE
  
  Rule 7: If PM2.5=unhealthy AND MQ135=low → Moderate
          Min(0.15, 0.0) = 0.0 → INACTIVE
  
  Rule 8: If PM2.5=unhealthy AND MQ135=medium → High Risk
          Min(0.15, 0.6) = 0.15 → ACTIVE (High)
  
  Rule 9: If PM2.5=unhealthy AND MQ135=high → High Risk
          Min(0.15, 0.0) = 0.0 → INACTIVE

ACTIVE RULES:
  Rule 5: 0.45 → Moderate Risk
  Rule 8: 0.15 → High Risk

DEFUZZIFICATION (Centroid):
  Output space Y: [0, 2, 4, 6, ..., 98, 100]
  
  For each Y, compute max(µ_ModerateRisk(Y), µ_HighRisk(Y))
  
  Sample calculations:
    Y=35: max(0.0, 0.4) = 0.4  (from High Risk)
    Y=50: max(0.45, 0.5) = 0.5
    Y=65: max(0.0, 0.45) = 0.45
    ...
  
  COG = Σ(Y × µ) / Σ(µ) ≈ 50.0

OUTPUT:
  Score: 50.0%
  Label: "Waspada" (Caution)
  Color: Yellow (#eab308)
```

---

## 🔐 Keamanan & Autentikasi

### **Alur Autentikasi Pengguna**

```
┌─────────────────────────────────────┐
│  User Visits Application             │
└──────────────┬──────────────────────┘
               │
               ├─ Authenticated?
               │
         NO ↓  │ YES
             │        ↓
    ┌────────────────┐  ┌──────────────────────┐
    │  Fortify Login │  │  Proceed to Route    │
    │  - Email       │  │  (middleware checked)│
    │  - Password    │  └──────────────────────┘
    │  - Remember    │
    └────────┬───────┘
             │
             ↓
    ┌────────────────────────┐
    │  Hash password & check  │
    │  against user record    │
    └────────┬───────────────┘
             │
             ├─ Valid credentials?
             │
        YES ↓  │ NO
          │        ↓ Redirect to login
          │
   ┌──────────────────────┐
   │  Set session cookie  │
   │  - Encrypted session │
   │  - user_id           │
   │  - Expiration        │
   └──────┬───────────────┘
          │
          ↓
   ┌──────────────────────┐
   │  Redirect to /dash   │
   └──────────────────────┘
```

### **Alur Proteksi Rute & Middleware**

```
┌─────────────────────────────────┐
│  Request to Protected Route      │
│  e.g. /dashboard/admin/users    │
└──────────┬──────────────────────┘
           │
           ↓
   ┌────────────────────────────────┐
   │  Middleware Stack              │
   │  (dari app.php config)         │
   │  1. web() - session, cookies   │
   │  2. auth - required login      │
   │  3. verified - email confirmed │
   │  4. HandleAppearance - theme   │
   │  5. HandleInertiaRequests      │
   │  6. CheckUserStatus            │
   └────────┬───────────────────────┘
            │
            ├─ Authenticated?
            │
       NO ↓  │ YES
         │        ↓
    Redirect to    │
    Login Page     │
                   ├─ Email verified?
                   │
              NO ↓  │ YES
                │        ↓
            Verify Email    │
            Page            ├─ User status
                            │   = 'active'?
                            │
                       NO ↓  │ YES
                         │        ↓
                    Suspend Page   │
                                   ├─ Check role-based
                                   │  authorization
                                   │
                                 Can access?
                                   │
                              YES ↓  │ NO
                                │        ↓
                      ┌──────────┴──────┐
                      │  Render Page    │
                      │  With Props     │
                      └─────────────────┘
```

### **IoT Device Authentication**

```
┌─────────────────────────────────────┐
│  IoT Device prepares sensor upload   │
└──────────┬──────────────────────────┘
           │
           ↓
   ┌───────────────────────────────────┐
   │  Create POST request to            │
   │  /api/iot/upload                   │
   │  - Headers:                        │
   │    Authorization: Bearer [TOKEN]   │
   │    Content-Type: application/json  │
   │  - Body: sensor data JSON          │
   └───────────┬───────────────────────┘
               │
               ↓
   ┌───────────────────────────────────┐
   │  Backend: IotDeviceAuth Middleware │
   │  (in api.php routes)               │
   │  - Extract Bearer token            │
   │  - Lookup Device.api_token         │
   │  - Verify token matches            │
   └───────────┬───────────────────────┘
               │
               ├─ Token valid?
               │
          NO ↓  │ YES
            │        ↓
        401           │
        Unauthorized  ├─ Within rate limit?
        Response      │  (throttle: 60/min)
                      │
                 NO ↓  │ YES
                   │        ↓
                429         │
                Too Many    ├─ Process upload
                Requests    │  (IotDataController)
                            │
                            ├─ Parse JSON
                            ├─ Validate format
                            ├─ Insert to DB
                            ├─ Log upload
                            │
                            ↓
                       200 OK Response
                       {success: true, ...}
```

### **API Token Management**

```
GENERATION:
  Admin → /dashboard/admin/devices/{id}/token
    ↓
  Backend generates:
    - Random token (Laravel Hash)
    - Store in Device.api_token
    - Log in UploadLog
    ↓
  Return token to admin (shown once only)

USAGE:
  Device → POST /api/iot/upload
    - Header: Authorization: Bearer [token]
    ↓
  Backend verifies token in UploadLog

ROTATION:
  Admin can regenerate token at any time
    ↓
  Old token invalidated
  New token issued

SECURITY:
  - Tokens stored hashed in database
  - Never logged in full form
  - Unique per device
  - Rotatable on demand
  - Expires optionally (if configured)
```

---

## 🔄 Alur Lifecycle Aplikasi

### **Startup & Initialization**

```
1. Laravel Bootstrap (bootstrap/app.php)
   - Load environment variables
   - Register service providers
   - Register middleware

2. Middleware Pipeline
   - Encryption/Decryption
   - Session handling
   - CSRF protection
   - Auth checks

3. Route Matching
   - Match incoming URL to route
   - Execute corresponding controller/closure

4. Inertia Page Rendering
   - Render React component
   - Pass server-side props
   - Return HTML + inline JSON

5. Client-side Hydration
   - React hydrates DOM
   - JavaScript event listeners attached
   - Real-time features ready

6. React Components Interactive
   - User can interact with UI
   - Form submissions
   - Navigation
   - Chart interactions
```

### **Real-Time Data Updates**

```
Option 1: Manual Refresh (Current Implementation)
  - User clicks refresh button
  - GET request to API endpoint
  - Backend queries latest data
  - React component re-renders

Option 2: Scheduled Polling (Future Enhancement)
  - JavaScript interval timer
  - Fetch latest data every N seconds
  - Update state automatically
  - Users see near real-time updates

Option 3: WebSocket (Advanced Feature)
  - Establish WebSocket connection
  - Server pushes data to client
  - No polling needed
  - True real-time with low latency
  - Requires Laravel Echo + Redis
```

---

## 📋 Checklist Navigasi Aplikasi

Berikut adalah ringkasan path/route untuk setiap fitur:

| Fitur | Route | Controller | Akses |
|-------|-------|-----------|-------|
| **Home/Welcome** | `/` | TelemetryController@welcome | Public |
| **Maps** | `/maps` | TelemetryController@maps | Public |
| **Dashboard Utama** | `/dashboard` | Route closure | Auth |
| **History Data** | `/dashboard/history` | TelemetryController@history | Auth |
| **Export CSV** | `/dashboard/export/csv` | TelemetryController@exportCsv | Auth |
| **Export Excel** | `/dashboard/export/excel` | TelemetryController@exportExcel | Auth |
| **Alert Panel** | `/dashboard/alerts` | AlertController@index | Auth |
| **Acknowledge Alert** | POST `/dashboard/alerts/{id}/ack` | AlertController@acknowledge | Auth |
| **Resolve Alert** | POST `/dashboard/alerts/{id}/resolve` | AlertController@resolve | Auth |
| **Update Thresholds** | POST `/dashboard/alerts/thresholds` | AlertController@updateThresholds | Admin |
| **Maintenance Tickets** | `/dashboard/technician/tickets` | TechnicianController@tickets | Tech |
| **Device Health** | `/dashboard/technician/health` | TechnicianController@health | Tech |
| **Manage Users** | `/dashboard/admin/users` | AdminController@users | Admin |
| **Manage Devices** | `/dashboard/admin/devices` | DeviceController@index | Admin |
| **System Config** | `/dashboard/admin/config` | AdminController@config | Admin |
| **Security** | `/dashboard/admin/security` | AdminController@security | Admin |
| **API Docs** | `/dashboard/admin/api-docs` | AdminController@apiDocs | Admin |
| **IoT Upload** | POST `/api/iot/upload` | IotDataController@upload | IoT |
| **API Dashboard** | GET `/api/dashboard/latest` | DashboardController@latest | Public API |

---

## 📚 Kesimpulan

Aplikasi PolluTrack adalah sistem komprehensif yang menggabungkan:

✅ **Data Collection** - Sensor IoT mengirim data ke backend via API
✅ **Processing** - Fuzzy logic menghitung tingkat bahaya
✅ **Visualization** - React UI menampilkan data real-time dengan peta interaktif
✅ **Alerting** - Sistem notifikasi otomatis saat threshold terlampaui
✅ **Management** - Admin panel untuk kelola user, device, config
✅ **Maintenance** - Ticketing system untuk teknisi lapangan
✅ **Security** - Authentication, authorization, audit logs
✅ **Reporting** - Export data untuk analisis lebih lanjut

Semua komponen terintegrasi dalam ekosistem Laravel-React yang modern dan scalable.

---

**Dokumentasi ini akan terus diperbarui seiring dengan perkembangan aplikasi.**

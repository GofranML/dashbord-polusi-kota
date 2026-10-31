# POLLUTRACK — Design System & Visual Specification
**Mobile Air Quality Intelligence Platform**
*Document Version: 1.0.0 — Established October 2026*

---

## 1. Product Identity & Core Mission

POLLUTRACK is an **Environmental Intelligence & Hyperlocal Geospatial Platform** designed specifically for **Mobile Air Quality Monitoring using IoT sensor nodes mounted on public transportation fleets** (buses, transit feeders, municipal vehicles).

### The Primary Differentiator
Unlike conventional static ambient monitoring stations (which only reflect conditions at a single stationary point on a rooftop or open park), POLLUTRACK captures **dynamic street-level exposure along real transit corridors**. As vehicles traverse urban arteries (currently deployed in Palembang, South Sumatra along major corridors such as Jl. Jendral Sudirman and Simpang Polda), sensors measure air quality directly where commuters, pedestrians, and motorists breathe.

```
[ Public Transit Fleet ]  --->  [ IoT Sensor Node ]  --->  [ Cellular / GPS Fix ]
    (Trans Musi / Feeder)          (PM2.5, PM10, Temp,        (4,345+ Breadcrumbs
                                    Humidity, Gas Index)       Palembang Corridors)
                                            |
                                            v
[ POLLUTRACK Public Dashboard ] <--- [ ISPU Compute Engine ]
  (Geospatial Corridor Map,          (Permen LHK No. 14/2020)
   Hyperlocal Telemetry, Insights)
```

---

## 2. Regulatory Air Quality Standard: ISPU (Permen LHK No. 14/2020)

### Strict Regulatory Enforcement: ISPU vs US AQI
To maintain scientific integrity and local regulatory compliance, POLLUTRACK adheres strictly to the **Indeks Standar Pencemar Udara (ISPU)** regulated by the **Kementerian Lingkungan Hidup dan Kehutanan Republik Indonesia (Permen LHK RI No. P.14/MENLHK/SETJEN/KUM.1/7/2020)**.

> [!CAUTION]
> **Zero US AQI Mixing:** US AQI categories (e.g. Orange "Unhealthy for Sensitive Groups", Purple "Very Unhealthy") must NEVER be mixed with ISPU. In ISPU:
> - **Category "Sedang" is BLUE (`#3B82F6`)**, NOT yellow!
> - **Category "Tidak Sehat" is YELLOW (`#EAB308`)**, NOT orange!
> - There are exactly **5 official categories**.

### Official ISPU Classification Table ($PM_{2.5}$ 24-Hour Equivalent)

| Rentang ISPU | Kategori Resmi | Warna Regulasi | Hex Token | Ambang Batas $PM_{2.5}$ | Karakteristik Kesehatan & Lingkungan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0 – 50** | **Baik** | Hijau | `#10B981` | $0.0 - 15.5\ \mu g/m^3$ | Kualitas udara sangat baik, tidak memberikan efek negatif terhadap manusia, hewan, dan tumbuhan. |
| **51 – 100** | **Sedang** | Biru | `#3B82F6` | $15.6 - 55.4\ \mu g/m^3$ | Kualitas udara masih dapat diterima pada kesehatan manusia, hewan, dan tumbuhan. |
| **101 – 200** | **Tidak Sehat** | Kuning | `#EAB308` | $55.5 - 150.4\ \mu g/m^3$ | Bersifat merugikan pada manusia, hewan, dan tumbuhan yang sensitif. |
| **201 – 300** | **Sangat Tidak Sehat** | Merah | `#EF4444` | $150.5 - 250.4\ \mu g/m^3$ | Kualitas udara dapat meningkatkan risiko kesehatan pada sejumlah segmen populasi. |
| **301+** | **Berbahaya** | Hitam / Gelap | `#7F1D1D` | $> 250.4\ \mu g/m^3$ | Kualitas udara berbahaya secara umum dan berpotensi menimbulkan dampak kesehatan serius. |

### Mathematical Formula for ISPU Calculation
$$I = \frac{I_a - I_b}{X_a - X_b} (X_x - X_b) + I_b$$

Where:
- $I$ = Calculated ISPU value
- $I_a$ = Upper limit ISPU index for the respective bracket
- $I_b$ = Lower limit ISPU index for the respective bracket
- $X_a$ = Upper limit ambient concentration breakpoint ($\mu g/m^3$)
- $X_b$ = Lower limit ambient concentration breakpoint ($\mu g/m^3$)
- $X_x$ = Real measured ambient concentration from sensor ($\mu g/m^3$)

---

## 3. Sensor Hardware Specifications & Data Integrity Rules

All metrics presented on POLLUTRACK must reflect actual physical hardware parameters and empirical telemetry data from the database.

### Hardware Sensor Mapping

| Parameter | Sensor Model | Fisika Pengukuran | Satuan Resmi | Aturan Representasi UI |
| :--- | :--- | :--- | :--- | :--- |
| **Particulate Matter 2.5** | Optical Laser Dust Sensor | Laser scattering light attenuation | $\mu g/m^3$ | Tampilkan angka eksak dengan 1 desimal. Kaitkan langsung ke kalkulasi ISPU. |
| **Particulate Matter 10** | Optical Laser Dust Sensor | Laser scattering light attenuation | $\mu g/m^3$ | Tampilkan nilai coarse dust riil dalam $\mu g/m^3$. |
| **Gas Sensitivity Index** | MQ-135 Gas Sensor | Semiconductor tin oxide ($SnO_2$) surface resistance ($R_s/R_0$) | Raw Relative Index (ADC 0–1023) | **JANGAN KLAIM VOC LAB.** Beri label jelas: *"Indeks Sensor Gas (MQ-135)"* dengan satuan *Relative Index*. Hindari klaim gas analitis spesifik tanpa ruang kalibrasi laboratorium. |
| **Suhu Udara (Ambient)** | Digital Thermistor (DHT22 / SHT) | Resistansi termal presisi | $^\circ C$ | Nilai riil ambient mikroklimat jalan raya. |
| **Kelembapan Relatif** | Capacitive Humidity Sensor | Dielektrik polimer higroskopis | $\% RH$ | Persentase kelembapan relatif riil ($0-100\% RH$). |
| **Posisi Geospatial** | GPS Receiver (NEO-6M / A9G) | NMEA satellite fix | Lat, Lng, Alt | Koordinat GPS riil Palembang (mis. `-2.9216, 104.7332`). Jangan gunakan dummy Jakarta. |

### Prohibited Data Visualizations (Anti-Slop Hardware Rule)
1. **NO "% Capacity" Progress Bars for Pollutants**: $PM_{2.5}$ of $32.4\ \mu g/m^3$ does not have a "capacity". Air is not a container with 100% capacity. Replace with ISPU category indicators.
2. **NO Fake Battery Percentages**: The microcontroller payload does not report a battery fuel gauge IC. Do not synthesize arbitrary battery icons or percentages.
3. **NO Fake Hardware Status**: Hardware state is strictly evaluated as `Aktif Mengirim Data` (telemetry received < 5 minutes ago) or `Tidak Aktif / Riwayat` (timestamp > 5 minutes ago).

---

## 4. Visual Direction: Environmental Intelligence & Geospatial Precision

### Design Philosophy
- **Aesthetic Stance**: *Scientific Precision meets Cartographic Elegance*.
- **Tone**: Authoritative, calm, objective, high-contrast, and deeply informative.
- **Surface Strategy**: Deep slate / obsidian dark foundation (`#0B0F17`) optimized for high-density geospatial maps, with an equally pristine editorial light mode (`#F8FAFC`).

### Color Palette & Token System

```
Primary Surface Hierarchy:
  --surface-ground:    #0B0F17 (Obsidian Deep Base - reduces eye strain during 24/7 monitoring)
  --surface-panel:     #111827 (Card / Container Matte Surface)
  --surface-subtle:    #1F2937 (Dividers, borders, subtle interactive surfaces)
  --surface-elevated:  #2D3748 (Flyouts, tooltips, high-priority modals)

Text & Contrast:
  --text-primary:      #F8FAFC (High-legibility headline & telemetry numbers - 14.5:1 contrast)
  --text-secondary:    #94A3B8 (Labels, metadata, technical descriptions - 7.2:1 contrast)
  --text-tertiary:     #64748B (Timestamps, sensor identifiers, footnotes - 4.6:1 contrast)

Brand & Transit Accents:
  --brand-cyan:        #06B6D4 (Telemetry Signal / IoT Stream / Transit Pulse)
  --brand-navy:        #1E3A8A (Public Transit Route Indicator)

ISPU Semantic Data Scale:
  --ispu-baik:         #10B981 (Green - Low emission / healthy)
  --ispu-sedang:       #3B82F6 (Blue - Official ISPU moderate)
  --ispu-tidaksehat:   #EAB308 (Yellow - Warning / unhealthy)
  --ispu-sangatspt:    #EF4444 (Red - Critical health alert)
  --ispu-berbahaya:    #7F1D1D (Dark Burgundy - Emergency hazardous)
```

### Typography Hierarchy
- **Primary Typeface**: `Instrument Sans` / system geometric sans-serif.
- **Tabular Figures**: Every numeric display (ISPU scores, $PM_{2.5}$, coordinates, timestamps) MUST enable tabular numerals (`font-feature-settings: 'tnum' 1; font-variant-numeric: tabular-nums;`). This prevents number twitching and layout jitter during live telemetry polling.
- **Scale Rules**:
  - Hero Telemetry Value: `text-5xl font-bold tracking-tight font-mono-tabular`
  - Section Headings: `text-xl font-semibold tracking-tight text-slate-100`
  - Technical Labels: `text-xs uppercase tracking-wider font-medium text-slate-400`
  - Metadata / Coordinates: `text-xs font-mono text-slate-400`

### Spatial & Layout Architecture
- **8px Grid Rhythm**: All margins, paddings, and component heights adhere to multiples of 4px/8px (`gap-2`, `gap-4`, `gap-6`, `p-6`).
- **Surface Depth**: Natural 1px matte borders (`border border-slate-800/80`) instead of heavy offset drop-shadows or noisy blur stacks.
- **Elevation Dose Cap**: Maximum 1 elevated floating card (the active vehicle inspection inspector) on top of the interactive Leaflet map canvas.

---

## 5. Brand Identity & Logo Specification: "The Transit Pulse Pin"

### Visual Concept
The POLLUTRACK brandmark fuses three fundamental elements into one vector geometry:
1. **Public Transit Trajectory (The Route Arc)**: Two dynamic, continuous curves representing the dedicated urban transit line traversed by the vehicle.
2. **Geospatial Pin (Hyperlocal Marker)**: The precise geographic point of measurement in the city.
3. **Telemetry Sensor Wave (The Pulse Rings)**: Concentric data wave rings radiating upward and outward from the sensor node, denoting continuous environmental telemetry broadcast.

```
       ((( * )))        <-- Real-time IoT Sensor Wave Emission
        /     \
       |   O   |        <-- Hyperlocal Geospatial Center (Lat, Lng)
        \     /
         \   /
          \ /           <-- Ground Probe Point (Street-level air intake)
      ===========       <-- Public Transit Corridor Lane (Mobile Route)
```

### Wordmark Typography
- **Spelling**: `POLLUTRACK` (All uppercase, bold geometric weight).
- **Sub-label**: `MOBILE AIR QUALITY INTELLIGENCE`.
- **Character Spacing**: Tracking `0.06em` on primary mark, `0.15em` on technical subtitle.

---

## 6. Anti-Slop Implementation Audit Checklist

Before releasing any interface code in POLLUTRACK, verify against these non-negotiable rules:
- [x] **No Generic Purple/Blue AI Gradients**: Backgrounds are solid, purposeful dark slate (`#0B0F17`) or crisp editorial white.
- [x] **No Stacked Glassmorphism**: Cards have solid, matte readable backgrounds (`#111827`) with sharp 1px borders (`#1E293B`).
- [x] **No Fake Statistics / Percentages**: No "% Capacity", no fake battery levels, no synthesized VOC numbers.
- [x] **Tabular Numerals Enforced**: All sensor values use tabular figures (`tabular-nums`).
- [x] **No Emoji Icons**: All iconography is sourced from Lucide SVG icons in consistent 1.5px or 2px stroke.
- [x] **Mobile Transit Prominence**: The hero and map unmistakably communicate *mobile vehicle sensing*, not static rooftop weather stations.

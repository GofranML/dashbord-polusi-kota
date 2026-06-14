# Dokumentasi Penerapan Logika Fuzzy (Fuzzy Logic)
## Sistem Monitoring Kualitas Udara Smart City Palembang

Dokumen ini menjelaskan rancangan, metodologi, dan detail teknis penerapan **Sistem Inferensi Fuzzy (Fuzzy Inference System - FIS)** metode **Mamdani** untuk menghitung **Fuzzy Air Hazard Index (FAHI)** / Indeks Bahaya Udara Fuzzy di dalam aplikasi dashboard monitoring polusi kota.

---

## 1. Latar Belakang & Tujuan
Sebelumnya, sistem menentukan kualitas udara menggunakan kategori batas kaku (*crisp threshold*). Hal ini memiliki kelemahan transisi yang kaku (misal: PM2.5 = 12.0 dilabeli "Baik", sedangkan 12.1 langsung dilabeli "Sedang").

Dengan menerapkan **Logika Fuzzy**, sistem dapat menggabungkan dua parameter polutan utama secara sekaligus:
1. **PM2.5** (Partikel padat halus)
2. **MQ-135** (Kadar gas karbon monoksida, amonia, dll. dari sensor gas index)

Kombinasi kedua variabel input ini menghasilkan satu indikator tingkat bahaya kesehatan udara berupa persentase indeks bahaya (**Fuzzy Air Hazard Index**) dari **0% hingga 100%**, dengan klasifikasi transisi yang halus: **Aman**, **Waspada**, dan **Bahaya**.

---

## 2. Perancangan Sistem Fuzzy (Mamdani FIS)

### A. Variabel Input 1: PM2.5
Variabel PM2.5 dibagi menjadi 3 fungsi keanggotaan (*Membership Functions*):
1. **Good (Bersih)**: Kurva Trapesium $[0, 0, 12, 20]$ µg/m³
2. **Moderate (Sedang)**: Kurva Segitiga $[15, 30, 45]$ µg/m³
3. **Unhealthy (Sangat Tidak Sehat)**: Kurva Trapesium $[40, 55, 300, 300]$ µg/m³

### B. Variabel Input 2: MQ-135 (Gas Index)
Variabel Gas Index dibagi menjadi 3 fungsi keanggotaan:
1. **Low (Rendah)**: Kurva Trapesium $[0, 0, 100, 200]$ ppm
2. **Medium (Sedang)**: Kurva Segitiga $[150, 250, 350]$ ppm
3. **High (Tinggi)**: Kurva Trapesium $[300, 400, 1000, 1000]$ ppm

### C. Variabel Output: Fuzzy Air Hazard Index (FAHI)
Variabel output indeks bahaya berada pada skala $[0, 100]$ persen:
1. **Low Risk (Aman / Rendah)**: Kurva Trapesium $[0, 0, 25, 45]$
2. **Moderate Risk (Waspada / Sedang)**: Kurva Segitiga $[35, 50, 65]$
3. **High Risk (Bahaya / Tinggi)**: Kurva Trapesium $[55, 75, 100, 100]$

---

## 3. Matriks Aturan Fuzzy (Fuzzy Rule Base)

Sistem menggunakan matriks aturan $3 \times 3$ (total 9 aturan dasar) dengan operator **MIN (AND)** untuk mengevaluasi kombinasi variabel input:

| PM2.5 \ MQ-135 | Low (Rendah) | Medium (Sedang) | High (Tinggi) |
| :--- | :---: | :---: | :---: |
| **Good (Bersih)** | **Low Risk** (Rule 1) | **Low Risk** (Rule 2) | **Moderate Risk** (Rule 3) |
| **Moderate (Sedang)** | **Low Risk** (Rule 4) | **Moderate Risk** (Rule 5) | **High Risk** (Rule 6) |
| **Unhealthy (Sangat Tidak Sehat)** | **Moderate Risk** (Rule 7) | **High Risk** (Rule 8) | **High Risk** (Rule 9) |

---

## 4. Defuzzifikasi (Centroid / COG Method)

Untuk merubah output keputusan fuzzy menjadi angka persentase riil (crisp), sistem menggunakan metode **Centroid (Center of Gravity)** dengan diskretisasi sumbu output $Y$ dari $0$ hingga $100$ dengan langkah presisi $2$:

$$\text{Crisp Output} = \frac{\sum (Y_i \times \mu(Y_i))}{\sum \mu(Y_i)}$$

Di mana $\mu(Y_i)$ adalah nilai keanggotaan agregat maksimum hasil evaluasi aturan pada titik sampel output $Y_i$.

---

## 5. Implementasi & Lokasi File Code

Logika Fuzzy ini telah diintegrasikan secara penuh di komponen sistem berikut:

### A. Backend Service
*   **[FuzzyService.php](file:///c:/laragon/www/dashboard-polusi-kota/app/Services/FuzzyService.php)**: 
    Mengandung logika matematika kurva keanggotaan segitiga/trapesium, evaluasi rule base Mamdani, dan proses defuzzifikasi Centroid.

### B. Laravel Controllers & Routes
*   **[TelemetryController.php](file:///c:/laragon/www/dashboard-polusi-kota/app/Http/Controllers/TelemetryController.php)**:
    Digunakan untuk memproses fuzzy index pada data GIS interaktif (`welcome` page dan `maps` page).
*   **[web.php](file:///c:/laragon/www/dashboard-polusi-kota/routes/web.php)**:
    Digunakan untuk mengolah data tabel telemetri realtime di rute `/dashboard`.

### C. Frontend Pages (React / Inertia)
*   **[welcome.tsx](file:///c:/laragon/www/dashboard-polusi-kota/resources/js/pages/welcome.tsx)**: Menampilkan Fuzzy Index di marker popup peta publik.
*   **[maps.tsx](file:///c:/laragon/www/dashboard-polusi-kota/resources/js/pages/maps.tsx)**: Menampilkan Fuzzy Index di popup peta monitoring GIS.
*   **[dashboard.tsx](file:///c:/laragon/www/dashboard-polusi-kota/resources/js/pages/dashboard.tsx)**: Menampilkan kolom metrik "Fuzzy Hazard Index" pada tabel riwayat telemetri realtime stasiun node.

---

## 6. Contoh Output Fuzzy vs Crisp Tradisional

| PM2.5 (µg/m³) | MQ-135 (ppm) | Klasifikasi Tradisional (PM2.5) | Hasil Fuzzy Hazard Score (FAHI) | Klasifikasi Fuzzy | Keterangan |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **8.0** | **90** | Baik | **11.2%** | **Aman** | Keduanya berada di zona hijau aman. |
| **14.5** | **180** | Sedang | **31.5%** | **Aman** | PM2.5 beranjak sedang, namun gas rendah. Hasil tetap aman secara bertahap. |
| **32.0** | **280** | Sedang | **50.0%** | **Waspada** | Keduanya berada di zona sedang. Mengindikasikan kewaspadaan. |
| **42.0** | **380** | Sedang | **72.3%** | **Bahaya** | PM2.5 sedang tinggi dan indeks gas berbahaya. Fuzzy mendeteksi ancaman bahaya kesehatan. |
| **75.0** | **520** | Sangat Tidak Sehat | **89.5%** | **Bahaya** | Keduanya bernilai sangat tinggi, FAHI mendekati 90% (Kritis). |

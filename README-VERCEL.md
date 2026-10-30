# Panduan Deploy ke Vercel (Laravel + Inertia React)

Proyek ini telah dikonfigurasi untuk dapat dideploy ke Vercel Serverless Function menggunakan runtime `vercel-php`.

---

## 1. File Konfigurasi yang Tersedia

- `vercel.json` : Konfigurasi fungsi serverless `api/index.php`, routing aset statis (`/build/*`), dan fallback routing Laravel.
- `api/index.php` : Serverless entrypoint yang menginisialisasi direktori cache & storage writable di `/tmp` Vercel.
- `.vercelignore` : Mengabaikan direktori lokal seperti `/vendor`, `/node_modules`, dan file environment lokal.
- `bootstrap/app.php` : Otomatis menggunakan `useStoragePath('/tmp/storage')` jika berjalan di environment Vercel.

---

## 2. Environment Variables yang Wajib Diisi di Vercel

Masuk ke **Project Settings** > **Environment Variables** di Vercel Dashboard, lalu tambahkan:

| Variable | Contoh Nilai | Keterangan |
| :--- | :--- | :--- |
| `APP_NAME` | `Dashboard Polusi Kota` | Nama aplikasi |
| `APP_ENV` | `production` | Environment mode |
| `APP_KEY` | `base64:EMIOpRkpB/rAOZqvNc0Ah91lNGEktPdKnY59B0s34KA=` | Kunci enkripsi Laravel |
| `APP_DEBUG` | `false` | Matikan debug di production |
| `APP_URL` | `https://<nama-proyek-anda>.vercel.app` | URL domain Vercel Anda |
| `DB_CONNECTION` | `mysql` | Driver database |
| `DB_HOST` | `b2m2qb17hzmngf6ztze6-mysql.services.clever-cloud.com` | Host database Clever Cloud |
| `DB_PORT` | `3306` | Port database MySQL |
| `DB_DATABASE` | `b2m2qb17hzmngf6ztze6` | Nama database di Clever Cloud |
| `DB_USERNAME` | `uf3r8zqdjhau4gth` | Username database |
| `DB_PASSWORD` | *(Password Clever Cloud Anda)* | Password database |
| `SESSION_DRIVER` | `cookie` | Disarankan `cookie` atau `database` |
| `CACHE_STORE` | `array` | Cache in-memory serverless |
| `QUEUE_CONNECTION`| `sync` | Driver antrean serverless |
| `VERCEL` | `1` | Flag environment Vercel |

---

## 3. Langkah Deploy via Vercel Dashboard / Git

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik **Add New...** > **Project**
3. Pilih repositori GitHub: `https://github.com/GofranML/dashbord-polusi-kota`
4. Di bagian **Build and Output Settings**:
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `public`
5. Masukkan **Environment Variables** di atas.
6. Klik **Deploy**.

---

## 4. Deploy via Vercel CLI (Alternatif)

Jika Anda menggunakan Vercel CLI di komputer lokal:

```bash
# Login ke akun Vercel
vercel login

# Deploy ke preview
vercel

# Deploy ke production
vercel --prod
```

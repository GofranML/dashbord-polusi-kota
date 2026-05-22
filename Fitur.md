Buatkan sistem API backend lengkap beserta dokumentasi API untuk dashboard monitoring IoT kualitas udara menggunakan Laravel.

Konsep utama:
- Device IoT mengirim FILE JSON langsung ke server
- File JSON berisi data sensor
- Server membaca file JSON lalu menyimpan data ke database
- API menggunakan REST API
- Format komunikasi JSON

Fitur API:
1. Upload file JSON dari device IoT
2. Ambil data terbaru
3. Ambil histori data sensor
4. Statistik dashboard
5. Monitoring status device
6. Status online/offline device

Format file JSON yang dikirim device IoT:

{
  "datetime": "2026-05-22 20:15:00",
  "device_name": "IOT-PALEMBANG-01",
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

Request upload:
- Method POST
- Content-Type: multipart/form-data
- File field name: sensor_file
- Format file: .json

Contoh request upload file JSON menggunakan cURL:

curl -X POST http://localhost:8000/api/iot/upload \
-H "Authorization: Bearer TOKEN_API" \
-F "sensor_file=@sensor-data.json"

Kebutuhan tambahan:
- Server harus memvalidasi file JSON
- Validasi struktur data sensor
- Validasi ukuran file
- Validasi device_name
- Simpan log upload file
- Simpan isi JSON ke database
- Jika JSON invalid tampilkan error
- Jika upload berhasil tampilkan response sukses

Format response API:

{
  "success": true,
  "message": "File JSON berhasil diproses",
  "data": {
    "device_name": "IOT-PALEMBANG-01",
    "datetime": "2026-05-22 20:15:00"
  }
}

Buatkan juga:
- Struktur database MySQL
- Migration Laravel
- Model Laravel
- Controller Laravel
- API Routes
- Middleware authentication
- Dokumentasi endpoint lengkap
- Contoh response error
- Contoh file JSON valid
- Contoh file JSON invalid
- Penjelasan alur upload device IoT ke server
- Penjelasan integrasi realtime dashboard
- Best practice keamanan API IoT
- Rate limiting API
- Monitoring device online/offline

Gunakan:
- Laravel terbaru
- MySQL
- Laravel API Resource
- Laravel Validation
- Clean code structure
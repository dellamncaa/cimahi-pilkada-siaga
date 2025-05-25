# 🗳️ WebGIS Pemantauan Pilkada Kota Cimahi 2024

**Sistem WebGIS Interaktif untuk Pemantauan Lapangan (Kebencanaan), Logistik, dan Quick Count Pilkada Kota Cimahi**

[WebGIS Pilkada Cimahi](https://your-screenshot-or-logo-url.com)

## 📌 Deskripsi Proyek

**WebGIS Pemantauan Pilkada Cimahi 2024** adalah aplikasi berbasis web yang dirancang untuk membantu proses pengawasan dan monitoring lapangan dalam kebencanaan pada pelaksanaan pilkada secara **real-time** di Kota Cimahi. Platform ini dirancang untuk berbagai pemangku kepentingan seperti petugas lapangan, penyelenggara pilkada, dan masyarakat umum.

Dengan mengintegrasikan teknologi pemetaan digital dan data spasial, aplikasi ini mencakup tiga fitur utama:

### 🔥 Fitur Utama

1. ### 🧭 **Pemantauan Lapangan (Kebencanaan)**
   - Menampilkan lokasi TPS rawan bencana berdasarkan data spasial
   - Update situasional lapangan dari petugas secara real-time
   - Alert Panel titik lokasi yang terdampak atau berisiko tinggi

2. ### 🚚 **Distribusi Logistik Pilkada**
   - Pelacakan status pengiriman logistik ke tiap TPS
   - Peta distribusi logistik: sudah diterima / belum terkirim

3. ### 🗳️ **Quick Voting (Hasil Suara Sementara)**
   - Visualisasi hasil suara sementara berdasarkan TPS
   - Statistik perolehan suara masing-masing pasangan calon

---

## 🌐 Teknologi yang Digunakan

- **Next.js** – Framework React untuk rendering dan API server
- **Firebase** – Backend (Authentication, Firestore, Storage)
- **Leaflet.js** – Pustaka peta interaktif
- **Turf.js** - Geospatial Analysis Library
- **TailwindCSS** – Styling cepat dan responsif
- **GeoJSON** – Format standar untuk data spasial
- **Chart.js / Recharts** – Visualisasi grafik hasil voting

---

## 🔐 Role Pengguna

- **Super Admin**: memantau semua aktivitas dan data masuk
- **Admin Input Lapangan**: menginput laporan kondisi TPS secara langsung
- **Publik**: melihat informasi kondisi terkini TPS, peta TPS dengan  

---

## 🚀 Cara Menjalankan Secara Lokal

```bash
# 1. Clone repositori ini
git clone https://github.com/dellamncaa/cimahi-pilkada-siaga.git
cd cimahi-pilkada-siaga

# 2. Install dependencies
npm install

# 3. Buat file .env.local
cp .env.example .env.local
# Masukkan konfigurasi database (Firebase)

# 4. Jalankan aplikasi
npm run dev

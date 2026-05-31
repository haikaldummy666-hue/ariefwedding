# Fitur Barcode & Check-in Undangan

Dokumentasi lengkap untuk fitur barcode dan sistem check-in kehadiran tamu pernikahan.

## 🎯 Daftar Fitur

### 1. **Generate Tamu dengan Barcode**
- Tambah tamu baru langsung dari admin panel
- Setiap tamu mendapat barcode unik (format CODE128)
- Setiap tamu mendapat QR Code untuk kemudahan scanning
- Download barcode dalam format gambar

### 2. **Scan Kehadiran**
- Halaman khusus untuk scan barcode/QR code tamu
- Real-time check-in dengan feedback visual
- Tampilan daftar tamu yang sudah check-in
- Pencegahan double check-in dalam satu hari

### 3. **Laporan Kehadiran**
- Dashboard statistik (total, hadir, tidak hadir, persentase)
- Filter: Semua, Hadir, Tidak Hadir
- Export ke CSV untuk analisis lebih lanjut
- Tampil waktu check-in detail

## 🚀 Cara Menggunakan

### Setup Awal

1. **Install Dependencies**
```bash
npm install
```

2. **Konfigurasi Supabase**
Pastikan file `.env.local` memiliki:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

3. **Jalankan Migration**
- Login ke Supabase Dashboard
- Buka SQL Editor
- Copy & jalankan script dari `supabase/migrations/20260531_add_guests_and_attendance.sql`

### Admin Panel Access

1. **Masuk ke Admin Panel**
   - Buka: `http://localhost:5173/?admin=secret`
   - Atau klik button "Admin Panel" di halaman utama

2. **Tab: Kelola Tamu**
   - Input nama tamu
   - Klik "Tambah Tamu"
   - Sistem otomatis generate barcode + QR code
   - Bisa download gambar barcode atau export daftar tamu sebagai CSV

3. **Tab: Generate Link Undangan**
   - Generate link personal untuk setiap tamu
   - Copy link atau message template untuk dikirim via WhatsApp

### Check-in Tamu

1. **Akses Halaman Check-in**
   - Dari admin panel klik "Scan Kehadiran"
   - Atau langsung ke: `http://localhost:5173/check-in?admin=secret`

2. **Scan Barcode**
   - Arahkan kamera ke barcode/QR code undangan
   - Sistem otomatis mendeteksi dan catat kehadiran
   - Tampil nama tamu dan waktu check-in
   - Notifikasi jika tamu sudah tercatat hadir

3. **Lihat Daftar Check-in**
   - Di sisi kanan layar, tampil 10 tamu terakhir yang check-in
   - Real-time update saat tamu baru check-in

### Laporan Kehadiran

1. **Akses Laporan**
   - Dari admin panel klik "Laporan Kehadiran"
   - Atau langsung ke: `http://localhost:5173/attendance-report?admin=secret`

2. **Analisis Data**
   - Lihat statistik: Total tamu, hadir, tidak hadir, persentase
   - Filter berdasarkan status kehadiran
   - Lihat detail waktu check-in

3. **Export Data**
   - Klik "Export CSV" untuk download dalam format Excel
   - CSV bisa langsung dibuka di Excel, Google Sheets, atau tools analisis lain

## 📊 Database Schema

### Tabel: `guests`
```sql
- id (UUID) - Primary Key
- name (TEXT) - Nama tamu
- barcode_id (TEXT UNIQUE) - ID barcode (8 karakter)
- barcode_data (TEXT) - Data format barcode (untuk QR code)
- status (TEXT) - invited, reminded, declined
- notes (TEXT) - Catatan tamu (VIP, keluarga dekat, dll)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Tabel: `attendance`
```sql
- id (UUID) - Primary Key
- guest_id (UUID FK) - Reference ke guests
- checked_in_at (TIMESTAMPTZ) - Waktu check-in
- created_at (TIMESTAMPTZ)
```

## 🔧 File Struktur

```
src/
├── components/wedding/
│   ├── BarcodeGenerator.tsx       # Komponen barcode & QR code display
│   ├── BarcodeScanner.tsx         # Komponen scanner kamera
│   ├── GuestGenerator.tsx         # Form generate tamu baru
│   └── CheckInPanel.tsx           # Panel check-in kehadiran
├── routes/
│   ├── index.tsx                  # Admin panel utama
│   ├── check-in.tsx               # Halaman check-in
│   └── attendance-report.tsx      # Halaman laporan
├── lib/
│   └── barcode-utils.ts           # Utility barcode dan format data
└── integrations/supabase/
    └── client.ts                  # Supabase client setup
```

## 🎨 Teknologi yang Digunakan

- **Barcode Generation**: `jsbarcode` - Untuk generate barcode CODE128
- **QR Code Generation**: `qrcode.react` - Untuk generate QR code
- **Barcode Scanning**: `html5-qrcode` - Untuk scan kamera real-time
- **Database**: Supabase PostgreSQL
- **Frontend**: React + TypeScript + TailwindCSS
- **Form**: React Hook Form + Zod

## 🔐 Security Notes

- Akses admin diproteksi dengan query parameter `?admin=secret`
- **PENTING**: Untuk production, implementasikan authentication yang lebih aman
- Database sudah enable RLS (Row Level Security)
- Simpan credentials Supabase di environment variables (tidak di hardcode)

## 📱 Kompatibilitas

- ✅ Desktop browsers (Chrome, Firefox, Safari)
- ✅ Mobile browsers dengan akses kamera
- ✅ Responsif untuk semua ukuran layar
- ⚠️  Perlu HTTPS atau localhost untuk akses kamera

## 🐛 Troubleshooting

### Kamera tidak bisa diakses
- Pastikan browser mendapat permission akses kamera
- Gunakan HTTPS atau localhost
- Cek apakah aplikasi lain sedang menggunakan kamera

### Barcode tidak terbaca
- Pastikan barcode/QR code cukup jelas dan tidak terlalu kecil
- Coba arahkan dari berbagai sudut
- Pastikan pencahayaan cukup

### Data tidak tersimpan
- Cek koneksi ke database Supabase
- Verifikasi environment variables sudah benar
- Lihat browser console untuk error message

## 📝 TODO / Future Enhancements

- [ ] Implementasi Google Sheets auto-export
- [ ] Barcode printing template untuk batch print
- [ ] SMS/Email notification saat tamu check-in
- [ ] Analytics dashboard yang lebih lengkap
- [ ] Multiple wedding support
- [ ] QR code custom branding
- [ ] Attendance verification approval flow

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di repository ini atau hubungi development team.

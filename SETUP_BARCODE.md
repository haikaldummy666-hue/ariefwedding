# Setup Step-by-Step Fitur Barcode

## 📋 Prerequisites

- Node.js 16+
- npm atau yarn
- Git
- Supabase account (gratis di https://supabase.com)

## 🔧 Instalasi

### Step 1: Clone & Install Dependencies
```bash
cd "f:\JOKI\BARUDAK NUSA PUTRA\BARUDAK TI\Arief Munandar\Arief"

npm install --legacy-peer-deps
# atau jika menggunakan yarn
yarn install
```

**Catatan:** 
- `.npmrc` file sudah dikonfigurasi untuk auto-use `legacy-peer-deps`
- Jika tidak bekerja, gunakan: `npm install --legacy-peer-deps`
- Ini karena `qrcode.react` library belum update support React 18, tapi package tetap berfungsi normal

### Step 2: Setup Supabase Project

1. **Buat Supabase Project** (atau gunakan yang sudah ada)
   - Buka https://app.supabase.com
   - Klik "New Project"
   - Isi project name, database password, region
   - Tunggu hingga selesai

2. **Dapatkan Credentials**
   - Di dashboard Supabase, klik project Anda
   - Ke bagian "Settings" → "API"
   - Copy:
     - `Project URL` (simpan sebagai VITE_SUPABASE_URL)
     - `anon public` key (simpan sebagai VITE_SUPABASE_PUBLISHABLE_KEY)

3. **Setup .env.local**
   ```bash
   # Copy .env.example ke .env.local
   cp .env.example .env.local
   
   # Edit .env.local dengan credentials dari step 2
   # VITE_SUPABASE_URL=https://xxxxxx.supabase.co
   # VITE_SUPABASE_PUBLISHABLE_KEY=xxxxx
   ```

### Step 3: Jalankan Database Migration

1. **Buka Supabase SQL Editor**
   - Di dashboard Supabase, klik "SQL Editor"
   - Klik "New Query"

2. **Copy & Jalankan Migration Script**
   - Buka file: `supabase/migrations/20260531_add_guests_and_attendance.sql`
   - Copy seluruh isi
   - Paste ke SQL editor Supabase
   - Klik "Run"
   - Tunggu hingga selesai (tidak ada error)

3. **Verifikasi Tables**
   - Di Supabase, ke "Table Editor"
   - Pastikan ada tabel: `guests` dan `attendance`

### Step 4: Jalankan Development Server

```bash
npm run dev
# atau
yarn dev
```

Server akan berjalan di `http://localhost:5173`

## 🎮 Test Fitur

### Test 1: Access Admin Panel
1. Buka browser: `http://localhost:5173/?admin=secret`
2. Seharusnya tampil admin dashboard dengan tab navigation

### Test 2: Generate Tamu Baru
1. Pastikan di tab "Kelola Tamu"
2. Input nama: "Test Guest 1"
3. Klik "Tambah Tamu"
4. Seharusnya:
   - Toast success message tampil
   - Barcode & QR code terbuat
   - Bisa download barcode image

### Test 3: Check-in Kehadiran
1. Klik button "Scan Kehadiran" dari admin panel
2. Atau buka: `http://localhost:5173/check-in?admin=secret`
3. Allow akses kamera saat browser minta
4. Tampil camera scanner
5. **Scan barcode** (gunakan QR code dari step Test 2):
   - Buka file barcode image di tab lain
   - Arahkan kamera ke barcode di screen
   - Seharusnya otomatis scan dan catat check-in

### Test 4: Laporan Kehadiran
1. Klik button "Laporan Kehadiran" dari admin panel
2. Atau buka: `http://localhost:5173/attendance-report?admin=secret`
3. Seharusnya tampil:
   - Statistik (total, hadir, tidak hadir, %)
   - Daftar semua tamu dengan status kehadiran
   - Tombol export CSV
4. Klik "Export CSV" untuk download data

## 🌐 Deploy ke Production

### Option 1: Deploy ke Vercel (Recommended)
```bash
# Push ke GitHub dulu
git add .
git commit -m "Add barcode feature"
git push

# Di Vercel dashboard
# - Connect GitHub repo
# - Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY)
# - Deploy
```

### Option 2: Deploy Manual
1. Build project:
   ```bash
   npm run build
   ```
2. Upload folder `dist` ke hosting (Netlify, AWS S3, etc)
3. Set environment variables di hosting platform

## 🔒 Security Setup untuk Production

⚠️ **PENTING**: Jangan gunakan `?admin=secret` di production!

Implementasi proper authentication:

```typescript
// Contoh: Gunakan Supabase Auth
import { supabase } from '@/integrations/supabase/client';

// Login
const { data } = await supabase.auth.signInWithPassword({
  email: 'admin@wedding.com',
  password: 'securePassword123'
});

// Check authentication
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  // Redirect ke login page
}
```

Atau integrasikan dengan:
- Google OAuth
- GitHub OAuth
- Supabase Magic Link
- Custom JWT

## 📱 Testing di Mobile

1. **Network Setup**
   - Pastikan PC dan Mobile di network yang sama
   - Cek IP address PC: `ipconfig` (Windows) atau `ifconfig` (Mac/Linux)

2. **Access dari Mobile**
   - Buka browser di mobile
   - Ketik: `http://[PC_IP_ADDRESS]:5173/?admin=secret`
   - Contoh: `http://192.168.1.100:5173/?admin=secret`

3. **Test Camera Scanner**
   - Buka halaman check-in di mobile
   - Kamera harus bisa aktif dan scanning

## 🐛 Troubleshooting

### Error: "Supabase URL is required"
**Solusi**: 
- Pastikan .env.local sudah benar
- Restart dev server (`Ctrl+C` lalu `npm run dev`)

### Error: "Database connection failed"
**Solusi**:
- Verifikasi credentials Supabase
- Cek apakah database migration sudah dijalankan
- Lihat Supabase dashboard untuk error logs

### Kamera tidak bisa diakses
**Solusi**:
- Pastikan browser permission untuk kamera sudah di-allow
- Gunakan HTTPS atau localhost (development)
- Coba browser lain
- Restart browser

### Barcode tidak terbaca
**Solusi**:
- Pastikan QR code/barcode image cukup besar dan jelas
- Pencahayaan cukup terang
- Arahkan dari sudut yang berbeda
- Coba QR code generator lain untuk test

## 📞 Support

Jika ada masalah:
1. Cek browser console (`F12` → Console tab)
2. Cek Supabase logs
3. Baca dokumentasi di `BARCODE_FEATURE_GUIDE.md`

## ✅ Checklist Sebelum Production

- [ ] Environment variables sudah ter-set dengan benar
- [ ] Database migration sudah dijalankan
- [ ] Test generate tamu baru
- [ ] Test scan barcode
- [ ] Test check-in dan laporan
- [ ] Export CSV berfungsi
- [ ] Mobile testing sukses
- [ ] Authentication implementation sudah diterapkan
- [ ] HTTPS sudah dikonfigurasi
- [ ] Database backup sudah diatur

---

Selamat! Setup sudah selesai. Silakan mulai menggunakan fitur barcode untuk undangan pernikahan Anda! 🎉

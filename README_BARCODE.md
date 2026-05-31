# 🎉 Fitur Barcode & Check-in untuk Undangan Pernikahan

Sistem barcode dan check-in kehadiran tamu untuk acara pernikahan telah berhasil diimplementasikan!

## 🚀 Quick Start (30 Detik)

### 1. Install Dependencies
```bash
npm install
```

**Note:** `.npmrc` sudah dikonfigurasi untuk handle peer dependencies automatic. Jika error, gunakan:
```bash
npm install --legacy-peer-deps
```

### 2. Setup Environment
```bash
# Copy template
cp .env.example .env.local

# Edit .env.local dengan credentials Supabase Anda:
# VITE_SUPABASE_URL=your_url
# VITE_SUPABASE_PUBLISHABLE_KEY=your_key
```

### 3. Setup Database
- Buka Supabase dashboard
- Buka "SQL Editor"
- Copy & jalankan script dari: `supabase/migrations/20260531_add_guests_and_attendance.sql`

### 4. Run Development Server
```bash
npm run dev
```

### 5. Access Admin Panel
Buka di browser: **`http://localhost:5173/?admin=secret`**

## ✨ 3 Fitur Utama

### 🎫 Generate Tamu dengan Barcode
1. Tab "Kelola Tamu"
2. Input nama tamu
3. Sistem otomatis generate barcode + QR code
4. Download atau print barcode

### 📱 Scan Kehadiran
1. Tab "Scan Kehadiran" atau `/check-in?admin=secret`
2. Arahkan kamera ke barcode/QR code
3. Otomatis catat kehadiran tamu
4. Tampil nama & waktu check-in

### 📊 Laporan Kehadiran
1. Tab "Laporan Kehadiran" atau `/attendance-report?admin=secret`
2. Lihat statistik (total, hadir, tidak hadir, %)
3. Filter & export ke CSV
4. Analisis data kehadiran

## 📋 Dokumentasi Lengkap

- **[SETUP_BARCODE.md](./SETUP_BARCODE.md)** - Step-by-step setup lengkap dengan troubleshooting
- **[BARCODE_FEATURE_GUIDE.md](./BARCODE_FEATURE_GUIDE.md)** - User guide & fitur detail
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Ringkasan teknis & architecture

## 🎯 Workflow Singkat

```
Admin Panel (http://localhost:5173/?admin=secret)
    ├─ Kelola Tamu
    │   ├─ Generate barcode unik per tamu
    │   ├─ Download barcode image
    │   └─ Export daftar CSV
    │
    ├─ Generate Link Undangan
    │   └─ Create shareable links
    │
    ├─ Scan Kehadiran (/check-in)
    │   ├─ Real-time camera scanning
    │   ├─ Auto record kehadiran
    │   └─ Lihat recent check-ins
    │
    └─ Laporan Kehadiran (/attendance-report)
        ├─ Statistik kehadiran
        ├─ Filter & search
        └─ Export CSV
```

## 🔧 Teknologi Digunakan

- **Frontend**: React + TypeScript + TailwindCSS
- **Barcode**: jsbarcode + qrcode.react
- **Scanner**: html5-qrcode (camera access)
- **Database**: Supabase PostgreSQL
- **Forms**: React Hook Form + Zod validation

## 📂 File Struktur Barcode Feature

```
src/
├── components/wedding/
│   ├── BarcodeGenerator.tsx       # Barcode & QR display
│   ├── BarcodeScanner.tsx         # Camera scanner
│   ├── GuestGenerator.tsx         # Generate tamu
│   └── CheckInPanel.tsx           # Check-in UI
├── routes/
│   ├── check-in.tsx               # Scanner page
│   └── attendance-report.tsx      # Report page
├── lib/
│   └── barcode-utils.ts           # Helper functions
└── integrations/supabase/
    └── client.ts                  # DB connection

supabase/migrations/
└── 20260531_add_guests_and_attendance.sql
```

## 🎮 Live Demo

### Testing Generate Tamu
1. Buka http://localhost:5173/?admin=secret
2. Tab "Kelola Tamu"
3. Input "John Doe"
4. Klik "Tambah Tamu"
5. ✅ Barcode otomatis terbuat

### Testing Check-in
1. Klik "Scan Kehadiran"
2. Allow camera access
3. Buka QR code dari step sebelumnya
4. Arahkan kamera ke QR code
5. ✅ Otomatis tercatat hadir

### Testing Report
1. Klik "Laporan Kehadiran"
2. Lihat statistik & data tamu
3. Klik "Export CSV"
4. ✅ File CSV download

## ⚙️ Admin Panel Buttons

| Button | Aksi | Warna |
|--------|------|-------|
| Kelola Tamu | Generate tamu & barcode | Sage |
| Generate Link | Create invitation links | Sage |
| Scan Kehadiran | Open scanner page | Green |
| Laporan Kehadiran | View attendance report | Blue |
| Keluar | Exit admin mode | Red |

## 🔒 Security

- Query parameter auth: `?admin=secret` (untuk development)
- **⚠️ PENTING**: Implementasikan authentication proper untuk production
- Database RLS sudah enable
- Environment variables di `.env.local`

**Production Setup:**
```typescript
// Implementasikan Supabase Auth, OAuth, atau custom JWT
// Hapus query parameter authentication
// Use database policies untuk authorization
```

## 🐛 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| "Can't access camera" | Check browser permissions, use HTTPS/localhost |
| "Supabase URL required" | Check .env.local, restart server |
| "Barcode not recognized" | Ensure image is clear, good lighting |
| "Data not saving" | Check database connection, env variables |

## 📱 Mobile Support

- ✅ Responsive UI (desktop, tablet, mobile)
- ✅ Camera access on mobile browsers
- ✅ Touch-friendly buttons

Access dari mobile:
```
http://[YOUR_PC_IP]:5173/?admin=secret
```

## 🚀 Next Steps

1. ✅ Jalankan `npm install`
2. ✅ Setup `.env.local` dengan Supabase credentials
3. ✅ Jalankan database migration
4. ✅ Run `npm run dev`
5. ✅ Akses `http://localhost:5173/?admin=secret`
6. ✅ Generate tamu & test scanner

## 💡 Pro Tips

- **Batch Generate**: Generate semua tamu sekaligus
- **Print Barcode**: Download semua barcode, print dalam satu batch
- **Mobile Scanner**: Gunakan mobile untuk scanner (built-in camera lebih mudah)
- **CSV Analysis**: Export CSV ke Excel untuk analisis lebih detail
- **Backup Data**: Supabase auto-backup, but export CSV untuk safety

## 📞 Support

Jika ada pertanyaan atau issue:
1. Baca documentation files terlebih dahulu
2. Check browser console untuk error messages
3. Verify Supabase connection & database

## 📚 Learn More

- [BARCODE_FEATURE_GUIDE.md](./BARCODE_FEATURE_GUIDE.md) - Complete feature guide
- [SETUP_BARCODE.md](./SETUP_BARCODE.md) - Detailed setup guide  
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical summary

---

## ✨ Features at a Glance

| Feature | Status | Notes |
|---------|--------|-------|
| Generate Tamu | ✅ | Barcode + QR code |
| Download Barcode | ✅ | PNG format |
| Scan Barcode | ✅ | Real-time camera |
| Check-in Record | ✅ | Auto database update |
| Prevent Duplicate | ✅ | 1 tamu/hari |
| Attendance Report | ✅ | Full analytics |
| Export CSV | ✅ | Excel-ready |
| Mobile Support | ✅ | Responsive |
| Supabase Integration | ✅ | PostgreSQL |
| Error Handling | ✅ | User-friendly |

---

🎊 **Selamat! Fitur barcode & check-in sudah ready untuk digunakan!**

Semoga membantu acara pernikahan Anda berjalan lancar dengan sistem check-in yang profesional.

**Pertanyaan? Baca dokumentasi lengkap atau hubungi development team.** 📞

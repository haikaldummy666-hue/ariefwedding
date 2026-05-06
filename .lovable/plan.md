# Undangan Pernikahan Digital — Arief & Galuh

Saya akan membangun undangan pernikahan digital yang elegan, romantis, dan 100% interaktif sesuai PDF yang Anda lampirkan. Karena project ini menggunakan stack React (TanStack Start) — bukan HTML statis — saya akan implementasikan dengan React + Tailwind CSS, lalu kasih panduan ekspor / hosting di akhir. Hasil akhirnya tetap sebuah web yang bisa di-deploy ke Netlify/Vercel/Lovable Publish.

## Aset dari PDF
Saya sudah ekstrak semua foto, ilustrasi bunga, amplop, wax seal "GA", polaroid couple, foto pre-wedding, foto gedung, dan elemen dekoratif lainnya dari PDF. Semua akan disalin ke `src/assets/wedding/` dan dipakai persis sesuai posisinya di PDF.

## Palet & Tipografi (match PDF)
- Warna: cream `#F5F0E8`, sage `#A8B5A2`, blush, gold accent, putih
- Font script untuk nama: **Great Vibes** / **Allura** (Google Fonts)
- Font judul serif: **Cormorant Garamond**
- Font body sans-serif: **Jost** / **Inter**
- Background: floral pattern halus + gradient lembut

## Struktur Halaman (Flow sesuai PDF)

**1. Cover "A LOVE LETTER" (Landing)**
- Layar penuh, judul "A LOVE LETTER", nama "Arief & Galuh" script besar
- Amplop besar dengan lace + wax seal emas "GA" + bunga kiri/kanan
- Teks "KETUK AMPLOP UNTUK MEMBUKA UNDANGAN"
- Animasi: amplop floating naik-turun lembut
- Klik amplop → animasi 3D flap terbuka (CSS transform), foto couple keluar, petal/confetti bunga jatuh, transisi smooth ke konten utama
- Musik latar mulai otomatis (dengan tombol play/pause floating)
- Opsional password gate (`06062026`)

**2. Header Navigasi (sticky setelah cover)**
- Logo kecil "Arief & Galuh" + menu: Home · Our Story · Details · RSVP · Gift · Gallery
- Mobile: hamburger menu

**3. Welcome + Music Player**
- Teks sambutan persis PDF
- Music player card dengan tombol play/pause + judul "Lagu Kami"

**4. Our Story**
- Layout 2 kolom: foto polaroid (fade-in + slight rotate) + narasi "Kisah Kami…" persis PDF (Nusaputra University, dst.)

**5. Profil Pasangan (Arief & Galuh)**
- Dua kartu foto bersebelahan
  - Rifki Arief Munandar — Putra Bpk Asep Munandar & Ibu Yuti Martina
  - Galuh Ratna Putri — Putri Bpk Oman Sumantri & Ibu Rita Hermawati
- Hover/tap → zoom + heart float animation

**6. Save The Date — Kalender Juni 2026**
- Kalender dengan tanggal **6** di-highlight emas
- Tombol "ADD TO CALENDAR" → generate `.ics` otomatis

**7. Akad & Resepsi (2 card)**
- Akad: Taman Sari Hotel & Resort, 08.00–10.00 WIB
- Resepsi: Taman Sari Hotel & Resort, 11.00–14.00 WIB
- Foto gedung + tombol "VIEW LOCATION" → Google Maps (Taman Sari Hotel & Resort Sukabumi)

**8. Dresscode & Color Palette**
- 5 swatch warna (sage, light blue, lavender, pink, beige) + ilustrasi bouquet

**9. RSVP / Buku Tamu**
- Form: Nama, Pesan, Attending / Not Attending → Submit
- Akan disimpan di Lovable Cloud (database otomatis), tampil real-time di guestbook wall (kartu pesan dengan timestamp + status hadir, animasi muncul)
- Catatan: opsi Google Form/Firebase tidak relevan di stack ini — Lovable Cloud sudah jadi default backend

**10. Wedding Gift**
- Teks ucapan terima kasih persis PDF
- Card rekening **BCA 038 272 0367 a.n Galuh Ratna Putri** + tombol "Copy" (toast "Berhasil disalin!")
- Placeholder e-wallet (GoPay, OVO, Dana, ShopeePay) — kosong, mudah diisi nanti

**11. Countdown Timer "Our Big Day Awaits"**
- Real-time countdown ke 6 Juni 2026, 08.00 WIB
- 4 flip-card: DAYS · HOURS · MINUTES · SECONDS

**12. Photo Gallery**
- Grid masonry foto pre-wedding dari PDF
- Klik → lightbox fullscreen dengan swipe + caption

**13. Footer**
- "SEE YOU ON June 6TH" + nama script "Arief & Galuh"
- Tombol Share WhatsApp & salin link
- Link "KLIK DISINI UNTUK DETAIL LEBIH LANJUT" (scroll ke detail)

## Fitur Teknis
- Animasi: Framer Motion (scroll reveal, fade, scale, parallax halus) + petal-fall canvas ringan (toggle on/off)
- Loading progress bar elegan saat pertama buka
- Mobile-first, touch-friendly, lazy-load gambar
- Meta tag OG/Twitter card untuk preview WhatsApp share
- SEO friendly (title, description, structured data)
- Analytics simple: counter buka undangan tersimpan di Lovable Cloud
- Password protection opsional (`06062026`) — toggleable

## Yang TIDAK saya lakukan (perlu konfirmasi/manual)
- **Audio "Lagu Kami"**: saya akan pakai placeholder silent track. Anda upload file MP3 sendiri ke chat, lalu saya pasang.
- **PWA full**: di environment Lovable preview (iframe), service worker bermasalah. Saya akan kasih `manifest.json` + ikon supaya tetap installable di mobile (Add to Home Screen) — tanpa offline cache. Ini sudah cukup untuk undangan.
- **Foto tambahan** di luar PDF: hanya pakai yang ada di PDF (sesuai permintaan "100% sesuai PDF").

## Detail Teknis (untuk referensi)
- Routes: `/` (cover + scroll all sections), tetap pakai TanStack Start file routing
- State: `useState` untuk envelope-opened, music-playing, lightbox
- Backend: Lovable Cloud (auto Supabase) — tabel `rsvps` (name, message, attending, created_at) dan `analytics_visits`
- Komponen di `src/components/wedding/*`: `EnvelopeCover`, `Nav`, `Welcome`, `OurStory`, `Couple`, `Calendar`, `EventCard`, `Dresscode`, `RSVPForm`, `Guestbook`, `Gift`, `Countdown`, `Gallery`, `Footer`, `MusicPlayer`, `PetalFall`
- Aset disalin dari PDF ke `src/assets/wedding/`
- Tailwind theme di `src/styles.css` ditambah: `--color-cream`, `--color-sage`, `--color-blush`, `--color-gold`

## Setelah Implementasi
Saya akan kasih panduan singkat:
1. **Lovable Publish** (1 klik, cara termudah) — instan dapat URL `*.lovable.app` + bisa custom domain
2. **Export ke Netlify/Vercel** — clone repo, `bun install`, `bun run build`, deploy folder build
3. Cara ganti foto, teks, lagu, link Maps, password — di file mana

Setuju lanjut? Setelah Anda approve, saya bangun semuanya sekaligus.
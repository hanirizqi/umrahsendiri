# Serah Terima

Berkas ini untuk sesi kerja baru — manusia maupun AI — yang belum punya konteks
percakapan sebelumnya. Isinya hanya hal yang **tidak bisa disimpulkan dari kode
atau git log**: keputusan, alasannya, dan jebakan yang sudah pernah menggigit.

Terakhir diperbarui: 9 Agustus 2026.

## Baca berurutan

1. `CLAUDE.md` — identitas, prinsip, dan aturan menulis kode di proyek ini
2. Berkas ini — keadaan sekarang dan jebakannya
3. `docs/product.md` — lini produk dan positioning yang berlaku
4. `docs/PRICING.md` — harga publik terkini
5. `docs/GLOSSARY.md` — istilah wajib (Umrah bukan Umroh, Jemaah bukan Jamaah)
6. `README.md` — cara menjalankan, struktur, sitemap
7. `docs/DEPLOYMENT.md` — environment variable, 503, rotasi kata sandi, restore

Tidak ada berkas roadmap atau backlog. Keduanya pernah ada tapi isinya rencana
dari positioning lama — Itinerary Builder, Packing Checklist, Budget Planner —
dan dihapus 9 Agustus 2026 karena lebih menyesatkan daripada berguna. Kalau
butuh melihatnya: `git show 8d5caa2:docs/ROADMAP.md`. Pekerjaan yang berlaku ada
di bagian "Pekerjaan terbuka" di bawah.

## Keadaan sekarang

**Operasional bisnis belum dimulai.** Belum ada jemaah sungguhan, belum ada lead
asli, Google Ads belum menyala. Seluruh data uji coba sudah dihapus lewat migrasi
`0005`. Ini mengubah prioritas: pekerjaan yang menyangkut ketepatan pelacakan
iklan lebih mendesak daripada kapasitas melayani.

Yang sudah berjalan di produksi:

- Situs publik berbahasa Indonesia dengan URL bahasa Inggris, 301 dari URL lama
- Form kontak menyimpan lead lengkap dengan atribusi iklan sejak kunjungan pertama
- Panel admin `/admin`: Leads, Contacts, LPP Rates, Price Calculator
- Pembuatan penawaran, halaman siap cetak, tautan publik `/q/[token]`
- Google Ads + GA4 (`G-PH99JXKHC9`) pada satu gtag.js

## Siapa mengerjakan apa

- **Hani** — pemilik dan satu-satunya pengembang. Programmer, jadi urusan kode
  bisa dibahas langsung; urusan infrastruktur perlu dijelaskan konkret (di mana
  perintah dijalankan, apa yang akan terlihat sesudahnya).
- **Tim lain** — memegang akun Google Ads `AW-18371371265`. Permintaan ke sana
  harus lewat brief tertulis yang berdiri sendiri, lalu ditunggu.

## Pekerjaan terbuka, urut prioritas

1. **Menunggu label conversion action kedua dari tim ads** untuk klik WhatsApp.
   Sesudah terpasang di `app/constants/analytics.ts`, uji jalur konversi ujung ke
   ujung di produksi — **sebelum** iklan dinyalakan.
2. **Backup Postgres offsite ke S3, lalu sekali uji restore.** Baca dulu bagian
   restore di `docs/DEPLOYMENT.md`; urutannya penting.
3. **Form kontak publik belum membaca katalog layanan dari database.** Daftar
   pilihannya masih ditulis langsung di `ContactForm.vue`. Layanan baru bisa
   ditarifkan lewat panel tapi belum bisa dipilih jemaah.
4. **AI customer service — ditunda.** Alasannya di bawah.

## Jebakan yang sudah pernah menggigit

**Menyimpan environment variable di Coolify tidak me-restart container.** Nilai
baru baru terbaca setelah proses start ulang, dan pemicunya adalah push ke
`main`. Sampai itu terjadi, kata sandi lama masih berfungsi.

**Deploy makan waktu 15 menit paling cepat.** Produksi yang masih menyajikan
build lama 20–30 menit setelah push itu normal. Jangan menekan Redeploy — itu
justru membatalkan auto-deploy yang sedang berjalan dari webhook.

**Migrasi penghapus data bisa berjalan ulang pada database hasil restore.**
Drizzle menyimpan catatan migrasi di dalam database, jadi ikut terbawa backup.
Backup yang lebih tua dari migrasi `0003`/`0005` tidak memuat catatannya. Kueri
pemeriksaannya ada di `docs/DEPLOYMENT.md`.

**`server/database/seed.ts` bukan lagi sumber kebenaran tarif.** Mengubah angka di sana lalu
deploy tidak akan mengubah apa pun — panel admin yang memegangnya. Penyemaian
hanya membekali periode yang belum punya tarif sama sekali.

**Okupansi 1–4 artinya jumlah jemaah, bukan penghuni kamar.** Untuk hotel
kebetulan keduanya (`4.350.000 ÷ 2 = 2.175.000` tepat), tapi untuk Paket Dasar
sama sekali bukan (`7.350.000 × 2 ≠ 11.500.000` — itu biaya yang ditanggung
bersama). Jangan menyebut kolom itu "kamar" secara umum.

**Nomor HP harus dinormalkan sebelum dibandingkan.** `0812…`, `+62 812-…`, dan
`62812…` adalah orang yang sama. Semua perbandingan lewat `normalizePhone()`.

**Nomor dokumen tidak boleh diturunkan dari `count(*)`.** Kolomnya UNIQUE dan
jumlah baris bisa berkurang; satu baris terhapus permanen membuat nomor
berikutnya bertabrakan dan penyimpanan gagal total. Pakai `document_counters`.

## Keputusan yang jangan diputar balik tanpa alasan baru

**Positioning.** UmrahSendiri menjual layanan umrah mandiri satu pintu — hotel,
visa & dokumen, transportasi, pembimbing — dipilih sendiri oleh jemaah. **Bukan**
biro travel, **tidak** menjual paket rombongan. Positioning ini sempat berubah
tiga kali dan baru stabil belakangan. Jangan menghidupkan lagi klaim lama seperti
"menyusun itinerary", "pendampingan", atau "checklist" — layanan itu tidak ada.

**Klik WhatsApp tidak dilaporkan ke Google Ads.** Sengaja, sampai conversion
action-nya sendiri dibuat. Akun ini belum punya riwayat konversi, dan fase
belajar Google terbentuk dari sinyal paling awal: satu action yang mencampur
"klik tombol" dengan "lead lengkap tersimpan" mengajari Google mengejar yang
termurah didapat. GA4 tetap mencatat setiap klik lewat `whatsapp_click`.

**Lead dari orang yang sama tidak digabung jadi satu baris.** Tiap pengiriman
form membawa atribusi iklannya sendiri; menggabungkannya akan menghapus jejak
kampanye yang kedua. Yang disatukan adalah orangnya, lewat tabel `contacts`.

**Penawaran yang sudah terkirim tidak pernah dipakai ulang.** Begitu tautannya
sampai ke jemaah, penawaran itu jadi catatan tentang apa yang pernah dijanjikan.

**AI customer service ditunda.** Belum ada percakapan sungguhan, jadi membangunnya
sekarang berarti mengotomatiskan tebakan. Prasyarat sebelum dibuka lagi: layar
tarif sudah dipakai beberapa periode, dan puluhan percakapan nyata sudah tercatat.
Bentuk pertama yang disarankan adalah penyusun draf balasan yang ditinjau manusia,
bukan bot yang menjawab jemaah sendiri.

## Cara kerja yang diharapkan

- Tunjukkan hasilnya di localhost dulu, jangan langsung menawarkan commit
- Verifikasi sendiri — jalur pengguna sungguhan, `npm run typecheck`, `npm run build`
- Seluruh `/admin/**` di balik login. Minta Hani masuk di awal sesi kalau
  pekerjaannya menyentuh panel; tanpa itu tidak ada layar admin yang bisa diperiksa
- Kerjakan semuanya di sesi yang sedang berjalan — jangan mengalihkan ke sesi lain
- Kritik rencana yang keliru. Hani beberapa kali mengubah arah setelah ditolak,
  dan koreksinya terhadap asumsi yang salah biasanya benar

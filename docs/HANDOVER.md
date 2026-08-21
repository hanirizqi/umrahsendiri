# Serah Terima

Berkas ini untuk sesi kerja baru — manusia maupun AI — yang belum punya konteks
percakapan sebelumnya. Isinya hanya hal yang **tidak bisa disimpulkan dari kode
atau git log**: keputusan, alasannya, dan jebakan yang sudah pernah menggigit.

Terakhir diperbarui: 20 Agustus 2026.

## Baca berurutan

1. `CLAUDE.md` — identitas, prinsip, dan aturan menulis kode di proyek ini
2. Berkas ini — keadaan sekarang dan jebakannya
3. `docs/product.md` — lini produk dan positioning yang berlaku
4. `docs/PRICING_RULES.md` — **wajib sebelum menulis angka harga**
5. `docs/PRICING.md` — harga publik terkini
6. `docs/GLOSSARY.md` — istilah wajib (Umrah bukan Umroh, Jemaah bukan Jamaah)
7. `README.md` — cara menjalankan, struktur, sitemap
8. `docs/DEPLOYMENT.md` — environment variable, 503, rotasi kata sandi, restore

Sesi chat di claude.ai punya briefnya sendiri: `docs/CHAT_BRIEF.md`. Ia menyusun
dokumen LPP pelanggan dan spreadsheet backoffice, dan **memakai `docs/PRICING.md`
sebagai sumber, bukan menulisnya** — arahnya dokumen resmi → sesi code → repo →
sesi chat.

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
- GA4 (`G-PH99JXKHC9`) di seluruh situs publik; Google Ads (`AW-18372297695`) **hanya di `/konsultasi`**; panel admin tidak dilacak

## Siapa mengerjakan apa

- **Hani** — pemilik dan satu-satunya pengembang. Programmer, jadi urusan kode
  bisa dibahas langsung; urusan infrastruktur perlu dijelaskan konkret (di mana
  perintah dijalankan, apa yang akan terlihat sesudahnya).
- **Tim lain** — memegang akun Google Ads `AW-18372297695` (Google tag
  `GT-KFH6S89B`). Permintaan ke sana harus lewat brief tertulis yang berdiri
  sendiri, lalu ditunggu. Akun sebelumnya `AW-18371371265` ternyata bukan milik
  mereka dan sudah tidak dipakai.

## Pekerjaan terbuka, urut prioritas

1. **Menunggu tim ads mengonfirmasi kedua konversi terlihat di akun mereka.**
   Sisi situs sudah terbukti 12 Agustus 2026: satu form dan satu klik dikirim
   dari produksi, leadnya masuk sebagai `LD-2026-0001`. Yang belum terbukti
   adalah Google Ads benar-benar menerimanya — jalur browser → Google terpisah
   dari jalur form → database, dan yang satu bisa diam sementara yang lain
   berhasil. **Iklan jangan dinyalakan sebelum keduanya terkonfirmasi.**
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

**Terbitan LPP baru masuk lewat `server/database/rates/`, tapi menyunting yang
sudah ada tidak bisa dari sana.** Periode yang sudah punya tarif tidak pernah
ditimpa deploy — itu yang membuat suntingan lewat `/admin/rates` selamat. Jadi
mengubah angka di `rates/` untuk periode yang terlanjur ada tidak berpengaruh
sama sekali, dan itu membingungkan kalau tidak diketahui.

**Okupansi 1–4 artinya jumlah jemaah, bukan penghuni kamar.** Untuk hotel
kebetulan keduanya (`4.350.000 ÷ 2 = 2.175.000` tepat), tapi untuk Paket Dasar
sama sekali bukan (`7.350.000 × 2 ≠ 11.500.000` — itu biaya yang ditanggung
bersama). Jangan menyebut kolom itu "kamar" secara umum.

**Nomor HP harus dinormalkan sebelum dibandingkan.** `0812…`, `+62 812-…`, dan
`62812…` adalah orang yang sama. Semua perbandingan lewat `normalizePhone()`.

**Nomor dokumen tidak boleh diturunkan dari `count(*)`.** Kolomnya UNIQUE dan
jumlah baris bisa berkurang; satu baris terhapus permanen membuat nomor
berikutnya bertabrakan dan penyimpanan gagal total. Pakai `document_counters`.

**Harga kamar mudah tertukar dengan harga per jemaah.** 19 Agustus 2026 tabel
harga kamar hampir masuk sebagai harga per jemaah — angkanya benar, satuannya
tertukar, dan penawaran untuk rombongan berempat akan jadi empat kali lipat tanpa
satu pun error muncul. Sekarang dijaga `npm run rates:verify`; aturannya di
`docs/PRICING_RULES.md`.

**Dependensi opsional yang gagal dipasang dilewati npm tanpa bersuara.** Deploy
12 Agustus 2026 gagal karena `ipx` — optionalDependency milik `@nuxt/image` —
tidak terpasang, padahal `npm install` melaporkan sukses; build baru tumbang
tiga menit kemudian di tahap prerender. Kalau build server gagal dengan cara
yang tidak masuk akal, periksa dulu apakah ada paket yang diam-diam absen.
Jaringan keluar server build itu memang tidak bisa diandalkan: di build yang
sama, `fonts.googleapis.com` juga tidak terjangkau.

## Keputusan yang jangan diputar balik tanpa alasan baru

**Positioning.** UmrahSendiri menjual layanan umrah mandiri satu pintu — hotel,
transportasi, pembimbing, dan pendampingan penyiapan dokumen — dipilih sendiri
oleh jemaah. **Bukan** biro travel, **tidak** menjual paket rombongan. Positioning ini sempat berubah
tiga kali dan baru stabil belakangan. Jangan menghidupkan lagi klaim lama seperti
"menyusun itinerary", "pendampingan", atau "checklist" — layanan itu tidak ada.

**Label conversion action melekat pada akun Ads, bukan pada situs.** Pergantian
akun 9 Agustus 2026 membatalkan label lama seluruhnya — termasuk label form yang
sudah berjalan sejak awal, yang mudah terlewat. Kalau akun berganti lagi,
kosongkan kedua konstanta di `app/constants/analytics.ts` sampai penggantinya
tiba: melapor ke label yang tujuannya tidak ada berarti data hilang tanpa jejak
sementara semuanya tampak berjalan normal.

**Form dan klik WhatsApp adalah dua conversion action terpisah, bukan satu.**
Klik tombol baru menandakan niat; pengiriman form berarti lead lengkap tersimpan
di database. Digabung, Google mengoptimalkan ke arah yang paling murah didapat,
dan di akun tanpa riwayat konversi sinyal paling awal itulah yang membentuk fase
belajarnya.

**Kata "visa" tidak boleh muncul di permukaan publik mana pun.** Iklan Google
ditolak karena copy lama berbunyi seolah UmrahSendiri sendiri yang memproses
dokumen resmi pemerintah. Sejak 12 Agustus 2026 seluruh halaman, komponen,
konstanta, dan artikel memakai **"pendampingan penyiapan dokumen"** — 21 berkas.
Jangan mengembalikannya, dan periksa ulang kalau menulis copy baru.

Yang **tidak** ikut diubah, dan itu disengaja: `server/database/seed.ts`,
`docs/PRICING.md`, dan `docs/product.md` tetap menyebut Visa Umrah dan
Siskopatuh apa adanya. **Layanannya tidak berubah** — dokumen wajib tetap
diurus dan tetap termasuk Paket Dasar Rp11.500.000. Yang berubah hanya kata
yang boleh dipakai di publik. Dokumen internal harus tetap akurat karena
stafnya yang menjawab jemaah di WhatsApp.

Akibatnya ada **jarak antara yang tertulis di situs dan yang jemaah terima**,
dan jarak itu dijembatani saat percakapan WhatsApp. Kalau suatu saat copy publik
terasa tidak cocok dengan `docs/PRICING.md`, itu bukan kekeliruan yang perlu
dirapikan — itu keputusan yang disengaja.

**Halaman iklan tidak punya jalan pintas ke WhatsApp.** Kelima tombol ajakan di
`/konsultasi` menggulir ke form, bukan membuka WhatsApp; WhatsApp baru terbuka
setelah form terkirim, dengan pesan yang sudah terisi dari jawaban jemaah.
Percakapan yang dimulai tanpa form berarti CS menerima "Assalamualaikum" tanpa
nama, jumlah jemaah, tanggal, maupun kebutuhan — dan atribusi iklannya hilang,
jadi tidak ada cara tahu kampanye mana yang membayarnya.

Akibatnya untuk pelacakan: conversion action **klik WhatsApp praktis tidak lagi
menyala dari trafik iklan**. Itu bukan tanda tracking rusak — memang tidak ada
yang mengklik WhatsApp di halaman itu. Satu-satunya konversi dari halaman iklan
adalah pengiriman form, yang justru action Primary yang dioptimalkan Google.
Beri tahu tim ads sebelum mereka mengira ada yang mati.

**Google Ads hanya di halaman iklan; GA4 di seluruh situs publik.** Dua
permintaan tim ads yang berurutan: 20 Agustus 2026 keduanya dicabut dari web
utama, lalu 21 Agustus GA4 diminta dipasang kembali sementara Ads tetap di
halaman iklan saja. Keadaan sekarang adalah hasil keduanya, bukan setengah
jadi:

- `layouts/default.vue` dan `pages/q/[token].vue` — GA4 saja
- `layouts/lp.vue` — Google Ads plus GA4
- `layouts/admin.vue` dan `pages/admin/login.vue` — **tidak sama sekali**

Panel admin dulu ikut terlacak karena cuplikannya global, dan itu berarti tiap
sesi staf terhitung sebagai pengunjung. Sekarang tidak lagi, dan itu disengaja.

Situs utama memuat `gtag/js?id=G-PH99JXKHC9` langsung, bukan Google tag milik
akun Ads (`GT-KFH6S89B`). Google tag bisa meneruskan ke tujuan yang diatur di
layar Google Ads, dan setelan itu tidak kelihatan dari repo ini — memuatnya di
web utama berisiko menghidupkan Ads di tempat yang diminta bersih.

**Konversi Google Ads hanya dicoba di halaman yang memasang tag Ads.** Ini
kegagalan diam yang tertangkap 21 Agustus: klik WhatsApp di `/contact` masih
menembakkan `gtag('event','conversion', {send_to:'AW-…/label'})` padahal
halaman itu tidak pernah meng-config `AW-18372297695`. Tidak ada error, tidak
ada konversi, tidak ada yang terlihat aneh. Aturan tujuan per halaman sekarang
ada di `tagDestinations()`, satu berkas dengan pemasangan tagnya, supaya yang
mengubah pemasangan otomatis mengubah pengarahan eventnya.

Konversi iklan tidak dirugikan — trafik iklan hanya pernah melihat `/konsultasi`,
dan halaman itu tidak punya jalan keluar. Yang dilepas adalah **GA4 di situs
organik**: tidak ada lagi sesi, page view, maupun sumber trafik dari web utama,
dan GA4 tidak bisa mengisi mundur, jadi setiap hari tagnya mati datanya kosong
permanen.

Pencabutan GA4 itu **berlangsung satu hari** dan sudah dibatalkan tim ads
sendiri pada 21 Agustus, dengan alasan yang sama seperti keberatan yang sempat
diajukan. Yang tersisa dari periode itu hanyalah lubang satu hari di data GA4
situs utama, dan GA4 tidak bisa mengisi mundur.

**Properti GA4 terpisah untuk halaman iklan belum ada.** Tim ads memintanya 21
Agustus supaya data kampanye tidak bercampur dengan trafik situs utama.
`GA4_LANDING_MEASUREMENT_ID` di `app/constants/analytics.ts` sudah disiapkan
dan sengaja kosong; selama kosong, halaman iklan melapor ke properti utama.
Isi dengan `G-XXXXXXXXXX` begitu tim ads mengirimkannya — tidak ada yang lain
yang perlu diubah.

**Yang diminta harus properti, bukan data stream kedua.** Stream bukan batas
pelaporan: dua stream pada satu properti tetap dilaporkan menyatu, jadi
pemisahannya tidak terjadi, dan kalau keduanya menyala di halaman yang sama
kunjungannya terhitung dua kali. Kalau tim ads terlanjur membuat data stream,
itu tidak menyelesaikan permintaan mereka sendiri.

**Belum terjawab dan tidak kelihatan dari repo:** apakah Google tag
`GT-KFH6S89B` di layar Google Ads juga meneruskan ke `G-PH99JXKHC9`. Kalau ya,
halaman iklan tetap ikut masuk ke properti utama meski kodenya sudah diarahkan
ke properti kampanye, dan pemisahannya tidak akan sepenuhnya rapi. Perlu
dicek di setelan Google tag mereka, bukan di sini.

Terverifikasi di localhost dengan cookie dikosongkan lebih dulu: di `/`,
`/contact`, dan `/services` tidak ada satu pun skrip Google, tidak ada permintaan
keluar, dan tidak ada cookie yang dibuat. Di `/konsultasi` ketiganya muncul —
gtag.js, pixel konversi ke `googleads.g.doubleclick.net/.../18372297695/`, serta
cookie `_gcl_au`, `_ga`, dan `_ga_PH99JXKHC9`.

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

# Database

PostgreSQL 17 + Drizzle ORM. Skema di `server/database/schema.ts`, migrasi di
`server/database/migrations/`. Migrasi dan penyemaian katalog berjalan sendiri
saat aplikasi start lewat `server/plugins/migrate.ts` — tidak ada langkah manual
saat deploy, dan tidak perlu akses terminal ke server.

## Prinsip

- UUID sebagai primary key, kecuali ada alasan bisnis lain
- Setiap entitas punya `created_at` dan `updated_at`
- Soft delete (`deleted_at`) untuk data yang punya nilai historis
- Angka uang disimpan `bigint` dalam **rupiah penuh**, bukan sen dan bukan desimal

## Tabel

| Tabel | Isi |
|---|---|
| `services` | Katalog layanan. Diisi dari `server/database/seed.ts`, tidak disunting lewat panel |
| `rate_periods` | Satu baris per terbitan LPP |
| `rates` | Tarif per jemaah: layanan × okupansi × (bintang, kota) |
| `contacts` | Orang, dikenali nomor HP ternormalisasi |
| `leads` | Setiap pengiriman form kontak |
| `lead_service_selections` | Layanan yang dicentang jemaah pada satu lead |
| `quotes` | Penawaran yang dibuat dari sebuah lead |
| `quote_items` | Rincian penawaran, harganya **salinan** saat dibuat |
| `document_counters` | Pencacah nomor `LD-`/`PW-` per jenis dan per tahun |

## Aturan yang tidak boleh dilanggar

### Nomor dokumen keluar dari pencacah, bukan dari `count(*)`

`leads.lead_number` dan `quotes.quote_number` bersifat UNIQUE. Menurunkan nomor
berikutnya dari jumlah baris yang ada akan bertabrakan begitu satu baris terhapus
permanen — dan penyimpanan gagal total sampai dibetulkan manual. Dua permintaan
bersamaan juga membaca hitungan yang sama lalu menabrak satu sama lain.

Pakai `nextDocumentNumber()` di `server/utils/documentNumber.ts`. Kenaikan dan
pembacaannya terjadi dalam satu pernyataan SQL.

### Nomor HP dinormalkan sebelum disimpan sebagai identitas

`contacts.phone` selalu bentuk keluaran `normalizePhone()` (`62812…`), bukan apa
yang diketik pengunjung. `leads.phone` menyimpan apa adanya sebagai bukti apa
yang jemaah tulis. Semua perbandingan antar-nomor lewat fungsi itu.

`leads.contact_id` sengaja **boleh kosong**: kalau penyatuan kontak gagal, lead
tetap harus tersimpan. Kehilangan satu lead jauh lebih mahal daripada kehilangan
satu penghubung yang bisa dirapikan belakangan.

### Harga penawaran adalah salinan, bukan rujukan

`quote_items` menyimpan angkanya sendiri, tidak merujuk ke `rates`. Terbitnya LPP
baru tidak boleh mengubah penawaran yang sudah dikirim ke jemaah.

### Tarif tidak di-upsert, tapi diganti seluruh periode

`rates.hotel_tier` dan `rates.city` bernilai NULL untuk layanan non-hotel, dan
Postgres menganggap NULL tidak pernah sama dengan NULL — sehingga `ON CONFLICT`
tidak akan pernah cocok pada baris tersebut dan upsert justru menumpuk duplikat.
Karena itu penyimpanan tarif menghapus lalu menulis ulang satu periode utuh, di
dalam satu transaksi.

### Penyemaian hanya membekali periode yang masih kosong

`seedCatalog()` menulis tarif **hanya kalau periodenya belum punya tarif sama
sekali**. Tanpa syarat itu, setiap deploy akan menghapus dan menulis ulang seluruh
tarif, dan pekerjaan yang dilakukan lewat panel admin lenyap tanpa seorang pun
tahu. Katalog layanan tetap di-upsert karena tidak disunting lewat panel.

### Okupansi 1–4 artinya jumlah jemaah

Bukan jumlah penghuni kamar. `buildQuote` memakai `lead.pax` untuk semua layanan,
dan rombongan lebih dari 4 memakai tarif okupansi 4. Untuk hotel angka itu
kebetulan sekaligus berarti berapa orang sekamar — `4.350.000 ÷ 2 = 2.175.000`
tepat — tapi untuk Paket Dasar sama sekali bukan: `7.350.000 × 2 = 14.700.000`,
bukan `11.500.000`, karena yang ditanggung bersama adalah transport dan dokumen.

## Migrasi

```bash
npm run db:generate   # buat berkas migrasi dari perubahan schema.ts
npm run db:migrate    # terapkan manual (biasanya tidak perlu)
npm run db:studio     # jelajahi isi database lewat peramban
```

Migrasi yang menghapus data (`0003`, `0005`) hanya berjalan sekali — Drizzle
mencatat yang sudah diterapkan di `drizzle.__drizzle_migrations`. **Catatan itu
ikut tersimpan di dalam backup.** Sebelum memulihkan backup apa pun, baca bagian
restore di `docs/DEPLOYMENT.md`.

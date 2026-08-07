# Deployment

Produksi berjalan di Coolify (VPS Biznet Gio). Setiap push ke `main` memicu deploy
sendiri — tidak ada tombol yang perlu ditekan dan tidak ada akses terminal ke server
yang dibutuhkan untuk operasi harian.

## Environment variable

Empat variabel wajib ada di **aplikasi** (bukan di layanan database), dan masing-masing
harus ditandai **Available at Runtime**. Nilai yang hanya tersedia saat build tidak
terbaca oleh proses yang melayani permintaan — inilah kekeliruan yang paling sering
terjadi, karena build tetap berhasil dan situs publik tetap normal.

| Variabel | Isi |
|---|---|
| `NUXT_INTERNAL_AUTH_USER` | Username masuk panel admin |
| `NUXT_INTERNAL_AUTH_PASSWORD` | Kata sandi masuk panel admin |
| `NUXT_SESSION_PASSWORD` | Kunci penyegel cookie sesi, **minimal 32 karakter**, acak |
| `DATABASE_URL` | Connection string internal dari layanan Postgres di Coolify |

Buat nilai acak di terminal sendiri, jangan lewat percakapan atau chat:

```bash
openssl rand -base64 32
```

## Kalau `/admin` menjawab 503

503 di seluruh `/admin/**` berarti salah satu variabel di atas kosong, atau
`NUXT_SESSION_PASSWORD` lebih pendek dari 32 karakter. Ini disengaja: panel memuat
daftar tarif yang tidak ditampilkan ke publik, jadi perlindungannya gagal-tertutup.

Jawaban HTTP-nya sengaja tidak menyebut variabel mana yang bermasalah — route itu bisa
dipanggil siapa saja. Rinciannya ada di **log aplikasi di Coolify**, dituliskan
`server/plugins/config-check.ts` setiap kali aplikasi start, di baris paling atas
sebelum `Listening on`:

```
[config] 1 environment variable wajib belum beres:
           - NUXT_SESSION_PASSWORD (kosong)
         Isi di Coolify → Environment Variables, centang "Available at Runtime", lalu deploy.
```

Kalau semuanya beres, barisnya berbunyi `[config] Environment variable wajib sudah lengkap.`

Urutan penanganan:

1. Buka log aplikasi di Coolify, baca baris `[config]` paling akhir.
2. Isi variabel yang disebut di **Environment Variables**, centang Available at Runtime.
3. Deploy ulang terjadi sendiri setelah variabel disimpan; kalau tidak, push apa pun ke `main`.
4. Tunggu log `[config] Environment variable wajib sudah lengkap.` muncul.
5. Buka `/admin/login` dan masuk.

Situs publik tidak terpengaruh sama sekali oleh 503 ini — form kontak tetap menyimpan
lead selama `DATABASE_URL` terisi.

## Memutar kata sandi

Kata sandi admin dan kata sandi database perlu diputar kalau pernah tampil di tempat
yang tidak semestinya. Keduanya cukup diganti di satu tempat:

- **Kata sandi admin** — ubah `NUXT_INTERNAL_AUTH_PASSWORD` di Coolify. Sesi yang sedang
  berjalan tidak ikut gugur; untuk memaksa semua orang masuk ulang, ganti juga
  `NUXT_SESSION_PASSWORD` (cookie lama jadi tidak bisa dibuka).
- **Kata sandi database** — ubah di layanan Postgres, lalu perbarui `DATABASE_URL` di
  aplikasi. Keduanya harus berubah bersamaan, kalau tidak aplikasi kehilangan koneksi.

## Checklist sebelum deploy

- `npm run typecheck` bersih
- `npm run build` berhasil
- Perubahan terlihat benar di localhost
- Migrasi baru sudah di-commit (dijalankan sendiri saat start lewat `server/plugins/migrate.ts`)
- Backup database terbaru ada

## Backup

Scheduled Backup aktif di layanan Postgres Coolify. Backup masih tersimpan di server
yang sama — belum offsite, dan proses restore-nya belum pernah diuji sekali pun.

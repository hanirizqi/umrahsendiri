# UmrahSendiri

Situs Nuxt Content untuk **UmrahSendiri** — *umrah mandiri planner*: layanan umrah mandiri satu pintu (hotel, transportasi, pembimbing, pendampingan dokumen) yang bisa dipesan sesuai kebutuhan jemaah, tanpa paket rombongan.

Detail riset, positioning, sitemap, dan design system ada di [docs/strategy.md](docs/strategy.md).

**Baru di proyek ini?** Mulai dari [docs/HANDOVER.md](docs/HANDOVER.md) — keadaan sekarang, pekerjaan yang terbuka, dan jebakan yang sudah pernah menggigit.

## Tech Stack

- [Nuxt 4](https://nuxt.com) + Vue 3 (compatibility version 4)
- [@nuxt/content](https://content.nuxt.com) — artikel blog berbasis Markdown
- [@nuxt/icon](https://nuxt.com/modules/icon), [@nuxt/image](https://image.nuxt.com), [@nuxt/fonts](https://fonts.nuxt.com)
- [@nuxtjs/seo](https://nuxtseo.com) — sitemap, meta tags
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- TypeScript (strict mode)

## Menjalankan Proyek

```bash
npm install
npm run dev        # dev server
npm run build       # build produksi
npm run generate    # static generation
npm run preview     # preview hasil build
npm run start        # jalankan hasil build produksi (node .output/server/index.mjs)
npm run typecheck   # cek tipe TypeScript
```

## Environment

Salin `.env.example` menjadi `.env`, lalu isi variabelnya:

```bash
cp .env.example .env
```

| Variabel | Keterangan |
|---|---|
| `NUXT_INTERNAL_AUTH_USER` | Username untuk masuk panel admin |
| `NUXT_INTERNAL_AUTH_PASSWORD` | Kata sandi untuk masuk panel admin |
| `NUXT_SESSION_PASSWORD` | Kunci penyegel cookie sesi, minimal 32 karakter acak |
| `DATABASE_URL` | Koneksi PostgreSQL |

Buat kunci sesi dengan:

```bash
openssl rand -base64 32
```

### Database

Pengembangan lokal memakai PostgreSQL yang berdiri sendiri, terpisah dari produksi:

```bash
brew install postgresql@17 && brew services start postgresql@17
createdb umrahsendiri_dev
```

Migrasi dan pengisian katalog berjalan sendiri saat aplikasi start lewat `server/plugins/migrate.ts`, jadi `npm run dev` sudah cukup — baik di lokal maupun saat deploy, tanpa akses terminal ke server. Perintah di bawah hanya untuk pekerjaan skema:

| Perintah | Kegunaan |
|---|---|
| `npm run db:generate` | Membuat berkas migrasi dari perubahan `server/database/schema.ts` |
| `npm run db:migrate` | Menerapkan migrasi secara manual (biasanya tidak perlu) |
| `npm run db:studio` | Menjelajah isi database lewat peramban |
| `npm run rates:verify` | Memeriksa kewarasan tarif LPP — wajib lolos sebelum push |

Di produksi keempat variabel diset lewat **Coolify → Environment Variables**, bukan lewat file, dan masing-masing harus ditandai **Available at Runtime** — nilai yang hanya tersedia saat build tidak terbaca oleh proses yang melayani permintaan. Nilai lokal dan produksi berdiri sendiri; mengubah salah satunya tidak memengaruhi yang lain.

Perlindungan ini **gagal-tertutup**: kalau salah satu variabel kosong — atau `NUXT_SESSION_PASSWORD` lebih pendek dari 32 karakter — seluruh route `/admin/**` menjawab `503` dan tidak bisa dibuka siapa pun. Ini disengaja: panel admin memuat daftar tarif yang tidak ditampilkan ke publik.

Jawaban `503` itu sengaja tidak menyebut variabel mana yang bermasalah, karena route-nya bisa dipanggil siapa saja. Rinciannya ada di **log server**: setiap kali aplikasi start, `server/plugins/config-check.ts` menuliskan daftar variabel yang belum beres, jadi salah konfigurasi terlihat di log Coolify segera setelah deploy tanpa perlu menebak.

Langkah penanganan 503, cara memutar kata sandi, dan checklist sebelum deploy ada di [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

Panel memakai sesi berbasis cookie dengan halaman masuk di `/admin/login`, berlaku 12 jam. Pemeriksaan kredensial masih dari environment variable; nanti pindah ke tabel `staff_users` saat autentikasi berbasis database tersedia, sedangkan lapisan sesinya tetap dipakai.

### Tarif LPP

Terbitan LPP baru masuk lewat `server/database/rates/` — satu berkas per periode, didaftarkan di `index.ts`, lalu dimasukkan sendiri saat deploy. Tidak perlu menyentuh panel. Menyunting tarif yang sudah ada tetap lewat **panel admin** di `/admin/rates`; periode yang sudah terisi tidak pernah ditimpa oleh deploy.

Sebelum push, jalankan `npm run rates:verify` — aturannya di [docs/PRICING_RULES.md](docs/PRICING_RULES.md). Struktur tiap periode berdiri sendiri — layanan bisa ditambah atau dihentikan, dan bintang hotel tidak dikunci pada 3–5.

`server/database/seed.ts` hanya membekali periode yang **belum punya tarif sama sekali**. Database baru langsung bisa membuat penawaran tanpa siapa pun mengisi apa pun, sementara tarif yang sudah disunting lewat panel tidak pernah ditimpa deploy berikutnya. Katalog layanan tetap di-upsert tiap start karena tidak disunting lewat panel.

Periode baru selalu lahir belum terbit, dan periode tanpa tarif tidak bisa diterbitkan. Penawaran memakai periode terbit dengan `effectiveFrom` terbaru, dan menyalin harganya saat dibuat — jadi menyunting periode tidak pernah mengubah penawaran yang sudah dikirim ke jemaah.

Di produksi, database dibuat sebagai layanan PostgreSQL terpisah di Coolify. **Aktifkan Scheduled Backup di layanan tersebut** — inilah alasan memilih Postgres ketimbang SQLite. Sebelum memulihkan backup, baca dulu [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) bagian restore: migrasi penghapus data bisa berjalan ulang pada database hasil pemulihan.

## Struktur Proyek

```
app/
  components/
    atoms/            Elemen dasar (button, badge, logo)
    molecules/         Kombinasi atom (card, form, accordion, dsb.)
    layout/            Wrapper layout (container, heading, legal content)
    organisms/          Blok halaman penuh (header, footer, hero)
      landing/          Blok khusus landing ads (/konsultasi)
      sections/          Blok section untuk home & halaman lain
  composables/        useJsonLd, useReadingTime, useWhatsapp, useAttribution, useAnalytics, usePriceCalculator
  plugins/            attribution.client (menangkap asal-usul di kunjungan pertama)
  constants/          Data statis (nav, faqs, services, dst.)
  layouts/            default (halaman umum), lp (/konsultasi), admin (panel staf)
  pages/              Routing berbasis file (lihat Sitemap di bawah)
  types/               Tipe TypeScript bersama
  utils/               Helper (content, date)
content/
  articles/           Artikel blog (Markdown, dibaca lewat @nuxt/content)
content.config.ts     Skema koleksi content (articles)
server/
  api/                 Route API (leads publik, admin terlindungi, sitemap-urls)
  database/            Skema Drizzle, migrasi, seed katalog
    rates/             Satu berkas per terbitan LPP, harga per jemaah
  middleware/          Penjaga sesi untuk /admin/**
  plugins/             Migrasi saat start, pemeriksa kelengkapan environment
  utils/               Koneksi database, sesi admin, pembatas laju, penomoran dokumen, normalisasi nomor HP
drizzle.config.ts      Konfigurasi Drizzle Kit
public/                Aset statis (favicon, gambar, brand assets)
docs/strategy.md       Riset UX, positioning, sitemap, design system
docs/DEPLOYMENT.md     Runbook produksi: environment variable, 503, rotasi kata sandi
docs/PRICING_RULES.md  Aturan menulis harga: satuan, uji wajib, cara memasukkan LPP baru
```

## Sitemap

| Route | Deskripsi |
|---|---|
| `/` | Home |
| `/about` | Tentang (cerita, misi, tim) |
| `/services` | Layanan (dokumen perjalanan, biaya, hotel, transport, pembimbing, konsultasi) |
| `/how-it-works` | Cara Kerja (proses 4 langkah) |
| `/articles` | Blog listing (search, kategori, tag) |
| `/articles/[slug]` | Artikel detail |
| `/faq` | FAQ lengkap |
| `/contact` | Kontak + form + WhatsApp |
| `/konsultasi` | Landing Ads — satu halaman utuh tanpa tautan keluar, noindex, tidak diindeks sitemap |
| `/privacy-policy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/admin/login` | Halaman masuk panel admin (noindex) |
| `/admin/leads` | Daftar lead masuk beserta asal-usulnya (noindex, perlu sesi) |
| `/admin/leads/[id]` | Detail lead, status, penawaran, dan catatan tindak lanjut (noindex, perlu sesi) |
| `/admin/contacts` | Satu baris per orang, dikenali nomor HP (noindex, perlu sesi) |
| `/admin/contacts/[id]` | Seluruh pengiriman form dari orang tersebut (noindex, perlu sesi) |
| `/admin/rates` | Daftar periode tarif LPP (noindex, perlu sesi) |
| `/admin/rates/[id]` | Sunting tarif satu periode dan terbitkan (noindex, perlu sesi) |
| `/admin/price-calculator` | Kalkulator harga untuk CS (noindex, perlu sesi — lihat [Environment](#environment)) |
| `/[...slug]` | 404 |

URL lama berbahasa Indonesia (`/tentang`, `/layanan`, `/cara-kerja`, `/kontak`, `/mulai`, `/artikel`, `/internal/*`) beserta `/start` — halaman iklan lama yang digantikan `/konsultasi` — tetap hidup lewat **redirect 301** yang didefinisikan di `routeRules` pada `nuxt.config.ts`. Jangan dihapus — situs sudah terindeks dan tautan iklan lama masih bisa menunjuk ke sana.

## Pelacakan Konversi

Satu `gtag.js` melayani dua tujuan sekaligus, keduanya di-config di `nuxt.config.ts` dan ID-nya tersimpan di `app/constants/analytics.ts`: **Google Ads** untuk konversi iklan dan **GA4** untuk perilaku pengunjung. Setiap event diarahkan lewat `send_to`, jadi tidak ada yang bocor ke tujuan yang salah.

Dua peristiwa yang dicatat, keduanya lewat `app/composables/useAnalytics.ts`:

| Peristiwa | Google Ads | GA4 |
|---|---|---|
| Form kontak tersimpan sebagai lead | conversion (Primary) | `generate_lead` |
| Klik tombol WhatsApp mana pun | conversion (Secondary) | `whatsapp_click` (+ `source`) |

Tombol WhatsApp tidak pernah memanggil gtag sendiri. Semuanya dipasang lewat `cta()` dari `useWhatsapp`, yang mengembalikan `href` sekaligus pencatatnya:

```vue
<AppButton v-bind="cta('sticky_bottom')">Konsultasi Gratis via WhatsApp</AppButton>
```

Menambah tombol WhatsApp baru berarti memakai helper yang sama, jadi tidak ada tombol yang tertinggal tanpa pencatatan. Isi `source` dengan nama yang menjelaskan letak tombolnya — itulah yang membedakan tombol satu dengan lainnya di GA4.

Tombol berbagi ke WhatsApp (`ShareButtons`) dan tautan WhatsApp di panel admin sengaja tidak dicatat: yang pertama berbagi artikel, yang kedua dipakai staf menghubungi lead.

Keduanya memakai **conversion action terpisah** di akun `AW-18372297695`, bukan satu action yang sama. Klik tombol baru menandakan niat; pengiriman form berarti lead lengkap tersimpan di database. Digabung, Google mengoptimalkan ke arah yang paling murah didapat — dan di akun tanpa riwayat konversi, sinyal paling awal itulah yang membentuk fase belajarnya.

Pembagian perannya diatur di sisi Google Ads: form berstatus **Primary** dan dioptimalkan, klik tombol **Secondary** dengan Count "One" sehingga satu orang yang menekan beberapa tombol tetap terhitung sekali.

Kalau akun Ads berganti lagi, kedua label ikut mati — label melekat pada akunnya. Kosongkan keduanya di `app/constants/analytics.ts` sampai penggantinya tiba; jangan biarkan menunjuk akun lama, karena permintaannya tetap terkirim tanpa error sementara tidak ada satu pun konversi tercatat.

Tombol berbagi ke WhatsApp (`ShareButtons`) dan tautan WhatsApp di panel admin sengaja tidak dicatat: yang pertama berbagi artikel, yang kedua dipakai staf menghubungi lead.

**Tidak ada satu pun konversi yang dilaporkan ke Google Ads saat ini.** Akun Ads berganti dari `AW-18371371265` ke `AW-18372297695` pada 9 Agustus 2026, dan label conversion action melekat pada akunnya — label lama menunjuk ke tujuan yang tidak ada. Melapor ke sana berarti data hilang tanpa jejak sementara semuanya tampak berjalan normal, jadi keduanya dikosongkan sampai penggantinya tiba.

Tidak ada data yang hilang: GA4 tetap mencatat kedua peristiwa, dan iklan belum dinyalakan.

Untuk mengaktifkannya, isi `WHATSAPP_FORM_CONVERSION` dan `WHATSAPP_CLICK_CONVERSION` di `app/constants/analytics.ts` dengan `AW-18372297695/<label>` masing-masing. **Dua conversion action terpisah, bukan satu** — klik tombol baru menandakan niat, pengiriman form berarti lead lengkap tersimpan; digabung, Google mengoptimalkan ke arah yang paling murah didapat, dan di akun tanpa riwayat konversi sinyal paling awal itulah yang membentuk fase belajarnya. Jadikan form sebagai konversi utama yang dioptimalkan, klik tombol sebagai penanda sekunder.

## Deployment

Deploy via `Dockerfile` (build tools untuk native module `better-sqlite3` disiapkan di image, build dijalankan di dalam container agar binary native cocok dengan platform target):

```bash
docker build -t umrahsendiri .
docker run -p 3000:3000 umrahsendiri
```

Di [Coolify](https://coolify.io), buat resource baru dari repo GitHub ini dengan build pack **Dockerfile**, port **3000**, dan set environment variable sesuai tabel di atas. Tambahkan juga layanan **PostgreSQL** dan arahkan `DATABASE_URL` ke sana.

## Design System (ringkas)

- **Warna**: primary `#123C32`, secondary (emas) `#C39A58`, background `#FAF8F5`, dark `#0D2823`, text `#17322D`.
- **Tipografi**: Manrope (heading, 600–800), DM Sans (body/UI, 400–500).
- **Tone**: tenang, presisi, hormat — bukan gaya sales/promo.

Detail lengkap (spacing, radius, shadow, motion, positioning, persona) ada di [docs/strategy.md](docs/strategy.md).

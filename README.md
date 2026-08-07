# UmrahSendiri

Situs Nuxt Content untuk **UmrahSendiri** — *umrah mandiri planner*: layanan umrah mandiri satu pintu (hotel, visa, transportasi, pembimbing) yang bisa dipesan sesuai kebutuhan jamaah, tanpa paket rombongan.

Detail riset, positioning, sitemap, dan design system ada di [docs/strategy.md](docs/strategy.md).

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
npm run db:migrate
npm run db:seed
```

| Perintah | Kegunaan |
|---|---|
| `npm run db:generate` | Membuat berkas migrasi dari perubahan `server/database/schema.ts` |
| `npm run db:migrate` | Menerapkan migrasi ke database |
| `npm run db:seed` | Mengisi katalog layanan (aman diulang) |
| `npm run db:studio` | Menjelajah isi database lewat peramban |

Di produksi, database dibuat sebagai layanan PostgreSQL terpisah di Coolify. **Aktifkan Scheduled Backup di layanan tersebut** — inilah alasan memilih Postgres ketimbang SQLite.

Migrasi belum berjalan otomatis saat deploy, jadi setelah menambah migrasi baru jalankan `npm run db:migrate` dengan `DATABASE_URL` produksi.

Di produksi ketiganya diset lewat **Coolify → Environment Variables**, bukan lewat file. Nilai lokal dan produksi berdiri sendiri — mengubah salah satunya tidak memengaruhi yang lain.

Perlindungan ini **gagal-tertutup**: kalau salah satu variabel kosong, seluruh route `/admin/**` menjawab `503` dan tidak bisa dibuka siapa pun. Ini disengaja — panel admin memuat daftar tarif yang tidak ditampilkan ke publik.

Panel memakai sesi berbasis cookie dengan halaman masuk di `/admin/login`, berlaku 12 jam. Pemeriksaan kredensial masih dari environment variable; nanti pindah ke tabel `staff_users` saat autentikasi berbasis database tersedia, sedangkan lapisan sesinya tetap dipakai.

## Struktur Proyek

```
app/
  components/
    atoms/            Elemen dasar (button, badge, logo)
    molecules/         Kombinasi atom (card, form, accordion, dsb.)
    layout/            Wrapper layout (container, heading, legal content)
    organisms/          Blok halaman penuh (header, footer, hero)
      landing/          Blok khusus landing ads (/start)
      sections/          Blok section untuk home & halaman lain
  composables/        useJsonLd, useReadingTime, useWhatsapp, useAttribution
  plugins/            attribution.client (menangkap asal-usul di kunjungan pertama)
  constants/          Data statis (nav, faqs, services, dst.)
  layouts/            default (halaman umum), landing (/start), admin (panel staf)
  pages/              Routing berbasis file (lihat Sitemap di bawah)
  types/               Tipe TypeScript bersama
  utils/               Helper (content, date)
content/
  articles/           Artikel blog (Markdown, dibaca lewat @nuxt/content)
content.config.ts     Skema koleksi content (articles)
server/
  api/                 Route API (leads publik, admin terlindungi, sitemap-urls)
  database/            Skema Drizzle, migrasi, dan seed katalog layanan
  middleware/          Penjaga sesi untuk /admin/**
  utils/               Koneksi database, sesi admin, pembatas laju
drizzle.config.ts      Konfigurasi Drizzle Kit
public/                Aset statis (favicon, gambar, brand assets)
docs/strategy.md       Riset UX, positioning, sitemap, design system
```

## Sitemap

| Route | Deskripsi |
|---|---|
| `/` | Home |
| `/about` | Tentang (cerita, misi, tim) |
| `/services` | Layanan (visa & dokumen, biaya, hotel, transport, pembimbing, konsultasi) |
| `/how-it-works` | Cara Kerja (proses 4 langkah) |
| `/articles` | Blog listing (search, kategori, tag) |
| `/articles/[slug]` | Artikel detail |
| `/faq` | FAQ lengkap |
| `/contact` | Kontak + form + WhatsApp |
| `/start` | Landing Ads (distraction-free, conversion-only, tidak diindeks sitemap) |
| `/privacy-policy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/admin/login` | Halaman masuk panel admin (noindex) |
| `/admin/leads` | Daftar lead masuk beserta asal-usulnya (noindex, perlu sesi) |
| `/admin/leads/[id]` | Detail lead, status, dan catatan tindak lanjut (noindex, perlu sesi) |
| `/admin/price-calculator` | Kalkulator harga untuk CS (noindex, perlu sesi — lihat [Environment](#environment)) |
| `/[...slug]` | 404 |

URL lama berbahasa Indonesia (`/tentang`, `/layanan`, `/cara-kerja`, `/kontak`, `/mulai`, `/artikel`, `/internal/*`) tetap hidup lewat **redirect 301** yang didefinisikan di `routeRules` pada `nuxt.config.ts`. Jangan dihapus — situs sudah terindeks dan tautan iklan lama masih bisa menunjuk ke sana.

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

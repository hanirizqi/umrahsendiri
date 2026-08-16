import tailwindcss from '@tailwindcss/vite'
import { GA4_MEASUREMENT_ID, GOOGLE_ADS_ID, GOOGLE_TAG_ID } from './app/constants/analytics'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  future: { compatibilityVersion: 4 },

  modules: [
    '@nuxt/content',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/seo',
  ],

  css: ['~/assets/css/main.css'],

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
      script: [
        // Dimuat dengan Google tag milik akun Ads, lalu tiap tujuan di-config
        // terang-terangan: Google Ads untuk konversi iklan, GA4 untuk perilaku
        // pengunjung. Config eksplisit dipertahankan meski Google tag bisa
        // meneruskannya sendiri — supaya tujuan mana yang aktif terbaca dari
        // repo ini, bukan bergantung pada setelan di layar Google Ads yang tidak
        // kelihatan dari sini. Setiap event diarahkan lewat send_to.
        { src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`, async: true },
        {
          innerHTML: 'window.dataLayer = window.dataLayer || [];'
            + 'function gtag(){dataLayer.push(arguments);}'
            + 'gtag(\'js\', new Date());'
            + `gtag('config', '${GOOGLE_ADS_ID}');`
            + `gtag('config', '${GA4_MEASUREMENT_ID}');`,
        },
      ],
    },
  },

  runtimeConfig: {
    // Kredensial panel internal. Isi lewat environment variable
    // (NUXT_INTERNAL_AUTH_USER dst.) — jangan pernah ditulis di file ini.
    internalAuthUser: '',
    internalAuthPassword: '',
    // Kunci penyegel cookie sesi, minimal 32 karakter.
    sessionPassword: '',
  },

  site: {
    url: 'https://umrahsendiri.com',
    name: 'UmrahSendiri',
    description: 'Umrah Mandiri Planner — layanan umrah mandiri satu pintu: hotel, transportasi, pembimbing, dan pendampingan penyiapan dokumen perjalanan.',
    defaultLocale: 'id',
  },

  ogImage: {
    enabled: false,
  },

  sitemap: {
    sources: ['/api/sitemap-urls'],
    // /admin sengaja tidak didaftarkan di robots.txt — file itu publik,
    // dan menuliskan path-nya di sana justru mengumumkan keberadaannya.
    exclude: ['/start', '/admin/**', '/q/**'],
  },

  /**
   * URL lama berbahasa Indonesia tetap hidup lewat pengalihan permanen.
   * Situs sudah terindeks dan tautan iklan mungkin masih menunjuk ke /mulai,
   * jadi menghapusnya begitu saja akan membuang peringkat pencarian sekaligus
   * mematahkan iklan yang sedang berjalan. 301 memindahkan nilai SEO ke alamat baru.
   */
  routeRules: {
    '/tentang': { redirect: { to: '/about', statusCode: 301 } },
    '/layanan': { redirect: { to: '/services', statusCode: 301 } },
    '/cara-kerja': { redirect: { to: '/how-it-works', statusCode: 301 } },
    '/kontak': { redirect: { to: '/contact', statusCode: 301 } },
    '/mulai': { redirect: { to: '/start', statusCode: 301 } },
    '/artikel': { redirect: { to: '/articles', statusCode: 301 } },
    '/artikel/**': { redirect: { to: '/articles/**', statusCode: 301 } },
    '/internal/masuk': { redirect: { to: '/admin/login', statusCode: 301 } },
    '/internal/kalkulator-harga': { redirect: { to: '/admin/price-calculator', statusCode: 301 } },
    '/internal/**': { redirect: { to: '/admin/**', statusCode: 301 } },
  },

  fonts: {
    families: [
      { name: 'Manrope', provider: 'google', weights: [500, 600, 700, 800] },
      { name: 'DM Sans', provider: 'google', weights: [400, 500, 600] },
    ],
  },

  icon: {
    mode: 'svg',
  },

  /**
   * Optimasi gambar dimatikan; NuxtImg merender `<img>` biasa ke berkas aslinya.
   *
   * Penyedia bawaan `@nuxt/image` adalah IPX, dan IPX butuh `sharp` — modul
   * native yang mengunduh binernya sendiri saat install. Di server build kami
   * unduhan itu gagal, dan karena `ipx` hanya optionalDependency, npm
   * melewatinya tanpa bersuara sampai build tumbang di tahap prerender dengan
   * "Cannot find package 'ipx'". Deploy 12 Agustus 2026 gagal karenanya.
   *
   * Yang hilang kecil: kelima pemakaian NuxtImg menunjuk berkas statis lokal
   * berukuran 27–89 KB dengan width/height tetap, tidak ada gambar remote dan
   * tidak ada `sizes` responsif — jadi IPX praktis hanya menambah konversi
   * webp. Menukarnya dengan build yang tidak bergantung pada modul native dan
   * unduhan jaringan saat install adalah pertukaran yang layak.
   *
   * Kalau optimasi ini diinginkan lagi: pasang `ipx` sebagai dependency biasa
   * (bukan optional) supaya kegagalannya berisik, dan pastikan server build
   * bisa mengunduh biner sharp — di build yang sama, `fonts.googleapis.com`
   * juga tidak terjangkau, jadi periksa dulu jaringan keluar server itu.
   */
  image: {
    provider: 'none',
  },

  content: {
    build: {
      markdown: {
        toc: { depth: 2 },
      },
    },
  },

  typescript: {
    strict: true,
  },

  devtools: { enabled: true },
})

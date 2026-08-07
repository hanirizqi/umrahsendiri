import tailwindcss from '@tailwindcss/vite'

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
        { src: 'https://www.googletagmanager.com/gtag/js?id=AW-18371371265', async: true },
        {
          innerHTML: 'window.dataLayer = window.dataLayer || [];'
            + 'function gtag(){dataLayer.push(arguments);}'
            + 'gtag(\'js\', new Date());'
            + 'gtag(\'config\', \'AW-18371371265\');',
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
    description: 'Umrah Mandiri Planner — layanan umrah mandiri satu pintu: hotel, visa, transportasi, hingga pembimbing.',
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

  image: {
    format: ['webp'],
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

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
    // Kunci sementara halaman /internal. Isi lewat NUXT_INTERNAL_AUTH_USER
    // dan NUXT_INTERNAL_AUTH_PASSWORD — jangan pernah ditulis di file ini.
    internalAuthUser: '',
    internalAuthPassword: '',
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
    // /internal sengaja tidak didaftarkan di robots.txt — file itu publik,
    // dan menuliskan path-nya di sana justru mengumumkan keberadaannya.
    exclude: ['/mulai', '/internal/**'],
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

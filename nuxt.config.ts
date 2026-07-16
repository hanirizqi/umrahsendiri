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
    },
  },

  site: {
    url: 'https://umrahsendiri.com',
    name: 'UmrahSendiri',
    description: 'Umrah Mandiri Planner — partner perencanaan umrah mandiri dari itinerary, estimasi biaya, hingga siap berangkat.',
    defaultLocale: 'id',
  },

  ogImage: {
    enabled: false,
  },

  sitemap: {
    sources: ['/api/sitemap-urls'],
    exclude: ['/mulai'],
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

import { GA4_MEASUREMENT_ID, GOOGLE_ADS_ID, GOOGLE_TAG_ID } from '~/constants/analytics'

/**
 * Memasang gtag.js — hanya pada halaman yang memanggilnya.
 *
 * Sampai 20 Agustus 2026 cuplikan ini ada di `app.head` di `nuxt.config.ts`,
 * jadi terpasang di seluruh situs. Tim ads meminta Google Ads ID dan GA4 ID
 * dicabut dari web utama dan dipasang di halaman iklan saja, jadi sekarang
 * hanya layout `lp` yang memanggilnya.
 *
 * Konsekuensinya, dan ini disengaja: di luar `/konsultasi` tidak ada `gtag`
 * sama sekali. Pengiriman form di `/contact` tidak lagi melaporkan konversi
 * ke Google Ads maupun `generate_lead` ke GA4, klik WhatsApp di halaman publik
 * dan di `/q/[token]` tidak tercatat, dan cookie `_ga` tidak pernah dibuat —
 * sehingga `gaClientId` pada lead dari luar halaman iklan akan kosong. Leadnya
 * sendiri tetap tersimpan lengkap dengan atribusi UTM dan `gclid`, karena
 * `useAttribution` membaca URL, bukan gtag.
 *
 * Yang dimuat adalah Google tag milik akun Ads, lalu tiap tujuan di-config
 * terang-terangan: Google Ads untuk konversi iklan, GA4 untuk perilaku
 * pengunjung. Config eksplisit dipertahankan meski Google tag bisa
 * meneruskannya sendiri — supaya tujuan mana yang aktif terbaca dari repo ini,
 * bukan bergantung pada setelan di layar Google Ads yang tidak kelihatan dari
 * sini. Setiap event diarahkan lewat `send_to`.
 */
export function useGoogleTag() {
  useHead({
    script: [
      { src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`, async: true },
      {
        innerHTML: 'window.dataLayer = window.dataLayer || [];'
          + 'function gtag(){dataLayer.push(arguments);}'
          + 'gtag(\'js\', new Date());'
          + `gtag('config', '${GOOGLE_ADS_ID}');`
          + `gtag('config', '${GA4_MEASUREMENT_ID}');`,
      },
    ],
  })
}

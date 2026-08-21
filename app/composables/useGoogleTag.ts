import {
  GA4_LANDING_MEASUREMENT_ID,
  GA4_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  GOOGLE_TAG_ID,
  LANDING_PAGE_PATH,
} from '~/constants/analytics'

/**
 * Permukaan mana yang memasang tagnya. Keduanya memuat tujuan yang berbeda,
 * jadi pemanggilnya harus menyebutkan dirinya sendiri.
 *
 * - `main` — situs publik. **Hanya GA4**, tanpa Google Ads. Tim ads meminta tag
 *   Ads tetap di halaman iklan saja, jadi yang dimuat pun `gtag/js?id=<GA4>`
 *   langsung, bukan Google tag milik akun Ads: Google tag bisa meneruskan ke
 *   tujuan yang diatur di layar Google Ads, dan setelan itu tidak kelihatan
 *   dari repo ini.
 * - `landing` — halaman iklan. Google Ads untuk konversi, plus GA4.
 */
export type GoogleTagSurface = 'main' | 'landing'

/**
 * Properti GA4 yang dipakai halaman iklan.
 *
 * Tim ads meminta properti terpisah supaya data kampanye tidak bercampur dengan
 * trafik situs utama. Selama `GA4_LANDING_MEASUREMENT_ID` masih kosong,
 * halaman iklan tetap melapor ke properti utama — kalau dibiarkan kosong tanpa
 * cadangan, `cta_to_form` dan `generate_lead` dari halaman iklan tidak sampai
 * ke mana pun sementara semuanya tampak berjalan normal.
 */
export const GA4_LANDING_ACTIVE_ID = GA4_LANDING_MEASUREMENT_ID || GA4_MEASUREMENT_ID

/**
 * Tujuan mana yang benar-benar terpasang di sebuah halaman.
 *
 * Dipakai `useAnalytics` supaya tidak ada event yang dikirim ke tujuan yang
 * tidak di-config di halaman itu — permintaannya tetap berangkat tanpa error
 * sementara tidak ada apa pun yang tercatat, persis kegagalan diam yang sudah
 * pernah menggigit waktu akun Ads berganti. Ditaruh di sini, bukan disalin ke
 * `useAnalytics`, supaya aturannya hanya ada di satu berkas: yang mengubah
 * pemasangan tag otomatis mengubah pengarahan eventnya.
 *
 * Halaman admin tidak memasang tag sama sekali, jadi keduanya bernilai kosong
 * di sana dan seluruh pencatatan berhenti di penjaga `send()`.
 */
export function tagDestinations(path: string) {
  const isLanding = path === LANDING_PAGE_PATH
  return {
    /** Google Ads hanya di halaman iklan, atas permintaan tim ads. */
    ads: isLanding ? GOOGLE_ADS_ID : '',
    ga4: isLanding ? GA4_LANDING_ACTIVE_ID : GA4_MEASUREMENT_ID,
  }
}

/**
 * Memasang gtag.js pada permukaan yang memanggilnya.
 *
 * Sampai 20 Agustus 2026 cuplikan ini ada di `app.head` di `nuxt.config.ts`,
 * jadi terpasang di seluruh situs termasuk panel admin. Sekarang tiap permukaan
 * memanggilnya sendiri, dan yang tidak memanggil tidak dilacak:
 *
 * - `layouts/default.vue` — seluruh halaman publik
 * - `pages/q/[token].vue` — halaman penawaran; `layout: false`, jadi tidak
 *   kebagian dari layout mana pun dan harus memanggil sendiri
 * - `layouts/lp.vue` — halaman iklan
 *
 * **`layouts/admin.vue` dan `pages/admin/login.vue` sengaja tidak memanggil.**
 * Dulu keduanya ikut terlacak karena cuplikannya global, dan itu berarti tiap
 * sesi staf terhitung sebagai pengunjung di GA4. Panelnya di balik login dan
 * `noindex`; tidak ada yang perlu diukur di sana.
 *
 * Setiap tujuan di-config terang-terangan meski Google tag bisa meneruskannya
 * sendiri — supaya tujuan mana yang aktif terbaca dari repo ini, bukan
 * bergantung pada setelan di layar Google Ads yang tidak kelihatan dari sini.
 * Setiap event diarahkan lewat `send_to`.
 *
 * `key` dipasang supaya tag tidak berganda kalau pengunjung berpindah antar
 * permukaan tanpa memuat ulang halaman — mengetik `/konsultasi` setelah membuka
 * beranda, misalnya. Halaman iklan sendiri tidak punya tautan keluar, jadi arah
 * sebaliknya tidak mungkin terjadi.
 */
export function useGoogleTag(surface: GoogleTagSurface) {
  const loaderId = surface === 'landing' ? GOOGLE_TAG_ID : GA4_MEASUREMENT_ID

  const destinations = surface === 'landing'
    ? [GOOGLE_ADS_ID, GA4_LANDING_ACTIVE_ID]
    : [GA4_MEASUREMENT_ID]

  useHead({
    script: [
      {
        key: 'google-tag',
        src: `https://www.googletagmanager.com/gtag/js?id=${loaderId}`,
        async: true,
      },
      {
        key: 'google-tag-config',
        innerHTML: 'window.dataLayer = window.dataLayer || [];'
          + 'function gtag(){dataLayer.push(arguments);}'
          + 'gtag(\'js\', new Date());'
          + destinations.filter(Boolean).map(id => `gtag('config', '${id}');`).join(''),
      },
    ],
  })
}

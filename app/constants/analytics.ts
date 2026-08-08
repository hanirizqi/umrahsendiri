/** Google Ads. Dipakai di nuxt.config untuk memuat gtag.js. */
export const GOOGLE_ADS_ID = 'AW-18371371265'

/** Google Analytics 4. */
export const GA4_MEASUREMENT_ID = 'G-PH99JXKHC9'

/**
 * Label conversion action milik Google Ads. Dibuat di Google Ads, bukan di sini.
 *
 * Klik tombol WhatsApp saat ini memakai label yang sama dengan pengiriman form.
 * Keduanya bukan sinyal yang setara — pengiriman form menyimpan lead lengkap ke
 * database, sedangkan klik tombol baru menandakan niat — jadi digabung begini
 * Google Ads mengoptimalkan ke arah yang termurah, bukan yang paling berharga.
 * Begitu conversion action terpisah dibuat di Google Ads, cukup ganti nilai di
 * bawah ini; sisi GA4 sudah memisahkan keduanya sejak awal lewat nama event.
 */
export const WHATSAPP_FORM_CONVERSION_LABEL = `${GOOGLE_ADS_ID}/5UjdCObQ9tscEIHCk7hE`
export const WHATSAPP_CLICK_CONVERSION_LABEL = WHATSAPP_FORM_CONVERSION_LABEL

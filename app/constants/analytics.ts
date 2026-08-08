/** Google Ads. Dipakai di nuxt.config untuk memuat gtag.js. */
export const GOOGLE_ADS_ID = 'AW-18371371265'

/** Google Analytics 4. */
export const GA4_MEASUREMENT_ID = 'G-PH99JXKHC9'

/**
 * Nilai `send_to` tiap conversion action Google Ads, berformat
 * `AW-xxx/LabelNya` — disalin dari cuplikan yang diberikan Google Ads saat
 * conversion action-nya dibuat.
 */
export const WHATSAPP_FORM_CONVERSION = `${GOOGLE_ADS_ID}/5UjdCObQ9tscEIHCk7hE`

/**
 * Klik tombol WhatsApp. Sengaja dibiarkan kosong sampai conversion action-nya
 * sendiri dibuat di Google Ads.
 *
 * Selama kosong, klik tombol tidak dilaporkan ke Google Ads sama sekali — dan
 * sengaja tidak dialihkan ke conversion action milik form. Akun ini belum punya
 * satu pun riwayat konversi, sedangkan fase belajar Google terbentuk dari
 * sinyal paling awal yang ia terima: satu action yang mencampur "klik tombol"
 * dengan "lead lengkap tersimpan di database" mengajari Google mengejar yang
 * paling murah didapat, yaitu klik. Tidak melapor sama sekali lebih baik
 * daripada melapor dengan sinyal yang keliru, dan tidak ada data yang hilang —
 * GA4 tetap mencatat setiap klik lewat event `whatsapp_click` sejak hari
 * pertama, lengkap dengan `source` tombolnya.
 *
 * Isi dengan `${GOOGLE_ADS_ID}/<label baru>` begitu action-nya ada, lalu
 * jadikan pengiriman form sebagai konversi utama yang dioptimalkan dan klik
 * ini sebagai penanda sekunder.
 */
export const WHATSAPP_CLICK_CONVERSION = ''

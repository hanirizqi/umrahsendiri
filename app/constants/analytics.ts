/**
 * Google tag milik akun Google Ads UmrahSendiri, dipakai memuat gtag.js.
 *
 * Akun sebelumnya `AW-18371371265` ternyata bukan akun yang dipakai tim ads;
 * diganti 9 Agustus 2026 atas keterangan mereka. Pergantian akun membatalkan
 * seluruh label conversion action lama — label melekat pada akunnya, bukan pada
 * situs — jadi keduanya di bawah dikosongkan sampai label penggantinya dibuat.
 */
export const GOOGLE_TAG_ID = 'GT-KFH6S89B'
export const GOOGLE_ADS_ID = 'AW-18372297695'

/** Google Analytics 4 situs utama. Tidak ikut berganti saat akun Ads berganti. */
export const GA4_MEASUREMENT_ID = 'G-PH99JXKHC9'

/**
 * Properti GA4 terpisah khusus halaman iklan, diminta tim ads 21 Agustus 2026
 * supaya data kampanye tidak bercampur dengan trafik situs utama.
 *
 * **Harus properti, bukan data stream kedua pada properti yang sama.** Stream
 * bukan batas pelaporan: dua stream pada satu properti tetap dilaporkan
 * menyatu, jadi pemisahannya tidak terjadi — dan kalau keduanya menyala di
 * halaman yang sama, kunjungannya terhitung dua kali.
 *
 * Kosong selama propertinya belum dibuat. Selama kosong, halaman iklan melapor
 * ke properti utama; lihat `GA4_LANDING_ACTIVE_ID` di `useGoogleTag`. Isi
 * dengan `G-XXXXXXXXXX` begitu tim ads mengirimkannya — tidak ada yang lain
 * yang perlu diubah.
 */
export const GA4_LANDING_MEASUREMENT_ID = ''

/**
 * Path halaman iklan. Dipakai memilih properti GA4 mana yang dituju sebuah
 * event, karena `ContactForm` dipakai di halaman iklan maupun di `/contact`
 * dan keduanya melapor ke properti yang berbeda.
 */
export const LANDING_PAGE_PATH = '/konsultasi'

/**
 * Nilai `send_to` tiap conversion action Google Ads. Label dibuat tim ads di
 * akun `AW-18372297695` dan dikirim 9 Agustus 2026.
 *
 * Sengaja **dua action terpisah, bukan satu**. Klik tombol baru menandakan
 * niat, sedangkan pengiriman form berarti lead lengkap tersimpan di database.
 * Digabung, Google mengoptimalkan ke arah yang paling murah didapat — yaitu
 * klik — dan di akun tanpa riwayat konversi, sinyal paling awal itulah yang
 * membentuk fase belajarnya.
 *
 * Pembagian perannya diatur di sisi Google Ads, bukan di sini: form berstatus
 * Primary dan dioptimalkan, klik tombol Secondary dengan Count "One" sehingga
 * satu orang yang menekan beberapa tombol tetap terhitung sekali.
 *
 * Kalau akun Ads berganti lagi, kedua label ini ikut mati — label melekat pada
 * akunnya. Kosongkan keduanya sampai penggantinya tiba; jangan biarkan menunjuk
 * akun lama, karena permintaannya tetap terkirim tanpa error sementara tidak
 * ada satu pun konversi tercatat.
 */
export const WHATSAPP_FORM_CONVERSION = `${GOOGLE_ADS_ID}/1JlVCJ7Ar9wcEN-HzLhE`
export const WHATSAPP_CLICK_CONVERSION = `${GOOGLE_ADS_ID}/KT1QCIzn598cEN-HzLhE`

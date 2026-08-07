/**
 * Menangkap asal-usul pengunjung pada pemuatan halaman pertama, sebelum
 * navigasi apa pun menghapus parameter dari URL.
 */
export default defineNuxtPlugin(() => {
  useAttribution().capture()
})

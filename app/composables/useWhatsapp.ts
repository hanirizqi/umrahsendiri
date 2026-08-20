import { SITE, buildWhatsappLink } from '~/constants/site'

export function useWhatsapp() {
  const link = (message?: string) => buildWhatsappLink(message)

  /**
   * Atribut lengkap satu tombol WhatsApp: tautannya sekaligus pencatat
   * konversinya, dipasang dengan `v-bind="cta('nama_tombol')"`.
   *
   * Digabung begini supaya tidak ada tombol yang tertinggal: menambah tombol
   * WhatsApp baru berarti memakai helper ini, dan pencatatannya ikut sendiri.
   * `source` hanya masuk ke GA4 — dipakai untuk memisahkan tombol mana yang
   * menghasilkan percakapan, jadi berilah nama yang menjelaskan letaknya.
   *
   * **Pencatatannya sedang tidak sampai ke mana pun.** Sejak 20 Agustus 2026
   * gtag hanya terpasang di halaman iklan, sedangkan seluruh pemakaian `cta()`
   * ada di web utama (`/contact` dan `/q/[token]`) — jadi `onClick` di bawah
   * berjalan lalu berhenti di penjaga `typeof window.gtag !== 'function'`.
   * Sengaja tidak dihapus: biayanya nol, dan kalau tim ads meminta tagnya
   * kembali sitewide, pencatatannya hidup lagi tanpa ada tombol yang terlewat.
   */
  const cta = (source: string, message?: string) => ({
    href: link(message),
    onClick: () => reportWhatsappClick(source),
  })

  return {
    number: SITE.whatsappNumber,
    link,
    cta,
  }
}

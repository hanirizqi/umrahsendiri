import {
  GA4_MEASUREMENT_ID,
  WHATSAPP_CLICK_CONVERSION,
  WHATSAPP_FORM_CONVERSION,
} from '~/constants/analytics'
import { tagDestinations } from '~/composables/useGoogleTag'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Tujuan yang terpasang di halaman tempat event ini dipanggil.
 *
 * Halaman iklan dan situs utama tidak memuat tujuan yang sama, sedangkan
 * `ContactForm` dan tombol WhatsApp dipakai di keduanya — jadi tujuannya tidak
 * bisa ditetapkan sekali di berkas ini. Dibaca dari `location` dan bukan dari
 * `useRoute()` karena seluruh pemanggil di bawah adalah penangan event, yang
 * berjalan di luar konteks setup sebuah komponen.
 *
 * Aturannya sendiri ada di `tagDestinations()`, satu berkas dengan pemasangan
 * tagnya, supaya keduanya tidak bisa berbeda pendapat.
 */
function here() {
  if (typeof window === 'undefined') return { ads: '', ga4: GA4_MEASUREMENT_ID }
  return tagDestinations(window.location.pathname)
}

/**
 * gtag selalu ada sebagai fungsi begitu cuplikan `useGoogleTag()` berjalan,
 * tapi pemanggilnya tetap dijaga: pemblokir iklan bisa menghapusnya sebelum
 * kita sempat memakainya, dan pencatatan yang gagal tidak boleh mengganggu
 * jemaah. Halaman admin sengaja tidak memasang tag sama sekali.
 */
function send(...args: unknown[]) {
  if (typeof window.gtag !== 'function') return false
  window.gtag(...args)
  return true
}

/**
 * Menunggu satu konversi benar-benar terkirim.
 *
 * Hanya perlu dipakai kalau halaman ini akan ditinggalkan di tab yang sama —
 * kalau tautannya membuka tab baru, halaman tetap hidup dan permintaannya
 * selesai sendiri tanpa siapa pun menunggu. Batas waktu 1 detik menjaga jemaah
 * dari menunggu tanpa ujung saat gtag ditahan pemblokir iklan.
 */
function sendAndWait(sendTo: string): Promise<void> {
  return new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }

    const dispatched = send('event', 'conversion', {
      send_to: sendTo,
      event_callback: finish,
    })

    if (!dispatched) {
      finish()
      return
    }

    setTimeout(finish, 1000)
  })
}

/**
 * Tombol di halaman iklan yang menggulir ke form, bukan membuka WhatsApp.
 *
 * Sengaja **tidak** melaporkan konversi ke Google Ads: tidak ada percakapan
 * WhatsApp yang dimulai di sini, dan melaporkannya sebagai klik WhatsApp berarti
 * mengaku ada konversi yang tidak terjadi. Cukup dicatat di GA4 supaya terlihat
 * tombol mana yang benar-benar membawa orang ke form.
 */
export function reportFormCtaClick(source: string) {
  send('event', 'cta_to_form', { send_to: here().ga4, source })
}

/**
 * Klik tombol WhatsApp mana pun di situs publik. `source` menandai tombol yang
 * diklik, supaya di GA4 terlihat tombol mana yang menghasilkan percakapan.
 *
 * Google Ads baru ikut dilapori setelah conversion action-nya sendiri dibuat —
 * alasannya ada di `~/constants/analytics`.
 */
export function reportWhatsappClick(source: string) {
  send('event', 'whatsapp_click', { send_to: here().ga4, source })
  if (here().ads && WHATSAPP_CLICK_CONVERSION) {
    send('event', 'conversion', { send_to: WHATSAPP_CLICK_CONVERSION })
  }
}

/** Sama dengan di atas, untuk tautan yang berpindah di tab yang sama. */
export function reportWhatsappClickBeforeLeaving(source: string): Promise<void> {
  send('event', 'whatsapp_click', { send_to: here().ga4, source })
  if (!here().ads || !WHATSAPP_CLICK_CONVERSION) return Promise.resolve()
  return sendAndWait(WHATSAPP_CLICK_CONVERSION)
}

/**
 * Pengiriman form kontak yang berhasil tersimpan sebagai lead.
 *
 * Ditunggu hanya kalau memang ada yang dilaporkan ke Google Ads — setelahnya
 * jemaah langsung berpindah ke WhatsApp di tab yang sama. Selama labelnya
 * belum ada, jangan menahan perpindahan itu barang sedetik pun demi permintaan
 * yang tidak dikirim.
 */
export function reportWhatsappFormConversion(): Promise<void> {
  send('event', 'generate_lead', { send_to: here().ga4 })
  if (!here().ads || !WHATSAPP_FORM_CONVERSION) return Promise.resolve()
  return sendAndWait(WHATSAPP_FORM_CONVERSION)
}

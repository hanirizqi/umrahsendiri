import {
  GA4_MEASUREMENT_ID,
  WHATSAPP_CLICK_CONVERSION_LABEL,
  WHATSAPP_FORM_CONVERSION_LABEL,
} from '~/constants/analytics'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * gtag selalu ada sebagai fungsi begitu cuplikan di nuxt.config berjalan, tapi
 * pemanggilnya tetap dijaga: pemblokir iklan bisa menghapusnya sebelum kita
 * sempat memakainya, dan pencatatan yang gagal tidak boleh mengganggu jemaah.
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
function sendAndWait(label: string): Promise<void> {
  return new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }

    const dispatched = send('event', 'conversion', {
      send_to: label,
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
 * Klik tombol WhatsApp mana pun di situs publik. `source` menandai tombol yang
 * diklik, supaya di GA4 terlihat tombol mana yang menghasilkan percakapan.
 */
export function reportWhatsappClick(source: string) {
  send('event', 'conversion', { send_to: WHATSAPP_CLICK_CONVERSION_LABEL })
  send('event', 'whatsapp_click', { send_to: GA4_MEASUREMENT_ID, source })
}

/** Sama dengan di atas, untuk tautan yang berpindah di tab yang sama. */
export function reportWhatsappClickBeforeLeaving(source: string): Promise<void> {
  send('event', 'whatsapp_click', { send_to: GA4_MEASUREMENT_ID, source })
  return sendAndWait(WHATSAPP_CLICK_CONVERSION_LABEL)
}

/**
 * Pengiriman form kontak yang berhasil tersimpan sebagai lead. Selalu ditunggu:
 * setelahnya jemaah langsung berpindah ke WhatsApp di tab yang sama.
 */
export function reportWhatsappFormConversion(): Promise<void> {
  send('event', 'generate_lead', { send_to: GA4_MEASUREMENT_ID })
  return sendAndWait(WHATSAPP_FORM_CONVERSION_LABEL)
}

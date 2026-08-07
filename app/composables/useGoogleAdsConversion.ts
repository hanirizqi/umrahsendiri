declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const WHATSAPP_FORM_CONVERSION_LABEL = 'AW-18371371265/5UjdCObQ9tscEIHCk7hE'

/**
 * Mencatat konversi ke Google Ads, lalu selesai.
 *
 * Perpindahan ke WhatsApp sengaja bukan urusan fungsi ini — pemanggilnya yang
 * menentukan kapan berpindah, supaya penyimpanan lead bisa dipastikan berhasil
 * lebih dulu. Ada batas waktu 1 detik agar pemblokir iklan yang menahan gtag
 * tidak membuat jemaah menunggu tanpa ujung.
 */
export function reportWhatsappFormConversion(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window.gtag !== 'function') {
      resolve()
      return
    }

    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }

    window.gtag('event', 'conversion', {
      send_to: WHATSAPP_FORM_CONVERSION_LABEL,
      event_callback: finish,
    })

    setTimeout(finish, 1000)
  })
}

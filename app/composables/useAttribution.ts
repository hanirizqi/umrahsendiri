export interface Attribution {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  gclid?: string
  gaClientId?: string
  landingPage?: string
  referrer?: string
}

const STORAGE_KEY = 'us_attr'

/**
 * Asal-usul pengunjung hanya ada di URL kunjungan pertama. Begitu ia berpindah
 * dari /konsultasi ke /contact, parameternya hilang — jadi ditangkap sekali lalu
 * disimpan selama sesi peramban.
 *
 * Kunjungan pertama menang: kalau seseorang datang dari iklan lalu kembali lagi
 * secara langsung di sesi yang sama, kredit tetap pada iklan yang membawanya.
 */
export function useAttribution() {
  function capture() {
    if (import.meta.server) return

    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return

      const params = new URLSearchParams(window.location.search)
      const pick = (key: string) => params.get(key)?.slice(0, 255) || undefined

      const data: Attribution = {
        utmSource: pick('utm_source'),
        utmMedium: pick('utm_medium'),
        utmCampaign: pick('utm_campaign'),
        utmTerm: pick('utm_term'),
        utmContent: pick('utm_content'),
        gclid: pick('gclid'),
        landingPage: window.location.pathname + window.location.search,
        referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
      }

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
    catch {
      // sessionStorage bisa diblokir (mode privat, pengaturan ketat).
      // Atribusi hilang, tapi form harus tetap bisa dikirim.
    }
  }

  function read(): Attribution {
    if (import.meta.server) return {}

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      const stored: Attribution = raw ? JSON.parse(raw) : {}
      return { ...stored, gaClientId: readGaClientId() }
    }
    catch {
      return {}
    }
  }

  /**
   * client_id GA4 tersimpan di cookie _ga dengan format GA1.1.<id>.<timestamp>.
   * Dibaca saat pengiriman, bukan saat kedatangan, karena skrip GA mungkin
   * belum termuat pada kunjungan pertama.
   */
  function readGaClientId(): string | undefined {
    const match = document.cookie.match(/_ga=GA\d\.\d\.(\d+\.\d+)/)
    return match?.[1]
  }

  return { capture, read }
}

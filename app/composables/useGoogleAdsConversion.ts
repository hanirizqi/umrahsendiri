declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const WHATSAPP_FORM_CONVERSION_LABEL = 'AW-18371371265/5UjdCObQ9tscEIHCk7hE'

export function reportWhatsappFormConversion(url: string) {
  let navigated = false
  const navigate = () => {
    if (navigated) return
    navigated = true
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (typeof window.gtag !== 'function') {
    navigate()
    return
  }

  window.gtag('event', 'conversion', {
    send_to: WHATSAPP_FORM_CONVERSION_LABEL,
    event_callback: navigate,
  })

  setTimeout(navigate, 1000)
}

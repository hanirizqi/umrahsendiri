export const SITE = {
  name: 'UmrahSendiri',
  tagline: 'Umrah Mandiri Planner',
  domain: 'umrahsendiri.com',
  url: 'https://umrahsendiri.com',
  email: 'umrahsendiri.official@gmail.com',
  whatsappNumber: '6281190000283',
  whatsappDefaultMessage: 'Assalamualaikum, saya ingin konsultasi rencana umrah mandiri saya.',
  instagram: 'https://instagram.com/umrah_sendiri',
} as const

export function buildWhatsappLink(message?: string): string {
  const text = encodeURIComponent(message ?? SITE.whatsappDefaultMessage)
  return `https://wa.me/${SITE.whatsappNumber}?text=${text}`
}

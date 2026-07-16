import { SITE, buildWhatsappLink } from '~/constants/site'

export function useWhatsapp() {
  const link = (message?: string) => buildWhatsappLink(message)

  return {
    number: SITE.whatsappNumber,
    link,
  }
}

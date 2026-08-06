import type { NavLink } from '~/types'

export const MAIN_NAV: NavLink[] = [
  { label: 'Beranda', to: '/' },
  { label: 'Tentang', to: '/tentang' },
  { label: 'Layanan', to: '/layanan' },
  { label: 'Cara Kerja', to: '/cara-kerja' },
  { label: 'Artikel', to: '/artikel' },
  { label: 'FAQ', to: '/faq' },
]

export const FOOTER_NAV: NavLink[] = [
  ...MAIN_NAV,
  { label: 'Kontak', to: '/kontak' },
]

export const LEGAL_NAV: NavLink[] = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms' },
]

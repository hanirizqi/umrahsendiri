import type { NavLink } from '~/types'

export const MAIN_NAV: NavLink[] = [
  { label: 'Beranda', to: '/' },
  { label: 'Tentang', to: '/about' },
  { label: 'Layanan', to: '/services' },
  { label: 'Cara Kerja', to: '/how-it-works' },
  { label: 'Artikel', to: '/articles' },
  { label: 'FAQ', to: '/faq' },
]

export const LEGAL_NAV: NavLink[] = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms' },
]

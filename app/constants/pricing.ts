import type { PricingTier } from '~/types'

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    tagline: 'Untuk yang ingin mencoba menyusun rencana sendiri',
    price: 'Rp 750rb',
    priceNote: '/ perencanaan',
    features: ['1 sesi konsultasi', 'Itinerary dasar', 'Estimasi biaya', 'Checklist persiapan'],
    ctaLabel: 'Mulai Starter',
  },
  {
    name: 'Personal',
    tagline: 'Perencanaan lengkap untuk perjalanan individu',
    price: 'Rp 1.5jt',
    priceNote: '/ perencanaan',
    features: ['3 sesi konsultasi', 'Itinerary detail', 'Rekomendasi hotel & transportasi', 'Checklist & pengingat dokumen'],
    highlighted: true,
    ctaLabel: 'Mulai Personal',
  },
  {
    name: 'Family',
    tagline: 'Untuk keluarga atau kelompok kecil',
    price: 'Rp 2.5jt',
    priceNote: '/ perencanaan',
    features: ['Konsultasi tak terbatas', 'Itinerary multi-anggota', 'Koordinasi hotel & transportasi grup', 'Pendampingan hingga keberangkatan'],
    ctaLabel: 'Mulai Family',
  },
  {
    name: 'Enterprise',
    tagline: 'Untuk komunitas, kantor, atau grup besar',
    price: 'Custom',
    priceNote: 'sesuai kebutuhan',
    features: ['Tim dedicated', 'Perencanaan multi-grup', 'Laporan & koordinasi terpusat', 'SLA respons prioritas'],
    ctaLabel: 'Hubungi Kami',
  },
]

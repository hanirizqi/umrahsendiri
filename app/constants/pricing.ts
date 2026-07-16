import type { PricingTier } from '~/types'

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    tagline: 'Untuk yang ingin mencoba menyusun rencana sendiri',
    features: ['1 sesi konsultasi', 'Itinerary dasar', 'Estimasi biaya', 'Checklist persiapan'],
    ctaLabel: 'Diskusi Starter',
  },
  {
    name: 'Personal',
    tagline: 'Perencanaan lengkap untuk perjalanan individu',
    features: ['3 sesi konsultasi', 'Itinerary detail', 'Rekomendasi hotel & transportasi', 'Checklist & pengingat dokumen'],
    highlighted: true,
    ctaLabel: 'Diskusi Personal',
  },
  {
    name: 'Family',
    tagline: 'Untuk keluarga atau kelompok kecil',
    features: ['Konsultasi tak terbatas', 'Itinerary multi-anggota', 'Koordinasi hotel & transportasi grup', 'Pendampingan hingga keberangkatan'],
    ctaLabel: 'Diskusi Family',
  },
  {
    name: 'Enterprise',
    tagline: 'Untuk komunitas, kantor, atau grup besar',
    features: ['Tim dedicated', 'Perencanaan multi-grup', 'Laporan & koordinasi terpusat', 'SLA respons prioritas'],
    ctaLabel: 'Hubungi Kami',
  },
]

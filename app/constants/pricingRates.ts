// Sumber: docs/PRICING.md — LPP (Land Package Private) Periode September 2026.
// Harga per jemaah. Perbarui manual setiap LPP baru terbit, cek docs/PRICING.md dulu untuk versi terbaru.

export type Occupancy = 1 | 2 | 3 | 4
export type HotelTier = 3 | 4 | 5

export const OCCUPANCY_LABEL: Record<Occupancy, string> = {
  1: 'Sendiri',
  2: 'Berdua',
  3: 'Bertiga',
  4: 'Berempat',
}

export const PAKET_DASAR_RATE: Record<Occupancy, number> = {
  1: 11_500_000,
  2: 7_350_000,
  3: 6_566_667,
  4: 5_750_000,
}

export const HOTEL_RATE: Record<HotelTier, { makkah: Record<Occupancy, number>, madinah: Record<Occupancy, number> }> = {
  3: {
    makkah: { 1: 4_350_000, 2: 2_175_000, 3: 1_700_000, 4: 1_450_000 },
    madinah: { 1: 3_100_000, 2: 1_550_000, 3: 1_150_000, 4: 965_000 },
  },
  4: {
    makkah: { 1: 5_100_000, 2: 2_550_000, 3: 1_865_000, 4: 1_540_000 },
    madinah: { 1: 3_850_000, 2: 1_925_000, 3: 1_435_000, 4: 1_190_000 },
  },
  5: {
    makkah: { 1: 6_750_000, 2: 3_375_000, 3: 2_665_000, 4: 2_200_000 },
    madinah: { 1: 4_950_000, 2: 2_475_000, 3: 1_950_000, 4: 1_700_000 },
  },
}

export const ADDON_RATE = {
  handlingBandara: { label: 'Handling Bandara PP', rate: { 1: 650_000, 2: 650_000, 3: 650_000, 4: 650_000 } as Record<Occupancy, number>, perDay: false },
  pembimbing: { label: 'Pemandu / Pembimbing', rate: { 1: 1_400_000, 2: 700_000, 3: 475_000, 4: 350_000 } as Record<Occupancy, number>, perDay: true },
  jabalKhandamah: { label: 'Transport Jabal Khandamah PP', rate: { 1: 1_000_000, 2: 500_000, 3: 350_000, 4: 250_000 } as Record<Occupancy, number>, perDay: false },
  cityTour: { label: 'City Tour Makkah', rate: { 1: 3_550_000, 2: 1_800_000, 3: 1_300_000, 4: 950_000 } as Record<Occupancy, number>, perDay: false },
} as const

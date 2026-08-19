import type { RatePeriodDefinition } from './types'

/**
 * LPP September 2026.
 *
 * Hotel diperbarui 19 Agustus 2026 dari dokumen resmi LA Basic Private
 * September 2026 milik Musafirin, menggantikan estimasi sebelumnya. Tarif per
 * malam Makkah terkonfirmasi dari brosur rekanan; tarif Madinah masih turunan
 * dari total bundel 9 hari dan belum dikutip resmi — lihat catatan transparansi
 * di `docs/PRICING.md`.
 *
 * Semua angka **per jemaah**. Kolom pertama (okupansi 1) selalu dua kali lipat
 * kolom kedua untuk hotel: satu orang menanggung kamar yang biasanya dibagi dua.
 */
export const RATE_PERIOD_2026_09: RatePeriodDefinition = {
  code: '2026-09',
  label: 'LPP September 2026',
  effectiveFrom: '2026-09-01',
  isPublished: true,
  note: 'Hotel dari dokumen resmi LA Basic Private September 2026 (Musafirin). Tarif Madinah masih turunan, lihat docs/PRICING.md.',

  flat: {
    paket_dasar: [11_500_000, 7_350_000, 6_566_667, 5_750_000],
    handling_bandara: [650_000, 650_000, 650_000, 650_000],
    pembimbing: [1_400_000, 700_000, 475_000, 350_000],
    jabal_khandamah: [1_000_000, 500_000, 350_000, 250_000],
    city_tour: [3_550_000, 1_800_000, 1_300_000, 950_000],
  },

  hotel: {
    // Bintang 3 — Grand Al Massa (Makkah), Kingsgate Durrat (Madinah)
    3: {
      makkah: [2_700_000, 1_350_000, 1_000_000, 825_000],
      madinah: [3_450_000, 1_725_000, 1_183_333, 950_000],
    },
    // Bintang 4 — Maysan Al Mashaer (Makkah), Kingsgate Deyar (Madinah)
    4: {
      makkah: [3_400_000, 1_700_000, 1_283_333, 1_087_500],
      madinah: [3_300_000, 1_650_000, 1_200_000, 987_500],
    },
    // Bintang 5 — Movenpick Hajar (Makkah, tidak berganti), Venue Al Harithia (Madinah)
    5: {
      makkah: [6_750_000, 3_375_000, 2_666_667, 2_200_000],
      madinah: [5_500_000, 2_750_000, 2_083_333, 2_012_500],
    },
  },
}

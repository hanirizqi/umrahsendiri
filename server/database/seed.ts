import { eq, sql } from 'drizzle-orm'
import { ratePeriods, rates, services } from './schema'

/**
 * Katalog layanan dan tarif LPP.
 *
 * Ini sumber kebenaran tarif untuk saat ini: perbarui angkanya di sini, deploy,
 * dan tarif produksi ikut diperbarui. Begitu ada layar pengelola tarif di panel
 * admin, penyemaian otomatis di server/plugins/migrate.ts harus dimatikan supaya
 * tidak menimpa perubahan yang dilakukan lewat panel.
 */

const SERVICES = [
  {
    code: 'paket_dasar',
    name: 'Paket Dasar',
    description: 'Transportasi 3 rute (Bandara Jeddah–Makkah Hotel, Makkah Hotel–Madinah Hotel, Madinah Hotel–Bandara Jeddah), paket dokumen wajib (Visa Umrah, Siskopatuh, Asuransi Kesehatan Arab Saudi), dan pembimbing umrah + manasik online (untuk 1x pelaksanaan umrah).',
    pricingUnit: 'per_pax',
    needsHotelTier: false,
    sortOrder: 1,
  },
  {
    code: 'hotel',
    name: 'Hotel (termasuk makan 3x sehari)',
    description: null,
    pricingUnit: 'per_pax_malam',
    needsHotelTier: true,
    sortOrder: 2,
  },
  {
    code: 'pembimbing',
    name: 'Pemandu / Pembimbing Tambahan',
    description: 'Tarif per hari, maksimal 9 jam. Pembimbing WNI (orang Indonesia).',
    pricingUnit: 'per_pax_hari',
    needsHotelTier: false,
    sortOrder: 3,
  },
  {
    code: 'handling_bandara',
    name: 'Handling Bandara PP',
    description: 'Termasuk makan saat kedatangan dan kepulangan, serta air zamzam saat kepulangan.',
    pricingUnit: 'per_pax',
    needsHotelTier: false,
    sortOrder: 4,
  },
  {
    code: 'jabal_khandamah',
    name: 'Transport Jabal Khandamah PP',
    description: 'Driver berbahasa Inggris.',
    pricingUnit: 'per_pax',
    needsHotelTier: false,
    sortOrder: 5,
  },
  {
    code: 'city_tour',
    name: 'City Tour Makkah',
    description: 'Driver berbahasa Inggris.',
    pricingUnit: 'per_pax',
    needsHotelTier: false,
    sortOrder: 6,
  },
]

const PERIOD = {
  code: '2026-09',
  label: 'LPP September 2026',
  effectiveFrom: new Date('2026-09-01'),
  isPublished: true,
  note: 'Disalin dari docs/PRICING.md. Perbarui tiap LPP baru terbit.',
}

/** Tarif per jemaah, rupiah penuh. Indeks array = okupansi 1..4. */
const FLAT: Record<string, number[]> = {
  paket_dasar: [11_500_000, 7_350_000, 6_566_667, 5_750_000],
  handling_bandara: [650_000, 650_000, 650_000, 650_000],
  pembimbing: [1_400_000, 700_000, 475_000, 350_000],
  jabal_khandamah: [1_000_000, 500_000, 350_000, 250_000],
  city_tour: [3_550_000, 1_800_000, 1_300_000, 950_000],
}

/** Hotel per malam, per jemaah — dipisah bintang dan kota. */
const HOTEL: Record<number, Record<string, number[]>> = {
  3: { makkah: [4_350_000, 2_175_000, 1_700_000, 1_450_000], madinah: [3_100_000, 1_550_000, 1_150_000, 965_000] },
  4: { makkah: [5_100_000, 2_550_000, 1_865_000, 1_540_000], madinah: [3_850_000, 1_925_000, 1_435_000, 1_190_000] },
  5: { makkah: [6_750_000, 3_375_000, 2_665_000, 2_200_000], madinah: [4_950_000, 2_475_000, 1_950_000, 1_700_000] },
}

/** Aman dijalankan berulang: baris dicocokkan lewat kunci alaminya. */
export async function seedCatalog(db: ReturnType<typeof useDb>) {
  for (const s of SERVICES) {
    await db.insert(services).values(s).onConflictDoUpdate({
      target: services.code,
      set: {
        name: s.name,
        description: s.description,
        pricingUnit: s.pricingUnit,
        needsHotelTier: s.needsHotelTier,
        sortOrder: s.sortOrder,
        updatedAt: new Date(),
      },
    })
  }

  await db.insert(ratePeriods).values(PERIOD).onConflictDoUpdate({
    target: ratePeriods.code,
    set: {
      label: PERIOD.label,
      effectiveFrom: PERIOD.effectiveFrom,
      isPublished: PERIOD.isPublished,
      note: PERIOD.note,
      updatedAt: new Date(),
    },
  })

  const [period] = await db.select().from(ratePeriods).where(eq(ratePeriods.code, PERIOD.code)).limit(1)
  if (!period) throw new Error('Periode tarif gagal dibuat.')

  const serviceRows = await db.select({ id: services.id, code: services.code }).from(services)
  const idByCode = new Map(serviceRows.map(s => [s.code, s.id]))

  const rows: typeof rates.$inferInsert[] = []

  for (const [code, amounts] of Object.entries(FLAT)) {
    const serviceId = idByCode.get(code)
    if (!serviceId) continue
    amounts.forEach((amount, i) => {
      rows.push({ ratePeriodId: period.id, serviceId, occupancy: i + 1, hotelTier: null, city: null, amount })
    })
  }

  const hotelId = idByCode.get('hotel')
  if (hotelId) {
    for (const [tier, cities] of Object.entries(HOTEL)) {
      for (const [city, amounts] of Object.entries(cities)) {
        amounts.forEach((amount, i) => {
          rows.push({ ratePeriodId: period.id, serviceId: hotelId, occupancy: i + 1, hotelTier: Number(tier), city, amount })
        })
      }
    }
  }

  // Diganti utuh, bukan di-upsert: hotel_tier dan city bernilai NULL untuk
  // layanan non-hotel, dan ON CONFLICT tidak pernah cocok pada kolom NULL —
  // sehingga tiap penyemaian justru akan menumpuk baris duplikat.
  await db.delete(rates).where(eq(rates.ratePeriodId, period.id))
  await db.insert(rates).values(rows)

  const [counted] = await db.select({ count: sql<number>`count(*)::int` }).from(rates)
  return { services: SERVICES.length, rates: counted?.count ?? 0 }
}

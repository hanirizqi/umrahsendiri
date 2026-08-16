import { eq, sql } from 'drizzle-orm'
import { ratePeriods, rates, services } from './schema'

/**
 * Katalog layanan dan tarif LPP awal.
 *
 * Sejak ada layar pengelola tarif di panel admin, berkas ini **bukan lagi sumber
 * kebenaran tarif** — panel yang memegangnya. Yang tersisa di sini adalah bekal
 * awal: katalog layanan, dan satu periode tarif untuk database yang masih kosong.
 *
 * Tarif hanya ditulis kalau periodenya belum punya tarif sama sekali. Tanpa
 * syarat itu, setiap deploy akan menghapus dan menulis ulang seluruh tarif
 * periode tersebut, dan pekerjaan yang dilakukan lewat panel lenyap tanpa
 * seorang pun tahu. Katalog layanan tetap di-upsert karena tidak disunting
 * lewat panel dan namanya ikut dipakai di halaman publik.
 */

const SERVICES = [
  {
    code: 'paket_dasar',
    name: 'Paket Dasar',
    /**
     * Bagian dokumen memakai kata yang sama dengan situs publik
     * ("pendampingan penyiapan dokumen"), tapi rinciannya tetap ditulis dalam
     * kurung. Deskripsi ini hanya tampil di panel admin, dan justru staf yang
     * paling butuh tahu persis apa yang jemaah terima — merekalah yang
     * menjawab di WhatsApp. Menyamakan katanya tanpa membuang rinciannya
     * membuat panel konsisten dengan situs tanpa membuat staf menebak-nebak.
     */
    description: 'Transportasi 3 rute (Bandara Jeddah–Makkah Hotel, Makkah Hotel–Madinah Hotel, Madinah Hotel–Bandara Jeddah), pendampingan penyiapan dokumen wajib (Visa Umrah, Siskopatuh, Asuransi Kesehatan Arab Saudi), dan pembimbing umrah + manasik online (untuk 1x pelaksanaan umrah).',
    pricingUnit: 'per_pax',
    needsHotelTier: false,
    category: 'inti',
    sortOrder: 1,
  },
  {
    code: 'hotel',
    name: 'Hotel',
    description: 'Termasuk makan 3x sehari.',
    pricingUnit: 'per_pax_malam',
    needsHotelTier: true,
    category: 'akomodasi',
    sortOrder: 2,
  },
  {
    code: 'pembimbing',
    name: 'Pemandu / Pembimbing Tambahan',
    description: 'Tarif per hari, maksimal 9 jam. Pembimbing WNI (orang Indonesia).',
    pricingUnit: 'per_pax_hari',
    needsHotelTier: false,
    category: 'tambahan',
    sortOrder: 3,
  },
  {
    code: 'handling_bandara',
    name: 'Handling Bandara PP',
    description: 'Termasuk makan saat kedatangan dan kepulangan, serta air zamzam saat kepulangan.',
    pricingUnit: 'per_pax',
    needsHotelTier: false,
    category: 'tambahan',
    sortOrder: 4,
  },
  {
    code: 'jabal_khandamah',
    name: 'Transport Jabal Khandamah PP',
    description: 'Driver berbahasa Inggris.',
    pricingUnit: 'per_pax',
    needsHotelTier: false,
    category: 'tambahan',
    sortOrder: 5,
  },
  {
    code: 'city_tour',
    name: 'City Tour Makkah',
    description: 'Driver berbahasa Inggris.',
    pricingUnit: 'per_pax',
    needsHotelTier: false,
    category: 'tambahan',
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
        category: s.category,
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

  /**
   * Hanya membekali periode yang masih kosong.
   *
   * Sekali periode ini punya tarif — entah dari penyemaian pertama atau dari
   * panel admin — berkas ini tidak pernah menyentuhnya lagi. Itulah yang
   * membuat tarif yang disunting lewat panel selamat dari deploy berikutnya,
   * sekaligus membuat database yang benar-benar baru tetap langsung bisa
   * membuat penawaran tanpa siapa pun mengisi apa pun lebih dulu.
   */
  const [existing] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(rates)
    .where(eq(rates.ratePeriodId, period.id))

  if (existing?.count) {
    return { services: SERVICES.length, rates: existing.count, seededRates: false }
  }

  await db.insert(rates).values(rows)

  return { services: SERVICES.length, rates: rows.length, seededRates: true }
}

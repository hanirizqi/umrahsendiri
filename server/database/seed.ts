import { eq, sql } from 'drizzle-orm'
import { RATE_PERIODS } from './rates'
import { ratePeriods, rates, services } from './schema'

/**
 * Katalog layanan, dan jalur masuk terbitan LPP baru.
 *
 * Terbitan LPP dideklarasikan di `server/database/rates/` lalu dimasukkan
 * sendiri saat aplikasi start — tidak perlu menyentuh panel dan tidak perlu
 * migrasi baru tiap bulan.
 *
 * Yang **tidak** dilakukan berkas ini: menyunting periode yang sudah ada
 * tarifnya. Begitu sebuah periode terisi, ia tidak pernah disentuh lagi, jadi
 * perubahan lewat `/admin/rates` selamat dari deploy berikutnya. Mengubah angka
 * di `rates/` untuk periode yang sudah terlanjur ada karena itu tidak
 * berpengaruh — perbaikannya lewat panel.
 *
 * Katalog layanan tetap di-upsert karena tidak disunting lewat panel dan
 * namanya ikut dipakai di halaman publik.
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

/**
 * Mengisi katalog layanan, lalu memasukkan tiap terbitan LPP yang belum ada.
 *
 * Aman dijalankan berulang. Periode yang sudah punya tarif — entah dari
 * penyemaian pertama atau dari panel admin — tidak pernah disentuh lagi, jadi
 * suntingan lewat `/admin/rates` selamat dari deploy berikutnya sementara
 * database baru tetap langsung bisa membuat penawaran.
 */
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

  const serviceRows = await db.select({ id: services.id, code: services.code }).from(services)
  const idByCode = new Map(serviceRows.map(s => [s.code, s.id]))

  const seeded: string[] = []

  for (const def of RATE_PERIODS) {
    await db.insert(ratePeriods).values({
      code: def.code,
      label: def.label,
      effectiveFrom: new Date(def.effectiveFrom),
      isPublished: def.isPublished,
      note: def.note,
    }).onConflictDoNothing({ target: ratePeriods.code })

    const [period] = await db.select().from(ratePeriods)
      .where(eq(ratePeriods.code, def.code)).limit(1)
    if (!period) continue

    const [existing] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(rates)
      .where(eq(rates.ratePeriodId, period.id))
    if (existing?.count) continue

    const rows: typeof rates.$inferInsert[] = []

    for (const [code, amounts] of Object.entries(def.flat)) {
      const serviceId = idByCode.get(code)
      if (!serviceId) continue
      amounts.forEach((amount, i) => {
        rows.push({ ratePeriodId: period.id, serviceId, occupancy: i + 1, hotelTier: null, city: null, amount })
      })
    }

    const hotelId = idByCode.get('hotel')
    if (hotelId) {
      for (const [tier, cities] of Object.entries(def.hotel)) {
        for (const [city, amounts] of Object.entries(cities)) {
          amounts.forEach((amount, i) => {
            rows.push({ ratePeriodId: period.id, serviceId: hotelId, occupancy: i + 1, hotelTier: Number(tier), city, amount })
          })
        }
      }
    }

    if (rows.length) {
      await db.insert(rates).values(rows)
      seeded.push(`${def.code} (${rows.length} tarif)`)
    }
  }

  const [counted] = await db.select({ count: sql<number>`count(*)::int` }).from(rates)
  return { services: SERVICES.length, rates: counted?.count ?? 0, seeded }
}

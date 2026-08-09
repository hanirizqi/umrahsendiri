import { eq } from 'drizzle-orm'
import { ratePeriods, rates, services } from '../../../database/schema'

interface IncomingRate {
  serviceId?: unknown
  occupancy?: unknown
  hotelTier?: unknown
  city?: unknown
  amount?: unknown
}

const CITIES = ['makkah', 'madinah'] as const

/**
 * Menyimpan seluruh isi satu periode sekaligus: keterangan periode dan
 * daftar tarifnya.
 *
 * Tarif diganti utuh, bukan disunting baris per baris. Jumlah barisnya memang
 * berubah antar periode — layanan bisa bertambah, bintang hotel bisa berkurang —
 * jadi "hapus lalu tulis ulang" adalah satu-satunya cara yang menghasilkan isi
 * persis seperti yang terlihat di layar. Menyamakan baris satu per satu juga
 * tidak bisa diandalkan di sini: `hotel_tier` dan `city` bernilai NULL untuk
 * layanan non-hotel, dan Postgres menganggap NULL tidak pernah sama dengan NULL.
 *
 * Semuanya di dalam satu transaksi, supaya kegagalan di tengah tidak
 * meninggalkan periode tanpa tarif sama sekali.
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID tidak valid.' })

  const body = await readBody<{
    label?: unknown
    effectiveFrom?: unknown
    note?: unknown
    isPublished?: unknown
    rates?: unknown
  }>(event)

  const db = useDb()

  const [period] = await db.select().from(ratePeriods).where(eq(ratePeriods.id, id)).limit(1)
  if (!period) throw createError({ statusCode: 404, statusMessage: 'Periode tidak ditemukan.' })

  const known = await db.select({ id: services.id, needsHotelTier: services.needsHotelTier }).from(services)
  const serviceById = new Map(known.map(s => [s.id, s]))

  const incoming = Array.isArray(body?.rates) ? body.rates as IncomingRate[] : []

  const rows: typeof rates.$inferInsert[] = []
  const seen = new Set<string>()

  for (const row of incoming) {
    const serviceId = typeof row?.serviceId === 'string' ? row.serviceId : ''
    const service = serviceById.get(serviceId)
    if (!service) continue

    const occupancy = Number(row?.occupancy)
    if (!Number.isInteger(occupancy) || occupancy < 1 || occupancy > 4) continue

    const amount = Number(row?.amount)
    if (!Number.isFinite(amount) || amount < 0) continue

    // Bintang hotel tidak dibatasi 3–5: periode berikutnya bisa saja hanya
    // menawarkan bintang 2, atau menambah bintang yang belum pernah ada.
    const tierRaw = Number(row?.hotelTier)
    const hotelTier = service.needsHotelTier && Number.isInteger(tierRaw) && tierRaw >= 1 && tierRaw <= 7
      ? tierRaw
      : null
    if (service.needsHotelTier && hotelTier === null) continue

    const city = service.needsHotelTier && CITIES.includes(row?.city as typeof CITIES[number])
      ? row.city as string
      : null
    if (service.needsHotelTier && !city) continue

    // Baris kembar akan lolos ke database dan menghasilkan tarif ganda untuk
    // kombinasi yang sama, yang mana yang dipakai jadi bergantung urutan baca.
    const key = `${serviceId}|${occupancy}|${hotelTier ?? ''}|${city ?? ''}`
    if (seen.has(key)) continue
    seen.add(key)

    rows.push({ ratePeriodId: id, serviceId, occupancy, hotelTier, city, amount: Math.round(amount) })
  }

  const label = typeof body?.label === 'string' && body.label.trim()
    ? body.label.trim().slice(0, 120)
    : period.label

  const effectiveFrom = typeof body?.effectiveFrom === 'string' && !Number.isNaN(new Date(body.effectiveFrom).getTime())
    ? new Date(body.effectiveFrom)
    : period.effectiveFrom

  const isPublished = typeof body?.isPublished === 'boolean' ? body.isPublished : period.isPublished

  // Periode terbit tanpa tarif akan dipilih pembuat penawaran lalu menggagalkannya,
  // dan pesannya menyesatkan karena periodenya jelas ada.
  if (isPublished && !rows.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Periode tanpa tarif tidak bisa diterbitkan.',
    })
  }

  await db.transaction(async (tx) => {
    await tx.update(ratePeriods)
      .set({
        label,
        effectiveFrom,
        note: typeof body?.note === 'string' ? body.note.trim().slice(0, 500) || null : period.note,
        isPublished,
        updatedAt: new Date(),
      })
      .where(eq(ratePeriods.id, id))

    await tx.delete(rates).where(eq(rates.ratePeriodId, id))
    if (rows.length) await tx.insert(rates).values(rows)
  })

  return { id, saved: rows.length, skipped: incoming.length - rows.length, isPublished }
})

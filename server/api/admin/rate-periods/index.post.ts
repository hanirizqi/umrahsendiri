import { eq } from 'drizzle-orm'
import { ratePeriods, rates } from '../../../database/schema'

/**
 * Periode LPP baru, boleh kosong atau menyalin isi periode lain.
 *
 * Periode baru selalu lahir belum terbit. Tarif bulan depan sering disiapkan
 * sebelum waktunya berlaku, dan penawaran memakai periode terbit dengan
 * `effectiveFrom` terbaru — kalau langsung terbit, tarif yang belum selesai
 * disunting sudah dipakai menghitung penawaran jemaah.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{
    code?: unknown
    label?: unknown
    effectiveFrom?: unknown
    note?: unknown
    copyFromId?: unknown
  }>(event)

  const code = typeof body?.code === 'string' ? body.code.trim().slice(0, 40) : ''
  const label = typeof body?.label === 'string' ? body.label.trim().slice(0, 120) : ''
  const effectiveFromRaw = typeof body?.effectiveFrom === 'string' ? body.effectiveFrom : ''
  const note = typeof body?.note === 'string' ? body.note.trim().slice(0, 500) || null : null
  const copyFromId = typeof body?.copyFromId === 'string' ? body.copyFromId : null

  if (!code || !label) {
    throw createError({ statusCode: 400, statusMessage: 'Kode dan label periode wajib diisi.' })
  }

  const effectiveFrom = new Date(effectiveFromRaw)
  if (Number.isNaN(effectiveFrom.getTime())) {
    throw createError({ statusCode: 400, statusMessage: 'Tanggal berlaku tidak valid.' })
  }

  const db = useDb()

  const [duplicate] = await db.select({ id: ratePeriods.id })
    .from(ratePeriods).where(eq(ratePeriods.code, code)).limit(1)
  if (duplicate) {
    throw createError({ statusCode: 409, statusMessage: `Kode "${code}" sudah dipakai periode lain.` })
  }

  return await db.transaction(async (tx) => {
    const [period] = await tx.insert(ratePeriods).values({
      code,
      label,
      effectiveFrom,
      note,
      isPublished: false,
    }).returning()

    if (!period) throw createError({ statusCode: 500, statusMessage: 'Gagal membuat periode.' })

    let copied = 0
    if (copyFromId) {
      const source = await tx.select().from(rates).where(eq(rates.ratePeriodId, copyFromId))
      if (source.length) {
        await tx.insert(rates).values(source.map(r => ({
          ratePeriodId: period.id,
          serviceId: r.serviceId,
          occupancy: r.occupancy,
          hotelTier: r.hotelTier,
          city: r.city,
          amount: r.amount,
        })))
        copied = source.length
      }
    }

    return { id: period.id, code: period.code, copied }
  })
})

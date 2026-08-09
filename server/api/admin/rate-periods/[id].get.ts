import { asc, eq } from 'drizzle-orm'
import { ratePeriods, rates, services } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID tidak valid.' })

  const db = useDb()

  const [period] = await db.select().from(ratePeriods).where(eq(ratePeriods.id, id)).limit(1)
  if (!period) throw createError({ statusCode: 404, statusMessage: 'Periode tidak ditemukan.' })

  const periodRates = await db
    .select({
      serviceId: rates.serviceId,
      occupancy: rates.occupancy,
      hotelTier: rates.hotelTier,
      city: rates.city,
      amount: rates.amount,
    })
    .from(rates)
    .where(eq(rates.ratePeriodId, id))

  // Seluruh katalog ikut dikirim, bukan hanya layanan yang sudah punya tarif:
  // periode berikutnya bisa saja menambah layanan yang belum pernah ditarifkan.
  const catalog = await db
    .select({
      id: services.id,
      code: services.code,
      name: services.name,
      description: services.description,
      pricingUnit: services.pricingUnit,
      needsHotelTier: services.needsHotelTier,
      category: services.category,
      isActive: services.isActive,
      sortOrder: services.sortOrder,
    })
    .from(services)
    .orderBy(asc(services.sortOrder))

  return { period, rates: periodRates, catalog }
})

import { eq } from 'drizzle-orm'
import { leadServiceSelections, leads, services } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID tidak valid.' })

  const db = useDb()

  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1)
  if (!lead) throw createError({ statusCode: 404, statusMessage: 'Lead tidak ditemukan.' })

  const selections = await db
    .select({
      code: services.code,
      name: services.name,
      pricingUnit: services.pricingUnit,
      hotelTier: leadServiceSelections.hotelTier,
      quantity: leadServiceSelections.quantity,
      sortOrder: services.sortOrder,
    })
    .from(leadServiceSelections)
    .innerJoin(services, eq(services.id, leadServiceSelections.serviceId))
    .where(eq(leadServiceSelections.leadId, id))
    .orderBy(services.sortOrder)

  return { lead, selections }
})

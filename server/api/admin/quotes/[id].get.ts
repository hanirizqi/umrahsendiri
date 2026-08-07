import { asc, eq } from 'drizzle-orm'
import { leads, quoteItems, quotes, ratePeriods } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID tidak valid.' })

  const db = useDb()

  const [row] = await db
    .select({
      quote: quotes,
      lead: {
        id: leads.id,
        leadNumber: leads.leadNumber,
        name: leads.name,
        phone: leads.phone,
        departureTarget: leads.departureTarget,
      },
      periodLabel: ratePeriods.label,
    })
    .from(quotes)
    .innerJoin(leads, eq(leads.id, quotes.leadId))
    .innerJoin(ratePeriods, eq(ratePeriods.id, quotes.ratePeriodId))
    .where(eq(quotes.id, id))
    .limit(1)

  if (!row) throw createError({ statusCode: 404, statusMessage: 'Penawaran tidak ditemukan.' })

  const items = await db
    .select()
    .from(quoteItems)
    .where(eq(quoteItems.quoteId, id))
    .orderBy(asc(quoteItems.sortOrder))

  return { ...row, items }
})

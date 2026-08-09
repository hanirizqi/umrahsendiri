import { count, desc, eq } from 'drizzle-orm'
import { ratePeriods, rates } from '../../../database/schema'

export default defineEventHandler(async () => {
  const db = useDb()

  const rows = await db
    .select({
      id: ratePeriods.id,
      code: ratePeriods.code,
      label: ratePeriods.label,
      effectiveFrom: ratePeriods.effectiveFrom,
      isPublished: ratePeriods.isPublished,
      note: ratePeriods.note,
      updatedAt: ratePeriods.updatedAt,
      rateCount: count(rates.id),
    })
    .from(ratePeriods)
    .leftJoin(rates, eq(rates.ratePeriodId, ratePeriods.id))
    .groupBy(ratePeriods.id)
    .orderBy(desc(ratePeriods.effectiveFrom))

  return { periods: rows }
})

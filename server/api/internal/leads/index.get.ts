import { desc, eq, isNull, sql } from 'drizzle-orm'
import { leads } from '../../../database/schema'

export const LEAD_STATUSES = ['baru', 'dihubungi', 'ditawarkan', 'menang', 'kalah'] as const

export default defineEventHandler(async (event) => {
  const db = useDb()
  const query = getQuery(event)
  const status = typeof query.status === 'string' ? query.status : ''

  const conditions = [isNull(leads.deletedAt)]
  if (LEAD_STATUSES.includes(status as typeof LEAD_STATUSES[number])) {
    conditions.push(eq(leads.status, status))
  }

  const rows = await db
    .select({
      id: leads.id,
      leadNumber: leads.leadNumber,
      name: leads.name,
      phone: leads.phone,
      pax: leads.pax,
      departureTarget: leads.departureTarget,
      status: leads.status,
      utmSource: leads.utmSource,
      utmCampaign: leads.utmCampaign,
      gclid: leads.gclid,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .where(sql`${sql.join(conditions, sql` and `)}`)
    .orderBy(desc(leads.createdAt))
    .limit(200)

  // Ringkasan dihitung dari seluruh lead, bukan hanya yang tersaring,
  // supaya angkanya tidak berubah saat filter dipakai.
  const summary = await db
    .select({ status: leads.status, count: sql<number>`count(*)::int` })
    .from(leads)
    .where(isNull(leads.deletedAt))
    .groupBy(leads.status)

  const [ads] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(leads)
    .where(sql`${leads.deletedAt} is null and (${leads.gclid} is not null or ${leads.utmSource} is not null)`)

  const byStatus = Object.fromEntries(summary.map(s => [s.status, s.count]))
  const total = summary.reduce((sum, s) => sum + s.count, 0)

  return {
    leads: rows,
    summary: {
      total,
      byStatus,
      fromAds: ads?.count ?? 0,
    },
  }
})

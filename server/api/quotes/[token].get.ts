import { asc, eq, sql } from 'drizzle-orm'
import { leads, quoteItems, quotes } from '../../database/schema'

/**
 * Penawaran versi jemaah, dibuka lewat tautan bertoken yang dikirim CS.
 * Publik dengan sengaja — token acak 24 byte itulah kuncinya — jadi hanya
 * kolom yang memang perlu dilihat jemaah yang dikembalikan. Catatan internal,
 * data atribusi iklan, dan status lead tidak ikut.
 */
export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  if (!token) throw createError({ statusCode: 400, statusMessage: 'Tautan tidak valid.' })

  const db = useDb()

  const [row] = await db
    .select({
      quoteNumber: quotes.quoteNumber,
      pax: quotes.pax,
      perPaxTotal: quotes.perPaxTotal,
      grandTotal: quotes.grandTotal,
      validUntil: quotes.validUntil,
      createdAt: quotes.createdAt,
      revokedAt: quotes.revokedAt,
      name: leads.name,
      departureTarget: leads.departureTarget,
      quoteId: quotes.id,
    })
    .from(quotes)
    .innerJoin(leads, eq(leads.id, quotes.leadId))
    .where(sql`${quotes.publicToken} = ${token} and ${quotes.deletedAt} is null`)
    .limit(1)

  if (!row || row.revokedAt) {
    throw createError({ statusCode: 404, statusMessage: 'Penawaran tidak ditemukan atau sudah tidak berlaku.' })
  }

  const items = await db
    .select({
      label: quoteItems.label,
      quantity: quoteItems.quantity,
      perPaxAmount: quoteItems.perPaxAmount,
      lineTotal: quoteItems.lineTotal,
    })
    .from(quoteItems)
    .where(eq(quoteItems.quoteId, row.quoteId))
    .orderBy(asc(quoteItems.sortOrder))

  // Jejak buka memberi tahu CS bahwa penawarannya sudah dilihat.
  await db.update(quotes)
    .set({
      firstViewedAt: sql`coalesce(${quotes.firstViewedAt}, now())`,
      lastViewedAt: new Date(),
      viewCount: sql`${quotes.viewCount} + 1`,
    })
    .where(eq(quotes.id, row.quoteId))

  const { quoteId, revokedAt, ...pub } = row
  return { ...pub, items }
})

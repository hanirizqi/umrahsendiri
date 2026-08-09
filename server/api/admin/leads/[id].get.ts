import { and, count, desc, eq, isNull, ne } from 'drizzle-orm'
import { leadServiceSelections, leads, quotes, services } from '../../../database/schema'

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

  // Penawaran yang sudah pernah dibuat untuk lead ini. Tanpa ini tidak ada cara
  // melihat bahwa penawaran sudah ada, dan tombolnya ditekan berulang kali.
  const leadQuotes = await db
    .select({
      id: quotes.id,
      quoteNumber: quotes.quoteNumber,
      status: quotes.status,
      grandTotal: quotes.grandTotal,
      createdAt: quotes.createdAt,
      sharedAt: quotes.sharedAt,
      firstViewedAt: quotes.firstViewedAt,
      viewCount: quotes.viewCount,
    })
    .from(quotes)
    .where(and(eq(quotes.leadId, id), isNull(quotes.deletedAt)))
    .orderBy(desc(quotes.createdAt))

  /**
   * Berapa pengiriman lain dari orang yang sama. Hanya jumlahnya — rinciannya
   * ada di halaman kontak, dan menaruh dua daftar untuk hal yang sama di dua
   * tempat hanya membuat keduanya lekas berbeda isinya.
   */
  const [siblings] = lead.contactId
    ? await db
        .select({ count: count() })
        .from(leads)
        .where(and(
          eq(leads.contactId, lead.contactId),
          ne(leads.id, id),
          isNull(leads.deletedAt),
        ))
    : [{ count: 0 }]

  return { lead, selections, quotes: leadQuotes, otherEnquiries: siblings?.count ?? 0 }
})

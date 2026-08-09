import { and, desc, eq, isNull } from 'drizzle-orm'
import { contacts, leads } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID tidak valid.' })

  const db = useDb()

  const [contact] = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1)
  if (!contact) throw createError({ statusCode: 404, statusMessage: 'Kontak tidak ditemukan.' })

  const contactLeads = await db
    .select({
      id: leads.id,
      leadNumber: leads.leadNumber,
      name: leads.name,
      phone: leads.phone,
      pax: leads.pax,
      departureTarget: leads.departureTarget,
      status: leads.status,
      createdAt: leads.createdAt,
      utmSource: leads.utmSource,
      utmCampaign: leads.utmCampaign,
      gclid: leads.gclid,
    })
    .from(leads)
    .where(and(eq(leads.contactId, id), isNull(leads.deletedAt)))
    .orderBy(desc(leads.createdAt))

  return { contact, leads: contactLeads }
})

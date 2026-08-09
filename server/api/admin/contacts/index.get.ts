import { count, desc, eq, isNull, max, min, sql } from 'drizzle-orm'
import { contacts, leads } from '../../../database/schema'

/**
 * Daftar orang, bukan daftar pengiriman form.
 *
 * Satu baris di sini bisa mewakili beberapa lead — orang yang sama menanyakan
 * rencana berbeda di bulan berbeda. Urutannya menurut pengiriman terakhir,
 * karena yang baru saja menghubungi itulah yang perlu ditindaklanjuti dulu.
 */
export default defineEventHandler(async () => {
  const db = useDb()

  const rows = await db
    .select({
      id: contacts.id,
      phone: contacts.phone,
      name: contacts.name,
      leadCount: count(leads.id),
      firstLeadAt: min(leads.createdAt),
      lastLeadAt: max(leads.createdAt),
      totalPax: sql<number>`coalesce(sum(${leads.pax}), 0)::int`,
    })
    .from(contacts)
    .leftJoin(leads, eq(leads.contactId, contacts.id))
    .where(isNull(leads.deletedAt))
    .groupBy(contacts.id, contacts.phone, contacts.name)
    .orderBy(desc(max(leads.createdAt)))

  return { contacts: rows }
})

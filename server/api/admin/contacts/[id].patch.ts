import { eq } from 'drizzle-orm'
import { contacts } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID tidak valid.' })

  const body = await readBody<{ name?: unknown }>(event)
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 120) : ''
  if (!name) throw createError({ statusCode: 400, statusMessage: 'Nama tidak boleh kosong.' })

  const db = useDb()

  // `nameSetManually` menahan pengiriman form berikutnya agar tidak menimpa
  // pembetulan ini — lihat penjelasannya di schema.
  const [updated] = await db.update(contacts)
    .set({ name, nameSetManually: true, updatedAt: new Date() })
    .where(eq(contacts.id, id))
    .returning({ id: contacts.id, name: contacts.name })

  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Kontak tidak ditemukan.' })

  return updated
})

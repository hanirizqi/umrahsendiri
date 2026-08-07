import { eq } from 'drizzle-orm'
import { leads } from '../../../database/schema'
import { LEAD_STATUSES } from './index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID tidak valid.' })

  const body = await readBody<{ status?: unknown, note?: unknown }>(event)

  const patch: Record<string, unknown> = { updatedAt: new Date() }

  if (body?.status !== undefined) {
    const status = typeof body.status === 'string' ? body.status : ''
    if (!LEAD_STATUSES.includes(status as typeof LEAD_STATUSES[number])) {
      throw createError({ statusCode: 400, statusMessage: 'Status tidak dikenal.' })
    }
    patch.status = status
  }

  if (body?.note !== undefined) {
    patch.note = typeof body.note === 'string' ? body.note.trim().slice(0, 2000) || null : null
  }

  const db = useDb()
  const [updated] = await db.update(leads).set(patch).where(eq(leads.id, id)).returning({
    id: leads.id,
    status: leads.status,
    note: leads.note,
  })

  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Lead tidak ditemukan.' })

  return updated
})

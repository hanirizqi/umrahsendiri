import { eq } from 'drizzle-orm'
import { quotes } from '../../../database/schema'

const STATUSES = ['draf', 'terkirim', 'disetujui', 'kedaluwarsa'] as const
type QuoteStatus = typeof STATUSES[number]

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID tidak valid.' })

  const body = await readBody<{ status?: unknown }>(event)
  const status = STATUSES.find(s => s === body?.status) as QuoteStatus | undefined
  if (!status) throw createError({ statusCode: 400, statusMessage: 'Status tidak dikenal.' })

  const db = useDb()

  const [existing] = await db.select().from(quotes).where(eq(quotes.id, id)).limit(1)
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Penawaran tidak ditemukan.' })

  /**
   * `sharedAt` menandai kapan penawaran ini keluar dari tangan kami, dan itulah
   * yang membuat penawaran berhenti dianggap draf yang boleh dipakai ulang.
   * Dicatat sekali saja: mengubah status bolak-balik tidak boleh menggeser
   * kapan jemaah sebenarnya menerimanya.
   */
  const leavingDraft = status !== 'draf'
  const sharedAt = leavingDraft ? (existing.sharedAt ?? new Date()) : existing.sharedAt

  const [updated] = await db.update(quotes)
    .set({ status, sharedAt, updatedAt: new Date() })
    .where(eq(quotes.id, id))
    .returning({ id: quotes.id, status: quotes.status, sharedAt: quotes.sharedAt })

  return updated
})

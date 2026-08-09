import { sql } from 'drizzle-orm'
import { documentCounters } from '../database/schema'

const PREFIX = {
  lead: 'LD',
  quote: 'PW',
} as const

export type DocumentScope = keyof typeof PREFIX

/**
 * Nomor dokumen berikutnya, misalnya `LD-2026-0042` atau `PW-2026-0007`.
 *
 * Kenaikan dan pembacaannya terjadi dalam satu pernyataan SQL, jadi dua
 * permintaan bersamaan tidak mungkin menerima nomor yang sama. Nilainya juga
 * tidak pernah menengok jumlah baris yang ada — menghapus satu penawaran tidak
 * membuat nomor berikutnya mengulang nomor yang sudah terpakai.
 */
export async function nextDocumentNumber(
  db: ReturnType<typeof useDb>,
  scope: DocumentScope,
): Promise<string> {
  const year = new Date().getFullYear()

  const [row] = await db
    .insert(documentCounters)
    .values({ scope, year, value: 1 })
    .onConflictDoUpdate({
      target: [documentCounters.scope, documentCounters.year],
      set: { value: sql`${documentCounters.value} + 1` },
    })
    .returning({ value: documentCounters.value })

  if (!row) throw createError({ statusCode: 500, statusMessage: 'Gagal menomori dokumen.' })

  return `${PREFIX[scope]}-${year}-${String(row.value).padStart(4, '0')}`
}

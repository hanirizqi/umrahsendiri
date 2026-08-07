import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../database/schema'

let client: postgres.Sql | undefined
let database: ReturnType<typeof drizzle<typeof schema>> | undefined

/**
 * Koneksi dibuat sekali lalu dipakai ulang. Nitro bisa mengevaluasi modul ini
 * lebih dari sekali saat pengembangan, jadi instance disimpan di luar fungsi
 * agar tidak membuka kolam koneksi baru setiap perubahan berkas.
 */
export function useDb() {
  if (database) return database

  const url = process.env.DATABASE_URL
  if (!url) {
    throw createError({
      statusCode: 503,
      statusMessage: 'DATABASE_URL belum diset.',
    })
  }

  client = postgres(url, { max: 10 })
  database = drizzle(client, { schema, casing: 'snake_case' })
  return database
}

export { schema }

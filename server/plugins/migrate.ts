import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { seedCatalog } from '../database/seed'

/**
 * Menjalankan migrasi dan mengisi katalog saat aplikasi start, supaya deploy
 * tidak menuntut akses terminal ke server.
 *
 * Kegagalan sengaja tidak menghentikan aplikasi. Situs publik tidak butuh
 * database untuk tampil, dan penyimpanan lead sudah dirancang gagal-diam —
 * jemaah tetap sampai ke WhatsApp. Menjatuhkan seluruh situs karena migrasi
 * gagal jauh lebih merugikan daripada sementara kehilangan pencatatan lead.
 */
export default defineNitroPlugin(async () => {
  if (!process.env.DATABASE_URL) {
    console.warn('[db] DATABASE_URL belum diset — migrasi dan katalog dilewati.')
    return
  }

  const db = useDb()

  try {
    await migrate(db, { migrationsFolder: './server/database/migrations' })
    console.log('[db] Migrasi selesai.')
  }
  catch (error) {
    console.error('[db] Migrasi gagal. Situs tetap jalan, tapi penyimpanan lead dan panel admin tidak berfungsi.', error)
    return
  }

  try {
    const result = await seedCatalog(db)
    console.log(`[db] Katalog siap — ${result.services} layanan, ${result.rates} tarif.`)
  }
  catch (error) {
    console.error('[db] Pengisian katalog gagal. Pembuatan penawaran tidak akan berfungsi.', error)
  }
})

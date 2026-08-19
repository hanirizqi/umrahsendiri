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
  /**
   * Nitro menjalankan aplikasi juga saat prerender di tahap build, dan plugin ini
   * ikut terpanggil di sana. Kalau dibiarkan, ia membuka kolam koneksi Postgres
   * yang tidak pernah ditutup — proses build jadi tidak pernah keluar dan akhirnya
   * dibunuh setelah menggantung. Build bukan tempat menyentuh database produksi.
   */
  if (import.meta.prerender) return

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
    console.log(
      result.seeded.length
        ? `[db] Katalog siap — ${result.services} layanan. Periode LPP baru dimasukkan: ${result.seeded.join(', ')}. Total ${result.rates} tarif.`
        : `[db] Katalog siap — ${result.services} layanan, ${result.rates} tarif. Tidak ada periode LPP baru; yang ada dikelola lewat panel admin.`,
    )
  }
  catch (error) {
    console.error('[db] Pengisian katalog gagal. Pembuatan penawaran tidak akan berfungsi.', error)
  }
})

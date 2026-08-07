/**
 * Melaporkan konfigurasi yang belum lengkap sekali saat aplikasi start.
 *
 * Tanpa ini satu-satunya tanda ada yang kurang adalah 503 di /admin/**, dan
 * jawaban itu sengaja tidak menyebut variabel mana yang bolong — sehingga
 * penyebabnya hanya bisa ditebak. Log start-up muncul di Coolify tepat setelah
 * deploy, jadi salah isi environment variable ketahuan sebelum ada yang
 * mencoba membuka panel.
 */
export default defineNitroPlugin(() => {
  // Tahap prerender di build tidak punya environment produksi; peringatannya
  // hanya akan jadi kebisingan yang menyesatkan di log build.
  if (import.meta.prerender) return

  const problems = adminAuthConfigProblems()
  if (!process.env.DATABASE_URL) problems.push('DATABASE_URL (kosong)')

  if (!problems.length) {
    console.log('[config] Environment variable wajib sudah lengkap.')
    return
  }

  console.error(
    `[config] ${problems.length} environment variable wajib belum beres:\n`
    + problems.map(problem => `           - ${problem}`).join('\n')
    + '\n         Isi di Coolify → Environment Variables, centang "Available at Runtime", lalu deploy.'
    + '\n         Selama belum beres, /admin/** menjawab 503 dan panel tidak bisa dibuka siapa pun.',
  )
})

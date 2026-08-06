/**
 * Penjaga seluruh route /internal/**.
 *
 * Halaman tanpa sesi dialihkan ke halaman masuk; permintaan API dijawab 401
 * agar sisi klien bisa menanganinya sendiri. Sengaja gagal-tertutup: tanpa
 * kredensial di environment, panel internal tidak bisa dibuka sama sekali.
 */
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  const isInternalPage = path.startsWith('/internal')
  const isInternalApi = path.startsWith('/api/internal')
  if (!isInternalPage && !isInternalApi) return

  // Halaman masuk dan endpoint login/logout harus tetap terbuka,
  // kalau tidak tidak ada cara untuk mulai masuk.
  if (path === INTERNAL_LOGIN_PATH || path === '/api/internal/login' || path === '/api/internal/logout') {
    return
  }

  assertInternalAuthConfigured()

  const session = await useInternalSession(event)
  if (session.data?.user) return

  if (isInternalApi) {
    throw createError({ statusCode: 401, statusMessage: 'Sesi berakhir. Silakan masuk kembali.' })
  }

  const next = encodeURIComponent(path)
  return sendRedirect(event, `${INTERNAL_LOGIN_PATH}?lanjut=${next}`, 302)
})

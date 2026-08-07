/**
 * Penjaga seluruh route /admin/**.
 *
 * Halaman tanpa sesi dialihkan ke halaman masuk; permintaan API dijawab 401
 * agar sisi klien bisa menanganinya sendiri. Sengaja gagal-tertutup: tanpa
 * kredensial di environment, panel admin tidak bisa dibuka sama sekali.
 */
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  const isAdminPage = path.startsWith('/admin')
  const isAdminApi = path.startsWith('/api/admin')
  if (!isAdminPage && !isAdminApi) return

  // Halaman masuk dan endpoint login/logout harus tetap terbuka,
  // kalau tidak tidak ada cara untuk mulai masuk.
  if (path === ADMIN_LOGIN_PATH || path === '/api/admin/login' || path === '/api/admin/logout') {
    return
  }

  assertAdminAuthConfigured()

  const session = await useAdminSession(event)
  if (session.data?.user) return

  if (isAdminApi) {
    throw createError({ statusCode: 401, statusMessage: 'Sesi berakhir. Silakan masuk kembali.' })
  }

  const next = encodeURIComponent(path)
  return sendRedirect(event, `${ADMIN_LOGIN_PATH}?next=${next}`, 302)
})

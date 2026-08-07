import { timingSafeEqual } from 'node:crypto'

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export default defineEventHandler(async (event) => {
  assertAdminAuthConfigured()

  enforceRateLimit(event, {
    key: 'login',
    limit: 10,
    windowMs: 15 * 60 * 1000,
    message: 'Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit.',
  })

  const body = await readBody<{ user?: unknown, password?: unknown }>(event)
  const user = typeof body?.user === 'string' ? body.user : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  const { internalAuthUser, internalAuthPassword } = useRuntimeConfig()
  const ok = safeEqual(user, internalAuthUser) && safeEqual(password, internalAuthPassword)

  if (!ok) {
    // Pesan sengaja tidak menyebut mana yang salah, agar tidak membocorkan username yang valid.
    throw createError({ statusCode: 401, statusMessage: 'Username atau kata sandi salah.' })
  }

  clearRateLimit(event, 'login')

  const session = await useAdminSession(event)
  await session.update({ user, loggedInAt: Date.now() })

  return { ok: true }
})

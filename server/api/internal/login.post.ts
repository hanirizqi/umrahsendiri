import { timingSafeEqual } from 'node:crypto'

interface Attempt { count: number, resetAt: number }

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 10
const attempts = new Map<string, Attempt>()

/**
 * Pembatas percobaan sederhana di memori. Cukup untuk satu instance —
 * kalau nanti berjalan lebih dari satu instance, pindahkan ke penyimpanan bersama.
 */
function tooManyAttempts(ip: string): boolean {
  const now = Date.now()
  const current = attempts.get(ip)

  if (!current || now > current.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  current.count += 1
  return current.count > MAX_ATTEMPTS
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export default defineEventHandler(async (event) => {
  assertInternalAuthConfigured()

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'tidak-diketahui'
  if (tooManyAttempts(ip)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit.',
    })
  }

  const body = await readBody<{ user?: unknown, password?: unknown }>(event)
  const user = typeof body?.user === 'string' ? body.user : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  const { internalAuthUser, internalAuthPassword } = useRuntimeConfig()
  const ok = safeEqual(user, internalAuthUser) && safeEqual(password, internalAuthPassword)

  if (!ok) {
    // Pesan sengaja tidak menyebut mana yang salah, agar tidak membocorkan username yang valid.
    throw createError({ statusCode: 401, statusMessage: 'Username atau kata sandi salah.' })
  }

  attempts.delete(ip)

  const session = await useInternalSession(event)
  await session.update({ user, loggedInAt: Date.now() })

  return { ok: true }
})

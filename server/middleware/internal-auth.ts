import { timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

/**
 * Kunci sementara untuk /internal/** sampai autentikasi staf (Fase 1) siap.
 * Sengaja gagal-tertutup: tanpa kredensial di env, halaman internal tidak bisa dibuka
 * sama sekali — lebih baik tim tidak bisa masuk daripada halamannya terbuka untuk publik.
 */

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

function unauthorized(event: H3Event, statusMessage: string): never {
  setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="UmrahSendiri Internal", charset="UTF-8"')
  throw createError({ statusCode: 401, statusMessage })
}

export default defineEventHandler((event) => {
  if (!getRequestURL(event).pathname.startsWith('/internal')) return

  const { internalAuthUser, internalAuthPassword } = useRuntimeConfig()

  if (!internalAuthUser || !internalAuthPassword) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Halaman internal belum dikonfigurasi. Set NUXT_INTERNAL_AUTH_USER dan NUXT_INTERNAL_AUTH_PASSWORD.',
    })
  }

  const header = getRequestHeader(event, 'authorization')
  if (!header?.startsWith('Basic ')) {
    unauthorized(event, 'Perlu login')
  }

  const [user = '', ...rest] = Buffer.from(header.slice(6), 'base64').toString('utf8').split(':')

  if (!safeEqual(user, internalAuthUser) || !safeEqual(rest.join(':'), internalAuthPassword)) {
    unauthorized(event, 'Kredensial salah')
  }
})

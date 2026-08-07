import type { H3Event } from 'h3'

interface Bucket { count: number, resetAt: number }

const buckets = new Map<string, Bucket>()

/**
 * Pembatas laju sederhana di memori, cukup untuk satu instance.
 * Kalau nanti berjalan lebih dari satu instance, pindahkan ke penyimpanan bersama.
 */
export function enforceRateLimit(event: H3Event, options: {
  key: string
  limit: number
  windowMs: number
  message: string
}) {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'tidak-diketahui'
  const id = `${options.key}:${ip}`
  const now = Date.now()
  const current = buckets.get(id)

  if (!current || now > current.resetAt) {
    buckets.set(id, { count: 1, resetAt: now + options.windowMs })
    return
  }

  current.count += 1
  if (current.count > options.limit) {
    throw createError({ statusCode: 429, statusMessage: options.message })
  }
}

export function clearRateLimit(event: H3Event, key: string) {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'tidak-diketahui'
  buckets.delete(`${key}:${ip}`)
}

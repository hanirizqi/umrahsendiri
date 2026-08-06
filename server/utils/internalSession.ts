import type { H3Event } from 'h3'

export interface InternalSessionData {
  user?: string
  loggedInAt?: number
}

export const INTERNAL_LOGIN_PATH = '/internal/masuk'

/**
 * Sesi staf internal, disegel dalam cookie. Sementara sampai autentikasi
 * berbasis database (Fase 1) siap — saat itu pemeriksaan kredensial pindah
 * ke tabel staff_users, sedangkan lapisan sesi ini tetap dipakai.
 */
export function useInternalSession(event: H3Event) {
  const { sessionPassword } = useRuntimeConfig()

  return useSession<InternalSessionData>(event, {
    name: 'us_internal',
    password: sessionPassword,
    maxAge: 60 * 60 * 12, // 12 jam, cukup untuk satu hari kerja
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: !import.meta.dev,
      path: '/',
    },
  })
}

/** Kredensial belum diisi — halaman internal harus terkunci, bukan terbuka. */
export function assertInternalAuthConfigured() {
  const { internalAuthUser, internalAuthPassword, sessionPassword } = useRuntimeConfig()

  if (!internalAuthUser || !internalAuthPassword || !sessionPassword) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Panel internal belum dikonfigurasi. Set NUXT_INTERNAL_AUTH_USER, NUXT_INTERNAL_AUTH_PASSWORD, dan NUXT_SESSION_PASSWORD.',
    })
  }
}

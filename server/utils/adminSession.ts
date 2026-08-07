import type { H3Event } from 'h3'

export interface AdminSessionData {
  user?: string
  loggedInAt?: number
}

export const ADMIN_LOGIN_PATH = '/admin/login'

/**
 * Sesi staf admin, disegel dalam cookie. Sementara sampai autentikasi
 * berbasis database (Fase 1) siap — saat itu pemeriksaan kredensial pindah
 * ke tabel staff_users, sedangkan lapisan sesi ini tetap dipakai.
 */
export function useAdminSession(event: H3Event) {
  const { sessionPassword } = useRuntimeConfig()

  return useSession<AdminSessionData>(event, {
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

/** Kredensial belum diisi — panel admin harus terkunci, bukan terbuka. */
export function assertAdminAuthConfigured() {
  const { internalAuthUser, internalAuthPassword, sessionPassword } = useRuntimeConfig()

  if (!internalAuthUser || !internalAuthPassword || !sessionPassword) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Panel admin belum dikonfigurasi. Set NUXT_INTERNAL_AUTH_USER, NUXT_INTERNAL_AUTH_PASSWORD, dan NUXT_SESSION_PASSWORD.',
    })
  }
}

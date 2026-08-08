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

/** h3 menolak menyegel cookie dengan kunci yang lebih pendek dari ini. */
export const SESSION_PASSWORD_MIN_LENGTH = 32

/**
 * Membedakan variabel yang memang belum pernah diisi dari variabel yang ada
 * tapi tiba kosong.
 *
 * Keduanya sama-sama terlihat "kosong" dari sisi aplikasi, tapi tindakan
 * perbaikannya berbeda jauh. Yang kedua hampir selalu berarti nilainya sampai
 * ke Docker lalu ditelan: `$` di dalam nilai ditafsirkan sebagai rujukan
 * variabel lain dan diganti string kosong, sementara di layar Coolify nilainya
 * tetap terlihat utuh. Tanpa dibedakan begini, satu-satunya jalan keluar dari
 * kekeliruan itu adalah menebak.
 */
function describeEmpty(name: string): string {
  if (!(name in process.env)) return `${name} (belum diisi di Coolify)`
  return `${name} (terisi di Coolify tapi tiba kosong — periksa centang "Available at Runtime", dan ganti nilainya kalau mengandung tanda $)`
}

/**
 * Konfigurasi panel admin yang belum beres, disebut dengan nama environment
 * variable-nya supaya bisa langsung dicocokkan dengan isian di Coolify.
 * Kunci yang terisi tapi terlalu pendek ikut dilaporkan: h3 baru menolaknya
 * saat sesi dibuat, jadi tanpa pemeriksaan ini kekeliruannya baru muncul
 * sebagai 500 di tengah proses masuk.
 */
export function adminAuthConfigProblems(): string[] {
  const { internalAuthUser, internalAuthPassword, sessionPassword } = useRuntimeConfig()
  const problems: string[] = []

  if (!internalAuthUser) problems.push(describeEmpty('NUXT_INTERNAL_AUTH_USER'))
  if (!internalAuthPassword) problems.push(describeEmpty('NUXT_INTERNAL_AUTH_PASSWORD'))

  if (!sessionPassword) {
    problems.push(describeEmpty('NUXT_SESSION_PASSWORD'))
  }
  else if (sessionPassword.length < SESSION_PASSWORD_MIN_LENGTH) {
    problems.push(`NUXT_SESSION_PASSWORD (${sessionPassword.length} karakter, minimal ${SESSION_PASSWORD_MIN_LENGTH})`)
  }

  return problems
}

let reportedProblems = ''

/** Kredensial belum diisi — panel admin harus terkunci, bukan terbuka. */
export function assertAdminAuthConfigured() {
  const problems = adminAuthConfigProblems()
  if (!problems.length) return

  // Nama variabel yang bermasalah hanya masuk log server. Jawaban HTTP-nya
  // sengaja tidak merinci: siapa pun bisa memanggil /admin/**, dan tidak ada
  // gunanya memberi tahu publik bagian mana dari konfigurasi yang bolong.
  // Dicatat sekali per kombinasi, agar pemindai port tidak membanjiri log.
  const signature = problems.join(', ')
  if (signature !== reportedProblems) {
    reportedProblems = signature
    console.error(`[config] Panel admin terkunci — ${signature}.`)
  }

  throw createError({
    statusCode: 503,
    statusMessage: 'Panel admin belum dikonfigurasi. Rinciannya ada di log server.',
  })
}

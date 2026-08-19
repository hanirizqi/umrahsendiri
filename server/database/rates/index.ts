import type { RatePeriodDefinition } from './types'
import { RATE_PERIOD_2026_09 } from './2026-09'

/**
 * Semua terbitan LPP yang dikenal, terlama lebih dulu.
 *
 * Menambah LPP baru = tambah satu berkas di folder ini lalu daftarkan di sini.
 * Penyemaian saat start akan memasukkannya sendiri, jadi tidak ada langkah
 * manual di panel dan tidak perlu migrasi baru tiap bulan.
 *
 * Periode yang **sudah ada tarifnya di database tidak pernah disentuh** — baik
 * oleh berkas ini maupun oleh deploy berikutnya. Jadi mengubah angka di sini
 * setelah periodenya terlanjur ada tidak akan berpengaruh; perbaikannya lewat
 * `/admin/rates`. Berkas ini untuk memasukkan periode baru, bukan menyunting
 * yang lama.
 */
export const RATE_PERIODS: RatePeriodDefinition[] = [
  RATE_PERIOD_2026_09,
]

export type { RatePeriodDefinition }

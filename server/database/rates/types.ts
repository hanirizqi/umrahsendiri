/**
 * Bentuk satu terbitan LPP.
 *
 * Setiap angka di sini **harga per jemaah**, bukan harga kamar. Itu satuan yang
 * dipakai `buildQuote`, yang menghitung `tarif × jumlah malam × jumlah jemaah`.
 * Memasukkan total kamar akan melipatgandakan penawaran sebanyak jumlah jemaah —
 * untuk rombongan berempat, empat kali lipat. Kekeliruan ini pernah terjadi pada
 * 19 Agustus 2026 dan tertangkap sebelum sampai ke jemaah; `npm run rates:verify`
 * ada supaya tidak perlu tertangkap dengan cara itu lagi.
 *
 * Data biaya pemasok, markup, dan margin **tidak boleh masuk berkas ini** —
 * tempatnya di backoffice, di luar repo. Yang di sini hanya harga jual.
 */
export interface RatePeriodDefinition {
  /** Dipakai sebagai kunci alami; sekali dipublikasikan jangan diubah. */
  code: string
  label: string
  /** Tanggal mulai berlaku, format ISO `YYYY-MM-DD`. */
  effectiveFrom: string
  isPublished: boolean
  note: string

  /**
   * Layanan bertarif datar, dikunci ke `services.code`.
   * Indeks array = okupansi 1..4, yaitu **jumlah jemaah dalam rombongan**.
   */
  flat: Record<string, [number, number, number, number]>

  /**
   * Hotel per malam: bintang → kota → tarif per okupansi 1..4.
   * Bintang tidak dikunci 3–5; periode boleh menawarkan kelas mana pun.
   */
  hotel: Record<number, Record<'makkah' | 'madinah', [number, number, number, number]>>
}

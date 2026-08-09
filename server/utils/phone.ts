/**
 * Menyeragamkan nomor HP Indonesia menjadi satu bentuk: `6281234567890`.
 *
 * Orang menuliskan nomor yang sama dengan banyak cara — `081234567890`,
 * `+62 812-3456-7890`, `62812 3456 7890`. Selama bentuknya dibiarkan apa
 * adanya, tiga tulisan itu terlihat sebagai tiga orang berbeda dan
 * pengelompokan lead per orang tidak pernah bekerja. Semua perbandingan
 * antar-nomor harus lewat fungsi ini.
 *
 * Nomor yang tidak dikenali dikembalikan sebagai deretan angkanya saja,
 * bukan dibuang: lebih baik mengelompokkan dengan kunci apa adanya daripada
 * menolak lead yang nomornya ditulis tidak lazim.
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''

  // 62812… — sudah berkode negara.
  if (digits.startsWith('62')) return digits

  // 0812… — awalan nasional, diganti kode negara.
  if (digits.startsWith('0')) return `62${digits.slice(1)}`

  // 812… — ditulis tanpa awalan apa pun; seluruh nomor seluler Indonesia
  // dimulai dengan 8 sesudah kode negara.
  if (digits.startsWith('8')) return `62${digits}`

  return digits
}

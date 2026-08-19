/**
 * Memeriksa kewarasan tiap terbitan LPP di `server/database/rates/`.
 *
 * Dibuat setelah 19 Agustus 2026, ketika tabel harga kamar hampir masuk sebagai
 * harga per jemaah. Kalau itu lolos, penawaran ke rombongan berempat jadi empat
 * kali lipat — dan tidak ada satu pun error yang muncul, karena angkanya sendiri
 * sah sebagai angka. Pemeriksaan di bawah menangkapnya dari bentuk datanya.
 *
 * Jalankan: `npm run rates:verify`
 */
import process from 'node:process'
import { RATE_PERIODS } from '../server/database/rates'

interface Problem { period: string, where: string, message: string }

const problems: Problem[] = []
const notes: string[] = []

const rp = (n: number) => `Rp${Math.round(n).toLocaleString('id-ID')}`

for (const p of RATE_PERIODS) {
  const at = (where: string, message: string) => problems.push({ period: p.code, where, message })

  if (!/^\d{4}-\d{2}$/.test(p.code)) at('code', `"${p.code}" tidak berformat YYYY-MM`)
  if (Number.isNaN(new Date(p.effectiveFrom).getTime())) at('effectiveFrom', `"${p.effectiveFrom}" bukan tanggal yang sah`)

  for (const [code, amounts] of Object.entries(p.flat)) {
    if (amounts.length !== 4) at(`flat.${code}`, `harus 4 angka (okupansi 1..4), ada ${amounts.length}`)
    amounts.forEach((a, i) => {
      if (!Number.isFinite(a) || a <= 0) at(`flat.${code}[${i + 1}]`, `bukan angka positif: ${a}`)
    })
    // Biaya bersama menurun per jemaah seiring bertambahnya rombongan. Kalau
    // naik, hampir pasti yang tertulis harga rombongan, bukan harga per jemaah.
    for (let i = 1; i < amounts.length; i++) {
      if (amounts[i]! > amounts[i - 1]!) {
        at(`flat.${code}`, `okupansi ${i + 1} (${rp(amounts[i]!)}) lebih mahal daripada okupansi ${i} (${rp(amounts[i - 1]!)}) — harga per jemaah seharusnya turun, bukan naik`)
      }
    }
  }

  for (const [tier, cities] of Object.entries(p.hotel)) {
    for (const [city, amounts] of Object.entries(cities)) {
      const where = `hotel.${tier}.${city}`
      if (amounts.length !== 4) at(where, `harus 4 angka, ada ${amounts.length}`)

      // Inti pemeriksaannya. Sendiri menempati kamar yang sama dengan Berdua,
      // ditanggung sendirian — jadi tarif per jemaahnya tepat dua kali lipat.
      // Kalau keduanya sama, yang tertulis adalah harga kamar.
      const sendiri = amounts[0]!
      const berdua = amounts[1]!
      if (Math.abs(sendiri - berdua * 2) > 1) {
        at(where, sendiri === berdua
          ? `Sendiri sama dengan Berdua (${rp(sendiri)}) — ini ciri harga KAMAR, bukan harga per jemaah. Bagi dengan jumlah jemaah.`
          : `Sendiri ${rp(sendiri)} bukan dua kali Berdua ${rp(berdua)} (seharusnya ${rp(berdua * 2)})`)
      }

      for (let i = 1; i < amounts.length; i++) {
        if (amounts[i]! > amounts[i - 1]!) {
          at(where, `okupansi ${i + 1} (${rp(amounts[i]!)}) lebih mahal daripada okupansi ${i} (${rp(amounts[i - 1]!)}) — harga per jemaah seharusnya turun`)
        }
      }

      // Total kamar per malam, untuk dicocokkan manusia dengan dokumen pemasok
      // yang memang dihitung per rombongan.
      const kamar = amounts.map((a, i) => rp(a * (i + 1))).join(' | ')
      notes.push(`  ${p.code} ${where.padEnd(18)} total kamar: ${kamar}`)
    }
  }
}

console.log(`Memeriksa ${RATE_PERIODS.length} terbitan LPP.\n`)
console.log('Total kamar per malam (untuk dicocokkan dengan dokumen pemasok):')
console.log(notes.join('\n'))

if (!problems.length) {
  console.log('\n✔ Semua pemeriksaan lolos.')
  process.exit(0)
}

console.error(`\n✖ ${problems.length} masalah ditemukan:\n`)
for (const p of problems) console.error(`  [${p.period}] ${p.where}\n      ${p.message}`)
process.exit(1)

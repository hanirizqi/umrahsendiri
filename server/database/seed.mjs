/**
 * Mengisi katalog layanan. Aman dijalankan berulang: baris yang sudah ada
 * diperbarui berdasarkan `code`, bukan diduplikasi.
 *
 * Jalankan: npm run db:seed
 */
import postgres from 'postgres'

const SERVICES = [
  {
    code: 'paket_dasar',
    name: 'Paket Dasar',
    description: 'Transportasi 3 rute (Bandara Jeddah–Makkah Hotel, Makkah Hotel–Madinah Hotel, Madinah Hotel–Bandara Jeddah), paket dokumen wajib (Visa Umrah, Siskopatuh, Asuransi Kesehatan Arab Saudi), dan pembimbing umrah + manasik online (untuk 1x pelaksanaan umrah).',
    pricing_unit: 'per_pax',
    needs_hotel_tier: false,
    sort_order: 1,
  },
  {
    code: 'hotel',
    name: 'Hotel (termasuk makan 3x sehari)',
    description: null,
    pricing_unit: 'per_pax_malam',
    needs_hotel_tier: true,
    sort_order: 2,
  },
  {
    code: 'pembimbing',
    name: 'Pemandu / Pembimbing Tambahan',
    description: 'Tarif per hari, maksimal 9 jam. Pembimbing WNI (orang Indonesia).',
    pricing_unit: 'per_pax_hari',
    needs_hotel_tier: false,
    sort_order: 3,
  },
  {
    code: 'handling_bandara',
    name: 'Handling Bandara PP',
    description: 'Termasuk makan saat kedatangan dan kepulangan, serta air zamzam saat kepulangan.',
    pricing_unit: 'per_pax',
    needs_hotel_tier: false,
    sort_order: 4,
  },
  {
    code: 'jabal_khandamah',
    name: 'Transport Jabal Khandamah PP',
    description: 'Driver berbahasa Inggris.',
    pricing_unit: 'per_pax',
    needs_hotel_tier: false,
    sort_order: 5,
  },
  {
    code: 'city_tour',
    name: 'City Tour Makkah',
    description: 'Driver berbahasa Inggris.',
    pricing_unit: 'per_pax',
    needs_hotel_tier: false,
    sort_order: 6,
  },
]

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL belum diset.')
  process.exit(1)
}

const sql = postgres(url)

try {
  for (const s of SERVICES) {
    await sql`
      insert into services ${sql(s)}
      on conflict (code) do update set
        name = excluded.name,
        description = excluded.description,
        pricing_unit = excluded.pricing_unit,
        needs_hotel_tier = excluded.needs_hotel_tier,
        sort_order = excluded.sort_order,
        updated_at = now()
    `
  }

  const [{ count }] = await sql`select count(*)::int as count from services`
  console.log(`Katalog layanan siap — ${count} layanan.`)
}
finally {
  await sql.end()
}

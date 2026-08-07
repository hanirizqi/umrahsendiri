/**
 * Mengisi katalog layanan dan tarif LPP.
 * Aman dijalankan berulang: baris dicocokkan lewat kunci alaminya, bukan ditambah baru.
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

const PERIOD = {
  code: '2026-09',
  label: 'LPP September 2026',
  effective_from: '2026-09-01',
  effective_to: null,
  is_published: true,
  note: 'Disalin dari docs/PRICING.md. Perbarui tiap LPP baru terbit.',
}

/** Tarif per jemaah, rupiah penuh. Indeks array = okupansi 1..4. */
const FLAT = {
  paket_dasar: [11_500_000, 7_350_000, 6_566_667, 5_750_000],
  handling_bandara: [650_000, 650_000, 650_000, 650_000],
  pembimbing: [1_400_000, 700_000, 475_000, 350_000],
  jabal_khandamah: [1_000_000, 500_000, 350_000, 250_000],
  city_tour: [3_550_000, 1_800_000, 1_300_000, 950_000],
}

/** Hotel per malam, per jemaah — dipisah bintang dan kota. */
const HOTEL = {
  3: { makkah: [4_350_000, 2_175_000, 1_700_000, 1_450_000], madinah: [3_100_000, 1_550_000, 1_150_000, 965_000] },
  4: { makkah: [5_100_000, 2_550_000, 1_865_000, 1_540_000], madinah: [3_850_000, 1_925_000, 1_435_000, 1_190_000] },
  5: { makkah: [6_750_000, 3_375_000, 2_665_000, 2_200_000], madinah: [4_950_000, 2_475_000, 1_950_000, 1_700_000] },
}

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
        name = excluded.name, description = excluded.description,
        pricing_unit = excluded.pricing_unit, needs_hotel_tier = excluded.needs_hotel_tier,
        sort_order = excluded.sort_order, updated_at = now()
    `
  }

  await sql`
    insert into rate_periods ${sql(PERIOD)}
    on conflict (code) do update set
      label = excluded.label, effective_from = excluded.effective_from,
      is_published = excluded.is_published, note = excluded.note, updated_at = now()
  `

  const [{ id: periodId }] = await sql`select id from rate_periods where code = ${PERIOD.code}`
  const serviceIds = Object.fromEntries(
    (await sql`select id, code from services`).map(r => [r.code, r.id]),
  )

  const rows = []
  for (const [code, amounts] of Object.entries(FLAT)) {
    amounts.forEach((amount, i) => {
      rows.push({ rate_period_id: periodId, service_id: serviceIds[code], occupancy: i + 1, hotel_tier: null, city: null, amount })
    })
  }
  for (const [tier, cities] of Object.entries(HOTEL)) {
    for (const [city, amounts] of Object.entries(cities)) {
      amounts.forEach((amount, i) => {
        rows.push({ rate_period_id: periodId, service_id: serviceIds.hotel, occupancy: i + 1, hotel_tier: Number(tier), city, amount })
      })
    }
  }

  for (const r of rows) {
    await sql`
      insert into rates ${sql(r)}
      on conflict (rate_period_id, service_id, occupancy, hotel_tier, city)
      do update set amount = excluded.amount
    `
  }

  const [{ count: serviceCount }] = await sql`select count(*)::int as count from services`
  const [{ count: rateCount }] = await sql`select count(*)::int as count from rates`
  console.log(`Katalog siap — ${serviceCount} layanan, ${rateCount} tarif (${PERIOD.label}).`)
}
finally {
  await sql.end()
}

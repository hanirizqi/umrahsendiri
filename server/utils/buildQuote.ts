import { randomBytes } from 'node:crypto'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { leadServiceSelections, leads, quoteItems, quotes, ratePeriods, rates, services } from '../database/schema'

interface DraftItem {
  serviceId: string | null
  label: string
  hotelTier: number | null
  quantity: number
  unitAmount: number
}

export function publicQuoteToken() {
  return randomBytes(24).toString('base64url')
}

/**
 * Draf yang masih boleh dipakai ulang: belum pernah dikirim ke jemaah, jadi
 * belum ada yang melihat angkanya dan menggantinya tidak membingungkan siapa pun.
 *
 * Penawaran yang sudah terkirim sengaja tidak ikut — begitu tautannya sampai ke
 * jemaah, penawaran itu jadi catatan tentang apa yang pernah dijanjikan dan
 * tidak boleh berubah diam-diam.
 */
async function findReusableDraft(db: ReturnType<typeof useDb>, leadId: string) {
  const [draft] = await db
    .select()
    .from(quotes)
    .where(and(
      eq(quotes.leadId, leadId),
      eq(quotes.status, 'draf'),
      isNull(quotes.sharedAt),
      isNull(quotes.deletedAt),
    ))
    .orderBy(desc(quotes.createdAt))
    .limit(1)

  return draft
}

/**
 * Menyusun penawaran dari data lead yang sudah tersimpan — tanpa menempel pesan.
 *
 * Harga disalin ke setiap baris, bukan direferensikan, supaya terbitnya LPP
 * berikutnya tidak mengubah penawaran yang sudah dikirim ke jemaah.
 *
 * Kalau lead ini masih punya draf yang belum terkirim, draf itulah yang
 * dikembalikan — bukan penawaran baru. Tanpa penjagaan ini setiap penekanan
 * tombol menambah satu baris beserta rinciannya, dan menekan dua kali karena
 * ragu adalah hal yang wajar dilakukan orang. `force` menyediakan jalan keluar
 * untuk kebutuhan yang sah: jemaah berubah pikiran, atau LPP baru terbit dan
 * angkanya perlu disusun ulang.
 */
export async function buildQuoteFromLead(
  db: ReturnType<typeof useDb>,
  leadId: string,
  { force = false }: { force?: boolean } = {},
) {
  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1)
  if (!lead) throw createError({ statusCode: 404, statusMessage: 'Lead tidak ditemukan.' })

  if (!force) {
    const draft = await findReusableDraft(db, leadId)
    if (draft) return { quote: draft, missing: [] as string[], reused: true }
  }

  const [period] = await db
    .select()
    .from(ratePeriods)
    .where(eq(ratePeriods.isPublished, true))
    .orderBy(desc(ratePeriods.effectiveFrom))
    .limit(1)

  if (!period) {
    throw createError({ statusCode: 409, statusMessage: 'Belum ada periode tarif yang dipublikasikan.' })
  }

  // Tabel LPP hanya sampai okupansi 4; rombongan lebih besar memakai tarif berempat.
  const occupancy = Math.min(Math.max(lead.pax, 1), 4)

  const selections = await db
    .select({
      code: services.code,
      name: services.name,
      pricingUnit: services.pricingUnit,
      sortOrder: services.sortOrder,
      serviceId: services.id,
      hotelTier: leadServiceSelections.hotelTier,
      quantity: leadServiceSelections.quantity,
    })
    .from(leadServiceSelections)
    .innerJoin(services, eq(services.id, leadServiceSelections.serviceId))
    .where(eq(leadServiceSelections.leadId, leadId))
    .orderBy(services.sortOrder)

  if (!selections.length) {
    throw createError({ statusCode: 409, statusMessage: 'Lead ini belum memilih layanan apa pun.' })
  }

  const periodRates = await db.select().from(rates).where(eq(rates.ratePeriodId, period.id))
  const rateFor = (serviceId: string, tier: number | null, city: string | null) =>
    periodRates.find(r =>
      r.serviceId === serviceId
      && r.occupancy === occupancy
      && (r.hotelTier ?? null) === tier
      && (r.city ?? null) === city,
    )?.amount ?? null

  const drafts: DraftItem[] = []
  const missing: string[] = []

  for (const sel of selections) {
    if (sel.code === 'hotel') {
      // Jumlah malam diambil dari kolom lead, bukan dari quantity pilihan,
      // karena tarif Makkah dan Madinah berbeda dan harus dihitung terpisah.
      const tier = sel.hotelTier ?? lead.hotelTier ?? null
      if (!tier) { missing.push('Hotel (bintang belum dipilih)'); continue }

      for (const [city, nights, cityLabel] of [
        ['makkah', lead.nightsMakkah ?? 0, 'Makkah'],
        ['madinah', lead.nightsMadinah ?? 0, 'Madinah'],
      ] as const) {
        if (nights <= 0) continue
        const unit = rateFor(sel.serviceId, tier, city)
        if (unit === null) { missing.push(`Hotel ${cityLabel} bintang ${tier}`); continue }
        drafts.push({
          serviceId: sel.serviceId,
          label: `Hotel ${cityLabel} Bintang ${tier} (${nights} malam)`,
          hotelTier: tier,
          quantity: nights,
          unitAmount: unit,
        })
      }
      continue
    }

    const unit = rateFor(sel.serviceId, null, null)
    if (unit === null) { missing.push(sel.name); continue }

    const quantity = sel.pricingUnit === 'per_pax_hari'
      ? (sel.quantity ?? lead.pembimbingDays ?? 1)
      : 1

    drafts.push({
      serviceId: sel.serviceId,
      label: sel.pricingUnit === 'per_pax_hari' ? `${sel.name} (${quantity} hari)` : sel.name,
      hotelTier: null,
      quantity,
      unitAmount: unit,
    })
  }

  if (!drafts.length) {
    throw createError({
      statusCode: 409,
      statusMessage: `Tidak ada tarif yang cocok untuk layanan yang dipilih${missing.length ? `: ${missing.join(', ')}` : '.'}`,
    })
  }

  /**
   * Beberapa tarif LPP adalah hasil pembagian yang dibulatkan — tarif Paket Dasar
   * untuk okupansi 3 misalnya bernilai 6.566.667, yaitu 19.700.000 dibagi tiga.
   * Dikalikan kembali, hasilnya 19.700.001 dan angka janggal itu ikut tercetak di
   * penawaran jemaah. Total baris dibulatkan ke ribuan terdekat untuk mengembalikan
   * angka yang sebenarnya dimaksud LPP; harga di Indonesia memang tidak memakai
   * satuan di bawah seribu.
   */
  const roundToThousand = (value: number) => Math.round(value / 1000) * 1000

  const items = drafts.map((d, index) => {
    const perPaxAmount = d.unitAmount * d.quantity
    return {
      ...d,
      perPaxAmount,
      lineTotal: roundToThousand(perPaxAmount * lead.pax),
      sortOrder: index,
    }
  })

  const perPaxTotal = items.reduce((sum, i) => sum + i.perPaxAmount, 0)
  const grandTotal = items.reduce((sum, i) => sum + i.lineTotal, 0)

  const quoteNumber = await nextDocumentNumber(db, 'quote')

  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + 14)

  const [quote] = await db.insert(quotes).values({
    quoteNumber,
    leadId,
    ratePeriodId: period.id,
    pax: lead.pax,
    occupancy,
    perPaxTotal,
    grandTotal,
    status: 'draf',
    validUntil,
    publicToken: publicQuoteToken(),
  }).returning()

  if (!quote) throw createError({ statusCode: 500, statusMessage: 'Gagal membuat penawaran.' })

  await db.insert(quoteItems).values(items.map(i => ({
    quoteId: quote.id,
    serviceId: i.serviceId,
    label: i.label,
    hotelTier: i.hotelTier,
    quantity: i.quantity,
    unitAmount: i.unitAmount,
    perPaxAmount: i.perPaxAmount,
    lineTotal: i.lineTotal,
    sortOrder: i.sortOrder,
  })))

  // Lead yang sudah ditawarkan tidak lagi berstatus baru.
  await db.update(leads)
    .set({ status: 'ditawarkan', updatedAt: new Date() })
    .where(and(eq(leads.id, leadId), isNull(leads.deletedAt)))

  return { quote, missing, reused: false }
}

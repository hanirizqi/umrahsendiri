import { inArray, sql } from 'drizzle-orm'
import { contacts, leadServiceSelections, leads, services } from '../database/schema'

interface Selection { code: string, hotelTier?: number, quantity?: number }

function str(value: unknown, max = 500): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().slice(0, max)
  return trimmed || undefined
}

function int(value: unknown, min: number, max: number): number | undefined {
  const parsed = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(parsed)) return undefined
  const rounded = Math.trunc(parsed)
  return rounded >= min && rounded <= max ? rounded : undefined
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === 'string' && allowed.includes(value as T) ? value as T : undefined
}

export default defineEventHandler(async (event) => {
  // Endpoint ini publik dan sebentar lagi menerima trafik iklan, jadi juga bot.
  enforceRateLimit(event, {
    key: 'leads',
    limit: 20,
    windowMs: 60 * 60 * 1000,
    message: 'Terlalu banyak pengiriman. Coba lagi dalam satu jam.',
  })

  const body = await readBody<Record<string, unknown>>(event)

  const name = str(body?.name, 120)
  const phone = str(body?.phone, 40)
  const pax = int(body?.pax, 1, 100)

  if (!name || !phone || !pax) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nama, nomor HP, dan jumlah jemaah wajib diisi.',
    })
  }

  const db = useDb()

  const rawSelections: Selection[] = Array.isArray(body?.selections)
    ? (body.selections as Selection[]).filter(s => typeof s?.code === 'string').slice(0, 20)
    : []

  // Kode layanan dicocokkan ke katalog, jadi kiriman yang tidak dikenal diabaikan
  // ketimbang tersimpan sebagai data sampah.
  const codes = [...new Set(rawSelections.map(s => s.code))]
  const known = codes.length
    ? await db.select({ id: services.id, code: services.code })
        .from(services)
        .where(inArray(services.code, codes))
    : []
  const idByCode = new Map(known.map(s => [s.code, s.id]))

  /**
   * Menyatukan pengiriman ini dengan pengiriman sebelumnya dari nomor yang sama.
   * Nama diperbarui ke yang terakhir ditulis — kalau yang pertama salah ketik,
   * yang berlaku adalah pembetulannya.
   *
   * Kegagalan di sini tidak boleh menggagalkan penyimpanan lead: lead adalah
   * satu-satunya hasil dari anggaran iklan yang sudah terlanjur keluar,
   * sedangkan penghubung kontak bisa dirapikan kapan saja.
   */
  const phoneKey = normalizePhone(phone)
  let contactId: string | undefined
  if (phoneKey) {
    try {
      const [contact] = await db.insert(contacts)
        .values({ phone: phoneKey, name })
        .onConflictDoUpdate({
          target: contacts.phone,
          set: {
            // Nama yang sudah dibetulkan admin dipertahankan; selebihnya
            // mengikuti yang terakhir ditulis jemaah. Ditulis sebagai CASE,
            // bukan syarat pada UPDATE-nya, supaya barisnya tetap dikembalikan
            // dan lead ini tetap mendapat contactId.
            name: sql`case when ${contacts.nameSetManually} then ${contacts.name} else ${name} end`,
            updatedAt: new Date(),
          },
        })
        .returning({ id: contacts.id })
      contactId = contact?.id
    }
    catch (e) {
      console.error('[leads] Gagal menyatukan kontak, lead tetap disimpan.', e)
    }
  }

  const leadNumber = await nextDocumentNumber(db, 'lead')

  const [lead] = await db.insert(leads).values({
    leadNumber,
    contactId,
    name,
    phone,
    email: str(body?.email, 200),
    pax,
    departureTarget: str(body?.departureTarget, 100),
    flightStatus: oneOf(body?.flightStatus, ['sudah', 'belum'] as const),
    hotelStatus: oneOf(body?.hotelStatus, ['sudah', 'belum'] as const),
    planStatus: oneOf(body?.planStatus, ['sendiri', 'awal'] as const),
    hotelTier: int(body?.hotelTier, 3, 5),
    nightsMakkah: int(body?.nightsMakkah, 0, 90),
    nightsMadinah: int(body?.nightsMadinah, 0, 90),
    pembimbingDays: int(body?.pembimbingDays, 0, 90),
    message: str(body?.message, 2000),
    referralName: str(body?.referralName, 120),
    referralPhone: str(body?.referralPhone, 40),

    utmSource: str(body?.utmSource, 255),
    utmMedium: str(body?.utmMedium, 255),
    utmCampaign: str(body?.utmCampaign, 255),
    utmTerm: str(body?.utmTerm, 255),
    utmContent: str(body?.utmContent, 255),
    gclid: str(body?.gclid, 255),
    gaClientId: str(body?.gaClientId, 100),
    landingPage: str(body?.landingPage, 500),
    referrer: str(body?.referrer, 500),

    source: 'web_form',
    status: 'baru',
  }).returning({ id: leads.id, leadNumber: leads.leadNumber })

  if (!lead) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal menyimpan lead.' })
  }

  const rows = rawSelections
    .filter(s => idByCode.has(s.code))
    .map(s => ({
      leadId: lead.id,
      serviceId: idByCode.get(s.code)!,
      hotelTier: int(s.hotelTier, 3, 5),
      quantity: int(s.quantity, 0, 90),
    }))

  if (rows.length) {
    await db.insert(leadServiceSelections).values(rows).onConflictDoNothing()
  }

  return { ok: true, leadNumber: lead.leadNumber }
})

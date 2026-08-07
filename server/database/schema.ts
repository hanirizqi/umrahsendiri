import { boolean, index, integer, pgTable, smallint, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

/**
 * Katalog layanan. Menggantikan daftar yang sebelumnya di-hardcode di form kontak,
 * supaya menambah atau menonaktifkan layanan tidak perlu deploy ulang.
 */
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  /** per_pax | per_pax_malam | per_pax_hari — menentukan arti kolom quantity */
  pricingUnit: text('pricing_unit').notNull().default('per_pax'),
  needsHotelTier: boolean('needs_hotel_tier').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

/**
 * Setiap pengiriman form kontak.
 *
 * Kolom atribusi (utm*, gclid, gaClientId) hanya bisa diisi pada kunjungan
 * pertama — kalau tidak ditangkap saat itu, asal-usul lead hilang permanen dan
 * tidak ada cara merekonstruksinya. gclid khususnya diperlukan untuk mengunggah
 * balik konversi ke Google Ads saat lead benar-benar membayar.
 */
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadNumber: text('lead_number').notNull().unique(),

  // Identitas
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),

  // Kebutuhan perjalanan
  pax: integer('pax').notNull(),
  departureTarget: text('departure_target'),
  flightStatus: text('flight_status'),
  hotelStatus: text('hotel_status'),
  planStatus: text('plan_status'),
  hotelTier: smallint('hotel_tier'),
  nightsMakkah: integer('nights_makkah'),
  nightsMadinah: integer('nights_madinah'),
  pembimbingDays: integer('pembimbing_days'),
  message: text('message'),

  // Rujukan (masih teks bebas sampai sistem referral berjalan)
  referralName: text('referral_name'),
  referralPhone: text('referral_phone'),

  // Atribusi
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  utmTerm: text('utm_term'),
  utmContent: text('utm_content'),
  gclid: text('gclid'),
  gaClientId: text('ga_client_id'),
  landingPage: text('landing_page'),
  referrer: text('referrer'),

  // Alur kerja
  /** web_form | whatsapp | manual */
  source: text('source').notNull().default('web_form'),
  /** baru | dihubungi | ditawarkan | menang | kalah */
  status: text('status').notNull().default('baru'),
  note: text('note'),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, table => [
  index('leads_status_idx').on(table.status),
  index('leads_created_at_idx').on(table.createdAt),
  index('leads_phone_idx').on(table.phone),
  index('leads_gclid_idx').on(table.gclid),
])

/** Layanan yang dicentang jemaah di form — pengganti parsing pesan WhatsApp. */
export const leadServiceSelections = pgTable('lead_service_selections', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').notNull().references(() => services.id),
  hotelTier: smallint('hotel_tier'),
  quantity: integer('quantity'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => [
  uniqueIndex('lead_service_unique').on(table.leadId, table.serviceId),
  index('lead_service_lead_idx').on(table.leadId),
])

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
export type Service = typeof services.$inferSelect
export type LeadServiceSelection = typeof leadServiceSelections.$inferSelect

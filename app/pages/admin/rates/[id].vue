<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = route.params.id as string

const { data, error, refresh } = await useFetch(`/api/admin/rate-periods/${id}`)

useSeoMeta({
  title: data.value ? `${data.value.period.label} — Rates` : 'Rates',
  robots: 'noindex, nofollow',
})

const OCCUPANCIES = [1, 2, 3, 4]
const CITIES = [
  { value: 'makkah', label: 'Makkah' },
  { value: 'madinah', label: 'Madinah' },
]

const UNIT_LABEL: Record<string, string> = {
  per_pax: 'per pilgrim',
  per_pax_malam: 'per night',
  per_pax_hari: 'per day',
}

/**
 * Urutan dan nama bagian. Layanan yang kategorinya tidak dikenal jatuh ke
 * bagian terakhir ketimbang menghilang dari layar tanpa jejak.
 */
const SECTIONS = [
  { key: 'inti', label: 'Core package', hint: 'Included in every journey.' },
  { key: 'akomodasi', label: 'Accommodation', hint: 'Priced per night, per pilgrim, and split by star rating and city.' },
  { key: 'tambahan', label: 'Add-on services', hint: 'Chosen by the pilgrim on top of the core package.' },
]

/**
 * Satu baris tabel LPP: layanan (plus bintang dan kota untuk hotel) dengan
 * empat kolom jumlah jemaah.
 *
 * Jumlah barisnya adalah bagian dari data, bukan bagian dari tata letak.
 * Periode berikutnya bisa menambah layanan, menghentikan yang lain, atau hanya
 * menawarkan satu kelas hotel.
 */
interface Row {
  key: string
  serviceId: string
  hotelTier: number | null
  city: string | null
  amounts: (number | null)[]
}

const rows = ref<Row[]>([])
const meta = reactive({ label: '', effectiveFrom: '', note: '' })

function rowKey(serviceId: string, tier: number | null, city: string | null) {
  return `${serviceId}|${tier ?? ''}|${city ?? ''}`
}

const serviceById = computed(() =>
  new Map((data.value?.catalog ?? []).map(s => [s.id, s])),
)

function load() {
  if (!data.value) return

  meta.label = data.value.period.label
  meta.effectiveFrom = new Date(data.value.period.effectiveFrom).toISOString().slice(0, 10)
  meta.note = data.value.period.note ?? ''

  const byKey = new Map<string, Row>()
  for (const r of data.value.rates) {
    const key = rowKey(r.serviceId, r.hotelTier, r.city)
    if (!byKey.has(key)) {
      byKey.set(key, { key, serviceId: r.serviceId, hotelTier: r.hotelTier, city: r.city, amounts: [null, null, null, null] })
    }
    const row = byKey.get(key)!
    if (r.occupancy >= 1 && r.occupancy <= 4) row.amounts[r.occupancy - 1] = r.amount
  }

  rows.value = sortRows([...byKey.values()])
}

function sortRows(list: Row[]) {
  const order = new Map((data.value?.catalog ?? []).map((s, i) => [s.id, i]))
  return list.sort((a, b) => {
    const byService = (order.get(a.serviceId) ?? 99) - (order.get(b.serviceId) ?? 99)
    if (byService) return byService
    if ((a.hotelTier ?? 0) !== (b.hotelTier ?? 0)) return (a.hotelTier ?? 0) - (b.hotelTier ?? 0)
    return (a.city ?? '').localeCompare(b.city ?? '')
  })
}

load()
watch(data, load)

function serviceOf(row: Row) {
  return serviceById.value.get(row.serviceId)
}

function rowLabel(row: Row) {
  return serviceOf(row)?.name ?? 'Unknown service'
}

/**
 * Baris dikelompokkan ke bagian, lalu ke layanan di dalamnya.
 *
 * Nama layanan hanya dicetak sekali di baris pertama kelompoknya. Hotel punya
 * enam baris, dan mengulang namanya enam kali membuat kolom yang justru
 * membedakan — bintang dan kota — jadi tenggelam.
 */
const sections = computed(() => {
  return SECTIONS.map((section) => {
    const isLast = section.key === SECTIONS[SECTIONS.length - 1]?.key
    const known = new Set(SECTIONS.map(s => s.key))

    const inSection = rows.value.filter((row) => {
      const category = serviceOf(row)?.category ?? 'tambahan'
      return category === section.key || (isLast && !known.has(category))
    })

    return {
      ...section,
      rows: inSection.map((row, index) => ({
        row,
        firstOfService: inSection[index - 1]?.serviceId !== row.serviceId,
      })),
    }
  }).filter(section => section.rows.length)
})

// Menambah baris
const adding = reactive({ serviceId: '', hotelTier: 3, city: 'makkah' })
const addError = ref('')
const addingService = computed(() => serviceById.value.get(adding.serviceId))

function addRow() {
  addError.value = ''
  const service = addingService.value
  if (!service) return

  const tier = service.needsHotelTier ? Number(adding.hotelTier) : null
  const city = service.needsHotelTier ? adding.city : null

  if (service.needsHotelTier && (!Number.isInteger(tier) || tier! < 1 || tier! > 7)) {
    addError.value = 'Hotel star must be a whole number between 1 and 7.'
    return
  }

  const key = rowKey(service.id, tier, city)
  if (rows.value.some(r => r.key === key)) {
    addError.value = 'That line is already in this period.'
    return
  }

  rows.value = sortRows([...rows.value, { key, serviceId: service.id, hotelTier: tier, city, amounts: [null, null, null, null] }])
}

function removeRow(key: string) {
  rows.value = rows.value.filter(r => r.key !== key)
}

// Menyimpan
const saving = ref(false)
const saveError = ref('')
const savedNote = ref('')

function toRates() {
  const out: { serviceId: string, occupancy: number, hotelTier: number | null, city: string | null, amount: number }[] = []
  for (const row of rows.value) {
    row.amounts.forEach((amount, i) => {
      if (amount === null || amount === undefined || Number.isNaN(amount)) return
      out.push({ serviceId: row.serviceId, occupancy: i + 1, hotelTier: row.hotelTier, city: row.city, amount: Number(amount) })
    })
  }
  return out
}

const filledCount = computed(() => toRates().length)

async function save(publish?: boolean) {
  if (saving.value) return
  saving.value = true
  saveError.value = ''
  savedNote.value = ''
  try {
    const res = await $fetch<{ saved: number }>(`/api/admin/rate-periods/${id}`, {
      method: 'PUT',
      body: {
        label: meta.label,
        effectiveFrom: new Date(meta.effectiveFrom).toISOString(),
        note: meta.note,
        isPublished: publish ?? data.value?.period.isPublished,
        rates: toRates(),
      },
    })
    await refresh()
    savedNote.value = `Saved ${res.saved} rates.`
    setTimeout(() => (savedNote.value = ''), 3000)
  }
  catch (e) {
    saveError.value = (e as { statusMessage?: string })?.statusMessage ?? 'Could not save.'
  }
  finally {
    saving.value = false
  }
}

const fieldClass = 'mt-1.5 w-full rounded-xl border border-primary-100 bg-background px-3 py-2.5 text-sm text-ink outline-none focus:border-secondary-600'
</script>

<template>
  <SectionContainer>
    <div v-if="error" class="rounded-2xl border border-primary-100 bg-white/60 p-8 text-center">
      <p class="text-ink/60">Rate period not found.</p>
      <AppButton to="/admin/rates" variant="ghost" class="mt-4">Back to rates</AppButton>
    </div>

    <div v-else-if="data">
      <NuxtLink to="/admin/rates" class="inline-flex items-center gap-1.5 text-sm text-ink/60 transition-colors hover:text-primary">
        <Icon name="lucide:arrow-left" class="size-4" />
        All rate periods
      </NuxtLink>

      <div class="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="font-mono text-xs text-ink/40">{{ data.period.code }}</p>
          <h1 class="mt-1 font-display text-3xl font-bold text-primary">{{ data.period.label }}</h1>
          <p class="mt-1 text-sm text-ink/60">
            {{ filledCount }} rates across {{ rows.length }} lines
            <span v-if="data.period.isPublished" class="text-secondary-700">· published</span>
            <span v-else class="text-ink/40">· draft, not used by quotes yet</span>
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <AppButton variant="ghost" :disabled="saving" @click="save(false)">
            {{ data.period.isPublished ? 'Save & unpublish' : 'Save draft' }}
          </AppButton>
          <AppButton variant="primary" :disabled="saving" @click="save(true)">
            {{ saving ? 'Saving…' : data.period.isPublished ? 'Save' : 'Save & publish' }}
            <Icon name="lucide:check" class="size-4" />
          </AppButton>
        </div>
      </div>

      <p v-if="saveError" role="alert" class="mt-4 rounded-xl bg-secondary-100/50 px-4 py-3 text-sm text-primary-700">
        {{ saveError }}
      </p>
      <p v-if="savedNote" class="mt-4 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-700">
        {{ savedNote }}
      </p>

      <div class="mt-8 grid gap-4 rounded-2xl border border-primary-100 bg-white/60 p-6 sm:grid-cols-3">
        <div>
          <label for="label" class="text-xs text-ink/50">Label</label>
          <input id="label" v-model="meta.label" type="text" :class="fieldClass">
        </div>
        <div>
          <label for="effectiveFrom" class="text-xs text-ink/50">Starts from</label>
          <input id="effectiveFrom" v-model="meta.effectiveFrom" type="date" :class="fieldClass">
        </div>
        <div>
          <label for="note" class="text-xs text-ink/50">Note</label>
          <input id="note" v-model="meta.note" type="text" placeholder="Where these came from" :class="fieldClass">
        </div>
      </div>

      <div class="mt-6 rounded-2xl border border-primary-100 bg-white/60">
        <div class="border-b border-primary-100 px-6 py-4">
          <p class="font-display text-sm font-semibold text-primary">Rates</p>
          <p class="mt-1 max-w-3xl text-xs text-ink/55">
            Every amount is the price <strong>per pilgrim</strong>, in rupiah. The columns are
            the size of the group: with more pilgrims the cost per person falls, because
            transport, documents and rooms are shared. For hotels the number is also how many
            share one room; for everything else it is simply how many people are travelling.
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[860px] text-sm">
            <thead>
              <tr class="border-b border-primary-100 text-left text-xs tracking-wide text-ink/50 uppercase">
                <th scope="col" class="px-6 py-3 font-semibold">Service</th>
                <th scope="col" class="px-3 py-3 font-semibold">Stars</th>
                <th scope="col" class="px-3 py-3 font-semibold">City</th>
                <th scope="col" class="px-3 py-3 font-semibold">Unit</th>
                <th v-for="occ in OCCUPANCIES" :key="occ" scope="col" class="px-3 py-3 text-right font-semibold">
                  {{ occ }} pilgrim{{ occ === 1 ? '' : 's' }}
                </th>
                <th scope="col" class="px-4 py-3" />
              </tr>
            </thead>
            <tbody v-if="!rows.length">
              <tr>
                <td colspan="9" class="px-6 py-10 text-center text-sm text-ink/50">
                  No rates in this period yet. Add a line below.
                </td>
              </tr>
            </tbody>

            <tbody v-for="section in sections" :key="section.key">
              <tr class="border-t border-primary-100 bg-primary-50/50">
                <th colspan="9" scope="colgroup" class="px-6 py-2.5 text-left">
                  <span class="font-display text-xs font-bold tracking-wide text-primary uppercase">{{ section.label }}</span>
                  <span class="ml-2 text-xs font-normal text-ink/45">{{ section.hint }}</span>
                </th>
              </tr>

              <tr
                v-for="{ row, firstOfService } in section.rows"
                :key="row.key"
                class="border-t border-primary-100/40 hover:bg-primary-50/30"
              >
                <td class="px-6 py-3 align-top">
                  <template v-if="firstOfService">
                    <p class="font-medium text-ink/85">{{ rowLabel(row) }}</p>
                    <p v-if="serviceOf(row)?.description" class="mt-0.5 max-w-[22rem] text-xs leading-relaxed text-ink/45">
                      {{ serviceOf(row)?.description }}
                    </p>
                  </template>
                </td>
                <td class="px-3 py-3 text-ink/60">{{ row.hotelTier ?? '—' }}</td>
                <td class="px-3 py-3 text-ink/60">
                  {{ CITIES.find(c => c.value === row.city)?.label ?? '—' }}
                </td>
                <td class="px-3 py-3 text-xs text-ink/45">
                  {{ UNIT_LABEL[serviceOf(row)?.pricingUnit ?? ''] ?? '—' }}
                </td>
                <td v-for="occ in OCCUPANCIES" :key="occ" class="px-3 py-2">
                  <MoneyInput
                    v-model="row.amounts[occ - 1]"
                    :aria-label="`${rowLabel(row)}, ${occ} pilgrims`"
                  />
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    type="button"
                    class="flex size-8 items-center justify-center rounded-lg text-ink/35 transition-colors hover:bg-secondary-100/50 hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:outline-none"
                    :aria-label="`Remove ${rowLabel(row)} from this period`"
                    :title="`Remove ${rowLabel(row)}`"
                    @click="removeRow(row.key)"
                  >
                    <Icon name="lucide:trash-2" class="size-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="border-t border-primary-100 px-6 py-5">
          <div class="flex flex-wrap items-end gap-3">
            <div class="min-w-[220px] flex-1">
              <label for="addService" class="text-xs text-ink/50">Add a line for</label>
              <select id="addService" v-model="adding.serviceId" :class="fieldClass">
                <option value="">Choose a service</option>
                <option v-for="s in data.catalog" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>

            <template v-if="addingService?.needsHotelTier">
              <div class="w-24">
                <label for="addTier" class="text-xs text-ink/50">Stars</label>
                <input id="addTier" v-model.number="adding.hotelTier" type="number" min="1" max="7" :class="fieldClass">
              </div>
              <div class="w-36">
                <label for="addCity" class="text-xs text-ink/50">City</label>
                <select id="addCity" v-model="adding.city" :class="fieldClass">
                  <option v-for="c in CITIES" :key="c.value" :value="c.value">{{ c.label }}</option>
                </select>
              </div>
            </template>

            <AppButton variant="ghost" :disabled="!adding.serviceId" @click="addRow">
              Add line
              <Icon name="lucide:plus" class="size-4" />
            </AppButton>
          </div>

          <p v-if="addError" role="alert" class="mt-3 text-xs text-primary-700">{{ addError }}</p>
          <p v-else class="mt-3 text-xs text-ink/45">
            Leave a column empty to skip it — a line with two amounts stores two rates, not four.
          </p>
        </div>
      </div>
    </div>
  </SectionContainer>
</template>

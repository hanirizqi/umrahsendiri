<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = route.params.id as string

const { data, error } = await useFetch(`/api/admin/leads/${id}`)

useSeoMeta({
  title: data.value ? `${data.value.lead.name} — Lead` : 'Lead',
  robots: 'noindex, nofollow',
})

const STATUS_OPTIONS = [
  { value: 'baru', label: 'New' },
  { value: 'dihubungi', label: 'Contacted' },
  { value: 'ditawarkan', label: 'Quoted' },
  { value: 'menang', label: 'Won' },
  { value: 'kalah', label: 'Lost' },
]

const status = ref(data.value?.lead.status ?? 'baru')
const note = ref(data.value?.lead.note ?? '')
const saving = ref(false)
const saved = ref(false)

async function save() {
  saving.value = true
  saved.value = false
  try {
    await $fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      body: { status: status.value, note: note.value },
    })
    saved.value = true
    setTimeout(() => (saved.value = false), 2500)
  }
  finally {
    saving.value = false
  }
}

const creating = ref(false)
const createError = ref('')

async function createQuote() {
  creating.value = true
  createError.value = ''
  try {
    const res = await $fetch<{ id: string }>(`/api/admin/leads/${id}/quote`, { method: 'POST' })
    await navigateTo(`/admin/quotes/${res.id}`)
  }
  catch (e) {
    createError.value = (e as { statusMessage?: string })?.statusMessage ?? 'Could not create the quote.'
  }
  finally {
    creating.value = false
  }
}

function formatDate(value: string | Date | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const waHref = computed(() => {
  const lead = data.value?.lead
  if (!lead) return undefined
  const digits = lead.phone.replace(/\D/g, '').replace(/^0/, '62')
  return `https://wa.me/${digits}`
})

const attribution = computed(() => {
  const l = data.value?.lead
  if (!l) return []
  return [
    { label: 'Source', value: l.utmSource },
    { label: 'Medium', value: l.utmMedium },
    { label: 'Campaign', value: l.utmCampaign },
    { label: 'Keyword', value: l.utmTerm },
    { label: 'Ad content', value: l.utmContent },
    { label: 'Google Click ID', value: l.gclid },
    { label: 'GA client ID', value: l.gaClientId },
    { label: 'Landing page', value: l.landingPage },
    { label: 'Referrer', value: l.referrer },
  ].filter(row => row.value)
})

const STATUS_LABEL: Record<string, string> = {
  sudah: 'Yes', belum: 'Not yet', sendiri: 'Has a partial plan', awal: 'Needs help from scratch',
}
</script>

<template>
  <SectionContainer>
    <div v-if="error" class="rounded-2xl border border-primary-100 bg-white/60 p-8 text-center">
      <p class="text-ink/60">Lead not found.</p>
      <AppButton to="/admin/leads" variant="ghost" class="mt-4">Back to list</AppButton>
    </div>

    <div v-else-if="data">
      <NuxtLink to="/admin/leads" class="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-primary">
        <Icon name="lucide:arrow-left" class="size-4" />
        All leads
      </NuxtLink>

      <div class="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="font-mono text-xs text-ink/40">{{ data.lead.leadNumber }}</p>
          <h1 class="mt-1 font-display text-3xl font-bold text-primary">{{ data.lead.name }}</h1>
          <p class="mt-1 text-sm text-ink/60">Received {{ formatDate(data.lead.createdAt) }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <AppButton :href="waHref" variant="ghost">
            Message on WhatsApp
            <Icon name="lucide:message-circle" class="size-4" />
          </AppButton>
          <AppButton variant="primary" :disabled="creating" @click="createQuote">
            {{ creating ? 'Creating…' : 'Create Quote' }}
            <Icon :name="creating ? 'lucide:loader-circle' : 'lucide:file-text'" class="size-4" :class="{ 'animate-spin': creating }" />
          </AppButton>
        </div>
      </div>

      <p v-if="createError" role="alert" class="mt-4 rounded-xl bg-secondary-100/50 px-4 py-3 text-sm text-primary-700">
        {{ createError }}
      </p>

      <div class="mt-10 grid gap-8 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <div class="rounded-2xl border border-primary-100 bg-white/60 p-6">
            <p class="font-display text-sm font-semibold text-primary">Pilgrim Requirements</p>
            <dl class="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <dt class="text-ink/50">Phone</dt>
                <dd class="text-ink">{{ data.lead.phone }}</dd>
              </div>
              <div>
                <dt class="text-ink/50">Pilgrims</dt>
                <dd class="text-ink">{{ data.lead.pax }} pax</dd>
              </div>
              <div>
                <dt class="text-ink/50">Target departure</dt>
                <dd class="text-ink">{{ data.lead.departureTarget || '—' }}</dd>
              </div>
              <div>
                <dt class="text-ink/50">Flight</dt>
                <dd class="text-ink">{{ STATUS_LABEL[data.lead.flightStatus ?? ''] ?? '—' }}</dd>
              </div>
              <div>
                <dt class="text-ink/50">Hotel booking</dt>
                <dd class="text-ink">{{ STATUS_LABEL[data.lead.hotelStatus ?? ''] ?? '—' }}</dd>
              </div>
              <div>
                <dt class="text-ink/50">Own plan</dt>
                <dd class="text-ink">{{ STATUS_LABEL[data.lead.planStatus ?? ''] ?? '—' }}</dd>
              </div>
            </dl>

            <div v-if="data.lead.message" class="mt-5 border-t border-primary-100/60 pt-4">
              <p class="text-xs text-ink/50">Message</p>
              <p class="mt-1 text-sm whitespace-pre-line text-ink/80">{{ data.lead.message }}</p>
            </div>

            <div v-if="data.lead.referralName" class="mt-5 border-t border-primary-100/60 pt-4">
              <p class="text-xs text-ink/50">Referral</p>
              <p class="mt-1 text-sm text-ink/80">
                {{ data.lead.referralName }}
                <span v-if="data.lead.referralPhone" class="text-ink/50">· {{ data.lead.referralPhone }}</span>
              </p>
            </div>
          </div>

          <div class="rounded-2xl border border-primary-100 bg-white/60 p-6">
            <p class="font-display text-sm font-semibold text-primary">Requested Services</p>
            <ul v-if="data.selections.length" class="mt-4 space-y-2.5 text-sm">
              <li v-for="s in data.selections" :key="s.code" class="flex items-start gap-2.5">
                <Icon name="lucide:check" class="mt-0.5 size-4 shrink-0 text-secondary-700" />
                <span class="text-ink/80">
                  {{ s.name }}
                  <span v-if="s.hotelTier" class="text-ink/50">· Bintang {{ s.hotelTier }}</span>
                  <span v-if="s.quantity" class="text-ink/50">
                    · {{ s.quantity }} {{ s.pricingUnit === 'per_pax_hari' ? 'days' : 'nights' }}
                  </span>
                </span>
              </li>
            </ul>
            <p v-else class="mt-3 text-sm text-ink/50">No services were selected.</p>

            <div v-if="data.lead.nightsMakkah || data.lead.nightsMadinah" class="mt-4 border-t border-primary-100/60 pt-4 text-sm text-ink/70">
              {{ data.lead.nightsMakkah ?? 0 }} nights in Makkah · {{ data.lead.nightsMadinah ?? 0 }} nights in Madinah
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-2xl border border-primary-100 bg-white/60 p-6">
            <p class="font-display text-sm font-semibold text-primary">Follow-up</p>

            <label for="status" class="mt-4 block text-xs text-ink/50">Status</label>
            <select
              id="status"
              v-model="status"
              class="mt-1.5 w-full rounded-xl border border-primary-100 bg-background px-3 py-2.5 text-sm text-ink outline-none focus:border-secondary-600"
            >
              <option v-for="opt in STATUS_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>

            <label for="note" class="mt-4 block text-xs text-ink/50">Internal note</label>
            <textarea
              id="note"
              v-model="note"
              rows="5"
              placeholder="Call outcome, agreement, or a reminder"
              class="mt-1.5 w-full resize-none rounded-xl border border-primary-100 bg-background px-3 py-2.5 text-sm text-ink outline-none focus:border-secondary-600"
            />

            <AppButton variant="primary" class="mt-4 w-full" :disabled="saving" @click="save">
              {{ saving ? 'Saving…' : 'Save' }}
            </AppButton>
            <p v-if="saved" class="mt-2 text-center text-xs text-secondary-700">Saved.</p>
          </div>

          <div class="rounded-2xl border border-primary-100 bg-white/60 p-6">
            <p class="font-display text-sm font-semibold text-primary">Attribution</p>
            <dl v-if="attribution.length" class="mt-4 space-y-3 text-sm">
              <div v-for="row in attribution" :key="row.label">
                <dt class="text-xs text-ink/50">{{ row.label }}</dt>
                <dd class="font-mono text-xs break-all text-ink/80">{{ row.value }}</dd>
              </div>
            </dl>
            <p v-else class="mt-3 text-sm text-ink/50">
              Came directly, not from an ad.
            </p>
          </div>
        </div>
      </div>
    </div>
  </SectionContainer>
</template>

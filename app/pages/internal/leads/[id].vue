<script setup lang="ts">
definePageMeta({ layout: 'internal' })

const route = useRoute()
const id = route.params.id as string

const { data, error } = await useFetch(`/api/internal/leads/${id}`)

useSeoMeta({
  title: data.value ? `${data.value.lead.name} — Lead` : 'Lead',
  robots: 'noindex, nofollow',
})

const STATUS_OPTIONS = [
  { value: 'baru', label: 'Baru' },
  { value: 'dihubungi', label: 'Dihubungi' },
  { value: 'ditawarkan', label: 'Ditawarkan' },
  { value: 'menang', label: 'Menang' },
  { value: 'kalah', label: 'Kalah' },
]

const status = ref(data.value?.lead.status ?? 'baru')
const note = ref(data.value?.lead.note ?? '')
const saving = ref(false)
const saved = ref(false)

async function simpan() {
  saving.value = true
  saved.value = false
  try {
    await $fetch(`/api/internal/leads/${id}`, {
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
    { label: 'Sumber', value: l.utmSource },
    { label: 'Medium', value: l.utmMedium },
    { label: 'Campaign', value: l.utmCampaign },
    { label: 'Kata kunci', value: l.utmTerm },
    { label: 'Konten iklan', value: l.utmContent },
    { label: 'Google Click ID', value: l.gclid },
    { label: 'GA client ID', value: l.gaClientId },
    { label: 'Halaman mendarat', value: l.landingPage },
    { label: 'Datang dari', value: l.referrer },
  ].filter(row => row.value)
})

const STATUS_LABEL: Record<string, string> = {
  sudah: 'Sudah', belum: 'Belum', sendiri: 'Sudah punya sebagian rencana', awal: 'Perlu dibantu dari awal',
}
</script>

<template>
  <SectionContainer>
    <div v-if="error" class="rounded-2xl border border-primary-100 bg-white/60 p-8 text-center">
      <p class="text-ink/60">Lead tidak ditemukan.</p>
      <AppButton to="/internal/leads" variant="ghost" class="mt-4">Kembali ke daftar</AppButton>
    </div>

    <div v-else-if="data">
      <NuxtLink to="/internal/leads" class="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-primary">
        <Icon name="lucide:arrow-left" class="size-4" />
        Semua lead
      </NuxtLink>

      <div class="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="font-mono text-xs text-ink/40">{{ data.lead.leadNumber }}</p>
          <h1 class="mt-1 font-display text-3xl font-bold text-primary">{{ data.lead.name }}</h1>
          <p class="mt-1 text-sm text-ink/60">Masuk {{ formatDate(data.lead.createdAt) }}</p>
        </div>
        <AppButton :href="waHref" variant="primary">
          Hubungi via WhatsApp
          <Icon name="lucide:message-circle" class="size-4" />
        </AppButton>
      </div>

      <div class="mt-10 grid gap-8 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <div class="rounded-2xl border border-primary-100 bg-white/60 p-6">
            <p class="font-display text-sm font-semibold text-primary">Kebutuhan Jemaah</p>
            <dl class="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <dt class="text-ink/50">Nomor HP</dt>
                <dd class="text-ink">{{ data.lead.phone }}</dd>
              </div>
              <div>
                <dt class="text-ink/50">Jumlah jemaah</dt>
                <dd class="text-ink">{{ data.lead.pax }} orang</dd>
              </div>
              <div>
                <dt class="text-ink/50">Target keberangkatan</dt>
                <dd class="text-ink">{{ data.lead.departureTarget || '—' }}</dd>
              </div>
              <div>
                <dt class="text-ink/50">Penerbangan</dt>
                <dd class="text-ink">{{ STATUS_LABEL[data.lead.flightStatus ?? ''] ?? '—' }}</dd>
              </div>
              <div>
                <dt class="text-ink/50">Reservasi hotel</dt>
                <dd class="text-ink">{{ STATUS_LABEL[data.lead.hotelStatus ?? ''] ?? '—' }}</dd>
              </div>
              <div>
                <dt class="text-ink/50">Rencana sendiri</dt>
                <dd class="text-ink">{{ STATUS_LABEL[data.lead.planStatus ?? ''] ?? '—' }}</dd>
              </div>
            </dl>

            <div v-if="data.lead.message" class="mt-5 border-t border-primary-100/60 pt-4">
              <p class="text-xs text-ink/50">Pesan</p>
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
            <p class="font-display text-sm font-semibold text-primary">Layanan yang Diminta</p>
            <ul v-if="data.selections.length" class="mt-4 space-y-2.5 text-sm">
              <li v-for="s in data.selections" :key="s.code" class="flex items-start gap-2.5">
                <Icon name="lucide:check" class="mt-0.5 size-4 shrink-0 text-secondary-700" />
                <span class="text-ink/80">
                  {{ s.name }}
                  <span v-if="s.hotelTier" class="text-ink/50">· Bintang {{ s.hotelTier }}</span>
                  <span v-if="s.quantity" class="text-ink/50">
                    · {{ s.quantity }} {{ s.pricingUnit === 'per_pax_hari' ? 'hari' : 'malam' }}
                  </span>
                </span>
              </li>
            </ul>
            <p v-else class="mt-3 text-sm text-ink/50">Tidak ada layanan yang dicentang.</p>

            <div v-if="data.lead.nightsMakkah || data.lead.nightsMadinah" class="mt-4 border-t border-primary-100/60 pt-4 text-sm text-ink/70">
              {{ data.lead.nightsMakkah ?? 0 }} malam Makkah · {{ data.lead.nightsMadinah ?? 0 }} malam Madinah
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-2xl border border-primary-100 bg-white/60 p-6">
            <p class="font-display text-sm font-semibold text-primary">Tindak Lanjut</p>

            <label for="status" class="mt-4 block text-xs text-ink/50">Status</label>
            <select
              id="status"
              v-model="status"
              class="mt-1.5 w-full rounded-xl border border-primary-100 bg-background px-3 py-2.5 text-sm text-ink outline-none focus:border-secondary-600"
            >
              <option v-for="opt in STATUS_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>

            <label for="note" class="mt-4 block text-xs text-ink/50">Catatan internal</label>
            <textarea
              id="note"
              v-model="note"
              rows="5"
              placeholder="Hasil percakapan, kesepakatan, atau pengingat"
              class="mt-1.5 w-full resize-none rounded-xl border border-primary-100 bg-background px-3 py-2.5 text-sm text-ink outline-none focus:border-secondary-600"
            />

            <AppButton variant="primary" class="mt-4 w-full" :disabled="saving" @click="simpan">
              {{ saving ? 'Menyimpan…' : 'Simpan' }}
            </AppButton>
            <p v-if="saved" class="mt-2 text-center text-xs text-secondary-700">Tersimpan.</p>
          </div>

          <div class="rounded-2xl border border-primary-100 bg-white/60 p-6">
            <p class="font-display text-sm font-semibold text-primary">Asal-usul</p>
            <dl v-if="attribution.length" class="mt-4 space-y-3 text-sm">
              <div v-for="row in attribution" :key="row.label">
                <dt class="text-xs text-ink/50">{{ row.label }}</dt>
                <dd class="font-mono text-xs break-all text-ink/80">{{ row.value }}</dd>
              </div>
            </dl>
            <p v-else class="mt-3 text-sm text-ink/50">
              Datang langsung, bukan dari iklan.
            </p>
          </div>
        </div>
      </div>
    </div>
  </SectionContainer>
</template>

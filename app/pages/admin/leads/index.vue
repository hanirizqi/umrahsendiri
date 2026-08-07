<script setup lang="ts">
definePageMeta({ layout: 'admin' })

useSeoMeta({ title: 'Lead — Admin', robots: 'noindex, nofollow' })

const STATUS_FILTERS = [
  { value: '', label: 'Semua' },
  { value: 'baru', label: 'Baru' },
  { value: 'dihubungi', label: 'Dihubungi' },
  { value: 'ditawarkan', label: 'Ditawarkan' },
  { value: 'menang', label: 'Menang' },
  { value: 'kalah', label: 'Kalah' },
]

const status = ref('')
const { data, pending, refresh } = await useFetch('/api/admin/leads', {
  query: { status },
})

watch(status, () => refresh())

function formatDate(value: string | Date) {
  return new Date(value).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isFromAds(lead: { gclid?: string | null, utmSource?: string | null }) {
  return Boolean(lead.gclid || lead.utmSource)
}
</script>

<template>
  <SectionContainer>
    <SectionHeading
      align="left"
      title="Lead Masuk"
      description="Setiap pengiriman form kontak tersimpan di sini, lengkap dengan asal-usulnya."
    />

    <div v-if="data" class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border border-primary-100 bg-white/60 p-5">
        <p class="text-xs text-ink/50">Total lead</p>
        <p class="mt-1 font-display text-2xl font-bold text-primary">{{ data.summary.total }}</p>
      </div>
      <div class="rounded-2xl border border-primary-100 bg-white/60 p-5">
        <p class="text-xs text-ink/50">Belum dihubungi</p>
        <p class="mt-1 font-display text-2xl font-bold text-primary">{{ data.summary.byStatus.baru ?? 0 }}</p>
      </div>
      <div class="rounded-2xl border border-primary-100 bg-white/60 p-5">
        <p class="text-xs text-ink/50">Dari iklan</p>
        <p class="mt-1 font-display text-2xl font-bold text-secondary-700">{{ data.summary.fromAds }}</p>
      </div>
      <div class="rounded-2xl border border-primary-100 bg-white/60 p-5">
        <p class="text-xs text-ink/50">Menang</p>
        <p class="mt-1 font-display text-2xl font-bold text-primary">{{ data.summary.byStatus.menang ?? 0 }}</p>
      </div>
    </div>

    <div class="mt-8 flex flex-wrap gap-2">
      <button
        v-for="filter in STATUS_FILTERS"
        :key="filter.value"
        type="button"
        class="rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
        :class="status === filter.value
          ? 'border-primary bg-primary text-background'
          : 'border-primary-100 text-ink/70 hover:border-primary/30 hover:text-primary'"
        @click="status = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="mt-6 overflow-x-auto rounded-2xl border border-primary-100 bg-white/60">
      <table class="w-full min-w-[760px] text-sm">
        <thead>
          <tr class="border-b border-primary-100 text-left text-xs tracking-wider text-ink/50 uppercase">
            <th class="px-5 py-3 font-semibold">Lead</th>
            <th class="px-5 py-3 font-semibold">Kontak</th>
            <th class="px-5 py-3 font-semibold">Jemaah</th>
            <th class="px-5 py-3 font-semibold">Sumber</th>
            <th class="px-5 py-3 font-semibold">Status</th>
            <th class="px-5 py-3 font-semibold">Masuk</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td colspan="6" class="px-5 py-10 text-center text-ink/50">Memuat…</td>
          </tr>
          <tr v-else-if="!data?.leads.length">
            <td colspan="6" class="px-5 py-10 text-center text-ink/50">
              Belum ada lead pada filter ini.
            </td>
          </tr>
          <tr
            v-for="lead in data?.leads"
            v-else
            :key="lead.id"
            class="border-b border-primary-100/50 transition-colors last:border-0 hover:bg-primary-50/40"
          >
            <td class="px-5 py-4">
              <NuxtLink :to="`/admin/leads/${lead.id}`" class="font-medium text-primary hover:underline">
                {{ lead.name }}
              </NuxtLink>
              <p class="font-mono text-xs text-ink/40">{{ lead.leadNumber }}</p>
            </td>
            <td class="px-5 py-4 text-ink/70">{{ lead.phone }}</td>
            <td class="px-5 py-4 text-ink/70">
              {{ lead.pax }} orang
              <span v-if="lead.departureTarget" class="block text-xs text-ink/40">{{ lead.departureTarget }}</span>
            </td>
            <td class="px-5 py-4">
              <span
                v-if="isFromAds(lead)"
                class="inline-flex items-center gap-1 rounded-full bg-secondary-100/60 px-2.5 py-1 text-xs font-medium text-secondary-700"
              >
                <Icon name="lucide:megaphone" class="size-3" />
                {{ lead.utmCampaign || lead.utmSource || 'Iklan' }}
              </span>
              <span v-else class="text-xs text-ink/40">Organik</span>
            </td>
            <td class="px-5 py-4">
              <LeadStatusBadge :status="lead.status" />
            </td>
            <td class="px-5 py-4 text-xs text-ink/50">{{ formatDate(lead.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </SectionContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

useSeoMeta({ title: 'Leads — Admin', robots: 'noindex, nofollow' })

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'baru', label: 'New' },
  { value: 'dihubungi', label: 'Contacted' },
  { value: 'ditawarkan', label: 'Quoted' },
  { value: 'menang', label: 'Won' },
  { value: 'kalah', label: 'Lost' },
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
      title="Leads"
      description="Every contact form submission lands here, along with where it came from."
    />

    <div v-if="data" class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border border-primary-100 bg-white/60 p-5">
        <p class="text-xs text-ink/50">Total leads</p>
        <p class="mt-1 font-display text-2xl font-bold text-primary">{{ data.summary.total }}</p>
      </div>
      <div class="rounded-2xl border border-primary-100 bg-white/60 p-5">
        <p class="text-xs text-ink/50">Uncontacted</p>
        <p class="mt-1 font-display text-2xl font-bold text-primary">{{ data.summary.byStatus.baru ?? 0 }}</p>
      </div>
      <div class="rounded-2xl border border-primary-100 bg-white/60 p-5">
        <p class="text-xs text-ink/50">From ads</p>
        <p class="mt-1 font-display text-2xl font-bold text-secondary-700">{{ data.summary.fromAds }}</p>
      </div>
      <div class="rounded-2xl border border-primary-100 bg-white/60 p-5">
        <p class="text-xs text-ink/50">Won</p>
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
            <th class="px-5 py-3 font-semibold">Contact</th>
            <th class="px-5 py-3 font-semibold">Pilgrims</th>
            <th class="px-5 py-3 font-semibold">Source</th>
            <th class="px-5 py-3 font-semibold">Status</th>
            <th class="px-5 py-3 font-semibold">Received</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td colspan="6" class="px-5 py-10 text-center text-ink/50">Loading…</td>
          </tr>
          <tr v-else-if="!data?.leads.length">
            <td colspan="6" class="px-5 py-10 text-center text-ink/50">
              No leads match this filter yet.
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
              {{ lead.pax }} pax
              <span v-if="lead.departureTarget" class="block text-xs text-ink/40">{{ lead.departureTarget }}</span>
            </td>
            <td class="px-5 py-4">
              <span
                v-if="isFromAds(lead)"
                class="inline-flex items-center gap-1 rounded-full bg-secondary-100/60 px-2.5 py-1 text-xs font-medium text-secondary-700"
              >
                <Icon name="lucide:megaphone" class="size-3" />
                {{ lead.utmCampaign || lead.utmSource || 'Ads' }}
              </span>
              <span v-else class="text-xs text-ink/40">Organic</span>
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

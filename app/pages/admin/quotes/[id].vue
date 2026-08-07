<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = route.params.id as string

const { data, error } = await useFetch(`/api/admin/quotes/${id}`)

useSeoMeta({
  title: data.value ? `${data.value.quote.quoteNumber} — Admin` : 'Quote — Admin',
  robots: 'noindex, nofollow',
})

const config = useRuntimeConfig()
const shareUrl = computed(() => {
  if (!data.value) return ''
  const base = import.meta.client ? window.location.origin : (config.public.siteUrl ?? '')
  return `${base}/q/${data.value.quote.publicToken}`
})

const waHref = computed(() => {
  if (!data.value) return undefined
  const digits = data.value.lead.phone.replace(/\D/g, '').replace(/^0/, '62')
  const text = `Assalamualaikum ${data.value.lead.name}, berikut penawaran umrah dari UmrahSendiri:\n\n${shareUrl.value}\n\nSilakan dibuka, dan kabari kalau ada yang ingin disesuaikan.`
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
})

function printPage() {
  window.print()
}

const copied = ref(false)
async function copyLink() {
  await navigator.clipboard.writeText(shareUrl.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function formatDateTime(value?: string | Date | null) {
  if (!value) return null
  return new Date(value).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
</script>

<template>
  <SectionContainer>
    <div v-if="error" class="rounded-2xl border border-primary-100 bg-white/60 p-8 text-center">
      <p class="text-ink/60">Quote not found.</p>
      <AppButton to="/admin/leads" variant="ghost" class="mt-4">Back to leads</AppButton>
    </div>

    <div v-else-if="data">
      <NuxtLink
        :to="`/admin/leads/${data.lead.id}`"
        class="inline-flex items-center gap-1.5 text-sm text-ink/60 transition-colors hover:text-primary"
      >
        <Icon name="lucide:arrow-left" class="size-4" />
        {{ data.lead.name }}
      </NuxtLink>

      <div class="mt-4 flex flex-wrap items-start justify-between gap-4 print:hidden">
        <div>
          <p class="font-mono text-xs text-ink/40">{{ data.quote.quoteNumber }}</p>
          <h1 class="mt-1 font-display text-3xl font-bold text-primary">Quote</h1>
          <p class="mt-1 text-sm text-ink/60">
            Rates from {{ data.periodLabel }}
            <span v-if="data.quote.viewCount" class="text-secondary-700">
              · opened {{ data.quote.viewCount }}×, last {{ formatDateTime(data.quote.lastViewedAt) }}
            </span>
            <span v-else>· not opened yet</span>
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <AppButton variant="ghost" @click="copyLink">
            <Icon :name="copied ? 'lucide:check' : 'lucide:link'" class="size-4" />
            {{ copied ? 'Copied' : 'Copy link' }}
          </AppButton>
          <AppButton variant="ghost" @click="printPage">
            <Icon name="lucide:printer" class="size-4" />
            Print / PDF
          </AppButton>
          <AppButton :href="waHref" variant="primary">
            Send on WhatsApp
            <Icon name="lucide:send" class="size-4" />
          </AppButton>
        </div>
      </div>

      <div class="mt-4 rounded-xl border border-primary-100 bg-primary-50/40 px-4 py-3 print:hidden">
        <p class="text-xs text-ink/50">Link for the pilgrim</p>
        <p class="mt-0.5 font-mono text-xs break-all text-ink/70">{{ shareUrl }}</p>
      </div>

      <div class="mt-8">
        <QuoteDocument
          :quote-number="data.quote.quoteNumber"
          :name="data.lead.name"
          :pax="data.quote.pax"
          :departure-target="data.lead.departureTarget"
          :per-pax-total="data.quote.perPaxTotal"
          :grand-total="data.quote.grandTotal"
          :valid-until="data.quote.validUntil"
          :created-at="data.quote.createdAt"
          :items="data.items"
        />
      </div>
    </div>
  </SectionContainer>
</template>

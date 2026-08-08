<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const token = route.params.token as string

const { data, error } = await useFetch(`/api/quotes/${token}`)

useSeoMeta({
  title: data.value ? `Penawaran Umrah — ${data.value.name}` : 'Penawaran Umrah',
  robots: 'noindex, nofollow',
})

const { cta } = useWhatsapp()
function printPage() {
  window.print()
}

const waCta = computed(() => cta(
  'quote_view',
  data.value
    ? `Assalamualaikum, saya ${data.value.name}. Saya sudah melihat penawaran ${data.value.quoteNumber} dan ingin bertanya lebih lanjut.`
    : undefined,
))
</script>

<template>
  <div class="min-h-screen bg-background px-5 py-10 md:px-8 md:py-16">
    <div class="mx-auto max-w-2xl">
      <div v-if="error" class="rounded-3xl border border-primary-100 bg-white p-10 text-center">
        <Icon name="lucide:file-x" class="mx-auto size-10 text-ink/30" />
        <h1 class="mt-4 font-display text-xl font-bold text-primary">Penawaran tidak ditemukan</h1>
        <p class="mt-2 text-sm text-ink/60">
          Tautannya mungkin sudah tidak berlaku. Silakan hubungi kami untuk penawaran terbaru.
        </p>
        <AppButton v-bind="cta('quote_expired')" variant="primary" class="mt-6">
          Hubungi via WhatsApp
          <Icon name="lucide:message-circle" class="size-4" />
        </AppButton>
      </div>

      <template v-else-if="data">
        <QuoteDocument
          :quote-number="data.quoteNumber"
          :name="data.name"
          :pax="data.pax"
          :departure-target="data.departureTarget"
          :per-pax-total="data.perPaxTotal"
          :grand-total="data.grandTotal"
          :valid-until="data.validUntil"
          :created-at="data.createdAt"
          :items="data.items"
        />

        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center print:hidden">
          <AppButton v-bind="waCta" variant="primary" size="lg">
            Tanya via WhatsApp
            <Icon name="lucide:message-circle" class="size-4" />
          </AppButton>
          <AppButton variant="ghost" size="lg" @click="printPage">
            Simpan sebagai PDF
            <Icon name="lucide:download" class="size-4" />
          </AppButton>
        </div>

        <p class="mt-8 text-center text-xs text-ink/40 print:hidden">
          Penawaran ini bersifat pribadi. Mohon tidak dibagikan ke pihak lain.
        </p>
      </template>
    </div>
  </div>
</template>

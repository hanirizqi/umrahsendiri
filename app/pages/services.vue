<script setup lang="ts">
import { SERVICES } from '~/constants/services'
import { HOME_FAQS } from '~/constants/faqs'

useSeoMeta({
  title: 'Layanan UmrahSendiri — Hotel, Visa, Transportasi, hingga Pembimbing',
  description: 'Layanan umrah mandiri satu pintu: hotel, visa, transportasi, pembimbing, estimasi biaya, dan konsultasi umrah langsung.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Layanan"
      title="Pilih Layanan Sesuai Kebutuhan Anda"
      description="Enam layanan yang bisa Anda pilih sesuai kebutuhan — satu per satu atau sekaligus, tanpa paket rombongan."
    />

    <SectionContainer>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ServiceCard v-for="service in SERVICES" :key="service.title" :service="service" />
      </div>
    </SectionContainer>

    <SectionContainer tone="muted">
      <SectionHeading
        eyebrow="Bagaimana Prosesnya"
        title="Prosesnya Sederhana dan Transparan"
        description="Dari konsultasi hingga layanan diberikan, Anda tahu persis di tahap mana prosesnya berada."
      />
      <div class="mx-auto mt-16 max-w-3xl space-y-6">
        <div class="flex gap-5 rounded-2xl border border-primary-100 bg-white/60 p-6">
          <Icon name="lucide:message-circle" class="size-6 shrink-0 text-secondary-700" />
          <div>
            <h3 class="font-display text-base font-semibold text-primary">1. Konsultasi Kebutuhan</h3>
            <p class="mt-1 text-sm text-ink/70">Kami memahami dulu preferensi, budget, dan tanggal keberangkatan Anda sebelum menyarankan apa pun.</p>
          </div>
        </div>
        <div class="flex gap-5 rounded-2xl border border-primary-100 bg-white/60 p-6">
          <Icon name="lucide:file-text" class="size-6 shrink-0 text-secondary-700" />
          <div>
            <h3 class="font-display text-base font-semibold text-primary">2. Pilih Layanan</h3>
            <p class="mt-1 text-sm text-ink/70">Layanan yang Anda butuhkan — hotel, visa, transportasi, atau pembimbing — dipilih dan didiskusikan bersama Anda.</p>
          </div>
        </div>
        <div class="flex gap-5 rounded-2xl border border-primary-100 bg-white/60 p-6">
          <Icon name="lucide:list-checks" class="size-6 shrink-0 text-secondary-700" />
          <div>
            <h3 class="font-display text-base font-semibold text-primary">3. Konfirmasi & Pemesanan</h3>
            <p class="mt-1 text-sm text-ink/70">Layanan yang dipilih diproses dan dikonfirmasi, termasuk dokumen seperti visa dan asuransi yang menjadi bagian dari layanan Anda.</p>
          </div>
        </div>
      </div>
    </SectionContainer>

    <FaqSection :faqs="HOME_FAQS" title="Pertanyaan Seputar Layanan" />
    <CtaSection />
  </div>
</template>

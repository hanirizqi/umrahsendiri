<script setup lang="ts">
import { SERVICES } from '~/constants/services'
import { HOME_FAQS } from '~/constants/faqs'

useSeoMeta({
  title: 'Pendampingan UmrahSendiri — Itinerary, Biaya, Hotel, hingga Checklist',
  description: 'Pendampingan perencanaan umrah mandiri: itinerary umrah, estimasi biaya, rekomendasi hotel umrah, visa, transportasi, checklist, dan konsultasi umrah langsung.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Pendampingan"
      title="Semua Bagian Perencanaan, Kami Bantu Susun Bersama Anda"
      description="Enam bentuk pendampingan yang bisa Anda gunakan sesuai kebutuhan — sendiri-sendiri atau sekaligus dalam satu rangkaian perencanaan."
    />

    <SectionContainer>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ServiceCard v-for="service in SERVICES" :key="service.title" :service="service" />
      </div>
    </SectionContainer>

    <SectionContainer tone="muted">
      <SectionHeading
        eyebrow="Bagaimana Prosesnya"
        title="Layanan Ini Berjalan Berdampingan dengan Anda"
        description="Bukan layanan sekali jalan — kami tetap dapat dihubungi sepanjang proses perencanaan hingga hari keberangkatan."
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
            <h3 class="font-display text-base font-semibold text-primary">2. Penyusunan Rencana</h3>
            <p class="mt-1 text-sm text-ink/70">Itinerary, estimasi biaya, dan opsi hotel/transportasi disusun dan didiskusikan bersama Anda.</p>
          </div>
        </div>
        <div class="flex gap-5 rounded-2xl border border-primary-100 bg-white/60 p-6">
          <Icon name="lucide:list-checks" class="size-6 shrink-0 text-secondary-700" />
          <div>
            <h3 class="font-display text-base font-semibold text-primary">3. Pendampingan Persiapan</h3>
            <p class="mt-1 text-sm text-ink/70">Checklist dokumen dan kesehatan kami pantau bersama hingga mendekati tanggal keberangkatan.</p>
          </div>
        </div>
      </div>
    </SectionContainer>

    <FaqSection :faqs="HOME_FAQS" title="Pertanyaan Seputar Layanan" />
    <CtaSection />
  </div>
</template>

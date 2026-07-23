<script setup lang="ts">
import { STEPS } from '~/constants/steps'
import { LANDING_FAQS } from '~/constants/faqs'

useSeoMeta({
  title: 'Cara Umrah Mandiri — Empat Langkah Bersama UmrahSendiri',
  description: 'Cara umrah mandiri yang jelas dan transparan: konsultasi umrah awal, susun itinerary dan estimasi biaya, persiapan dokumen, hingga berangkat.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Cara Kerja"
      title="Prosesnya Sederhana, Transparan, dan Anda Selalu Tahu Tahapnya"
      description="Empat langkah yang sama kami gunakan untuk setiap jamaah, disesuaikan dengan kebutuhan masing-masing."
    />

    <SectionContainer>
      <div class="mx-auto max-w-4xl space-y-8">
        <div
          v-for="(step, index) in STEPS"
          :key="step.number"
          class="flex flex-col gap-6 rounded-3xl border border-primary-100 bg-white/60 p-8 shadow-soft md:flex-row md:items-start"
        >
          <div class="flex items-center gap-4 md:w-40 md:flex-col md:items-start">
            <span class="font-display text-4xl font-bold text-secondary-400">{{ step.number }}</span>
            <div v-if="index < STEPS.length - 1" class="hidden h-px flex-1 bg-primary-100 md:block" />
          </div>
          <div>
            <h3 class="font-display text-xl font-semibold text-primary">{{ step.title }}</h3>
            <p class="mt-2 text-base leading-relaxed text-ink/70">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </SectionContainer>

    <FaqSection :faqs="LANDING_FAQS" title="Pertanyaan Seputar Prosesnya" />
    <CtaSection />
  </div>
</template>

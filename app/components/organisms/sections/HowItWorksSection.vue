<script setup lang="ts">
import { STEPS } from '~/constants/steps'
</script>

<template>
  <SectionContainer>
    <SectionHeading
      eyebrow="Cara Kerja"
      title="Empat Langkah Menuju Umrah yang Terencana"
      description="Prosesnya sederhana dan transparan, dari konsultasi pertama hingga Anda siap berangkat."
    />

    <div class="relative mt-16">
      <div class="absolute inset-x-0 top-6 hidden h-px bg-primary-100 md:block" />
      <div class="grid gap-10 md:grid-cols-4">
        <div v-for="step in STEPS" :key="step.number" class="flex flex-col items-start text-left md:items-center md:text-center">
          <div class="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-base font-bold text-background shadow-soft">
            {{ step.number }}
          </div>
          <h3 class="mt-5 font-display text-lg font-semibold text-primary">{{ step.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink/70 md:max-w-[220px]">{{ step.description }}</p>
        </div>
      </div>
    </div>

    <div class="mt-12 text-center">
      <AppButton to="/kontak" variant="ghost">
        Mulai Konsultasi Gratis
        <Icon name="lucide:arrow-right" class="size-4" />
      </AppButton>
    </div>
  </SectionContainer>
</template>

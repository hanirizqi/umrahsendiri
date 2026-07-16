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

    <div class="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StepCard v-for="step in STEPS" :key="step.number" :step="step" />
    </div>
  </SectionContainer>
</template>

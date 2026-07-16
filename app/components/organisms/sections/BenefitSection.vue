<script setup lang="ts">
import { BENEFITS } from '~/constants/benefits'
</script>

<template>
  <SectionContainer tone="muted">
    <SectionHeading
      eyebrow="Kenapa UmrahSendiri"
      title="Dibuat untuk Jamaah yang Ingin Tetap Memegang Kendali"
    />

    <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <BenefitCard v-for="benefit in BENEFITS" :key="benefit.title" :benefit="benefit" />
    </div>
  </SectionContainer>
</template>

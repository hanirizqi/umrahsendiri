<script setup lang="ts">
import { SERVICES } from '~/constants/services'
</script>

<template>
  <SectionContainer tone="muted">
    <SectionHeading
      eyebrow="Pendampingan"
      title="Semua yang Anda Butuhkan untuk Merencanakan Umrah Sendiri"
    />

    <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ServiceCard v-for="service in SERVICES" :key="service.title" :service="service" />
    </div>
  </SectionContainer>
</template>

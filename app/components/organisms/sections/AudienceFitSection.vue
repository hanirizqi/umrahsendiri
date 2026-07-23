<script setup lang="ts">
import { AUDIENCE_FIT } from '~/constants/audience'
</script>

<template>
  <SectionContainer tone="muted">
    <SectionHeading
      eyebrow="Untuk Siapa"
      title="Siapa yang Cocok Umrah Mandiri?"
      description="Umrah mandiri paling pas untuk jamaah dengan preferensi dan gaya perjalanan seperti ini."
    />

    <div class="mt-16 grid gap-4 sm:grid-cols-2">
      <div v-for="item in AUDIENCE_FIT" :key="item" class="flex items-start gap-3 rounded-xl border border-primary-100 bg-white/60 px-5 py-4">
        <Icon name="lucide:check-circle-2" class="mt-0.5 size-5 shrink-0 text-secondary-700" />
        <span class="text-sm leading-relaxed text-ink/80">{{ item }}</span>
      </div>
    </div>
  </SectionContainer>
</template>

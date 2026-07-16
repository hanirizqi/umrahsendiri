<script setup lang="ts">
import type { Step } from '~/types'

defineProps<{ step: Step }>()
</script>

<template>
  <div class="relative rounded-2xl border border-primary-100 bg-white/60 p-8 shadow-soft">
    <span class="font-display text-4xl font-bold text-secondary-400">
      {{ step.number }}
    </span>
    <h3 class="mt-4 font-display text-lg font-semibold text-primary">
      {{ step.title }}
    </h3>
    <p class="mt-2 text-sm leading-relaxed text-ink/70">
      {{ step.description }}
    </p>
  </div>
</template>

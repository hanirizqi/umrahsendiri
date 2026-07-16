<script setup lang="ts">
import type { Benefit } from '~/types'

defineProps<{ benefit: Benefit }>()
</script>

<template>
  <div class="rounded-2xl bg-white/70 p-8 text-center shadow-soft">
    <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-700">
      <Icon :name="benefit.icon" class="size-6" />
    </div>
    <h3 class="mt-5 font-display text-lg font-semibold text-primary">
      {{ benefit.title }}
    </h3>
    <p class="mt-2 text-sm leading-relaxed text-ink/70">
      {{ benefit.description }}
    </p>
  </div>
</template>

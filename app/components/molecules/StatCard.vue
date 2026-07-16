<script setup lang="ts">
import type { StatItem } from '~/types'

defineProps<{ stat: StatItem }>()
</script>

<template>
  <div class="text-center">
    <p class="font-display text-2xl font-bold text-primary md:text-3xl">
      {{ stat.value }}
    </p>
    <p class="mt-1 text-xs text-ink/60 md:text-sm">
      {{ stat.label }}
    </p>
  </div>
</template>

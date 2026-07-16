<script setup lang="ts">
import type { Service } from '~/types'

defineProps<{ service: Service }>()
</script>

<template>
  <div class="group rounded-2xl border border-primary-100 bg-white/60 p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
    <div class="flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary group-hover:text-background">
      <Icon :name="service.icon" class="size-6" />
    </div>
    <h3 class="mt-5 font-display text-lg font-semibold text-primary">
      {{ service.title }}
    </h3>
    <p class="mt-2 text-sm leading-relaxed text-ink/70">
      {{ service.description }}
    </p>
  </div>
</template>

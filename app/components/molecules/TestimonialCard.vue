<script setup lang="ts">
import type { Testimonial } from '~/types'

defineProps<{ testimonial: Testimonial }>()
</script>

<template>
  <figure class="flex h-full flex-col rounded-2xl border border-primary-100 bg-white/60 p-8 shadow-soft">
    <Icon name="lucide:quote" class="size-6 text-secondary-400" />
    <blockquote class="mt-4 flex-1 text-sm leading-relaxed text-ink/80 italic">
      "{{ testimonial.quote }}"
    </blockquote>
    <figcaption class="mt-6 border-t border-primary-100 pt-4">
      <p class="font-display text-sm font-semibold text-primary">{{ testimonial.name }}</p>
      <p class="text-xs text-ink/60">{{ testimonial.role }} · {{ testimonial.location }}</p>
    </figcaption>
  </figure>
</template>

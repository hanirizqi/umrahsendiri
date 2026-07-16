<script setup lang="ts">
import type { FaqItem } from '~/types'

defineProps<{ faq: FaqItem }>()
const open = ref(false)
</script>

<template>
  <div class="rounded-2xl border border-primary-100 bg-white/50">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="font-display text-base font-semibold text-primary">{{ faq.question }}</span>
      <Icon
        name="lucide:chevron-down"
        class="size-5 shrink-0 text-secondary-700 transition-transform duration-300"
        :class="{ 'rotate-180': open }"
      />
    </button>
    <div
      class="grid transition-all duration-300 ease-out"
      :class="open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
    >
      <div class="overflow-hidden">
        <p class="px-6 pb-5 text-sm leading-relaxed text-ink/70">
          {{ faq.answer }}
        </p>
      </div>
    </div>
  </div>
</template>

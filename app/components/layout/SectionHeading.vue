<script setup lang="ts">
interface Props {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
}

withDefaults(defineProps<Props>(), { align: 'center', tone: 'light' })
</script>

<template>
  <div class="max-w-2xl" :class="align === 'center' ? 'mx-auto text-center' : 'text-left'">
    <p
      v-if="eyebrow"
      class="mb-3 text-sm font-semibold tracking-widest uppercase"
      :class="tone === 'dark' ? 'text-secondary-400' : 'text-secondary-700'"
    >
      {{ eyebrow }}
    </p>
    <h2
      class="text-3xl font-bold md:text-4xl lg:text-5xl"
      :class="tone === 'dark' ? 'text-background' : 'text-primary'"
    >
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="mt-4 text-base md:text-lg"
      :class="tone === 'dark' ? 'text-background/70' : 'text-ink/70'"
    >
      {{ description }}
    </p>
  </div>
</template>

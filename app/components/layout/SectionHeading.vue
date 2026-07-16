<script setup lang="ts">
interface Props {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

withDefaults(defineProps<Props>(), { align: 'center' })
</script>

<template>
  <div class="max-w-2xl" :class="align === 'center' ? 'mx-auto text-center' : 'text-left'">
    <p v-if="eyebrow" class="mb-3 text-sm font-semibold tracking-widest text-secondary-700 uppercase">
      {{ eyebrow }}
    </p>
    <h2 class="text-3xl font-bold text-primary md:text-4xl lg:text-5xl">
      {{ title }}
    </h2>
    <p v-if="description" class="mt-4 text-base text-ink/70 md:text-lg">
      {{ description }}
    </p>
  </div>
</template>

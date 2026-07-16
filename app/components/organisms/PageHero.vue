<script setup lang="ts">
interface Props {
  eyebrow?: string
  title: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <section class="border-b border-primary-100/60 bg-primary-50/40 py-20 md:py-28">
    <div class="mx-auto max-w-3xl px-6 text-center md:px-10">
      <p v-if="eyebrow" class="mb-3 text-sm font-semibold tracking-widest text-secondary-700 uppercase">
        {{ eyebrow }}
      </p>
      <h1 class="text-4xl font-bold text-primary md:text-5xl">
        {{ title }}
      </h1>
      <p v-if="description" class="mt-5 text-base text-ink/70 md:text-lg">
        {{ description }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  tone?: 'default' | 'dark' | 'muted'
}

const props = withDefaults(defineProps<Props>(), { tone: 'default' })

const toneClass = computed(() => ({
  default: 'bg-background',
  dark: 'bg-dark text-background',
  muted: 'bg-primary-50',
}[props.tone]))
</script>

<template>
  <section class="py-24 md:py-32" :class="toneClass">
    <div class="mx-auto max-w-[1280px] px-6 md:px-10">
      <slot />
    </div>
  </section>
</template>

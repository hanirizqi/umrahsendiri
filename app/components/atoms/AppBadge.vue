<script setup lang="ts">
interface Props {
  icon?: string
}

defineProps<Props>()
</script>

<template>
  <span class="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary-100/60 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary-700 uppercase">
    <Icon v-if="icon" :name="icon" class="size-3.5 text-secondary-700" />
    <slot />
  </span>
</template>

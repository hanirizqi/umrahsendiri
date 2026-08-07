<script setup lang="ts">
interface Props { status: string }
const props = defineProps<Props>()

const STYLES: Record<string, { label: string, class: string }> = {
  baru: { label: 'Baru', class: 'bg-secondary-100/70 text-secondary-700' },
  dihubungi: { label: 'Dihubungi', class: 'bg-primary-50 text-primary-700' },
  ditawarkan: { label: 'Ditawarkan', class: 'bg-primary-100 text-primary-700' },
  menang: { label: 'Menang', class: 'bg-primary text-background' },
  kalah: { label: 'Kalah', class: 'bg-ink/10 text-ink/50' },
}

const style = computed(() => STYLES[props.status] ?? { label: props.status, class: 'bg-ink/10 text-ink/60' })
</script>

<template>
  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium" :class="style.class">
    {{ style.label }}
  </span>
</template>

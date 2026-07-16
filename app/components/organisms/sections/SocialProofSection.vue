<script setup lang="ts">
const POINTS = [
  { icon: 'lucide:star', label: '4.9/5 dari sesi konsultasi' },
  { icon: 'lucide:users', label: '1.200+ jamaah dibantu' },
  { icon: 'lucide:calendar-check', label: '6 tahun mendampingi umrah mandiri' },
  { icon: 'lucide:shield-check', label: 'Konsultan berpengalaman & terverifikasi' },
]
</script>

<template>
  <div class="border-y border-primary-100/60 bg-primary-50/50 py-8">
    <div class="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 md:px-10">
      <div v-for="point in POINTS" :key="point.label" class="flex items-center gap-2 text-sm text-ink/60">
        <Icon :name="point.icon" class="size-4 text-secondary-700" />
        {{ point.label }}
      </div>
    </div>
  </div>
</template>

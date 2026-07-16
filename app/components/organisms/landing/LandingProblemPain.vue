<script setup lang="ts">
const PAINS = [
  {
    icon: 'lucide:circle-help',
    title: 'Biaya Membengkak Tanpa Penjelasan',
    description: 'Rincian yang tidak transparan sejak awal membuat anggaran Anda meleset jauh dari rencana.',
  },
  {
    icon: 'lucide:map-pin-off',
    title: 'Hotel Ternyata Jauh dari Masjid',
    description: 'Tanpa panduan yang tepat, sulit menilai jarak sebenarnya sebelum Anda tiba di sana.',
  },
  {
    icon: 'lucide:file-warning',
    title: 'Dokumen Terlambat Diurus',
    description: 'Visa dan persyaratan lain baru disadari mepet keberangkatan, memicu kepanikan yang tidak perlu.',
  },
]
</script>

<template>
  <section class="bg-primary-50/50 px-6 py-16 md:px-10">
    <div class="mx-auto max-w-2xl">
      <h2 class="text-center text-2xl font-bold text-primary md:text-3xl">
        Ini yang Sering Terjadi Tanpa Panduan yang Tepat
      </h2>

      <div class="mt-10 space-y-4">
        <div v-for="pain in PAINS" :key="pain.title" class="flex gap-4 rounded-2xl border border-primary-100 bg-white/60 p-5">
          <Icon :name="pain.icon" class="size-6 shrink-0 text-primary/60" />
          <div>
            <h3 class="font-display text-sm font-semibold text-primary">{{ pain.title }}</h3>
            <p class="mt-1 text-sm text-ink/70">{{ pain.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

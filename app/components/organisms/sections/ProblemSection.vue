<script setup lang="ts">
const PROBLEMS = [
  {
    icon: 'lucide:circle-help',
    title: 'Sulit Memperkirakan Total Biaya',
    description: 'Tanpa rincian yang jelas sejak awal, total biaya sering baru diketahui mendekati keberangkatan.',
  },
  {
    icon: 'lucide:map-pin-off',
    title: 'Menentukan Hotel yang Tepat',
    description: 'Tanpa panduan, sulit menilai jarak hotel ke Masjidil Haram dan Masjid Nabawi sebelum berangkat.',
  },
  {
    icon: 'lucide:file-warning',
    title: 'Dokumen yang Perlu Dipersiapkan Sejak Awal',
    description: 'Visa, vaksin, dan dokumen pendukung sering membingungkan bagi yang mengurusnya sendiri pertama kali.',
  },
]
</script>

<template>
  <SectionContainer>
    <SectionHeading
      eyebrow="Yang Sering Terjadi"
      title="Umrah Mandiri Sering Terasa Membingungkan Tanpa Panduan yang Tepat"
      description="Bukan karena Anda tidak mampu mengaturnya sendiri — tapi karena informasinya tersebar dan sulit diverifikasi."
    />

    <div class="mt-16 grid gap-6 md:grid-cols-3">
      <div v-for="problem in PROBLEMS" :key="problem.title" class="rounded-2xl border border-primary-100 bg-white/50 p-8">
        <Icon :name="problem.icon" class="size-8 text-primary/60" />
        <h3 class="mt-5 font-display text-lg font-semibold text-primary">{{ problem.title }}</h3>
        <p class="mt-2 text-sm leading-relaxed text-ink/70">{{ problem.description }}</p>
      </div>
    </div>
  </SectionContainer>
</template>

<script setup lang="ts">
const TRUST_REASONS = [
  {
    icon: 'lucide:shield-check',
    title: 'Didukung Mitra Resmi',
    description: 'Hotel, visa, dan dokumen perjalanan ditangani jaringan mitra travel resmi yang berpengalaman.',
  },
  {
    icon: 'lucide:eye',
    title: 'Proses Transparan',
    description: 'Setiap opsi dan estimasi biaya disampaikan apa adanya, sebelum Anda memutuskan.',
  },
  {
    icon: 'lucide:package-check',
    title: 'Layanan Sesuai Pesanan',
    description: 'Setiap layanan yang Anda pesan diproses sesuai rincian yang disepakati sejak awal, tanpa kejutan.',
  },
  {
    icon: 'lucide:clipboard-check',
    title: 'Tanggung Jawab Jelas',
    description: 'Tanggung jawab kami berlaku hingga layanan yang Anda pesan selesai diberikan.',
  },
  {
    icon: 'lucide:badge-check',
    title: 'Berdasarkan Pengalaman Nyata',
    description: 'Rekomendasi disusun dari pengalaman nyata melayani jemaah, bukan asumsi.',
  },
  {
    icon: 'lucide:heart-handshake',
    title: 'Tidak Ada Keputusan yang Dipaksakan',
    description: 'Anda bebas menentukan pilihan, kapan pun Anda siap.',
  },
]
</script>

<template>
  <SectionContainer tone="dark">
    <SectionHeading
      tone="dark"
      eyebrow="Kepercayaan"
      title="Kenapa Anda Bisa Merasa Tenang Bersama UmrahSendiri"
      description="Bukan sekadar janji — ini yang menjaga proses perencanaan Anda tetap jelas dari awal hingga berangkat."
    />

    <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="reason in TRUST_REASONS" :key="reason.title" class="flex gap-4 rounded-2xl border border-background/10 bg-background/5 p-6">
        <Icon :name="reason.icon" class="size-6 shrink-0 text-secondary-400" />
        <div>
          <h3 class="font-display text-sm font-semibold text-background">{{ reason.title }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-background/70">{{ reason.description }}</p>
        </div>
      </div>
    </div>
  </SectionContainer>
</template>

<script setup lang="ts">

const POINTS = [
  { icon: 'lucide:compass', text: 'Kontrol penuh atas setiap keputusan perjalanan Anda' },
  { icon: 'lucide:eye', text: 'Estimasi biaya transparan sejak sesi konsultasi pertama' },
  { icon: 'lucide:users', text: 'Dilayani tim yang memahami logistik umrah mandiri' },
]
</script>

<template>
  <section class="bg-dark px-6 py-16 text-background md:px-10">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-2xl font-bold md:text-3xl">
        Kami Bukan Mengambil Alih. Kami Membantu Anda Menyusunnya.
      </h2>
      <p class="mt-4 text-sm text-background/70 md:text-base">
        UmrahSendiri berperan sebagai partner perencanaan — bukan biro travel, bukan penjual paket.
      </p>

      <div class="mt-8 space-y-3 text-left">
        <div v-for="point in POINTS" :key="point.text" class="flex items-center gap-3 rounded-xl bg-background/5 px-4 py-3">
          <Icon :name="point.icon" class="size-5 shrink-0 text-secondary-400" />
          <span class="text-sm text-background/85">{{ point.text }}</span>
        </div>
      </div>

      <LandingFormCta source="solusi" variant="secondary" class="mt-8" full-width>
        Mulai Konsultasi Gratis
      </LandingFormCta>
    </div>
  </section>
</template>

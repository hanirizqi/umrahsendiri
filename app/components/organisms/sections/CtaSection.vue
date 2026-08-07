<script setup lang="ts">
const MICRO_TRUST = [
  'Konsultasi awal gratis',
  'Tanpa kewajiban menggunakan layanan',
  'Diskusi melalui WhatsApp',
]
</script>

<template>
  <SectionContainer>
    <div class="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center shadow-soft-lg md:px-16 md:py-24">
      <div
        class="pointer-events-none absolute inset-0 opacity-20"
        style="background: radial-gradient(50% 80% at 50% 0%, var(--color-secondary) 0%, transparent 70%)"
      />
      <p class="relative text-sm font-semibold tracking-widest text-secondary-400 uppercase">
        Bebas Berencana, Tenang Beribadah
      </p>
      <h2 class="relative mt-3 text-3xl font-bold text-background md:text-4xl lg:text-5xl">
        Perjalanan Umrah Anda Tidak Harus Mengikuti Cara Orang Lain.
      </h2>
      <p class="relative mx-auto mt-4 max-w-xl text-base text-background/70 md:text-lg">
        Mulailah dengan konsultasi awal tanpa kewajiban. Kami mendengarkan kebutuhan Anda terlebih dahulu, kemudian menyediakan layanan yang paling sesuai.
      </p>
      <div class="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <AppButton to="/contact" variant="secondary" size="lg">
          Mulai Konsultasi Gratis
        </AppButton>
        <AppButton to="/services" variant="ghost" size="lg" class="!border-background/30 !text-background">
          Lihat Layanan
        </AppButton>
      </div>
      <div class="relative mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-background/60">
        <div v-for="point in MICRO_TRUST" :key="point" class="flex items-center gap-1.5">
          <Icon name="lucide:check" class="size-3.5 text-secondary-400" />
          {{ point }}
        </div>
      </div>
    </div>
  </SectionContainer>
</template>

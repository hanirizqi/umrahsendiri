<script setup lang="ts">
const { link } = useWhatsapp()
</script>

<template>
  <SectionContainer>
    <div class="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center shadow-soft-lg md:px-16 md:py-24">
      <div
        class="pointer-events-none absolute inset-0 opacity-20"
        style="background: radial-gradient(50% 80% at 50% 0%, var(--color-secondary) 0%, transparent 70%)"
      />
      <h2 class="relative text-3xl font-bold text-background md:text-4xl lg:text-5xl">
        Siap Menyusun Rencana Umrah Anda Sendiri?
      </h2>
      <p class="relative mx-auto mt-4 max-w-xl text-base text-background/70 md:text-lg">
        Mulai dengan konsultasi awal tanpa kewajiban apa pun. Kami dengarkan dulu, baru menyarankan.
      </p>
      <div class="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <AppButton :href="link()" variant="secondary" size="lg">
          Konsultasi Gratis via WhatsApp
        </AppButton>
        <AppButton to="/layanan" variant="ghost" size="lg" class="!border-background/30 !text-background">
          Lihat Layanan
        </AppButton>
      </div>
    </div>
  </SectionContainer>
</template>

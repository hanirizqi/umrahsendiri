<script setup lang="ts">
</script>

<template>
  <SectionContainer tone="dark">
    <div class="grid items-center gap-16 lg:grid-cols-2">
      <div>
        <p class="mb-3 text-sm font-semibold tracking-widest text-secondary-400 uppercase">
          Solusi Kami
        </p>
        <h2 class="text-3xl font-bold text-background md:text-4xl lg:text-5xl">
          Kami Bukan Mengambil Alih. Kami Membantu Anda Menyusunnya.
        </h2>
        <p class="mt-6 text-base text-background/70 md:text-lg">
          Anda tetap memegang kendali atas setiap keputusan — dari layanan yang dipilih hingga hari keberangkatan. Kami hadir membantu memperjelas setiap pilihannya dengan data, opsi, dan informasi yang jelas.
        </p>
        <AppButton to="/contact" variant="secondary" size="lg" class="mt-8">
          Mulai Konsultasi
        </AppButton>
      </div>

      <div class="grid gap-4">
        <div class="rounded-2xl border border-background/10 bg-background/5 p-6">
          <p class="font-display text-sm font-semibold text-secondary-400">Tanpa Paket Jadi</p>
          <p class="mt-1 text-sm text-background/60">Setiap rencana disusun sesuai kebutuhan spesifik Anda, bukan template umum.</p>
        </div>
        <div class="rounded-2xl border border-background/10 bg-background/5 p-6">
          <p class="font-display text-sm font-semibold text-secondary-400">Tanpa Rombongan</p>
          <p class="mt-1 text-sm text-background/60">Perjalanan tetap personal — untuk Anda sendiri, pasangan, atau keluarga.</p>
        </div>
        <div class="rounded-2xl border border-background/10 bg-background/5 p-6">
          <p class="font-display text-sm font-semibold text-secondary-400">Tanpa Keputusan Sepihak</p>
          <p class="mt-1 text-sm text-background/60">Kami menyampaikan opsi dan konsekuensinya, Anda yang menentukan.</p>
        </div>
      </div>
    </div>
  </SectionContainer>
</template>

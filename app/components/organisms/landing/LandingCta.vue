<script setup lang="ts">
const { link } = useWhatsapp()
</script>

<template>
  <section class="bg-background px-6 py-16 text-center md:px-10">
    <div class="mx-auto max-w-xl">
      <h2 class="text-2xl font-bold text-primary md:text-3xl">
        Siap Menyusun Rencana Umrah Anda Sendiri?
      </h2>
      <p class="mt-3 text-sm text-ink/70 md:text-base">
        Mulai dengan konsultasi awal tanpa kewajiban apa pun.
      </p>
      <AppButton :href="link()" variant="primary" size="lg" class="mt-6 w-full sm:w-auto">
        Konsultasi Gratis via WhatsApp
        <Icon name="lucide:arrow-right" class="size-4" />
      </AppButton>
    </div>
  </section>
</template>

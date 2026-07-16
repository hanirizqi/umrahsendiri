<script setup lang="ts">
import { SITE } from '~/constants/site'

const email = ref('')

const mailHref = computed(() => {
  const subject = encodeURIComponent('Berlangganan Artikel UmrahSendiri')
  const body = encodeURIComponent(`Halo, tolong daftarkan email saya (${email.value || '-'}) untuk menerima artikel terbaru UmrahSendiri.`)
  return `mailto:${SITE.email}?subject=${subject}&body=${body}`
})
</script>

<template>
  <div class="rounded-3xl bg-primary p-8 text-center text-background md:p-10">
    <h3 class="font-display text-xl font-bold">Dapatkan Artikel Terbaru</h3>
    <p class="mx-auto mt-2 max-w-sm text-sm text-background/70">
      Panduan perencanaan umrah mandiri, dikirim sesekali ke email Anda — tanpa spam.
    </p>
    <form class="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row" @submit.prevent>
      <input
        v-model="email"
        type="email"
        placeholder="Email Anda"
        class="flex-1 rounded-full border border-background/20 bg-background/10 px-4 py-3 text-sm text-background placeholder:text-background/50 outline-none focus:border-secondary-400"
      >
      <AppButton :href="mailHref" variant="secondary">
        Berlangganan
      </AppButton>
    </form>
  </div>
</template>

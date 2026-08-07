<script setup lang="ts">
// Tanpa ini halaman menjawab 200 meski isinya "tidak ditemukan" — mesin pencari
// akan menganggapnya halaman sungguhan dan bisa mengindeksnya.
const event = useRequestEvent()
if (event) setResponseStatus(event, 404)

useSeoMeta({
  title: 'Halaman Tidak Ditemukan — UmrahSendiri',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
    <p class="font-display text-7xl font-bold text-primary/20">404</p>
    <h1 class="mt-4 text-2xl font-bold text-primary md:text-3xl">
      Halaman yang Anda Cari Tidak Ditemukan
    </h1>
    <p class="mt-3 max-w-md text-sm text-ink/60">
      Mungkin tautannya sudah berubah atau halaman ini belum tersedia. Mari kembali ke beranda.
    </p>
    <AppButton to="/" variant="primary" class="mt-8">
      Kembali ke Beranda
    </AppButton>
  </div>
</template>

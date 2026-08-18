<template>
  <!-- Ikonnya gelembung pesan, tapi tujuannya halaman kontak — labelnya
       menyebut itu supaya tidak terbaca sebagai tombol WhatsApp. -->
  <NuxtLink
    to="/contact"
    aria-label="Isi form konsultasi"
    title="Isi form konsultasi"
    class="fixed right-5 bottom-5 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-background shadow-soft-lg transition-transform duration-300 hover:scale-105 md:right-8 md:bottom-8"
  >
    <Icon name="lucide:message-circle" class="size-6" />
  </NuxtLink>
</template>

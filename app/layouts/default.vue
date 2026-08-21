<script setup lang="ts">
/**
 * Seluruh halaman publik dilacak GA4 lagi sejak 21 Agustus 2026, atas
 * permintaan tim ads. Tag Google Ads tetap tidak dipasang di sini — itu hanya
 * ada di halaman iklan. Rinciannya di `useGoogleTag()`.
 */
useGoogleTag('main')
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <TheHeader />
    <main class="flex-1">
      <slot />
    </main>
    <TheFooter />
    <WhatsAppFloatingButton />
  </div>
</template>

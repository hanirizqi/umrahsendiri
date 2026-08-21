<script setup lang="ts">
/**
 * Layout untuk halaman iklan yang benar-benar berdiri sendiri.
 *
 * Berbeda dari layout `landing`: di sini **tidak ada satu pun tautan keluar**,
 * termasuk logonya. Layout `landing` masih menautkan logo ke beranda, dan
 * tombol melayangnya dulu membawa pengunjung ke halaman lain — artinya
 * peninjau iklan maupun pengunjung bisa berpindah ke halaman yang isinya di
 * luar kendali halaman ini. Halaman iklan yang diminta tim ads harus satu
 * halaman utuh: apa yang terlihat, itulah seluruhnya.
 *
 * Tidak ada tombol melayang dan tidak ada sticky CTA karena form-nya sudah
 * berada di halaman yang sama, hanya sejauh satu kali gulir.
 *
 * Layout ini juga satu-satunya yang memasang **tag Google Ads**. GA4 sempat
 * ikut dicabut dari web utama pada 20 Agustus 2026 lalu dikembalikan sehari
 * kemudian atas permintaan tim ads; yang tetap di sini saja adalah Ads.
 * Karena layout inilah yang mendefinisikan "halaman iklan", pemasangannya
 * ditaruh di sini, bukan di satu halaman. Pembagiannya di `useGoogleTag()`.
 */
useGoogleTag('landing')
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="border-b border-primary-100/60 bg-background/80 px-6 py-4 backdrop-blur-lg md:px-10">
      <!-- Logo sengaja bukan tautan: halaman ini tidak punya jalan keluar. -->
      <div class="flex items-center gap-2.5">
        <NuxtImg src="/brand/icon-512.png" alt="" class="size-8 shrink-0" width="32" height="32" />
        <span class="font-display text-lg font-bold text-primary">UmrahSendiri</span>
      </div>
    </div>

    <main>
      <slot />
    </main>

    <footer class="border-t border-primary-100/60 px-6 py-6 text-center md:px-10">
      <p class="text-xs text-ink/45">
        UmrahSendiri — layanan umrah mandiri untuk jemaah Indonesia.
      </p>
    </footer>
  </div>
</template>

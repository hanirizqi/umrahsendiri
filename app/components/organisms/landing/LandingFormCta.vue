<script setup lang="ts">
/**
 * Tombol ajakan di halaman iklan. Menggulir ke form, bukan membuka WhatsApp.
 *
 * Halaman iklan sengaja tidak punya jalan pintas ke WhatsApp. Percakapan yang
 * dimulai tanpa form berarti CS menerima "Assalamualaikum" tanpa nama, jumlah
 * jemaah, tanggal, maupun kebutuhan — dan atribusi iklannya hilang, jadi tidak
 * ada cara tahu kampanye mana yang membayarnya. Form mengisi semua itu lebih
 * dulu, lalu WhatsApp terbuka dengan pesan yang sudah terisi.
 *
 * `href` dipakai, bukan `to`, supaya ini tautan jangkar biasa: bisa difokus
 * keyboard, dan menggulir mulus lewat `scroll-behavior` di CSS tanpa JavaScript.
 */
const props = withDefaults(defineProps<{
  /** Menandai tombol mana yang dipakai, terbaca di GA4 sebagai `cta_to_form`. */
  source: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'lg'
  fullWidth?: boolean
}>(), {
  variant: 'primary',
  size: 'lg',
  fullWidth: false,
})
</script>

<template>
  <AppButton
    href="#form"
    :variant="props.variant"
    :size="props.size"
    :class="props.fullWidth ? 'w-full sm:w-auto' : undefined"
    @click="reportFormCtaClick(props.source)"
  >
    <slot>Mulai Konsultasi Gratis</slot>
    <Icon name="lucide:arrow-down" class="size-4" />
  </AppButton>
</template>

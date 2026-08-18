<script setup lang="ts">
/**
 * Halaman iklan tersendiri, satu halaman utuh.
 *
 * Menggantikan `/start`, atas permintaan tim ads, sesudah iklan ditolak dua
 * kali dan banding gagal. `/start` dan `/mulai` kini 301 ke sini. Dua hal yang
 * membedakannya dari halaman iklan sebelumnya:
 *
 * - Layout `lp` tidak punya satu pun tautan ke halaman lain, termasuk logonya.
 *   Seluruh komponen di bawah hanya menautkan ke WhatsApp, jadi sifat itu utuh.
 * - Tidak ada pembahasan dokumen perjalanan dalam bentuk apa pun, termasuk di
 *   metadata dan di daftar layanan pada form.
 *
 * Kalau tetap ditolak, penyebabnya bukan lagi isi halaman. Yang perlu diperiksa
 * berikutnya adalah nama kebijakan di Policy Manager akun Google Ads.
 */
definePageMeta({ layout: 'lp' })

useSeoMeta({
  title: 'Konsultasi Umrah Mandiri — UmrahSendiri',
  description: 'Rencanakan umrah tanpa rombongan: hotel, transportasi, dan pembimbing sesuai kebutuhan Anda. Konsultasi awal gratis, tanpa kewajiban.',
  robots: 'noindex, nofollow',
})

const { cta } = useWhatsapp()

const OFFERS = [
  { icon: 'lucide:bed-double', title: 'Hotel', text: 'Pilihan hotel di Makkah dan Madinah sesuai jarak, budget, dan kenyamanan Anda.' },
  { icon: 'lucide:bus', title: 'Transportasi', text: 'Antar kota dan bandara, menyesuaikan jadwal keberangkatan Anda.' },
  { icon: 'lucide:user-round', title: 'Pembimbing', text: 'Pembimbing umrah berpengalaman, tersedia per hari sesuai kebutuhan.' },
  { icon: 'lucide:calculator', title: 'Estimasi Biaya', text: 'Rincian biaya dihitung sejak konsultasi pertama, tanpa angka tersembunyi.' },
]
</script>

<template>
  <div>
    <LandingHero />

    <!-- Apa saja yang bisa dipesan. Satu-satunya tempat di halaman ini yang
         menyebut layanannya secara konkret, dan itu yang dicari pengunjung
         dari iklan sebelum mau mengisi form. -->
    <section class="px-6 py-16 md:px-10">
      <div class="mx-auto max-w-2xl">
        <h2 class="text-center font-display text-2xl font-bold text-primary md:text-3xl">
          Yang Bisa Anda Pesan
        </h2>
        <p class="mx-auto mt-3 max-w-md text-center text-sm text-ink/60">
          Pilih satu per satu sesuai kebutuhan, bukan dalam bentuk paket.
        </p>

        <div class="mt-8 grid gap-4 sm:grid-cols-2">
          <div
            v-for="offer in OFFERS"
            :key="offer.title"
            class="rounded-2xl border border-primary-100 bg-white/60 p-5"
          >
            <div class="flex size-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <Icon :name="offer.icon" class="size-5" />
            </div>
            <p class="mt-3 font-display text-sm font-semibold text-primary">{{ offer.title }}</p>
            <p class="mt-1 text-sm leading-relaxed text-ink/70">{{ offer.text }}</p>
          </div>
        </div>

        <div class="mt-8 text-center">
          <AppButton v-bind="cta('lp_offers')" variant="ghost" size="md">
            Tanya Dulu via WhatsApp
            <Icon name="lucide:message-circle" class="size-4" />
          </AppButton>
        </div>
      </div>
    </section>

    <LandingProblemPain />
    <LandingSolutionBenefit />
    <LandingProfile />
    <LandingForm />
    <LandingFaq />
    <LandingCta />
  </div>
</template>

<script setup lang="ts">
import { SITE } from '~/constants/site'

useSeoMeta({
  title: 'Terms of Service — UmrahSendiri',
  description: 'Syarat dan ketentuan penggunaan layanan perencanaan umrah mandiri UmrahSendiri.',
  robots: 'noindex, follow',
})
</script>

<template>
  <div>
    <PageHero eyebrow="Legal" title="Terms of Service" description="Terakhir diperbarui: 15 Juli 2026" />

    <SectionContainer>
      <LegalContent>
        <section>
          <h2>1. Sifat Layanan</h2>
          <p>UmrahSendiri adalah layanan perencanaan umrah mandiri (planner), bukan biro perjalanan atau agen travel. Kami membantu menyusun itinerary, estimasi biaya, rekomendasi hotel, transportasi, dan checklist — namun tidak bertindak sebagai penyelenggara perjalanan.</p>
        </section>

        <section>
          <h2>2. Keputusan Tetap di Tangan Jamaah</h2>
          <p>Seluruh rekomendasi yang kami berikan bersifat informatif. Keputusan akhir atas pemesanan hotel, tiket, transportasi, dan pengurusan dokumen sepenuhnya berada di tangan Anda sebagai jamaah.</p>
        </section>

        <section>
          <h2>3. Pembayaran</h2>
          <p>Biaya yang dibayarkan kepada UmrahSendiri merupakan biaya jasa perencanaan, terpisah dari biaya tiket, akomodasi, atau transportasi yang Anda pesan langsung ke pihak penyedia.</p>
        </section>

        <section>
          <h2>4. Pembatalan</h2>
          <p>Konsultasi awal dapat dihentikan kapan saja tanpa kewajiban lanjutan. Untuk paket berbayar yang telah berjalan, kebijakan pembatalan akan disampaikan secara terpisah saat kesepakatan dibuat.</p>
        </section>

        <section>
          <h2>5. Batasan Tanggung Jawab</h2>
          <p>UmrahSendiri tidak bertanggung jawab atas keputusan akhir yang diambil jamaah, termasuk namun tidak terbatas pada pemilihan hotel, maskapai, atau penyedia transportasi pihak ketiga, maupun kondisi di luar kendali kami seperti perubahan kebijakan visa atau force majeure.</p>
        </section>

        <section>
          <h2>6. Kerahasiaan Data</h2>
          <p>Informasi yang Anda bagikan kepada kami akan diperlakukan sesuai dengan <NuxtLink to="/privacy-policy" class="text-secondary-700 underline">Privacy Policy</NuxtLink> kami.</p>
        </section>

        <section>
          <h2>7. Perubahan Ketentuan</h2>
          <p>Ketentuan ini dapat diperbarui dari waktu ke waktu. Jika ada pertanyaan, hubungi kami di {{ SITE.email }}.</p>
        </section>
      </LegalContent>
    </SectionContainer>
  </div>
</template>

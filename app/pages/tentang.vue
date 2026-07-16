<script setup lang="ts">
import { VALUES } from '~/constants/values'

useSeoMeta({
  title: 'Tentang UmrahSendiri — Partner Perencanaan Umrah Mandiri',
  description: 'UmrahSendiri hadir untuk jamaah yang ingin merencanakan umrahnya sendiri: kami bantu susun rencananya, Anda yang memutuskan.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Tentang Kami"
      title="Kami Percaya Perjalanan Ibadah Ini Sebaiknya Tetap Milik Anda"
      description="UmrahSendiri lahir dari pengamatan sederhana: banyak jamaah mandiri ingin mengatur perjalanannya sendiri, tapi kesulitan mendapat panduan yang jujur dan jelas."
    />

    <SectionContainer>
      <div class="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <p class="mb-3 text-sm font-semibold tracking-widest text-secondary-700 uppercase">
            Cerita Kami
          </p>
          <h2 class="text-3xl font-bold text-primary md:text-4xl">
            Dari Pengalaman Mendampingi, Bukan Menjual Paket
          </h2>
          <div class="mt-6 space-y-4 text-base leading-relaxed text-ink/70">
            <p>
              Sejak 2019, kami mendampingi jamaah yang ingin berangkat umrah tanpa terikat rombongan atau paket jadi. Sebagian besar dari mereka sudah terbiasa mengatur perjalanan sendiri — yang mereka butuhkan hanyalah kepastian data dan panduan teknis.
            </p>
            <p>
              Dari situ, UmrahSendiri dibentuk sebagai partner perencanaan: kami menyusun itinerary, estimasi biaya, dan checklist bersama jamaah, sementara keputusan akhir selalu berada di tangan mereka.
            </p>
            <p>
              Kami bukan biro travel dan tidak berniat menjadi salah satu. Fokus kami adalah membantu proses perencanaan menjadi lebih jelas, transparan, dan tidak membingungkan.
            </p>
          </div>
        </div>

        <div class="rounded-3xl bg-primary p-10 text-background shadow-soft-lg">
          <p class="font-display text-lg font-semibold text-secondary-400">Misi Kami</p>
          <p class="mt-4 text-xl leading-relaxed font-semibold">
            Membantu setiap jamaah mandiri merencanakan umrahnya dengan percaya diri, tanpa kehilangan kendali atas keputusannya sendiri.
          </p>
          <div class="mt-8 grid grid-cols-3 gap-4 border-t border-background/10 pt-8">
            <StatCard :stat="{ value: '1.200+', label: 'Jamaah dibantu' }" />
            <StatCard :stat="{ value: '6', label: 'Tahun berjalan' }" />
            <StatCard :stat="{ value: '4.9/5', label: 'Rating konsultasi' }" />
          </div>
        </div>
      </div>
    </SectionContainer>

    <SectionContainer tone="muted">
      <SectionHeading
        eyebrow="Prinsip Kami"
        title="Nilai yang Memandu Setiap Konsultasi"
      />
      <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <BenefitCard v-for="value in VALUES" :key="value.title" :benefit="value" />
      </div>
    </SectionContainer>

    <CtaSection />
  </div>
</template>

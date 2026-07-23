<script setup lang="ts">
import { VALUES } from '~/constants/values'

const MISSION_POINTS = ['Perencanaan personal', 'Informasi transparan', 'Didukung mitra resmi']

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
      description="Kami melihat semakin banyak calon jamaah yang ingin mengatur perjalanan umrahnya sendiri, namun kesulitan menemukan panduan yang jujur, jelas, dan tidak memaksa. Dari kebutuhan itulah UmrahSendiri lahir."
    />

    <SectionContainer tone="dark">
      <div class="mx-auto max-w-2xl text-center">
        <p class="mb-3 text-sm font-semibold tracking-widest text-secondary-400 uppercase">
          Mengapa UmrahSendiri Hadir?
        </p>
        <div class="mt-6 space-y-4 text-base leading-relaxed text-background/80 md:text-lg">
          <p>
            Selama ini, banyak calon jamaah sebenarnya ingin berangkat umrah secara mandiri — tapi bingung harus mulai dari mana.
          </p>
          <p>
            Ada yang ragu memilih tiket yang tepat. Ada yang belum memahami proses visa dan dokumen perjalanan. Ada pula yang hanya butuh teman diskusi sebelum mengambil keputusan.
          </p>
          <p>
            Mereka tidak sedang mencari paket perjalanan. Mereka hanya butuh panduan yang jelas, jujur, dan tidak memaksa.
          </p>
          <p>Dari situlah UmrahSendiri hadir.</p>
          <p class="font-display text-lg font-semibold text-background md:text-xl">
            Perjalanan ibadah tetap menjadi keputusan Anda. Kami hadir agar setiap langkah perencanaannya terasa lebih jelas, lebih tenang, dan lebih terarah.
          </p>
        </div>
      </div>
    </SectionContainer>

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
              UmrahSendiri hadir untuk jamaah yang ingin berangkat umrah tanpa terikat rombongan atau paket jadi. Untuk kebutuhan operasional seperti tiket, hotel, visa, dan dokumen perjalanan, kami bekerja sama dengan jaringan mitra travel resmi yang telah berpengalaman — sementara perencanaan tetap personal dan sepenuhnya mengikuti kebutuhan Anda.
            </p>
            <p>
              Itinerary, estimasi biaya, dan checklist disusun bersama-sama. Namun keputusan akhir selalu ada di tangan Anda, bukan kami.
            </p>
            <p>
              UmrahSendiri bukan biro travel, dan tidak berniat menjadi salah satu. Kami hadir agar proses perencanaan Anda terasa lebih jelas, transparan, dan tidak membingungkan.
            </p>
          </div>
        </div>

        <div class="rounded-3xl bg-primary p-10 text-background shadow-soft-lg">
          <p class="font-display text-lg font-semibold text-secondary-400">Misi Kami</p>
          <p class="mt-4 text-xl leading-relaxed font-semibold">
            Membantu setiap jamaah mandiri merencanakan umrahnya dengan percaya diri, tanpa kehilangan kendali atas keputusannya sendiri.
          </p>
          <div class="mt-8 space-y-3 border-t border-background/10 pt-8">
            <div v-for="point in MISSION_POINTS" :key="point" class="flex items-center gap-2 text-sm text-background/85">
              <Icon name="lucide:check" class="size-4 shrink-0 text-secondary-400" />
              {{ point }}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>

    <WhyUmrahMandiriSection
      eyebrow="Pembeda Kami"
      title="Mengapa Memilih Umrah Mandiri?"
      description="Ini yang membuat UmrahSendiri berbeda dari travel umrah konvensional."
    />

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

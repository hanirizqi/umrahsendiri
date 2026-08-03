<script setup lang="ts">
import { HOME_STATS } from '~/constants/faqs'
</script>

<template>
  <section class="relative overflow-hidden bg-background pt-16 pb-24 md:pt-24 md:pb-32">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] opacity-[0.07]"
      style="background: radial-gradient(60% 60% at 50% 0%, var(--color-secondary) 0%, transparent 70%)"
    />

    <div class="mx-auto grid max-w-[1280px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2">
      <div class="fade-up">
        <AppBadge icon="lucide:compass">Umrah Mandiri Planner</AppBadge>

        <h1 class="mt-6 text-4xl leading-[1.1] font-bold text-primary md:text-5xl lg:text-6xl">
          Umrah Sesuai Jadwal Anda. Bukan Jadwal Rombongan.
        </h1>

        <p class="mt-6 max-w-lg text-base text-ink/70 md:text-lg">
          Bukan paket umrah, bukan rombongan. Anda tetap memegang kendali atas setiap keputusan — kami hadir membantu menyusun itinerary, hotel, estimasi biaya, hingga checklist keberangkatan.
        </p>

        <div class="mt-8 flex flex-col gap-4 sm:flex-row">
          <AppButton to="/kontak" variant="primary" size="lg">
            Konsultasi Gratis
            <Icon name="lucide:arrow-right" class="size-4" />
          </AppButton>
          <AppButton to="/cara-kerja" variant="ghost" size="lg">
            Pelajari Prosesnya
          </AppButton>
        </div>
      </div>

      <div class="relative fade-up">
        <div class="aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary to-primary-700 shadow-soft-lg">
          <svg viewBox="0 0 400 500" class="size-full opacity-90" preserveAspectRatio="xMidYMax slice">
            <path d="M0 500 V320 Q200 120 400 320 V500 Z" fill="none" stroke="#C39A58" stroke-width="1.5" opacity="0.5" />
            <path d="M40 500 V360 Q200 190 360 360 V500 Z" fill="none" stroke="#C39A58" stroke-width="1" opacity="0.3" />
            <circle cx="200" cy="140" r="70" fill="none" stroke="#C39A58" stroke-width="1" opacity="0.25" />
          </svg>
        </div>

        <GlassCard class="absolute -bottom-8 left-1/2 w-[90%] -translate-x-1/2 md:-bottom-10">
          <div class="grid grid-cols-3 gap-4">
            <StatCard v-for="stat in HOME_STATS" :key="stat.label" :stat="stat" />
          </div>
        </GlassCard>
      </div>
    </div>
  </section>
</template>

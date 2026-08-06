<script setup lang="ts">
import { HOME_STATS } from '~/constants/faqs'

const { link } = useWhatsapp()
</script>

<template>
  <section class="bg-background px-6 pt-12 pb-16 md:px-10 md:pt-16">
    <div class="mx-auto max-w-2xl text-center">
      <AppBadge icon="lucide:compass">Umrah Mandiri Planner</AppBadge>

      <h1 class="mt-6 text-3xl leading-[1.15] font-bold text-primary md:text-5xl">
        Rencanakan Umrah Anda Sendiri, Pilih Layanan yang Anda Butuhkan
      </h1>

      <p class="mt-5 text-base text-ink/70 md:text-lg">
        Hotel, visa, transportasi, dan pembimbing — pilih sesuai kebutuhan Anda. Konsultasi awal tanpa kewajiban apa pun.
      </p>

      <AppButton :href="link()" variant="primary" size="lg" class="mt-8 w-full sm:w-auto">
        Konsultasi Gratis via WhatsApp
        <Icon name="lucide:arrow-right" class="size-4" />
      </AppButton>

      <GlassCard class="mx-auto mt-10 max-w-md">
        <div class="grid grid-cols-3 gap-4">
          <StatCard v-for="stat in HOME_STATS" :key="stat.label" :stat="stat" />
        </div>
      </GlassCard>
    </div>
  </section>
</template>

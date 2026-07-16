<script setup lang="ts">
import { PRICING_TIERS } from '~/constants/pricing'
</script>

<template>
  <SectionContainer>
    <SectionHeading
      eyebrow="Paket Perencanaan"
      title="Pilih Tingkat Pendampingan yang Sesuai"
      description="Bukan paket perjalanan — ini adalah tingkat pendampingan perencanaan yang bisa Anda sesuaikan. Diskusikan kebutuhan dan biaya langsung via WhatsApp."
    />

    <div class="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <PricingCard v-for="tier in PRICING_TIERS" :key="tier.name" :tier="tier" />
    </div>
  </SectionContainer>
</template>

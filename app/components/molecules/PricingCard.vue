<script setup lang="ts">
import type { PricingTier } from '~/types'

defineProps<{ tier: PricingTier }>()
const { link } = useWhatsapp()
</script>

<template>
  <div
    class="flex flex-col rounded-3xl p-8 shadow-soft transition-all duration-300 hover:-translate-y-1"
    :class="tier.highlighted
      ? 'bg-primary text-background shadow-soft-lg ring-1 ring-secondary/40'
      : 'border border-primary-100 bg-white/60 text-ink'"
  >
    <h3 class="font-display text-xl font-bold" :class="tier.highlighted ? 'text-background' : 'text-primary'">
      {{ tier.name }}
    </h3>
    <p class="mt-1 text-sm" :class="tier.highlighted ? 'text-background/70' : 'text-ink/60'">
      {{ tier.tagline }}
    </p>

    <ul class="mt-8 flex-1 space-y-3">
      <li v-for="feature in tier.features" :key="feature" class="flex items-start gap-2 text-sm">
        <Icon name="lucide:check" class="mt-0.5 size-4 shrink-0" :class="tier.highlighted ? 'text-secondary-400' : 'text-secondary-700'" />
        <span :class="tier.highlighted ? 'text-background/85' : 'text-ink/75'">{{ feature }}</span>
      </li>
    </ul>

    <AppButton
      :href="link(`Halo, saya tertarik dengan paket ${tier.name}.`)"
      :variant="tier.highlighted ? 'secondary' : 'ghost'"
      class="mt-8 w-full"
    >
      {{ tier.ctaLabel }}
    </AppButton>
  </div>
</template>

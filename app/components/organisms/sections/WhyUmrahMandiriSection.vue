<script setup lang="ts">
import { WHY_UMRAH_MANDIRI } from '~/constants/whyUmrahMandiri'

interface Props {
  eyebrow?: string
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  eyebrow: 'Kenapa Umrah Mandiri',
  title: 'Kebebasan yang Tidak Anda Dapatkan dari Rombongan',
  description: 'Umrah rombongan punya jadwal yang sama untuk semua orang. Umrah mandiri memberi Anda kebebasan menyusun perjalanan sesuai kebutuhan sendiri.',
})
</script>

<template>
  <SectionContainer>
    <SectionHeading :eyebrow="eyebrow" :title="title" :description="description" />

    <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <BenefitCard v-for="reason in WHY_UMRAH_MANDIRI" :key="reason.title" :benefit="reason" />
    </div>

    <div class="mt-12 text-center">
      <AppButton to="/artikel/mengapa-memilih-umrah-mandiri" variant="ghost">
        Baca Selengkapnya
        <Icon name="lucide:arrow-right" class="size-4" />
      </AppButton>
    </div>
  </SectionContainer>
</template>

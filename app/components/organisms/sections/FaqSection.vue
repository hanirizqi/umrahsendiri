<script setup lang="ts">
import type { FaqItem } from '~/types'

interface Props {
  faqs: FaqItem[]
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Pertanyaan yang Sering Diajukan',
})
</script>

<template>
  <SectionContainer>
    <SectionHeading eyebrow="FAQ" :title="title" />

    <div class="mx-auto mt-12 max-w-3xl space-y-4">
      <FaqAccordionItem v-for="faq in faqs" :key="faq.question" :faq="faq" />
    </div>
  </SectionContainer>
</template>

<script setup lang="ts">
import { LANDING_FAQS } from '~/constants/faqs'
</script>

<template>
  <section class="bg-primary-50/50 px-6 py-16 md:px-10">
    <div class="mx-auto max-w-2xl">
      <h2 class="text-center text-2xl font-bold text-primary md:text-3xl">
        Pertanyaan Singkat
      </h2>
      <div class="mt-8 space-y-4">
        <FaqAccordionItem v-for="faq in LANDING_FAQS" :key="faq.question" :faq="faq" />
      </div>
    </div>
  </section>
</template>

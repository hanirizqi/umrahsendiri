<script setup lang="ts">
import { ALL_FAQS } from '~/constants/faqs'

useSeoMeta({
  title: 'FAQ — Pertanyaan Seputar UmrahSendiri',
  description: 'Jawaban atas pertanyaan yang paling sering diajukan seputar pendampingan perencanaan umrah mandiri UmrahSendiri.',
})

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  name: 'FAQ UmrahSendiri',
  mainEntity: ALL_FAQS.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="FAQ"
      title="Pertanyaan yang Sering Diajukan"
      description="Tidak menemukan jawabannya di sini? Hubungi kami langsung via WhatsApp."
    />

    <SectionContainer>
      <div class="mx-auto max-w-3xl space-y-4">
        <FaqAccordionItem v-for="faq in ALL_FAQS" :key="faq.question" :faq="faq" />
      </div>
    </SectionContainer>

    <CtaSection />
  </div>
</template>

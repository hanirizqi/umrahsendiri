<script setup lang="ts">
import { HOME_FAQS } from '~/constants/faqs'

useSeoMeta({
  title: 'UmrahSendiri — Umrah Mandiri Planner',
  ogTitle: 'UmrahSendiri — Umrah Mandiri Planner',
  description: 'Pesan layanan umrah mandiri sesuai kebutuhan Anda — hotel, visa, transportasi, hingga pembimbing — satu pintu, bukan paket rombongan. Konsultasi awal gratis via WhatsApp, keputusan tetap di tangan Anda.',
  ogDescription: 'Pesan layanan umrah mandiri sesuai kebutuhan Anda — hotel, visa, transportasi, hingga pembimbing — satu pintu, bukan paket rombongan. Konsultasi awal gratis via WhatsApp, keputusan tetap di tangan Anda.',
})

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'UmrahSendiri — Umrah Mandiri Planner',
})
</script>

<template>
  <div>
    <HeroSection />
    <WhyUmrahMandiriSection />
    <ProblemSection />
    <SolutionSection />
    <AudienceFitSection />
    <TrustSection />
    <BenefitSection />
    <HowItWorksSection />
    <ServicesSection />
    <FaqSection :faqs="HOME_FAQS" />
    <LatestArticleSection />
    <CtaSection />
  </div>
</template>

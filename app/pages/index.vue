<script setup lang="ts">
import { HOME_FAQS } from '~/constants/faqs'

useSeoMeta({
  title: 'UmrahSendiri — Umrah Mandiri Planner',
  ogTitle: 'UmrahSendiri — Umrah Mandiri Planner',
  description: 'Partner perencanaan umrah mandiri: itinerary, estimasi biaya, hotel, transportasi, dan checklist — disusun bersama Anda, keputusan tetap di tangan Anda.',
  ogDescription: 'Partner perencanaan umrah mandiri: itinerary, estimasi biaya, hotel, transportasi, dan checklist — disusun bersama Anda, keputusan tetap di tangan Anda.',
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
    <SocialProofSection />
    <ProblemSection />
    <SolutionSection />
    <BenefitSection />
    <HowItWorksSection />
    <ServicesSection />
    <PricingSection />
    <TestimonialSection />
    <FaqSection :faqs="HOME_FAQS" />
    <LatestArticleSection />
    <CtaSection />
  </div>
</template>

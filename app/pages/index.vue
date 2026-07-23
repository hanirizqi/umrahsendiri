<script setup lang="ts">
import { HOME_FAQS } from '~/constants/faqs'

useSeoMeta({
  title: 'UmrahSendiri — Umrah Mandiri Planner',
  ogTitle: 'UmrahSendiri — Umrah Mandiri Planner',
  description: 'Partner pendampingan umrah mandiri: itinerary, estimasi biaya, hotel, visa, hingga checklist keberangkatan — disusun bersama Anda lewat konsultasi umrah gratis, keputusan tetap di tangan Anda.',
  ogDescription: 'Partner pendampingan umrah mandiri: itinerary, estimasi biaya, hotel, visa, hingga checklist keberangkatan — disusun bersama Anda lewat konsultasi umrah gratis, keputusan tetap di tangan Anda.',
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
    <PricingSection />
    <TestimonialSection />
    <FaqSection :faqs="HOME_FAQS" />
    <LatestArticleSection />
    <CtaSection />
  </div>
</template>

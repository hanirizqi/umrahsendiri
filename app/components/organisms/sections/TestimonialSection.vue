<script setup lang="ts">
import { TESTIMONIALS } from '~/constants/testimonials'
</script>

<template>
  <SectionContainer tone="muted">
    <SectionHeading
      eyebrow="Kata Mereka"
      title="Jamaah yang Merencanakan Umrahnya Sendiri, Bersama Kami"
    />

    <div class="mt-16 grid gap-6 md:grid-cols-3">
      <TestimonialCard v-for="testimonial in TESTIMONIALS" :key="testimonial.name" :testimonial="testimonial" />
    </div>
  </SectionContainer>
</template>

<script setup lang="ts">
const { link } = useWhatsapp()
</script>

<template>
  <a
    :href="link()"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Konsultasi via WhatsApp"
    class="fixed right-5 bottom-5 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-background shadow-soft-lg transition-transform duration-300 hover:scale-105 md:right-8 md:bottom-8"
  >
    <Icon name="lucide:message-circle" class="size-6" />
  </a>
</template>

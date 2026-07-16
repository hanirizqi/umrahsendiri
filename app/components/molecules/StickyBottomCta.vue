<script setup lang="ts">
const { link } = useWhatsapp()
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 z-40 border-t border-primary-100 bg-background/95 p-4 backdrop-blur-lg md:hidden">
    <AppButton :href="link()" variant="primary" size="lg" class="w-full">
      <Icon name="lucide:message-circle" class="size-4" />
      Konsultasi Gratis via WhatsApp
    </AppButton>
  </div>
</template>

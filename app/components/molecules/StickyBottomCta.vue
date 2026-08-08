<script setup lang="ts">
const { cta } = useWhatsapp()
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 z-40 border-t border-primary-100 bg-background/95 p-4 backdrop-blur-lg md:hidden">
    <AppButton v-bind="cta('sticky_bottom')" variant="primary" size="lg" class="w-full">
      <Icon name="lucide:message-circle" class="size-4" />
      Konsultasi Gratis via WhatsApp
    </AppButton>
  </div>
</template>

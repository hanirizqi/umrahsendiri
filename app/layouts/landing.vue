<template>
  <div class="min-h-screen pb-24 md:pb-0">
    <div class="border-b border-primary-100/60 bg-background/80 px-6 py-4 backdrop-blur-lg md:px-10">
      <AppLogo />
    </div>
    <main>
      <slot />
    </main>
    <WhatsAppFloatingButton />
    <StickyBottomCta />
  </div>
</template>

<script setup lang="ts">
import { MAIN_NAV } from '~/constants/nav'

const mobileOpen = ref(false)
const route = useRoute()

watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-primary-100/60 bg-background/80 backdrop-blur-lg">
    <div class="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-10">
      <AppLogo />

      <nav class="hidden items-center gap-8 lg:flex">
        <NuxtLink
          v-for="item in MAIN_NAV"
          :key="item.to"
          :to="item.to"
          class="text-sm font-medium text-ink/70 transition-colors hover:text-primary"
          active-class="text-primary font-semibold"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hidden lg:block">
        <AppButton to="/contact" variant="primary">
          Konsultasi Gratis
        </AppButton>
      </div>

      <button
        type="button"
        class="flex size-10 items-center justify-center rounded-full border border-primary-100 transition-colors duration-200 hover:border-primary/30 hover:bg-primary-50 lg:hidden"
        aria-label="Buka menu navigasi"
        :aria-expanded="mobileOpen"
        @click="mobileOpen = !mobileOpen"
      >
        <Icon :name="mobileOpen ? 'lucide:x' : 'lucide:menu'" class="size-5 text-primary" />
      </button>
    </div>

    <div v-if="mobileOpen" class="border-t border-primary-100/60 bg-background px-6 py-6 lg:hidden">
      <nav class="flex flex-col gap-4">
        <NuxtLink
          v-for="item in MAIN_NAV"
          :key="item.to"
          :to="item.to"
          class="text-base font-medium text-ink/80 transition-colors duration-200 hover:text-primary"
        >
          {{ item.label }}
        </NuxtLink>
        <AppButton to="/contact" variant="primary" class="mt-2 w-full">
          Konsultasi Gratis
        </AppButton>
      </nav>
    </div>
  </header>
</template>

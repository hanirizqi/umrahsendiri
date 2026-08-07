<script setup lang="ts">
const INTERNAL_NAV = [
  { label: 'Lead', to: '/internal/leads', icon: 'lucide:inbox' },
  { label: 'Kalkulator Harga', to: '/internal/kalkulator-harga', icon: 'lucide:calculator' },
]

const route = useRoute()
const keluarLoading = ref(false)

async function keluar() {
  keluarLoading.value = true
  try {
    await $fetch('/api/internal/logout', { method: 'POST' })
    await navigateTo('/internal/masuk')
  }
  finally {
    keluarLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background">
    <header class="sticky top-0 z-40 border-b border-primary-100/70 bg-background/85 backdrop-blur-lg">
      <div class="mx-auto flex max-w-[1280px] items-center gap-6 px-6 py-3.5 md:px-10">
        <div class="flex items-center gap-3">
          <AppLogo />
          <span class="hidden rounded-full border border-secondary-600/30 bg-secondary-100/40 px-2.5 py-0.5 font-display text-[0.65rem] font-semibold tracking-widest text-secondary-700 uppercase sm:inline">
            Internal
          </span>
        </div>

        <nav class="ml-2 hidden items-center gap-1 sm:flex">
          <NuxtLink
            v-for="item in INTERNAL_NAV"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors"
            :class="route.path === item.to
              ? 'bg-primary text-background'
              : 'text-ink/70 hover:bg-primary-50 hover:text-primary'"
          >
            <Icon :name="item.icon" class="size-4" />
            {{ item.label }}
          </NuxtLink>
        </nav>

        <button
          type="button"
          class="ml-auto flex items-center gap-2 rounded-full border border-primary-100 px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-primary/30 hover:text-primary focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:opacity-50"
          :disabled="keluarLoading"
          @click="keluar"
        >
          <Icon :name="keluarLoading ? 'lucide:loader-circle' : 'lucide:log-out'" class="size-4" :class="{ 'animate-spin': keluarLoading }" />
          <span class="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-primary-100/70 px-6 py-5 md:px-10">
      <p class="mx-auto max-w-[1280px] text-xs text-ink/40">
        Halaman internal UmrahSendiri — tidak untuk dibagikan ke luar tim.
      </p>
    </footer>
  </div>
</template>

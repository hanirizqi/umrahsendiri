<script setup lang="ts">
import { MAIN_NAV, LEGAL_NAV } from '~/constants/nav'
import { SITE } from '~/constants/site'
</script>

<template>
  <footer class="border-t border-background/10 bg-dark text-background">
    <div class="mx-auto max-w-[1280px] px-6 py-16 md:px-10">
      <div class="grid gap-12 md:grid-cols-4">
        <div class="md:col-span-2">
          <AppLogo dark />
          <p class="mt-4 max-w-sm text-sm text-background/60">
            Layanan umrah mandiri satu pintu — hotel, transportasi, pembimbing, dan pendampingan dokumen sesuai kebutuhan Anda, tanpa mengambil alih keputusan Anda.
          </p>
          <p class="mt-3 text-sm font-semibold text-secondary-400 italic">
            Bebas Berencana, Tenang Beribadah.
          </p>
          <a :href="`mailto:${SITE.email}`" class="mt-4 inline-block text-sm text-background/70 hover:text-secondary-400">
            {{ SITE.email }}
          </a>
        </div>

        <div>
          <p class="font-display text-sm font-semibold text-background/90">Navigasi</p>
          <ul class="mt-4 space-y-3">
            <li v-for="item in MAIN_NAV" :key="item.to">
              <NuxtLink :to="item.to" class="text-sm text-background/60 hover:text-secondary-400">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="font-display text-sm font-semibold text-background/90">Legal</p>
          <ul class="mt-4 space-y-3">
            <li v-for="item in LEGAL_NAV" :key="item.to">
              <NuxtLink :to="item.to" class="text-sm text-background/60 hover:text-secondary-400">
                {{ item.label }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="text-sm text-background/60 hover:text-secondary-400">
                Kontak
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-16 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 text-xs text-background/50 md:flex-row">
        <p>&copy; {{ new Date().getFullYear() }} {{ SITE.name }}. Seluruh hak cipta dilindungi.</p>
        <a :href="SITE.instagram" target="_blank" rel="noopener noreferrer" class="hover:text-secondary-400">
          Instagram
        </a>
      </div>
    </div>
  </footer>
</template>

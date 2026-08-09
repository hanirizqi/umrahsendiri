<script setup lang="ts">
const ADMIN_NAV = [
  { label: 'Leads', to: '/admin/leads', icon: 'lucide:inbox' },
  { label: 'Contacts', to: '/admin/contacts', icon: 'lucide:users' },
  { label: 'Price Calculator', to: '/admin/price-calculator', icon: 'lucide:calculator' },
]

const route = useRoute()

/** Sidebar width is remembered between visits so it need not be set again on each login. */
const collapsed = useState('adminSidebarCollapsed', () => false)
const mobileOpen = ref(false)
const logOutLoading = ref(false)

onMounted(() => {
  collapsed.value = localStorage.getItem('us_admin_sidebar') === 'collapsed'
})

watch(collapsed, (value) => {
  localStorage.setItem('us_admin_sidebar', value ? 'collapsed' : 'expanded')
})

watch(() => route.path, () => {
  mobileOpen.value = false
})

async function logOut() {
  logOutLoading.value = true
  try {
    await $fetch('/api/admin/logout', { method: 'POST' })
    await navigateTo('/admin/login')
  }
  finally {
    logOutLoading.value = false
  }
}

const isActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`)
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Dim backdrop while the sidebar is open on small screens -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-40 bg-dark/40 backdrop-blur-sm lg:hidden"
      @click="mobileOpen = false"
    />

    <aside
      class="fixed inset-y-0 left-0 z-50 flex flex-col border-r border-primary-100/70 bg-white/80 backdrop-blur-lg transition-[width,transform] duration-300 lg:translate-x-0"
      :class="[
        collapsed ? 'w-[72px]' : 'w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex h-16 items-center gap-2 border-b border-primary-100/70 px-4">
        <NuxtLink to="/admin/leads" class="flex min-w-0 items-center gap-2.5 transition-opacity duration-200 hover:opacity-75" :aria-label="'Admin panel'">
          <NuxtImg src="/brand/icon-512.png" alt="" class="size-8 shrink-0" width="32" height="32" />
          <span v-if="!collapsed" class="truncate font-display text-base font-bold text-primary">Admin</span>
        </NuxtLink>

        <button
          type="button"
          class="ml-auto flex size-8 shrink-0 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-primary-50 hover:text-primary focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:outline-none lg:hidden"
          aria-label="Close menu"
          @click="mobileOpen = false"
        >
          <Icon name="lucide:x" class="size-5" />
        </button>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto p-3">
        <NuxtLink
          v-for="item in ADMIN_NAV"
          :key="item.to"
          :to="item.to"
          :title="collapsed ? item.label : undefined"
          class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:outline-none"
          :class="[
            isActive(item.to)
              ? 'bg-primary text-background'
              : 'text-ink/70 hover:bg-primary-50 hover:text-primary',
            collapsed && 'justify-center px-0',
          ]"
        >
          <Icon :name="item.icon" class="size-5 shrink-0" />
          <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="space-y-1 border-t border-primary-100/70 p-3">
        <button
          type="button"
          class="hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/60 transition-colors hover:bg-primary-50 hover:text-primary focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:outline-none lg:flex"
          :class="collapsed && 'justify-center px-0'"
          :aria-label="collapsed ? 'Expand menu' : 'Collapse menu'"
          @click="collapsed = !collapsed"
        >
          <Icon :name="collapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'" class="size-5 shrink-0" />
          <span v-if="!collapsed" class="truncate">Collapse</span>
        </button>

        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/60 transition-colors hover:bg-primary-50 hover:text-primary focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:outline-none disabled:opacity-50"
          :class="collapsed && 'justify-center px-0'"
          :disabled="logOutLoading"
          :title="collapsed ? 'Log out' : undefined"
          @click="logOut"
        >
          <Icon
            :name="logOutLoading ? 'lucide:loader-circle' : 'lucide:log-out'"
            class="size-5 shrink-0"
            :class="{ 'animate-spin': logOutLoading }"
          />
          <span v-if="!collapsed" class="truncate">Log out</span>
        </button>
      </div>
    </aside>

    <div class="flex min-h-screen flex-col transition-[padding] duration-300" :class="collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'">
      <header class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-primary-100/70 bg-background/85 px-4 backdrop-blur-lg md:px-8 lg:hidden">
        <button
          type="button"
          class="flex size-10 items-center justify-center rounded-xl border border-primary-100 text-primary transition-colors hover:border-primary/30 hover:bg-primary-50 focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:outline-none"
          aria-label="Open menu"
          @click="mobileOpen = true"
        >
          <Icon name="lucide:menu" class="size-5" />
        </button>
        <span class="font-display text-base font-bold text-primary">Admin</span>
      </header>

      <main class="flex-1">
        <slot />
      </main>

      <footer class="border-t border-primary-100/70 px-6 py-5 md:px-10">
        <p class="text-xs text-ink/40">
          UmrahSendiri admin panel — not for sharing outside the team.
        </p>
      </footer>
    </div>
  </div>
</template>

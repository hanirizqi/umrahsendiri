<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({
  title: 'Masuk — Admin UmrahSendiri',
  robots: 'noindex, nofollow',
})

const route = useRoute()

const form = reactive({ user: '', password: '' })
const error = ref('')
const loading = ref(false)

const isValid = computed(() => Boolean(form.user.trim() && form.password))

async function submit() {
  if (!isValid.value || loading.value) return

  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: { user: form.user.trim(), password: form.password },
    })

    const lanjut = typeof route.query.lanjut === 'string' ? route.query.lanjut : ''
    // Hanya terima path admin, supaya parameter ini tidak bisa dipakai
    // mengalihkan ke situs lain.
    const tujuan = lanjut.startsWith('/admin/') ? lanjut : '/admin/leads'
    await navigateTo(tujuan)
  }
  catch (e) {
    const status = (e as { statusCode?: number })?.statusCode
    error.value = status === 429
      ? 'Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit.'
      : status === 503
        ? 'Panel admin belum dikonfigurasi. Hubungi pengelola sistem.'
        : 'Username atau kata sandi salah.'
    form.password = ''
  }
  finally {
    loading.value = false
  }
}

const inputClass = 'mt-2 w-full rounded-xl border border-primary-100 bg-background px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-secondary-600'
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.07]"
      style="background: radial-gradient(55% 70% at 50% 0%, var(--color-secondary) 0%, transparent 70%)"
    />

    <div class="relative w-full max-w-md">
      <div class="flex flex-col items-center text-center">
        <AppLogo />
        <p class="mt-5 font-display text-[0.65rem] font-semibold tracking-[0.16em] text-secondary-700 uppercase">
          Panel Admin
        </p>
        <h1 class="mt-2 font-display text-2xl font-bold text-primary">
          Masuk ke Panel
        </h1>
        <p class="mt-2 text-sm text-ink/60">
          Halaman ini hanya untuk tim UmrahSendiri.
        </p>
      </div>

      <form class="mt-8 space-y-5 rounded-3xl border border-primary-100 bg-white/70 p-8 shadow-soft" @submit.prevent="submit">
        <div>
          <label for="user" class="text-sm font-medium text-ink/70">Username</label>
          <input
            id="user"
            v-model="form.user"
            type="text"
            autocomplete="username"
            autofocus
            :class="inputClass"
          >
        </div>

        <div>
          <label for="password" class="text-sm font-medium text-ink/70">Kata Sandi</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            :class="inputClass"
          >
        </div>

        <p v-if="error" role="alert" class="flex items-start gap-2 rounded-xl bg-secondary-100/50 px-4 py-3 text-sm text-primary-700">
          <Icon name="lucide:triangle-alert" class="mt-0.5 size-4 shrink-0 text-secondary-700" />
          {{ error }}
        </p>

        <AppButton
          type="submit"
          variant="primary"
          size="lg"
          class="w-full"
          :disabled="!isValid || loading"
        >
          {{ loading ? 'Memeriksa…' : 'Masuk' }}
          <Icon :name="loading ? 'lucide:loader-circle' : 'lucide:arrow-right'" class="size-4" :class="{ 'animate-spin': loading }" />
        </AppButton>
      </form>

      <p class="mt-6 text-center text-xs text-ink/40">
        <NuxtLink to="/" class="underline underline-offset-2 hover:text-ink/70">Kembali ke situs utama</NuxtLink>
      </p>
    </div>
  </div>
</template>

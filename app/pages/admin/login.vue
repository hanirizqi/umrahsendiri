<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({
  title: 'Sign in — UmrahSendiri Admin',
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

    const next = typeof route.query.next === 'string' ? route.query.next : ''
    // Only admin paths are accepted, so this parameter cannot be used
    // to redirect anyone off-site.
    const target = next.startsWith('/admin/') ? next : '/admin/leads'
    await navigateTo(target)
  }
  catch (e) {
    const status = (e as { statusCode?: number })?.statusCode
    error.value = status === 429
      ? 'Too many sign-in attempts. Try again in 15 minutes.'
      : status === 503
        ? 'The admin panel is not configured yet. The server log lists the missing environment variables.'
        : 'Incorrect username or password.'
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
          Admin Panel
        </p>
        <h1 class="mt-2 font-display text-2xl font-bold text-primary">
          Sign in
        </h1>
        <p class="mt-2 text-sm text-ink/60">
          For the UmrahSendiri team only.
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
          <label for="password" class="text-sm font-medium text-ink/70">Password</label>
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
          {{ loading ? 'Checking…' : 'Sign in' }}
          <Icon :name="loading ? 'lucide:loader-circle' : 'lucide:arrow-right'" class="size-4" :class="{ 'animate-spin': loading }" />
        </AppButton>
      </form>

      <p class="mt-6 text-center text-xs text-ink/40">
        <NuxtLink to="/" class="underline underline-offset-2 hover:text-ink/70">Back to the main site</NuxtLink>
      </p>
    </div>
  </div>
</template>

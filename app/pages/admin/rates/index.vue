<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { data } = await useFetch('/api/admin/rate-periods')

useSeoMeta({ title: 'LPP Rates — Admin', robots: 'noindex, nofollow' })

const creating = ref(false)
const createError = ref('')
const showForm = ref(false)

const form = reactive({
  code: '',
  label: '',
  effectiveFrom: '',
  copyFromId: '',
})

/**
 * Periode yang sedang dipakai membuat penawaran: sudah terbit dan tanggal
 * berlakunya paling baru. Aturannya harus sama dengan buildQuote, kalau tidak
 * layar ini menunjuk periode yang berbeda dari yang sebenarnya dipakai.
 */
const activePeriod = computed(() =>
  data.value?.periods.filter(p => p.isPublished)[0],
)

const isValid = computed(() =>
  Boolean(form.code.trim() && form.label.trim() && form.effectiveFrom.trim()),
)

function openForm() {
  const latest = data.value?.periods[0]
  form.copyFromId = latest?.id ?? ''
  form.code = ''
  form.label = ''
  form.effectiveFrom = ''
  createError.value = ''
  showForm.value = true
}

async function create() {
  if (!isValid.value || creating.value) return
  creating.value = true
  createError.value = ''
  try {
    const res = await $fetch<{ id: string }>('/api/admin/rate-periods', {
      method: 'POST',
      body: {
        code: form.code.trim(),
        label: form.label.trim(),
        effectiveFrom: new Date(form.effectiveFrom).toISOString(),
        copyFromId: form.copyFromId || undefined,
      },
    })
    await navigateTo(`/admin/rates/${res.id}`)
  }
  catch (e) {
    createError.value = (e as { statusMessage?: string })?.statusMessage ?? 'Could not create the period.'
  }
  finally {
    creating.value = false
  }
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <SectionContainer>
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="font-display text-3xl font-bold text-primary">LPP Rates</h1>
        <p class="mt-1 max-w-2xl text-sm text-ink/60">
          One period per LPP release. Quotes always use the published period with the
          latest start date, and copy the amounts at the moment they are created — so
          editing a period never changes a quote already sent.
        </p>
      </div>
      <AppButton variant="primary" @click="openForm">
        New Period
        <Icon name="lucide:plus" class="size-4" />
      </AppButton>
    </div>

    <form
      v-if="showForm"
      class="mt-8 rounded-2xl border border-primary-100 bg-white/60 p-6"
      @submit.prevent="create"
    >
      <p class="font-display text-sm font-semibold text-primary">New rate period</p>

      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label for="code" class="text-xs text-ink/50">Code</label>
          <input id="code" v-model="form.code" type="text" placeholder="2026-10" class="mt-1.5 w-full rounded-xl border border-primary-100 bg-background px-3 py-2.5 text-sm text-ink outline-none focus:border-secondary-600">
        </div>
        <div>
          <label for="label" class="text-xs text-ink/50">Label</label>
          <input id="label" v-model="form.label" type="text" placeholder="LPP Oktober 2026" class="mt-1.5 w-full rounded-xl border border-primary-100 bg-background px-3 py-2.5 text-sm text-ink outline-none focus:border-secondary-600">
        </div>
        <div>
          <label for="effectiveFrom" class="text-xs text-ink/50">Starts from</label>
          <input id="effectiveFrom" v-model="form.effectiveFrom" type="date" class="mt-1.5 w-full rounded-xl border border-primary-100 bg-background px-3 py-2.5 text-sm text-ink outline-none focus:border-secondary-600">
        </div>
        <div>
          <label for="copyFromId" class="text-xs text-ink/50">Copy rates from</label>
          <select id="copyFromId" v-model="form.copyFromId" class="mt-1.5 w-full rounded-xl border border-primary-100 bg-background px-3 py-2.5 text-sm text-ink outline-none focus:border-secondary-600">
            <option value="">Start empty</option>
            <option v-for="p in data?.periods" :key="p.id" :value="p.id">
              {{ p.label }} ({{ p.rateCount }} rates)
            </option>
          </select>
        </div>
      </div>

      <p v-if="createError" role="alert" class="mt-4 rounded-xl bg-secondary-100/50 px-4 py-3 text-sm text-primary-700">
        {{ createError }}
      </p>

      <p class="mt-4 text-xs text-ink/50">
        Created unpublished, so you can adjust the amounts before any quote uses them.
      </p>

      <div class="mt-4 flex gap-2">
        <AppButton type="submit" variant="primary" :disabled="!isValid || creating">
          {{ creating ? 'Creating…' : 'Create' }}
        </AppButton>
        <AppButton variant="ghost" @click="showForm = false">Cancel</AppButton>
      </div>
    </form>

    <div v-if="!data?.periods.length" class="mt-8 rounded-2xl border border-primary-100 bg-white/60 p-10 text-center">
      <Icon name="lucide:receipt-text" class="mx-auto size-9 text-ink/25" />
      <p class="mt-3 text-sm text-ink/50">No rate periods yet.</p>
    </div>

    <div v-else class="mt-8 overflow-hidden rounded-2xl border border-primary-100 bg-white/60">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px] text-left text-sm">
          <thead class="border-b border-primary-100 text-xs text-ink/50">
            <tr>
              <th scope="col" class="px-5 py-3 font-medium">Period</th>
              <th scope="col" class="px-5 py-3 font-medium">Starts from</th>
              <th scope="col" class="px-5 py-3 font-medium">Rates</th>
              <th scope="col" class="px-5 py-3 font-medium">Status</th>
              <th scope="col" class="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in data.periods"
              :key="p.id"
              class="border-b border-primary-100/50 transition-colors last:border-0 hover:bg-primary-50/40"
            >
              <td class="px-5 py-4">
                <NuxtLink :to="`/admin/rates/${p.id}`" class="font-medium text-primary hover:underline">
                  {{ p.label }}
                </NuxtLink>
                <p class="font-mono text-xs text-ink/40">{{ p.code }}</p>
              </td>
              <td class="px-5 py-4 text-ink/70">{{ formatDate(p.effectiveFrom) }}</td>
              <td class="px-5 py-4 text-ink/70">{{ p.rateCount }}</td>
              <td class="px-5 py-4">
                <span
                  v-if="p.id === activePeriod?.id"
                  class="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-background"
                >In use</span>
                <span
                  v-else-if="p.isPublished"
                  class="rounded-full bg-secondary-100/70 px-2.5 py-1 text-xs font-semibold text-primary-700"
                >Published</span>
                <span
                  v-else
                  class="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-ink/60"
                >Draft</span>
              </td>
              <td class="px-5 py-4 text-right">
                <NuxtLink
                  :to="`/admin/rates/${p.id}`"
                  class="inline-flex size-9 items-center justify-center rounded-lg border border-primary-100 text-ink/50 transition-colors hover:border-primary/30 hover:bg-primary-50 hover:text-primary focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:outline-none"
                  :aria-label="`Open ${p.label}`"
                  :title="`Open ${p.label}`"
                >
                  <Icon name="lucide:eye" class="size-4" />
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </SectionContainer>
</template>

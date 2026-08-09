<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = route.params.id as string

const { data, error, refresh } = await useFetch(`/api/admin/contacts/${id}`)

const editingName = ref(false)
const nameDraft = ref('')
const savingName = ref(false)

function startEditingName() {
  nameDraft.value = data.value?.contact.name ?? ''
  editingName.value = true
}

async function saveName() {
  const next = nameDraft.value.trim()
  if (!next || savingName.value) return
  savingName.value = true
  try {
    await $fetch(`/api/admin/contacts/${id}`, { method: 'PATCH', body: { name: next } })
    await refresh()
    editingName.value = false
  }
  finally {
    savingName.value = false
  }
}

useSeoMeta({
  title: data.value ? `${data.value.contact.name} — Contact` : 'Contact',
  robots: 'noindex, nofollow',
})

const STATUS_LABEL: Record<string, string> = {
  baru: 'New',
  dihubungi: 'Contacted',
  ditawarkan: 'Quoted',
  menang: 'Won',
  kalah: 'Lost',
}

function formatPhone(phone: string) {
  if (!phone.startsWith('62')) return phone
  const rest = phone.slice(2)
  return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`.replace(/-$/, '')
}

function formatDateTime(value: string | Date | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const waHref = computed(() =>
  data.value ? `https://wa.me/${data.value.contact.phone}` : undefined,
)

/** Lead yang benar-benar datang dari iklan; sisanya tidak perlu disebut. */
function adSource(lead: { utmSource: string | null, utmCampaign: string | null, gclid: string | null }) {
  if (lead.gclid) return lead.utmCampaign ? `Google Ads · ${lead.utmCampaign}` : 'Google Ads'
  if (lead.utmSource) return [lead.utmSource, lead.utmCampaign].filter(Boolean).join(' · ')
  return null
}
</script>

<template>
  <SectionContainer>
    <div v-if="error" class="rounded-2xl border border-primary-100 bg-white/60 p-8 text-center">
      <p class="text-ink/60">Contact not found.</p>
      <AppButton to="/admin/contacts" variant="ghost" class="mt-4">Back to contacts</AppButton>
    </div>

    <div v-else-if="data">
      <NuxtLink to="/admin/contacts" class="inline-flex items-center gap-1.5 text-sm text-ink/60 transition-colors hover:text-primary">
        <Icon name="lucide:arrow-left" class="size-4" />
        All contacts
      </NuxtLink>

      <div class="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="font-mono text-xs text-ink/40">{{ formatPhone(data.contact.phone) }}</p>

          <form v-if="editingName" class="mt-1 flex flex-wrap items-center gap-2" @submit.prevent="saveName">
            <label for="contactName" class="sr-only">Contact name</label>
            <input
              id="contactName"
              v-model="nameDraft"
              type="text"
              autofocus
              class="w-64 max-w-full rounded-xl border border-primary-100 bg-background px-3 py-2 font-display text-xl font-bold text-primary outline-none focus:border-secondary-600"
              @keyup.escape="editingName = false"
            >
            <AppButton type="submit" variant="primary" :disabled="!nameDraft.trim() || savingName">
              {{ savingName ? 'Saving…' : 'Save' }}
            </AppButton>
            <AppButton variant="ghost" @click="editingName = false">Cancel</AppButton>
          </form>

          <div v-else class="mt-1 flex items-center gap-2">
            <h1 class="font-display text-3xl font-bold text-primary">{{ data.contact.name }}</h1>
            <button
              type="button"
              class="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-primary-50 hover:text-primary focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:outline-none"
              aria-label="Edit contact name"
              @click="startEditingName"
            >
              <Icon name="lucide:pencil" class="size-4" />
            </button>
          </div>

          <p class="mt-1 text-sm text-ink/60">
            {{ data.leads.length }} enquir{{ data.leads.length === 1 ? 'y' : 'ies' }} from this number
            <span v-if="data.contact.nameSetManually" class="text-ink/40">· name set by the team</span>
          </p>
        </div>
        <AppButton :href="waHref" variant="ghost">
          Message on WhatsApp
          <Icon name="lucide:message-circle" class="size-4" />
        </AppButton>
      </div>

      <div class="mt-10 space-y-4">
        <NuxtLink
          v-for="lead in data.leads"
          :key="lead.id"
          :to="`/admin/leads/${lead.id}`"
          class="block rounded-2xl border border-primary-100 bg-white/60 p-6 transition-colors hover:border-secondary-600/40"
        >
          <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div>
              <p class="font-mono text-xs text-ink/40">{{ lead.leadNumber }}</p>
              <p class="mt-1 font-display text-lg font-semibold text-primary">
                {{ lead.pax }} pax · {{ lead.departureTarget || 'no target date' }}
              </p>
              <p class="mt-1 text-xs text-ink/50">
                Submitted {{ formatDateTime(lead.createdAt) }}
              </p>
            </div>
            <div class="text-right">
              <span class="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-ink/70">
                {{ STATUS_LABEL[lead.status] ?? lead.status }}
              </span>
              <p v-if="adSource(lead)" class="mt-2 text-xs text-secondary-700">
                {{ adSource(lead) }}
              </p>
            </div>
          </div>

          <p v-if="lead.name !== data.contact.name" class="mt-3 border-t border-primary-100/60 pt-3 text-xs text-ink/50">
            Wrote their name as "{{ lead.name }}" on this one.
          </p>
        </NuxtLink>
      </div>
    </div>
  </SectionContainer>
</template>

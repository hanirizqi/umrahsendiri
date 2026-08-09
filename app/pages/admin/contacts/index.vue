<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { data } = await useFetch('/api/admin/contacts')

useSeoMeta({
  title: 'Contacts — Admin',
  robots: 'noindex, nofollow',
})

/** 6281234567890 -> +62 812-3456-7890, supaya terbaca sebagai nomor telepon. */
function formatPhone(phone: string) {
  if (!phone.startsWith('62')) return phone
  const rest = phone.slice(2)
  return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`.replace(/-$/, '')
}

function formatDate(value: string | Date | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}
</script>

<template>
  <SectionContainer>
    <div>
      <h1 class="font-display text-3xl font-bold text-primary">Contacts</h1>
      <p class="mt-1 text-sm text-ink/60">
        One row per person, identified by phone number. Someone who submits the form
        twice appears once here, with both enquiries.
      </p>
    </div>

    <div v-if="!data?.contacts.length" class="mt-8 rounded-2xl border border-primary-100 bg-white/60 p-10 text-center">
      <Icon name="lucide:users" class="mx-auto size-9 text-ink/25" />
      <p class="mt-3 text-sm text-ink/50">No contacts yet.</p>
    </div>

    <div v-else class="mt-8 overflow-hidden rounded-2xl border border-primary-100 bg-white/60">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-primary-100 text-xs text-ink/50">
            <tr>
              <th scope="col" class="px-5 py-3 font-medium">Phone (user ID)</th>
              <th scope="col" class="px-5 py-3 font-medium">Name</th>
              <th scope="col" class="px-5 py-3 font-medium">Enquiries</th>
              <th scope="col" class="px-5 py-3 font-medium">First</th>
              <th scope="col" class="px-5 py-3 font-medium">Latest</th>
              <th scope="col" class="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in data.contacts"
              :key="c.id"
              class="border-b border-primary-100/50 transition-colors last:border-0 hover:bg-primary-50/40"
            >
              <td class="px-5 py-4">
                <NuxtLink :to="`/admin/contacts/${c.id}`" class="font-mono text-xs text-primary hover:underline">
                  {{ formatPhone(c.phone) }}
                </NuxtLink>
              </td>
              <td class="px-5 py-4 text-ink/80">{{ c.name }}</td>
              <td class="px-5 py-4">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="c.leadCount > 1 ? 'bg-secondary-100/70 text-primary-700' : 'bg-primary-50 text-ink/60'"
                >
                  {{ c.leadCount }}
                  <span class="font-normal">· {{ c.totalPax }} pax total</span>
                </span>
              </td>
              <td class="px-5 py-4 text-xs text-ink/50">{{ formatDate(c.firstLeadAt) }}</td>
              <td class="px-5 py-4 text-xs text-ink/50">{{ formatDate(c.lastLeadAt) }}</td>
              <td class="px-5 py-4 text-right">
                <NuxtLink
                  :to="`/admin/contacts/${c.id}`"
                  class="inline-flex size-9 items-center justify-center rounded-lg border border-primary-100 text-ink/50 transition-colors hover:border-primary/30 hover:bg-primary-50 hover:text-primary focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:outline-none"
                  :aria-label="`View ${c.name}`"
                  :title="`View ${c.name}`"
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

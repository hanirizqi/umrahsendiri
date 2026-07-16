<script setup lang="ts">
const { link } = useWhatsapp()

const form = reactive({
  name: '',
  date: '',
  message: '',
})

function buildMessage(): string {
  const parts = [`Assalamualaikum, nama saya ${form.name || '-'}.`]
  if (form.date) parts.push(`Rencana keberangkatan sekitar ${form.date}.`)
  parts.push(form.message || 'Saya ingin konsultasi rencana umrah mandiri saya.')
  return parts.join(' ')
}

const whatsappHref = computed(() => link(buildMessage()))
</script>

<template>
  <form class="space-y-5 rounded-3xl border border-primary-100 bg-white/60 p-8 shadow-soft" @submit.prevent>
    <div>
      <label for="name" class="text-sm font-medium text-ink/70">Nama</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        placeholder="Nama Anda"
        class="mt-2 w-full rounded-xl border border-primary-100 bg-background px-4 py-3 text-sm text-ink outline-none focus:border-secondary-600"
      >
    </div>

    <div>
      <label for="date" class="text-sm font-medium text-ink/70">Rencana Tanggal Keberangkatan</label>
      <input
        id="date"
        v-model="form.date"
        type="text"
        placeholder="Contoh: Maret 2027"
        class="mt-2 w-full rounded-xl border border-primary-100 bg-background px-4 py-3 text-sm text-ink outline-none focus:border-secondary-600"
      >
    </div>

    <div>
      <label for="message" class="text-sm font-medium text-ink/70">Pesan</label>
      <textarea
        id="message"
        v-model="form.message"
        rows="4"
        placeholder="Ceritakan kebutuhan perencanaan Anda"
        class="mt-2 w-full resize-none rounded-xl border border-primary-100 bg-background px-4 py-3 text-sm text-ink outline-none focus:border-secondary-600"
      />
    </div>

    <AppButton :href="whatsappHref" variant="primary" size="lg" class="w-full">
      Kirim via WhatsApp
      <Icon name="lucide:send" class="size-4" />
    </AppButton>
    <p class="text-center text-xs text-ink/50">
      Anda akan diarahkan ke WhatsApp dengan pesan yang sudah terisi otomatis.
    </p>
  </form>
</template>

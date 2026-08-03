<script setup lang="ts">
const { link } = useWhatsapp()

const form = reactive({
  name: '',
  pax: '',
  date: '',
  ticketStatus: '',
  planStatus: '',
  message: '',
})

function buildMessage(): string {
  const parts = [`Assalamualaikum, nama saya ${form.name || '-'}.`]
  if (form.pax) parts.push(`Rencana berangkat ${form.pax} orang.`)
  if (form.date) parts.push(`Target keberangkatan sekitar ${form.date}.`)
  if (form.ticketStatus === 'sudah') parts.push('Sudah punya tiket pesawat.')
  if (form.ticketStatus === 'belum') parts.push('Belum punya tiket pesawat.')
  if (form.planStatus === 'sendiri') parts.push('Sudah punya sebagian rencana, ingin dibantu bagian tertentu.')
  if (form.planStatus === 'awal') parts.push('Belum punya rencana, ingin dibantu menyusun dari awal.')
  parts.push(form.message || 'Ingin konsultasi lebih lanjut.')
  return parts.join(' ')
}

const whatsappHref = computed(() => link(buildMessage()))

const inputClass = 'mt-2 w-full rounded-xl border border-primary-100 bg-background px-4 py-3 text-sm text-ink outline-none focus:border-secondary-600'
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
        :class="inputClass"
      >
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label for="pax" class="text-sm font-medium text-ink/70">Jumlah Jamaah</label>
        <input
          id="pax"
          v-model="form.pax"
          type="number"
          min="1"
          placeholder="Contoh: 2"
          :class="inputClass"
        >
      </div>

      <div>
        <label for="date" class="text-sm font-medium text-ink/70">Rencana Tanggal Keberangkatan</label>
        <input
          id="date"
          v-model="form.date"
          type="text"
          placeholder="Contoh: Maret 2027"
          :class="inputClass"
        >
      </div>
    </div>

    <div>
      <label for="ticketStatus" class="text-sm font-medium text-ink/70">Status Tiket Pesawat</label>
      <select id="ticketStatus" v-model="form.ticketStatus" :class="inputClass">
        <option value="">Pilih status tiket</option>
        <option value="sudah">Sudah punya tiket</option>
        <option value="belum">Belum punya tiket</option>
      </select>
    </div>

    <div>
      <label for="planStatus" class="text-sm font-medium text-ink/70">Sudah Ada Rencana Sendiri?</label>
      <select id="planStatus" v-model="form.planStatus" :class="inputClass">
        <option value="">Pilih salah satu</option>
        <option value="sendiri">Sudah, tinggal dibantu bagian tertentu</option>
        <option value="awal">Belum, perlu dibantu dari awal</option>
      </select>
    </div>

    <div>
      <label for="message" class="text-sm font-medium text-ink/70">Pesan (opsional)</label>
      <textarea
        id="message"
        v-model="form.message"
        rows="4"
        placeholder="Ceritakan kebutuhan perencanaan Anda"
        :class="[inputClass, 'resize-none']"
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

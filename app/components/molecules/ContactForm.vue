<script setup lang="ts">
const { link } = useWhatsapp()

const NEEDS_OPTIONS = [
  {
    key: 'paketDasar',
    label: 'Paket Dasar',
    desc: 'Transportasi 3 rute (Bandara Jeddah–Makkah Hotel, Makkah Hotel–Madinah Hotel, Madinah Hotel–Bandara Jeddah), paket dokumen wajib (Visa Umrah, Siskopatuh, Asuransi Kesehatan Arab Saudi), dan pembimbing umrah + manasik online (untuk 1x pelaksanaan umrah).',
  },
  { key: 'hotel', label: 'Hotel (termasuk makan 3x sehari)', desc: '' },
  {
    key: 'pembimbing',
    label: 'Pemandu / Pembimbing Tambahan',
    desc: 'Tarif per hari, maksimal 9 jam. Pembimbing WNI (orang Indonesia).',
  },
  {
    key: 'airportHandling',
    label: 'Handling Bandara PP',
    desc: 'Termasuk makan saat kedatangan dan kepulangan, serta air zamzam saat kepulangan.',
  },
  {
    key: 'jabalKhandamah',
    label: 'Transport Jabal Khandamah PP',
    desc: 'Driver berbahasa Inggris.',
  },
  {
    key: 'cityTour',
    label: 'City Tour Makkah',
    desc: 'Driver berbahasa Inggris.',
  },
] as const

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const nextMonthLabel = computed(() => {
  const now = new Date()
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return `${MONTH_NAMES[next.getMonth()]} ${next.getFullYear()}`
})

const HOTEL_STAR_OPTIONS = [
  { value: '3', label: 'Bintang 3' },
  { value: '4', label: 'Bintang 4' },
  { value: '5', label: 'Bintang 5' },
]

const form = reactive({
  name: '',
  pax: '',
  date: '',
  flightStatus: '',
  hotelStatus: '',
  planStatus: '',
  referralName: '',
  referralPhone: '',
  needs: {
    paketDasar: true,
    hotel: false,
    pembimbing: false,
    airportHandling: false,
    jabalKhandamah: false,
    cityTour: false,
  },
  hotelStar: '',
  nightsMakkah: '3',
  nightsMadinah: '3',
  pembimbingDays: '1',
  message: '',
})

watch(() => form.needs.hotel, (checked) => {
  if (!checked) {
    form.hotelStar = ''
    form.nightsMakkah = '3'
    form.nightsMadinah = '3'
  }
})

watch(() => form.hotelStatus, (status) => {
  if (status === 'belum') form.needs.hotel = true
})

watch(() => form.needs.pembimbing, (checked) => {
  if (!checked) form.pembimbingDays = '1'
})

function clampPembimbingDays() {
  if (!form.needs.hotel) return
  const totalNights = (Number(form.nightsMakkah) || 0) + (Number(form.nightsMadinah) || 0)
  if (totalNights && form.pembimbingDays && Number(form.pembimbingDays) > totalNights) {
    form.pembimbingDays = String(totalNights)
  }
}

watch(() => form.pembimbingDays, clampPembimbingDays)
watch(() => form.nightsMakkah, clampPembimbingDays)
watch(() => form.nightsMadinah, clampPembimbingDays)

const isFormValid = computed(() => Boolean(
  form.name.trim()
  && form.pax
  && form.date.trim()
  && form.flightStatus
  && form.hotelStatus
  && form.planStatus,
))

function buildMessage(): string {
  const parts = [`Assalamualaikum, nama saya ${form.name || '-'}.`]
  if (form.pax) parts.push(`Rencana berangkat ${form.pax} orang.`)
  if (form.date) parts.push(`Target keberangkatan sekitar ${form.date}.`)
  if (form.flightStatus === 'sudah') parts.push('Sudah pesan penerbangan.')
  if (form.flightStatus === 'belum') parts.push('Belum pesan penerbangan.')
  if (form.hotelStatus === 'sudah') parts.push('Sudah punya reservasi hotel.')
  if (form.hotelStatus === 'belum') parts.push('Belum punya reservasi hotel.')
  if (form.planStatus === 'sendiri') parts.push('Sudah punya sebagian rencana, ingin dibantu bagian tertentu.')
  if (form.planStatus === 'awal') parts.push('Belum punya rencana, ingin dibantu menyusun dari awal.')

  const needsList = NEEDS_OPTIONS.filter(opt => form.needs[opt.key]).map((opt) => {
    if (opt.key === 'hotel') {
      if (!form.hotelStar) return opt.label
      return `Hotel Bintang ${form.hotelStar} (${form.nightsMakkah || 0} malam Makkah, ${form.nightsMadinah || 0} malam Madinah, termasuk makan 3x sehari)`
    }
    if (opt.key === 'pembimbing') return `${opt.label} (${form.pembimbingDays || 1} hari)`
    return opt.label
  })
  if (needsList.length) parts.push(`Kebutuhan: ${needsList.join(', ')}.`)

  if (form.referralName) {
    parts.push(`Referral dari ${form.referralName}${form.referralPhone ? ` (${form.referralPhone})` : ''}.`)
  }

  parts.push(form.message || 'Ingin konsultasi lebih lanjut.')
  return parts.join(' ')
}

const whatsappHref = computed(() => (isFormValid.value ? link(buildMessage()) : undefined))

function handleSubmit(event: MouseEvent) {
  if (!whatsappHref.value) return
  event.preventDefault()
  reportWhatsappFormConversion(whatsappHref.value)
}

const inputClass = 'mt-2 w-full rounded-xl border border-primary-100 bg-background px-4 py-3 text-sm text-ink outline-none focus:border-secondary-600'
const checkboxClass = 'size-4 rounded border-primary-100 accent-primary'
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
        required
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
          required
          :class="inputClass"
        >
      </div>

      <div>
        <label for="date" class="text-sm font-medium text-ink/70">Rencana Waktu Keberangkatan</label>
        <input
          id="date"
          v-model="form.date"
          type="text"
          :placeholder="`Contoh: ${nextMonthLabel}`"
          required
          :class="inputClass"
        >
      </div>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label for="flightStatus" class="text-sm font-medium text-ink/70">Status Penerbangan</label>
        <select id="flightStatus" v-model="form.flightStatus" required :class="inputClass">
          <option value="">Pilih status penerbangan</option>
          <option value="sudah">Sudah pesan penerbangan</option>
          <option value="belum">Belum pesan penerbangan</option>
        </select>
      </div>

      <div>
        <label for="hotelStatus" class="text-sm font-medium text-ink/70">Status Reservasi Hotel</label>
        <select id="hotelStatus" v-model="form.hotelStatus" required :class="inputClass">
          <option value="">Pilih status reservasi</option>
          <option value="sudah">Sudah punya reservasi</option>
          <option value="belum">Belum punya reservasi</option>
        </select>
      </div>
    </div>

    <div>
      <label for="planStatus" class="text-sm font-medium text-ink/70">Sudah Ada Rencana Sendiri?</label>
      <select id="planStatus" v-model="form.planStatus" required :class="inputClass">
        <option value="">Pilih salah satu</option>
        <option value="sendiri">Sudah, tinggal dibantu bagian tertentu</option>
        <option value="awal">Belum, perlu dibantu dari awal</option>
      </select>
    </div>

    <div>
      <p class="text-sm font-medium text-ink/70">Kebutuhan yang Diperlukan</p>
      <div class="mt-3 space-y-3">
        <div v-for="option in NEEDS_OPTIONS" :key="option.key">
          <label class="flex items-center gap-2.5 text-sm text-ink/80">
            <input v-model="form.needs[option.key]" type="checkbox" :class="checkboxClass">
            {{ option.label }}
          </label>
          <p v-if="option.desc" class="mt-1 ml-6 text-xs text-ink/50">{{ option.desc }}</p>

          <div v-if="option.key === 'hotel' && form.needs.hotel" class="mt-3 ml-6 space-y-3">
            <div class="flex flex-wrap gap-x-5 gap-y-2">
              <label v-for="star in HOTEL_STAR_OPTIONS" :key="star.value" class="flex items-center gap-2 text-sm text-ink/80">
                <input v-model="form.hotelStar" type="radio" name="hotelStar" :value="star.value" class="size-4 border-primary-100 accent-primary">
                {{ star.label }}
              </label>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="nightsMakkah" class="text-xs font-medium text-ink/60">Malam di Makkah</label>
                <input id="nightsMakkah" v-model="form.nightsMakkah" type="number" min="3" class="mt-1.5 w-full rounded-xl border border-primary-100 bg-background px-3 py-2 text-sm text-ink outline-none focus:border-secondary-600">
              </div>
              <div>
                <label for="nightsMadinah" class="text-xs font-medium text-ink/60">Malam di Madinah</label>
                <input id="nightsMadinah" v-model="form.nightsMadinah" type="number" min="3" class="mt-1.5 w-full rounded-xl border border-primary-100 bg-background px-3 py-2 text-sm text-ink outline-none focus:border-secondary-600">
              </div>
            </div>
          </div>

          <div v-if="option.key === 'pembimbing' && form.needs.pembimbing" class="mt-3 ml-6">
            <label for="pembimbingDays" class="text-xs font-medium text-ink/60">Jumlah Hari</label>
            <input
              id="pembimbingDays"
              v-model="form.pembimbingDays"
              type="number"
              min="1"
              :max="form.needs.hotel ? (Number(form.nightsMakkah) || 0) + (Number(form.nightsMadinah) || 0) : undefined"
              class="mt-1.5 w-28 rounded-xl border border-primary-100 bg-background px-3 py-2 text-sm text-ink outline-none focus:border-secondary-600"
            >
            <p v-if="form.needs.hotel" class="mt-1 text-xs text-ink/50">
              Maksimal {{ (Number(form.nightsMakkah) || 0) + (Number(form.nightsMadinah) || 0) }} hari (sesuai total malam menginap)
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label for="referralName" class="text-sm font-medium text-ink/70">Nama Referral (opsional)</label>
        <input
          id="referralName"
          v-model="form.referralName"
          type="text"
          placeholder="Nama yang merekomendasikan"
          :class="inputClass"
        >
      </div>

      <div>
        <label for="referralPhone" class="text-sm font-medium text-ink/70">No. HP Referral (opsional)</label>
        <input
          id="referralPhone"
          v-model="form.referralPhone"
          type="tel"
          placeholder="Contoh: 0812xxxxxxx"
          :class="inputClass"
        >
      </div>
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

    <AppButton
      :href="whatsappHref"
      :disabled="!isFormValid"
      variant="primary"
      size="lg"
      class="w-full"
      @click="handleSubmit"
    >
      Kirim via WhatsApp
      <Icon name="lucide:send" class="size-4" />
    </AppButton>
    <p class="text-center text-xs text-ink/50">
      <template v-if="isFormValid">Anda akan diarahkan ke WhatsApp dengan pesan yang sudah terisi otomatis.</template>
      <template v-else>Lengkapi semua field wajib (di luar yang bertanda "opsional") untuk mengirim.</template>
    </p>
  </form>
</template>

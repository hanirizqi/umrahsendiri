<script setup lang="ts">
const { link } = useWhatsapp()

// `code` harus sama dengan kolom services.code di database.
const NEEDS_OPTIONS = [
  {
    key: 'paketDasar',
    code: 'paket_dasar',
    label: 'Paket Dasar',
    desc: 'Transportasi 3 rute (Bandara Jeddah–Makkah Hotel, Makkah Hotel–Madinah Hotel, Madinah Hotel–Bandara Jeddah), pendampingan penyiapan dokumen wajib, dan pembimbing umrah + manasik online (untuk 1x pelaksanaan umrah).',
  },
  { key: 'hotel', code: 'hotel', label: 'Hotel (termasuk makan 3x sehari)', desc: '' },
  {
    key: 'pembimbing',
    code: 'pembimbing',
    label: 'Pemandu / Pembimbing Tambahan',
    desc: 'Tarif per hari, maksimal 9 jam. Pembimbing WNI (orang Indonesia).',
  },
  {
    key: 'airportHandling',
    code: 'handling_bandara',
    label: 'Handling Bandara PP',
    desc: 'Termasuk makan saat kedatangan dan kepulangan, serta air zamzam saat kepulangan.',
  },
  {
    key: 'jabalKhandamah',
    code: 'jabal_khandamah',
    label: 'Transport Jabal Khandamah PP',
    desc: 'Driver berbahasa Inggris.',
  },
  {
    key: 'cityTour',
    code: 'city_tour',
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
  phone: '',
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
  && form.phone.trim()
  && form.pax
  && form.date.trim()
  && form.flightStatus
  && form.hotelStatus
  && form.planStatus,
))

function buildMessage(): string {
  const parts = [`Assalamualaikum, nama saya ${form.name || '-'}.`]
  if (form.phone) parts.push(`No. HP saya ${form.phone}.`)
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

const { read: readAttribution } = useAttribution()

function buildSelections() {
  return NEEDS_OPTIONS.filter(opt => form.needs[opt.key]).map((opt) => {
    if (opt.key === 'hotel') {
      return {
        code: opt.code,
        hotelTier: Number(form.hotelStar) || undefined,
        quantity: (Number(form.nightsMakkah) || 0) + (Number(form.nightsMadinah) || 0) || undefined,
      }
    }
    if (opt.key === 'pembimbing') {
      return { code: opt.code, quantity: Number(form.pembimbingDays) || 1 }
    }
    return { code: opt.code }
  })
}

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error'

const status = ref<SubmitStatus>('idle')
const errorMessage = ref('')
/** Disimpan sebelum form dikosongkan, karena pesannya dirakit dari isi form. */
const pendingWhatsappUrl = ref('')

function buildPayload() {
  return {
    name: form.name.trim(),
    phone: form.phone.trim(),
    pax: Number(form.pax),
    departureTarget: form.date.trim(),
    flightStatus: form.flightStatus,
    hotelStatus: form.hotelStatus,
    planStatus: form.planStatus,
    hotelTier: Number(form.hotelStar) || undefined,
    nightsMakkah: form.needs.hotel ? Number(form.nightsMakkah) || undefined : undefined,
    nightsMadinah: form.needs.hotel ? Number(form.nightsMadinah) || undefined : undefined,
    pembimbingDays: form.needs.pembimbing ? Number(form.pembimbingDays) || undefined : undefined,
    message: form.message.trim() || undefined,
    referralName: form.referralName.trim() || undefined,
    referralPhone: form.referralPhone.trim() || undefined,
    selections: buildSelections(),
    ...readAttribution(),
  }
}

function resetForm() {
  form.name = ''
  form.phone = ''
  form.pax = ''
  form.date = ''
  form.flightStatus = ''
  form.hotelStatus = ''
  form.planStatus = ''
  form.referralName = ''
  form.referralPhone = ''
  form.needs.paketDasar = true
  form.needs.hotel = false
  form.needs.pembimbing = false
  form.needs.airportHandling = false
  form.needs.jabalKhandamah = false
  form.needs.cityTour = false
  form.hotelStar = ''
  form.nightsMakkah = '3'
  form.nightsMadinah = '3'
  form.pembimbingDays = '1'
  form.message = ''
}

/**
 * Perpindahan ke WhatsApp memakai location.href, bukan window.open. Setelah
 * menunggu jawaban server, peramban tidak lagi menganggapnya hasil klik langsung
 * dan pemblokir popup akan menutup tab baru — sedangkan navigasi biasa selalu lolos.
 */
function goToWhatsapp() {
  if (pendingWhatsappUrl.value) window.location.href = pendingWhatsappUrl.value
}

/**
 * Jalur gagal-simpan: lead tidak masuk database, jadi konversi form tidak
 * pernah dilaporkan — padahal jemaahnya tetap sampai ke WhatsApp. Dicatat
 * sebagai klik biasa, dan ditunggu dulu karena halaman ini ikut ditinggalkan.
 */
async function goToWhatsappUnsaved() {
  await reportWhatsappClickBeforeLeaving('contact_form_fallback')
  goToWhatsapp()
}

async function handleSubmit() {
  if (!isFormValid.value || status.value === 'sending') return

  status.value = 'sending'
  errorMessage.value = ''
  pendingWhatsappUrl.value = link(buildMessage())

  try {
    await $fetch('/api/leads', { method: 'POST', body: buildPayload() })
  }
  catch (e) {
    const code = (e as { statusCode?: number })?.statusCode
    errorMessage.value = code === 429
      ? 'Terlalu banyak pengiriman dari perangkat ini. Coba lagi dalam satu jam.'
      : 'Data Anda belum tersimpan karena ada gangguan di sistem kami. Anda tetap bisa melanjutkan ke WhatsApp.'
    status.value = 'error'
    return
  }

  resetForm()
  status.value = 'success'

  await reportWhatsappFormConversion()
  goToWhatsapp()
}

const inputClass = 'mt-2 w-full rounded-xl border border-primary-100 bg-background px-4 py-3 text-sm text-ink outline-none focus:border-secondary-600'
const checkboxClass = 'size-4 rounded border-primary-100 accent-primary'
</script>

<template>
  <div
    v-if="status === 'success'"
    class="rounded-3xl border border-primary-100 bg-white/60 p-8 text-center shadow-soft"
  >
    <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-50">
      <Icon name="lucide:check" class="size-6 text-primary" />
    </div>
    <h3 class="mt-4 font-display text-xl font-bold text-primary">Data Anda sudah kami terima</h3>
    <p class="mt-2 text-sm text-ink/60">
      Sedang mengarahkan Anda ke WhatsApp dengan pesan yang sudah terisi otomatis.
    </p>
    <AppButton variant="ghost" class="mt-6" @click="goToWhatsapp">
      Buka WhatsApp sekarang
      <Icon name="lucide:message-circle" class="size-4" />
    </AppButton>
  </div>

  <form v-else class="space-y-5 rounded-3xl border border-primary-100 bg-white/60 p-8 shadow-soft" @submit.prevent="handleSubmit">
    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label for="name" class="text-sm font-medium text-ink/70">Nama</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="Nama Anda"
          autocomplete="name"
          required
          :class="inputClass"
        >
      </div>

      <div>
        <label for="phone" class="text-sm font-medium text-ink/70">No. WhatsApp</label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          inputmode="tel"
          placeholder="Contoh: 0812xxxxxxx"
          autocomplete="tel"
          required
          :class="inputClass"
        >
      </div>
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

    <p
      v-if="status === 'error'"
      role="alert"
      class="flex items-start gap-2.5 rounded-xl border border-secondary-600/30 bg-secondary-100/40 px-4 py-3 text-sm text-primary-700"
    >
      <Icon name="lucide:triangle-alert" class="mt-0.5 size-4 shrink-0 text-secondary-700" />
      <span>{{ errorMessage }}</span>
    </p>

    <AppButton
      type="submit"
      :disabled="!isFormValid || status === 'sending'"
      variant="primary"
      size="lg"
      class="w-full"
    >
      {{ status === 'sending' ? 'Mengirim…' : 'Kirim via WhatsApp' }}
      <Icon
        :name="status === 'sending' ? 'lucide:loader-circle' : 'lucide:send'"
        class="size-4"
        :class="{ 'animate-spin': status === 'sending' }"
      />
    </AppButton>

    <AppButton v-if="status === 'error'" variant="ghost" size="lg" class="w-full" @click="goToWhatsappUnsaved">
      Lanjut ke WhatsApp tanpa menyimpan
      <Icon name="lucide:message-circle" class="size-4" />
    </AppButton>

    <p class="text-center text-xs text-ink/50">
      <template v-if="status === 'sending'">Menyimpan data Anda…</template>
      <template v-else-if="isFormValid">Anda akan diarahkan ke WhatsApp dengan pesan yang sudah terisi otomatis.</template>
      <template v-else>Lengkapi semua field wajib (di luar yang bertanda "opsional") untuk mengirim.</template>
    </p>
  </form>
</template>

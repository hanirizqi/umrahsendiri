<script setup lang="ts">
import { formatRupiah } from '~/utils/currency'

useSeoMeta({
  title: 'Kalkulator Harga (Internal)',
  robots: 'noindex, nofollow',
})

const { rawMessage, parsed, occupancy, isOverCapacity, quote, parseMessage } = usePriceCalculator()

const inputClass = 'mt-2 w-full rounded-xl border border-primary-100 bg-background px-4 py-3 text-sm text-ink outline-none focus:border-secondary-600'
</script>

<template>
  <div>
    <SectionContainer>
      <SectionHeading
        align="left"
        eyebrow="Internal — Bukan untuk Publik"
        title="Kalkulator Harga"
        description="Tempel pesan WhatsApp dari form kontak — semua rincian (jumlah jemaah, hotel, malam, hari pemandu, layanan tambahan) sudah ada di pesannya, tinggal klik Baca Pesan."
      />

      <div class="mt-12 grid gap-8 lg:grid-cols-2">
        <div class="space-y-6">
          <div>
            <label for="rawMessage" class="text-sm font-medium text-ink/70">Tempel Pesan WhatsApp</label>
            <textarea
              id="rawMessage"
              v-model="rawMessage"
              rows="6"
              placeholder="Assalamualaikum, nama saya... Kebutuhan: Paket Dasar, Hotel Bintang 4 (3 malam Makkah, 3 malam Madinah...)..."
              :class="[inputClass, 'resize-none']"
            />
            <AppButton variant="primary" class="mt-3" @click="parseMessage">
              Baca Pesan
              <Icon name="lucide:wand-sparkles" class="size-4" />
            </AppButton>
          </div>

          <div v-if="parsed.pax" class="rounded-2xl border border-primary-100 bg-white/60 p-6">
            <p class="text-sm font-semibold text-primary">Terbaca dari Pesan</p>
            <ul class="mt-3 space-y-1.5 text-sm text-ink/70">
              <li>Jumlah jemaah: <strong class="text-ink">{{ parsed.pax }} orang</strong> ({{ occupancy ? `okupansi ${occupancy}` : '-' }})</li>
              <li>Paket Dasar: {{ parsed.paketDasar ? 'Ya' : 'Tidak disebut' }}</li>
              <li>
                Hotel:
                <template v-if="parsed.hotel">
                  Ya, Bintang {{ parsed.hotelStar ?? '(tidak terbaca)' }} — {{ parsed.nightsMakkah ?? '?' }} malam Makkah, {{ parsed.nightsMadinah ?? '?' }} malam Madinah
                </template>
                <template v-else>
                  Tidak
                </template>
              </li>
              <li>Handling Bandara PP: {{ parsed.handlingBandara ? 'Ya' : 'Tidak' }}</li>
              <li>Pemandu / Pembimbing: {{ parsed.pembimbing ? `Ya, ${parsed.pembimbingDays ?? 1} hari` : 'Tidak' }}</li>
              <li>Transport Jabal Khandamah PP: {{ parsed.jabalKhandamah ? 'Ya' : 'Tidak' }}</li>
              <li>City Tour Makkah: {{ parsed.cityTour ? 'Ya' : 'Tidak' }}</li>
            </ul>

            <p v-if="isOverCapacity" class="mt-4 rounded-xl bg-secondary-100/60 p-3 text-xs text-primary-700">
              Rombongan lebih dari 4 orang — tabel LPP hanya sampai Berempat. Hubungi tim untuk penyesuaian harga, kalkulator ini memakai rate Berempat sebagai perkiraan kasar.
            </p>
          </div>
        </div>

        <div class="rounded-3xl border border-primary-100 bg-white/60 p-8 shadow-soft">
          <p class="font-display text-lg font-semibold text-primary">Rincian Harga</p>

          <div v-if="!quote" class="mt-4 text-sm text-ink/50">
            Tempel pesan WhatsApp lalu klik "Baca Pesan" untuk mulai menghitung.
          </div>

          <div v-else class="mt-4 space-y-3">
            <div v-for="(item, index) in quote.items" :key="index" class="border-b border-primary-100/60 pb-3">
              <div class="flex items-start justify-between gap-3 text-sm">
                <span class="text-ink/80">{{ item.label }}</span>
                <span class="shrink-0 font-medium text-ink">{{ formatRupiah(item.total) }}</span>
              </div>
              <p v-if="item.note" class="mt-1 text-xs text-secondary-700">{{ item.note }}</p>
            </div>

            <div class="pt-2">
              <div class="flex items-baseline justify-between">
                <span class="text-sm text-ink/70">Harga per Jemaah</span>
                <span class="font-display text-xl font-bold text-primary">{{ formatRupiah(quote.perJemaahTotal) }}</span>
              </div>
              <div class="mt-2 flex items-baseline justify-between">
                <span class="text-sm text-ink/70">Total Rombongan ({{ quote.pax }} orang)</span>
                <span class="font-display text-2xl font-bold text-primary">{{ formatRupiah(quote.grandTotal) }}</span>
              </div>
            </div>

            <p class="pt-2 text-xs text-ink/40">
              Belum termasuk tiket pesawat PP. Sumber rate: LPP September 2026 — cek kembali kalau sudah lewat bulan berjalan.
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  </div>
</template>

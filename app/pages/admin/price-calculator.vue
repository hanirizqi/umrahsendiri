<script setup lang="ts">
import { formatRupiah } from '~/utils/currency'

definePageMeta({ layout: 'admin' })

useSeoMeta({
  title: 'Price Calculator — Admin',
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
        title="Price Calculator"
        description="Paste the WhatsApp message from the contact form — pilgrim count, hotel, nights, guide days and extras are all in there. Just click Read Message."
      />

      <div class="mt-12 grid gap-8 lg:grid-cols-2">
        <div class="space-y-6">
          <div>
            <label for="rawMessage" class="text-sm font-medium text-ink/70">Paste WhatsApp Message</label>
            <textarea
              id="rawMessage"
              v-model="rawMessage"
              rows="6"
              placeholder="Assalamualaikum, nama saya... Kebutuhan: Paket Dasar, Hotel Bintang 4 (3 malam Makkah, 3 malam Madinah...)..."
              :class="[inputClass, 'resize-none']"
            />
            <AppButton variant="primary" class="mt-3" @click="parseMessage">
              Read Message
              <Icon name="lucide:wand-sparkles" class="size-4" />
            </AppButton>
          </div>

          <div v-if="parsed.pax" class="rounded-2xl border border-primary-100 bg-white/60 p-6">
            <p class="text-sm font-semibold text-primary">Read from Message</p>
            <ul class="mt-3 space-y-1.5 text-sm text-ink/70">
              <li>Pilgrims: <strong class="text-ink">{{ parsed.pax }} pax</strong> ({{ occupancy ? `occupancy ${occupancy}` : '-' }})</li>
              <li>Base Package: {{ parsed.paketDasar ? 'Yes' : 'not mentioned' }}</li>
              <li>
                Hotel:
                <template v-if="parsed.hotel">
                  Yes, {{ parsed.hotelStar ?? '(unreadable)' }}-star — {{ parsed.nightsMakkah ?? '?' }} nights Makkah, {{ parsed.nightsMadinah ?? '?' }} nights Madinah
                </template>
                <template v-else>
                  No
                </template>
              </li>
              <li v-if="parsed.hotelReservationStatus">
                Pilgrim's hotel booking: {{ parsed.hotelReservationStatus === 'sudah' ? 'already booked' : 'not booked yet' }}
              </li>
              <li>Airport Handling (return): {{ parsed.handlingBandara ? 'Yes' : 'No' }}</li>
              <li>Guide: {{ parsed.pembimbing ? `Yes, ${parsed.pembimbingDays ?? 1} days` : 'No' }}</li>
              <li>Jabal Khandamah Transport (return): {{ parsed.jabalKhandamah ? 'Yes' : 'No' }}</li>
              <li>Makkah City Tour: {{ parsed.cityTour ? 'Yes' : 'No' }}</li>
            </ul>

            <p v-if="isOverCapacity" class="mt-4 rounded-xl bg-secondary-100/60 p-3 text-xs text-primary-700">
              Group larger than 4 — the LPP table only goes up to four. Check with the team for adjusted pricing; this calculator uses the four-person rate as a rough estimate.
            </p>
          </div>
        </div>

        <div class="rounded-3xl border border-primary-100 bg-white/60 p-8 shadow-soft">
          <p class="font-display text-lg font-semibold text-primary">Price Breakdown</p>

          <div v-if="!quote" class="mt-4 text-sm text-ink/50">
            Paste a WhatsApp message and click "Read Message" to start calculating.
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
                <span class="text-sm text-ink/70">Price per Pilgrim</span>
                <span class="font-display text-xl font-bold text-primary">{{ formatRupiah(quote.perJemaahTotal) }}</span>
              </div>
              <div class="mt-2 flex items-baseline justify-between">
                <span class="text-sm text-ink/70">Group Total ({{ quote.pax }} pax)</span>
                <span class="font-display text-2xl font-bold text-primary">{{ formatRupiah(quote.grandTotal) }}</span>
              </div>
            </div>

            <p class="pt-2 text-xs text-ink/40">
              Excludes return flights. Rates from LPP September 2026 — re-check once the month has passed.
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  </div>
</template>

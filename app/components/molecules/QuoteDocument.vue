<script setup lang="ts">
import { formatRupiah } from '~/utils/currency'

interface Item { label: string, quantity: number, perPaxAmount: number, lineTotal: number }

interface Props {
  quoteNumber: string
  name: string
  pax: number
  departureTarget?: string | null
  perPaxTotal: number
  grandTotal: number
  validUntil?: string | Date | null
  createdAt?: string | Date | null
  items: Item[]
}

defineProps<Props>()

function formatDate(value?: string | Date | null) {
  if (!value) return null
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <article class="quote-doc rounded-3xl border border-primary-100 bg-white p-8 shadow-soft md:p-10">
    <header class="flex flex-wrap items-start justify-between gap-4 border-b border-primary-100 pb-6">
      <div class="flex items-center gap-3">
        <NuxtImg src="/brand/icon-512.png" alt="" class="size-10" width="40" height="40" />
        <div>
          <p class="font-display text-lg font-bold text-primary">UmrahSendiri</p>
          <p class="text-xs text-ink/50">Bebas Berencana, Tenang Beribadah.</p>
        </div>
      </div>
      <div class="text-right">
        <p class="font-mono text-xs text-ink/50">{{ quoteNumber }}</p>
        <p v-if="formatDate(createdAt)" class="mt-0.5 text-xs text-ink/50">{{ formatDate(createdAt) }}</p>
      </div>
    </header>

    <div class="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
      <div>
        <p class="text-xs text-ink/50">Untuk</p>
        <p class="font-medium text-ink">{{ name }}</p>
      </div>
      <div>
        <p class="text-xs text-ink/50">Jumlah jemaah</p>
        <p class="font-medium text-ink">{{ pax }} orang</p>
      </div>
      <div v-if="departureTarget">
        <p class="text-xs text-ink/50">Rencana keberangkatan</p>
        <p class="font-medium text-ink">{{ departureTarget }}</p>
      </div>
    </div>

    <div class="mt-8 overflow-x-auto">
      <table class="w-full min-w-[460px] text-sm">
        <thead>
          <tr class="border-b border-primary-100 text-left text-xs tracking-wider text-ink/50 uppercase">
            <th class="pb-3 font-semibold">Layanan</th>
            <th class="pb-3 text-right font-semibold">Per Jemaah</th>
            <th class="pb-3 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index" class="border-b border-primary-100/50">
            <td class="py-3 pr-4 text-ink/80">{{ item.label }}</td>
            <td class="py-3 text-right tabular-nums text-ink/70">{{ formatRupiah(item.perPaxAmount) }}</td>
            <td class="py-3 text-right font-medium tabular-nums text-ink">{{ formatRupiah(item.lineTotal) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-6 flex flex-col items-end gap-2 border-t border-primary-100 pt-6">
      <div class="flex w-full max-w-xs items-baseline justify-between">
        <span class="text-sm text-ink/60">Harga per jemaah</span>
        <span class="font-display text-lg font-semibold tabular-nums text-primary">{{ formatRupiah(perPaxTotal) }}</span>
      </div>
      <div class="flex w-full max-w-xs items-baseline justify-between">
        <span class="text-sm text-ink/60">Total {{ pax }} jemaah</span>
        <span class="font-display text-2xl font-bold tabular-nums text-primary">{{ formatRupiah(grandTotal) }}</span>
      </div>
    </div>

    <footer class="mt-8 space-y-1.5 border-t border-primary-100 pt-6 text-xs leading-relaxed text-ink/50">
      <p>Harga belum termasuk penerbangan pulang-pergi.</p>
      <p v-if="formatDate(validUntil)">Penawaran berlaku sampai {{ formatDate(validUntil) }}.</p>
      <p>Harga dapat berubah mengikuti ketersediaan hotel dan kurs pada saat pemesanan dikonfirmasi.</p>
    </footer>
  </article>
</template>

<style>
@media print {
  /* Halaman ini dicetak lewat dialog cetak bawaan peramban — tanpa pustaka PDF,
     tanpa Chromium di server. Sisanya disembunyikan agar hasilnya bersih. */
  body * { visibility: hidden; }
  .quote-doc, .quote-doc * { visibility: visible; }
  .quote-doc {
    position: absolute;
    inset: 0;
    margin: 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
  }
  @page { margin: 16mm; }
}
</style>

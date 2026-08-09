<script setup lang="ts">
/**
 * Isian rupiah yang menampilkan pemisah ribuan saat tidak sedang diketik.
 *
 * Tarif LPP berangka tujuh sampai delapan digit, dan satu nol yang hilang —
 * 1.150.000 menjadi 115.000 — hampir mustahil terlihat pada angka telanjang,
 * padahal kekeliruannya langsung masuk ke penawaran jemaah. Pemisah ribuan
 * membuatnya ketahuan sekilas.
 *
 * Saat difokus, isinya kembali jadi angka polos: memformat sambil orang
 * mengetik membuat kursor melompat-lompat, dan itu lebih menyebalkan daripada
 * manfaatnya.
 */
const model = defineModel<number | null>()

const props = defineProps<{
  id?: string
  ariaLabel?: string
}>()

const focused = ref(false)
const raw = ref('')

const formatter = new Intl.NumberFormat('id-ID')

const shown = computed(() => {
  if (focused.value) return raw.value
  return model.value === null || model.value === undefined ? '' : formatter.format(model.value)
})

function onFocus() {
  raw.value = model.value === null || model.value === undefined ? '' : String(model.value)
  focused.value = true
}

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  raw.value = value
  const digits = value.replace(/\D/g, '')
  model.value = digits ? Number(digits) : null
}

function onBlur() {
  focused.value = false
}
</script>

<template>
  <input
    :id="props.id"
    type="text"
    inputmode="numeric"
    autocomplete="off"
    placeholder="—"
    :aria-label="props.ariaLabel"
    :value="shown"
    class="w-full rounded-lg border border-primary-100 bg-background px-2.5 py-2 text-right text-sm text-ink tabular-nums outline-none focus:border-secondary-600"
    @focus="onFocus"
    @input="onInput"
    @blur="onBlur"
  >
</template>

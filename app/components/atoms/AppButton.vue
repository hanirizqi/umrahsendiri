<script setup lang="ts">
interface Props {
  to?: string
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'lg'
  /** Berlaku hanya saat dirender sebagai <button>. Default 'button' agar
      tidak ada tombol yang tanpa sengaja men-submit form di sekitarnya. */
  type?: 'button' | 'submit'
}

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  href: undefined,
  variant: 'primary',
  size: 'md',
  type: 'button',
})

const NuxtLink = resolveComponent('NuxtLink')
const tag = computed(() => (props.to ? NuxtLink : props.href ? 'a' : 'button'))

/**
 * Hanya tautan ke luar situs yang dibuka di tab baru.
 *
 * Sebelumnya setiap `href` mendapat `target="_blank"`, termasuk tautan seperti
 * `#form` yang menunjuk ke bagian lain pada halaman yang sama — dan itu membuka
 * salinan halaman di tab baru alih-alih menggulir.
 */
const isExternal = computed(() => Boolean(props.href && /^(https?:|mailto:|tel:)/.test(props.href)))

const variantClass = computed(() => ({
  primary: 'bg-primary text-background hover:bg-primary-700 shadow-soft',
  secondary: 'bg-secondary text-primary-700 hover:bg-secondary-700 shadow-soft',
  ghost: 'bg-transparent text-primary border border-primary/20 hover:border-primary/40',
}[props.variant]))

const sizeClass = computed(() => ({
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}[props.size]))
</script>

<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :type="tag === 'button' ? type : undefined"
    class="inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100"
    :class="[variantClass, sizeClass]"
  >
    <slot />
  </component>
</template>

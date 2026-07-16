<script setup lang="ts">
interface Props {
  title: string
  url: string
}

const props = defineProps<Props>()
const copied = ref(false)

const shareLinks = computed(() => {
  const encodedUrl = encodeURIComponent(props.url)
  const encodedTitle = encodeURIComponent(props.title)
  return [
    { label: 'WhatsApp', icon: 'lucide:message-circle', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: 'X', icon: 'lucide:twitter', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { label: 'Facebook', icon: 'lucide:facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
  ]
})

async function copyLink() {
  await navigator.clipboard.writeText(props.url)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <span class="text-xs font-medium text-ink/50">Bagikan:</span>
    <a
      v-for="share in shareLinks"
      :key="share.label"
      :href="share.href"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Bagikan ke ${share.label}`"
      class="flex size-9 items-center justify-center rounded-full border border-primary-100 text-primary/70 transition-colors hover:border-secondary-600/40 hover:text-primary"
    >
      <Icon :name="share.icon" class="size-4" />
    </a>
    <button
      type="button"
      aria-label="Salin tautan"
      class="flex size-9 items-center justify-center rounded-full border border-primary-100 text-primary/70 transition-colors hover:border-secondary-600/40 hover:text-primary"
      @click="copyLink"
    >
      <Icon :name="copied ? 'lucide:check' : 'lucide:link'" class="size-4" />
    </button>
  </div>
</template>

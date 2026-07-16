<script setup lang="ts">
interface Props {
  dark?: boolean
}

defineProps<Props>()
</script>

<template>
  <NuxtLink to="/" class="flex items-center gap-2 font-display text-lg font-bold" :class="dark ? 'text-background' : 'text-primary'">
    <NuxtImg
      :src="dark ? '/brand/icon-on-dark.png' : '/brand/icon-512.png'"
      alt=""
      class="size-8"
      width="32"
      height="32"
    />
    UmrahSendiri
  </NuxtLink>
</template>

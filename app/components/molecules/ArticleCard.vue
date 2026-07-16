<script setup lang="ts">
import type { ArticleSummary } from '~/types'

defineProps<{ article: ArticleSummary }>()
</script>

<template>
  <NuxtLink :to="article.path" class="group block overflow-hidden rounded-2xl border border-primary-100 bg-white/60 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
    <div class="aspect-[16/10] overflow-hidden bg-primary-50">
      <NuxtImg
        :src="article.image"
        :alt="article.title"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        width="480"
        height="300"
      />
    </div>
    <div class="p-6">
      <p class="text-xs font-semibold tracking-wide text-secondary-700 uppercase">{{ article.category }}</p>
      <h3 class="mt-2 font-display text-lg font-semibold text-primary">{{ article.title }}</h3>
      <p class="mt-2 line-clamp-2 text-sm text-ink/70">{{ article.description }}</p>
      <p class="mt-4 text-xs text-ink/50">{{ formatArticleDate(article.date) }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { SITE } from '~/constants/site'

const route = useRoute()

const { data: article } = await useAsyncData(`article-${route.path}`, () =>
  queryCollection('articles').path(route.path).first(),
)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
}

const { data: related } = useAsyncData(`related-${route.path}`, () =>
  queryCollection('articles')
    .where('category', '=', article.value!.category)
    .where('path', '<>', route.path)
    .order('date', 'DESC')
    .limit(3)
    .all(),
)

const readingTime = useReadingTime(() => extractPlainText(article.value?.body as never))
const pageUrl = computed(() => `${SITE.url}${route.path}`)

useSeoMeta({
  title: () => `${article.value?.title} — UmrahSendiri`,
  description: () => article.value?.description,
  ogTitle: () => article.value?.title,
  ogDescription: () => article.value?.description,
  ogImage: () => article.value ? `${SITE.url}${article.value.image}` : undefined,
})

useJsonLd({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: article.value?.title,
      description: article.value?.description,
      datePublished: article.value?.date,
      image: article.value ? [`${SITE.url}${article.value.image}`] : [],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE.url },
        { '@type': 'ListItem', position: 2, name: 'Artikel', item: `${SITE.url}/artikel` },
        { '@type': 'ListItem', position: 3, name: article.value?.title ?? '', item: pageUrl.value },
      ],
    },
  ],
})
</script>

<template>
  <div v-if="article">
    <article class="mx-auto max-w-3xl px-6 pt-16 pb-24 md:px-10">
      <NuxtLink to="/artikel" class="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-primary">
        <Icon name="lucide:arrow-left" class="size-4" />
        Kembali ke Artikel
      </NuxtLink>

      <p class="mt-6 text-xs font-semibold tracking-widest text-secondary-700 uppercase">
        {{ article.category }}
      </p>
      <h1 class="mt-3 text-3xl font-bold text-primary md:text-4xl">
        {{ article.title }}
      </h1>

      <div class="mt-4 flex flex-wrap items-center gap-3 text-xs text-ink/50">
        <span>{{ formatArticleDate(article.date) }}</span>
        <span>·</span>
        <span>{{ readingTime }}</span>
      </div>

      <div class="mt-8 overflow-hidden rounded-3xl bg-primary-50">
        <NuxtImg :src="article.image" :alt="article.title" class="aspect-[16/9] w-full object-cover" />
      </div>

      <div class="prose-content mt-10 max-w-none text-base leading-relaxed text-ink/80 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:space-y-2 [&_strong]:text-primary [&_strong]:font-semibold">
        <ContentRenderer :value="article" />
      </div>

      <div class="mt-10 flex flex-wrap gap-2">
        <span
          v-for="tag in article.tags"
          :key="tag"
          class="rounded-full border border-primary-100 px-3 py-1 text-xs text-ink/60"
        >
          #{{ tag }}
        </span>
      </div>

      <div class="mt-8 border-t border-primary-100 pt-8">
        <ShareButtons :title="article.title" :url="pageUrl" />
      </div>
    </article>

    <SectionContainer v-if="related?.length" tone="muted">
      <SectionHeading eyebrow="Baca Juga" title="Artikel Terkait" />
      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ArticleCard
          v-for="item in related"
          :key="item.path"
          :article="{
            path: item.path,
            title: item.title,
            description: item.description,
            date: item.date,
            category: item.category,
            tags: item.tags,
            image: item.image,
          }"
        />
      </div>
    </SectionContainer>

    <SectionContainer>
      <NewsletterSignup />
    </SectionContainer>
  </div>
</template>

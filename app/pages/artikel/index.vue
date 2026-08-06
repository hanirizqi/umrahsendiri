<script setup lang="ts">
useSeoMeta({
  title: 'Artikel — Panduan Umrah Mandiri',
  description: 'Kumpulan panduan dan wawasan seputar perencanaan umrah mandiri: biaya, dokumen, hotel, dan persiapan.',
})

const { data: articles } = useAsyncData('all-articles', () =>
  queryCollection('articles').order('date', 'DESC').all(),
)

const search = ref('')
const activeCategory = ref<string | null>(null)

const categories = computed(() => {
  const all = (articles.value ?? []).map(article => article.category)
  return Array.from(new Set(all))
})

const filteredArticles = computed(() => {
  const list = articles.value ?? []
  const query = search.value.trim().toLowerCase()

  return list.filter((article) => {
    const matchesQuery = !query
      || article.title.toLowerCase().includes(query)
      || article.description.toLowerCase().includes(query)
    const matchesCategory = !activeCategory.value || article.category === activeCategory.value
    return matchesQuery && matchesCategory
  })
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Artikel"
      title="Panduan dan Wawasan Umrah Mandiri"
      description="Ditulis dari pengalaman melayani jemaah mandiri — praktis dan tanpa basa-basi."
    />

    <SectionContainer>
      <div class="mx-auto max-w-3xl">
        <div class="relative">
          <Icon name="lucide:search" class="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/40" />
          <input
            v-model="search"
            type="search"
            placeholder="Cari artikel..."
            class="w-full rounded-full border border-primary-100 bg-white/60 py-3 pr-4 pl-11 text-sm text-ink outline-none focus:border-secondary-600"
          >
        </div>

        <div class="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            class="rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
            :class="!activeCategory ? 'border-primary bg-primary text-background' : 'border-primary-100 text-ink/60 hover:border-primary/40'"
            @click="activeCategory = null"
          >
            Semua
          </button>
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            class="rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
            :class="activeCategory === category ? 'border-primary bg-primary text-background' : 'border-primary-100 text-ink/60 hover:border-primary/40'"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div v-if="filteredArticles.length" class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ArticleCard
          v-for="article in filteredArticles"
          :key="article.path"
          :article="{
            path: article.path,
            title: article.title,
            description: article.description,
            date: article.date,
            category: article.category,
            tags: article.tags,
            image: article.image,
          }"
        />
      </div>
      <p v-else class="mt-16 text-center text-sm text-ink/50">
        Tidak ada artikel yang cocok dengan pencarian Anda.
      </p>
    </SectionContainer>
  </div>
</template>

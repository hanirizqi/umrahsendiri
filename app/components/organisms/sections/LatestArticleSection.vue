<script setup lang="ts">
const { data: articles } = useAsyncData('latest-articles', () =>
  queryCollection('articles').order('date', 'DESC').limit(3).all(),
)
</script>

<template>
  <SectionContainer v-if="articles?.length">
    <SectionHeading
      eyebrow="Artikel"
      title="Panduan dan Wawasan Umrah Mandiri Terbaru"
    />

    <div class="mt-16 grid gap-6 md:grid-cols-3">
      <ArticleCard
        v-for="article in articles"
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

    <div class="mt-12 text-center">
      <AppButton to="/articles" variant="ghost">
        Lihat Semua Artikel
        <Icon name="lucide:arrow-right" class="size-4" />
      </AppButton>
    </div>
  </SectionContainer>
</template>

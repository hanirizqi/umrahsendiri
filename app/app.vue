<script setup lang="ts">
import { SITE } from '~/constants/site'

const route = useRoute()

useSeoMeta({
  titleTemplate: title => (title ? `${title}` : `${SITE.name} — ${SITE.tagline}`),
  ogSiteName: SITE.name,
  ogType: 'website',
  ogImage: `${SITE.url}/og-default.png`,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: () => `${SITE.url}${route.path}` }],
})

useJsonLd({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/brand/icon-512.png`,
      sameAs: [SITE.instagram],
    },
    {
      '@type': 'WebSite',
      name: SITE.name,
      url: SITE.url,
    },
  ],
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="#c39a58" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

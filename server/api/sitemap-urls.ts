import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const articles = await queryCollection(event, 'articles').select('path', 'date').all()

  return articles.map(article => ({
    loc: article.path,
    lastmod: article.date,
  }))
})

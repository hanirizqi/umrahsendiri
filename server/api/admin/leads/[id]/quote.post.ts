export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID tidak valid.' })

  const { quote, missing } = await buildQuoteFromLead(useDb(), id)

  return { id: quote.id, quoteNumber: quote.quoteNumber, missing }
})

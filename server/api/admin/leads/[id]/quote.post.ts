export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID tidak valid.' })

  // Tanpa `force`, draf yang belum terkirim dibuka kembali alih-alih ditumpuk
  // dengan yang baru. Badan permintaan boleh kosong, jadi kegagalan membacanya
  // diperlakukan sebagai permintaan biasa.
  const body = await readBody<{ force?: unknown }>(event).catch(() => null)
  const force = body?.force === true

  const { quote, missing, reused } = await buildQuoteFromLead(useDb(), id, { force })

  return { id: quote.id, quoteNumber: quote.quoteNumber, missing, reused }
})

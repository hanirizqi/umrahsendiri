export default defineEventHandler(async (event) => {
  const session = await useInternalSession(event)
  await session.clear()
  return { ok: true }
})

const WORDS_PER_MINUTE = 200

export function useReadingTime(text: MaybeRefOrGetter<string>) {
  return computed(() => {
    const value = toValue(text) ?? ''
    const words = value.trim().split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))
    return `${minutes} menit baca`
  })
}

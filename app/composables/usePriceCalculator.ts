import { ADDON_RATE, HOTEL_RATE, OCCUPANCY_LABEL, PAKET_DASAR_RATE, type HotelTier, type Occupancy } from '~/constants/pricingRates'

export interface QuoteLineItem {
  label: string
  perJemaah: number
  total: number
  note?: string
}

export function usePriceCalculator() {
  const rawMessage = ref('')

  const parsed = reactive({
    pax: null as number | null,
    paketDasar: false,
    hotel: false,
    hotelStar: null as HotelTier | null,
    nightsMakkah: null as number | null,
    nightsMadinah: null as number | null,
    handlingBandara: false,
    pembimbing: false,
    pembimbingDays: null as number | null,
    jabalKhandamah: false,
    cityTour: false,
  })

  function parseMessage() {
    const text = rawMessage.value

    const paxMatch = text.match(/berangkat (\d+) orang/i)
    parsed.pax = paxMatch ? Number(paxMatch[1]) : null

    const needsMatch = text.match(/Kebutuhan:\s*([^.]+)\./i)
    const needsText = needsMatch ? needsMatch[1] : text

    parsed.paketDasar = /Paket Dasar/i.test(needsText)
    parsed.hotel = /Hotel/i.test(needsText)
    const starMatch = needsText.match(/Hotel Bintang (\d)/i)
    parsed.hotelStar = starMatch ? (Number(starMatch[1]) as HotelTier) : null

    const nightsMakkahMatch = needsText.match(/(\d+)\s*malam Makkah/i)
    parsed.nightsMakkah = nightsMakkahMatch ? Number(nightsMakkahMatch[1]) : null
    const nightsMadinahMatch = needsText.match(/(\d+)\s*malam Madinah/i)
    parsed.nightsMadinah = nightsMadinahMatch ? Number(nightsMadinahMatch[1]) : null

    parsed.handlingBandara = /Handling Bandara PP/i.test(needsText)
    parsed.pembimbing = /Pemandu\s*\/\s*Pembimbing/i.test(needsText)
    const pembimbingDaysMatch = needsText.match(/Pemandu\s*\/\s*Pembimbing[^(]*\((\d+)\s*hari\)/i)
    parsed.pembimbingDays = pembimbingDaysMatch ? Number(pembimbingDaysMatch[1]) : null

    parsed.jabalKhandamah = /Jabal Khandamah/i.test(needsText)
    parsed.cityTour = /City Tour/i.test(needsText)
  }

  const occupancy = computed<Occupancy | null>(() => {
    if (!parsed.pax || parsed.pax < 1) return null
    return Math.min(parsed.pax, 4) as Occupancy
  })

  const isOverCapacity = computed(() => Boolean(parsed.pax && parsed.pax > 4))

  const quote = computed(() => {
    const pax = parsed.pax
    const occ = occupancy.value
    if (!pax || !occ) return null

    const items: QuoteLineItem[] = []

    if (parsed.paketDasar) {
      const rate = PAKET_DASAR_RATE[occ]
      items.push({ label: `Paket Dasar (${OCCUPANCY_LABEL[occ]})`, perJemaah: rate, total: rate * pax })
    }

    if (parsed.hotel) {
      if (!parsed.hotelStar || !parsed.nightsMakkah || !parsed.nightsMadinah) {
        items.push({ label: 'Hotel', perJemaah: 0, total: 0, note: 'Info tier bintang atau jumlah malam tidak terbaca lengkap di pesan.' })
      }
      else {
        const tier = HOTEL_RATE[parsed.hotelStar]
        const makkahTotal = tier.makkah[occ] * parsed.nightsMakkah
        const madinahTotal = tier.madinah[occ] * parsed.nightsMadinah
        items.push({ label: `Hotel Makkah Bintang ${parsed.hotelStar} (${parsed.nightsMakkah} malam)`, perJemaah: makkahTotal, total: makkahTotal * pax })
        items.push({ label: `Hotel Madinah Bintang ${parsed.hotelStar} (${parsed.nightsMadinah} malam)`, perJemaah: madinahTotal, total: madinahTotal * pax })
      }
    }

    if (parsed.handlingBandara) {
      const rate = ADDON_RATE.handlingBandara.rate[occ]
      items.push({ label: ADDON_RATE.handlingBandara.label, perJemaah: rate, total: rate * pax })
    }

    if (parsed.pembimbing) {
      const days = parsed.pembimbingDays || 1
      const rate = ADDON_RATE.pembimbing.rate[occ] * days
      items.push({ label: `${ADDON_RATE.pembimbing.label} (${days} hari)`, perJemaah: rate, total: rate * pax })
    }

    if (parsed.jabalKhandamah) {
      const rate = ADDON_RATE.jabalKhandamah.rate[occ]
      items.push({ label: ADDON_RATE.jabalKhandamah.label, perJemaah: rate, total: rate * pax })
    }

    if (parsed.cityTour) {
      const rate = ADDON_RATE.cityTour.rate[occ]
      items.push({ label: ADDON_RATE.cityTour.label, perJemaah: rate, total: rate * pax })
    }

    const perJemaahTotal = items.reduce((sum, item) => sum + item.perJemaah, 0)
    const grandTotal = items.reduce((sum, item) => sum + item.total, 0)

    return { items, perJemaahTotal, grandTotal, pax }
  })

  return { rawMessage, parsed, occupancy, isOverCapacity, quote, parseMessage }
}

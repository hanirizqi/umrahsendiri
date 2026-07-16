# UmrahSendiri — Strategy & Design Foundation

## 1. UX Research

### Personas

**1. Rina, 32 — Digital marketer, Jakarta**
Sudah pernah umrah lewat travel dulu, merasa paket terlalu kaku dan mahal karena banyak "titipan" biaya tak jelas. Terbiasa mengatur perjalanan sendiri (self-drive trip ke Jepang, Eropa). Ingin kontrol penuh atas itinerary tapi butuh kepastian teknis: visa, hotel dekat Masjidil Haram, transportasi antar kota.

**2. Pak Yusuf & Bu Sarah, 45–50 — Pasangan, pengusaha kecil**
Baru pertama kali umrah. Tech-savvy secukupnya (WhatsApp, Instagram, transfer bank). Takut salah pilih hotel/travel abal-abal. Butuh pendamping yang bisa dipercaya tapi tetap merasa "ini perjalanan kami sendiri", bukan rombongan.

**3. Fajar, 28 — Software engineer remote, backpacker Muslim**
Terbiasa booking sendiri (Skyscanner, Booking.com). Melihat umrah sebagai perjalanan spiritual yang personal, bukan wisata rombongan. Butuh estimasi biaya akurat dan checklist, bukan paket jadi.

### Jobs-to-be-Done
- "Bantu saya menyusun rencana umrah yang jelas, tanpa saya harus jadi ahli logistik Timur Tengah."
- "Yakinkan saya bahwa keputusan tetap di tangan saya, bukan didikte agen."
- "Beri saya angka pasti — biaya, jadwal, dokumen — sebelum saya berangkat."

### Trust Barriers (yang harus dipatahkan di 5 detik pertama)
1. Kesan "travel abal-abal" — dipatahkan lewat visual premium, bukan banner promo.
2. Takut ditipu soal biaya — dipatahkan lewat transparansi estimasi biaya & pricing jelas.
3. Bingung beda "planner" vs "travel agent" — harus dijelaskan literally di atas fold.
4. Ragu apakah cocok untuk pemula (bukan hanya backpacker berpengalaman) — perlu benefit yang inklusif.

### Key Insight
Target market ini sudah terbiasa self-service (self-drive, self-book) di domain lain, tapi umrah terasa berisiko tinggi karena dimensi spiritual + teknis (visa, mahram, lokasi ibadah). Mereka tidak butuh orang yang "mengambil alih", mereka butuh **co-pilot** yang membuat kompleksitas jadi rencana yang jelas.

---

## 2. Positioning

**Positioning statement:**
> UmrahSendiri adalah *umrah mandiri planner* — partner perencanaan yang membantu Anda menyusun itinerary, estimasi biaya, hotel, transportasi, dan checklist umrah sendiri, tanpa paket jadi dan tanpa mengambil alih keputusan Anda.

**Bukan / Adalah:**
| Bukan | Adalah |
|---|---|
| Biro travel | Partner perencanaan |
| Jual paket | Susun rencana bersama |
| Rombongan | Perjalanan personal |
| Agen yang memutuskan | Anda yang memutuskan |

**Messaging pillars:**
1. **Kontrol di tangan Anda** — setiap keputusan (hotel, jadwal, transportasi) adalah pilihan jamaah.
2. **Kejelasan sejak awal** — estimasi biaya dan itinerary transparan, tanpa biaya tersembunyi.
3. **Ditemani, bukan digiring** — konsultasi tersedia kapan dibutuhkan, tidak memaksa paket.
4. **Siap secara teknis dan mental** — checklist dan panduan yang membuat persiapan terasa terkendali.

**Tone of voice:** tenang, presisi, hormat — seperti konsultan yang dipercaya, bukan sales. Hindari superlativa murahan (PROMO, TERMURAH, BURUAN).

---

## 3. Sitemap

```
/                      Home
/tentang               Tentang (cerita, misi, tim)
/layanan               Layanan (itinerary, biaya, hotel, transport, checklist, konsultasi)
/cara-kerja            Cara Kerja (proses 4 langkah)
/artikel               Blog listing (search, kategori, tag)
/artikel/[slug]        Artikel detail
/faq                   FAQ lengkap
/kontak                Kontak + form + WhatsApp
/mulai                 Landing Ads (distraction-free, conversion-only)
/privacy-policy        Privacy Policy
/terms                 Terms of Service
/[...slug]             404
```

---

## 4. Wireframe (block-level)

### Home
1. **Hero** — eyebrow badge ("Umrah Mandiri Planner") + headline ≤10 kata + subheadline ≤30 kata + 2 CTA (Konsultasi Gratis / Lihat Cara Kerja) + glass stat card (jamaah dibantu, rating, tahun pengalaman) mengambang di atas hero image.
2. **Social Proof** — strip logo/press + rating ringkas.
3. **Problem** — 3 pain point umrah mandiri tanpa panduan (biaya tak jelas, salah pilih hotel, dokumen ribet).
4. **Solution** — reframe: UmrahSendiri sebagai co-pilot, bukan pengambil alih.
5. **Benefit** — grid 4 kartu (kontrol penuh, transparansi biaya, pendampingan ahli, checklist lengkap).
6. **Cara Kerja** — 4 langkah horizontal/stepper (Konsultasi → Susun Rencana → Persiapan → Berangkat).
7. **Layanan** — grid 6 layanan (itinerary, estimasi biaya, hotel, transportasi, checklist, konsultasi).
8. **Pricing** — 4 tier (Starter, Personal, Family, Enterprise) kartu netral, tanpa "termurah".
9. **Testimonial** — carousel/grid kutipan jamaah, tanpa foto stok berlebihan.
10. **FAQ** — accordion 6 pertanyaan inti.
11. **Latest Article** — 3 artikel terbaru.
12. **CTA** — penutup ajakan konsultasi + WhatsApp.
13. **Footer** — nav, kontak, legal, sosial.

### Landing Ads (`/mulai`)
1. Hero singkat + 1 CTA utama (WhatsApp).
2. Problem → Pain (agitate, singkat).
3. Solution + benefit ringkas (3 poin).
4. FAQ singkat (3–4).
5. CTA penutup.
6. Sticky bottom CTA bar (mobile) + floating WhatsApp button.
No header nav, no footer nav, no exit links selain WhatsApp.

---

## 5. Design System

### Color tokens
| Token | Hex | Usage |
|---|---|---|
| `primary` | `#123C32` | Text utama, tombol primer, ikon |
| `secondary` | `#C39A58` | Aksen emas, border highlight, hover |
| `background` | `#FAF8F5` | Latar halaman |
| `dark` | `#0D2823` | Section gelap, footer, hero overlay |
| `text` | `#17322D` | Body text |

Gradient dipakai sangat tipis (radial gold 4–8% opacity di hero saja). Glassmorphism: `background: rgba(255,255,255,0.55)` + `backdrop-blur-xl` + border `rgba(255,255,255,0.4)`.

### Typography
- Display/Heading: **Manrope** (600–800)
- Body/UI: **DM Sans** (400–500)
- Scale: `text-6xl/7xl` hero, `text-4xl/5xl` H2, `text-2xl` H3, `text-base/lg` body, tracking tight di heading besar.

### Spacing / Radius / Shadow
- Section padding: `py-24 md:py-32`, container max-width `1280px`.
- Radius: `rounded-2xl`–`rounded-3xl` (XL rounded) untuk card, `rounded-full` untuk button/badge.
- Shadow: soft, `shadow-[0_8px_30px_rgba(18,60,50,0.08)]`, tanpa shadow tajam.

### Motion
- Fade-up on scroll (subtle, 400ms, ease-out), hover scale 1.02 pada card, no bounce/elastic easing.

---

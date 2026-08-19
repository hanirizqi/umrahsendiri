# Pricing (Public / Customer-Facing)

> **Sebelum mengubah angka apa pun di sini, baca [PRICING_RULES.md](PRICING_RULES.md).** Satuan wajib dinyatakan, dan `npm run rates:verify` harus lolos sebelum push.

> **Data safety note:** this file contains only public sell prices and facilities. It intentionally excludes wholesale cost, markup %, and margin — those live in an internal backoffice spreadsheet outside this repo and must never be committed here.
>
> Prices change monthly. Current version: **Periode September 2026**. Confirm with the business owner before trusting this file if it looks stale — it is updated manually, not synced automatically. Source: LPP (Land Package Private) document, `Umrah_Sendiri_LPP_September2026_*.docx`.

## Pricing Model

Since September 2026 the LA package is fully modular, priced in three independent components that the customer combines themselves. There is no more single bundled "per tier per okupansi" price — total price = **Paket Dasar + Hotel per Malam (if any) + Layanan Tambahan (if any)**.

1. **Paket Dasar** (mandatory, one component, same price at every hotel tier including Tanpa Hotel)
2. **Hotel per Malam** (optional — omit entirely for "Tanpa Hotel"; customer picks tier + number of nights in Makkah and Madinah independently)
3. **Layanan Tambahan / Add-On** (optional, purchased separately)

## 1. Paket Dasar — Harga per Jemaah (wajib, satu kesatuan)

| Okupansi | Harga per Jemaah | Total |
|---|---|---|
| Sendiri (1 Pax) | Rp11.500.000 | Rp11.500.000 |
| Berdua (2 Pax) | Rp7.350.000 | Rp14.700.000 |
| Bertiga (3 Pax) | Rp6.566.667 | Rp19.700.000 |
| Berempat (4 Pax) | Rp5.750.000 | Rp23.000.000 |

Termasuk: Transportasi 3 Rute (Bandara Jeddah–Makkah Hotel/kedatangan, Makkah Hotel–Madinah Hotel, Madinah Hotel–Bandara Jeddah/kepulangan), Paket Dokumen Wajib (Visa Umrah, Siskopatuh, Asuransi Kesehatan Arab Saudi), Pembimbing Umrah + Manasik Online (1x pelaksanaan umrah). Tidak termasuk tiket pesawat PP.

Paket Dasar adalah satu kesatuan dan tidak dapat dipisah atau dibeli sebagian — berlaku sama di semua tier hotel, termasuk **Tanpa Hotel** (jemaah yang sudah punya akomodasi sendiri cukup bayar harga Paket Dasar ini, tanpa komponen hotel).

## 2. Hotel per Malam — Harga per Jemaah, per Malam (opsional)

Hotel periode September 2026 — sumber: dokumen resmi LA Basic Private September 2026 dari Musafirin (diterima 2026-08-19), menggantikan estimasi hotel sebelumnya:

| Tier | Kota | Hotel | Jarak dari Masjid |
|---|---|---|---|
| Bintang 3 | Makkah | ★★★☆☆ Grand Al Massa | ±450-550 m dari Masjidil Haram |
| Bintang 3 | Madinah | ★★★☆☆ Kingsgate Durrat | ±300-500 m dari Masjid Nabawi |
| Bintang 4 | Makkah | ★★★★☆ Maysan Al Mashaer | ±300 m dari Masjidil Haram |
| Bintang 4 | Madinah | ★★★★☆ Kingsgate Deyar | ±700-900 m dari Masjid Nabawi |
| Bintang 5 | Makkah | ★★★★★ Movenpick Hajar | ±100-300 m dari Masjidil Haram |
| Bintang 5 | Madinah | ★★★★★ Venue Al Harithia | ±350 m dari Masjid Nabawi |

Harga **per jemaah**, per malam — inilah angka yang dipakai sistem dan yang muncul di penawaran jemaah:

| Tier | Kota | Sendiri | Berdua | Bertiga | Berempat |
|---|---|---|---|---|---|
| Bintang 3 | Makkah | Rp2.700.000 | Rp1.350.000 | Rp1.000.000 | Rp825.000 |
| Bintang 3 | Madinah | Rp3.450.000 | Rp1.725.000 | Rp1.183.333 | Rp950.000 |
| Bintang 4 | Makkah | Rp3.400.000 | Rp1.700.000 | Rp1.283.333 | Rp1.087.500 |
| Bintang 4 | Madinah | Rp3.300.000 | Rp1.650.000 | Rp1.200.000 | Rp987.500 |
| Bintang 5 | Makkah | Rp6.750.000 | Rp3.375.000 | Rp2.666.667 | Rp2.200.000 |
| Bintang 5 | Madinah | Rp5.500.000 | Rp2.750.000 | Rp2.083.333 | Rp2.012.500 |

Sudah termasuk makan 3x sehari. Sendiri = kamar yang sama dengan Berdua, ditanggung 1 orang (single supplement) — karena itu **kolom Sendiri tepat dua kali lipat kolom Berdua**. Nilai per jemaah dibulatkan ke Rupiah terdekat saja (bukan ke kelipatan Rp5.000) — lihat entri 2026-08-04 di `docs/CHANGELOG.md`.

### Total kamar per malam (untuk rekonsiliasi, bukan untuk dikutip ke jemaah)

Angka di bawah ini = harga per jemaah × jumlah jemaah. Dipakai hanya untuk mencocokkan dengan total bundel 9 hari di dokumen resmi Musafirin, yang memang dihitung per rombongan.

| Tier | Kota | Sendiri | Berdua | Bertiga | Berempat |
|---|---|---|---|---|---|
| Bintang 3 | Makkah | Rp2.700.000 | Rp2.700.000 | Rp3.000.000 | Rp3.300.000 |
| Bintang 3 | Madinah | Rp3.450.000 | Rp3.450.000 | Rp3.550.000 | Rp3.800.000 |
| Bintang 4 | Makkah | Rp3.400.000 | Rp3.400.000 | Rp3.850.000 | Rp4.350.000 |
| Bintang 4 | Madinah | Rp3.300.000 | Rp3.300.000 | Rp3.600.000 | Rp3.950.000 |
| Bintang 5 | Makkah | Rp6.750.000 | Rp6.750.000 | Rp8.000.000 | Rp8.800.000 |
| Bintang 5 | Madinah | Rp5.500.000 | Rp5.500.000 | Rp6.250.000 | Rp8.050.000 |

> **Jangan tertukar.** Yang masuk ke `/admin/rates` dan ke penawaran jemaah adalah tabel **per jemaah** di atas, bukan tabel total kamar ini. Sistem menghitung `tarif × jumlah malam × jumlah jemaah`, jadi memasukkan total kamar akan melipatgandakan harga sebanyak jumlah jemaah — untuk Berempat, empat kali lipat.

**Catatan transparansi rate:** rate Makkah (Grand Al Massa, Maysan Al Mashaer, Movenpick Hajar) terkonfirmasi langsung dari brosur rekanan. Rate Madinah (Kingsgate Durrat, Kingsgate Deyar, Venue Al Harithia) belum ada brosur per-malam terpisah — diturunkan (derived) dari total paket resmi 9 hari (4 malam Makkah + 3 malam Madinah) dikurangi komponen Makkah dan Paket Dasar, lalu dibagi 3 malam. Perlu konfirmasi rate resmi per-malam dari rekanan saat brosur baru tersedia.

## 3. Layanan Tambahan / Add-On — Harga per Jemaah (opsional)

| Layanan | Sendiri | Berdua | Bertiga | Berempat |
|---|---|---|---|---|
| Handling Bandara PP | Rp650.000 | Rp650.000 | Rp650.000 | Rp650.000 |
| Pemandu / Pembimbing (per hari, maks. 9 jam) | Rp1.400.000 | Rp700.000 | Rp475.000 | Rp350.000 |
| Transport Jabal Khandamah PP | Rp1.000.000 | Rp500.000 | Rp350.000 | Rp250.000 |
| City Tour Makkah (paket) | Rp3.550.000 | Rp1.800.000 | Rp1.300.000 | Rp950.000 |

- Handling Bandara PP: tarif flat per pax (rekanan Mas Akbar, per 2026-08-04), sudah termasuk makan kedatangan & kepulangan serta zamzam kepulangan.
- City Tour Makkah destinasi: Jabal Tsur, Arafah, Jabal Rahmah, Muzdalifah, Mina, Jabal Nur, Museum Wahyu.
- Transport Jabal Khandamah PP dan City Tour Makkah menggunakan driver berbahasa Inggris, tanpa pembimbing/pendamping.
- Visa Umrah juga tersedia sebagai layanan stand-alone/add-on untuk rombongan besar (harga tergantung total pax rombongan) — belum dipublikasikan, konfirmasi syarat terkini dengan pemilik bisnis sebelum dipublikasikan.
- Untuk rombongan lebih dari 4 orang, silakan hubungi tim untuk penyesuaian harga (semua tabel di atas hanya sampai Berempat).

## Fasilitas Termasuk — Paket Dengan Hotel

- Transportasi 3 Rute (lihat Paket Dasar)
- Makan 3x sehari
- Hotel Makkah & Madinah sesuai tier yang dipilih
- Paket Dokumen Wajib (Visa Umrah, Siskopatuh, dan Asuransi Kesehatan Arab Saudi)
- Pembimbing Umrah + Manasik Online (termasuk untuk 1x pelaksanaan umrah)

## Fasilitas Termasuk — Tanpa Hotel / Sendiri Tanpa Hotel

Sama seperti Paket Dasar di atas, MINUS Hotel dan MINUS Makan (makan adalah fasilitas yang terikat ke hotel).

## Tidak Termasuk (semua paket)

- Tiket pesawat PP
- Hotel & Layanan Tambahan (tersedia sebagai komponen/add-on opsional, lihat di atas)
- Perlengkapan & pengeluaran pribadi
- Vaksin Meningitis

## Related

- Terminology rules: `docs/GLOSSARY.md`
- Brand voice & contact: `docs/BRAND.md`
- Full customer-facing document: LPP `PRICE LIST/2026/September/Umrah_Sendiri_LPP_September2026_*.docx` (outside this repo)

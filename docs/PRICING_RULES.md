# Aturan Menulis Harga

Wajib dibaca sebelum menulis atau mengubah angka harga di mana pun — `docs/PRICING.md`,
`server/database/rates/`, spreadsheet backoffice, atau jawaban ke jemaah.

Berlaku untuk siapa pun, termasuk sesi chat yang menyusun dokumen LPP tanpa akses
ke kode dan database.

## Satuan harus dinyatakan, selalu

Setiap tabel harga wajib menyebut satuannya di judul: **per jemaah** atau **per kamar**.
Tanpa itu, angka yang sah tetap bisa salah tempat, dan tidak ada error yang muncul.

Sistem menghitung penawaran dengan rumus:

```
total baris = tarif × jumlah malam × jumlah jemaah
```

Jadi yang masuk ke database **selalu harga per jemaah**. Memasukkan harga kamar
melipatgandakan penawaran sebanyak jumlah jemaah — rombongan berempat membayar
empat kali lipat.

## Uji yang wajib lolos

**Sendiri = 2 × Berdua, untuk hotel.** Sendiri menempati kamar yang sama dengan
Berdua, ditanggung satu orang. Kalau tarifnya per jemaah, kolom Sendiri persis dua
kali kolom Berdua.

Kalau Sendiri **sama dengan** Berdua, yang tertulis harga kamar. Bagi dengan
jumlah jemaah sebelum dipakai.

**Angka per jemaah menurun seiring bertambahnya rombongan.** Transport, kamar, dan
dokumen ditanggung bersama, jadi per orang makin murah. Angka yang naik hampir
selalu berarti harga rombongan atau harga kamar.

**Total kamar dipakai hanya untuk rekonsiliasi.** Dokumen pemasok memberi total
bundel per rombongan, jadi mencocokkannya memang perlu total kamar. Simpan sebagai
tabel terpisah dengan judul yang jelas — jangan pernah menaruhnya di bawah judul
"per jemaah".

Pemeriksaan ini **berjalan sendiri sebagai bagian dari `npm run build`**, jadi juga
saat deploy. Tarif yang satuannya tertukar membuat build gagal dan produksi tetap
memakai tarif lama yang benar — tidak ada jalan bagi angka keliru untuk sampai ke
jemaah lewat deploy.

Bisa dijalankan sendiri kapan saja:

```bash
npm run rates:verify
```

Ia juga mencetak total kamar supaya bisa dicocokkan dengan dokumen pemasok.

## Data biaya tidak boleh masuk repo

Harga modal dari pemasok, markup, dan margin **tidak pernah** ditulis di repo ini —
tidak di `docs/`, tidak di `server/database/rates/`, tidak di komentar kode.
Tempatnya di spreadsheet backoffice, di luar repo. Yang boleh di sini hanya harga
jual publik.

## Ke mana mengirim LPP baru

**Kirim dokumen LA-nya ke sesi code (`</>`), bukan sesi chat.** Sesi code bisa
membaca PDF-nya, mengubah ke harga per jemaah, memverifikasinya terhadap tarif yang
sedang berjalan di database, lalu memperbarui `rates/` dan `docs/PRICING.md`
sekaligus dalam satu jalur. Sesi chat tidak bisa memeriksa dirinya sendiri terhadap
sistem — kekeliruan 19 Agustus 2026 lolos justru karena itu.

Sesudah `docs/PRICING.md` diperbarui dan ter-push, **sesi chat memakainya sebagai
sumber** untuk menyusun dokumen LPP pelanggan dan spreadsheet backoffice. Arahnya
satu: dokumen resmi → sesi code → repo → sesi chat. Bukan sebaliknya.

## Cara memasukkan LPP baru

1. Tambah berkas di `server/database/rates/`, contoh `2026-10.ts`, isinya harga
   **per jemaah**
2. Daftarkan di `server/database/rates/index.ts`
3. `npm run rates:verify` — harus lolos
4. Perbarui `docs/PRICING.md` supaya dokumen publik ikut sesuai
5. Push. Deploy memasukkannya sendiri; tidak perlu menyentuh `/admin/rates`

Periode yang **sudah ada tarifnya tidak pernah ditimpa**. Mengubah angka di
`rates/` untuk periode yang terlanjur ada tidak berpengaruh — perbaikannya lewat
`/admin/rates`. Berkas di folder itu untuk memasukkan periode baru, bukan
menyunting yang lama.

## Kenapa aturan ini ada

19 Agustus 2026, tabel harga kamar hampir masuk sebagai harga per jemaah. Angkanya
benar, satuannya tertukar, dan judulnya berbunyi "Harga per Jemaah". Kalau lolos,
penawaran Bintang 3 untuk empat jemaah menjadi Rp30.350.000 per orang alih-alih
Rp11.900.000 — hampir tiga kali lipat, terkirim ke jemaah tanpa satu pun error
muncul di mana pun.

Tertangkap karena satu hotel kebetulan tidak berganti: Bintang 5 Makkah. Tarif per
jemaahnya yang lama dikalikan jumlah jemaah menghasilkan angka baru itu persis
sampai rupiah. Kebetulan seperti itu tidak bisa diandalkan — karena itu
pemeriksaannya sekarang otomatis.

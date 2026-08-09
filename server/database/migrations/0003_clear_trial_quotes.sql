-- Membersihkan penawaran uji coba sebelum operasional dimulai.
--
-- Seluruh penawaran yang ada dibuat saat menguji panel admin, sebagian sebagai
-- duplikat karena tombol "Create Quote" dulu selalu menyisipkan baris baru.
-- Belum ada satu pun yang pernah dikirim ke jemaah sungguhan, jadi tidak ada
-- catatan yang hilang.
--
-- Migrasi ini sengaja tidak menyentuh tabel leads. Nomor HP dan atribusi iklan
-- di sana adalah data yang tidak bisa dibuat ulang, dan tidak ada hubungannya
-- dengan penawaran yang dihapus di sini.
--
-- Pada database yang baru dibuat, ketiga pernyataan di bawah tidak mengubah apa
-- pun karena memang belum ada barisnya.

-- quote_items mereferensikan quotes dengan ON DELETE CASCADE, tapi dihapus
-- lebih dulu secara eksplisit supaya maksudnya terbaca dari migrasi ini sendiri.
DELETE FROM "quote_items";
--> statement-breakpoint
DELETE FROM "quotes";
--> statement-breakpoint
-- Pencacah penawaran ikut dinolkan supaya penomoran mulai bersih dari
-- PW-YYYY-0001. Aman justru karena tidak ada nomor lama yang pernah sampai ke
-- tangan jemaah. Pencacah lead sengaja dibiarkan — leadnya tidak dihapus, dan
-- nomornya harus tetap melanjutkan urutan.
DELETE FROM "document_counters" WHERE "scope" = 'quote';

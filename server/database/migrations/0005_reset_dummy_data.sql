-- Menghapus seluruh data uji coba sebelum operasional dimulai.
--
-- Semua lead, penawaran, dan kontak yang ada dibuat sewaktu membangun dan
-- menguji panel admin. Belum ada satu pun jemaah sungguhan, jadi tidak ada
-- catatan bisnis yang hilang di sini.
--
-- Katalog layanan, periode tarif, dan tarif LPP sengaja tidak disentuh: itu
-- data acuan, bukan data uji coba, dan diisi ulang sendiri oleh penyemai saat
-- aplikasi start.
--
-- Pada database yang baru dibuat, semua pernyataan di bawah tidak mengubah apa
-- pun karena memang belum ada barisnya.

-- Urutannya mengikuti arah foreign key: yang merujuk dihapus lebih dulu.
DELETE FROM "quote_items";
--> statement-breakpoint
DELETE FROM "quotes";
--> statement-breakpoint
DELETE FROM "lead_service_selections";
--> statement-breakpoint
DELETE FROM "leads";
--> statement-breakpoint
DELETE FROM "contacts";
--> statement-breakpoint
-- Pencacah dikosongkan seluruhnya supaya penomoran mulai bersih dari
-- LD-YYYY-0001 dan PW-YYYY-0001. Aman justru karena tidak ada nomor lama yang
-- pernah sampai ke tangan siapa pun.
DELETE FROM "document_counters";

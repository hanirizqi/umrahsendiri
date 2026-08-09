CREATE TABLE "document_counters" (
	"scope" text NOT NULL,
	"year" integer NOT NULL,
	"value" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "document_counters_scope_year_pk" PRIMARY KEY("scope","year")
);
--> statement-breakpoint
-- Memindahkan nomor tertinggi yang sudah terpakai ke pencacah, supaya penomoran
-- melanjutkan urutan yang ada. Tanpa ini pencacah mulai dari nol dan nomor
-- berikutnya menabrak nomor yang sudah tercetak di dokumen lama.
--
-- Format nomornya tetap: LD-YYYY-NNNN dan PW-YYYY-NNNN, jadi tahun ada di posisi
-- 4-7 dan urutannya mulai posisi 9. Baris yang tidak berformat itu dilewati.
INSERT INTO "document_counters" ("scope", "year", "value")
SELECT 'lead', "year", MAX("seq")
FROM (
	SELECT
		substring("lead_number" from 4 for 4)::int AS "year",
		substring("lead_number" from 9)::int AS "seq"
	FROM "leads"
	WHERE "lead_number" ~ '^LD-\d{4}-\d+$'
) AS parsed
GROUP BY "year"
ON CONFLICT ("scope", "year") DO NOTHING;
--> statement-breakpoint
INSERT INTO "document_counters" ("scope", "year", "value")
SELECT 'quote', "year", MAX("seq")
FROM (
	SELECT
		substring("quote_number" from 4 for 4)::int AS "year",
		substring("quote_number" from 9)::int AS "seq"
	FROM "quotes"
	WHERE "quote_number" ~ '^PW-\d{4}-\d+$'
) AS parsed
GROUP BY "year"
ON CONFLICT ("scope", "year") DO NOTHING;

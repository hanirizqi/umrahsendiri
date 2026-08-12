# Changelog

Record notable project changes.

## 2026-08-12 — the Google Ads account was never ours, and the build stopped being reproducible

- **Google tag switched to `GT-KFH6S89B` / `AW-18372297695`.** The ads team confirmed `AW-18371371265` was never their account. Both conversion labels had to be reissued, not just the WhatsApp one the team asked about: a label belongs to an account, so the change silently killed the contact-form conversion that had been running since the start. Form is Primary and optimised against; WhatsApp click is Secondary, counted once per person.
- **Image optimisation switched off (`image: { provider: 'none' }`).** Deployment failed with `Cannot find package 'ipx'` at the prerender step while `npm install` reported success — `ipx` is only an *optionalDependency* of `@nuxt/image`, and npm skips an optional dependency that fails to install without a word. It needs `sharp`, which downloads its own binary during install, and the same build could not reach `fonts.googleapis.com` either. All five `NuxtImg` uses point at local files of 27–89 KB with fixed dimensions, so IPX was contributing little beyond webp conversion — a small price for a build that no longer depends on a native module fetching binaries at install time. Reverting means declaring `ipx` a real dependency (so failure is loud) and fixing the build server's outbound network.
- **Verified in production:** old account absent, both labels present, all images resolve without `/_ipx/`, 20 font files downloaded locally. First real lead came through as `LD-2026-0001`, confirming the dummy-data reset and the document counter both worked on the server.

## 2026-08-09 — LPP rates move into the admin panel

- **`docs/PRICING.md` is no longer the operational source for rates, and neither is `server/database/seed.ts`.** Rates are now managed at `/admin/rates`: one period per LPP release, created by copying the previous period and adjusting what changed. Seeding only supplies a period that has no rates at all, so a brand-new database still comes up able to quote while panel edits survive every deploy. `docs/PRICING.md` remains the public-facing price document.
- **Period structure is no longer fixed.** Services can be added or dropped per period, and hotel star ratings are not locked to 3–5 — a period offering only 2-star accommodation is valid. Publishing is blocked on a period with no rates, and new periods are always created unpublished so half-finished amounts can never reach a jemaah's quote.
- **`services.category`** (`inti` / `akomodasi` / `tambahan`) added so the rate screen groups by data rather than by a guess made in the template. New services default to `tambahan`. The hotel service name was split: `Hotel` as the name, "Termasuk makan 3x sehari." as the description.

## 2026-08-08 — data-layer defects that surfaced as rows that should not exist

- **Document numbers no longer come from `count(*) + 1`.** The number column is UNIQUE, so hard-deleting one row made the next insert reuse a taken number and fail, stopping quoting entirely; concurrent requests collided the same way. Numbers now come from `document_counters`. Applies to both `LD-` and `PW-`.
- **"Create Quote" stopped stacking duplicates.** It returns the existing unsent draft instead of inserting another row; a shared quote is never reused, and an explicit New Revision covers a genuine second version. Quote status became editable, and sending on WhatsApp now records `sharedAt` — without which the reuse protection could never engage.
- **The same person filling the form twice now maps to one contact**, keyed by a normalised phone number (`0812…`, `+62 812-…`, `62812…`). The leads stay separate rows so each keeps its own ad attribution. A name corrected by the team survives later submissions.
- **All trial data cleared** (migrations `0003`, `0005`) — leads, contacts, quotes, and counters. Nothing had been seen by a real jemaah.

## 2026-08-07 — analytics and the admin panel's 503

- **GA4 (`G-PH99JXKHC9`) installed** alongside Google Ads on the same gtag.js.
- **Every WhatsApp button is tracked**, not just the contact form, via `useWhatsapp().cta()` — sticky mobile button, the three on `/start`, the contact channel, and the quote page. Sharing an article and the admin panel's links to leads stay untracked.
- **WhatsApp clicks are deliberately not reported to Google Ads** until a conversion action of their own exists; see `app/constants/analytics.ts`. GA4 records them as `whatsapp_click` with a `source`.
- **The admin panel's 503 was a missing `NUXT_SESSION_PASSWORD` in Coolify.** A start-up config check now names the missing variables in the server log, and tells apart a variable never set from one that arrives empty (a `$` in the value is eaten by Docker). Runbook: `docs/DEPLOYMENT.md`.

## 2026-08-04

- **Pricing (`docs/PRICING.md`) updated to Periode September 2026.** LA pricing is now fully modular: Paket Dasar (mandatory) + Hotel per Malam (optional, per tier/night) + Layanan Tambahan (optional add-ons) — replaces the old bundled per-tier-per-okupansi table. Hotel Bintang 3 & 4 changed for September (Makarem Ajyad/Zowar International, Jabal Omar Marriott/Ancyra Hotel by Continent) — the previous hotels didn't have brochure coverage for the full month. Bintang 5 unchanged (Movenpick Hajar/Maysan Al Harithia).
- **Handling Bandara PP re-priced**: new vendor (Mas Akbar), flat Rp650.000/pax regardless of group size (previously per-group with a 2-pax minimum that penalized solo travelers). Now includes makan kedatangan & kepulangan + zamzam kepulangan.
- **`ContactForm.vue` (`app/components/molecules/ContactForm.vue`) synced to current LPP**: renamed "Muthowif" → "Pemandu / Pembimbing Tambahan" (glossary rule — see `docs/GLOSSARY.md`), added missing "Transport Jabal Khandamah PP" option, updated hotel tier distance descriptions to September hotels. Fields not present in the LPP (Fotografer, Kain Ihram) were intentionally kept — the contact form may capture broader interest than what's formally priced yet.
- August 2026 pricing/LPP is now frozen (already quoted to prospects) — only September and later periods get further updates going forward.

## 2026-08-04 (later same day) — two rounding/arithmetic bugs fixed in the LPP

- **"Contoh Perhitungan" subtotal bug**: the LPP's worked example (Berempat, Bintang 3, 8 nights) showed "Total Paket Dasar + Hotel" as Rp61.300.000, but the three line items above it summed to Rp61.600.000 — a plain Rp300.000 addition error, caused by a leftover "bundled markup, computed once" total from before the September hotel swap that was never recalculated. Fixed by making all Contoh Perhitungan totals a direct sum of the already-priced components shown elsewhere in the document (Paket Dasar, Hotel per Malam) — no more separate bundled recalculation that can drift out of sync.
- **Display-rounding bug**: per-jemaah prices were rounded to the nearest Rp5.000 for display, which silently changed the number for any division that doesn't land on a Rp5.000 step (e.g. Bintang 3 Madinah Berempat: exact Rp3.850.000 ÷ 4 = Rp962.500, was shown as Rp965.000). This caused the Hotel per Malam table to not reconcile with a customer's own math, and caused the Contoh Perhitungan table to show a different Paket Dasar Bertiga figure (Rp6.565.000) than the Paket Dasar page itself (Rp6.566.667, exact). Fixed by rounding to the nearest Rupiah only — `docs/PRICING.md`'s Hotel per Malam table above has been updated to match the corrected exact figures.
- Both bugs were found by a customer/user doing independent manual verification of the LPP numbers — a good reminder to re-derive "Contoh Perhitungan" totals from source components after any price or hotel change, rather than hand-carrying a previous total forward.

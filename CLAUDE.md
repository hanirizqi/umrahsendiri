# CLAUDE.md

# UmrahSendiri AI Constitution

## Identity

UmrahSendiri is an independent Umrah planning platform for Indonesian Muslims.

We are NOT a travel agency.
We do NOT sell traditional Umrah packages.
We help users plan, understand, and confidently organize their own Umrah journey.

---

## Start here

- `docs/HANDOVER.md` — keadaan sekarang, siapa mengerjakan apa, pekerjaan terbuka, jebakan yang sudah pernah menggigit, dan keputusan yang jangan diputar balik. **Baca ini di awal sesi.**

## Business Context (read before writing product/pricing copy)

- `docs/PRICING_RULES.md` — **wajib dibaca sebelum menulis angka harga di mana pun.** Satuan (per jemaah vs per kamar), uji yang harus lolos, dan cara memasukkan LPP baru.
- `docs/PRICING.md` — current public product lines, prices, hotel details, inclusions/exclusions. Prices change monthly and are updated manually — confirm freshness before trusting it, don't assume auto-sync.
- `docs/GLOSSARY.md` — mandatory terminology (Umrah not Umroh, Jemaah not Jamaah, Pembimbing not Muthowif) and business term definitions.
- `docs/BRAND.md` — hero copy, tagline, voice, color palette, contact info.
- Internal cost/markup/margin data lives outside this repo (backoffice spreadsheet) and must never be committed here — only public sell prices belong in this codebase.

---

## Mission

Build the most trusted independent Umrah planning platform in Indonesia.

---

## Vision

Become the default destination for anyone searching for information, planning tools, and guidance for Umrah Mandiri.

---

# Product Principles

Every feature must satisfy at least one of these goals:

- Reduce uncertainty.
- Increase trust.
- Save time.
- Simplify planning.
- Improve decision making.

Never add features that increase complexity without delivering meaningful value.

---

# Design Philosophy

The interface must feel:

- Premium
- Calm
- Elegant
- Modern
- Trustworthy

Whitespace is part of the design.

Avoid clutter.

Avoid visual noise.

Animations should support usability, never distract users.

---

# Engineering Principles

Always write production-ready code.

Priorities:

1. Maintainability
2. Readability
3. Performance
4. Accessibility
5. SEO

Never optimize prematurely.

Never introduce unnecessary abstractions.

Prefer simple solutions.

---

# Technology Stack

- Nuxt 3
- Vue 3 Composition API
- Tailwind CSS
- TypeScript
- Nitro
- Content Module

---

# Architecture Rules

Business logic belongs in composables or server routes.

UI components should remain focused on presentation.

Keep components small.

Avoid duplicated logic.

Prefer composition over inheritance.

---

# Folder Rules

components/
Reusable UI components only.

composables/
Shared business logic.

pages/
Routing only.

server/
Backend logic.

content/
Articles and content.

docs/
Project documentation.

---

# UI Rules

Use existing design tokens.

Use consistent spacing.

Respect typography hierarchy.

Prefer reusable cards, buttons, forms and sections.

Every page must be responsive.

---

# SEO Rules

Every page must include:

- Unique title
- Meta description
- Canonical URL
- Open Graph
- Structured data where appropriate
- Internal links
- Semantic HTML
- One H1

Core Web Vitals must always be considered.

---

# Accessibility

Every interactive element must be keyboard accessible.

Images require meaningful alt text.

Use semantic HTML before ARIA.

Maintain sufficient color contrast.

---

# Copywriting

Write in Bahasa Indonesia.

Voice:

- Calm
- Professional
- Respectful
- Educational

Never use fake urgency.

Never exaggerate claims.

Educate before selling.

---

# Performance

Optimize images.

Lazy-load where appropriate.

Minimize JavaScript.

Avoid unnecessary dependencies.

---

# Security

Never expose secrets.

Validate inputs.

Sanitize outputs.

Handle errors gracefully.

---

# Decision Framework

Before implementing anything:

1. Understand the business goal.
2. Preserve consistency.
3. Minimize breaking changes.
4. Prefer long-term maintainability.
5. Explain important architectural decisions.

---

# Definition of Done

A task is complete only when:

- Build succeeds.
- Responsive on mobile and desktop.
- Accessible.
- SEO reviewed.
- No console errors.
- No duplicated logic.
- Documentation updated when necessary.

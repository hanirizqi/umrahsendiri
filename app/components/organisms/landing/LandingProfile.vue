<script setup lang="ts">
import { SITE } from '~/constants/site'

/**
 * Identitas usaha di halaman iklan.
 *
 * Halaman `/konsultasi` sengaja tidak punya navigasi ke halaman lain, jadi
 * pengunjung dari iklan tidak punya jalan untuk mencari tahu siapa di balik
 * situs ini. Kejelasan itu penting dua arah: jemaah menyerahkan rencana
 * ibadah dan uang yang tidak sedikit, dan peninjau iklan mencari tanda bahwa
 * ada usaha nyata dengan kontak yang bisa dihubungi.
 */

const FACTS = [
  {
    icon: 'lucide:building-2',
    label: 'Siapa kami',
    value: 'UmrahSendiri — penyedia layanan umrah mandiri untuk jemaah Indonesia yang berangkat tanpa rombongan.',
  },
  {
    icon: 'lucide:shield-check',
    label: 'Yang perlu Anda tahu',
    value: 'Kami bukan biro travel dan tidak menjual paket rombongan. Anda memilih sendiri layanan yang dibutuhkan.',
  },
  {
    icon: 'lucide:handshake',
    label: 'Cara kami bekerja',
    value: 'Layanan operasional dijalankan bersama jaringan mitra travel resmi yang berpengalaman.',
  },
]
</script>

<template>
  <section class="bg-background px-6 py-16 md:px-10">
    <div class="mx-auto max-w-2xl">
      <h2 class="text-center font-display text-2xl font-bold text-primary md:text-3xl">
        Tentang UmrahSendiri
      </h2>

      <dl class="mt-8 space-y-4">
        <div
          v-for="fact in FACTS"
          :key="fact.label"
          class="flex gap-4 rounded-2xl border border-primary-100 bg-white/60 p-5"
        >
          <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
            <Icon :name="fact.icon" class="size-5" />
          </div>
          <div>
            <dt class="text-xs tracking-wide text-ink/50 uppercase">{{ fact.label }}</dt>
            <dd class="mt-1 text-sm leading-relaxed text-ink/80">{{ fact.value }}</dd>
          </div>
        </div>
      </dl>

      <div class="mt-6 rounded-2xl bg-primary-50/60 p-6 text-center">
        <p class="text-xs tracking-wide text-ink/50 uppercase">Hubungi kami langsung</p>
        <p class="mt-2 font-display text-lg font-bold text-primary">+62 811-9000-0283</p>
        <p class="mt-1 text-sm text-ink/60">{{ SITE.email }}</p>
        <p class="mt-1 text-sm text-ink/60">Senin – Sabtu, 09.00 – 20.00 WIB</p>

        <LandingFormCta source="profil" variant="ghost" size="md" class="mt-5">
          Ceritakan Rencana Anda
        </LandingFormCta>
      </div>
    </div>
  </section>
</template>

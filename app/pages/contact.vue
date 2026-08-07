<script setup lang="ts">
import { SITE } from '~/constants/site'

const { link } = useWhatsapp()

useSeoMeta({
  title: 'Kontak UmrahSendiri',
  description: 'Hubungi UmrahSendiri untuk konsultasi awal perencanaan umrah mandiri Anda, via WhatsApp atau email.',
})

const CONTACT_CHANNELS = [
  { icon: 'lucide:message-circle', label: 'WhatsApp', value: '+62 811-9000-0283', href: link() },
  { icon: 'lucide:mail', label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: 'lucide:instagram', label: 'Instagram', value: '@umrah_sendiri', href: SITE.instagram },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Kontak"
      title="Mulai dengan Satu Percakapan"
      description="Ceritakan rencana Anda, kami dengarkan dulu sebelum menyarankan apa pun."
    />

    <SectionContainer>
      <div class="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 class="font-display text-2xl font-bold text-primary">Kirim Pesan Langsung</h2>
          <p class="mt-2 text-sm text-ink/60">
            Isi form berikut, pesan akan otomatis terisi di WhatsApp dan siap Anda kirim.
          </p>
          <ContactForm class="mt-8" />
        </div>

        <div>
          <h2 class="font-display text-2xl font-bold text-primary">Saluran Lain</h2>
          <div class="mt-8 space-y-4">
            <a
              v-for="channel in CONTACT_CHANNELS"
              :key="channel.label"
              :href="channel.href"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-4 rounded-2xl border border-primary-100 bg-white/60 p-6 transition-colors hover:border-secondary-600/40"
            >
              <div class="flex size-11 items-center justify-center rounded-full bg-primary-50 text-primary">
                <Icon :name="channel.icon" class="size-5" />
              </div>
              <div>
                <p class="text-xs text-ink/50">{{ channel.label }}</p>
                <p class="font-display text-sm font-semibold text-primary">{{ channel.value }}</p>
              </div>
            </a>
          </div>

          <div class="mt-8 rounded-2xl bg-primary-50/60 p-6 text-sm text-ink/70">
            <p class="font-display font-semibold text-primary">Jam Operasional</p>
            <p class="mt-2">Senin – Sabtu, 09.00 – 20.00 WIB</p>
          </div>
        </div>
      </div>
    </SectionContainer>
  </div>
</template>

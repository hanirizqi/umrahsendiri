<script setup lang="ts">
import { SITE } from '~/constants/site'

useSeoMeta({
  title: 'Privacy Policy — UmrahSendiri',
  description: 'Kebijakan privasi UmrahSendiri mengenai data yang kami kumpulkan dan bagaimana data tersebut digunakan.',
  robots: 'noindex, follow',
})
</script>

<template>
  <div>
    <PageHero eyebrow="Legal" title="Privacy Policy" description="Terakhir diperbarui: 15 Juli 2026" />

    <SectionContainer>
      <LegalContent>
        <section>
          <h2>1. Data yang Kami Kumpulkan</h2>
          <p>Saat Anda menghubungi kami melalui WhatsApp, email, atau formulir kontak, kami dapat menerima nama, nomor telepon, alamat email, dan detail rencana perjalanan yang Anda sampaikan secara sukarela.</p>
        </section>

        <section>
          <h2>2. Penggunaan Data</h2>
          <p>Data yang Anda berikan digunakan semata untuk keperluan konsultasi dan penyusunan rencana umrah mandiri Anda. Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga mana pun.</p>
        </section>

        <section>
          <h2>3. Penyimpanan dan Keamanan</h2>
          <p>Kami menyimpan data komunikasi seperlunya untuk kebutuhan tindak lanjut konsultasi dan berupaya menjaga kerahasiaannya dengan langkah-langkah keamanan yang wajar.</p>
        </section>

        <section>
          <h2>4. Pihak Ketiga</h2>
          <p>Kami dapat membagikan informasi terbatas kepada penyedia layanan pihak ketiga (seperti hotel atau penyedia transportasi) hanya jika diperlukan untuk merealisasikan rencana yang Anda setujui.</p>
          <ul>
            <li>Data hanya dibagikan atas persetujuan Anda.</li>
            <li>Kami tidak membagikan data untuk tujuan pemasaran pihak ketiga.</li>
          </ul>
        </section>

        <section>
          <h2>5. Cookie</h2>
          <p>Website ini dapat menggunakan cookie dasar untuk keperluan analitik dan peningkatan pengalaman pengguna, tanpa mengumpulkan data identitas pribadi secara langsung.</p>
        </section>

        <section>
          <h2>6. Hak Anda</h2>
          <p>Anda berhak meminta kami menghapus atau memperbarui data pribadi yang telah Anda berikan dengan menghubungi kami melalui {{ SITE.email }}.</p>
        </section>

        <section>
          <h2>7. Perubahan Kebijakan</h2>
          <p>Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan kami sampaikan melalui halaman ini.</p>
        </section>
      </LegalContent>
    </SectionContainer>
  </div>
</template>

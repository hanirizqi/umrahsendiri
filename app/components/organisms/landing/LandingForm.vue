<script setup lang="ts">
/**
 * Form kontak di halaman iklan itu sendiri.
 *
 * Halaman iklan sebelumnya hanya punya tombol menuju WhatsApp, sedangkan pengiriman
 * form adalah conversion action **Primary** — yang dipakai Google
 * mengoptimalkan bidding. Artinya trafik iklan mendarat di halaman yang tidak
 * punya jalan ke konversi yang justru dioptimalkan, dan Google tidak punya
 * apa pun untuk dipelajari. Komponennya sama dengan yang dipakai `/contact`,
 * jadi pencatatan lead dan konversinya sudah terbukti bekerja.
 */
</script>

<template>
  <section id="form" class="bg-primary-50/40 px-6 py-16 md:px-10">
    <div class="mx-auto max-w-2xl">
      <h2 class="text-center font-display text-2xl font-bold text-primary md:text-3xl">
        Ceritakan Rencana Anda
      </h2>
      <p class="mx-auto mt-3 max-w-lg text-center text-sm text-ink/60">
        Isi keperluan Anda di bawah ini. Pesannya akan otomatis terisi di WhatsApp,
        dan kami balas dengan estimasi biaya tanpa kewajiban apa pun.
      </p>

      <ContactForm class="mt-8" />
    </div>
  </section>
</template>

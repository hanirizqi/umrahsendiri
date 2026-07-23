import type { FaqItem, StatItem } from '~/types'

export const HOME_FAQS: FaqItem[] = [
  {
    question: 'Apa bedanya UmrahSendiri dengan travel umrah biasa?',
    answer: 'Tidak ada paket yang dijual di sini. Anda dibantu menyusun rencana — itinerary, biaya, hotel, transportasi — sementara setiap keputusan tetap sepenuhnya di tangan Anda.',
  },
  {
    question: 'Apakah saya tetap perlu mengurus visa dan dokumen sendiri?',
    answer: 'Prosesnya dipandu lewat checklist dan konsultasi, termasuk dokumen apa yang dibutuhkan dan kapan harus disiapkan. Pengurusan tetap transparan dan Anda mengetahui setiap tahapnya.',
  },
  {
    question: 'Cocok untuk yang belum pernah umrah sama sekali?',
    answer: 'Sangat cocok. Untuk pemula, hal-hal yang biasanya membingungkan — dari estimasi biaya hingga jadwal ibadah harian — akan dipetakan bersama.',
  },
  {
    question: 'Bagaimana estimasi biaya dihitung?',
    answer: 'Berdasarkan preferensi hotel, tanggal keberangkatan, dan moda transportasi yang Anda pilih. Rinciannya disampaikan sebelum Anda mengambil keputusan apa pun.',
  },
  {
    question: 'Apakah saya bisa konsultasi sebelum memutuskan menggunakan layanan?',
    answer: 'Bisa. Sesi konsultasi awal tersedia untuk memahami kebutuhan Anda tanpa kewajiban melanjutkan ke paket berbayar.',
  },
  {
    question: 'Bagaimana jika saya sudah punya sebagian rencana sendiri?',
    answer: 'Tidak masalah. Bagian yang belum jelas bisa dilengkapi, tanpa mengubah rencana yang sudah Anda tetapkan.',
  },
]

export const LANDING_FAQS: FaqItem[] = HOME_FAQS.slice(0, 4)

export const ALL_FAQS: FaqItem[] = [
  ...HOME_FAQS,
  {
    question: 'Berapa biaya jasa perencanaan, dan apakah sudah termasuk tiket pesawat dan hotel?',
    answer: 'Biaya jasa perencanaan didiskusikan langsung sesuai kebutuhan Anda via WhatsApp. Biaya tersebut belum termasuk tiket, hotel, dan transportasi — semuanya dibayar terpisah sesuai pilihan Anda, dengan estimasi yang dihitung sejak awal.',
  },
  {
    question: 'Berapa lama proses konsultasi hingga rencana selesai disusun?',
    answer: 'Bervariasi tergantung kompleksitas, umumnya 1–2 minggu untuk itinerary dan estimasi biaya awal, dengan penyesuaian lanjutan sesuai kebutuhan Anda.',
  },
  {
    question: 'Apakah bisa merencanakan untuk keberangkatan lebih dari satu orang?',
    answer: 'Bisa. Paket Family dan Enterprise dirancang khusus untuk koordinasi rencana kelompok atau keluarga.',
  },
  {
    question: 'Bagaimana jika saya ingin membatalkan setelah konsultasi awal?',
    answer: 'Konsultasi awal tidak mengikat Anda pada layanan berbayar apa pun. Anda bebas memutuskan untuk melanjutkan atau tidak.',
  },
]

export const HOME_STATS: StatItem[] = [
  { value: '4', label: 'Tahap perencanaan' },
  { value: 'Gratis', label: 'Konsultasi awal' },
  { value: '100%', label: 'Keputusan milik Anda' },
]

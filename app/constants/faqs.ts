import type { FaqItem, StatItem } from '~/types'

export const HOME_FAQS: FaqItem[] = [
  {
    question: 'Apa bedanya UmrahSendiri dengan travel umrah biasa?',
    answer: 'Kami hanya menyediakan layanan yang benar-benar Anda butuhkan, bukan dalam bentuk paket. Waktu dan agenda perjalanan sepenuhnya Anda yang menentukan. Tanggung jawab kami berlaku hingga layanan yang Anda pesan selesai diberikan — kami tidak bertanggung jawab penuh atas kondisi Anda selama berada di sana.',
  },
  {
    question: 'Apakah saya tetap perlu mengurus visa dan dokumen sendiri?',
    answer: 'Jika Anda memilih Paket Dasar, pengurusan visa, Siskopatuh, dan asuransi kesehatan sudah termasuk dalam layanan yang kami proses. Rincian dokumen dan prosesnya disampaikan transparan sejak awal.',
  },
  {
    question: 'Apa syarat pengajuan Visa?',
    answer: 'Anda perlu memiliki tiket pesawat dan bukti reservasi hotel di Arab Saudi sebagai syarat utama pengajuan visa.',
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
    answer: 'Bisa. Sesi konsultasi awal tersedia untuk memahami kebutuhan Anda tanpa kewajiban melanjutkan ke layanan berbayar apa pun.',
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
    question: 'Apakah ada biaya jasa perencanaan atau konsultasi?',
    answer: 'Tidak ada biaya perencanaan atau konsultasi terpisah. Anda hanya membayar layanan yang dipilih — hotel, penerbangan, transportasi, dan lainnya — dibayar terpisah sesuai pilihan Anda, dengan estimasi yang dihitung sejak awal.',
  },
  {
    question: 'Berapa lama proses konsultasi hingga layanan selesai dikonfirmasi?',
    answer: 'Bervariasi tergantung kompleksitas kebutuhan, umumnya 1–2 minggu untuk konfirmasi layanan dan estimasi biaya awal, dengan penyesuaian lanjutan sesuai kebutuhan Anda.',
  },
  {
    question: 'Apakah bisa merencanakan untuk keberangkatan lebih dari satu orang?',
    answer: 'Bisa. Layanan dan estimasi biaya menyesuaikan jumlah jemaah yang berangkat — sendiri, berdua, bertiga, atau berempat.',
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

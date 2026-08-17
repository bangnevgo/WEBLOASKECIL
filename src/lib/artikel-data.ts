// Artikel SEO — LOAS Blog (PLAN-2026-08-005 / DEC-2026-08-007)
// Konten: repurpose dari script YouTube approved + materi LOAS.
// Status: LIVE (ACC owner 2026-08-17 — "kerjakan semua")

export interface ArtikelSection {
  h2: string
  paragraphs: string[]
  bullets?: string[]
}

export interface ArtikelFaq {
  q: string
  a: string
}

export interface Artikel {
  slug: string
  title: string // title tag 50-60 char
  description: string // meta 150-160 char
  keywords: string[]
  publishedAt: string
  status: 'DRAFT' | 'LIVE'
  lead: string // lead answer (paragraph 1)
  takeaways: string[]
  sections: ArtikelSection[]
  faq: ArtikelFaq[]
  cta: { title: string; body: string; url: string }
  relatedSlug?: string
}

export const ARTIKEL: Artikel[] = [
  {
    slug: 'apa-itu-hukum-asumsi',
    title: 'Apa itu Hukum Asumsi Neville Goddard? Penjelasan untuk Pemula',
    description:
      'Hukum Asumsi: asumsi yang dipegang teguh menjadi kenyataan. Pelajari cara kerja, praktik harian, dan cara memulainya — gratis.',
    keywords: ['hukum asumsi', 'hukum asumsi neville goddard', 'law of assumption', 'neville goddard indonesia'],
    publishedAt: '2026-08-17',
    status: 'LIVE',
    lead: 'Hukum Asumsi adalah ajaran Neville Goddard yang menyatakan bahwa apa pun yang kamu asumsikan dengan teguh — dan terus dipegang sebagai kebenaran — akan menjadi kenyataan. Bukan karena keinginanmu, melainkan karena asumsi membentuk kesadaranmu, dan kesadaran membentuk pengalamanmu.',
    takeaways: [
      'Hukum Asumsi bekerja lewat kesadaran: kamu tidak menarik sesuatu, kamu menjadi orang yang memilikinya.',
      'Asumsi bukan sekadar pikiran positif — ia adalah perasaan yang dipegang sebagai fakta.',
      'Praktik intinya: bayangkan keinginanmu sudah terwujud, rasakan, lalu biarkan hidup menyesuaikan.',
      'Teknik pendukung: SATS, Teknik Revisi, dan I AM.',
      'Kamu bisa mempelajari seluruh kurikulumnya secara gratis di LOAS.',
    ],
    sections: [
      {
        h2: 'Apa yang dimaksud "asumsi" dalam Hukum Asumsi?',
        paragraphs: [
          'Dalam konteks Neville Goddard, asumsi bukan berarti menebak atau berprasangka. Asumsi adalah keyakinan yang kamu pegang tanpa perlu bukti — cara kamu "mengasumsikan" sesuatu sebagai fakta. Goddard menulis bahwa "asumsi, meskipun salah, bila dipertahankan akan mengeras menjadi fakta" (The Power of Awareness).',
          'Contoh sederhananya: kamu mengasumsikan dirimu orang yang percaya diri. Asumsi itu mengubah caramu berdiri, berbicara, dan mengambil keputusan — dan orang lain meresponsnya. Hukum Asumsi hanya mengambil logika yang sama dan menerapkannya secara sadar ke seluruh area hidup: uang, hubungan, karier.',
        ],
      },
      {
        h2: 'Mengapa perasaan lebih penting daripada pikiran?',
        paragraphs: [
          'Goddard menekankan bahwa perasaan (feeling) adalah rahasianya — ini judul bukunya: Feeling is the Secret. Pikiran bisa berkata "aku ingin kaya", tetapi jika tubuh dan perasaanmu tetap dalam keadaan "aku kekurangan", yang menang adalah perasaan. Karena itu praktik Hukum Asumsi bukan tentang mengulang afirmasi, melainkan tentang memasuki perasaan dari keadaan yang sudah tercapai.',
        ],
      },
      {
        h2: 'Bagaimana cara kerja Hukum Asumsi secara praktis?',
        paragraphs: ['Empat langkah sederhana:'],
        bullets: [
          'Tentukan tujuan dengan jelas. Bukan "aku mau bahagia", tetapi kondisi spesifik yang bisa kamu rasakan.',
          'Buat adegan singkat yang mengimplikasikan tujuan itu sudah tercapai. 5–10 detik, seolah kamu melihat/mendengar/merasakan momen itu sekarang.',
          'Rasakan perasaan "sudah terjadi". Inilah intinya — biarkan tubuh mengenal lega, syukur, atau aman.',
          'Lepaskan dan jalani hari. Jangan mengecek 3D setiap lima menit mencari bukti.',
        ],
      },
      {
        h2: 'Apa itu SATS dan mengapa digunakan sebelum tidur?',
        paragraphs: [
          'SATS (State Akin To Sleep) adalah kondisi antara terjaga dan tidur, saat pikiran kritis melunak dan sugesti lebih mudah diterima alam bawah sadar. Goddard merekomendasikan praktik visualisasi di kondisi ini karena perasaan lebih mudah "mengendap" menjadi asumsi: rileks, tutup mata, bayangkan adegan pendek yang mengimplikasikan keinginanmu terwujud, dan ulangi dengan ringan sampai perasaan itu terasa natural.',
        ],
      },
      {
        h2: 'Apa bedanya Hukum Asumsi dengan sekadar berpikir positif?',
        paragraphs: [
          'Pikiran positif biasanya berhenti di level mental: "aku harus optimis." Hukum Asumsi bekerja di level identitas: kamu mengubah siapa kamu dalam keadaan baru, bukan sekadar apa yang kamu harapkan. Itulah sebabnya hasilnya lebih dari sekadar suasana hati — ia mengubah respons otomatismu terhadap situasi.',
        ],
      },
    ],
    faq: [
      {
        q: 'Apakah Hukum Asumsi sama dengan Law of Attraction?',
        a: 'Tidak persis. Law of Attraction berbicara tentang "menarik" apa yang kamu pancarkan; Hukum Asumsi berbicara tentang menjadi — mengubah asumsi tentang dirimu, lalu hidup menyesuaikan.',
      },
      {
        q: 'Apakah Hukum Asumsi butuh latar belakang agama tertentu?',
        a: 'Tidak. Prinsip ini universal dan bisa dipraktikkan siapa saja.',
      },
      {
        q: 'Berapa lama sampai asumsi menjadi kenyataan?',
        a: 'Tidak ada jangka waktu yang bisa dijanjikan. Goddard menekankan persistence: terus pegang asumsi sampai ia mengendap menjadi fakta batin.',
      },
      {
        q: 'Apa yang harus dilakukan jika ada "bukti" sebaliknya di 3D?',
        a: 'Jangan berdebat dengan realitas lama sepanjang hari. Kembali ke praktik: satu pengalaman batin baru yang singkat, rasakan, lalu buktikan lewat tindakan kecil yang selaras.',
      },
      {
        q: 'Dari mana sumber materi ini?',
        a: 'Dari buku dan kuliah Neville Goddard: Feeling is the Secret, The Power of Awareness, Five Lessons, dan lainnya — dikurasi dalam kurikulum gratis LOAS.',
      },
    ],
    cta: {
      title: 'Lanjutkan Belajar — Gratis',
      body: 'Kurikulum lengkap Hukum Asumsi — 10 bagian, 50 pelajaran, praktik harian, dan kutipan bersumber — bisa kamu akses gratis di loas.nevgoinstitute.com.',
      url: 'https://loas.nevgoinstitute.com',
    },
    relatedSlug: 'teknik-revisi-neville-goddard',
  },
  {
    slug: 'teknik-revisi-neville-goddard',
    title: 'Teknik Revisi Neville Goddard: Cara Mengubah Makna Masa Lalu',
    description:
      'Teknik Revisi Neville Goddard: gunakan imajinasi sadar untuk mengubah makna kejadian lama, bukan menyangkal fakta. Panduan 4 langkah + kesalahan yang harus dihindari.',
    keywords: ['teknik revisi', 'teknik revisi neville goddard', 'revision neville goddard', 'mengubah masa lalu'],
    publishedAt: '2026-08-17',
    status: 'LIVE',
    lead: 'Teknik Revisi adalah praktik Neville Goddard untuk meninjau ulang makna sebuah kejadian lama dengan imajinasi sadar — bukan untuk menyangkal fakta, tetapi untuk mengubah rekaman batin yang kamu pakai saat merespons hidup.',
    takeaways: [
      'Revisi mengubah makna kejadian, bukan faktanya — kamu tidak menyangkal apa yang terjadi.',
      'Kerjanya pada kesimpulan batin ("aku tidak layak", "aku pasti gagal"), bukan pada drama luarnya.',
      'Praktiknya: satu kejadian spesifik → tenangkan tubuh → adegan 5–10 detik → ulangi ringan.',
      'Revisi bukan pengganti tindakan nyata dan bukan ritual kecemasan baru.',
      'Panduan lengkapnya tersedia gratis di kurikulum LOAS.',
    ],
    sections: [
      {
        h2: 'Mengapa masa lalu masih "merusak" hari ini?',
        paragraphs: [
          'Karena yang kamu bawa bukan kejadiannya, melainkan kesimpulan yang kamu ambil darinya. "Aku pernah gagal, berarti aku memang tidak mampu." Kesimpulan inilah yang menjadi identitas — dan identitas itulah yang menentukan responsmu terhadap setiap situasi baru.',
        ],
      },
      {
        h2: 'Apa itu revisi dalam ajaran Neville Goddard?',
        paragraphs: [
          'Revisi berarti menggunakan imajinasi secara sadar untuk meninjau ulang makna sebuah kejadian. Kamu mengambil satu momen yang masih memicu reaksi, lalu membayangkan versi percakapan atau hasil yang ingin kamu alami. Dalam bahasa sederhana: kamu tidak lagi memberi kejadian lama hak untuk menentukan identitasmu.',
        ],
      },
      {
        h2: 'Bagaimana cara melakukan teknik revisi? (4 langkah)',
        paragraphs: ['Empat langkah sederhana:'],
        bullets: [
          'Pilih satu kejadian spesifik. Jangan mengambil seluruh hidupmu sekaligus.',
          'Tenangkan tubuh. Tarik napas perlahan — yang penting kamu cukup hadir dan tidak panik.',
          'Buat adegan pendek 5–10 detik yang mengimplikasikan pengalaman itu berjalan sesuai keadaan yang kamu pilih.',
          'Ulangi dengan ringan sampai respons batinmu berubah. Bukan mengulang karena takut gagal — ulangi karena kamu sedang memberi kesan baru pada dirimu.',
        ],
      },
      {
        h2: 'Kesalahan umum yang membuat revisi tidak bekerja',
        paragraphs: [
          'Pertama, memakai revisi untuk lari dari tindakan nyata — kalau ada tagihan, kamu tetap perlu membuat rencana pembayaran. Kedua, memaksa diri merasa bahagia saat tubuh masih tegang — mulai dari rasa aman. Ketiga, mengecek 3D setiap lima menit mencari bukti — setelah latihan, kembalilah menjalani hidup.',
        ],
      },
      {
        h2: 'Bagaimana revisi terhubung dengan konsep diri?',
        paragraphs: [
          'Kejadian masa lalu sering menjadi "bukti" yang kamu pakai untuk menjelaskan siapa kamu. Revisi bekerja di titik ini: tanyakan, setelah kejadian itu aku memutuskan menjadi siapa? Orang yang selalu ditolak? Orang yang tidak aman? Itulah identitas yang perlu kamu lihat dengan jujur — dan itulah yang bisa kamu revisi.',
        ],
      },
    ],
    faq: [
      {
        q: 'Apakah teknik revisi berarti menyangkal kenyataan?',
        a: 'Tidak. Kamu tidak mengubah fakta kejadian dan tidak menghapus tanggung jawab. Yang kamu ubah adalah makna batin dan kesimpulan yang kamu bawa.',
      },
      {
        q: 'Berapa lama satu sesi revisi?',
        a: 'Cukup beberapa menit. Adegannya pendek (5–10 detik) dan diulang ringan. Kuncinya konsistensi dan perasaan, bukan durasi.',
      },
      {
        q: 'Bolehkah merevisi kejadian yang sangat berat atau traumatis?',
        a: 'Untuk kejadian berat, mulai dari langkah kecil dan rasa aman; jangan memaksakan diri. Jika diperlukan, tetap libatkan dukungan profesional.',
      },
      {
        q: 'Apa bedanya revisi dengan afirmasi?',
        a: 'Afirmasi mengulang kata-kata positif; revisi memberi kesempatan pada pikiran dan tubuh untuk mengenal respons yang berbeda melalui satu pengalaman imajinatif yang singkat.',
      },
      {
        q: 'Bagaimana jika aku tidak bisa membayangkan dengan jelas?',
        a: 'Visualisasi yang tajam bukan syarat. Yang penting kamu cukup hadir dan merasakan arah pengalaman itu.',
      },
    ],
    cta: {
      title: 'Lanjutkan Belajar — Gratis',
      body: 'Teknik revisi hanyalah salah satu praktik dalam kurikulum lengkap Hukum Asumsi — 10 bagian, 50 pelajaran, praktik harian, dan kutipan bersumber, gratis di loas.nevgoinstitute.com.',
      url: 'https://loas.nevgoinstitute.com',
    },
    relatedSlug: 'apa-itu-hukum-asumsi',
  },
]

export function getArtikelBySlug(slug: string): Artikel | undefined {
  return ARTIKEL.find((a) => a.slug === slug)
}

export function getAllArtikelSlugs(): { slug: string }[] {
  return ARTIKEL.map((a) => ({ slug: a.slug }))
}

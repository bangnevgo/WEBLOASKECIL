export interface AudioLesson {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  duration: string;
  audioUrl: string;
  coverImage: string;
  ogImage: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  keyTakeaways: {
    number: string;
    title: string;
    description: string;
  }[];
  bestListeningTime: {
    time: string;
    reason: string;
  }[];
  faq: {
    q: string;
    a: string;
  }[];
}

export const AUDIO_LESSONS: Record<string, AudioLesson> = {
  'tubuh-anda-kecanduan-masa-lalu': {
    slug: 'tubuh-anda-kecanduan-masa-lalu',
    title: 'Tubuh Anda Ternyata Kecanduan Masa Lalu',
    subtitle: 'Bedah Ilmiah & Batiniah: Mengapa Memori Biologis Tubuh Menolak Asumsi Baru dan Cara Melepaskannya Seketika',
    category: 'Audio Eksklusif LOAS',
    description: 'Banyak orang gagal mempertahankan asumsi bukan karena imajinasinya lemah, melainkan karena sel-sel tubuhnya sudah terbiasa dan kecanduan secara biokimia pada hormon stres serta emosi masa lalu. Dengarkan rekaman eksklusif ini untuk memprogram ulang respon biologis Anda.',
    duration: '20 Menit',
    audioUrl: '/audio/tubuh-anda-kecanduan-masa-lalu.mp3',
    coverImage: '/images/illustrations/tubuh-kecanduan-masa-lalu.svg',
    ogImage: '/images/og-tubuh-kecanduan-masa-lalu.png',
    publishedAt: '2026-08-21',
    author: {
      name: 'Bang Nevgo',
      role: 'Founder Nevgo Institute & Praktisi Hukum Asumsi',
      avatar: '/images/bang-nevgo-profile.jpg'
    },
    keyTakeaways: [
      {
        number: '01',
        title: 'Tubuh adalah Pikiran Bawah Sadar Fisik',
        description: 'Setiap pikiran menghasilkan respon emosional, dan setiap emosi melepaskan senyawa kimiawi ke seluruh tubuh. Jika Anda terbiasa cemas dan merasa kekurangan selama bertahun-tahun, tubuh Anda secara biologis mengidentifikasikan dirinya dengan kondisi tersebut.'
      },
      {
        number: '02',
        title: 'Mengapa Visualisasi Sering Terasa Berat?',
        description: 'Saat pikiran sadar Anda mencoba mengasumsikan kelimpahan, tubuh mengirimkan sinyal penolakan berupa rasa gelisah. Ini bukan tanda kegagalan, melainkan gejala "sakaw biologis" saat tubuh dipaksa keluar dari zona emosi lama yang sudah menjadi kebiasaannya.'
      },
      {
        number: '03',
        title: 'Meretas Respon Biokimia dengan State of Akinesia',
        description: 'Untuk menghentikan kecanduan tubuh, tenangkan sistem saraf ke kondisi rileks tanpa reaksi fisik (Akinesia). Amati dorongan emosional lama sebagai pengamat luar (Observer) tanpa memberi makan reaksi atau narasi negatif baru.'
      },
      {
        number: '04',
        title: 'Menghuni Emosi Kealamian (Naturalness)',
        description: 'Banjiri sel-sel tubuh dengan frekuensi kepenuhan (Feeling of the Wish Fulfilled). Ketika tubuh mulai merasakan kelegaan dan rasa syukur sebelum wujud fisiknya tampak di 3D, jembatan kejadian akan bergerak secara otomatis dan tak terbendung.'
      }
    ],
    bestListeningTime: [
      {
        time: '🌙 Sesaat Sebelum Tidur (SATS Phase)',
        reason: 'Ketika gelombang otak berada di frekuensi Theta, filter pikiran kritis melemah sehingga sugesti dan pembebasan emosi langsung terserap ke sistem bawah sadar.'
      },
      {
        time: '🌅 Pagi Hari Setelah Bangun',
        reason: 'Menyetel arah kompas biologis tubuh sebelum Anda terdistraksi oleh respon otomatis terhadap lingkungan fisik di sekitar Anda.'
      }
    ],
    faq: [
      {
        q: 'Mengapa tubuh saya merasa gelisah saat mengasumsikan hal baik?',
        a: 'Gelisah adalah respon adaptasi biologis. Tubuh Anda selama ini terbiasa memproduksi hormon dari situasi lama. Ketika Anda memberikan asumsi baru, tubuh merasa asing. Teruskan asumsi tersebut hingga rasa baru itu menjadi alami bagi tubuh Anda.'
      },
      {
        q: 'Berapa kali sebaiknya mendengarkan audio ini?',
        a: 'Dengarkan minimal 1x sehari selama 7 hari berturut-turut, terutama sebelum tidur di malam hari, sampai konsep bahwa "tubuh Anda sudah bebas dari masa lalu" terpatri menjadi keyakinan batin yang kokoh.'
      },
      {
        q: 'Apakah audio ini berbayar?',
        a: 'Audio ini 100% GRATIS dan merupakan bagian dari inisiatif literasi batin terbuka oleh Nevgo Institute.'
      }
    ]
  }
};

export function getAudioBySlug(slug: string): AudioLesson | undefined {
  return AUDIO_LESSONS[slug];
}

export function getAllAudioSlugs(): { slug: string }[] {
  return Object.keys(AUDIO_LESSONS).map((slug) => ({ slug }));
}

import { useState, useEffect } from 'react'
import { useAppStore } from './store'

export const translations = {
  id: {
    // Header
    navLogo: 'HUKUM ASUMSI',
    myDashboard: 'Dasbor Saya ✦',
    login: 'Masuk',
    register: 'Daftar',
    logout: 'Keluar',
    admin: 'Admin',

    // Hero
    heroTop: 'Neville Goddard',
    heroMain: 'HUKUM ASUMSI',
    heroSub: '(Ajaran & Praktik)',
    heroQuote: '"Sebuah asumsi, meskipun salah, jika terus dipegang teguh, akan mengeras menjadi fakta. Manusia, dengan mengasumsikan perasaan dari keinginan yang telah terwujud, mengubah masa depannya selaras dengan asumsinya."',
    heroQuoteSource: '— LIMA PELAJARAN · PELAJARAN 1 · 1948',
    aiCTA: 'Analisa Perjalanan Manifestasimu',
    aiCTA_badge: '(Ditenagai AI)',
    pricingCTA_hero: 'Ikut Program Cohort — Rp 1.000.000',
    askBangNevgo: 'Tanya Bang Nevgo',
    metaCurriculum: 'KURIKULUM',
    metaParts: 'BAGIAN',
    metaLessons: 'PELAJARAN',
    metaSources: '15+ BUKU & 200+ KULIAH',

    // Navigation & Sticky
    essentialBooks: 'Buku-Buku Esensial',
    faqTitle: 'Pertanyaan yang Sering Diajukan',
    faqSubtitle: 'Jawaban untuk pertanyaan umum tentang Hukum Asumsi dan kurikulum ini',

    // General badges
    freeBadge: 'DAFTAR FREE ✦',
    paidBadge: '✦ COHORT',
    ebookBadge: '✦ KOLEKSI eBOOK',

    // Community CTA Section
    communityCtaTitle: 'Join Komunitas Privat Kami',
    communityCtaDesc: '2,400+ builder sudah bergabung. Dapatkan support system, exclusive sessions, dan tersambung dengan sesama pencari kebenaran.',
    communityCtaBtn: 'Lihat/Join Komunitas →',
    membersCount: 'Anggota',
    discussionsCount: 'Diskusi',
    successStories: 'Cerita Sukses',

    // Ebook Section
    ebookTitle: 'eBook Panduan Manifestasi',
    ebookSubtitle: 'Koleksi eBook oleh Bang Nevgo — praktis, bersumber, dan siap membantu perjalanan manifestasimu',

    // Cohort CTA Section
    cohortCtaTitle: 'Program Cohort Terbimbing',
    cohortCtaDesc: 'Perdalam praktik Anda dalam Cohort 1 bulan terbimbing (4 sesi live). Sesi live, dukungan komunitas, dan latihan manifestasi terstruktur — semua dalam bimbingan langsung.',
    cohortCtaBtn: 'Ikut Cohort — Rp 1.000.000',

    // Bonus / Books Section
    essentialBooksTitle: '✦ Buku & Kuliah Esensial',
    essentialBooksDesc: 'Daftar Free untuk membuka seluruh materi pendamping dan sumber belajar Neville Goddard.',
    resourcesCount: 'SUMBER DAYA',

    // Footer
    footerBrandTagline: 'Kurikulum Lengkap Ajaran Neville Goddard',
    footerColCurriculum: 'Kurikulum',
    footerColResources: 'Sumber Daya',
    footerColLegal: 'Legal',
    footerRights: '© {year} Hukum Asumsi. Seluruh hak dilindungi.',
    footerMadeWith: 'Dibuat dengan ✦ untuk pencari kebenaran',

    // Dashboard
    dashboardTitle: 'Dasbor Pembelajaran Anda',
    dashboardSubtitle: 'Pantau kemajuan Anda dan jelajahi seluruh kurikulum Hukum Asumsi.',
    backToHome: '← Beranda',
    dashboardWelcome: 'Selamat datang kembali, {name}!',
    dashboardFree: 'DAFTAR FREE — Buka Semua Materi',
    dashboardProgress: 'Kemajuan Belajar',
    lessonsCompleted: '{completed} dari {total} pelajaran selesai',
    curriculumOverview: 'Ikhtisar Kurikulum',
    authRequiredDashboard: 'Anda harus masuk untuk mengakses Dasbor.',

    // Lesson Detail UI
    backToDashboard: '← Kembali ke Dasbor',
    backToLanding: '← Kembali ke Beranda',
    markAsCompleted: 'Tandai Selesai ✓',
    lessonCompletedBadge: 'Pelajaran Selesai ✓',
    nextLesson: 'Pelajaran Berikutnya →',
    prevLesson: '← Pelajaran Sebelumnya',
    dailyPractice: 'Praktik Harian',
    keyTakeaway: 'Intisari Kunci',
    sourcedQuotes: 'Kutipan Bersumber',
    lessonTranslation: 'Teks Terjemahan:',
    viewOriginalText: 'Akses Sumber Asli →',
    freeLessonTitle: 'Preview Pelajaran',

    // Locked Lesson Modal (tidak dipakai lagi)
    lockedTitle: 'Pelajaran Terkunci 🔒',
    lockedDesc: 'Pelajaran ini memerlukan keanggotaan aktif untuk dibuka.',
    upgradeToAccess: 'Berlangganan untuk Membuka Akses Penuh',
    lockedBulletsHeader: 'Di pelajaran ini, Anda akan mempelajari:',

    // FAQ items
    faq_q1: 'Apa itu Hukum Asumsi?',
    faq_a1: 'Hukum Asumsi adalah prinsip inti dari ajaran Neville Goddard yang menyatakan bahwa sebuah asumsi, meskipun salah, jika terus dipegang teguh akan mengeras menjadi fakta. Dengan mengasumsikan perasaan dari keinginan yang telah terwujud, Anda mengubah masa depan selaras dengan asumsi tersebut.',
    faq_q2: 'Apakah saya perlu latar belakang agama?',
    faq_a2: 'Tidak. Ajaran Neville bersifat universal dan dapat diterapkan oleh siapa saja tanpa memandang latar belakang agama atau keyakinan. Meskipun Neville menggunakan bahasa alkitabiah dalam kuliahnya, prinsip-prinsipnya bersifat praktis dan psikologis.',
    faq_q3: 'Apa perbedaan antara Paket Basic, Premium, dan Master?',
    faq_a3: 'Seluruh kurikulum terbuka setelah Daftar Free. Tidak ada paket berlangganan untuk materi ini. Jika Anda ingin pendampingan lebih dalam, silakan bergabung dengan Program Cohort.',
    faq_q4: 'Bagaimana teknik SATS bekerja?',
    faq_a4: 'SATS (State Akin To Sleep) adalah teknik meditasi di mana Anda memasuki kondisi rileks antara terjaga dan tidur, lalu membayangkan adegan yang menyiratkan keinginan Anda telah terwujud. Dalam kondisi ini, pikiran bawah sadar paling reseptif terhadap sugesti baru.',
    faq_q5: 'Apakah saya bisa membatalkan langganan?',
    faq_a5: 'Tidak perlu khawatir — setelah Daftar Free, seluruh materi kurikulum dapat diakses tanpa biaya tersembunyi atau komitmen jangka panjang.',
    faq_q6: 'Dari mana sumber materi ini?',
    faq_a6: 'Seluruh materi bersumber dari 15+ buku dan 200+ kuliah asli Neville Goddard dari tahun 1939 hingga 1972. Setiap pelajaran dilengkapi dengan kutipan langsung dan rujukan ke sumber aslinya, memastikan keakuratan dan integritas ajaran.'
  },
  en: {
    // Header
    navLogo: 'LAW OF ASSUMPTION',
    myDashboard: 'My Dashboard ✦',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    admin: 'Admin',

    // Hero
    heroTop: 'Neville Goddard',
    heroMain: 'LAW OF ASSUMPTION',
    heroSub: '(Teachings & Practice)',
    heroQuote: '"An assumption, though false, if persisted in, will harden into fact. Man, by assuming the feeling of his wish fulfilled, alters his future in harmony with his assumption."',
    heroQuoteSource: '— FIVE LESSONS · LESSON 1 · 1948',
    aiCTA: 'Analyze Your Manifestation Journey',
    aiCTA_badge: '(AI Powered)',
    pricingCTA_hero: 'Join the Cohort — Rp 1.000.000',
    askBangNevgo: 'Ask Bang Nevgo',
    metaCurriculum: 'CURRICULUM',
    metaParts: 'PARTS',
    metaLessons: 'LESSONS',
    metaSources: '15+ BOOKS & 200+ LECTURES',

    // Navigation & Sticky
    essentialBooks: 'Essential Books',
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Answers to common questions about the Law of Assumption and this curriculum',

    // General badges
    freeBadge: 'FREE ✦',
    paidBadge: '✦ COHORT',
    ebookBadge: '✦ eBOOK COLLECTION',

    // Community CTA Section
    communityCtaTitle: 'Join Our Private Community',
    communityCtaDesc: '2,400+ builders have already joined. Get a support system, exclusive sessions, and connect with fellow truth seekers.',
    communityCtaBtn: 'View/Join Community →',
    membersCount: 'Members',
    discussionsCount: 'Discussions',
    successStories: 'Success Stories',

    // Ebook Section
    ebookTitle: 'Manifestation Guide eBooks',
    ebookSubtitle: 'Collection of eBooks by Bang Nevgo — practical, source-backed, and ready to assist your manifestation journey',

    // Cohort CTA Section
    cohortCtaTitle: 'Guided Cohort Program',
    cohortCtaDesc: 'Deepen your practice in a 1-month guided Cohort (4 live sessions). Weekly live sessions, community support, and structured manifestation exercises — all under direct guidance.',
    cohortCtaBtn: 'Join Cohort — Rp 1.000.000',

    // Bonus / Books Section
    essentialBooksTitle: '✦ Essential Books & Lectures',
    essentialBooksDesc: 'Free full-text archive available at coolwisdombooks.com/neville. Neville\'s complete works from 1939–1972.',
    resourcesCount: 'RESOURCES',

    // Footer
    footerBrandTagline: 'Complete Curriculum of Neville Goddard\'s Teachings',
    footerColCurriculum: 'Curriculum',
    footerColResources: 'Resources',
    footerColLegal: 'Legal',
    footerRights: '© {year} Law of Assumption. All rights reserved.',
    footerMadeWith: 'Made with ✦ for truth seekers',

    // Dashboard
    dashboardTitle: 'Your Learning Dashboard',
    dashboardSubtitle: 'Track your progress and explore the complete Law of Assumption curriculum.',
    backToHome: '← Back to Home',
    dashboardWelcome: 'Welcome back, {name}!',
    dashboardFree: 'FREE ACCESS — All Materials Free',
    dashboardProgress: 'Learning Progress',
    lessonsCompleted: '{completed} of {total} lessons completed',
    curriculumOverview: 'Curriculum Overview',
    authRequiredDashboard: 'You must be logged in to access the Dashboard.',

    // Lesson Detail UI
    backToDashboard: '← Back to Dashboard',
    backToLanding: '← Back to Home',
    markAsCompleted: 'Mark as Completed ✓',
    lessonCompletedBadge: 'Lesson Completed ✓',
    nextLesson: 'Next Lesson →',
    prevLesson: '← Previous Lesson',
    dailyPractice: 'Daily Practice',
    keyTakeaway: 'Key Takeaway',
    sourcedQuotes: 'Sourced Quotes',
    lessonTranslation: 'Translation:',
    viewOriginalText: 'Access Original Source →',
    freeLessonTitle: 'Free Lesson',

    // Locked Lesson Modal (no longer used)
    lockedTitle: 'Lesson Locked 🔒',
    lockedDesc: 'This lesson requires an active membership to unlock.',
    upgradeToAccess: 'Subscribe to Unlock Full Access',
    lockedBulletsHeader: 'In this lesson, you will learn:',

    // FAQ items
    faq_q1: 'What is the Law of Assumption?',
    faq_q1: 'What is the Law of Assumption?',
    faq_a1: 'The Law of Assumption is the core principle of Neville Goddard\'s teachings, which states that an assumption, though false, if persisted in, will harden into fact. By assuming the feeling of your wish fulfilled, you alter your future in harmony with your assumption.',
    faq_q2: 'Do I need a religious background?',
    faq_a2: 'No. Neville\'s teachings are universal and can be applied by anyone regardless of religious background or belief. While Neville uses biblical language in his lectures, his principles are practical and psychological.',
    faq_q3: 'What is the difference between Basic, Premium, and Master packages?',
    faq_a3: 'The entire curriculum is now FREE. There are no more subscription packages. If you want deeper guidance, join the Cohort Program.',
    faq_q4: 'How does the SATS technique work?',
    faq_a4: 'SATS (State Akin To Sleep) is a meditative technique where you enter a state of deep relaxation between waking and sleeping, and then imagine a scene implying your wish has already been fulfilled. In this state, the subconscious mind is most receptive to new suggestions.',
    faq_q5: 'Can I cancel my subscription?',
    faq_a5: 'No need to worry — all curriculum materials are now FREE and accessible without restrictions. No hidden fees or long-term commitments.',
    faq_q6: 'Where does this material come from?',
    faq_a6: 'All material is sourced from Neville Goddard\'s 15+ original books and 200+ lectures from 1939 to 1972. Every lesson features direct quotes and references to the original sources, ensuring accuracy and integrity of the teachings.'
  }
}

export function useTranslation() {
  const { language, setLanguage } = useAppStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeLang = mounted ? language : 'id'

  const t = (key: keyof typeof translations.id | keyof typeof translations.en) => {
    const dict = translations[activeLang] || translations.id
    return dict[key] || key
  }

  return { t, language: activeLang, setLanguage }
}

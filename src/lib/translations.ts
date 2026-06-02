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
    heroQuote: '“Sebuah asumsi, meskipun salah, jika terus dipegang teguh, akan mengeras menjadi fakta. Manusia, dengan mengasumsikan perasaan dari keinginan yang telah terwujud, mengubah masa depannya selaras dengan asumsinya.”',
    heroQuoteSource: '— LIMA PELAJARAN · PELAJARAN 1 · 1948',
    aiCTA: 'Analisa Perjalanan Manifestasimu',
    aiCTA_badge: '(Ditenagai AI)',
    pricingCTA_hero: 'Dapatkan Akses Penuh — Berlangganan Sekarang',
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
    freeBadge: 'GRATIS ✦',
    paidBadge: 'AKSES PENUH',
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
    ebookSubtitle: 'Koleksi eBook berbayar oleh Bang Nevgo — praktis, bersumber, dan siap membantu perjalanan manifestasimu',

    // Pricing CTA Section
    pricingCtaTitle: 'Buka Kurikulum Lengkap',
    pricingCtaDesc: 'Berlangganan untuk mendapatkan akses ke seluruh 49 pelajaran terperinci dengan ajaran lengkap, kutipan bersumber, praktik harian, dan poin-poin penting dari seluruh karya Neville Goddard.',
    pricingCtaBtn: 'Lihat Paket Berlangganan →',

    // Bonus / Books Section
    essentialBooksTitle: '✦ Buku & Kuliah Esensial',
    essentialBooksDesc: 'Arsip teks lengkap gratis tersedia di coolwisdombooks.com/neville. Seluruh karya Neville dari tahun 1939–1972.',
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
    dashboardTierFree: 'Paket: GRATIS',
    dashboardTierBasic: 'Paket: BASIC ✦',
    dashboardTierPremium: 'Paket: PREMIUM 💎',
    dashboardTierMaster: 'Paket: MASTER 👑',
    dashboardProgress: 'Kemajuan Belajar',
    lessonsCompleted: '{completed} dari {total} pelajaran selesai',
    curriculumOverview: 'Ikhtisar Kurikulum',
    activeTiers: 'Status Anggota',
    activationCode: 'Aktivasi Kode',
    redeemBtn: 'Tukarkan Kode',
    redeemCodePlaceholder: 'Masukkan kode aktivasi Anda',
    activating: 'Mengaktifkan...',
    cancelBtn: 'Batal',
    authRequiredDashboard: 'Anda harus masuk untuk mengakses Dasbor.',
    joinPremiumTitle: 'Tingkatkan ke Premium atau Master',
    joinPremiumDesc: 'Dapatkan akses ke seluruh 49 pelajaran, meditasi audio VIP, forum komunitas, dan analisis AI interaktif.',
    explorePricing: 'Lihat Paket & Harga',
    
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
    freeLessonTitle: 'Pelajaran Gratis',

    // Locked Lesson Modal
    lockedTitle: 'Pelajaran Terkunci 🔒',
    lockedDesc: 'Pelajaran ini memerlukan keanggotaan aktif untuk dibuka.',
    upgradeToAccess: 'Berlangganan untuk Membuka Akses Penuh',
    lockedBulletsHeader: 'Di pelajaran ini, Anda akan mempelajari:',

    // FAQ items
    faq_q1: 'Apa itu Hukum Asumsi?',
    faq_a1: 'Hukum Asumsi adalah prinsip inti dari ajaran Neville Goddard yang menyatakan bahwa sebuah asumsi, meskipun salah, jika terus dipegang teguh akan mengeras menjadi fakta. Dengan mengasumsikan perasaan dari keinginan yang telah terwujud, Anda mengubah masa depan selaras dengan asumsi tersebut.',
    faq_q2: 'Apakah saya perlu latar belakang agama?',
    faq_a2: 'Tidak. Ajaran Neville bersifat universal dan dapat diterapkan oleh siapa saja tanpa memandang latar belakang agama atau keyakinan. Meskipun Neville menggunakan bahasa alkitabiah dalam kuliahnya, prinsip-prinsipnya bersifat praktis dan psikologis.',
    faq_q3: 'Apa perbedaan antara paket Basic, Premium, dan Master?',
    faq_a3: 'Paket Basic memberikan akses penuh ke 49 pelajaran kurikulum dan Bank Knowledge dasar (non-VIP). Paket Premium menambahkan akses ke forum komunitas privat yang interaktif dan webinar pendukung. Paket Master menyempurnakan perjalanan Anda dengan meditasi audio premium, webinar VIP, dan workbook pemrograman batin harian pribadi.',
    faq_q4: 'Bagaimana teknik SATS bekerja?',
    faq_a4: 'SATS (State Akin To Sleep) adalah teknik meditasi di mana Anda memasuki kondisi rileks antara terjaga dan tidur, lalu membayangkan adegan yang menyiratkan keinginan Anda telah terwujud. Dalam kondisi ini, pikiran bawah sadar paling reseptif terhadap sugesti baru.',
    faq_q5: 'Apakah saya bisa membatalkan langganan?',
    faq_a5: 'Ya, Anda dapat membatalkan kapan saja tanpa penalti. Akses Anda akan tetap aktif hingga akhir periode berlangganan yang telah dibayar. Tidak ada biaya tersembunyi atau komitmen jangka panjang.',
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
    heroQuote: '“An assumption, though false, if persisted in, will harden into fact. Man, by assuming the feeling of his wish fulfilled, alters his future in harmony with his assumption.”',
    heroQuoteSource: '— FIVE LESSONS · LESSON 1 · 1948',
    aiCTA: 'Analyze Your Manifestation Journey',
    aiCTA_badge: '(AI Powered)',
    pricingCTA_hero: 'Get Full Access — Subscribe Now',
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
    paidBadge: 'FULL ACCESS',
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
    ebookSubtitle: 'Collection of premium eBooks by Bang Nevgo — practical, source-backed, and ready to assist your manifestation journey',

    // Pricing CTA Section
    pricingCtaTitle: 'Unlock Full Curriculum',
    pricingCtaDesc: 'Subscribe to get access to all 49 detailed lessons with complete teachings, source-backed quotes, daily practices, and key takeaways from all of Neville Goddard’s works.',
    pricingCtaBtn: 'View Subscription Plans →',

    // Bonus / Books Section
    essentialBooksTitle: '✦ Essential Books & Lectures',
    essentialBooksDesc: 'Free full-text archive available at coolwisdombooks.com/neville. Neville’s complete works from 1939–1972.',
    resourcesCount: 'RESOURCES',

    // Footer
    footerBrandTagline: 'Complete Curriculum of Neville Goddard’s Teachings',
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
    dashboardTierFree: 'Plan: FREE',
    dashboardTierBasic: 'Plan: BASIC ✦',
    dashboardTierPremium: 'Plan: PREMIUM 💎',
    dashboardTierMaster: 'Plan: MASTER 👑',
    dashboardProgress: 'Learning Progress',
    lessonsCompleted: '{completed} of {total} lessons completed',
    curriculumOverview: 'Curriculum Overview',
    activeTiers: 'Membership Status',
    activationCode: 'Redeem Code',
    redeemBtn: 'Redeem Code',
    redeemCodePlaceholder: 'Enter your activation code',
    activating: 'Activating...',
    cancelBtn: 'Cancel',
    authRequiredDashboard: 'You must be logged in to access the Dashboard.',
    joinPremiumTitle: 'Upgrade to Premium or Master',
    joinPremiumDesc: 'Gain access to all 49 lessons, VIP audio meditations, community forums, and interactive AI analysis.',
    explorePricing: 'View Plans & Pricing',
    
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

    // Locked Lesson Modal
    lockedTitle: 'Lesson Locked 🔒',
    lockedDesc: 'This lesson requires an active membership to unlock.',
    upgradeToAccess: 'Subscribe to Unlock Full Access',
    lockedBulletsHeader: 'In this lesson, you will learn:',

    // FAQ items
    faq_q1: 'What is the Law of Assumption?',
    faq_a1: 'The Law of Assumption is the core principle of Neville Goddard’s teachings, which states that an assumption, though false, if persisted in, will harden into fact. By assuming the feeling of your wish fulfilled, you alter your future in harmony with your assumption.',
    faq_q2: 'Do I need a religious background?',
    faq_a2: 'No. Neville’s teachings are universal and can be applied by anyone regardless of religious background or belief. While Neville uses biblical language in his lectures, his principles are practical and psychological.',
    faq_q3: 'What is the difference between Basic, Premium, and Master packages?',
    faq_a3: 'The Basic package provides full access to the 49 curriculum lessons and the basic Knowledge Bank (non-VIP). The Premium package adds access to the interactive private community forum and support webinars. The Master package elevates your journey with premium audio meditations, VIP webinars, and a personalized daily inner programming workbook.',
    faq_q4: 'How does the SATS technique work?',
    faq_a4: 'SATS (State Akin To Sleep) is a meditative technique where you enter a state of deep relaxation between waking and sleeping, and then imagine a scene implying your wish has already been fulfilled. In this state, the subconscious mind is most receptive to new suggestions.',
    faq_q5: 'Can I cancel my subscription?',
    faq_a5: 'Yes, you can cancel at any time with no penalty. Your access will remain active until the end of the paid billing period. There are no hidden fees or long-term commitments.',
    faq_q6: 'Where does this material come from?',
    faq_a6: 'All material is sourced from Neville Goddard’s 15+ original books and 200+ lectures from 1939 to 1972. Every lesson features direct quotes and references to the original sources, ensuring accuracy and integrity of the teachings.'
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

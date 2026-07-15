'use client'

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ALL_PARTS, BONUS_ITEMS, MARQUEE_ITEMS } from '@/lib/curriculum-data'
import { ALL_PARTS_EN } from '@/lib/curriculum-data-en'
import { useTranslation } from '@/lib/translations'

const EBOOK_ITEMS = [
  { cover: '/images/ebooks/sukses-praktek-hukum-asumsi.jpg', title: 'Sukses Praktek Hukum Asumsi', tag: 'Hukum Asumsi Series' },
  { cover: '/images/ebooks/asumsimu-itu-dahsyat.png', title: 'Asumsimu Itu Dahsyat!', tag: 'Hukum Asumsi Series' },
  { cover: '/images/ebooks/kamu-tidak-akan-hidup-bahagia.jpg', title: 'Kamu Tidak Akan Bahagia Bila Tidak Kaya', tag: 'Joseph Murphy' },
  { cover: '/images/ebooks/memahami-jembatan-peristiwa.jpg', title: 'Memahami Fenomena Jembatan Peristiwa', tag: 'Neville Goddard' },
  { cover: '/images/ebooks/memahami-inner-shadow.png', title: 'Kunci Memahami Inner Shadow', tag: 'Bang Nevgo' },
  { cover: '/images/ebooks/koleksi-6-ebook.jpg', title: 'Koleksi 6 eBook Manifestasi', tag: 'Bundle Lengkap' },
]
import AiHubSection from '@/components/ai-hub-section'
import FreeDownloadsSection from '@/components/free-downloads-section'
import KnowledgeBank from '@/components/knowledge-bank'
import CurriculumGraphView from '@/components/curriculum-graph-view'
import LeadCaptureModal from '@/components/lead-capture-modal'

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } }
}

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
}

const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
}

// FAQ accordion item component
function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      className={`nv-faq-item nv-glass ${isOpen ? 'nv-faq-item-open' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <button
        className="nv-faq-question"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="nv-faq-question-text">{question}</span>
        <span className="nv-faq-icon">{isOpen ? '−' : '+'}</span>
      </button>
      <motion.div
        className="nv-faq-answer-wrap"
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <p className="nv-faq-answer">{answer}</p>
      </motion.div>
    </motion.div>
  )
}

const partImages = [
  '/images/illustrations/manifestation-journal.webp',
  '/images/neville-profile.jpg',
  '/images/illustrations/meditation-imagination.webp',
  '/images/parts/part-4.png',
  '/images/parts/part-5.png',
  '/images/parts/part-6.png',
  '/images/parts/part-7.png',
  '/images/parts/part-8.png',
  '/images/parts/part-9.png',
  '/images/parts/part-10.png',
]

// Aspect ratios matching each part image's natural dimensions
const partImageAspectRatios = [
  '1/1',   // manifestation-journal (1024×1024)
  '1/1',   // neville-profile (2048×2048)
  '1/1',   // meditation-imagination (1024×1024)
  '4/3',   // part-4 (1152×864)
  '4/3',   // part-5 (1152×864)
  '4/3',   // part-6 (1152×864)
  '4/3',   // part-7 (1152×864)
  '4/3',   // part-8 (1152×864)
  '4/3',   // part-9 (1152×864)
  '4/3',   // part-10 (1152×864)
]

export default function Landing() {
  const { setView, isAuthenticated, leadRegistered } = useAppStore()
  const { t, language, setLanguage } = useTranslation()
  const curriculumParts = language === 'en' ? ALL_PARTS_EN : ALL_PARTS
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showBackTop, setShowBackTop] = useState(false)
  const [showLeadModal, setShowLeadModal] = useState(false)
  // Client-only flag to avoid hydration mismatch
  const isMounted = useSyncExternalStore(
    () => () => {},   // subscribe (no-op, value never changes)
    () => true,       // getSnapshot (client)
    () => false       // getServerSnapshot (server)
  )
  const mainRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  
  // Scroll spy for active nav
  useEffect(() => {
    const handleScroll = () => {
      const sections = curriculumParts.map(p => document.getElementById(p.id)).filter(Boolean) as HTMLElement[]
      const bonusEl = document.getElementById('bonus')
      if (bonusEl) sections.push(bonusEl)
      const cohortEl = document.getElementById('cohort')
      if (cohortEl) sections.push(cohortEl)

      let current: string | null = null
      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 150 && rect.bottom > 150) {
          current = section.id
          break
        }
      }
      setActiveSection(current)

      // Back-to-top visibility
      setShowBackTop(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [curriculumParts])

  // Hash scroll — support direct link to graph view section
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (hash === '#curriculum-graph' || hash === '#graph-view') {
      setTimeout(() => {
        const el = document.getElementById('curriculum-graph')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 500)
    }
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="nv-page" ref={mainRef}>
      {/* Floating Header */}
      <header className="w-full bg-[#0a0a0c]/80 backdrop-blur-md border-b border-neutral-900 fixed top-0 left-0 right-0 z-[100] px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={scrollToTop}>
            <div className="w-8 h-8 rounded-full bg-[#d4a053] flex items-center justify-center text-black font-extrabold shadow-md">✦</div>
            <span className="font-outfit font-extrabold text-sm sm:text-base text-[#e8e4dc]">{t('navLogo')}</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="relative flex items-center bg-neutral-950 border border-neutral-800 rounded-full p-0.5 w-[72px] h-7">
              <div 
                className="absolute top-0.5 bottom-0.5 rounded-full bg-[#d4a053] shadow transition-all duration-300 ease-out"
                style={{
                  left: language === 'id' ? '2px' : '36px',
                  width: '34px',
                }}
              />
              <button 
                className={`flex-1 text-[10px] font-extrabold text-center z-10 transition-colors duration-200 cursor-pointer ${
                  language === 'id' ? 'text-black' : 'text-neutral-400 hover:text-neutral-200'
                }`}
                onClick={() => setLanguage('id')}
                title="Bahasa Indonesia"
              >
                ID
              </button>
              <button 
                className={`flex-1 text-[10px] font-extrabold text-center z-10 transition-colors duration-200 cursor-pointer ${
                  language === 'en' ? 'text-black' : 'text-neutral-400 hover:text-neutral-200'
                }`}
                onClick={() => setLanguage('en')}
                title="English"
              >
                EN
              </button>
            </div>

            {isAuthenticated ? (
              <button 
                className="px-4 py-1.5 bg-[#d4a053]/10 hover:bg-[#d4a053]/20 border border-[#d4a053]/30 text-[#d4a053] text-xs font-bold rounded-lg transition cursor-pointer"
                onClick={() => setView('dashboard')}
              >
                {t('myDashboard')}
              </button>
            ) : (
              <>
                <button 
                  className="text-xs text-neutral-400 hover:text-white transition bg-transparent border-none cursor-pointer"
                  onClick={() => setView('login')}
                >
                  {t('login')}
                </button>
                <button 
                  className="px-4 py-1.5 bg-[#d4a053] hover:bg-[#c4883a] text-black text-xs font-bold rounded-lg transition cursor-pointer"
                  onClick={() => setView('register')}
                >
                  {t('register')}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Spacer for header */}
      <div className="h-16 w-full" />

      {/* ─── HERO ─── */}
      <div className="nv-container">
        <motion.section
          className="nv-hero"
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          {/* Animated background elements */}
          <div className="nv-hero-bg" />
          <div className="nv-orb nv-orb-1" />
          <div className="nv-orb nv-orb-2" />
          <div className="nv-orb nv-orb-3" />
          <div className="nv-hero-grid-overlay" />

          <div className="nv-hero-content">
            {/* Photo on the left */}
            <motion.div
              className="nv-hero-photo-col"
              initial={{ opacity: 0, x: -40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="nv-hero-photo-frame">
                <div className="nv-hero-photo-glow" />
                <Image
                  src="/images/neville-goddard.png"
                  alt="Neville Goddard"
                  width={884}
                  height={1250}
                  className="nv-hero-photo"
                  sizes="(max-width: 768px) 260px, 380px"
                  priority
                />
              </div>
              {/* AI CTA directly below Neville photo */}
              <motion.button
                className="nv-ai-hero-cta"
                onClick={() => setView('ai-manifestation')}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="nv-ai-hero-cta-icon">✦</span>
                <span className="nv-ai-hero-cta-text">{t('aiCTA')}</span>
                <span className="nv-ai-hero-cta-badge">{t('aiCTA_badge')}</span>
              </motion.button>
            </motion.div>

            {/* Text on the right */}
            <div className="nv-hero-text-col">
              <motion.div
                className="nv-hero-logo"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
              >
                <img src="/community-logo.jpg" alt="AKU ANAK LOAS" />
              </motion.div>

              <motion.div className="nv-hero-title" variants={staggerContainer} initial="initial" animate="animate">
                <h1 className="sr-only">Neville Goddard — {t('heroMain')}: Kurikulum Lengkap Ajaran &amp; Praktik</h1>
                <motion.span className="nv-hero-top" variants={fadeInUp}>{t('heroTop')}</motion.span>
                <motion.span className="nv-hero-main" variants={fadeInUp}>{t('heroMain')}</motion.span>
                <motion.span className="nv-hero-sub" variants={fadeInUp}>{t('heroSub')}</motion.span>
              </motion.div>

              <motion.div
                className="nv-hero-mark nv-glass"
                variants={scaleIn}
                initial="initial"
                animate="animate"
              >
                <div className="nv-hero-mark-accent" />
                <p className="nv-hero-mark-quote">
                  {t('heroQuote')}
                </p>
                <p className="nv-hero-mark-source">{t('heroQuoteSource')}</p>
              </motion.div>

              <motion.div
                className="nv-hero-meta"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <span className="nv-meta-item">
                  <span className="nv-meta-label">{t('metaCurriculum')}</span>
                </span>
                <span className="nv-meta-sep">·</span>
                <span className="nv-meta-item">
                  <span className="nv-meta-accent">10</span>
                  <span className="nv-meta-label">{t('metaParts')}</span>
                </span>
                <span className="nv-meta-sep">·</span>
                <span className="nv-meta-item">
                  <span className="nv-meta-accent">49</span>
                  <span className="nv-meta-label">{t('metaLessons')}</span>
                </span>
                <span className="nv-meta-sep">·</span>
                <span className="nv-meta-item">
                  <span className="nv-meta-label">{t('metaSources')}</span>
                </span>
              </motion.div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <motion.button
                  className="nv-cta-button nv-cta-pulse"
                  onClick={() => setShowLeadModal(true)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <span className="nv-cta-icon">✦</span>
                  {language === 'en' ? 'Register Free — Full Access All Modules' : 'Daftar Free — Full Akses Semua Modul'}
                </motion.button>

                {/* ── Header WhatsApp CTA (smaller, centered under gold CTA) ── */}
                <div style={{ marginTop: 12 }}>
                  <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                  >
                    <a
                      href="https://wa.me/628989221700"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nv-hero-wa-link"
                    >
                      <svg className="nv-hero-wa-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {t('askBangNevgo')}
                    </a>
                  </motion.div>
                </div>
                {/* Subtle Cohort mention in hero */}
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  style={{ marginTop: '10px' }}
                >
                  <a
                    href="https://cohort.nevgoinstitute.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nv-hero-cohort-link"
                  >
                    ✦ {language === 'en' ? 'Cohort Program Available' : 'Ada Program Cohort'} <span className="nv-hero-cohort-arrow">→</span>
                  </a>
                </motion.div>
              </div>
            </div>
          </div>


        </motion.section>
      </div>

      {/* ─── STICKY NAV ─── */}
      <nav className="nv-nav">
        <div className="nv-nav-inner">
          {curriculumParts.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className={`nv-nav-link ${activeSection === p.id ? 'nv-nav-link-active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(p.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              <span className="nv-nav-num" style={{ color: p.color }}>{p.num}</span>
              <span className="nv-nav-text">{p.title.length > 22 ? p.title.slice(0, 20) + '…' : p.title}</span>
            </a>
          ))}
          <a
            href="#bonus"
            className={`nv-nav-link ${activeSection === 'bonus' ? 'nv-nav-link-active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('bonus')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            <span className="nv-nav-num" style={{ color: 'var(--nv-gold)' }}>★</span>
            <span className="nv-nav-text">{t('essentialBooks')}</span>
          </a>
          <a
            href="#cohort"
            className={`nv-nav-link nv-nav-link-cohort ${activeSection === 'cohort' ? 'nv-nav-link-active-cohort' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('cohort')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            <span className="nv-nav-num">✦</span>
            <span className="nv-nav-text">{language === 'en' ? 'Cohort' : 'Cohort'}</span>
          </a>
        </div>
      </nav>

      {/* ─── MARQUEE ─── */}
      <div className="nv-marquee-wrap">
        <div className="nv-marquee">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="nv-marquee-chip">
              <span className="nv-chip-icon">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ─── CURRICULUM PARTS ─── */}
      <div className="nv-container">
        <CurriculumGraphView />
        {curriculumParts.map((part, partIdx) => {
          const isEven = partIdx % 2 === 0
          const partImage = partImages[partIdx] || partImages[0]

          return (
            <div key={part.id} id={part.id} className="nv-part">
              {/* Part Header with Image */}
              <div className="nv-part-hero-row">
                <motion.div
                  className={`nv-part-hero-text ${isEven ? '' : 'nv-part-hero-text-reverse'}`}
                  {...fadeInLeft}
                  transition={{ ...fadeInLeft.transition, delay: 0.05 }}
                >
                  <span className="nv-part-num" style={{ color: part.color, background: `${part.color}15` }}>{part.num}</span>
                  <div className="nv-part-info">
                    <h2>{part.title}</h2>
                    <span className="nv-part-meta">{part.meta}</span>
                  </div>
                  <p className="nv-part-description">{part.description}</p>
                  {part.partQuote && (
                    <div className="nv-part-inline-quote">
                      <div className="nv-quote-accent" style={{ background: part.color }} />
                      <p className="nv-inline-quote-text">&ldquo;{part.partQuote.text}&rdquo;</p>
                      <p className="nv-inline-quote-source">— {part.partQuote.source}</p>
                    </div>
                  )}
                </motion.div>
                <motion.div
                  className={`nv-part-hero-image ${isEven ? '' : 'nv-part-hero-image-reverse'}`}
                  {...fadeInRight}
                  transition={{ ...fadeInRight.transition, delay: 0.15 }}
                >
                  <div className="nv-part-image-frame" style={{ borderColor: `${part.color}33`, aspectRatio: partImageAspectRatios[partIdx] }}>
                    <div className="nv-part-image-glow" style={{ background: `radial-gradient(ellipse at center, ${part.color}22, transparent 70%)` }} />
                    <Image
                      src={partImage}
                      alt={`Ilustrasi ${part.title}`}
                      fill
                      className="nv-part-image"
                      sizes="(max-width: 768px) 100vw, 500px"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Connector */}
              <div className="nv-connector" style={{ background: `linear-gradient(90deg, ${part.color}44, ${part.color}11)` }} />

              {/* Lesson Cards Grid */}
              <div className="nv-grid">
                {part.lessons.map((lesson, lessonIdx) => {
                  const isPartLocked = part.id !== 'part-1' && !leadRegistered
                  return (
                    <motion.div
                      key={lesson.num}
                      className="nv-card nv-glass nv-glow-border"
                      style={{ position: 'relative', cursor: isPartLocked ? 'pointer' : 'pointer' }}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.4, delay: lessonIdx * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                      whileHover={isPartLocked ? { scale: 1.02 } : { y: -4, transition: { duration: 0.2 } }}
                      onClick={() => {
                        if (isPartLocked) {
                          setShowLeadModal(true)
                        } else {
                          useAppStore.getState().openLesson(part.id, lesson.num)
                        }
                      }}
                    >
                      {isPartLocked ? (
                        <span style={{
                          position: 'absolute', top: '8px', right: '10px', zIndex: 2,
                          fontSize: '1rem', opacity: 0.5
                        }}>🔒</span>
                      ) : (
                        <span className="nv-card-free-badge" style={{ opacity: 0.7 }}>GRATIS ✦</span>
                      )}
                      <div className="nv-card-accent" style={{ background: `linear-gradient(135deg, ${part.color}, ${part.color}66)` }} />
                      <div className="nv-card-head">
                        <span className="nv-card-num" style={{ color: part.color, background: `${part.color}15` }}>{lesson.num}</span>
                        <span className="nv-card-title">{lesson.title}</span>
                      </div>
                      <ul className="nv-card-bullets">
                        {lesson.bullets.map((b, bi) => (
                          <li key={bi}>
                            <span className="nv-bullet-dot" style={{ background: part.color }} />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )
                })}
                {part.partQuote && part.lessons.length % 3 !== 0 && (
                  <motion.div
                    className="nv-premium-quote"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="nv-quote-accent" style={{ background: part.color }} />
                    <p className="nv-quote-text">&ldquo;{part.partQuote.text}&rdquo;</p>
                    <p className="nv-quote-source">{part.partQuote.source}</p>
                  </motion.div>
                )}
              </div>
              {part.partQuote && part.lessons.length % 3 === 0 && (
                <div className="nv-part-quote-wrap">
                  <motion.div
                    className="nv-premium-quote nv-premium-quote-full"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="nv-quote-accent" style={{ background: part.color }} />
                    <p className="nv-quote-text">&ldquo;{part.partQuote.text}&rdquo;</p>
                    <p className="nv-quote-source">{part.partQuote.source}</p>
                  </motion.div>
                </div>
              )}
            </div>
          )
        })}
        {/* ─── PROGRAM COHORT SECTION ─── */}
        <motion.section
          id="cohort"
          className="nv-cohort-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="nv-cohort-glow" />
          <div className="nv-cohort-content">
            {/* Badge */}
            <div className="nv-cohort-badge-wrap">
              <span className="nv-pricing-cta-badge">{language === 'en' ? '✦ Interactive Cohort Class' : '✦ Kelas Interaktif Cohort'}</span>
            </div>

            {/* Headline — the hook */}
            <h2 className="nv-cohort-headline">
              {language === 'en'
                ? 'Becoming the Version of You Who Already Has It.'
                : 'Menjadi Versi Dirimu yang Sudah Memiliki-nya.'}
            </h2>
            <p className="nv-cohort-subheadline">
              {language === 'en'
                ? "That's the promise of the Law of Assumption. But shifting consciousness into possession isn't just knowing the theory — without a systematic method, most people get lost halfway. Cohort is the 1-month guided method (4 live sessions) that takes you from 'knowing' to 'being'."
                : 'Itulah janji Hukum Asumsi. Tapi mengubah kesadaran menjadi kepemilikan tak sekadar tahu teorinya — tanpa cara yang sistematis, kebanyakan orang tersesat di tengah jalan. Cohort adalah metode terbimbing 1 bulan (4 sesi live) yang membawamu dari \'tahu\' menjadi \'menjadi\'.'}
            </p>

            {/* Bridge paragraph */}
            <div className="nv-cohort-bridge">
              <p>
                {language === 'en'
                  ? 'Inside the Cohort, you won\'t just read about SATS, "I AM", and the feeling of the wish fulfilled — you\'ll practice them step by step: live guidance, personal feedback, and a systematic 1-month process (4 live sessions), shoulder to shoulder with committed practitioners.'
                  : 'Di dalam Cohort, kamu tak hanya membaca tentang SATS, "I AM", dan perasaan keinginan yang terwujud — kamu mempraktikkannya langkah demi langkah: bimbingan langsung, umpan balik personal, dan proses 1 bulan yang sistematis (4 sesi live), bahu-membahu dengan sesama praktisi yang berkomitmen.'}
              </p>
            </div>

            {/* Benefit Cards */}
            <div className="nv-cohort-cards">
              {/* Card 1 */}
              <motion.div
                className="nv-cohort-card nv-glass"
                whileHover={{ y: -6, borderColor: 'rgba(212,160,83,0.4)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <div className="nv-cohort-card-icon">🎯</div>
                <h3 className="nv-cohort-card-title">
                  {language === 'en' ? '4 Live Seshions' : '4 Sesi Live Intensif'}
                </h3>
                <p className="nv-cohort-card-desc">
                  {language === 'en'
                    ? 'Interactive Zoom sessions with Bang Nevgo. Each session is 2+ hours of guided practice, direct teaching, and real-time Q&A — not passive lectures.'
                    : 'Sesi Zoom interaktif bersama Bang Nevgo. Setiap sesi 2+ jam praktik terbimbing, pengajaran langsung, dan tanya-jawab real-time — bukan ceramah pasif.'}
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                className="nv-cohort-card nv-glass"
                whileHover={{ y: -6, borderColor: 'rgba(212,160,83,0.4)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <div className="nv-cohort-card-icon">📋</div>
                <h3 className="nv-cohort-card-title">
                  {language === 'en' ? 'Homework & Feedback' : 'PR & Umpan Balik'}
                </h3>
                <p className="nv-cohort-card-desc">
                  {language === 'en'
                    ? 'Weekly practice assignments reviewed personally by Bang Nevgo. You don\'t just learn — you execute, and you get corrected when you drift.'
                    : 'Tugas praktik mingguan yang diperiksa langsung oleh Bang Nevgo. Kamu tidak hanya belajar — kamu menjalankan, dan kamu dikoreksi saat melenceng.'}
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                className="nv-cohort-card nv-glass"
                whileHover={{ y: -6, borderColor: 'rgba(212,160,83,0.4)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <div className="nv-cohort-card-icon">🤝</div>
                <h3 className="nv-cohort-card-title">
                  {language === 'en' ? 'Small Group, Deep Bonds' : 'Kelompok Kecil, Ikatan Kuat'}
                </h3>
                <p className="nv-cohort-card-desc">
                  {language === 'en'
                    ? 'Limited to 10 participants per Cohort. You\'re not a number — you\'re part of a tribe. Share progress, breakthroughs, and support each other through the bridge of incidents.'
                    : 'Terbatas 10 peserta per Cohort. Kamu bukan nomor — kamu bagian dari suku. Bagikan progres, terobosan, dan saling dukung melalui jembatan peristiwa.'}
                </p>
              </motion.div>

              {/* Card 4 */}
              <motion.div
                className="nv-cohort-card nv-glass"
                whileHover={{ y: -6, borderColor: 'rgba(212,160,83,0.4)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <div className="nv-cohort-card-icon">🧠</div>
                <h3 className="nv-cohort-card-title">
                  {language === 'en' ? 'Deep-Dive Practice' : 'Praktik Mendalam'}
                </h3>
                <p className="nv-cohort-card-desc">
                  {language === 'en'
                    ? 'Every module is paired with cohort-specific exercises: SATS drills, revision workshops, shadow work sessions, and living-from-the-end simulations that make the theory real.'
                    : 'Setiap modul dipasangkan dengan latihan khusus cohort: drill SATS, workshop revisi, sesi shadow work, dan simulasi hidup-dari-akhir yang membuat teori menjadi nyata.'}
                </p>
              </motion.div>

              {/* Card 5 */}
              <motion.div
                className="nv-cohort-card nv-glass"
                whileHover={{ y: -6, borderColor: 'rgba(212,160,83,0.4)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <div className="nv-cohort-card-icon">📅</div>
                <h3 className="nv-cohort-card-title">
                  {language === 'en' ? '12-Week Structure' : 'Struktur 12 Minggu'}
                </h3>
                <p className="nv-cohort-card-desc">
                  {language === 'en'
                    ? 'A proven progression from foundational consciousness work to advanced manifestation mastery. Each week builds on the last — you emerge transformed, not just informed.'
                    : 'Progresi terbukti dari kerja kesadaran fundamental menuju penguasaan manifestasi tingkat lanjut. Setiap minggu dibangun di atas minggu sebelumnya — kamu muncul bertransformasi, bukan sekadar terinformasi.'}
                </p>
              </motion.div>

              {/* Card 6 */}
              <motion.div
                className="nv-cohort-card nv-glass"
                whileHover={{ y: -6, borderColor: 'rgba(212,160,83,0.4)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <div className="nv-cohort-card-icon">🔥</div>
                <h3 className="nv-cohort-card-title">
                  {language === 'en' ? 'Direct Q&A with Bang Nevgo' : 'Tanya Jawab Langsung Bang Nevgo'}
                </h3>
                <p className="nv-cohort-card-desc">
                  {language === 'en'
                    ? 'Your specific blocks, your unique questions, your personal manifestation challenges — addressed in real-time by someone who has guided hundreds through this exact journey.'
                    : 'Blok spesifikmu, pertanyaan unikmu, tantangan manifestasi pribadimu — dijawab real-time oleh seseorang yang telah membimbing ratusan orang melalui perjalanan persis ini.'}
                </p>
              </motion.div>
            </div>

            {/* Stats Bar */}
            <div className="nv-cohort-stats">
              <div className="nv-cohort-stat">
                <span className="nv-cohort-stat-num">4</span>
                <span className="nv-cohort-stat-label">{language === 'en' ? 'Live Sessions' : 'Sesi Live'}</span>
              </div>
              <div className="nv-cohort-stat-divider" />
              <div className="nv-cohort-stat">
                <span className="nv-cohort-stat-num">1</span>
                <span className="nv-cohort-stat-label">{language === 'en' ? 'Month' : 'Bulan'}</span>
              </div>
              <div className="nv-cohort-stat-divider" />
              <div className="nv-cohort-stat">
                <span className="nv-cohort-stat-num">10</span>
                <span className="nv-cohort-stat-label">{language === 'en' ? 'Participants' : 'Peserta'}</span>
              </div>
              <div className="nv-cohort-stat-divider" />
              <div className="nv-cohort-stat">
                <span className="nv-cohort-stat-num">Live</span>
                <span className="nv-cohort-stat-label">Zoom</span>
              </div>
            </div>

            {/* Testimonial — ganti dengan testimoni peserta asli */}
            <div className="nv-cohort-testimonial nv-glass" style={{ marginTop: '32px', padding: '24px 28px', borderRadius: '16px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--nv-text)', fontStyle: 'italic' }}>
                {language === 'en'
                  ? '"After 1 month I stopped hoping and started living from the end. My first manifestation landed before the batch even ended."'
                  : '"Setelah 1 bulan, saya berhenti berharap dan mulai hidup dari akhir. Manifestasi pertama saya nyata sebelum batch selesai."'}
              </p>
              <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--nv-gold)', fontWeight: 700 }}>
                {language === 'en' ? '— Peserta Cohort Batch 3' : '— Peserta Cohort Batch 3'}
              </p>
            </div>

            {/* CTA */}
            <div className="nv-cohort-cta-wrap">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', alignItems: 'center' }}>
                <motion.a
                  href="https://cohort.nevgoinstitute.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nv-cta-button nv-cta-pulse"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ textDecoration: 'none' }}
                >
                  <span className="nv-cta-icon">✦</span>
                  {language === 'en' ? 'Join Cohort — Rp 1.000.000 →' : 'Gabung Cohort — Rp 1.000.000 →'}
                </motion.a>
                <motion.a
                  href="https://cohort.nevgoinstitute.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nv-cta-button"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ textDecoration: 'none' }}
                >
                  {language === 'en' ? 'Learn More About Cohort →' : 'Pelajari Lebih Lanjut →'}
                </motion.a>
              </div>
              <p className="nv-cohort-cta-note">
                {language === 'en'
                  ? 'Limited to 10 participants per batch. Seats fill fast — reserve yours.'
                  : 'Terbatas 10 peserta per batch. Kuota terbatas — amankan seat-mu.'}
              </p>
            </div>
          </div>
        </motion.section>
      </div>

      {/* ─── FREE DOWNLOADS SECTION ─── */}
      <FreeDownloadsSection />

      {/* ─── KNOWLEDGE BANK SECTION ─── */}
      <KnowledgeBank />

      {/* ─── EBOOK ETALASE (MARQUEE) ─── */}
      <div className="nv-container">
        <div className="nv-ebook-etalase-section">
          <motion.div
            className="nv-ebook-etalase-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="nv-ebook-etalase-badge">{t('ebookBadge')}</span>
            <h2 className="nv-ebook-etalase-title">{t('ebookTitle')}</h2>
            <p className="nv-ebook-etalase-subtitle">{t('ebookSubtitle')}</p>
          </motion.div>
          <div className="nv-ebook-marquee-wrap">
            <div className="nv-ebook-marquee">
              {[...EBOOK_ITEMS, ...EBOOK_ITEMS].map((item, i) => (
                <div key={i} className="nv-ebook-card">
                  <div className="nv-ebook-cover-wrap">
                    <Image
                      src={item.cover}
                      alt={item.title}
                      fill
                      className="nv-ebook-cover"
                      style={{ objectFit: 'contain' }}
                      sizes="(max-width: 768px) 160px, 220px"
                    />
                  </div>
                  <div className="nv-ebook-info">
                    <span className="nv-ebook-part">{item.tag}</span>
                    <span className="nv-ebook-name">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── BONUS SECTION ─── */}
        <div id="bonus" className="nv-part" style={{ marginTop: 64 }}>
          <motion.div
            className="nv-bonus"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="nv-bonus-head">
              <h2>{t('essentialBooksTitle')}</h2>
              <span className="nv-bonus-badge">11 {t('resourcesCount')}</span>
            </div>
            <p className="nv-bonus-desc">
              {t('essentialBooksDesc').split('coolwisdombooks.com/neville')[0]}
              <a href="https://coolwisdombooks.com/neville/" target="_blank" rel="noopener noreferrer" className="nv-bonus-link">
                coolwisdombooks.com/neville
              </a>
              {t('essentialBooksDesc').split('coolwisdombooks.com/neville')[1]}
            </p>
            <div className="nv-bonus-grid">
              {BONUS_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  className="nv-bonus-item nv-glass"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                >
                  <span className="nv-bonus-icon">{item.icon}</span>
                  <span className="nv-bonus-text">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── FAQ SECTION ─── */}
        <motion.section
          className="nv-faq"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="nv-faq-head">
            <h2 className="nv-faq-title">{t('faqTitle')}</h2>
            <p className="nv-faq-subtitle">{t('faqSubtitle')}</p>
          </div>
          <div className="nv-faq-list">
            {[
              {
                q: t('faq_q1'),
                a: t('faq_a1'),
              },
              {
                q: t('faq_q2'),
                a: t('faq_a2'),
              },
              {
                q: t('faq_q3'),
                a: t('faq_a3'),
              },
              {
                q: t('faq_q4'),
                a: t('faq_a4'),
              },
              {
                q: t('faq_q5'),
                a: t('faq_a5'),
              },
              {
                q: t('faq_q6'),
                a: t('faq_a6'),
              },
            ].map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} index={i} />
            ))}
          </div>
        </motion.section>

        {/* ─── BLOG NEVGO: RELATED ARTICLES → cohort blog (topical cluster) ─── */}
        <section className="nv-blog-bridge" aria-label="Blog Nevgo Institute">
          <div className="nv-blog-bridge-head">
            <span className="nv-blog-bridge-eyebrow">
              {language === 'en' ? '📝 FROM THE BLOG' : '📝 DARI BLOG NEVGO'}
            </span>
            <h2 className="nv-blog-bridge-title-main">
              {language === 'en'
                ? 'Deep Dives from the Nevgo Institute Blog'
                : 'Bedah Mendalam dari Blog Nevgo Institute'}
            </h2>
            <p className="nv-blog-bridge-sub">
              {language === 'en'
                ? 'Why manifestation often stalls — and how to fix it from the root.'
                : 'Kenapa manifestasi sering mandek — dan cara menuntaskannya dari akar.'}
            </p>
          </div>

          <div className="nv-blog-bridge-grid">
            {[
              {
                slug: 'afirmasi-cemas',
                tag: language === 'en' ? 'Neurology' : 'Neurologi',
                title: 'Kenapa Afirmasi Positif Justru Membuatmu Cemas?',
              },
              {
                slug: 'file-asli',
                tag: language === 'en' ? 'Self-Concept' : 'Konsep Diri',
                title: "Konsep Diri: 'File Asli' yang Menentukan Cetakan Hidupmu",
              },
              {
                slug: 'pola-sabotase',
                tag: language === 'en' ? 'Subconscious' : 'Bawah Sadar',
                title: 'Mengenal Pola Sabotase: Cara Bawah Sadar Melindungimu',
              },
              {
                slug: 'regulasi-emosi',
                tag: language === 'en' ? 'Somatic' : 'Somatic',
                title: 'Regulasi Emosi: Kunci Manifestasi yang Stabil & Permanen',
              },
              {
                slug: 'sistem-saraf-manifestasi',
                tag: language === 'en' ? 'Nervous System' : 'Sistem Saraf',
                title:
                  'Merasakan Sudah Terjadi: Jalur Sistem Saraf Menuju Manifestasi Tanpa Resistensi',
              },
            ].map((a) => (
              <a
                key={a.slug}
                href={`https://cohort.nevgoinstitute.com/blog/${a.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="nv-blog-bridge-card"
              >
                <span className="nv-blog-bridge-tag">{a.tag}</span>
                <h3 className="nv-blog-bridge-title">{a.title}</h3>
                <span className="nv-blog-bridge-cta">
                  {language === 'en' ? 'Read article →' : 'Baca artikel →'}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ─── FOOTER CTA ─── */}
        <div className="nv-footer-cta">
          {language === 'en' ? 'Sourced exclusively from ' : 'Bersumber secara eksklusif dari '}
          <a href="https://coolwisdombooks.com/neville/" target="_blank" rel="noopener noreferrer">
            CoolWisdomBooks — Neville Goddard Archive →
          </a>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="nv-footer-pro">
        <div className="nv-footer-top">
          <div className="nv-footer-brand">
            <span className="nv-footer-logo">✦</span>
            <div>
              <div className="nv-footer-brand-name">{t('navLogo')}</div>
              <div className="nv-footer-brand-tagline">{t('footerBrandTagline')}</div>
            </div>
          </div>
        </div>
        <div className="nv-footer-columns">
          <div className="nv-footer-col">
            <h4 className="nv-footer-col-title">{t('footerColCurriculum')}</h4>
            <ul className="nv-footer-col-links">
              <li><a href="#part-1">{language === 'en' ? 'Part 01 — Consciousness' : 'Bagian 01 — Kesadaran'}</a></li>
              <li><a href="#part-2">{language === 'en' ? 'Part 02 — Assumption' : 'Bagian 02 — Asumsi'}</a></li>
              <li><a href="#part-3">{language === 'en' ? 'Part 03 — Feeling' : 'Bagian 03 — Perasaan'}</a></li>
              <li><a href="#part-4">{language === 'en' ? 'Part 04 — Silence' : 'Bagian 04 — Diam'}</a></li>
              <li><a href="#part-5">{language === 'en' ? 'Part 05 — States' : 'Bagian 05 — Kondisi'}</a></li>
            </ul>
          </div>
          <div className="nv-footer-col">
            <h4 className="nv-footer-col-title">{t('footerColResources')}</h4>
            <ul className="nv-footer-col-links">
              <li><a href="#bonus">{t('essentialBooks')}</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">{language === 'en' ? 'Guided Meditations' : 'Meditasi Panduan'}</a></li>
            </ul>
          </div>
          <div className="nv-footer-col">
            <h4 className="nv-footer-col-title">{t('footerColLegal')}</h4>
            <ul className="nv-footer-col-links">
              <li><a href="#">{language === 'en' ? 'Terms & Conditions' : 'Syarat & Ketentuan'}</a></li>
              <li><a href="#">{language === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi'}</a></li>
              <li><a href="#">{language === 'en' ? 'Contact' : 'Kontak'}</a></li>
            </ul>
          </div>
        </div>

        {/* ── WhatsApp CTA ── */}
        <div className="nv-footer-wa-cta">
          <a
            href="https://wa.me/628989221700"
            target="_blank"
            rel="noopener noreferrer"
            className="nv-footer-wa-link"
          >
            <svg className="nv-footer-wa-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>{t('askBangNevgo')}</span>
          </a>
        </div>

        <div className="nv-footer-bottom">
          <span>{t('footerRights').replace('{year}', new Date().getFullYear().toString())}</span>
          <span className="nv-footer-bottom-accent">{t('footerMadeWith')}</span>
        </div>

      </footer>

      {/* ─── BACK TO TOP ─── */}
      <AnimatePresence>
        {showBackTop && (
          <motion.button
            className="nv-back-top"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Kembali ke atas"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── LEAD CAPTURE MODAL ─── */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
      />

      {/* ─── COMMUNITY PREVIEW MODAL ─── */}
    </div>
  )
}

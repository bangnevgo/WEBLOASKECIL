'use client'

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ALL_PARTS, BONUS_ITEMS, MARQUEE_ITEMS } from '@/lib/curriculum-data'
import { ALL_PARTS_EN } from '@/lib/curriculum-data-en'
import { useTranslation } from '@/lib/translations'
import { Menu, X } from 'lucide-react'

const EBOOK_ITEMS = [
  { cover: '/images/ebooks/sukses-praktek-hukum-asumsi.jpg', title: 'Sukses Praktek Hukum Asumsi', tag: 'Hukum Asumsi Series' },
  { cover: '/images/ebooks/asumsimu-itu-dahsyat.png', title: 'Asumsimu Itu Dahsyat!', tag: 'Hukum Asumsi Series' },
  { cover: '/images/ebooks/kamu-tidak-akan-hidup-bahagia.jpg', title: 'Kamu Tidak Akan Bahagia Bila Tidak Kaya', tag: 'Joseph Murphy' },
  { cover: '/images/ebooks/memahami-jembatan-peristiwa.jpg', title: 'Memahami Fenomena Jembatan Peristiwa', tag: 'Neville Goddard' },
  { cover: '/images/ebooks/memahami-inner-shadow.png', title: 'Kunci Memahami Inner Shadow', tag: 'Bang Nevgo' },
  { cover: '/images/ebooks/koleksi-6-ebook.jpg', title: 'Koleksi 6 eBook Manifestasi', tag: 'Bundle Lengkap' },
]
import dynamic from 'next/dynamic'
import AiHubSection from '@/components/ai-hub-section'
import FreeDownloadsSection from '@/components/free-downloads-section'
import KnowledgeBank from '@/components/knowledge-bank'
import MiniCourseSection from '@/components/mini-course-section'
import type { GraphNodeTarget } from '@/components/curriculum-graph-view'

const CurriculumGraphView = dynamic(() => import('@/components/curriculum-graph-view'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 flex flex-col items-center justify-center text-neutral-500 text-xs font-mono">
      <span className="animate-spin text-amber-500 text-base mb-2">✦</span>
      Memuat Peta Kurikulum...
    </div>
  ),
})
const LeadCaptureModal = dynamic(() => import('@/components/lead-capture-modal'), { ssr: false })
const TestimoniModal = dynamic(() => import('@/components/testimoni-modal'), { ssr: false })

const customEase = [0.25, 0.46, 0.45, 0.94] as const

const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.06 } }
}

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: customEase } }
}

const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: customEase } }
}

const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: customEase }
}

const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: customEase }
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
      transition={{ duration: 0.4, delay: index * 0.05, ease: customEase }}
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
        transition={{ duration: 0.3, ease: customEase }}
      >
        <p className="nv-faq-answer">{answer}</p>
      </motion.div>
    </motion.div>
  )
}

const partImages = [
  '/images/illustrations/manifestation-journal.webp',
  '/images/neville-profile.webp',
  '/images/illustrations/meditation-imagination.webp',
  '/images/parts/part-4.webp',
  '/images/parts/part-5.webp',
  '/images/parts/part-6.webp',
  '/images/parts/part-7.webp',
  '/images/parts/part-8.webp',
  '/images/parts/part-9.webp',
  '/images/parts/part-10.webp',
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
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showTestimoniModal, setShowTestimoniModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [pendingLesson, setPendingLesson] = useState<{ partId: string; lessonNum: string } | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('register') !== '1') return

    // Defer until after hydration; this URL is only used when a protected
    // lesson redirects an anonymous visitor to the registration form.
    const timer = window.setTimeout(() => setShowLeadModal(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  // Client-only flag to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  const mainRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })

  // Smooth gentle scale without fading hero to 0 opacity (prevents pitch black blank screen on mobile scroll)
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.85])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.98])

  
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

      // Back-to-top visibility & Sticky Mobile Bar
      setShowBackTop(window.scrollY > 600)
      setShowStickyBar(window.scrollY > 350)
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

  // Graph node click → scroll to the related part / open the related lesson
  // (mirrors the behavior of clicking a lesson card directly)
  const handleGraphNodeClick = useCallback((target: GraphNodeTarget) => {
    if (target.type === 'part') {
      const el = document.getElementById(target.partId)
      if (!el) return
      const details = el.querySelector<HTMLDetailsElement>('details.nv-part-cards')
      if (details && !details.open) details.setAttribute('open', '')
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (target.type === 'lesson') {
      const part = curriculumParts.find((p) => p.id === target.partId)
      const lesson = part?.lessons.find((l) => l.num === target.lessonNum)
      if (!part || !lesson) return
      const lessonIdx = part.lessons.findIndex((l) => l.num === target.lessonNum)
      const isLessonFree = part.id === 'part-1' || 
                           (part.id === 'part-2' && (lessonIdx === 0 || lessonIdx === 1)) || 
                           (part.id !== 'part-1' && part.id !== 'part-2' && lessonIdx === 0)
      const isLessonLocked = isMounted ? (!leadRegistered && !isLessonFree) : !isLessonFree
      if (isLessonLocked) {
        setPendingLesson({ partId: part.id, lessonNum: lesson.num })
        setShowLeadModal(true)
      } else {
        useAppStore.getState().openLesson(part.id, lesson.num)
      }
      return
    }
    if (target.type === 'section') {
      document.getElementById(target.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (target.type === 'url') {
      window.open(target.url, '_blank', 'noopener,noreferrer')
    }
  }, [curriculumParts, isMounted, leadRegistered])

  return (
    <div className="nv-page" ref={mainRef}>
      {/* Floating Header */}
      <header className="w-full bg-[#0a0a0c]/90 backdrop-blur-md border-b border-neutral-900 fixed top-0 left-0 right-0 z-[100] px-3.5 sm:px-6 py-3 sm:py-3.5">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer min-w-0 shrink" onClick={scrollToTop}>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#d4a053] flex items-center justify-center text-black font-extrabold shadow-md shrink-0 text-xs sm:text-sm">✦</div>
            <span className="font-outfit font-extrabold text-[11px] min-[380px]:text-xs sm:text-base text-[#e8e4dc] tracking-tight truncate leading-tight">{t('navLogo')}</span>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Mother Website Link */}
            <a
              href="https://nevgoinstitute.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-[#ffd27d] text-xs font-bold rounded-lg transition"
              title="Kunjungi Website Utama Nevgo Institute"
            >
              <span>🏛️ Nevgo Institute</span>
              <span className="text-[10px] text-[#d4a053]">↗</span>
            </a>

            {/* Toko & Event Lynk.id Link */}
            <a
              href="https://lynk.id/bangnevgo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-[#e8e4dc] text-xs font-bold rounded-lg transition"
              title="Toko Ebook, Event & Produk Digital Bang Nevgo"
            >
              <span>🛒 Toko & Event</span>
              <span className="text-[10px] text-[#d4a053]">↗</span>
            </a>

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
                  className="text-xs text-neutral-400 hover:text-white transition bg-transparent border-none cursor-pointer px-2 py-1"
                  onClick={() => setView('login')}
                >
                  {t('login')}
                </button>
                <button 
                  className="px-4 py-1.5 bg-[#d4a053] hover:bg-[#c4883a] text-black text-xs font-bold rounded-lg transition cursor-pointer"
                  onClick={() => setShowLeadModal(true)}
                >
                  {t('register')}
                </button>
              </>
            )}
          </div>

          {/* Mobile Actions & Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Toggle (compact) */}
            <div className="relative flex items-center bg-neutral-950 border border-neutral-800 rounded-full p-0.5 w-[64px] h-7 shrink-0">
              <div 
                className="absolute top-0.5 bottom-0.5 rounded-full bg-[#d4a053] shadow transition-all duration-300 ease-out"
                style={{
                  left: language === 'id' ? '2px' : '32px',
                  width: '30px',
                }}
              />
              <button 
                className={`flex-1 text-[10px] font-extrabold text-center z-10 transition-colors duration-200 cursor-pointer ${
                  language === 'id' ? 'text-black' : 'text-neutral-400'
                }`}
                onClick={() => setLanguage('id')}
              >
                ID
              </button>
              <button 
                className={`flex-1 text-[10px] font-extrabold text-center z-10 transition-colors duration-200 cursor-pointer ${
                  language === 'en' ? 'text-black' : 'text-neutral-400'
                }`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </div>

            {/* Hamburger Button */}
            <button
              className="p-2 text-[#e8e4dc] hover:text-white bg-neutral-900/90 border border-neutral-800 rounded-lg flex items-center justify-center transition cursor-pointer min-w-[38px] min-h-[38px]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu Navigasi"
            >
              {mobileMenuOpen ? <X size={20} className="text-[#d4a053]" /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden fixed top-[60px] left-0 right-0 bg-[#0a0a0c]/98 border-b border-neutral-800 backdrop-blur-xl z-[99] px-5 py-4 shadow-2xl overflow-y-auto max-h-[85vh]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-3.5">
                {/* Primary Actions */}
                {isAuthenticated ? (
                  <button
                    className="w-full py-3 bg-[#d4a053]/15 hover:bg-[#d4a053]/25 border border-[#d4a053]/40 text-[#d4a053] font-bold rounded-xl transition text-sm flex items-center justify-center gap-2"
                    onClick={() => { setMobileMenuOpen(false); setView('dashboard'); }}
                  >
                    <span>✦</span> {t('myDashboard')}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      className="py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold rounded-xl transition"
                      onClick={() => { setMobileMenuOpen(false); setView('login'); }}
                    >
                      {t('login')}
                    </button>
                    <button
                      className="py-2.5 bg-[#d4a053] hover:bg-[#c4883a] text-black text-xs font-bold rounded-xl transition shadow-md"
                      onClick={() => { setMobileMenuOpen(false); setShowLeadModal(true); }}
                    >
                      {t('register')}
                    </button>
                  </div>
                )}

                <hr className="border-neutral-800/80 my-0.5" />

                {/* Toko Digital & Event */}
                <a
                  href="https://lynk.id/bangnevgo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-neutral-900/70 hover:bg-neutral-800/80 border border-neutral-800 text-[#e8e4dc] text-xs font-bold rounded-xl transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <span>🛒</span> Toko Ebook & Event Lynk.id
                  </span>
                  <span className="text-[#d4a053] font-bold">↗</span>
                </a>

                {/* AI Tools Quick Access */}
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5">
                  Tools Manifestasi AI
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="p-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-left text-xs rounded-lg transition"
                    onClick={() => { setMobileMenuOpen(false); setView('ai-manifestation'); }}
                  >
                    <div className="font-bold text-[#d4a053]">✦ Manifestasi</div>
                    <div className="text-[10px] text-neutral-400">Diagnosis Asumsi</div>
                  </button>
                  <button
                    className="p-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-left text-xs rounded-lg transition"
                    onClick={() => { setMobileMenuOpen(false); setView('ai-shadow'); }}
                  >
                    <div className="font-bold text-purple-400">🔮 Shadow Work</div>
                    <div className="text-[10px] text-neutral-400">Bedah Blok Mental</div>
                  </button>
                  <button
                    className="p-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-left text-xs rounded-lg transition"
                    onClick={() => { setMobileMenuOpen(false); setView('ai-limiting-belief'); }}
                  >
                    <div className="font-bold text-amber-400">🧠 Limiting Belief</div>
                    <div className="text-[10px] text-neutral-400">Reprogramming</div>
                  </button>
                  <button
                    className="p-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-left text-xs rounded-lg transition"
                    onClick={() => { setMobileMenuOpen(false); setView('ai-private-session'); }}
                  >
                    <div className="font-bold text-blue-400">💬 Sesi Privat AI</div>
                    <div className="text-[10px] text-neutral-400">Tanya Jawab 24/7</div>
                  </button>
                </div>

                <hr className="border-neutral-800/80 my-0.5" />

                {/* Navigation Links */}
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Navigasi Utama
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <a
                    href="https://nevgoinstitute.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-left py-2 px-3 hover:bg-neutral-900 text-[#ffd27d] rounded-lg transition flex items-center justify-between font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>🏛️ Website Utama (nevgoinstitute.com)</span>
                    <span className="text-[#d4a053] text-[10px]">↗</span>
                  </a>
                  <button
                    className="text-left py-2 px-3 hover:bg-neutral-900 text-neutral-300 rounded-lg transition flex items-center justify-between"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setView('community');
                    }}
                  >
                    <span>💬 Forum Komunitas</span>
                    <span className="text-neutral-500 text-[10px]">Diskusi & Sesi</span>
                  </button>
                  <a
                    href="https://cohort.nevgoinstitute.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-left py-2 px-3 hover:bg-neutral-900 text-neutral-300 rounded-lg transition flex items-center justify-between"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>✦ Kelas Interaktif</span>
                    <span className="text-[#d4a053] text-[10px]">↗</span>
                  </a>
                  <a
                    href="/pendampingan-101.html"
                    className="text-left py-2 px-3 hover:bg-neutral-900 text-neutral-300 rounded-lg transition flex items-center justify-between"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>✦ Pendampingan 101</span>
                    <span className="text-[#d4a053] text-[10px]">↗</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              transition={{ duration: 0.8, ease: customEase }}
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
                      href="https://wa.me/6288989221700"
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
                {/* Subtle Kelas Interaktif + Pendampingan 101 mention in hero */}
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}
                >
                  <a
                    href="https://cohort.nevgoinstitute.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nv-hero-cohort-link"
                  >
                    ✦ {language === 'en' ? 'Interactive Live Class Available' : 'Kelas Interaktif Bang Nevgo'} <span className="nv-hero-cohort-arrow">→</span>
                  </a>
                  <a
                    href="/pendampingan-101.html"
                    className="nv-hero-cohort-link"
                    style={{ borderColor: 'rgba(192,114,92,0.35)', background: 'rgba(192,114,92,0.10)' }}
                  >
                    ✦ {language === 'en' ? '101 Guidance Available — Info' : 'Tersedia Pendampingan 101 — Klik untuk Info'} <span className="nv-hero-cohort-arrow">→</span>
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
                const partEl = document.getElementById(p.id)
                const cards = partEl?.querySelector<HTMLDetailsElement>('details.nv-part-cards')
                if (cards && !cards.open) cards.setAttribute('open', '')
                partEl?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
        <CurriculumGraphView onNodeClick={handleGraphNodeClick} />
        <p className="nv-parts-hint">
          ✦ {language === 'en'
            ? `${curriculumParts.length} modules · ${curriculumParts.reduce((n, p) => n + p.lessons.length, 0)} lessons — click a module to explore its contents`
            : `${curriculumParts.length} modul · ${curriculumParts.reduce((n, p) => n + p.lessons.length, 0)} pelajaran — klik tiap modul untuk melihat isinya`}
        </p>
        {curriculumParts.map((part, partIdx) => {
          const partImage = partImages[partIdx] || partImages[0]

          return (
            <div key={part.id}>
              <div id={part.id} className="nv-part">
              {/* Part Header with Image — seragam Teks Pengantar dulu, lalu Gambar */}
              <div className="nv-part-hero-row">
                <motion.div
                  className="nv-part-hero-text"
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
                  className="nv-part-hero-image"
                  {...fadeInRight}
                  transition={{ ...fadeInRight.transition, delay: 0.15 }}
                >
                  <div className="nv-part-image-frame" style={{ borderColor: `${part.color}33`, aspectRatio: partImageAspectRatios[partIdx] }}>
                    <div className="nv-part-image-glow" style={{ background: `radial-gradient(ellipse at center, ${part.color}22, transparent 70%)` }} />
                    <Image
                      src={partImage}
                      alt={`Ilustrasi ${part.title}`}
                      fill
                      priority={partIdx === 0}
                      className="nv-part-image"
                      sizes="(max-width: 768px) 100vw, 500px"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Connector */}
              <div className="nv-connector" style={{ background: `linear-gradient(90deg, ${part.color}44, ${part.color}11)` }} />

              {/* Lesson Cards — collapsible dropdown (muncul setelah pengantar) */}
              <details className="nv-part-cards" open={partIdx === 0}>
                <summary className="nv-cards-toggle" style={{ borderColor: `${part.color}44` }}>
                  <span className="nv-cards-toggle-label">{part.lessons.length} {language === 'en' ? 'Lessons' : 'Pelajaran'}</span>
                  <span className="nv-cards-toggle-hint">{language === 'en' ? 'Show lessons' : 'Lihat pelajaran'}</span>
                  <span
                    className="nv-cards-toggle-chevron"
                    style={{ color: part.color, borderColor: `${part.color}55`, background: `${part.color}14` }}
                    aria-hidden="true"
                  >▾</span>
                </summary>

              {/* Lesson Cards Grid */}
              <div className="nv-grid">
                {part.lessons.map((lesson, lessonIdx) => {
                  const isLessonFree = part.id === 'part-1' || 
                                       (part.id === 'part-2' && (lessonIdx === 0 || lessonIdx === 1)) || 
                                       (part.id !== 'part-1' && part.id !== 'part-2' && lessonIdx === 0)
                  const isLessonLocked = isMounted ? (!leadRegistered && !isLessonFree) : !isLessonFree
                  return (
                    <motion.div
                      key={lesson.num}
                      className="nv-card nv-glass nv-glow-border"
                      style={{ position: 'relative', cursor: isLessonLocked ? 'pointer' : 'pointer' }}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.4, delay: lessonIdx * 0.05, ease: customEase }}
                      whileHover={isLessonLocked ? { scale: 1.02 } : { y: -4, transition: { duration: 0.2 } }}
                      onClick={() => {
                        if (isLessonLocked) {
                          setPendingLesson({ partId: part.id, lessonNum: lesson.num })
                          setShowLeadModal(true)
                        } else {
                          useAppStore.getState().openLesson(part.id, lesson.num)
                        }
                      }}
                    >
                      {isLessonLocked && (
                        <span
                          aria-label={language === 'en' ? 'Register Free to unlock' : 'Daftar Free untuk membuka'}
                          style={{
                            position: 'absolute', top: '8px', right: '10px', zIndex: 3,
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '4px 7px', borderRadius: 999,
                            background: 'rgba(5, 5, 7, 0.86)', border: '1px solid rgba(212, 160, 83, 0.45)',
                            color: '#d4a053', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                            pointerEvents: 'none'
                          }}
                        >
                          🔒 {language === 'en' ? 'Register Free' : 'Daftar Free'}
                        </span>
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
              {[2, 5, 8].includes(partIdx) && (
                <motion.aside
                  aria-label={language === 'en' ? 'Cohort invitation' : 'Ajakan Cohort'}
                  style={{
                    maxWidth: '620px',
                    margin: '88px auto 96px',
                    padding: '30px 28px',
                    border: '1px solid rgba(212, 160, 83, 0.22)',
                    borderRadius: '18px',
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(212, 160, 83, 0.13), rgba(212, 160, 83, 0.035) 62%, rgba(255, 255, 255, 0.015))',
                    boxShadow: '0 16px 42px rgba(0, 0, 0, 0.2)',
                    textAlign: 'center',
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45 }}
                >
                  <p style={{ margin: 0, color: 'var(--nv-muted)', fontSize: '0.95rem', lineHeight: 1.75 }}>
                    {partIdx === 2
                      ? (language === 'en'
                        ? 'Knowing the method is only the beginning. The deeper work is returning to the feeling of the wish fulfilled until it feels natural.'
                        : 'Mengetahui metodenya baru permulaan. Pekerjaan yang lebih dalam adalah kembali pada perasaan keinginan yang terwujud sampai terasa alami.')
                      : partIdx === 5
                        ? (language === 'en'
                          ? 'Revision is not only about understanding the past differently. Its power is revealed when you practise it consistently and receive the right guidance.'
                          : 'Revisi bukan hanya soal memahami masa lalu secara berbeda. Kekuatannya terasa ketika kamu mempraktikkannya dengan konsisten dan mendapat arahan yang tepat.')
                        : (language === 'en'
                          ? 'Imagination creates, the future can be entered now, and the old self can be released. The real work is learning to live from that new identity.'
                          : 'Imajinasi mencipta, masa depan dapat dimasuki sekarang, dan diri lama dapat dilepaskan. Pekerjaan sesungguhnya adalah belajar hidup dari identitas yang baru itu.')}
                  </p>
                  <a
                    href="https://cohort.nevgoinstitute.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '14px',
                      padding: '7px 13px', border: '1px solid rgba(212, 160, 83, 0.5)', borderRadius: '999px',
                      background: 'rgba(212, 160, 83, 0.06)', color: 'var(--nv-gold)',
                      fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.01em', textDecoration: 'none',
                    }}
                  >
                    {language === 'en'
                      ? '✦ Explore Cohort →'
                      : '✦ Lihat Cohort →'}
                  </a>
                  <br />
                  <a
                    href="/pendampingan-101.html"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '10px',
                      padding: '7px 13px', border: '1px solid rgba(192, 114, 92, 0.5)', borderRadius: '999px',
                      background: 'rgba(192, 114, 92, 0.08)', color: '#d18a76',
                      fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.01em', textDecoration: 'none',
                    }}
                  >
                    {language === 'en'
                      ? '✦ 101 Personal Guidance →'
                      : '✦ Pendampingan 101 →'}
                  </a>
                </motion.aside>
              )}
              </details>
            </div>

            {/* ─── NEVGO LEARNING ECOSYSTEM INFOGRAPHIC (ANTARA BAGIAN 02 & 03) ─── */}
            {partIdx === 1 && (
              <motion.div
                className="nv-ecosystem-banner"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="nv-banner-header">
                  <span
                    className="nv-pricing-cta-badge"
                    style={{
                      background: 'rgba(212,160,83,0.12)',
                      color: 'var(--nv-gold)',
                      padding: '5px 12px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      display: 'inline-block',
                    }}
                  >
                    ✦ {language === 'en' ? 'LEARNING ECOSYSTEM FRAMEWORK' : 'STRUKTUR EKOSISTEM · LEARNING FRAMEWORK'}
                  </span>
                  <h3 className="nv-banner-title">
                    {language === 'en' ? 'Nevgo Learning Ecosystem' : 'Ekosistem Platform Belajar Nevgo'}
                  </h3>
                  <p className="nv-banner-desc">
                    {language === 'en'
                      ? 'An integrated learning architecture connecting free inspiration, curriculum modules, practical tools, interactive classes, to 1-on-1 personal guidance.'
                      : 'Satu arsitektur pembelajaran terpadu yang menghubungkan inspirasi gratis, modul kurikulum, materi terapan, kelas interaktif, hingga pendampingan personal.'}
                  </p>
                </div>

                <div className="nv-banner-media-wrap">
                  <Image
                    src="/images/nevgo-learning-ecosystem.webp"
                    alt="Infografis enam jalur belajar dalam Nevgo Learning Ecosystem"
                    width={1672}
                    height={941}
                    className="w-full h-auto object-contain block"
                    sizes="(max-width: 768px) 100vw, 1000px"
                  />
                </div>
              </motion.div>
            )}

            {/* ─── VIDEO TOUR / TEASER MINI COURSE (ANTARA BAGIAN 04 & 05) ─── */}
            {partIdx === 3 && (
              <motion.div
                className="nv-video-teaser-banner"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="nv-banner-header">
                  <span
                    className="nv-pricing-cta-badge"
                    style={{
                      background: 'rgba(212,160,83,0.12)',
                      color: 'var(--nv-gold)',
                      padding: '5px 12px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      display: 'inline-block',
                    }}
                  >
                    🎬 {language === 'en' ? 'PLATFORM TOUR & VIDEO PREVIEW' : 'TOUR PLATFORM & VIDEO PREVIEW'}
                  </span>
                  <h3 className="nv-banner-title">
                    {language === 'en'
                      ? 'Explore Mini Course: Asumsimu Itu Dahsyat'
                      : 'Lihat Isi Lengkap Mini Course (Tour 2 Menit)'}
                  </h3>
                  <p className="nv-banner-desc">
                    {language === 'en'
                      ? 'A 2-minute overview of the 5 masterclass modules, 20 ebooks, 12 webinar recordings, meditation audio, and 24/7 Nevi AI.'
                      : 'Simak penjelasan 4 modul inti + 1 bridging, brankas 20 ebook, 12 rekaman webinar eksklusif, audio meditasi, hingga asisten Nevi AI.'}
                  </p>
                </div>

                <div className="nv-video-media-wrap">
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    className="nv-video-player"
                    src="https://audio.nevgoinstitute.com/nevgo-minicourse-videos/Promo_Mini_Course_Asumsimu_Itu_Dahsyat.mp4"
                  >
                    Browser Anda tidak mendukung pemutaran video HTML5.
                  </video>
                </div>

                {/* ── CTA Bubble Hijau — Aktifkan Trial 7 Hari ── */}
                <div className="nv-green-bubble-wrap">
                  <motion.a
                    href="https://course.nevgoinstitute.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nv-green-bubble-cta"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span style={{ fontSize: '1.05rem' }}>✦</span>
                    <span>{language === 'en' ? 'Aktifkan Trial 7 Hari Bebas Biaya →' : 'Aktifkan Trial 7 Hari Bebas Biaya →'}</span>
                  </motion.a>
                  <span className="nv-green-bubble-sub">
                    {language === 'en'
                      ? 'Akses instan 7 hari · Tanpa komitmen · Langsung coba modul & materi'
                      : 'Akses instan 7 hari · Tanpa komitmen · Langsung coba modul & materi'}
                  </span>
                </div>
              </motion.div>
            )}
            </div>
          )
        })}
        {/* ─── MINI COURSE SECTION ─── */}
        <MiniCourseSection />

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

            {/* Testimonial & Real WA Screenshot Evidence Teaser Card */}
            <div className="nv-cohort-testimonial nv-glass flex flex-col items-center text-center" style={{ marginTop: '32px', padding: '24px 28px', borderRadius: '16px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--nv-text)', fontStyle: 'italic' }}>
                {language === 'en'
                  ? '"After 1 month I stopped hoping and started living from the end. My first manifestation landed before the batch even ended."'
                  : '"Setelah 1 bulan, saya berhenti berharap dan mulai hidup dari akhir. Manifestasi pertama saya nyata sebelum batch selesai."'}
              </p>
              <p style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--nv-gold)', fontWeight: 700 }}>
                {language === 'en' ? '— Peserta Cohort Batch 3' : '— Peserta Cohort Batch 3'}
              </p>

              {/* WA Screenshots Teaser Grid */}
              <div className="mt-4 pt-4 border-t border-[#d4a053]/20 flex flex-col items-center gap-3 w-full">
                <span className="text-xs font-bold text-[#e5b869]">
                  📸 {language === 'en' ? 'Proof of Real Student Results (35+ WA Screenshots)' : 'Bukti Hasil Nyata Mentoring & Praktek Murid (35+ WA Screenshot)'}
                </span>
                <div className="flex items-center justify-center gap-3 w-full max-w-md">
                  <div
                    onClick={() => setShowTestimoniModal(true)}
                    className="relative w-20 h-24 rounded-lg overflow-hidden border border-[#d4a053]/40 shadow-lg cursor-pointer transform hover:scale-105 transition-transform bg-black/60"
                  >
                    <img src="/testimoni/testimoni-01.jpeg" alt="Testimoni 1" className="w-full h-full object-cover" />
                  </div>
                  <div
                    onClick={() => setShowTestimoniModal(true)}
                    className="relative w-20 h-24 rounded-lg overflow-hidden border border-[#d4a053]/40 shadow-lg cursor-pointer transform hover:scale-105 transition-transform bg-black/60"
                  >
                    <img src="/testimoni/testimoni-05.jpeg" alt="Testimoni 2" className="w-full h-full object-cover" />
                  </div>
                  <div
                    onClick={() => setShowTestimoniModal(true)}
                    className="relative w-20 h-24 rounded-lg overflow-hidden border border-[#d4a053]/40 shadow-lg cursor-pointer transform hover:scale-105 transition-transform bg-black/60"
                  >
                    <img src="/testimoni/testimoni-10.jpeg" alt="Testimoni 3" className="w-full h-full object-cover" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTestimoniModal(true)}
                  className="mt-1 px-4 py-2 text-xs font-bold text-black rounded-lg bg-gradient-to-r from-[#d4a053] to-[#b8862d] hover:opacity-90 transition-opacity shadow-md flex items-center gap-1.5"
                >
                  <span>💬 {language === 'en' ? 'Read 35+ Full WA Testimonials →' : 'Baca 35+ Testimoni WA Hasil Nyata Murid →'}</span>
                </button>
              </div>
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
                  {language === 'en' ? 'Join Cohort →' : 'Gabung Cohort →'}
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
          <div className="flex justify-center mt-6">
            <a
              href="https://lynk.id/bangnevgo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4a053] hover:bg-[#c39043] text-black font-extrabold text-sm sm:text-base rounded-full shadow-lg transition hover:scale-105"
            >
              <span>🛒 Buka Toko Digital, Ebook & Event Bang Nevgo</span>
              <span>↗</span>
            </a>
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

        {/* ─── PREMIUM SERVICES SECTION ─── */}
        <div id="services" className="nv-part" style={{ marginTop: 80 }}>
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="nv-pricing-cta-badge" style={{ background: 'rgba(212,160,83,0.1)', color: 'var(--nv-gold)', padding: '6px 14px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              {language === 'en' ? '✦ PREMIUM PROGRAMS & SERVICES' : '✦ PROGRAM & LAYANAN PREMIUM'}
            </span>
            <h2 className="font-outfit font-extrabold text-2xl sm:text-4xl text-[#e8e4dc] mt-4 mb-4">
              {language === 'en' ? 'Deepen Your Consciousness Journey' : 'Perdalam Perjalanan Kesadaranmu'}
            </h2>
            <p className="max-w-[700px] mx-auto text-sm sm:text-base text-neutral-400 leading-relaxed">
              {language === 'en'
                ? 'Choose the level of guidance and resources that fits your current Law of Assumption practice.'
                : 'Pilih tingkat pendampingan batin dan materi yang sesuai dengan latihan Hukum Asumsimu saat ini.'}
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto" style={{ marginTop: 40 }}>
            {/* Single Combined Flyer Card: Private Zoom & Live Coaching */}
            <motion.div
              className="nv-cohort-card nv-glass p-4 sm:p-6 rounded-2xl flex flex-col"
              whileHover={{ y: -4, borderColor: 'rgba(212,160,83,0.4)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <a
                href={'https://wa.me/6288989221700?text=' + encodeURIComponent('Halo Bang Nevgo, saya ingin konsultasi gratis 30 menit. Tolong bantu pilih program yang cocok.')}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-6 rounded-xl overflow-hidden shadow-2xl border border-white/5"
              >
                <img
                  src="/flyers/private-zoom-flyer.png"
                  alt="Private Zoom — Live Coaching On Demand Bersama Bang Nevgo"
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="w-full h-auto rounded-xl object-contain hover:scale-[1.01] transition-transform duration-300"
                />
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={'https://wa.me/6288989221700?text=' + encodeURIComponent('Halo Bang Nevgo, saya ingin mendaftar ikut konsultasi 2 jam (BN Mentoring).')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-3 px-4 bg-[#d4a053] hover:bg-[#c39043] text-black font-extrabold text-xs sm:text-sm rounded-xl transition block shadow-md"
                  style={{ textDecoration: 'none' }}
                >
                  ⚡ {language === 'en' ? 'Book Sesi 2 Jam (Rp 500k)' : 'Daftar Sesi Privat 2 Jam (Rp 500rb)'}
                </a>
                <a
                  href={'https://wa.me/6288989221700?text=' + encodeURIComponent('Halo Bang Nevgo, saya ingin ambil kelas Zoom 101.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-3 px-4 bg-[#25d366] hover:bg-[#20ba5a] text-white font-extrabold text-xs sm:text-sm rounded-xl transition block shadow-md"
                  style={{ textDecoration: 'none' }}
                >
                  ⚡ {language === 'en' ? 'Book Live Coaching 4 Sesi (Rp 1M)' : 'Daftar Live Coaching 4 Sesi (Rp 1jt)'}
                </a>
              </div>

              <a
                href="https://loas.nevgoinstitute.com/pendampingan-101.html"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full text-center py-3.5 px-4 bg-gradient-to-r from-[#d4a053]/20 via-[#d4a053]/30 to-[#d4a053]/20 hover:from-[#d4a053]/30 hover:to-[#d4a053]/40 border border-[#d4a053]/50 text-[#f5d590] font-extrabold text-xs sm:text-sm rounded-xl transition block shadow-lg hover:shadow-[#d4a053]/10"
                style={{ textDecoration: 'none' }}
              >
                👑 {language === 'en' ? 'Explore Private 101 — Non-Zoom Mentoring →' : 'Detail Private 101 — Non-Zoom (Pendampingan) →'}
              </a>
            </motion.div>

          </div>

          {/* Opsi lain: Private 101 — Non-Zoom + banner konsultasi WA */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-400">
              {language === 'en' ? 'Looking for full 1-on-1 mentorship? ' : 'Butuh pendampingan privat intensif 1-on-1? '}
              <a
                href="https://loas.nevgoinstitute.com/pendampingan-101.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d4a053] font-bold hover:underline"
                style={{ textDecoration: 'none' }}
              >
                {language === 'en' ? 'View Private 101 — Non-Zoom Mentoring' : 'Lihat Private 101 — Non-Zoom (Pendampingan)'}
              </a>
              {language === 'en' ? ' · or consult with us directly.' : ' · atau konsultasikan langsung.'}
            </p>
            <a
              href={'https://wa.me/6288989221700?text=' + encodeURIComponent('Halo Bang Nevgo, saya ingin konsultasi gratis 30 menit. Tolong bantu pilih program yang cocok.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-6 py-3 bg-[#25d366] hover:bg-[#20ba5a] text-white font-extrabold text-sm rounded-xl transition"
              style={{ textDecoration: 'none' }}
            >
              💬 {language === 'en' ? 'Free 30-Min Consultation / Guidance via WhatsApp' : 'Konsultasi Gratis 30 Menit / Bimbingan via WhatsApp'}
            </a>
          </div>

          {/* 🏛️ Founder & Mother Institute Section */}
          <div className="mt-16 max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#16120b] to-[#090807] border border-[#d4a053]/30 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#d4a053] to-[#7a4f1a] flex items-center justify-center font-black text-neutral-950 text-xl sm:text-2xl shadow-xl shrink-0">
                BN
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-outfit font-extrabold text-lg sm:text-xl text-white m-0">Bang Nevgo</h3>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ffd27d] bg-[#d4a053]/20 px-2 py-0.5 rounded-full border border-[#d4a053]/30">
                    Founder Nevgo Institute
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed m-0">
                  Praktisi & Peneliti Hukum Asumsi Neville Goddard, Rekayasa Realitas Batin, dan Transformasi Pola Pikir. Didirikan sebagai ekosistem pembelajaran batin terstruktur di Indonesia.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <a
                    href="https://nevgoinstitute.com/bang-nevgo/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#d4a053] text-neutral-950 hover:bg-[#c49247] transition shadow-md"
                  >
                    <span>Profil & Riset Bang Nevgo</span>
                    <span className="text-xs">↗</span>
                  </a>
                  <a
                    href="https://nevgoinstitute.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 border border-neutral-700 text-[#e8e4dc] hover:text-white hover:border-neutral-500 transition"
                  >
                    <span>Kunjungi Website Utama (nevgoinstitute.com)</span>
                    <span className="text-xs text-[#d4a053]">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── FAQ SECTION ─── */}
        <motion.section
          id="faq"
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
                href={`https://cohort.nevgoinstitute.com/blog.html#${a.slug}`}
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
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#part-1">{language === 'en' ? 'Guided Meditations' : 'Meditasi Panduan'}</a></li>
            </ul>
          </div>
          <div className="nv-footer-col">
            <h4 className="nv-footer-col-title">Nevgo Institute</h4>
            <ul className="nv-footer-col-links">
              <li><a href="https://nevgoinstitute.com" target="_blank" rel="noopener noreferrer">Website Utama (nevgoinstitute.com) ↗</a></li>
              <li><a href="https://nevgoinstitute.com/artikel" target="_blank" rel="noopener noreferrer">Hub Artikel &amp; GEO ↗</a></li>
              <li><a href="https://course.nevgoinstitute.com/" data-cta-id="mini-course-loas-footer" target="_blank" rel="noopener noreferrer">Mini Course Asumsimu Itu Dahsyat ↗</a></li>
              <li><a href="https://cohort.nevgoinstitute.com" target="_blank" rel="noopener noreferrer">{language === 'en' ? 'Interactive Live Class ↗' : 'Kelas Interaktif ↗'}</a></li>
              <li><a href="https://lynk.id/bangnevgo" target="_blank" rel="noopener noreferrer">Toko Ebook &amp; Event ↗</a></li>
            </ul>
          </div>
          <div className="nv-footer-col">
            <h4 className="nv-footer-col-title">{t('footerColLegal')}</h4>
            <ul className="nv-footer-col-links">
              <li><a href="https://wa.me/6288989221700" target="_blank" rel="noopener noreferrer">{language === 'en' ? 'Terms & Conditions' : 'Syarat & Ketentuan'}</a></li>
              <li><a href="https://wa.me/6288989221700" target="_blank" rel="noopener noreferrer">{language === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi'}</a></li>
              <li><a href="https://wa.me/6288989221700" target="_blank" rel="noopener noreferrer">{language === 'en' ? 'Contact' : 'Kontak'}</a></li>
            </ul>
          </div>
        </div>

        {/* ── WhatsApp CTA ── */}
        <div className="nv-footer-wa-cta">
          <a
            href="https://wa.me/6288989221700"
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
          <span>{t('footerRights').replace('{year}', new Date().getFullYear().toString())} · Mother Website: <a href="https://nevgoinstitute.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--nv-gold)', textDecoration: 'underline' }}>nevgoinstitute.com</a></span>
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
            transition={{ duration: 0.25, ease: customEase }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Kembali ke atas"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── STICKY MOBILE CONVERSION BAR ─── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            className="nv-mobile-sticky-bar md:hidden"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#0b1410]/95 backdrop-blur-md border-t border-[#d4a053]/35 shadow-2xl">
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">10 Modul LOAS Neville Goddard</p>
                <p className="text-[10px] text-[#d4a053] font-medium">49 Pelajaran Bebas Biaya</p>
              </div>
              <button
                onClick={() => setShowLeadModal(true)}
                className="flex-shrink-0 px-3.5 py-2 text-xs font-bold text-black rounded-lg bg-gradient-to-r from-[#d4a053] to-[#b8862d] shadow-lg active:scale-95 transition-transform"
              >
                {language === 'en' ? 'Register Free' : 'Daftar Gratis (Akses 10 Modul)'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── LEAD CAPTURE MODAL ─── */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => {
          setShowLeadModal(false)
          setPendingLesson(null)
        }}
        onRegistered={pendingLesson ? () => {
          setShowLeadModal(false)
          useAppStore.getState().openLesson(pendingLesson.partId, pendingLesson.lessonNum)
          setPendingLesson(null)
        } : undefined}
        onStartLearning={() => {
          setShowLeadModal(false)
          window.setTimeout(() => {
            document.getElementById('part-1')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 0)
        }}
      />

      {/* ─── TESTIMONI LIGHTBOX MODAL ─── */}
      <TestimoniModal
        isOpen={showTestimoniModal}
        onClose={() => setShowTestimoniModal(false)}
      />

      {/* ─── COMMUNITY PREVIEW MODAL ─── */}
    </div>
  )
}

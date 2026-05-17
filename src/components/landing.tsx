'use client'

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ALL_PARTS, BONUS_ITEMS, MARQUEE_ITEMS, isLessonFree } from '@/lib/curriculum-data'

const EBOOK_ITEMS = [
  { cover: '/images/ebooks/sukses-praktek-hukum-asumsi.jpg', title: 'Sukses Praktek Hukum Asumsi', tag: 'Hukum Asumsi Series' },
  { cover: '/images/ebooks/asumsimu-itu-dahsyat.png', title: 'Asumsimu Itu Dahsyat!', tag: 'Hukum Asumsi Series' },
  { cover: '/images/ebooks/kamu-tidak-akan-hidup-bahagia.jpg', title: 'Kamu Tidak Akan Bahagia Bila Tidak Kaya', tag: 'Joseph Murphy' },
  { cover: '/images/ebooks/memahami-jembatan-peristiwa.jpg', title: 'Memahami Fenomena Jembatan Peristiwa', tag: 'Neville Goddard' },
  { cover: '/images/ebooks/memahami-inner-shadow.png', title: 'Kunci Memahami Inner Shadow', tag: 'Bang Nevgo' },
  { cover: '/images/ebooks/koleksi-6-ebook.jpg', title: 'Koleksi 6 eBook Manifestasi', tag: 'Bundle Lengkap' },
]
import LockedLessonModal from '@/components/locked-lesson-modal'
import AiHubSection from '@/components/ai-hub-section'

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
  const { setView } = useAppStore()
  const isAdmin = useAppStore((s) => s.isAdmin)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showBackTop, setShowBackTop] = useState(false)
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
      const sections = ALL_PARTS.map(p => document.getElementById(p.id)).filter(Boolean) as HTMLElement[]
      const bonusEl = document.getElementById('bonus')
      if (bonusEl) sections.push(bonusEl)

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
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="nv-page" ref={mainRef}>
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
                <span className="nv-ai-hero-cta-text">Analisa Perjalanan Manifestasimu</span>
                <span className="nv-ai-hero-cta-badge">(AI Powered)</span>
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
                <span className="nv-hero-logo-inner">✦</span>
              </motion.div>

              <motion.div className="nv-hero-title" variants={staggerContainer} initial="initial" animate="animate">
                <motion.span className="nv-hero-top" variants={fadeInUp}>Neville Goddard</motion.span>
                <motion.span className="nv-hero-main" variants={fadeInUp}>HUKUM ASUMSI</motion.span>
                <motion.span className="nv-hero-sub" variants={fadeInUp}>(Ajaran &amp; Praktik)</motion.span>
              </motion.div>

              <motion.div
                className="nv-hero-mark nv-glass"
                variants={scaleIn}
                initial="initial"
                animate="animate"
              >
                <div className="nv-hero-mark-accent" />
                <p className="nv-hero-mark-quote">
                  &ldquo;Sebuah asumsi, meskipun salah, jika <em>terus dipegang teguh</em>, akan mengeras menjadi fakta.
                  Manusia, dengan mengasumsikan perasaan dari keinginan yang telah terwujud, mengubah masa depannya
                  selaras dengan asumsinya.&rdquo;
                </p>
                <p className="nv-hero-mark-source">— LIMA PELAJARAN · PELAJARAN 1 · 1948</p>
              </motion.div>

              <motion.div
                className="nv-hero-meta"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <span className="nv-meta-item">
                  <span className="nv-meta-label">KURIKULUM</span>
                </span>
                <span className="nv-meta-sep">·</span>
                <span className="nv-meta-item">
                  <span className="nv-meta-accent">10</span>
                  <span className="nv-meta-label">BAGIAN</span>
                </span>
                <span className="nv-meta-sep">·</span>
                <span className="nv-meta-item">
                  <span className="nv-meta-accent">49</span>
                  <span className="nv-meta-label">PELAJARAN</span>
                </span>
                <span className="nv-meta-sep">·</span>
                <span className="nv-meta-item">
                  <span className="nv-meta-label">15+ BUKU &amp; 200+ KULIAH</span>
                </span>
              </motion.div>

              <motion.button
                className="nv-cta-button nv-cta-pulse"
                onClick={() => setView('pricing')}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <span className="nv-cta-icon">✦</span>
                Dapatkan Akses Penuh — Berlangganan Sekarang
              </motion.button>
            </div>
          </div>


        </motion.section>
      </div>

      {/* ─── STICKY NAV ─── */}
      <nav className="nv-nav">
        <div className="nv-nav-inner">
          {ALL_PARTS.map((p) => (
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
            <span className="nv-nav-text">Buku-Buku Esensial</span>
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
        {ALL_PARTS.map((part, partIdx) => {
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
                  const free = isLessonFree(lesson.num)
                  return (
                    <motion.div
                      key={lesson.num}
                      className="nv-card nv-glass nv-glow-border"
                      style={{ position: 'relative', cursor: 'pointer' }}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.4, delay: lessonIdx * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      onClick={() => {
                        const hasAccess = free || useAppStore.getState().hasFullAccess()
                        if (hasAccess) {
                          useAppStore.getState().openFreeLesson(lesson.num)
                        } else {
                          useAppStore.getState().openLockedLesson({
                            num: lesson.num,
                            title: lesson.title,
                            bullets: lesson.bullets,
                            partColor: part.color,
                            partTitle: part.title,
                          })
                        }
                      }}
                    >
                      {free && <span className="nv-card-free-badge">GRATIS ✦</span>}
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
                      {!free && (
                        <div className="nv-card-locked-overlay">
                          <span className="nv-card-locked-icon">🔒</span>
                        </div>
                      )}
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

        {/* ─── AI HUB after Part 10 ─── */}
        <AiHubSection />

        <motion.div
          className="nv-illust-divider"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="nv-illust-divider-imgs">
            <div className="nv-illust-divider-frame nv-illust-divider-frame-left">
              <Image
                src="/images/illustrations/meditation-imagination.webp"
                alt="Meditasi"
                fill
                className="nv-illust-divider-img"
                sizes="(max-width: 768px) 50vw, 300px"
              />
            </div>
            <div className="nv-illust-divider-center">
              <span className="nv-illust-divider-glyph">✦</span>
              <p className="nv-illust-divider-text">Mulailah dari dalam,<br />maka dunia luar mengikuti</p>
            </div>
            <div className="nv-illust-divider-frame nv-illust-divider-frame-right">
              <Image
                src="/images/illustrations/manifestation-journal.webp"
                alt="Jurnal Afirmasi"
                fill
                className="nv-illust-divider-img"
                sizes="(max-width: 768px) 50vw, 300px"
              />
            </div>
          </div>
        </motion.div>

        {/* ─── PRICING CTA SECTION ─── */}
        <motion.div
          className="nv-pricing-cta-section nv-glass"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="nv-pricing-cta-glow" />
          <div className="nv-pricing-cta-content">
            <span className="nv-pricing-cta-badge">AKSES PENUH</span>
            <h2 className="nv-pricing-cta-title">Buka Kurikulum Lengkap</h2>
            <p className="nv-pricing-cta-desc">
              Berlangganan untuk mendapatkan akses ke seluruh 49 pelajaran terperinci dengan ajaran lengkap, kutipan bersumber, praktik harian, dan poin-poin penting dari seluruh karya Neville Goddard.
            </p>
            <motion.button
              className="nv-cta-button nv-cta-pulse"
              onClick={() => setView('pricing')}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="nv-cta-icon">✦</span>
              Lihat Paket Berlangganan →
            </motion.button>
          </div>
        </motion.div>

        {/* ─── EBOOK ETALASE (MARQUEE) ─── */}
        <div className="nv-ebook-etalase-section">
          <motion.div
            className="nv-ebook-etalase-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="nv-ebook-etalase-badge">✦ KOLEKSI eBOOK</span>
            <h2 className="nv-ebook-etalase-title">eBook Panduan Manifestasi</h2>
            <p className="nv-ebook-etalase-subtitle">Koleksi eBook berbayar oleh Bang Nevgo — praktis, bersumber, dan siap membantu perjalanan manifestasimu</p>
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
              <h2>✦ Buku &amp; Kuliah Esensial</h2>
              <span className="nv-bonus-badge">11 SUMBER DAYA</span>
            </div>
            <p className="nv-bonus-desc">
              Arsip teks lengkap gratis tersedia di{' '}
              <a href="https://coolwisdombooks.com/neville/" target="_blank" rel="noopener noreferrer" className="nv-bonus-link">
                coolwisdombooks.com/neville
              </a>
              . Seluruh karya Neville dari tahun 1939–1972.
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
            <h2 className="nv-faq-title">Pertanyaan yang Sering Diajukan</h2>
            <p className="nv-faq-subtitle">Jawaban untuk pertanyaan umum tentang Hukum Asumsi dan kurikulum ini</p>
          </div>
          <div className="nv-faq-list">
            {[
              {
                q: 'Apa itu Hukum Asumsi?',
                a: 'Hukum Asumsi adalah prinsip inti dari ajaran Neville Goddard yang menyatakan bahwa sebuah asumsi, meskipun salah, jika terus dipegang teguh akan mengeras menjadi fakta. Dengan mengasumsikan perasaan dari keinginan yang telah terwujud, Anda mengubah masa depan selaras dengan asumsi tersebut.',
              },
              {
                q: 'Apakah saya perlu latar belakang agama?',
                a: 'Tidak. Ajaran Neville bersifat universal dan dapat diterapkan oleh siapa saja tanpa memandang latar belakang agama atau keyakinan. Meskipun Neville menggunakan bahasa alkitabiah dalam kuliahnya, prinsip-prinsipnya bersifat praktis dan psikologis.',
              },
              {
                q: 'Apa perbedaan paket Pelajar dan Master?',
                a: 'Paket Pelajar memberikan akses ke seluruh 49 pelajaran terperinci dengan ajaran lengkap, kutipan bersumber, dan praktik harian. Paket Master menambahkan akses ke arsip 200+ kuliah asli, panduan praktik lanjutan, dan pembaruan materi secara berkala.',
              },
              {
                q: 'Bagaimana teknik SATS bekerja?',
                a: 'SATS (State Akin To Sleep) adalah teknik meditasi di mana Anda memasuki kondisi rileks antara terjaga dan tidur, lalu membayangkan adegan yang menyiratkan keinginan Anda telah terwujud. Dalam kondisi ini, pikiran bawah sadar paling reseptif terhadap sugesti baru.',
              },
              {
                q: 'Apakah saya bisa membatalkan langganan?',
                a: 'Ya, Anda dapat membatalkan kapan saja tanpa penalti. Akses Anda akan tetap aktif hingga akhir periode berlangganan yang telah dibayar. Tidak ada biaya tersembunyi atau komitmen jangka panjang.',
              },
              {
                q: 'Dari mana sumber materi ini?',
                a: 'Seluruh materi bersumber dari 15+ buku dan 200+ kuliah asli Neville Goddard dari tahun 1939 hingga 1972. Setiap pelajaran dilengkapi dengan kutipan langsung dan rujukan ke sumber aslinya, memastikan keakuratan dan integritas ajaran.',
              },
            ].map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} index={i} />
            ))}
          </div>
        </motion.section>

        {/* ─── FOOTER CTA ─── */}
        <div className="nv-footer-cta">
          Bersumber secara eksklusif dari{' '}
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
              <div className="nv-footer-brand-name">Hukum Asumsi</div>
              <div className="nv-footer-brand-tagline">Kurikulum Lengkap Ajaran Neville Goddard</div>
            </div>
          </div>
        </div>
        <div className="nv-footer-columns">
          <div className="nv-footer-col">
            <h4 className="nv-footer-col-title">Kurikulum</h4>
            <ul className="nv-footer-col-links">
              <li><a href="#part-1">Bagian 01 — Kesadaran</a></li>
              <li><a href="#part-2">Bagian 02 — Asumsi</a></li>
              <li><a href="#part-3">Bagian 03 — Perasaan</a></li>
              <li><a href="#part-4">Bagian 04 — Diam</a></li>
              <li><a href="#part-5">Bagian 05 — Kondisi</a></li>
            </ul>
          </div>
          <div className="nv-footer-col">
            <h4 className="nv-footer-col-title">Sumber Daya</h4>
            <ul className="nv-footer-col-links">
              <li><a href="#bonus">Buku Esensial</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Meditasi Panduan</a></li>
            </ul>
          </div>
          <div className="nv-footer-col">
            <h4 className="nv-footer-col-title">Legal</h4>
            <ul className="nv-footer-col-links">
              <li><a href="#">Syarat &amp; Ketentuan</a></li>
              <li><a href="#">Kebijakan Privasi</a></li>
              <li><a href="#">Kontak</a></li>
            </ul>
          </div>
        </div>
        <div className="nv-footer-bottom">
          <span>© {new Date().getFullYear()} Hukum Asumsi. Seluruh hak dilindungi.</span>
          <span className="nv-footer-bottom-accent">Dibuat dengan ✦ untuk pencari kebenaran</span>
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

      {/* ─── ADMIN BADGE ─── */}
      {isMounted && isAdmin && (
        <AnimatePresence>
          <motion.div
            className="nv-admin-badge"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            🔓 ADMIN
          </motion.div>
        </AnimatePresence>
      )}

      {/* ─── LOCKED LESSON MODAL ─── */}
      <LockedLessonModal />
    </div>
  )
}

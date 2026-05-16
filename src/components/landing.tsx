'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ALL_PARTS, BONUS_ITEMS, MARQUEE_ITEMS } from '@/lib/curriculum-data'

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

export default function Landing() {
  const { setView } = useAppStore()
  const [activeSection, setActiveSection] = useState<string | null>(null)
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
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
        {ALL_PARTS.map((part, partIdx) => (
          <div key={part.id} id={part.id} className="nv-part">
            {/* Part Header */}
            <motion.div
              className="nv-part-head"
              style={{ borderColor: `${part.color}22` }}
              {...fadeInLeft}
              transition={{ ...fadeInLeft.transition, delay: 0.05 }}
            >
              <span className="nv-part-num" style={{ color: part.color, background: `${part.color}15` }}>{part.num}</span>
              <div className="nv-part-info">
                <h2>{part.title}</h2>
                <span className="nv-part-meta">{part.meta}</span>
              </div>
            </motion.div>

            {/* Connector */}
            <div className="nv-connector" style={{ background: `linear-gradient(90deg, ${part.color}44, ${part.color}11)` }} />

            {/* Lesson Cards Grid */}
            <div className="nv-grid">
              {part.lessons.map((lesson, lessonIdx) => (
                <motion.div
                  key={lesson.num}
                  className="nv-card nv-glass nv-glow-border"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: lessonIdx * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
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
              ))}
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
        ))}

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

        {/* ─── FOOTER CTA ─── */}
        <div className="nv-footer-cta">
          Bersumber secara eksklusif dari{' '}
          <a href="https://coolwisdombooks.com/neville/" target="_blank" rel="noopener noreferrer">
            CoolWisdomBooks — Neville Goddard Archive →
          </a>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="nv-footer">
        <div className="nv-footer-inner">
          <span className="nv-footer-logo">✦</span>
          <span>Neville Goddard · KURIKULUM LENGKAP Hukum Asumsi · 2026</span>
        </div>
      </footer>
    </div>
  )
}

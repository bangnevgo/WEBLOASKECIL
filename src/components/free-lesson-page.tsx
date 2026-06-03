'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ALL_PARTS, FREE_LESSON_NUMS } from '@/lib/curriculum-data'
import { ALL_PARTS_EN } from '@/lib/curriculum-data-en'
import { useTranslation } from '@/lib/translations'
import { toast } from 'sonner'

// Map each free lesson to a thematic illustration with its aspect ratio
const lessonIllustrations: Record<string, { src: string; alt: string; caption: string; aspectRatio: string }> = {
  '1.1': {
    src: '/images/illustrations/manifestation-journal.webp',
    alt: 'Jurnal Manifestasi — Menulis I AM',
    caption: '"I AM" bukan sekadar kata — ia adalah kekuatan kreatif',
    aspectRatio: '1/1',
  },
  '1.2': {
    src: '/images/illustrations/consciousness-creates-world.png',
    alt: 'Kesadaran Menciptakan Realitas',
    caption: 'Dunia luar adalah cerminan dunia dalam',
    aspectRatio: '3/4',
  },
  '1.3': {
    src: '/images/illustrations/meditation-imagination.webp',
    alt: 'Meditasi — Dua Sisi Penciptaan',
    caption: 'Perasaan adalah jembatan antara sadar dan bawah sadar',
    aspectRatio: '1/1',
  },
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function FreeLessonPage() {
  const { t, language } = useTranslation()
  const curriculumParts = language === 'en' ? ALL_PARTS_EN : ALL_PARTS

  const { freeLessonNum, closeFreeLesson, setView, toggleCompleted, completedLessons } = useAppStore()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [practiceDone, setPracticeDone] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Find the lesson and its part
  const part = curriculumParts.find(p => p.lessons.some(l => l.num === freeLessonNum))
  const lesson = part?.lessons.find(l => l.num === freeLessonNum)

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current
      if (!el) return
      const scrollTop = window.scrollY
      const docHeight = el.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [freeLessonNum])

  const displayIllust = (() => {
    const illust = lessonIllustrations[lesson?.num || '']
    if (!illust) return null
    if (language === 'en') {
      if (lesson?.num === '1.1') {
        return {
          ...illust,
          alt: 'Manifestation Journal — Writing I AM',
          caption: '"I AM" is not just a word — it is the creative power'
        }
      }
      if (lesson?.num === '1.2') {
        return {
          ...illust,
          alt: 'Consciousness Creates Reality',
          caption: 'The outer world is a reflection of the inner world'
        }
      }
      if (lesson?.num === '1.3') {
        return {
          ...illust,
          alt: 'Meditation — Two Sides of Creation',
          caption: 'Feeling is the bridge between conscious and subconscious'
        }
      }
    }
    return illust
  })()

  const handlePracticeCheck = useCallback(() => {
    setPracticeDone(true)
    if (freeLessonNum) toggleCompleted(freeLessonNum)
    toast(language === 'en' ? '✦ Lesson marked as completed!' : '✦ Pelajaran ditandai selesai!')
  }, [freeLessonNum, toggleCompleted, language])

  if (!lesson || !part) {
    return (
      <div className="nv-fl-page">
        <div style={{ textAlign: 'center', padding: '120px 24px' }}>
          <p style={{ color: 'var(--nv-muted)' }}>{language === 'en' ? 'Lesson not found' : 'Pelajaran tidak ditemukan'}</p>
          <button className="nv-back-btn" onClick={closeFreeLesson} style={{ marginTop: 16 }}>
            {language === 'en' ? '← Back' : '← Kembali'}
          </button>
        </div>
      </div>
    )
  }

  // Split content into paragraphs
  const paragraphs = lesson.fullContent.split('\n\n').filter(Boolean)

  // Free lesson index for stepper
  const freeIndex = FREE_LESSON_NUMS.indexOf(lesson.num)
  const allFreeLessons = FREE_LESSON_NUMS.map(num => {
    for (const p of curriculumParts) {
      const l = p.lessons.find(l => l.num === num)
      if (l) return { num, title: l.title, partColor: p.color }
    }
    return null
  }).filter(Boolean) as { num: string; title: string; partColor: string }[]

  // Conversion teases
  const teases = language === 'en' ? [
    'How ASSUMPTION hardens into fact',
    'Step-by-step SATS technique',
    'The secret of FEELING as the creative medium',
    'Importunity: daring impudence',
    'Revision: rewriting the past',
    'Imagination creates reality',
  ] : [
    'Bagaimana ASUMSI mengeras menjadi fakta',
    'Teknik SATS langkah demi langkah',
    'Rahasia PERASAAN sebagai medium penciptaan',
    'Importunity: kelancangan yang berani',
    'Revisi: mengubah masa lalu',
    'Imajinasi menciptakan realitas',
  ]

  const readCount = completedLessons.size + (practiceDone && !completedLessons.has(lesson.num) ? 1 : 0)
  const progressPercent = Math.round(((completedLessons.has(lesson.num) ? readCount : readCount) / 49) * 100)

  return (
    <div className="nv-fl-page" ref={contentRef}>
      {/* Reading progress bar */}
      <div className="nv-fl-progress" style={{ width: `${scrollProgress * 100}%` }} />

      {/* Sticky header */}
      <header className="nv-fl-header">
        <div className="nv-fl-header-inner">
          <button className="nv-fl-back" onClick={closeFreeLesson}>
            {language === 'en' ? '← Back' : '← Kembali'}
          </button>
          <span className="nv-fl-free-badge">{t('freeBadge')}</span>
        </div>
      </header>

      {/* Hero section with illustration */}
      <motion.section className="nv-fl-hero" {...fadeIn}>
        <div className="nv-fl-hero-bg" />
        <div className="nv-fl-hero-layout">
          <div className="nv-fl-hero-text-side">
            <div className="nv-fl-num">{lesson.num}</div>
            <h1 className="nv-fl-title">{lesson.title}</h1>
            <p className="nv-fl-epigraph">{lesson.takeaway}</p>
            <div className="nv-fl-meta-row">
              <span className="nv-fl-meta-item">
                <span className="nv-fl-meta-accent">⏱</span> {language === 'en' ? '8 min read' : '8 min baca'}
              </span>
              <span className="nv-fl-meta-item">
                <span className="nv-fl-meta-accent">📖</span> {language === 'en' ? `Free Lesson ${freeIndex + 1}/${FREE_LESSON_NUMS.length}` : `Pelajaran ${freeIndex + 1}/${FREE_LESSON_NUMS.length} gratis`}
              </span>
              <span className="nv-fl-meta-item">
                {language === 'en' ? `PART ${part.num}: ${part.title.length > 30 ? part.title.slice(0, 28) + '…' : part.title}` : `BAGIAN ${part.num}: ${part.title.length > 30 ? part.title.slice(0, 28) + '…' : part.title}`}
              </span>
            </div>
          </div>
          {displayIllust && (
            <motion.div
              className="nv-fl-hero-illust"
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="nv-fl-hero-illust-frame" style={{ aspectRatio: displayIllust.aspectRatio }}>
                <div className="nv-fl-hero-illust-glow" />
                <Image
                  src={displayIllust.src}
                  alt={displayIllust.alt}
                  fill
                  className="nv-fl-hero-illust-img"
                  sizes="(max-width: 768px) 280px, 360px"
                  priority
                />
              </div>
              <p className="nv-fl-hero-illust-caption">{displayIllust.caption}</p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Ornamental divider */}
      <div className="nv-fl-ornament">
        <span className="nv-fl-ornament-line" />
        <span className="nv-fl-ornament-dot">✦</span>
        <span className="nv-fl-ornament-line" />
      </div>

      {/* Content body with illustration break */}
      <motion.div className="nv-fl-body" {...fadeIn} transition={{ delay: 0.15 }}>
        {paragraphs.map((para, i) => {
          // Process highlight words from quotes
          let processedPara = para
          lesson.quotes.forEach(q => {
            if (q.highlight && para.includes(q.highlight)) {
              processedPara = para.replace(
                q.highlight,
                `<span class="nv-fl-highlight">${q.highlight}</span>`
              )
            }
          })

          return (
            <div key={i}>
              <p
                className={i === 0 ? 'nv-fl-drop-cap' : ''}
                dangerouslySetInnerHTML={{ __html: processedPara }}
              />
              {/* Insert illustration break after the 2nd paragraph */}
              {i === 1 && displayIllust && (
                <motion.div
                  className="nv-fl-illust-break"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="nv-fl-illust-break-frame" style={{ aspectRatio: displayIllust.aspectRatio }}>
                    <Image
                      src={displayIllust.src}
                      alt={displayIllust.alt}
                      fill
                      className="nv-fl-illust-break-img"
                      sizes="(max-width: 768px) 90vw, 680px"
                    />
                    <div className="nv-fl-illust-break-overlay" />
                  </div>
                  <p className="nv-fl-illust-break-caption">{displayIllust.caption}</p>
                </motion.div>
              )}
            </div>
          )
        })}

        {/* Pull quotes */}
        {lesson.quotes.length > 0 && (
          <div className="nv-fl-ornament">
            <span className="nv-fl-ornament-line" />
            <span className="nv-fl-ornament-dot">✦</span>
            <span className="nv-fl-ornament-line" />
          </div>
        )}
        {lesson.quotes.map((quote, i) => (
          <motion.div
            key={i}
            className="nv-fl-pull-quote"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <span className="nv-fl-pull-quote-icon">&ldquo;</span>
            <p className="nv-fl-pull-quote-text">
              {quote.highlight ? (
                <>
                  {quote.text.split(quote.highlight)[0]}
                  <span className="nv-fl-pull-quote-highlight">{quote.highlight}</span>
                  {quote.text.split(quote.highlight).slice(1).join(quote.highlight)}
                </>
              ) : (
                quote.text
              )}
            </p>
            <p className="nv-fl-pull-quote-source">— {quote.source}</p>
            {quote.translation && language !== 'en' && (
              <p className="nv-fl-pull-quote-translation">{quote.translation}</p>
            )}
            {lesson.sourceUrl && (
              <a
                href={lesson.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nv-fl-pull-quote-link"
              >
                {language === 'en' ? 'Read original source →' : 'Baca sumber asli →'}
              </a>
            )}
          </motion.div>
        ))}

        {/* Practice card with illustration */}
        <div className="nv-fl-ornament">
          <span className="nv-fl-ornament-line" />
          <span className="nv-fl-ornament-dot">✦</span>
          <span className="nv-fl-ornament-line" />
        </div>
        <motion.div
          className="nv-fl-practice"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="nv-fl-practice-glow" />
          <div className="nv-fl-practice-layout">
            <div className="nv-fl-practice-text-col">
              <div className="nv-fl-practice-header">
                <span className="nv-fl-practice-icon">🕯️</span>
                <span className="nv-fl-practice-title">{language === 'en' ? 'Today\'s Practice' : 'Praktik Hari Ini'}</span>
              </div>
              <p>{lesson.practice}</p>
              <div className="nv-fl-practice-checkbox" onClick={handlePracticeCheck}>
                <input
                  type="checkbox"
                  checked={practiceDone || completedLessons.has(lesson.num)}
                  onChange={() => {}}
                />
                <label>{language === 'en' ? 'I have practiced this' : 'Saya sudah mempraktikkan ini'}</label>
              </div>
            </div>
            <div className="nv-fl-practice-illust-col">
              <div className="nv-fl-practice-illust-frame" style={{ aspectRatio: displayIllust?.aspectRatio || '1/1' }}>
                <Image
                  src={displayIllust?.src || '/images/illustrations/meditation-imagination.webp'}
                  alt={displayIllust?.alt || 'Praktik Meditasi'}
                  fill
                  className="nv-fl-practice-illust-img"
                  sizes="200px"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Takeaway card */}
        <motion.div
          className="nv-fl-takeaway"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="nv-fl-takeaway-marks">&ldquo;</span>
          <div className="nv-fl-takeaway-label">{language === 'en' ? 'Lesson Key Takeaway' : 'Inti Pelajaran'}</div>
          <p className="nv-fl-takeaway-text">{lesson.takeaway}</p>
        </motion.div>
      </motion.div>

      {/* 3-step progress stepper */}
      <motion.div
        className="nv-fl-stepper"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {allFreeLessons.map((fl, i) => {
          const isActive = fl.num === lesson.num
          const isDone = completedLessons.has(fl.num) || (fl.num === lesson.num && practiceDone)
          return (
            <button
              key={fl.num}
              className={`nv-fl-step ${isActive ? 'nv-fl-step-active' : ''} ${isDone ? 'nv-fl-step-done' : ''}`}
              onClick={() => {
                if (!isActive) {
                  useAppStore.getState().openFreeLesson(fl.num)
                }
              }}
            >
              <div className="nv-fl-step-num">{fl.num}</div>
              <div className="nv-fl-step-title">{fl.title}</div>
              <div className="nv-fl-step-status">
                {isDone 
                  ? (language === 'en' ? '✓ Completed' : '✓ Selesai') 
                  : isActive 
                    ? (language === 'en' ? '● Reading' : '● Sedang dibaca') 
                    : (language === 'en' ? `${i + 1}/${FREE_LESSON_NUMS.length} free` : `${i + 1}/${FREE_LESSON_NUMS.length} gratis`)}
              </div>
            </button>
          )
        })}
      </motion.div>

      {/* Conversion section with illustration */}
      <motion.div
        className="nv-fl-conversion"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="nv-fl-conversion-glow" />
        <div className="nv-fl-conversion-content">
          <div className="nv-fl-conversion-illust-strip">
            <div className="nv-fl-conversion-illust-mini">
              <Image
                src="/images/illustrations/manifestation-journal.webp"
                alt="Jurnal Manifestasi"
                fill
                className="nv-fl-conversion-illust-mini-img"
                sizes="120px"
              />
            </div>
            <div className="nv-fl-conversion-illust-mini">
              <Image
                src="/images/illustrations/consciousness-creates-world.png"
                alt="Kesadaran Menciptakan Realitas"
                fill
                className="nv-fl-conversion-illust-mini-img"
                sizes="120px"
              />
            </div>
            <div className="nv-fl-conversion-illust-mini">
              <Image
                src="/images/illustrations/meditation-imagination.webp"
                alt="Meditasi"
                fill
                className="nv-fl-conversion-illust-mini-img"
                sizes="120px"
              />
            </div>
          </div>
          <h2 className="nv-fl-conversion-title">{language === 'en' ? 'You have just begun the journey.' : 'Anda baru saja memulai perjalanan.'}</h2>
          <p className="nv-fl-conversion-desc">
            {language === 'en' 
              ? <>This lesson is the foundation. But a foundation without a building is empty land. There are still <strong style={{ color: 'var(--nv-gold)' }}>46 lessons</strong> waiting:</>
              : <>Pelajaran ini adalah fondasi. Tetapi fondasi tanpa bangunan adalah tanah kosong. Masih ada <strong style={{ color: 'var(--nv-gold)' }}>46 pelajaran</strong> yang menunggu:</>
            }
          </p>
          <ul className="nv-fl-conversion-teases">
            {teases.map((t, i) => (
              <li key={i}>
                <span className="nv-fl-conversion-tease-icon">✦</span>
                {t}
              </li>
            ))}
          </ul>
          <motion.button
            className="nv-cta-button nv-cta-pulse"
            onClick={() => setView('pricing')}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="nv-cta-icon">✦</span>
            {language === 'en' ? 'Unlock Full Curriculum — $9/month' : 'Buka Kurikulum Lengkap — $9/bulan'}
          </motion.button>
          <div className="nv-fl-progress-bar">
            <div className="nv-fl-progress-track">
              <div
                className="nv-fl-progress-fill"
                style={{ width: `${Math.max(progressPercent, 2)}%` }}
              />
            </div>
            <div className="nv-fl-progress-label">
              {language === 'en'
                ? `Read ${completedLessons.size} of 49 lessons (${progressPercent}%)`
                : `Sudah dibaca ${completedLessons.size} dari 49 pelajaran (${progressPercent}%)`
              }
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
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
        <div className="nv-footer-bottom">
          <span>{t('footerRights').replace('{year}', new Date().getFullYear().toString())}</span>
          <span className="nv-footer-bottom-accent">{t('footerMadeWith')}</span>
        </div>
      </footer>
    </div>
  )
}

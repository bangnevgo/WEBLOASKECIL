'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ALL_PARTS } from '@/lib/curriculum-data'

export default function LessonDetail() {
  const { activePartId, activeLessonNum, closeLesson, toggleCompleted, completedLessons } = useAppStore()
  const [readingProgress, setReadingProgress] = useState(0)

  const part = ALL_PARTS.find((p) => p.id === activePartId)
  const lesson = part?.lessons.find((l) => l.num === activeLessonNum)

  // Reading progress tracking via scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setReadingProgress(Math.min(progress, 100))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top when lesson changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activePartId, activeLessonNum])

  if (!part || !lesson) {
    return (
      <div className="nv-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--nv-muted)', fontSize: 16, marginBottom: 8 }}>Pelajaran tidak ditemukan</p>
          <p style={{ color: 'var(--nv-dim)', fontSize: 13, marginBottom: 20 }}>Pelajaran yang Anda cari tidak ada.</p>
          <button className="nv-back-btn" onClick={closeLesson} style={{ marginTop: 16 }}>
            &larr; Kembali ke Dasbor
          </button>
        </div>
      </div>
    )
  }

  const isComplete = completedLessons.has(lesson.num)

  // Find prev/next lesson (crosses part boundaries)
  const partIdx = ALL_PARTS.indexOf(part)
  const lessonIdx = part.lessons.indexOf(lesson)
  const prevLesson = lessonIdx > 0 ? part.lessons[lessonIdx - 1] : partIdx > 0 ? ALL_PARTS[partIdx - 1].lessons[ALL_PARTS[partIdx - 1].lessons.length - 1] : null
  const prevPart = prevLesson && lessonIdx === 0 ? ALL_PARTS[partIdx - 1] : part
  const nextLesson = lessonIdx < part.lessons.length - 1 ? part.lessons[lessonIdx + 1] : partIdx < ALL_PARTS.length - 1 ? ALL_PARTS[partIdx + 1].lessons[0] : null
  const nextPart = nextLesson && lessonIdx === part.lessons.length - 1 ? ALL_PARTS[partIdx + 1] : part

  return (
    <div className="nv-page">
      {/* Reading Progress Bar - Fixed at top, gold color */}
      <div className="nv-reading-progress" style={{ width: `${readingProgress}%` }} />

      {/* Lesson Header - Sticky */}
      <div className="nv-lesson-header" style={{ borderBottomColor: `${part.color}33` }}>
        <div className="nv-lesson-header-inner">
          <motion.button
            className="nv-back-btn"
            onClick={closeLesson}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            &larr; Dasbor
          </motion.button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontWeight: 800, fontSize: 13, color: part.color }}>
              {part.num}.{lesson.num.split('.')[1]}
            </span>
            <span style={{ fontSize: 13, color: 'var(--nv-muted)' }}>{part.title}</span>
          </div>
          <motion.button
            className={`nv-complete-btn ${isComplete ? 'nv-complete-btn-done' : ''}`}
            style={{ borderColor: isComplete ? 'var(--nv-gold)' : `${part.color}66`, color: isComplete ? 'var(--nv-gold)' : part.color }}
            onClick={() => toggleCompleted(lesson.num)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isComplete ? '\u2713 Selesai' : 'Tandai Selesai'}
          </motion.button>
        </div>
      </div>

      {/* Lesson Content Area */}
      <div className="nv-lesson-content">
        {/* Main Content (left) */}
        <div className="nv-lesson-main">
          {/* Title with colored number badge */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={lesson.num}
              className="nv-lesson-title"
              style={{ color: part.color }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <span className="nv-lesson-num-badge" style={{ background: `${part.color}18`, color: part.color }}>
                {lesson.num}
              </span>
              {lesson.title}
            </motion.h1>
          </AnimatePresence>

          {/* Full Content Text */}
          <motion.div
            className="nv-lesson-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {lesson.fullContent.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </motion.div>

          {/* Sourced Quotes Section */}
          <motion.div
            className="nv-lesson-quotes"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="nv-lesson-section-title" style={{ color: part.color }}>
              &#10022; Kutipan Bersumber
            </h3>
            {lesson.quotes.map((q, i) => (
              <motion.div
                key={i}
                className="nv-lesson-quote-card nv-premium-quote"
                style={{ borderLeftColor: part.color }}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ x: 4 }}
              >
                <p className="nv-lesson-quote-text">
                  &ldquo;{q.highlight ? q.text.replace(q.highlight, `\u00AB${q.highlight}\u00BB`) : q.text}&rdquo;
                </p>
                <p className="nv-lesson-quote-source">&mdash; {q.source}</p>
                <a
                  className="nv-lesson-source-link"
                  href={lesson.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Baca teks lengkap di CoolWisdomBooks &rarr;
                </a>
              </motion.div>
            ))}
          </motion.div>

          {/* Daily Practice Section - Glass card */}
          <motion.div
            className="nv-lesson-practice nv-glass"
            style={{ borderColor: `${part.color}33` }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="nv-lesson-section-title" style={{ color: part.color }}>
              &#129495; Praktik Harian
            </h3>
            <p>{lesson.practice}</p>
          </motion.div>

          {/* Key Takeaway Section */}
          <motion.div
            className="nv-lesson-takeaway"
            style={{ background: `${part.color}08`, borderColor: `${part.color}22` }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="nv-lesson-section-title" style={{ color: part.color }}>
              &#128273; Poin Penting
            </h3>
            <p style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.6 }}>{lesson.takeaway}</p>
          </motion.div>

          {/* Previous / Next Navigation */}
          <div className="nv-lesson-nav">
            {prevLesson && prevPart ? (
              <motion.button
                className="nv-lesson-nav-btn nv-lesson-nav-prev nv-glass"
                onClick={() => useAppStore.getState().openLesson(prevPart.id, prevLesson.num)}
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ fontSize: 12, color: 'var(--nv-dim)' }}>&larr; Sebelumnya</span>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{prevLesson.num} {prevLesson.title}</span>
              </motion.button>
            ) : <div />}
            {nextLesson && nextPart ? (
              <motion.button
                className="nv-lesson-nav-btn nv-lesson-nav-next nv-glass"
                onClick={() => useAppStore.getState().openLesson(nextPart.id, nextLesson.num)}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ fontSize: 12, color: 'var(--nv-dim)' }}>Berikutnya &rarr;</span>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{nextLesson.num} {nextLesson.title}</span>
              </motion.button>
            ) : <div />}
          </div>
        </div>

        {/* Right Sidebar (260px) - Hidden on mobile */}
        <aside className="nv-lesson-sidebar nv-scroll-premium">
          <div className="nv-lesson-sidebar-card nv-glass">
            <h4 style={{ fontSize: 13, fontWeight: 800, marginBottom: 12, color: part.color }}>
              Bagian {part.num}: {part.title}
            </h4>
            {part.lessons.map((l, idx) => {
              const done = completedLessons.has(l.num)
              const active = l.num === lesson.num
              return (
                <motion.button
                  key={l.num}
                  className={`nv-lesson-sidebar-item ${active ? 'nv-lesson-sidebar-active' : ''} ${done ? 'nv-lesson-sidebar-done' : ''}`}
                  style={{ borderLeftColor: active ? part.color : done ? 'var(--nv-gold)' : 'transparent' }}
                  onClick={() => useAppStore.getState().openLesson(part.id, l.num)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ x: 3 }}
                >
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontWeight: 700, fontSize: 11, color: part.color, width: 28, flexShrink: 0 }}>
                    {l.num}
                  </span>
                  <span style={{ fontSize: 12, color: active ? 'var(--nv-text)' : 'var(--nv-muted)', fontWeight: active ? 700 : 400 }}>
                    {l.title}
                  </span>
                  {done && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--nv-gold)' }}>&#10003;</span>}
                </motion.button>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}

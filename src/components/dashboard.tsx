'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ALL_PARTS } from '@/lib/curriculum-data'

export default function Dashboard() {
  const { userName, openLesson, completedLessons, unsubscribe } = useAppStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const totalLessons = ALL_PARTS.reduce((acc, p) => acc + p.lessons.length, 0)
  const completedCount = completedLessons.size
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  // SVG progress ring calculations
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progressPct / 100) * circumference
  // Always compute the actual offset; CSS transition handles animation
  const ringOffset = strokeDashoffset / 2

  return (
    <div className="nv-page">
      {/* Dashboard Header */}
      <div className="nv-dash-header">
        <div className="nv-dash-header-inner">
          <motion.div
            className="nv-dash-brand"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="nv-dash-logo" style={{ boxShadow: '0 0 20px var(--nv-gold-glow)' }}>✦</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Law of Assumption</div>
              <div style={{ fontSize: 11, color: 'var(--nv-dim)', fontFamily: 'var(--font-geist-mono), monospace' }}>
                FULL CURRICULUM
              </div>
            </div>
          </motion.div>
          <motion.div
            className="nv-dash-user"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span style={{ fontSize: 13, color: 'var(--nv-muted)' }}>Welcome, {userName}</span>
            <motion.button
              className="nv-dash-logout"
              onClick={unsubscribe}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Out
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="nv-dash-layout">
        {/* Mobile sidebar overlay */}
        <div
          className={`nv-sidebar-overlay ${sidebarOpen ? 'nv-overlay-visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`nv-dash-sidebar nv-scroll-premium ${sidebarOpen ? 'nv-sidebar-open' : ''}`}>
          {/* Progress Ring */}
          <motion.div
            className="nv-dash-progress-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <svg width="72" height="72" className="nv-progress-ring">
                <circle
                  className="nv-progress-ring-bg"
                  cx="36" cy="36" r={radius / 2}
                  strokeWidth="5"
                />
                <circle
                  className="nv-progress-ring-fill"
                  cx="36" cy="36" r={radius / 2}
                  strokeWidth="5"
                  stroke="url(#progressGradient)"
                  strokeDasharray={Math.PI * radius}
                  strokeDashoffset={ringOffset}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--nv-gold)" />
                    <stop offset="100%" stopColor="var(--nv-gold-2)" />
                  </linearGradient>
                </defs>
              </svg>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>
                  {completedCount}<span style={{ fontSize: 13, color: 'var(--nv-dim)', fontWeight: 400 }}>/{totalLessons}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--nv-muted)', fontFamily: 'var(--font-geist-mono), monospace', marginTop: 2 }}>
                  {progressPct}% Complete
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            <motion.div
              className="nv-stat-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--nv-gold)' }}>{ALL_PARTS.length}</div>
              <div style={{ fontSize: 10, color: 'var(--nv-dim)', fontFamily: 'var(--font-geist-mono), monospace' }}>PARTS</div>
            </motion.div>
            <motion.div
              className="nv-stat-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--nv-gold)' }}>{totalLessons - completedCount}</div>
              <div style={{ fontSize: 10, color: 'var(--nv-dim)', fontFamily: 'var(--font-geist-mono), monospace' }}>REMAINING</div>
            </motion.div>
          </div>

          {/* Nav */}
          <nav className="nv-dash-nav">
            {ALL_PARTS.map((part, partIdx) => {
              const partCompleted = part.lessons.filter((l) => completedLessons.has(l.num)).length
              return (
                <div key={part.id} className="nv-dash-nav-section">
                  <motion.div
                    className="nv-dash-nav-part"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + partIdx * 0.03 }}
                  >
                    <span className="nv-dash-nav-num" style={{ color: part.color }}>{part.num}</span>
                    <span className="nv-dash-nav-title">{part.title}</span>
                    <span className="nv-dash-nav-count">
                      {partCompleted}/{part.lessons.length}
                    </span>
                  </motion.div>
                  {part.lessons.map((lesson, lessonIdx) => {
                    const isComplete = completedLessons.has(lesson.num)
                    return (
                      <motion.button
                        key={lesson.num}
                        className={`nv-dash-nav-lesson ${isComplete ? 'nv-dash-nav-lesson-done' : ''}`}
                        onClick={() => {
                          openLesson(part.id, lesson.num)
                          setSidebarOpen(false)
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + partIdx * 0.03 + lessonIdx * 0.02 }}
                        whileHover={{ x: 3 }}
                      >
                        <span className="nv-dash-nav-lesson-dot" style={{ background: isComplete ? 'var(--nv-gold)' : 'var(--nv-faint)' }} />
                        <span className="nv-dash-nav-lesson-num" style={{ color: part.color }}>{lesson.num}</span>
                        <span className="nv-dash-nav-lesson-title">{lesson.title}</span>
                      </motion.button>
                    )
                  })}
                </div>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="nv-dash-main">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'linear-gradient(135deg, rgba(212, 160, 83, 0.08), rgba(167, 139, 250, 0.06))',
              border: '1px solid rgba(212, 160, 83, 0.12)',
              borderRadius: 16,
              padding: '24px 28px',
              marginBottom: 32,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(212, 160, 83, 0.05)', filter: 'blur(30px)' }} />
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px', position: 'relative' }}>
              Welcome back, {userName} ✦
            </h2>
            <p style={{ fontSize: 14, color: 'var(--nv-muted)', margin: 0, position: 'relative' }}>
              {completedCount === 0
                ? "Start your journey through Neville Goddard's complete teachings. Begin with Part 1: Consciousness Is the Only Reality."
                : completedCount < totalLessons
                  ? `You've completed ${completedCount} of ${totalLessons} lessons. Keep going — persistence is the key!`
                  : 'Congratulations! You have completed the entire curriculum. 🎉'
              }
            </p>
          </motion.div>

          {ALL_PARTS.map((part, partIdx) => (
            <motion.section
              key={part.id}
              id={`dash-${part.id}`}
              className="nv-dash-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <div className="nv-dash-section-head" style={{ borderLeftColor: part.color }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontWeight: 800, fontSize: 14, color: part.color }}>
                    {part.num}
                  </span>
                  <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{part.title}</h2>
                </div>
                <p style={{ color: 'var(--nv-muted)', fontSize: 14, lineHeight: 1.6, margin: '8px 0 16px' }}>
                  {part.description}
                </p>
              </div>

              <div className="nv-dash-lessons-grid">
                {part.lessons.map((lesson, lessonIdx) => {
                  const isComplete = completedLessons.has(lesson.num)
                  return (
                    <motion.button
                      key={lesson.num}
                      className={`nv-dash-lesson-card nv-glass ${isComplete ? 'nv-dash-lesson-card-done' : ''}`}
                      style={{ borderColor: isComplete ? `${part.color}44` : undefined }}
                      onClick={() => openLesson(part.id, lesson.num)}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: lessonIdx * 0.04 }}
                      whileHover={{ y: -2, borderColor: `${part.color}66` }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontWeight: 700, fontSize: 13, color: part.color }}>
                          {lesson.num}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--nv-text)' }}>{lesson.title}</span>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {lesson.bullets.slice(0, 2).map((b, i) => (
                          <li key={i} style={{ fontSize: 12, color: 'var(--nv-muted)', paddingLeft: 12, position: 'relative', marginBottom: 2 }}>
                            <span style={{ position: 'absolute', left: 0, top: 6, width: 4, height: 4, borderRadius: '50%', background: 'var(--nv-faint)' }} />
                            {b}
                          </li>
                        ))}
                      </ul>
                      <div style={{ marginTop: 'auto', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono), monospace', color: 'var(--nv-faint)' }}>
                          {lesson.quotes.length} quote{lesson.quotes.length !== 1 ? 's' : ''} · Practice
                        </span>
                        {isComplete && <span style={{ fontSize: 12, color: 'var(--nv-gold)' }}>✓ Done</span>}
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Part Quote */}
              {part.partQuote && (
                <motion.div
                  className="nv-dash-part-quote nv-premium-quote"
                  style={{ borderLeftColor: part.color }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <p style={{ fontStyle: 'italic', fontSize: 14, lineHeight: 1.7, color: 'var(--nv-text)', margin: 0 }}>
                    &ldquo;{part.partQuote.text}&rdquo;
                  </p>
                  <p style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono), monospace', color: 'var(--nv-dim)', marginTop: 8, margin: '8px 0 0' }}>
                    — {part.partQuote.source}
                  </p>
                </motion.div>
              )}
            </motion.section>
          ))}
        </main>
      </div>

      {/* Mobile sidebar toggle button */}
      <motion.button
        className="nv-sidebar-toggle"
        onClick={() => setSidebarOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Toggle sidebar navigation"
      >
        {sidebarOpen ? '✕' : '☰'}
      </motion.button>
    </div>
  )
}

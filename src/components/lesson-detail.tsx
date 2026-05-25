'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ALL_PARTS } from '@/lib/curriculum-data'
import { FileText, Sparkles, ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import AudioPlayer from '@/components/ui/audio-player'
import { toast } from 'sonner'

// Map lessons to specific audio meditations
const LESSON_MEDITATION_MAPPING: Record<string, { file: string; title: string; desc: string }> = {
  '1.5': {
    file: 'sats-meditation.mp3',
    title: 'SATS Meditation: Masuk ke Kondisi Theta',
    desc: 'Audio panduan induksi rileksasi mendalam (State Akin To Sleep) untuk menanamkan asumsi realisasi.'
  },
  '3.1': {
    file: 'meditasi-gratitude.mp3',
    title: 'Meditasi Gratitude: Hidup dari Akhir',
    desc: 'Audio panduan menanamkan getaran rasa syukur seolah keinginan Anda sudah dikabulkan.'
  },
  '3.5': {
    file: 'sats-meditation.mp3',
    title: 'SATS Meditation: Induksi Kondisi Perasaan',
    desc: 'Audio panduan menginduksi kondisi rileksasi otot dan menstimulasi imajinasi sensorik.'
  }
}

export default function LessonDetail() {
  const { 
    activePartId, 
    activeLessonNum, 
    closeLesson, 
    toggleCompleted, 
    completedLessons,
    subscriptionTier,
    setView
  } = useAppStore()
  
  const [readingProgress, setReadingProgress] = useState(0)

  const part = ALL_PARTS.find((p) => p.id === activePartId)
  const lesson = part?.lessons.find((l) => l.num === activeLessonNum)

  // Tracking reading scroll progress
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

  // Scroll to top on mount / change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [activePartId, activeLessonNum])

  if (!part || !lesson) {
    return (
      <div className="nv-page flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-neutral-400 text-base mb-2">Pelajaran tidak ditemukan</p>
          <button className="nv-back-btn mt-4" onClick={closeLesson}>
            ← Kembali ke Dasbor
          </button>
        </div>
      </div>
    )
  }

  const isComplete = completedLessons.has(lesson.num)
  const mappedMeditation = LESSON_MEDITATION_MAPPING[lesson.num]
  
  // Premium download check helper
  const handlePdfDownload = () => {
    // Simulated PDF download trigger
    const link = document.createElement('a')
    link.href = `/api/media?type=pdf&file=ringkasan-pelajaran-${lesson.num}.pdf`
    link.download = `ringkasan-pelajaran-${lesson.num}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Unduhan ringkasan PDF Pelajaran ${lesson.num} dimulai!`)
  }

  // Cross-part lesson navigation helpers
  const partIdx = ALL_PARTS.indexOf(part)
  const lessonIdx = part.lessons.indexOf(lesson)
  
  const prevLesson = lessonIdx > 0 
    ? part.lessons[lessonIdx - 1] 
    : partIdx > 0 ? ALL_PARTS[partIdx - 1].lessons[ALL_PARTS[partIdx - 1].lessons.length - 1] : null
  const prevPart = prevLesson && lessonIdx === 0 ? ALL_PARTS[partIdx - 1] : part

  const nextLesson = lessonIdx < part.lessons.length - 1 
    ? part.lessons[lessonIdx + 1] 
    : partIdx < ALL_PARTS.length - 1 ? ALL_PARTS[partIdx + 1].lessons[0] : null
  const nextPart = nextLesson && lessonIdx === part.lessons.length - 1 ? ALL_PARTS[partIdx + 1] : part

  // Highlight wrapper processor
  const processParagraph = (para: string) => {
    let processed = para
    // Highlight key Neville words
    const terms = ['I AM', 'kesadaran', 'asumsi', 'SATS', 'pikiran bawah sadar', 'perasaan', 'persistensi']
    terms.forEach(term => {
      const regex = new RegExp(`\\b(${term})\\b`, 'gi')
      processed = processed.replace(regex, `<span class="nv-fl-highlight">$1</span>`)
    })
    return processed
  }

  return (
    <div className="nv-page">
      {/* Reading Progress Bar */}
      <div className="nv-reading-progress" style={{ width: `${readingProgress}%`, height: '3px', background: 'var(--nv-gold)', position: 'fixed', top: 0, left: 0, zIndex: 100 }} />

      {/* Lesson Header - Sticky */}
      <div className="nv-lesson-header bg-[#0a0a0c]/90 backdrop-blur-md border-b border-neutral-900 sticky top-0 z-50">
        <div className="nv-lesson-header-inner max-w-[1200px] margin-inline-auto flex items-center justify-between px-6 py-3">
          <motion.button
            className="nv-back-btn flex items-center gap-1"
            onClick={closeLesson}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft size={13} /> Dasbor
          </motion.button>
          
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {lesson.num}
            </span>
            <span className="text-xs text-neutral-400 font-semibold truncate max-w-[150px] sm:max-w-none">{part.title}</span>
          </div>

          <motion.button
            className={`nv-complete-btn px-4 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
              isComplete 
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-500' 
                : 'border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            onClick={() => {
              toggleCompleted(lesson.num)
              if (isComplete) {
                toast(`Pelajaran ${lesson.num} ditandai belum selesai`)
              } else {
                toast(`✦ Pelajaran ${lesson.num} selesai dipelajari!`)
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isComplete ? (
              <>
                <Check size={12} /> Selesai
              </>
            ) : 'Selesai Baca'}
          </motion.button>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Sacred Scroll Content (760px container) */}
        <div className="flex-1 min-w-0">
          <div className="nv-scroll-container">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e8e4dc] leading-tight m-0 mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
              <span className="text-sm font-mono font-extrabold text-[#d4a053] bg-[#d4a053]/10 border border-[#d4a053]/30 px-3 py-1 rounded-xl w-max">
                PELAJARAN {lesson.num}
              </span>
              {lesson.title}
            </h1>

            {/* Premium PDF download teaser button */}
            <button 
              className="nv-lesson-download-badge mb-6" 
              onClick={handlePdfDownload}
            >
              <FileText size={14} /> Unduh Ringkasan PDF (Visual Study Guide)
            </button>

            {/* Mapped audio meditation player embed */}
            {mappedMeditation && (
              <motion.div 
                className="nv-meditation-section-embed mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="nv-meditation-section-header">
                  <Sparkles size={14} />
                  <span>🎧 MEDITASI TERBIMBING UNTUK PELAJARAN INI</span>
                </div>
                <div className="p-4 bg-[#111114]">
                  <AudioPlayer
                    src={`/api/media?type=audio&file=${mappedMeditation.file}`}
                    title={mappedMeditation.title}
                    subtitle={mappedMeditation.desc}
                    onComplete={() => toast.success(`✦ Sesi latihan selesai dipraktikkan.`)}
                  />
                </div>
              </motion.div>
            )}

            {/* Lesson Body Paragraphs */}
            <div className="nv-lesson-body text-base text-neutral-300 leading-relaxed flex flex-col gap-6">
              {lesson.fullContent.split('\n\n').map((paragraph, i) => (
                <p 
                  key={i} 
                  className={i === 0 ? 'nv-fl-drop-cap' : ''}
                  dangerouslySetInnerHTML={{ __html: processParagraph(paragraph) }}
                />
              ))}
            </div>

            {/* Quotes Panel */}
            <div className="nv-lesson-quotes mt-10 flex flex-col gap-6">
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2 border-b border-neutral-900 pb-3 m-0">
                ✦ KUTIPAN BERSUMBER NEVILLE GODDARD
              </h3>
              {lesson.quotes.map((q, i) => (
                <motion.div
                  key={i}
                  className="nv-lesson-quote-card nv-premium-quote"
                  style={{ borderLeftColor: part.color }}
                  whileHover={{ x: 2 }}
                >
                  <p className="nv-lesson-quote-text text-sm sm:text-base leading-relaxed font-serif italic text-neutral-200 m-0">
                    &ldquo;{q.highlight ? q.text.replace(q.highlight, `\u00AB${q.highlight}\u00BB`) : q.text}&rdquo;
                  </p>
                  <p className="nv-lesson-quote-source text-xs text-neutral-500 font-mono m-0 mt-2">&mdash; {q.source}</p>
                  {q.translation && (
                    <p className="text-xs text-neutral-400 leading-relaxed border-t border-neutral-900 pt-2 m-0 mt-2">{q.translation}</p>
                  )}
                  {lesson.sourceUrl && (
                    <a
                      className="nv-lesson-source-link text-xs text-[#d4a053] hover:underline block mt-3"
                      href={lesson.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Baca Teks Asli Kuliah (Archive Teks Bebas) →
                    </a>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Daily Practice Panel */}
            <div className="nv-lesson-practice nv-glass mt-10 p-6 border border-neutral-900">
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest m-0 mb-3">
                🕯️ PRAKTIK HARIAN ANDA
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed m-0">{lesson.practice}</p>
            </div>

            {/* Key Takeaways Panel */}
            <div 
              className="nv-lesson-takeaway mt-6 p-6 border rounded-xl"
              style={{ background: 'rgba(212,160,83,0.03)', borderColor: 'rgba(212,160,83,0.12)' }}
            >
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest m-0 mb-3">
                🔑 POIN UTAMA BACAAN
              </h3>
              <p className="text-sm sm:text-base font-bold leading-relaxed text-neutral-200 m-0">{lesson.takeaway}</p>
            </div>

            {/* Next/Prev Navigation Row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-12 border-t border-neutral-900 pt-8">
              {prevLesson && prevPart ? (
                <button
                  className="nv-lesson-nav-btn nv-glass flex flex-col items-start gap-1 p-4 text-left hover:border-amber-500/30 transition w-full sm:w-[48%]"
                  onClick={() => useAppStore.getState().openLesson(prevPart.id, prevLesson.num)}
                >
                  <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1 uppercase">
                    <ChevronLeft size={10} /> Sebelumnya
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-neutral-300 line-clamp-1">{prevLesson.num} {prevLesson.title}</span>
                </button>
              ) : <div className="w-[48%] hidden sm:block" />}
              
              {nextLesson && nextPart ? (
                <button
                  className="nv-lesson-nav-btn nv-glass flex flex-col items-end gap-1 p-4 text-right hover:border-amber-500/30 transition w-full sm:w-[48%]"
                  onClick={() => useAppStore.getState().openLesson(nextPart.id, nextLesson.num)}
                >
                  <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1 uppercase">
                    Berikutnya <ChevronRight size={10} />
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-neutral-300 line-clamp-1">{nextLesson.num} {nextLesson.title}</span>
                </button>
              ) : <div className="w-[48%] hidden sm:block" />}
            </div>
          </div>
        </div>

        {/* Right Side: Part Sidebar Menu (Desktop only, width: 280px) */}
        <aside className="w-full lg:w-[280px] shrink-0 hidden lg:block">
          <div className="nv-lesson-sidebar-card nv-glass p-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto nv-scroll-premium">
            <h4 className="text-xs font-extrabold uppercase text-amber-500 tracking-wider mb-4 border-b border-neutral-900 pb-2">
              Bagian {part.num}: {part.title}
            </h4>
            <div className="flex flex-col gap-1">
              {part.lessons.map((l, idx) => {
                const done = completedLessons.has(l.num)
                const active = l.num === lesson.num
                return (
                  <button
                    key={l.num}
                    className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition w-full ${
                      active 
                        ? 'bg-amber-500/10 text-amber-500 font-bold border-l-2 border-amber-500' 
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                    }`}
                    onClick={() => useAppStore.getState().openLesson(part.id, l.num)}
                  >
                    <span className="font-mono text-xs font-bold shrink-0 text-amber-500/70 w-8">
                      {l.num}
                    </span>
                    <span className="text-xs truncate flex-1">{l.title}</span>
                    {done && <span className="text-amber-500 text-xs shrink-0 font-bold">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}

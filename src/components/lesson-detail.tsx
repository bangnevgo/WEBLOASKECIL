'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ALL_PARTS } from '@/lib/curriculum-data'
import { ALL_PARTS_EN } from '@/lib/curriculum-data-en'
import { useTranslation } from '@/lib/translations'
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
  const { t, language } = useTranslation()
  const curriculumParts = language === 'en' ? ALL_PARTS_EN : ALL_PARTS

  const { 
    activePartId, 
    activeLessonNum, 
    closeLesson, 
    toggleCompleted, 
    completedLessons,
    subscriptionTier,
    setView,
    leadRegistered
  } = useAppStore()
  
  const [readingProgress, setReadingProgress] = useState(0)

  const part = curriculumParts.find((p) => p.id === activePartId)
  const lesson = part?.lessons.find((l) => l.num === activeLessonNum)

  const lessonIdx = part && lesson ? part.lessons.findIndex((l) => l.num === lesson.num) : -1
  const isLessonFree = part && lessonIdx !== -1 && (
    part.id === 'part-1' || 
    (part.id === 'part-2' && (lessonIdx === 0 || lessonIdx === 1)) || 
    (part.id !== 'part-1' && part.id !== 'part-2' && lessonIdx === 0)
  )
  const isLessonLocked = !leadRegistered && !isLessonFree

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
          <p className="text-neutral-400 text-base mb-2">{language === 'en' ? 'Lesson not found' : 'Pelajaran tidak ditemukan'}</p>
          <button className="nv-back-btn mt-4" onClick={closeLesson}>
            {t('backToDashboard')}
          </button>
        </div>
      </div>
    )
  }

  const isComplete = completedLessons.has(lesson.num)
  const mappedMeditation = LESSON_MEDITATION_MAPPING[lesson.num]

  const getMappedMeditation = () => {
    if (!mappedMeditation) return null
    if (language === 'en') {
      if (lesson.num === '1.5') {
        return {
          file: 'sats-meditation.mp3',
          title: 'SATS Meditation: Entering the Theta State',
          desc: 'Guided audio for deep relaxation (State Akin To Sleep) to implant realization assumptions.'
        }
      }
      if (lesson.num === '3.1') {
        return {
          file: 'meditasi-gratitude.mp3',
          title: 'Gratitude Meditation: Living from the End',
          desc: 'Guided audio to anchor the vibration of gratitude as if your wish has already been granted.'
        }
      }
      if (lesson.num === '3.5') {
        return {
          file: 'sats-meditation.mp3',
          title: 'SATS Meditation: Inducing the Feeling State',
          desc: 'Guided audio to induce muscle relaxation and stimulate sensory imagination.'
        }
      }
    }
    return mappedMeditation
  }
  const displayMeditation = getMappedMeditation()

  // Cross-part lesson navigation helpers
  const partIdx = curriculumParts.indexOf(part)
  // lessonIdx is already defined above
  
  const prevLesson = lessonIdx > 0 
    ? part.lessons[lessonIdx - 1] 
    : partIdx > 0 ? curriculumParts[partIdx - 1].lessons[curriculumParts[partIdx - 1].lessons.length - 1] : null
  const prevPart = prevLesson && lessonIdx === 0 ? curriculumParts[partIdx - 1] : part

  const nextLesson = lessonIdx < part.lessons.length - 1 
    ? part.lessons[lessonIdx + 1] 
    : partIdx < curriculumParts.length - 1 ? curriculumParts[partIdx + 1].lessons[0] : null
  const nextPart = nextLesson && lessonIdx === part.lessons.length - 1 ? curriculumParts[partIdx + 1] : part

  // Highlight wrapper processor
  const processParagraph = (para: string) => {
    let processed = para
    // Highlight key Neville words
    const terms = language === 'en'
      ? ['I AM', 'consciousness', 'assumption', 'SATS', 'subconscious mind', 'feeling', 'persistence']
      : ['I AM', 'kesadaran', 'asumsi', 'SATS', 'pikiran bawah sadar', 'perasaan', 'persistensi']
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
            <ArrowLeft size={13} /> {language === 'en' ? 'Dashboard' : 'Dasbor'}
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
                toast(
                  language === 'en'
                    ? `Lesson ${lesson.num} marked as incomplete`
                    : `Pelajaran ${lesson.num} ditandai belum selesai`
                )
              } else {
                toast(
                  language === 'en'
                    ? `✦ Lesson ${lesson.num} completed!`
                    : `✦ Pelajaran ${lesson.num} selesai dipelajari!`
                )
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isComplete ? (
              <>
                <Check size={12} /> {language === 'en' ? 'Completed' : 'Selesai'}
              </>
            ) : (language === 'en' ? 'Mark Completed' : 'Selesai Baca')}
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
                {language === 'en' ? `LESSON ${lesson.num}` : `PELAJARAN ${lesson.num}`}
              </span>
              {lesson.title}
            </h1>

            {/* Premium PDF download — coming soon */}
            <div className="nv-lesson-download-badge mb-6 flex items-center gap-2" style={{ opacity: 0.6, cursor: 'default' }}>
              <FileText size={14} />
              <span>{language === 'en' ? 'PDF Summary (Visual Study Guide)' : 'Ringkasan PDF (Visual Study Guide)'}</span>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5" style={{ marginLeft: '4px' }}>
                {language === 'en' ? 'COMING SOON ✨' : 'SEGERA ✨'}
              </span>
            </div>

                      {/* Gating content rendering based on lock policy */}
            {isLessonLocked ? (
              <>
                {/* Preview Paragraph */}
                <div className="nv-lesson-body text-base text-neutral-300 leading-relaxed flex flex-col gap-6 opacity-60">
                  <p className="nv-fl-drop-cap">
                    {lesson.fullContent.split('\n\n')[0]}
                  </p>
                </div>

                {/* Gate Overlay Box */}
                <div 
                  className="p-8 border border-[#d4a053]/30 rounded-2xl text-center my-8 flex flex-col items-center justify-center gap-4 bg-[#0a0a0c]"
                  style={{ background: 'rgba(212,160,83,0.02)' }}
                >
                  <span className="text-3xl">🔒</span>
                  <h3 className="text-lg font-bold text-[#e8e4dc]">
                    {language === 'en' ? 'This module is locked' : 'Modul ini terkunci'}
                  </h3>
                  <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
                    {language === 'en' 
                      ? 'Register for free to unlock all 49 lessons, sourced quotes, daily practices, and meditation audios.' 
                      : 'Daftar gratis untuk membuka akses penuh ke 49 modul pelajaran, kutipan asli bersumber, praktik harian, dan panduan meditasi audio.'}
                  </p>
                  <a
                    href="/?register=1"
                    className="px-6 py-2.5 bg-[#d4a053] hover:bg-[#c39043] text-black font-extrabold text-sm rounded-xl transition shadow-lg inline-block"
                    style={{ textDecoration: 'none' }}
                  >
                    ✦ {language === 'en' ? 'Unlock Free Access Now' : 'Buka Akses Gratis Sekarang'}
                  </a>
                </div>
              </>
            ) : (
              <>
                {/* Mapped audio meditation player embed */}
                {displayMeditation && (
                  <motion.div 
                    className="nv-meditation-section-embed mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="nv-meditation-section-header">
                      <Sparkles size={14} />
                      <span>{language === 'en' ? '🎧 GUIDED MEDITATION FOR THIS LESSON' : '🎧 MEDITASI TERBIMBING UNTUK PELAJARAN INI'}</span>
                    </div>
                    <div className="p-4 bg-[#111114]">
                      <AudioPlayer
                        src={`/api/media?type=audio&file=${displayMeditation.file}`}
                        title={displayMeditation.title}
                        subtitle={displayMeditation.desc}
                        onComplete={() => toast.success(language === 'en' ? `✦ Practice session completed.` : `✦ Sesi latihan selesai dipraktikkan.`)}
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
                    ✦ {language === 'en' ? 'NEVILLE GODDARD SOURCED QUOTES' : 'KUTIPAN BERSUMBER NEVILLE GODDARD'}
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
                      {q.translation && language !== 'en' && (
                        <p className="text-xs text-neutral-400 leading-relaxed border-t border-neutral-900 pt-2 m-0 mt-2">{q.translation}</p>
                      )}
                      {lesson.sourceUrl && (
                        <a
                          className="nv-lesson-source-link text-xs text-[#d4a053] hover:underline block mt-3"
                          href={lesson.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {language === 'en' ? 'Read Original Lecture Text (Free Text Archive) →' : 'Baca Teks Asli Kuliah (Archive Teks Bebas) →'}
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Daily Practice Panel */}
                <div className="nv-lesson-practice nv-glass mt-10 p-6 border border-neutral-900">
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest m-0 mb-3">
                    🕯️ {language === 'en' ? 'YOUR DAILY PRACTICE' : 'PRAKTIK HARIAN ANDA'}
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed m-0">{lesson.practice}</p>
                </div>

                {/* Key Takeaways Panel */}
                <div 
                  className="nv-lesson-takeaway mt-6 p-6 border rounded-xl"
                  style={{ background: 'rgba(212,160,83,0.03)', borderColor: 'rgba(212,160,83,0.12)' }}
                >
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest m-0 mb-3">
                    🔑 {language === 'en' ? 'KEY TAKEAWAYS' : 'POIN UTAMA BACAAN'}
                  </h3>
                  <p className="text-sm sm:text-base font-bold leading-relaxed text-neutral-200 m-0">{lesson.takeaway}</p>
                </div>
              </>
            )}

            {/* Next/Prev Navigation Row */}
            {(() => {
              const prevLessonIdx = prevPart && prevLesson ? prevPart.lessons.findIndex((l) => l.num === prevLesson.num) : -1
              const isPrevFree = prevPart && prevLessonIdx !== -1 && (
                prevPart.id === 'part-1' || 
                (prevPart.id === 'part-2' && (prevLessonIdx === 0 || prevLessonIdx === 1)) || 
                (prevPart.id !== 'part-1' && prevPart.id !== 'part-2' && prevLessonIdx === 0)
              )
              const isPrevLocked = !leadRegistered && !isPrevFree

              const nextLessonIdx = nextPart && nextLesson ? nextPart.lessons.findIndex((l) => l.num === nextLesson.num) : -1
              const isNextFree = nextPart && nextLessonIdx !== -1 && (
                nextPart.id === 'part-1' || 
                (nextPart.id === 'part-2' && (nextLessonIdx === 0 || nextLessonIdx === 1)) || 
                (nextPart.id !== 'part-1' && nextPart.id !== 'part-2' && nextLessonIdx === 0)
              )
              const isNextLocked = !leadRegistered && !isNextFree

              return (
                <div className="flex flex-col sm:flex-row gap-4 justify-between mt-12 border-t border-neutral-900 pt-8">
                  {prevLesson && prevPart ? (
                    <button
                      className="nv-lesson-nav-btn nv-glass flex flex-col items-start gap-1 p-4 text-left hover:border-amber-500/30 transition w-full sm:w-[48%]"
                      onClick={() => useAppStore.getState().openLesson(prevPart.id, prevLesson.num)}
                    >
                      <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1 uppercase">
                        <ChevronLeft size={10} /> {language === 'en' ? 'Previous' : 'Sebelumnya'}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-neutral-300 line-clamp-1">
                        {isPrevLocked && '🔒 '}
                        {prevLesson.num} {prevLesson.title}
                      </span>
                    </button>
                  ) : <div className="w-[48%] hidden sm:block" />}
                  
                  {nextLesson && nextPart ? (
                    <button
                      className="nv-lesson-nav-btn nv-glass flex flex-col items-end gap-1 p-4 text-right hover:border-amber-500/30 transition w-full sm:w-[48%]"
                      onClick={() => useAppStore.getState().openLesson(nextPart.id, nextLesson.num)}
                    >
                      <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1 uppercase">
                        {language === 'en' ? 'Next' : 'Berikutnya'} <ChevronRight size={10} />
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-neutral-300 line-clamp-1">
                        {isNextLocked && '🔒 '}
                        {nextLesson.num} {nextLesson.title}
                      </span>
                    </button>
                  ) : <div className="w-[48%] hidden sm:block" />}
                </div>
              )
            })()}
          </div>
        </div>

        {/* Right Side: Part Sidebar Menu (Desktop only, width: 280px) */}
        <aside className="w-full lg:w-[280px] shrink-0 hidden lg:block">
          <div className="nv-lesson-sidebar-card nv-glass p-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto nv-scroll-premium">
            <h4 className="text-xs font-extrabold uppercase text-amber-500 tracking-wider mb-4 border-b border-neutral-900 pb-2">
              {language === 'en' ? `Part ${part.num}: ${part.title}` : `Bagian ${part.num}: ${part.title}`}
            </h4>
            <div className="flex flex-col gap-1">
              {part.lessons.map((l, idx) => {
                const done = completedLessons.has(l.num)
                const active = l.num === lesson.num
                const isLFree = part.id === 'part-1' || 
                                (part.id === 'part-2' && (idx === 0 || idx === 1)) || 
                                (part.id !== 'part-1' && part.id !== 'part-2' && idx === 0)
                const isLLocked = !leadRegistered && !isLFree
                return (
                  <button
                    key={l.num}
                    className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition w-full ${
                      active 
                        ? 'bg-amber-500/10 text-amber-500 font-bold border-l-2 border-amber-500' 
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                    } ${isLLocked ? 'opacity-60' : ''}`}
                    onClick={() => useAppStore.getState().openLesson(part.id, l.num)}
                  >
                    <span className="font-mono text-xs font-bold shrink-0 text-amber-500/70 w-8">
                      {l.num}
                    </span>
                    <span className="text-xs truncate flex-1">{l.title}</span>
                    {isLLocked && <span className="text-neutral-500 text-[10px] shrink-0">🔒</span>}
                    {done && !isLLocked && <span className="text-amber-500 text-xs shrink-0 font-bold">✓</span>}
                  </button>
                )
              })}
            </div>

            {/* CTA: layanan Nevgo */}
            <div className="mt-5 pt-4 border-t border-neutral-800 flex flex-col gap-2">
              {(() => {
                const partNum = part?.num ?? 1
                const cohortCtasId: Record<number, string> = {
                  1: 'Latih kesadarannya bareng Bang Nevgo',
                  2: 'Lihat cara Cohort membimbingmu',
                  3: 'Dapatkan panduan saat kamu "lupa"',
                  4: 'Pelajari praktik diam yang aktif',
                  5: 'Mulai method terbimbing di Cohort',
                  6: 'Praktik Revisi bersama mentor',
                  7: 'Arahkan imajinasimu di Cohort',
                  8: 'Masuk ke keadaan barumu',
                  9: 'Lewati fase ini bareng Cohort',
                  10: 'Ikut Program Bootcamp/Cohort 30 Hari',
                }
                const cohortCtasEn: Record<number, string> = {
                  1: 'Train your awareness with Bang Nevgo',
                  2: 'See how Cohort guides you',
                  3: 'Get guidance when you "forget"',
                  4: 'Learn the active practice of stillness',
                  5: 'Start the guided method in Cohort',
                  6: 'Practice Revision with a mentor',
                  7: 'Direct your imagination in Cohort',
                  8: 'Step into your new state',
                  9: 'Pass this phase with Cohort',
                  10: 'Join 30-Day Cohort/Bootcamp',
                }
                const subId: Record<number, string> = {
                  1: 'Rutin harian, bukan cuma teori.',
                  2: 'Konsistensi merasa "sudah punya".',
                  3: 'Ingatkan kamu balik ke perasaan.',
                  4: 'Diam yang aktif, bukan menyerah.',
                  5: 'Method sistematis yang menahan.',
                  6: 'Dipraktikkan langsung, bukan dibaca.',
                  7: 'Imajinasi jadi alat yang disiplin.',
                  8: 'Langkah harian yang diawasi.',
                  9: 'Komunitas + mentor di fase ini.',
                  10: 'Bimbingan 30 hari bersama Bang Nevgo.',
                }
                const subEn: Record<number, string> = {
                  1: 'Daily routine, not just theory.',
                  2: 'Consistency in feeling "already have".',
                  3: 'Brings you back to the feeling.',
                  4: 'Active stillness, not giving up.',
                  5: 'A systematic method that holds.',
                  6: 'Practiced live, not just read.',
                  7: 'Imagination as a disciplined tool.',
                  8: 'Daily steps, closely guided.',
                  9: 'Community + mentor for this phase.',
                  10: '30-day guided mentoring with Bang Nevgo.',
                }
                const ctaText = language === 'en' ? (cohortCtasEn[partNum] ?? cohortCtasEn[10]) : (cohortCtasId[partNum] ?? cohortCtasId[10])
                const subText = language === 'en' ? (subEn[partNum] ?? subEn[10]) : (subId[partNum] ?? subId[10])
                return (
                  <>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">
                      {language === 'en' ? 'Guidance & Services' : 'Bimbingan & Layanan'}
                    </p>

                    {/* Cohort / Bootcamp — utama */}
                    <a
                      href="https://cohort.nevgoinstitute.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 w-full py-3 px-3 rounded-xl transition-all duration-200"
                      style={{
                        background: 'linear-gradient(135deg, rgba(212,160,83,0.13), rgba(184,134,45,0.06))',
                        border: '1px solid rgba(212,160,83,0.28)',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'linear-gradient(135deg, rgba(212,160,83,0.22), rgba(184,134,45,0.14))'
                        el.style.borderColor = 'rgba(212,160,83,0.45)'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'linear-gradient(135deg, rgba(212,160,83,0.13), rgba(184,134,45,0.06))'
                        el.style.borderColor = 'rgba(212,160,83,0.28)'
                      }}
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-full text-sm shrink-0" style={{ background: 'rgba(212,160,83,0.15)', color: '#d4a053' }}>✦</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[13px] font-bold text-[#d4a053] leading-snug">{ctaText}</span>
                        <span className="block text-[10px] text-neutral-500 leading-snug mt-0.5">{subText}</span>
                      </span>
                      <span className="text-xs text-[#d4a053] shrink-0 transition-transform group-hover:translate-x-0.5">→</span>
                    </a>

                    {/* Pendampingan 101 */}
                    <a
                      href="/pendampingan-101.html"
                      className="group flex items-center gap-3 w-full py-3 px-3 rounded-xl transition-all duration-200"
                      style={{ background: 'rgba(192,114,92,0.08)', border: '1px solid rgba(192,114,92,0.3)' }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'rgba(192,114,92,0.16)'
                        el.style.borderColor = 'rgba(192,114,92,0.5)'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'rgba(192,114,92,0.08)'
                        el.style.borderColor = 'rgba(192,114,92,0.3)'
                      }}
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-extrabold shrink-0" style={{ fontFamily: 'monospace', background: 'rgba(192,114,92,0.15)', color: '#d18a76' }}>101</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[13px] font-bold text-[#d18a76] leading-snug">
                          {language === 'en' ? 'Pendampingan 101 — Bimbingan 1-on-1' : 'Pendampingan 101 — Bimbingan 1-on-1'}
                        </span>
                        <span className="block text-[10px] text-neutral-500 leading-snug mt-0.5">
                          {language === 'en' ? 'Private one-on-one with Bang Nevgo' : 'Sesi privat 1-on-1 bersama Bang Nevgo'}
                        </span>
                      </span>
                      <span className="text-xs text-[#d18a76] shrink-0 transition-transform group-hover:translate-x-0.5">→</span>
                    </a>

                    {/* Toko Ebook & Produk Digital */}
                    <a
                      href="https://lynk.id/bangnevgo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 w-full py-2.5 px-3 rounded-xl transition-all duration-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700"
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-full text-sm shrink-0 bg-neutral-800">🛒</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[12px] font-bold text-[#e8e4dc] leading-snug">
                          {language === 'en' ? 'Ebooks, Events & Digital Products' : 'Ebook, Event & Produk Digital'}
                        </span>
                        <span className="block text-[10px] text-neutral-500 leading-snug mt-0.5">
                          {language === 'en' ? 'Live sessions & digital products' : 'Sesi langsung & produk digital'}
                        </span>
                      </span>
                      <span className="text-[10px] text-[#d4a053] shrink-0">↗</span>
                    </a>
                  </>
                )
              })()}
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}

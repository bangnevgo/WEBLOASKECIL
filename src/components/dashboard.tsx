'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, SubscriptionTier } from '@/lib/store'
import { ALL_PARTS } from '@/lib/curriculum-data'
import { Users, Crown, BookOpen, Sparkles, Key, Play, Lock, LogOut, CheckCircle2 } from 'lucide-react'
import AudioPlayer from '@/components/ui/audio-player'
import WebinarHub from '@/components/webinar-hub'
import { toast } from 'sonner'

const partImages = [
  '/images/parts/part-1.png',
  '/images/parts/part-2.png',
  '/images/parts/part-3.png',
  '/images/parts/part-4.png',
  '/images/parts/part-5.png',
  '/images/parts/part-6.png',
  '/images/parts/part-7.png',
  '/images/parts/part-8.png',
  '/images/parts/part-9.png',
  '/images/parts/part-10.png',
]

const MEDITATIONS = [
  {
    slug: 'sats-meditation',
    title: 'SATS Meditation: Masuk ke Kondisi Theta',
    duration: '15:00',
    desc: 'Panduan audio penuntun masuk ke State Akin To Sleep (SATS) untuk menanamkan asumsi di pikiran bawah sadar.',
    file: 'sats-meditation.mp3',
    minTier: 'basic'
  },
  {
    slug: 'visualisasi-kesehatan',
    title: 'Visualisasi Kesehatan Sempurna',
    duration: '10:00',
    desc: 'Audio loop untuk membantu visualisasi tubuh yang pulih dan prima dengan perasaan bersyukur.',
    file: 'visualisasi-kesehatan.mp3',
    minTier: 'basic'
  },
  {
    slug: 'visualisasi-kemakmuran',
    title: 'Visualisasi Kemakmuran & Kekayaan',
    duration: '10:00',
    desc: 'Mengasumsikan kelimpahan finansial dari perspektif keinginan yang telah terwujud secara natural.',
    file: 'visualisasi-kemakmuran.mp3',
    minTier: 'master'
  },
  {
    slug: 'revisi-malam',
    title: 'Revisi Malam Hari: Menulis Ulang Hari Anda',
    duration: '12:00',
    desc: 'Latihan sebelum tidur untuk merevisi dan mengganti ingatan kejadian buruk hari ini dengan asumsi ideal.',
    file: 'revisi-malam.mp3',
    minTier: 'master'
  },
  {
    slug: 'afirmasi-iam',
    title: 'Afirmasi Agung I AM: Pengulangan Theta',
    duration: '20:00',
    desc: 'Loop afirmasi peneguhan eksistensi ketuhanan dalam diri yang paling reseptif di gelombang theta.',
    file: 'afirmasi-iam.mp3',
    minTier: 'master'
  },
  {
    slug: 'meditasi-gratitude',
    title: 'Meditasi Gratitude: Hidup dari Akhir',
    duration: '10:00',
    desc: 'Mengunci getaran rasa syukur yang menyiratkan bahwa keinginan Anda sudah terjadi sepenuhnya.',
    file: 'meditasi-gratitude.mp3',
    minTier: 'master'
  }
]

export default function Dashboard() {
  const { 
    userName, 
    subscriptionTier,
    openLesson, 
    completedLessons, 
    logoutUser, 
    hasCurriculumAccess, 
    hasCommunityAccess, 
    setView,
    redeemCode
  } = useAppStore()
  
  const [activeTab, setActiveTab] = useState<'lessons' | 'meditations' | 'webinars'>('lessons')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activationCode, setActivationCode] = useState('')
  const [activeAudio, setActiveAudio] = useState<typeof MEDITATIONS[0] | null>(null)

  const totalLessons = ALL_PARTS.reduce((acc, p) => acc + p.lessons.length, 0)
  const completedCount = completedLessons.size
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  // SVG progress ring calculations
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progressPct / 100) * circumference
  const ringOffset = strokeDashoffset / 2

  const handleActivation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activationCode.trim()) {
      toast.error('Mohon masukkan kode aktivasi')
      return
    }

    const res = redeemCode(activationCode)
    if (res.success) {
      toast.success(res.message)
      setActivationCode('')
    } else {
      toast.error(res.message)
    }
  }

  // Audio access check helper
  const hasAudioAccess = (minTier: string) => {
    if (subscriptionTier === 'master') return true
    if (subscriptionTier === 'premium') return true // Premium gets master audio access in frontend
    if (subscriptionTier === 'basic') {
      return minTier === 'basic'
    }
    return false
  }

  const handleAudioPlay = (audio: typeof MEDITATIONS[0]) => {
    if (!hasAudioAccess(audio.minTier)) {
      toast.error(`Audio terkunci. Silakan upgrade ke tier yang lebih tinggi untuk membuka meditasi ini.`)
      setView('pricing')
      return
    }
    setActiveAudio(audio)
  }

  return (
    <div className="nv-page">
      {/* Dashboard Header */}
      <div className="nv-dash-header">
        <div className="nv-dash-header-inner">
          <motion.div
            className="nv-dash-brand cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setView('landing')}
          >
            <div className="nv-dash-logo" style={{ boxShadow: '0 0 20px var(--nv-gold-glow)' }}>✦</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--nv-gold)' }}>Hukum Asumsi</div>
              <div style={{ fontSize: 11, color: 'var(--nv-dim)', fontFamily: 'var(--font-geist-mono), monospace' }}>
                PORTAL PEMBELAJARAN
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="nv-dash-user"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col text-right hidden sm:flex">
              <span style={{ fontSize: 13, fontWeight: 600 }}>{userName}</span>
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                <Crown size={10} /> Tier: {subscriptionTier}
              </span>
            </div>
            
            <motion.button
              className="nv-dash-logout flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 text-xs text-neutral-400 hover:text-white"
              onClick={logoutUser}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={12} /> Keluar
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
                  {progressPct}% Selesai
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            <div className="nv-stat-card">
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--nv-gold)' }}>{ALL_PARTS.length}</div>
              <div style={{ fontSize: 10, color: 'var(--nv-dim)', fontFamily: 'var(--font-geist-mono), monospace' }}>BAGIAN</div>
            </div>
            <div className="nv-stat-card">
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--nv-gold)' }}>{totalLessons - completedCount}</div>
              <div style={{ fontSize: 10, color: 'var(--nv-dim)', fontFamily: 'var(--font-geist-mono), monospace' }}>SISA</div>
            </div>
          </div>

          {/* Activation Code input (only visible if subscriptionTier is 'free') */}
          {subscriptionTier === 'free' && (
            <motion.div 
              className="nv-activation-widget nv-premium-glass"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h4 className="text-xs font-bold text-amber-500 flex items-center gap-1.5 uppercase m-0">
                <Key size={12} /> Aktivasi Kode Akses
              </h4>
              <p className="text-[11px] text-neutral-400 m-0 mt-1 leading-relaxed">
                Punya kode aktivasi? Masukkan di bawah untuk membuka pelajaran instan.
              </p>
              <form onSubmit={handleActivation} className="nv-activation-widget-row">
                <input
                  type="text"
                  placeholder="KODE AKTIVASI"
                  className="nv-activation-widget-input"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                />
                <button type="submit" className="nv-activation-widget-btn">
                  Aktifkan
                </button>
              </form>
              <div className="text-[9px] text-neutral-500 mt-2 font-mono leading-none">
                Petunjuk: Masukkan kode <span className="text-[#d4a053] font-bold">MASTER123</span> untuk mencoba.
              </div>
            </motion.div>
          )}

          {/* Community Quick Access */}
          {hasCommunityAccess() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ marginBottom: 20 }}
            >
              <button
                className="nv-pdf-download-btn w-full flex items-center justify-center gap-2"
                onClick={() => setView('community')}
              >
                <Users size={16} />
                <span>Masuk Komunitas Privat</span>
              </button>
            </motion.div>
          )}

          {/* Lessons Sidebar list (only visible if tab is lessons) */}
          {activeTab === 'lessons' && (
            <nav className="nv-dash-nav">
              {ALL_PARTS.map((part, partIdx) => {
                const partCompleted = part.lessons.filter((l) => completedLessons.has(l.num)).length
                return (
                  <div key={part.id} className="nv-dash-nav-section">
                    <div className="nv-dash-nav-part">
                      <span className="nv-dash-nav-num" style={{ color: part.color }}>{part.num}</span>
                      <span className="nv-dash-nav-title">{part.title}</span>
                      <span className="nv-dash-nav-count">
                        {partCompleted}/{part.lessons.length}
                      </span>
                    </div>
                    {part.lessons.map((lesson, lessonIdx) => {
                      const isComplete = completedLessons.has(lesson.num)
                      return (
                        <button
                          key={lesson.num}
                          className={`nv-dash-nav-lesson ${isComplete ? 'nv-dash-nav-lesson-done' : ''}`}
                          onClick={() => {
                            const isFree = lesson.num === '1.1' || lesson.num === '1.2' || lesson.num === '1.3'
                            if (isFree || hasCurriculumAccess()) {
                              openLesson(part.id, lesson.num)
                              setSidebarOpen(false)
                            } else {
                              toast.info('Pelajaran terkunci. Upgrade ke Paket Basic untuk membuka kurikulum.')
                              setView('pricing')
                            }
                          }}
                        >
                          <span className="nv-dash-nav-lesson-dot" style={{ background: isComplete ? 'var(--nv-gold)' : 'var(--nv-faint)' }} />
                          <span className="nv-dash-nav-lesson-num" style={{ color: part.color }}>{lesson.num}</span>
                          <span className="nv-dash-nav-lesson-title">{lesson.title}</span>
                          {!isComplete && (lesson.num !== '1.1' && lesson.num !== '1.2' && lesson.num !== '1.3') && !hasCurriculumAccess() && (
                            <span className="text-[10px] ml-auto">🔒</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </nav>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="nv-dash-main">
          {/* Tab Navigation header */}
          <div className="nv-tab-nav">
            <button 
              className={`nv-tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
              onClick={() => setActiveTab('lessons')}
            >
              <BookOpen size={16} />
              <span>📚 Kurikulum</span>
            </button>
            <button 
              className={`nv-tab-btn ${activeTab === 'meditations' ? 'active' : ''}`}
              onClick={() => setActiveTab('meditations')}
            >
              <Sparkles size={16} />
              <span>🎧 Meditasi Audio</span>
            </button>
            <button 
              className={`nv-tab-btn ${activeTab === 'webinars' ? 'active' : ''}`}
              onClick={() => setActiveTab('webinars')}
            >
              <Users size={16} />
              <span>🎥 Webinar VIP</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* 1. CURRICULUM LESSONS TAB */}
            {activeTab === 'lessons' && (
              <motion.div
                key="lessons"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {/* Welcome Banner */}
                <div
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
                  <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px', position: 'relative', color: '#e8e4dc' }}>
                    Selamat belajar kembali, {userName} ✦
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--nv-muted)', margin: 0, position: 'relative', lineHeight: 1.6 }}>
                    {completedCount === 0
                      ? "Mulailah melangkah ke Bagian 1: Kesadaran Adalah Satu-satunya Realitas. Ikuti arahan harian secara tertib."
                      : completedCount < totalLessons
                        ? `Kemajuan Anda luar biasa! Anda menyelesaikan ${completedCount} dari ${totalLessons} pelajaran. Teruslah berpersistensi!`
                        : 'Luar biasa! Anda telah menyelesaikan seluruh pelajaran kurikulum Hukum Asumsi. 🎉'
                    }
                  </p>
                </div>

                {ALL_PARTS.map((part, partIdx) => (
                  <section
                    key={part.id}
                    id={`dash-${part.id}`}
                    className="nv-dash-section"
                    style={{ marginBottom: '32px' }}
                  >
                    <div className="nv-dash-section-head" style={{ borderLeftColor: part.color, paddingLeft: '14px', borderLeftWidth: '3px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontWeight: 800, fontSize: 14, color: part.color }}>
                          {part.num}
                        </span>
                        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#e8e4dc' }}>{part.title}</h2>
                      </div>
                      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginTop: 8 }}>
                        <p style={{ color: 'var(--nv-muted)', fontSize: 13, lineHeight: 1.6, margin: 0, flex: 1 }}>
                          {part.description}
                        </p>
                        <div style={{ width: 140, height: 90, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--nv-glass-border)', flexShrink: 0, position: 'relative' }} className="hidden sm:block">
                          <div style={{ position: 'absolute', inset: '-10%', background: `radial-gradient(ellipse at center, ${part.color}15, transparent 70%)`, pointerEvents: 'none', zIndex: 1 }} />
                          <Image
                            src={partImages[partIdx] || partImages[0]}
                            alt={`Ilustrasi ${part.title}`}
                            fill
                            style={{ objectFit: 'cover', opacity: 0.7 }}
                            sizes="140px"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="nv-dash-lessons-grid mt-4">
                      {part.lessons.map((lesson, lessonIdx) => {
                        const isComplete = completedLessons.has(lesson.num)
                        const isFree = lesson.num === '1.1' || lesson.num === '1.2' || lesson.num === '1.3'
                        const isLocked = !isFree && !hasCurriculumAccess()
                        
                        return (
                          <motion.button
                            key={lesson.num}
                            className={`nv-dash-lesson-card nv-glass ${isComplete ? 'nv-dash-lesson-card-done' : ''} ${isLocked ? 'opacity-70' : ''}`}
                            style={{ 
                              borderColor: isComplete ? `${part.color}44` : undefined, 
                              textAlign: 'left',
                              width: '100%',
                              padding: '16px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px'
                            }}
                            onClick={() => {
                              if (!isLocked) {
                                openLesson(part.id, lesson.num)
                              } else {
                                toast.info('Konten ini dikunci. Silakan lakukan pembayaran di halaman pricing.')
                                setView('pricing')
                              }
                            }}
                            whileHover={!isLocked ? { y: -2, borderColor: `${part.color}66` } : {}}
                            whileTap={!isLocked ? { scale: 0.99 } : {}}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontWeight: 700, fontSize: 12, color: part.color }}>
                                  {lesson.num}
                                </span>
                                <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--nv-text)' }}>{lesson.title}</span>
                              </div>
                              {isLocked ? (
                                <span className="text-xs">🔒</span>
                              ) : isComplete ? (
                                <span style={{ fontSize: 12, color: 'var(--nv-gold)' }}>✓ Selesai</span>
                              ) : isFree ? (
                                <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold uppercase">Gratis</span>
                              ) : null}
                            </div>
                            
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                              {lesson.bullets.slice(0, 2).map((b, i) => (
                                <li key={i} style={{ fontSize: 12, color: 'var(--nv-muted)', paddingLeft: 12, position: 'relative', marginBottom: 2 }}>
                                  <span style={{ position: 'absolute', left: 0, top: 6, width: 3, height: 3, borderRadius: '50%', background: 'var(--nv-faint)' }} />
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </motion.button>
                        )
                      })}
                    </div>
                  </section>
                ))}
              </motion.div>
            )}

            {/* 2. GUIDED MEDITATION AUDIO TAB */}
            {activeTab === 'meditations' && (
              <motion.div
                key="meditations"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
              >
                {/* Embed player if active */}
                {activeAudio && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ marginBottom: '12px' }}
                  >
                    <AudioPlayer 
                      src={`/api/media?type=audio&file=${activeAudio.file}`}
                      title={activeAudio.title}
                      subtitle={`Panduan Meditasi Neville Goddard • ${activeAudio.duration}`}
                      onComplete={() => toast.success(`✦ Sesi meditasi selesai. Rasakan ketenangan Anda.`)}
                    />
                  </motion.div>
                )}

                <div>
                  <h2 className="text-xl font-bold text-[#e8e4dc] leading-tight m-0">🎧 Meditasi Audio Terbimbing</h2>
                  <p className="text-xs text-neutral-400 m-0 mt-1">Gunakan audio frekuensi theta ini di tempat tenang sebelum tidur (kondisi SATS) untuk reprogramming bawah sadar.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MEDITATIONS.map((audio, idx) => {
                    const unlocked = hasAudioAccess(audio.minTier)
                    const isCurrent = activeAudio?.slug === audio.slug
                    
                    return (
                      <motion.div
                        key={audio.slug}
                        className={`nv-pdf-card nv-premium-glass flex flex-row items-center gap-4 ${isCurrent ? 'border-amber-500/50 bg-amber-500/5' : ''}`}
                        style={{ cursor: 'pointer', padding: '16px' }}
                        onClick={() => handleAudioPlay(audio)}
                        whileHover={{ y: -2 }}
                      >
                        <div className="nv-pdf-icon-wrap" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                          {unlocked ? (
                            <Play size={18} fill="currentColor" className="text-[#d4a053]" />
                          ) : (
                            <Lock size={16} className="text-neutral-500" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-neutral-500 font-mono">{audio.duration}</span>
                            {!unlocked && (
                              <span className="text-[9px] bg-red-500/10 border border-red-500/20 text-red-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Locked</span>
                            )}
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#e8e4dc] truncate m-0 mt-0.5">{audio.title}</h4>
                          <p className="text-[11px] text-neutral-400 line-clamp-1 m-0 mt-1">{audio.desc}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* 3. VIP WEBINAR RECORDINGS TAB */}
            {activeTab === 'webinars' && (
              <motion.div
                key="webinars"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <WebinarHub />
              </motion.div>
            )}
          </AnimatePresence>
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

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Play, Calendar, Clock, BookOpen, Crown, X, Volume2, Maximize } from 'lucide-react'
import Image from 'next/image'

const WEBINAR_ITEMS = [
  {
    slug: 'fondasi-hukum-asumsi',
    title: 'Memulai Perjalanan: Fondasi Ajaran Neville Goddard',
    desc: 'Deep-dive 60 menit mengenai konsep I AM, kesadaran sebagai satu-satunya realitas, dan bagaimana menggeser konsep diri secara sadar.',
    duration: '60 Menit',
    date: '10 Feb 2026',
    chapters: '10 Chapter',
    videoUrl: 'https://iframe.mediadelivery.net/play/600939/fb85d795-3365-444f-85c1-48d6a841b87e',
    chaptersList: [
      '00:00 - Pengantar & Selamat Datang',
      '05:15 - Mengapa Metode Manifestasi Lain Sering Gagal',
      '12:30 - Konsep I AM & Pintu Segala Kemungkinan',
      '20:45 - Hubungan Pikiran Sadar vs Bawah Sadar',
      '32:10 - Studi Kasus Konkret Pergeseran Konsep Diri',
      '45:00 - Q&A: Menghadapi Keraguan Pikiran Logis',
      '55:30 - Penutup & Latihan Hari 1'
    ],
    thumbnail: '/images/illustrations/manifestation-journal.webp',
  },
  {
    slug: 'sats-masterclass',
    title: 'SATS Masterclass: Teknik Visualisasi Lanjutan',
    desc: 'Pelajari detail cara rileksasi mendalam masuk ke kondisi mengantuk (State Akin To Sleep) dan cara menyusun adegan imajinasi 3 dimensi yang natural.',
    duration: '90 Menit',
    date: '28 Feb 2026',
    chapters: '15 Chapter',
    videoUrl: 'https://iframe.mediadelivery.net/play/600939/f5f217b6-a6d5-4e2e-98e1-00d21abb2788',
    chaptersList: [
      '00:00 - Pengantar Kondisi SATS',
      '08:45 - Anatomi Gelombang Otak Theta',
      '18:20 - Metode Rileksasi Otot Bertahap',
      '30:15 - Cara Memilih Satu Adegan Singkat yang Berdampak',
      '42:10 - Teknik Mengunci Rasa Puas/Relief',
      '58:00 - Troubleshooting: Mengapa Malah Susah Tidur',
      '01:15:30 - Q&A & Praktik Bersama'
    ],
    thumbnail: '/images/illustrations/meditation-imagination.webp',
  },
  {
    slug: 'revisi-mengubah-masa-lalu',
    title: 'Teknik Revisi: Menulis Ulang Realitas & Menghapus Trauma',
    desc: 'Workshop khusus mengupas teknik revisi Neville Goddard. Pelajari cara mengubah kejadian masa lalu dalam memori agar realitas masa depan bergeser.',
    duration: '45 Menit',
    date: '15 Mar 2026',
    chapters: '8 Chapter',
    videoUrl: 'https://iframe.mediadelivery.net/play/600939/f8f99303-f663-472e-ad80-6e07bc843ef0',
    chaptersList: [
      '00:00 - Apa itu Teknik Revisi?',
      '06:30 - Mengapa Masa Lalu Bersifat Plastis',
      '12:15 - Langkah Demi Langkah Merevisi Hari',
      '22:40 - Merevisi Hubungan & Finansial Masa Lalu',
      '32:00 - Hubungan Fisika Kuantum & Memori',
      '40:00 - Penutup & Kesimpulan Praktis'
    ],
    thumbnail: '/images/illustrations/consciousness-creates-world.png',
  },
  {
    slug: 'imajinasi-menciptakan-realitas',
    title: 'Imajinasi Menciptakan Realitas: Pembuktian Studi Kasus',
    desc: 'Ulasan 5 studi kasus murid Neville Goddard beserta bedah mekanika mental yang terjadi di balik layar dari setiap keberhasilan.',
    duration: '60 Menit',
    date: '02 Apr 2026',
    chapters: '12 Chapter',
    videoUrl: 'https://iframe.mediadelivery.net/play/600939/189a0f56-09fd-4e63-bfb1-884ce6ad049d',
    chaptersList: [
      '00:00 - Pengantar Studi Kasus',
      '07:15 - Kasus 1: Mendapatkan Rumah Impian Tanpa Uang',
      '18:40 - Kasus 2: Pemulihan Kesehatan dari Vonis Kritis',
      '31:00 - Kasus 3: Kenaikan Karir & Rekonsiliasi Hubungan',
      '44:20 - Benang Merah dari Seluruh Keberhasilan',
      '52:45 - Latihan Asumsi 3 Hari Terbimbing'
    ],
    thumbnail: '/images/neville-profile.jpg',
  },
  {
    slug: 'qa-tantangan-praktik',
    title: 'Tanya Jawab Eksklusif: Mengatasi Kendala Praktik Harian',
    desc: 'Rekaman sesi tanya jawab langsung membahas penundaan (*time lag*), cara membiarkan perasaan tanpa memaksakan kehendak, dan persistensi saat situasi luar berlawanan.',
    duration: '45 Menit',
    date: '18 Apr 2026',
    chapters: '6 Chapter',
    videoUrl: 'https://iframe.mediadelivery.net/play/600939/783dc9bc-af50-448a-a620-4f26221ffba4',
    chaptersList: [
      '00:00 - Pengantar Sesi Tanya Jawab',
      '04:30 - Tanya 1: Bagaimana Cara Mengatasi Time Lag?',
      '14:15 - Tanya 2: Apa yang Harus Dilakukan Saat Mood Drop?',
      '25:10 - Tanya 3: 3 Dosa Terbesar Saat Menggunakan Hukum Asumsi',
      '38:00 - Ringkasan Solusi Praktis & Penutup'
    ],
    thumbnail: '/images/neville-goddard.png',
  }
]

export default function WebinarHub() {
  const { subscriptionTier, setView } = useAppStore()
  const [activeWebinar, setActiveWebinar] = useState<typeof WEBINAR_ITEMS[0] | null>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [playbackProgress, setPlaybackProgress] = useState(0)

  const isMaster = subscriptionTier === 'master'

  const handleCardClick = (webinar: typeof WEBINAR_ITEMS[0]) => {
    if (!isMaster) {
      setView('pricing')
      return
    }
    setActiveWebinar(webinar)
    setVideoPlaying(true)
    setPlaybackProgress(20) // Simulated progress indicator starting point
  }

  const handleClose = () => {
    setActiveWebinar(null)
    setVideoPlaying(false)
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#e8e4dc] leading-tight m-0">🎥 Webinar Eksklusif VIP</h2>
          <p className="text-xs text-neutral-400 m-0 mt-1">Sesi rekaman workshop lanjutan untuk pendalaman materi SATS, konsep diri, dan revisi realitas.</p>
        </div>
        {!isMaster && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold rounded-lg uppercase">
            <Crown size={12} /> Master Tier Only
          </span>
        )}
      </div>

      <div className="nv-webinar-grid">
        {WEBINAR_ITEMS.map((webinar, idx) => (
          <motion.div
            key={webinar.slug}
            className="nv-webinar-card nv-premium-glass nv-premium-glass-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
          >
            <div className="nv-webinar-thumbnail-frame" onClick={() => handleCardClick(webinar)}>
              <Image
                src={webinar.thumbnail}
                alt={webinar.title}
                fill
                className="nv-webinar-thumbnail-image"
                sizes="(max-width: 768px) 100vw, 360px"
              />
              <div className="nv-webinar-play-overlay">
                <div className="nv-webinar-play-btn-circle">
                  <Play size={18} fill="currentColor" className="ml-0.5" />
                </div>
              </div>
              <span className="nv-webinar-duration-badge">{webinar.duration}</span>
              
              {!isMaster && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-2">
                  <Crown size={24} className="text-[#d4a053] drop-shadow-md" />
                  <span className="text-xs font-bold uppercase text-[#d4a053] tracking-wide">Locked — Upgrade Tier</span>
                </div>
              )}
            </div>

            <div className="nv-webinar-card-info" onClick={() => handleCardClick(webinar)}>
              <div className="flex items-center justify-between">
                <span className="nv-webinar-chapters-badge">{webinar.chapters}</span>
                <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                  <Calendar size={10} /> {webinar.date}
                </span>
              </div>
              <h3 className="nv-webinar-title text-sm font-bold text-[#e8e4dc] leading-snug m-0 mt-1 line-clamp-1">
                {webinar.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed m-0 mt-1 line-clamp-2">
                {webinar.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Custom Video Player Modal */}
      <AnimatePresence>
        {activeWebinar && (
          <div className="nv-modal-overlay" onClick={handleClose}>
            <motion.div
              className="nv-modal-content nv-video-modal-container"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-900">
                <div>
                  <span className="text-[10px] text-[#d4a053] font-bold tracking-wider uppercase">WEBINAR WORKSHOP</span>
                  <h3 className="text-base font-bold text-[#e8e4dc] m-0 line-clamp-1">{activeWebinar.title}</h3>
                </div>
                <button className="text-neutral-400 hover:text-white" onClick={handleClose}>
                  <X size={18} />
                </button>
              </div>

              {/* Video Player */}
              <div className="nv-video-player-frame relative w-full aspect-video bg-neutral-950 overflow-hidden rounded-none">
                <iframe
                  src={activeWebinar.videoUrl}
                  loading="lazy"
                  style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%', left: 0 }}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen={true}
                />
              </div>

              {/* Chapters & Info panel */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#0a0a0c]">
                <div className="md:col-span-2">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Tentang Sesi Ini</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed m-0">{activeWebinar.desc}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-neutral-500 font-mono">
                    <span className="flex items-center gap-1"><Clock size={12} /> {activeWebinar.duration}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {activeWebinar.date}</span>
                  </div>
                </div>
                
                <div className="border-t border-neutral-900 pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-6 border-l-neutral-900">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Chapters</h4>
                  <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto pr-2 nv-scroll-premium">
                    {activeWebinar.chaptersList.map((chapter, i) => (
                      <div key={i} className="flex gap-2 text-[11px] leading-tight text-neutral-400 hover:text-white cursor-pointer transition">
                        <span className="text-[#d4a053] font-bold font-mono">►</span>
                        <span>{chapter}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

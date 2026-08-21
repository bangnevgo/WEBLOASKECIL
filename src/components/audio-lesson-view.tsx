'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Share2, 
  Check, 
  Sparkles, 
  Clock, 
  Headphones, 
  BookOpen, 
  Users, 
  HelpCircle,
  Volume2,
  ChevronDown
} from 'lucide-react'
import { toast } from 'sonner'
import CustomAudioPlayer from '@/components/ui/audio-player'
import { AudioLesson } from '@/lib/audio-data'

interface Props {
  lesson: AudioLesson
}

export default function AudioLessonView({ lesson }: Props) {
  const [copied, setCopied] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const shareUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://loas.nevgoinstitute.com/audio/${lesson.slug}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Link audio berhasil disalin! Siap dibagikan ke grup.')
    setTimeout(() => setCopied(false), 2500)
  }

  const handleShareWhatsApp = () => {
    const text = `🎧 *${lesson.title}*\n\n"${lesson.description}"\n\nDengarkan audio eksklusifnya di sini:\n👉 ${shareUrl}`
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(waUrl, '_blank')
  }

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#070707] text-[#e8e4dc] selection:bg-[#d4a053]/30 selection:text-[#ffd27d]">
      {/* Top Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4a053]/10 blur-[130px] pointer-events-none -z-10" />

      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-900 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link 
          href="/#knowledge-bank" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-400 hover:text-white transition group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-[#d4a053]" />
          <span>Kembali ke Kurikulum LOAS</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition"
            title="Salin Link"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
            <span>{copied ? 'Tersalin' : 'Salin Link'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 transition"
          >
            <span>Share ke WA</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Badges with Instant Free 50 Modules CTA */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[#d4a053]/10 border border-[#d4a053]/30 text-[#d4a053]">
            <Headphones size={12} /> {lesson.category}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-neutral-400 bg-neutral-900 border border-neutral-800">
            <Clock size={12} /> {lesson.duration}
          </span>

          {/* 🌟 Mini Mobile-First Hero CTA */}
          <Link
            href="/#curriculum"
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4a053]/20 to-amber-500/25 text-[#ffd27d] border border-[#d4a053]/60 shadow-sm hover:brightness-125 transition ml-auto sm:ml-0"
          >
            <Sparkles size={12} className="text-[#ffd27d]" />
            <span>AKSES FREE MATERI 50 MODUL ➔</span>
          </Link>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-outfit m-0">
          {lesson.title}
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 mt-3 leading-relaxed max-w-2xl">
          {lesson.subtitle}
        </p>

        {/* Speaker Info */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-neutral-900">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4a053] to-[#8a5a1f] flex items-center justify-center font-bold text-neutral-950 text-sm shadow-md">
            BN
          </div>
          <div>
            <div className="text-sm font-bold text-white">{lesson.author.name}</div>
            <div className="text-xs text-neutral-400">{lesson.author.role}</div>
          </div>
        </div>

        {/* 🎧 Dedicated Audio Player Card */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-2xl overflow-hidden border border-[#d4a053]/30 bg-gradient-to-b from-[#16130e] to-[#0c0c0c] shadow-2xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800/80">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4a053] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#d4a053]"></span>
              </span>
              <span className="text-xs font-mono font-bold text-[#d4a053] uppercase tracking-wider">
                Pemutar Audio Khusus
              </span>
            </div>
            <span className="text-xs text-neutral-500 font-mono">
              High Quality Stereo (AAC / MP3)
            </span>
          </div>

          <CustomAudioPlayer 
            src={lesson.audioUrl} 
            title={lesson.title} 
            subtitle={`Oleh ${lesson.author.name} · ${lesson.duration}`}
          />
        </motion.div>

        {/* 🚀 Instant Under-Player Mini Banner CTA (Directly visible on Mobile) */}
        <Link
          href="/#curriculum"
          className="mt-3.5 w-full py-2.5 px-4 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#1f180d] via-[#2a1e0f] to-[#1f180d] border border-[#d4a053]/50 text-[#ffd27d] hover:border-[#d4a053] hover:brightness-110 transition flex items-center justify-center gap-2 shadow-lg font-mono tracking-wide group"
        >
          <Sparkles size={14} className="text-[#ffd27d]" />
          <span>AKSES FREE MATERI 50 MODUL ➔</span>
        </Link>

        {/* Action Share Bar under Player */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
          <div className="text-xs text-neutral-400 text-center sm:text-left">
            💡 <strong className="text-neutral-200">Manfaat berbagi:</strong> Bantu teman Anda memahami cara kerja batin dan memutus siklus kecemasan.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#25D366] text-black hover:bg-[#20bd5a] transition shadow-lg"
            >
              <Share2 size={14} />
              <span>Bagikan ke WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-800 text-white hover:bg-neutral-700 transition"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              <span>{copied ? 'Tersalin' : 'Salin URL'}</span>
            </button>
          </div>
        </div>

        {/* 📝 Intisari 4 Poin Kunci */}
        <section className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={20} className="text-[#d4a053]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white font-outfit m-0">
              Intisari Pembahasan Rekaman
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.keyTakeaways.map((item) => (
              <div 
                key={item.number}
                className="p-5 rounded-xl bg-neutral-900/30 border border-neutral-800/70 hover:border-[#d4a053]/40 transition duration-300 relative group overflow-hidden"
              >
                <div className="text-2xl font-black font-mono text-[#d4a053]/30 group-hover:text-[#d4a053]/50 transition mb-2">
                  {item.number}
                </div>
                <h3 className="text-sm font-bold text-white leading-snug m-0 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed m-0">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ⏰ Waktu Mendengarkan Terbaik */}
        <section className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-neutral-900/40 to-neutral-900/20 border border-amber-500/20">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 m-0 mb-4">
            <Clock size={18} className="text-amber-400" />
            Waktu Rekomendasi Mendengarkan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lesson.bestListeningTime.map((rec, i) => (
              <div key={i} className="p-4 rounded-xl bg-black/40 border border-neutral-800">
                <div className="text-xs font-bold text-amber-300 mb-1">{rec.time}</div>
                <p className="text-xs text-neutral-400 leading-relaxed m-0">{rec.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ❓ Tanya Jawab (FAQ) */}
        <section className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle size={20} className="text-[#d4a053]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white font-outfit m-0">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="space-y-3">
            {lesson.faq.map((item, idx) => {
              const isOpen = openFaq === idx
              return (
                <div 
                  key={idx}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/30 overflow-hidden transition"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-800/30 transition"
                  >
                    <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {item.q}
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-neutral-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-[#d4a053]' : ''}`} 
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/50 bg-black/20">
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* 🎁 Single Focused Curiosity Bridge: Akses Free Materi */}
        <section className="mt-14 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1c160e] via-[#12100d] to-[#080808] border border-[#d4a053]/40 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4a053]/15 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest bg-[#d4a053]/20 text-[#ffd27d] border border-[#d4a053]/35 mb-5 shadow-sm">
              <Sparkles size={13} className="text-[#ffd27d]" /> JEMBATAN PRAKTIK LANJUTAN
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white font-outfit m-0 leading-tight">
              Tubuh Anda Sudah Sadar, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd27d] via-[#d4a053] to-[#e6b467]">
                Lalu Apa Langkah 7 Hari ke Depan?
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 mt-4 leading-relaxed max-w-xl mx-auto">
              Mengetahui bahwa tubuh Anda kecanduan masa lalu adalah baru permulaan. Batin Anda butuh panduan latihan nyata untuk mereset sel-sel tubuh dan membiasakan perasaan kealamian setiap hari.
            </p>

            {/* Single Powerful CTA Button */}
            <div className="mt-8">
              <Link
                href="/#knowledge-bank"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm sm:text-base font-bold bg-gradient-to-r from-[#d4a053] to-[#e6b467] text-neutral-950 hover:brightness-110 transition shadow-xl shadow-[#d4a053]/25 group"
              >
                <BookOpen size={18} />
                <span>Akses Free Materi 50 Modul ➔</span>
              </Link>
            </div>

            <p className="text-[11px] sm:text-xs text-neutral-500 mt-4 font-mono">
              ✨ Termasuk Ebook Panduan Praktik, Full Rekaman Webinar, &amp; Kurikulum 10 Part
            </p>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="mt-16 border-t border-neutral-900 py-8 px-6 text-center text-xs text-neutral-500 font-mono">
        <p className="m-0">© {new Date().getFullYear()} Nevgo Institute · Hukum Asumsi (Law of Assumption Series)</p>
      </footer>
    </div>
  )
}

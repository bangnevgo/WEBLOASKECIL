'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { useTranslation } from '@/lib/translations'
import { toast } from 'sonner'
import BookingModal from '@/components/booking-modal'
import { Calendar } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const INITIAL_GREETING: Message = {
  role: 'assistant',
  content: 'Salam, sahabat pencari kebenaran ✦\n\nSaya adalah AI mentor Anda berdasarkan ajaran Neville Goddard. Saya di sini untuk membantu Anda mengidentifikasi bottleneck dalam manifestasi dan memberikan panduan personal.\n\nCeritakan kepada saya: apa yang sedang Anda coba manifestasikan, dan apa tantangan terbesar yang Anda hadapi saat ini?',
}

const INITIAL_GREETING_EN: Message = {
  role: 'assistant',
  content: 'Greetings, fellow seeker of truth ✦\n\nI am your AI mentor based on the teachings of Neville Goddard. I am here to help you identify bottlenecks in your manifestation and provide personalized guidance.\n\nTell me: what are you currently trying to manifest, and what is the biggest challenge you face right now?',
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}


export default function AiPrivateSession() {
  const { setView } = useAppStore()
  const { t, language } = useTranslation()
  const hasAccess = useAppStore((s) => s.hasCommunityAccess())
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Sync initial message language
  useEffect(() => {
    if (messages.length === 0 || (messages.length === 1 && (messages[0].content === INITIAL_GREETING.content || messages[0].content === INITIAL_GREETING_EN.content))) {
      setMessages([language === 'en' ? INITIAL_GREETING_EN : INITIAL_GREETING])
    }
  }, [language])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'private-session',
          language,
          payload: { messages: updatedMessages.map(m => ({ role: m.role, content: m.content })) },
        }),
      })
      const data = await res.json()
      if (data.success && data.data?.message) {
        setMessages([...updatedMessages, { role: 'assistant', content: data.data.message }])
      } else {
        const mockResponsesId = [
          'Berdasarkan ajaran Neville, tantangan yang Anda gambarkan berkaitan dengan persistensi. Anda telah mengasumsikan keadaan baru, tetapi ketika 3D menunjukkan bukti sebaliknya, Anda kembali ke keadaan lama. Ingat: "An assumption, though false, if persisted in, will harden into fact." Kuncinya adalah TETAP berada dalam asumsi baru meskipun dunia luar belum menunjukkan perubahan.\n\nPraktik: Malam ini sebelum tidur, masuk ke SATS dan rasakan adegan di mana keinginan Anda SUDAH terwujud. Jangan fokus pada "bagaimana" — cukup rasakan realitasnya. Lakukan ini 7 malam berturut-turut tanpa pengecualian.',
          'Saya mendengar ketidaknyamanan Anda. Dalam kerangka Neville, apa yang Anda rasakan adalah "crucifixion moment" — momen di mana keadaan lama dan keadaan baru berjuang untuk dominasi. Ini BUKAN tanda kegagalan; ini adalah tanda bahwa proses sedang bekerja.\n\nNeville mengatakan: "If the fool would persist in his folly, he would become wise." Yang tampak sebagai kebodohan dari perspektif 3D — memegang asumsi yang bertentangan dengan bukti — adalah kebijaksanaan tertinggi dari perspektif 4D.\n\nYang perlu Anda lakukan: kembalilah ke perasaan keinginan yang telah terwujud. Setiap kali keraguan muncul, jangan lawan — cukup alihkan perhatian Anda ke perasaan tersebut.',
        ]

        const randomResponse = mockResponsesId[Math.floor(Math.random() * mockResponsesId.length)]
        setMessages([...updatedMessages, { role: 'assistant', content: randomResponse }])
      }
    } catch {
      toast(language === 'en' ? 'An error occurred. Please try again.' : 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="nv-ai-page">
      {/* Header */}
      <header className="nv-ai-header">
        <div className="nv-ai-header-inner flex items-center justify-between">
          <button className="nv-back-btn" onClick={() => setView('landing')}>
            {language === 'en' ? '← Back' : '← Kembali'}
          </button>
          
          <button
            onClick={() => setShowBookingModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#d4a053] to-[#b8862d] text-black font-extrabold text-xs shadow-md hover:opacity-95 transition"
          >
            <Calendar size={13} />
            <span>Booking Konsultasi 1-on-1</span>
          </button>
        </div>
      </header>

      {/* Title Section */}
      <motion.section className="nv-ai-hero" {...fadeIn}>
        <div className="nv-ai-hero-glow" />
        <div className="nv-ai-hero-content">
          <span className="nv-ai-hero-icon">💬</span>
          <h1 className="nv-ai-hero-title">Private Session & Konsultasi</h1>
          <p className="nv-ai-hero-subtitle">
            {language === 'en'
              ? 'Personal consultation session with AI mentor or book a direct 1-on-1 session with Bang Nevgo'
              : 'Sesi konsultasi personal dengan AI mentor atau booking sesi 1-on-1 langsung dengan Bang Nevgo'
            }
          </p>
          
          <button
            onClick={() => setShowBookingModal(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs hover:bg-amber-500/20 transition flex items-center gap-2 mx-auto"
          >
            <Calendar size={14} />
            <span>📅 Klik Di Sini Untuk Pilih Jadwal Google Calendar & Meet</span>
          </button>
        </div>
      </motion.section>

      {/* Chat Area */}
      <div className="nv-ai-chat-container" ref={chatContainerRef}>
        <div className="nv-ai-chat-messages">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`nv-ai-chat-msg nv-ai-chat-msg-${msg.role}`}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {msg.role === 'assistant' && (
                  <span className="nv-ai-chat-avatar">✦</span>
                )}
                <div className={`nv-ai-chat-bubble nv-ai-chat-bubble-${msg.role}`}>
                  {msg.content.split('\n').map((line, li) => (
                    <span key={li}>
                      {line}
                      {li < msg.content.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              className="nv-ai-chat-msg nv-ai-chat-msg-assistant"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="nv-ai-chat-avatar">✦</span>
              <div className="nv-ai-chat-bubble nv-ai-chat-bubble-assistant">
                <span className="nv-ai-typing">
                  <span className="nv-ai-typing-dot" />
                  <span className="nv-ai-typing-dot" />
                  <span className="nv-ai-typing-dot" />
                </span>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="nv-ai-chat-input-bar">
        <div className="nv-ai-chat-input-wrap">
          <textarea
            className="nv-ai-chat-input"
            rows={1}
            placeholder={language === 'en' ? 'Ask something about manifestation...' : 'Tanyakan sesuatu tentang manifestasi...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <motion.button
            className="nv-ai-chat-send"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ➤
          </motion.button>
        </div>
      </div>

      <BookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </div>
  )
}

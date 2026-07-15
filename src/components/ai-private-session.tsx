'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { useTranslation } from '@/lib/translations'
import { toast } from 'sonner'

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
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function AiPrivateSession() {
  const { setView } = useAppStore()
  const { t, language } = useTranslation()
  const hasAccess = useAppStore((s) => s.hasCommunityAccess())
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
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
        // Fallback mock responses
        const mockResponsesEn = [
          'Based on Neville’s teachings, the challenge you described is related to persistence. You have assumed the new state, but when the 3D world shows evidence to the contrary, you return to the old state. Remember: "An assumption, though false, if persisted in, will harden into fact." The key is to REMAIN in the new assumption even if the outer world has not shown changes yet.\n\nPractice: Tonight before bed, enter SATS and feel the scene where your desire is ALREADY fulfilled. Do not focus on "how" — simply feel its reality. Do this for 7 consecutive nights without exception.',
          'I hear your discomfort. In Neville’s framework, what you feel is the "crucifixion moment" — the moment where the old state and the new state fight for dominance. This is NOT a sign of failure; it is a sign that the process is working.\n\nNeville said: "If the fool would persist in his folly, he would become wise." What seems like foolishness from the 3D perspective — holding an assumption that contradicts the evidence — is the highest wisdom from the 4D perspective.\n\nWhat you need to do: return to the feeling of the wish fulfilled. Whenever doubt arises, do not fight it — simply redirect your attention to that feeling.',
          'The pattern you described is very common. You say "I AM [desire]" but your feeling says "I AM NOT [desire]." Neville teaches that when two feelings conflict, the more dominant feeling will be expressed.\n\nTo change this, you need to make the feeling of the wish fulfilled more real and more dominant than the feeling of the current state. How:\n\n1. Identify the specific feeling you would feel if your desire were already fulfilled.\n2. Practice that feeling in silence, not with words, but with sensations in your body.\n3. Carry that feeling into your nightly SATS.\n\nFeeling is not emotion — it is a state of consciousness. Feel the REALITY of your desire.'
        ]

        const mockResponsesId = [
          'Berdasarkan ajaran Neville, tantangan yang Anda gambarkan berkaitan dengan persistensi. Anda telah mengasumsikan keadaan baru, tetapi ketika 3D menunjukkan bukti sebaliknya, Anda kembali ke keadaan lama. Ingat: "An assumption, though false, if persisted in, will harden into fact." Kuncinya adalah TETAP berada dalam asumsi baru meskipun dunia luar belum menunjukkan perubahan.\n\nPraktik: Malam ini sebelum tidur, masuk ke SATS dan rasakan adegan di mana keinginan Anda SUDAH terwujud. Jangan fokus pada "bagaimana" — cukup rasakan realitasnya. Lakukan ini 7 malam berturut-turut tanpa pengecualian.',
          'Saya mendengar ketidaknyamanan Anda. Dalam kerangka Neville, apa yang Anda rasakan adalah "cruci fixion moment" — momen di mana keadaan lama dan keadaan baru berjuang untuk dominasi. Ini BUKAN tanda kegagalan; ini adalah tanda bahwa proses sedang bekerja.\n\nNeville mengatakan: "If the fool would persist in his folly, he would become wise." Yang tampak sebagai kebodohan dari perspektif 3D — memegang asumsi yang bertentangan dengan bukti — adalah kebijaksanaan tertinggi dari perspektif 4D.\n\nYang perlu Anda lakukan: kembalilah ke perasaan keinginan yang telah terwujud. Setiap kali keraguan muncul, jangan lawan — cukup alihkan perhatian Anda ke perasaan tersebut.',
          'Pola yang Anda gambarkan sangat umum. Anda mengatakan "I AM [keinginan]" tetapi perasaan Anda mengatakan "I AM NOT [keinginan]." Neville mengajarkan bahwa ketika dua perasaan bertentangan, perasaan yang lebih dominan yang akan terekspresikan.\n\nUntuk mengubah ini, Anda perlu membuat perasaan dari keinginan yang terwujud menjadi lebih nyata dan lebih dominan daripada perasaan dari keadaan saat ini. Caranya:\n\n1. Identifikasi perasaan spesifik yang akan Anda rasakan jika keinginan sudah terwujud\n2. Latih perasaan itu dalam keheningan, bukan dengan kata-kata, melainkan dengan sensasi di tubuh\n3. Bawa perasaan itu ke dalam SATS malam Anda\n\nPerasaan bukan emosi — ia adalah keadaan kesadaran. Rasakan KENYATAAN dari keinginan Anda.'
        ]

        const activeMocks = language === 'en' ? mockResponsesEn : mockResponsesId
        const randomResponse = activeMocks[Math.floor(Math.random() * activeMocks.length)]
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

  // Access lock overlay
  if (!hasAccess) {
    return (
      <div className="nv-ai-page">
        <header className="nv-ai-header">
          <div className="nv-ai-header-inner">
            <button className="nv-back-btn" onClick={() => setView('landing')}>
              {language === 'en' ? '← Back' : '← Kembali'}
            </button>
            <span className="nv-ai-premium-badge">🔒 PREMIUM</span>
          </div>
        </header>

        <motion.div className="nv-ai-locked-overlay" {...fadeIn}>
          <div className="nv-ai-locked-glow" />
          <span className="nv-ai-locked-icon">💬</span>
          <h2 className="nv-ai-locked-title">{language === 'en' ? 'Premium Feature' : 'Fitur Premium'}</h2>
          <p className="nv-ai-locked-desc">
            {language === 'en'
              ? 'Private Session is available for subscribers. Get a personalized AI consultation session to identify your manifestation bottlenecks.'
              : 'Private Session tersedia untuk pelanggan. Dapatkan sesi konsultasi personal dengan AI untuk mengidentifikasi bottleneck manifestasi Anda.'
            }
          </p>
          <motion.button
            className="nv-cta-button"
            onClick={() => window.open('https://cohort.nevgoinstitute.com', '_blank', 'noopener')}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="nv-cta-icon">✦</span>
            {language === 'en' ? 'Join the Cohort Program' : 'Ikut Program Cohort'}
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="nv-ai-page">
      {/* Header */}
      <header className="nv-ai-header">
        <div className="nv-ai-header-inner">
          <button className="nv-back-btn" onClick={() => setView('landing')}>
            {language === 'en' ? '← Back' : '← Kembali'}
          </button>
          <span className="nv-ai-premium-badge">🔒 PREMIUM</span>
        </div>
      </header>

      {/* Title Section */}
      <motion.section className="nv-ai-hero" {...fadeIn}>
        <div className="nv-ai-hero-glow" />
        <div className="nv-ai-hero-content">
          <span className="nv-ai-hero-icon">💬</span>
          <h1 className="nv-ai-hero-title">Private Session</h1>
          <p className="nv-ai-hero-subtitle">
            {language === 'en'
              ? 'Personal consultation session with AI mentor based on Neville Goddard’s teachings'
              : 'Sesi konsultasi personal dengan AI mentor berdasarkan ajaran Neville'
            }
          </p>
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
    </div>
  )
}

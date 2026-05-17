'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { toast } from 'sonner'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const INITIAL_GREETING: Message = {
  role: 'assistant',
  content: 'Salam, sahabat pencari kebenaran ✦\n\nSaya adalah AI mentor Anda berdasarkan ajaran Neville Goddard. Saya di sini untuk membantu Anda mengidentifikasi bottleneck dalam manifestasi dan memberikan panduan personal.\n\nCeritakan kepada saya: apa yang sedang Anda coba manifestasikan, dan apa tantangan terbesar yang Anda hadapi saat ini?',
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function AiPrivateSession() {
  const { setView } = useAppStore()
  const hasFullAccess = useAppStore((s) => s.hasFullAccess())
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING])
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
          payload: { messages: updatedMessages.map(m => ({ role: m.role, content: m.content })) },
        }),
      })
      const data = await res.json()
      if (data.success && data.data?.message) {
        setMessages([...updatedMessages, { role: 'assistant', content: data.data.message }])
      } else {
        // Fallback mock response
        const mockResponses = [
          'Berdasarkan ajaran Neville, tantangan yang Anda gambarkan berkaitan dengan persistensi. Anda telah mengasumsikan keadaan baru, tetapi ketika 3D menunjukkan bukti sebaliknya, Anda kembali ke keadaan lama. Ingat: "An assumption, though false, if persisted in, will harden into fact." Kuncinya adalah TETAP berada dalam asumsi baru meskipun dunia luar belum menunjukkan perubahan.\n\nPraktik: Malam ini sebelum tidur, masuk ke SATS dan rasakan adegan di mana keinginan Anda SUDAH terwujud. Jangan fokus pada "bagaimana" — cukup rasakan realitasnya. Lakukan ini 7 malam berturut-turut tanpa pengecualian.',
          'Saya mendengar ketidaknyamanan Anda. Dalam kerangka Neville, apa yang Anda rasakan adalah "cruci fixion moment" — momen di mana keadaan lama dan keadaan baru berjuang untuk dominasi. Ini BUKAN tanda kegagalan; ini adalah tanda bahwa proses sedang bekerja.\n\nNeville mengatakan: "If the fool would persist in his folly, he would become wise." Yang tampak sebagai kebodohan dari perspektif 3D — memegang asumsi yang bertentangan dengan bukti — adalah kebijaksanaan tertinggi dari perspektif 4D.\n\nYang perlu Anda lakukan: kembalilah ke perasaan keinginan yang telah terwujud. Setiap kali keraguan muncul, jangan lawan — cukup alihkan perhatian Anda ke perasaan tersebut.',
          'Pola yang Anda gambarkan sangat umum. Anda mengatakan "I AM [keinginan]" tetapi perasaan Anda mengatakan "I AM NOT [keinginan]." Neville mengajarkan bahwa ketika dua perasaan bertentangan, perasaan yang lebih dominan yang akan terekspresikan.\n\nUntuk mengubah ini, Anda perlu membuat perasaan dari keinginan yang terwujud menjadi lebih nyata dan lebih dominan daripada perasaan dari keadaan saat ini. Caranya:\n\n1. Identifikasi perasaan spesifik yang akan Anda rasakan jika keinginan sudah terwujud\n2. Latih perasaan itu dalam keheningan, bukan dengan kata-kata, melainkan dengan sensasi di tubuh\n3. Bawa perasaan itu ke dalam SATS malam Anda\n\nPerasaan bukan emosi — ia adalah keadaan kesadaran. Rasakan KENYATAAN dari keinginan Anda.',
        ]
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
        setMessages([...updatedMessages, { role: 'assistant', content: randomResponse }])
      }
    } catch {
      toast('Terjadi kesalahan. Silakan coba lagi.')
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

  // Premium lock overlay
  if (!hasFullAccess) {
    return (
      <div className="nv-ai-page">
        <header className="nv-ai-header">
          <div className="nv-ai-header-inner">
            <button className="nv-back-btn" onClick={() => setView('landing')}>
              ← Kembali
            </button>
            <span className="nv-ai-premium-badge">🔒 PREMIUM</span>
          </div>
        </header>

        <motion.div className="nv-ai-locked-overlay" {...fadeIn}>
          <div className="nv-ai-locked-glow" />
          <span className="nv-ai-locked-icon">💬</span>
          <h2 className="nv-ai-locked-title">Fitur Premium</h2>
          <p className="nv-ai-locked-desc">
            Private Session tersedia untuk pelanggan. Dapatkan sesi konsultasi personal dengan AI untuk mengidentifikasi bottleneck manifestasi Anda.
          </p>
          <motion.button
            className="nv-cta-button"
            onClick={() => setView('pricing')}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="nv-cta-icon">✦</span>
            Buka Akses Premium
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
            ← Kembali
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
          <p className="nv-ai-hero-subtitle">Sesi konsultasi personal dengan AI mentor berdasarkan ajaran Neville</p>
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
            placeholder="Tanyakan sesuatu tentang manifestasi..."
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

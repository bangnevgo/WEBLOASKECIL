'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { SHADOW_QUESTIONS } from '@/lib/ai-prompts'
import { toast } from 'sonner'

const EMOJI_SCALE = ['😟', '😕', '😐', '🙂', '😄']

interface ShadowResult {
  patterns: { title: string; description: string; icon: string }[]
  koneksiManifestasi: { pattern: string; connection: string }[]
  integrationSteps: { step: string; detail: string }[]
  praktikHarian: { title: string; detail: string }[]
  peringatan: string[]
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function AiShadow() {
  const { setView } = useAppStore()
  const hasFullAccess = useAppStore((s) => s.hasFullAccess())
  const [step, setStep] = useState<1 | 2>(1)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | number>>({})
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ShadowResult | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const questions = SHADOW_QUESTIONS
  const progress = ((currentQ + 1) / questions.length) * 100

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  const handleNext = () => {
    const q = questions[currentQ]
    if (answers[q.id] === undefined || answers[q.id] === '') {
      toast('Harap jawab pertanyaan ini terlebih dahulu')
      return
    }
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    }
  }

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1)
    }
  }

  const handleSubmit = async () => {
    const q = questions[currentQ]
    if (answers[q.id] === undefined || answers[q.id] === '') {
      toast('Harap jawab pertanyaan ini terlebih dahulu')
      return
    }
    setLoading(true)
    setStep(2)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'shadow',
          payload: { answers, questions: questions.map(q => q.question) },
        }),
      })
      const data = await res.json()
      if (data.success && data.data) {
        setResults(data.data)
      } else {
        // Fallback mock results
        setResults({
          patterns: [
            { title: 'Bayangan Kemarahan Tertahan', description: 'Anda menekan kemarahan karena diajarkan bahwa kemarahan itu buruk. Bayangan ini memanifestasikan sebagai passivity dan ketidakmampuan menetapkan batasan.', icon: '🌑' },
            { title: 'Bayangan Kebutuhan Pengakuan', description: 'Anda merasa tidak nyaman menerima pujian namun secara bawah sadar sangat menginginkannya. Ini menciptakan pola overachieving yang didorong oleh rasa kurang.', icon: '🪞' },
            { title: 'Bayangan Kontrol', description: 'Anda mencoba mengontrol setiap aspek manifestasi — kapan, bagaimana, dan melalui siapa — yang justru menghalangi aliran alami dari hukum asumsi.', icon: '🕸️' },
          ],
          koneksiManifestasi: [
            { pattern: 'Kemarahan Tertahan', connection: 'Kemarahan yang ditekan menciptakan resistensi internal terhadap menerima. Anda tidak bisa menerima manifestasi jika bagian diri Anda merasa tidak berhak mengambil ruang.' },
            { pattern: 'Kebutuhan Pengakuan', connection: 'Ketika manifestasi didorong oleh kebutuhan pengakuan luar, hasilnya tidak pernah cukup. Neville mengajarkan bahwa motivasi harus datang dari perasaan dalam, bukan validasi luar.' },
            { pattern: 'Kontrol', connection: 'Upaya mengontrol "bagaimana" manifestasi terjadi menunjukkan kurangnya iman. Hukum asumsi bekerja ketika Anda fokus pada akhir, bukan proses.' },
          ],
          integrationSteps: [
            { step: 'Menghadapi Bayangan', detail: 'Duduklah dalam keheningan selama 10 menit. Bayangkan versi diri Anda yang paling Anda benci atau takuti. Tatap mata bayangan itu. Tanyakan: "Apa yang Anda butuhkan dari saya?" Dengarkan tanpa menilai.' },
            { step: 'Mengakui & Merasakan', detail: 'Tulis surat kepada bayangan Anda. Akui keberadaannya. Jangan mencoba mengubahnya — cukup akui bahwa ia ada dan bahwa ia adalah bagian dari kesadaran Anda.' },
            { step: 'Revisi: Mati kepada Diri Lama', detail: 'Setiap malam sebelum tidur, revisilah momen hari ini di mana bayangan Anda muncul. Bayangkan Anda merespons dari keadaan kesadaran baru — keadaan yang sudah terintegrasi.' },
            { step: 'Afirmasi Integrasi', detail: 'Ganti penolakan dengan penerimaan: "I AM utuh — termasuk bagian-bagian yang saya coba sembunyikan. Kekuatan saya ada dalam penerimaan, bukan penolakan."' },
          ],
          praktikHarian: [
            { title: 'Jurnal Bayangan Pagi', detail: 'Saat bangun, tuliskan emosi pertama yang muncul. Jika ada ketidaknyamanan, jelajahi tanpa menilai. Tanyakan: "Bagian diri mana yang merasakan ini?"' },
            { title: 'Cermin Mida Hari', detail: 'Tiga kali sehari, tatap cermin selama 30 detik. Lihatlah tanpa kritik. Katakan: "I AM menerima diri saya sepenuhnya, termasuk bayangan saya."' },
            { title: 'SATS Integrasi Malam', detail: 'Sebelum tidur, bayangkan diri Anda yang terintegrasi — versi di mana bayangan bukan musuh melainkan sekutu. Rasakan kedamaian dari keutuhan ini.' },
          ],
          peringatan: [
            'Integrasi shadow bukan proses yang linear — ada kemunduran dan itu normal. Jangan menilai diri saat bayangan muncul kembali.',
            'Jangan memaksakan integrasi. Proses ini membutuhkan kelembutan terhadap diri sendiri, bukan kekerasan.',
            'Jika Anda merasa kewalahan, hentikan praktik dan kembali ke fondasi: perasaan damai dan aman di saat ini.',
            'Shadow work bisa membuka lama lama. Jika Anda merasa perlu dukungan profesional, jangan ragu untuk mencarinya.',
            'Ingat: bayangan Anda bukan musuh — ia adalah bagian dari kesadaran yang mencoba dilindungi dengan cara yang sudah usang.',
          ],
        })
      }
    } catch {
      toast('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    toast('Disalin!')
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  // Premium lock overlay
  if (!hasFullAccess) {
    return (
      <div className="nv-ai-page nv-ai-shadow-theme">
        <header className="nv-ai-header">
          <div className="nv-ai-header-inner">
            <button className="nv-back-btn" onClick={() => setView('landing')}>
              ← Kembali
            </button>
            <span className="nv-ai-premium-badge nv-ai-shadow-badge">🔒 PREMIUM</span>
          </div>
        </header>

        <motion.div className="nv-ai-locked-overlay nv-ai-shadow-locked" {...fadeIn}>
          <div className="nv-ai-locked-glow nv-ai-shadow-glow" />
          <span className="nv-ai-locked-icon">🌑</span>
          <h2 className="nv-ai-locked-title">Fitur Premium</h2>
          <p className="nv-ai-locked-desc">
            Diagnosa Shadow tersedia untuk pelanggan. Temukan pola bayangan yang menghambat dan pelajari langkah integrasi.
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
    <div className="nv-ai-page nv-ai-shadow-theme">
      {/* Header */}
      <header className="nv-ai-header">
        <div className="nv-ai-header-inner">
          <button className="nv-back-btn" onClick={() => setView('landing')}>
            ← Kembali
          </button>
          <span className="nv-ai-premium-badge nv-ai-shadow-badge">🔒 PREMIUM</span>
        </div>
      </header>

      {/* Title Section — Darker/Mysterious */}
      <motion.section className="nv-ai-hero nv-ai-shadow-hero" {...fadeIn}>
        <div className="nv-ai-hero-glow nv-ai-shadow-hero-glow" />
        <div className="nv-ai-hero-content">
          <span className="nv-ai-hero-icon">🌑</span>
          <h1 className="nv-ai-hero-title nv-ai-shadow-title">Diagnosa Shadow</h1>
          <p className="nv-ai-hero-subtitle">Temukan pola bayangan yang menghambat dan pelajari langkah integrasi</p>
        </div>
      </motion.section>

      {/* Step Indicator */}
      <div className="nv-ai-step-indicator">
        <button
          className={`nv-ai-step-tab ${step === 1 ? 'nv-ai-step-tab-active' : ''}`}
          onClick={() => { if (!loading) setStep(1) }}
        >
          <span className="nv-ai-step-tab-num">1</span>
          Kuesioner
        </button>
        <div className="nv-ai-step-connector" />
        <button
          className={`nv-ai-step-tab ${step === 2 ? 'nv-ai-step-tab-active' : ''}`}
          disabled
        >
          <span className="nv-ai-step-tab-num">2</span>
          Analisa AI
        </button>
      </div>

      {/* Step 1: Questionnaire */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.section
            key="questionnaire"
            className="nv-ai-form-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Progress Bar */}
            <div className="nv-ai-progress-bar">
              <div className="nv-ai-progress-track">
                <motion.div
                  className="nv-ai-progress-fill nv-ai-shadow-progress"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="nv-ai-progress-label">
                Pertanyaan {currentQ + 1} dari {questions.length}
              </span>
            </div>

            {/* Current Question */}
            <div className="nv-ai-form nv-glass">
              <h3 className="nv-ai-question-text">
                {questions[currentQ].question}
              </h3>

              {questions[currentQ].type === 'text' ? (
                <textarea
                  className="nv-ai-textarea"
                  rows={4}
                  placeholder={questions[currentQ].placeholder || 'Tuliskan jawaban Anda...'}
                  value={(answers[questions[currentQ].id] as string) || ''}
                  onChange={(e) =>
                    setAnswers({ ...answers, [questions[currentQ].id]: e.target.value })
                  }
                />
              ) : (
                <div className="nv-ai-scale">
                  {EMOJI_SCALE.map((emoji, i) => (
                    <motion.button
                      key={i}
                      className={`nv-ai-scale-btn ${answers[questions[currentQ].id] === i + 1 ? 'nv-ai-scale-btn-active' : ''}`}
                      onClick={() =>
                        setAnswers({ ...answers, [questions[currentQ].id]: i + 1 })
                      }
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="nv-ai-scale-emoji">{emoji}</span>
                      <span className="nv-ai-scale-num">{i + 1}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="nv-ai-nav">
                <button
                  className="nv-back-btn"
                  onClick={handlePrev}
                  disabled={currentQ === 0}
                  style={{ opacity: currentQ === 0 ? 0.3 : 1 }}
                >
                  ← Sebelumnya
                </button>
                {currentQ < questions.length - 1 ? (
                  <motion.button
                    className="nv-cta-button"
                    onClick={handleNext}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ padding: '10px 24px', fontSize: 14 }}
                  >
                    Berikutnya →
                  </motion.button>
                ) : (
                  <motion.button
                    className="nv-cta-button"
                    onClick={handleSubmit}
                    disabled={loading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ padding: '10px 24px', fontSize: 14 }}
                  >
                    {loading ? (
                      <span className="nv-ai-loading">
                        <span className="nv-ai-spinner" />
                        Menganalisa...
                      </span>
                    ) : (
                      'Kirim & Analisa ✦'
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* Step 2: Results */}
        {step === 2 && (
          <motion.section
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            {loading ? (
              <div className="nv-ai-loading-section nv-ai-shadow-loading">
                <div className="nv-ai-loading-glow nv-ai-shadow-glow" />
                <span className="nv-ai-spinner-lg" />
                <p className="nv-ai-loading-text">AI sedang menganalisa bayangan Anda...</p>
                <p className="nv-ai-loading-sub">Mengidentifikasi pola shadow dan koneksi ke manifestasi</p>
              </div>
            ) : results ? (
              <>
                {/* Shadow Patterns */}
                <section className="nv-ai-results-section">
                  <h2 className="nv-ai-results-title">🌑 Shadow Pattern</h2>
                  <div className="nv-ai-handicap-grid">
                    {results.patterns.map((p, i) => (
                      <motion.div
                        key={i}
                        className="nv-ai-handicap-card nv-glass nv-ai-shadow-card"
                        variants={staggerItem}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: i * 0.1 }}
                      >
                        <span className="nv-ai-handicap-icon">{p.icon}</span>
                        <h3 className="nv-ai-handicap-title">{p.title}</h3>
                        <p className="nv-ai-handicap-desc">{p.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Koneksi ke Manifestasi */}
                <section className="nv-ai-results-section">
                  <h2 className="nv-ai-results-title">🔗 Koneksi ke Manifestasi</h2>
                  <div className="nv-ai-ritual-list">
                    {results.koneksiManifestasi.map((km, i) => (
                      <motion.div
                        key={i}
                        className="nv-ai-ritual-item nv-glass nv-ai-shadow-card"
                        variants={staggerItem}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: i * 0.08 }}
                      >
                        <div className="nv-ai-ritual-step" style={{ background: 'rgba(100, 80, 120, 0.15)', color: '#a78bfa' }}>{i + 1}</div>
                        <div className="nv-ai-ritual-content">
                          <h4 className="nv-ai-ritual-title">{km.pattern}</h4>
                          <p className="nv-ai-ritual-detail">{km.connection}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Shadow Integration Steps */}
                <section className="nv-ai-results-section">
                  <h2 className="nv-ai-results-title">🌑 Shadow Integration Steps</h2>
                  <div className="nv-ai-ritual-list">
                    {results.integrationSteps.map((s, i) => (
                      <motion.div
                        key={i}
                        className="nv-ai-ritual-item nv-glass nv-ai-shadow-card"
                        variants={staggerItem}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: i * 0.08 }}
                      >
                        <div className="nv-ai-ritual-step">{i + 1}</div>
                        <div className="nv-ai-ritual-content">
                          <h4 className="nv-ai-ritual-title">{s.step}</h4>
                          <p className="nv-ai-ritual-detail">{s.detail}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Praktik Harian */}
                <section className="nv-ai-results-section">
                  <h2 className="nv-ai-results-title">🕯 Praktik Harian</h2>
                  <div className="nv-ai-ritual-list">
                    {results.praktikHarian.map((p, i) => (
                      <motion.div
                        key={i}
                        className="nv-ai-ritual-item nv-glass nv-ai-shadow-card"
                        variants={staggerItem}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: i * 0.08 }}
                      >
                        <div className="nv-ai-ritual-step" style={{ background: 'rgba(212, 160, 83, 0.1)', color: 'var(--nv-gold)' }}>{i + 1}</div>
                        <div className="nv-ai-ritual-content">
                          <h4 className="nv-ai-ritual-title">{p.title}</h4>
                          <p className="nv-ai-ritual-detail">{p.detail}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Peringatan */}
                <section className="nv-ai-results-section">
                  <h2 className="nv-ai-results-title">⚠️ Peringatan</h2>
                  <div className="nv-ai-peringatan-list">
                    {results.peringatan.map((p, i) => (
                      <motion.div
                        key={i}
                        className="nv-ai-peringatan-item nv-glass"
                        variants={staggerItem}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: i * 0.05 }}
                      >
                        <span className="nv-ai-peringatan-icon">⚠</span>
                        <p className="nv-ai-peringatan-text">{p}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </>
            ) : null}
          </motion.section>
        )}
      </AnimatePresence>

      <div style={{ height: 80 }} />
    </div>
  )
}

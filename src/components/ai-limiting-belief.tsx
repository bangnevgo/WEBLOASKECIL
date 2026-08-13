'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { useTranslation } from '@/lib/translations'
import { LIMITING_BELIEF_QUESTIONS, LIMITING_BELIEF_QUESTIONS_EN } from '@/lib/ai-prompts'
import { toast } from 'sonner'

const EMOJI_SCALE = ['😟', '😕', '😐', '🙂', '😄']

interface LimitingBeliefResult {
  beliefs: { title: string; description: string; icon: string }[]
  akarKetakutan: { belief: string; fear: string }[]
  reprogramming: { technique: string; detail: string }[]
  afirmasi: { belief: string; afirmasi: string }[]
  timeline: string
}

const customEase = [0.25, 0.46, 0.45, 0.94] as const

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: customEase } },
}

const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: customEase } },
}

export default function AiLimitingBelief() {
  const { setView } = useAppStore()
  const { t, language } = useTranslation()
  const hasAccess = useAppStore((s) => s.hasCurriculumAccess())
  const [step, setStep] = useState<1 | 2>(1)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | number>>({})
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<LimitingBeliefResult | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const questions = language === 'en' ? LIMITING_BELIEF_QUESTIONS_EN : LIMITING_BELIEF_QUESTIONS
  const progress = ((currentQ + 1) / questions.length) * 100

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  const handleNext = () => {
    const q = questions[currentQ]
    if (answers[q.id] === undefined || answers[q.id] === '') {
      toast(language === 'en' ? 'Please answer this question first' : 'Harap jawab pertanyaan ini terlebih dahulu')
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
      toast(language === 'en' ? 'Please answer this question first' : 'Harap jawab pertanyaan ini terlebih dahulu')
      return
    }
    setLoading(true)
    setStep(2)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'limiting-belief',
          language,
          payload: { answers, questions: questions.map(q => q.question) },
        }),
      })
      const data = await res.json()
      if (data.success && data.data) {
        setResults(data.data)
      } else {
        // Fallback mock results
        if (language === 'en') {
          setResults({
            beliefs: [
              { title: 'Self-Unworthiness', description: 'You subconsciously believe that you are not worthy of receiving goodness and success. This appears as guilt when receiving praise.', icon: '🔒' },
              { title: 'Fear of Success', description: 'Success feels dangerous because it brings higher responsibilities and expectations. You prefer the comfort zone.', icon: '🏔️' },
              { title: 'Self-Procrastination Pattern', description: 'You delay action because you believe preparation must be perfect first — which is actually a form of resistance.', icon: '⏸️' },
            ],
            akarKetakutan: [
              { belief: 'Self-Unworthiness', fear: 'Fear of rejection when showing true desires — as if asking implies you are unworthy of receiving' },
              { belief: 'Fear of Success', fear: 'Fear of losing connection with your loved ones if you change and grow' },
              { belief: 'Self-Procrastination Pattern', fear: 'Fear that your efforts will not be enough, so it is safer not to try at all' },
            ],
            reprogramming: [
              { technique: 'SATS: Acceptance Scene', detail: 'Every night before sleep, imagine someone looking at you with admiration and saying "You deserve all of this." Feel that acceptance deeply.' },
              { technique: 'Childhood Revision', detail: 'Every night, revise 3 childhood moments where you felt unworthy. Imagine a version where you felt entitled and fully accepted.' },
              { technique: 'I AM Affirmation', detail: 'Replace "I am unworthy" with "I AM worthy of receiving all goodness." Feel the shift in your body as you say it.' },
            ],
            afirmasi: [
              { belief: 'Self-Unworthiness', afirmasi: 'I AM worthy of receiving all the goodness the universe offers — this is my birthright' },
              { belief: 'Fear of Success', afirmasi: 'I AM safe in my success — growing does not mean losing those I love' },
              { belief: 'Self-Procrastination Pattern', afirmasi: 'I AM ready to act now — perfection is an illusion that hinders progress' },
            ],
            timeline: 'Transforming limiting beliefs usually takes 30-60 days of consistent practice. In the first week, you will feel subtle shifts. In the second and third weeks, old patterns will try to return — this is a sign that transformation is happening. Persist through this interval.',
          })
        } else {
          setResults({
            beliefs: [
              { title: 'Ketidaklayakan Diri', description: 'Anda secara bawah sadar percaya bahwa Anda tidak layak menerima kebaikan dan keberhasilan. Ini muncul sebagai rasa bersalah saat menerima pujian.', icon: '🔒' },
              { title: 'Ketakutan Akan Keberhasilan', description: 'Keberhasilan terasa berbahaya karena membawa tanggung jawab dan ekspektasi yang lebih tinggi. Anda lebih memilih zona nyaman.', icon: '🏔️' },
              { title: 'Pola Penundaan Diri', description: 'Anda menunda tindakan karena percaya bahwa persiapan harus sempurna terlebih dahulu — padahal ini adalah bentuk resistensi.', icon: '⏸️' },
            ],
            akarKetakutan: [
              { belief: 'Ketidaklayakan Diri', fear: 'Takut ditolak jika menunjukkan keinginan sebenarnya — seolah-olah meminta berarti tidak layak menerima' },
              { belief: 'Ketakutan Akan Keberhasilan', fear: 'Takut kehilangan koneksi dengan orang-orang yang Anda cintai jika Anda berubah dan bertumbuh' },
              { belief: 'Pola Penundaan Diri', fear: 'Takut bahwa upaya Anda tidak akan cukup, jadi lebih aman tidak mencoba sama sekali' },
            ],
            reprogramming: [
              { technique: 'SATS: Adegan Penerimaan', detail: 'Setiap malam sebelum tidur, bayangkan seseorang menatap Anda dengan kekaguman dan berkata "Kamu layak mendapatkan semua ini." Rasakan penerimaan itu secara mendalam.' },
              { technique: 'Revisi Masa Kecl', detail: 'Setiap malam, revisi 3 momen masa kecil di mana Anda merasa tidak layak. Bayangkan versi di mana Anda merasa berhak dan diterima sepenuhnya.' },
              { technique: 'Afirmasi I AM', detail: 'Gantikan "Saya tidak layak" dengan "I AM layak menerima semua kebaikan." Rasakan pergeseran di tubuh Anda saat mengucapkannya.' },
            ],
            afirmasi: [
              { belief: 'Ketidaklayakan Diri', afirmasi: 'I AM layak menerima semua kebaikan yang alam semesta tawarkan — ini adalah hak kelahiran saya' },
              { belief: 'Ketakutan Akan Keberhasilan', afirmasi: 'I AM aman dalam keberhasilan saya — bertumbuh tidak berarti kehilangan orang yang saya cintai' },
              { belief: 'Pola Penundaan Diri', afirmasi: 'I AM siap bertindak sekarang — kesempurnaan adalah ilusi yang menghalangi kemajuan' },
            ],
            timeline: 'Transformasi limiting belief biasanya membutuhkan 30-60 hari praktik konsisten. Minggu pertama Anda akan merasa pergeseran halus. Minggu kedua dan ketiga, pola lama akan mencoba kembali — ini tanda transformasi sedang terjadi. Bertahanlah melalui interval ini.',
          })
        }
      }
    } catch {
      toast(language === 'en' ? 'An error occurred. Please try again.' : 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    toast(language === 'en' ? 'Affirmation copied!' : 'Afirmasi disalin!')
    setTimeout(() => setCopiedIdx(null), 2000)
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
          <span className="nv-ai-locked-icon">🔒</span>
          <h2 className="nv-ai-locked-title">{language === 'en' ? 'Premium Feature' : 'Fitur Premium'}</h2>
          <p className="nv-ai-locked-desc">
            {language === 'en'
              ? 'Limiting Belief Diagnosis is available for subscribers. Identify hidden beliefs blocking your manifestation.'
              : 'Diagnosa Limiting Belief tersedia untuk pelanggan. Identifikasi keyakinan tersembunyi yang menghalangi manifestasi Anda.'
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
          <span className="nv-ai-hero-icon">🔍</span>
          <h1 className="nv-ai-hero-title">
            {language === 'en' ? 'Limiting Belief Diagnosis' : 'Diagnosa Limiting Belief'}
          </h1>
          <p className="nv-ai-hero-subtitle">
            {language === 'en'
              ? 'Identify hidden beliefs blocking your manifestation'
              : 'Identifikasi keyakinan tersembunyi yang menghalangi manifestasi Anda'
            }
          </p>
        </div>
      </motion.section>

      {/* Step Indicator */}
      <div className="nv-ai-step-indicator">
        <button
          className={`nv-ai-step-tab ${step === 1 ? 'nv-ai-step-tab-active' : ''}`}
          onClick={() => { if (!loading) setStep(1) }}
        >
          <span className="nv-ai-step-tab-num">1</span>
          {language === 'en' ? 'Questionnaire' : 'Kuesioner'}
        </button>
        <div className="nv-ai-step-connector" />
        <button
          className={`nv-ai-step-tab ${step === 2 ? 'nv-ai-step-tab-active' : ''}`}
          disabled
        >
          <span className="nv-ai-step-tab-num">2</span>
          {language === 'en' ? 'AI Analysis' : 'Analisa AI'}
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
                  className="nv-ai-progress-fill"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="nv-ai-progress-label">
                {language === 'en'
                  ? `Question ${currentQ + 1} of ${questions.length}`
                  : `Pertanyaan {currentQ + 1} dari {questions.length}`
                      .replace('{currentQ + 1}', String(currentQ + 1))
                      .replace('{questions.length}', String(questions.length))
                }
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
                  placeholder={questions[currentQ].placeholder || (language === 'en' ? 'Write your answer here...' : 'Tuliskan jawaban Anda...')}
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
                  {language === 'en' ? '← Previous' : '← Sebelumnya'}
                </button>
                {currentQ < questions.length - 1 ? (
                  <motion.button
                    className="nv-cta-button"
                    onClick={handleNext}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ padding: '10px 24px', fontSize: 14 }}
                  >
                    {language === 'en' ? 'Next →' : 'Berikutnya →'}
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
                        {language === 'en' ? 'Analyzing...' : 'Menganalisa...'}
                      </span>
                    ) : (
                      language === 'en' ? 'Submit & Analyze ✦' : 'Kirim & Analisa ✦'
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
              <div className="nv-ai-loading-section">
                <div className="nv-ai-loading-glow" />
                <span className="nv-ai-spinner-lg" />
                <p className="nv-ai-loading-text">
                  {language === 'en' ? 'AI is analyzing your answers...' : 'AI sedang menganalisa jawaban Anda...'}
                </p>
                <p className="nv-ai-loading-sub">
                  {language === 'en'
                    ? 'Identifying limiting belief patterns based on Neville Goddard’s teachings'
                    : 'Mengidentifikasi pola limiting belief berdasarkan ajaran Neville Goddard'
                  }
                </p>
              </div>
            ) : results ? (
              <>
                {/* Limiting Beliefs */}
                <section className="nv-ai-results-section">
                  <h2 className="nv-ai-results-title">
                    {language === 'en' ? '🔒 3 Key Limiting Beliefs' : '🔒 3 Limiting Belief Utama'}
                  </h2>
                  <div className="nv-ai-handicap-grid">
                    {results.beliefs.map((b, i) => (
                      <motion.div
                        key={i}
                        className="nv-ai-handicap-card nv-glass"
                        variants={staggerItem}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: i * 0.1 }}
                      >
                        <span className="nv-ai-handicap-icon">{b.icon}</span>
                        <h3 className="nv-ai-handicap-title">{b.title}</h3>
                        <p className="nv-ai-handicap-desc">{b.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Akar Ketakutan */}
                <section className="nv-ai-results-section">
                  <h2 className="nv-ai-results-title">
                    {language === 'en' ? '🌑 Root Fears' : '🌑 Akar Ketakutan'}
                  </h2>
                  <div className="nv-ai-ritual-list">
                    {results.akarKetakutan.map((ak, i) => (
                      <motion.div
                        key={i}
                        className="nv-ai-ritual-item nv-glass"
                        variants={staggerItem}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: i * 0.08 }}
                      >
                        <div className="nv-ai-ritual-step" style={{ background: 'rgba(212, 160, 83, 0.1)', color: 'var(--nv-gold)' }}>{i + 1}</div>
                        <div className="nv-ai-ritual-content">
                          <h4 className="nv-ai-ritual-title">{ak.belief}</h4>
                          <p className="nv-ai-ritual-detail">{ak.fear}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Teknik Reprogramming */}
                <section className="nv-ai-results-section">
                  <h2 className="nv-ai-results-title">
                    {language === 'en' ? '🧠 Reprogramming Techniques' : '🧠 Teknik Reprogramming'}
                  </h2>
                  <div className="nv-ai-ritual-list">
                    {results.reprogramming.map((r, i) => (
                      <motion.div
                        key={i}
                        className="nv-ai-ritual-item nv-glass"
                        variants={staggerItem}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: i * 0.08 }}
                      >
                        <div className="nv-ai-ritual-step">{i + 1}</div>
                        <div className="nv-ai-ritual-content">
                          <h4 className="nv-ai-ritual-title">{r.technique}</h4>
                          <p className="nv-ai-ritual-detail">{r.detail}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Afirmasi Spesifik */}
                <section className="nv-ai-results-section">
                  <h2 className="nv-ai-results-title">
                    {language === 'en' ? '✦ Specific Affirmations' : '✦ Afirmasi Spesifik'}
                  </h2>
                  <div className="nv-ai-afirmasi-list">
                    {results.afirmasi.map((af, i) => (
                      <motion.div
                        key={i}
                        className="nv-ai-afirmasi-item nv-glass"
                        variants={staggerItem}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: i * 0.06 }}
                      >
                        <span className="nv-ai-afirmasi-num">{i + 1}</span>
                        <div className="nv-ai-afirmasi-content">
                          <span className="nv-ai-afirmasi-label">{af.belief}</span>
                          <p className="nv-ai-afirmasi-text">&ldquo;{af.afirmasi}&rdquo;</p>
                        </div>
                        <button
                          className="nv-ai-copy-btn"
                          onClick={() => handleCopy(af.afirmasi, i)}
                          title={language === 'en' ? 'Copy affirmation' : 'Salin afirmasi'}
                        >
                          {copiedIdx === i ? '✓' : '📋'}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Timeline */}
                <section className="nv-ai-results-section">
                  <h2 className="nv-ai-results-title">
                    {language === 'en' ? '📅 Estimated Timeline' : '📅 Timeline Estimasi'}
                  </h2>
                  <div className="nv-ai-durasi-box nv-glass" style={{ flexDirection: 'column', gap: 0 }}>
                    <p className="nv-ai-timeline-text">{results.timeline}</p>
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

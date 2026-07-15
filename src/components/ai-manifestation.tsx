'use client'
 
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { useTranslation } from '@/lib/translations'
import { toast } from 'sonner'
 
const CATEGORIES = [
  { id: 'kesehatan', label: 'Kesehatan', icon: '💚' },
  { id: 'karir', label: 'Karir & Keuangan', icon: '💰' },
  { id: 'hubungan', label: 'Hubungan', icon: '❤️' },
  { id: 'spiritual', label: 'Spiritual', icon: '🙏' },
  { id: 'kreativitas', label: 'Kreativitas', icon: '🎨' },
  { id: 'lainnya', label: 'Lainnya', icon: '✨' },
]
 
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}
 
const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
}
 
interface ManifestationResult {
  handicaps: { icon: string; title: string; description: string }[]
  afirmasi: string[]
  durasi: { durasi: string; frekuensi: string }
  ritual: { step: string; detail: string }[]
}
 
export default function AiManifestation() {
  const { t, language } = useTranslation()
  const { setView } = useAppStore()
  const [manifestation, setManifestation] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ManifestationResult | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
 
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])
 
  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [results])
 
  const activeCategories = (() => {
    if (language === 'en') {
      return [
        { id: 'kesehatan', label: 'Health', icon: '💚' },
        { id: 'karir', label: 'Career & Finance', icon: '💰' },
        { id: 'hubungan', label: 'Relationships', icon: '❤️' },
        { id: 'spiritual', label: 'Spiritual', icon: '🙏' },
        { id: 'kreativitas', label: 'Creativity', icon: '🎨' },
        { id: 'lainnya', label: 'Other', icon: '✨' },
      ]
    }
    return CATEGORIES
  })()
 
  const handleSubmit = async () => {
    if (!manifestation.trim() || !category) {
      toast(language === 'en' ? 'Please enter a manifestation and select a category' : 'Harap isi manifestasi dan pilih kategori')
      return
    }
    setLoading(true)
    setResults(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'manifestation',
          language,
          payload: { manifestation, category },
        }),
      })
      const data = await res.json()
      if (data.success && data.data) {
        setResults(data.data)
      } else {
        // Fallback mock results
        if (language === 'en') {
          setResults({
            handicaps: [
              { icon: '🚧', title: 'Hidden Negative Assumption', description: 'You still hold the assumption that success must be hard-fought — this contradicts Neville’s assumption principle.' },
              { icon: '🌫️', title: 'Inconsistent Feelings', description: 'Your feelings shift between belief and doubt, sending mixed signals to the subconscious mind.' },
              { icon: '⏳', title: 'Attachment to Time', description: 'You focus too much on "when" the manifestation happens, confirming its absence in the present.' },
            ],
            afirmasi: [
              'I am already the version of myself who has manifested this desire',
              'My current feelings are proof that my desire is already realized',
              'I release the need to control how the manifestation happens',
              'Every moment I live from the end, not towards the end',
              'The outer world must follow my assumption — this is the law',
            ],
            durasi: { durasi: '21-30 days', frekuensi: '2x a day (morning & night)' },
            ritual: [
              { step: 'Morning: Affirmation & Visualization', detail: 'Upon waking, before opening your eyes, feel the feeling of your wish fulfilled for 5 minutes. Repeat your chosen affirmation 3 times with feeling.' },
              { step: 'Afternoon: Assumption Check', detail: 'Three times a day, pause and ask: "What assumption am I holding right now?" If negative, shift it immediately.' },
              { step: 'Night: SATS', detail: 'Before sleep, enter a relaxed state. Construct a 3-5 second scene implying your wish is already fulfilled. Loop until you fall asleep.' },
              { step: 'Night Revision', detail: 'Review your day. Any event that did not match your desire, revise it in your imagination. Imagine the version you want.' },
            ],
          })
        } else {
          setResults({
            handicaps: [
              { icon: '🚧', title: 'Asumsi Negatif Tersembunyi', description: 'Anda masih memegang asumsi bahwa keberhasilan harus diperjuangkan dengan keras — ini bertentangan dengan prinsip asumsi Neville.' },
              { icon: '🌫️', title: 'Ketidakkonsistenan Perasaan', description: 'Perasaan Anda bergeser antara keyakinan dan keraguan, mengirim sinyal campuran ke pikiran bawah sadar.' },
              { icon: '⏳', title: 'Keterikatan pada Waktu', description: 'Anda terlalu fokus pada "kapan" manifestasi terjadi, yang menegaskan ketidakhadirannya di masa kini.' },
            ],
            afirmasi: [
              'Saya sudah menjadi versi diri yang telah memanifestasikan keinginan ini',
              'Perasaan saya saat ini adalah bukti bahwa keinginan saya sudah terwujud',
              'Saya melepaskan kebutuhan untuk mengontrol bagaimana manifestasi terjadi',
              'Setiap saat saya hidup dari akhir, bukan menuju akhir',
              'Dunia luar harus mengikuti asumsi saya — ini adalah hukum',
            ],
            durasi: { durasi: '21-30 hari', frekuensi: '2x sehari (pagi & malam)' },
            ritual: [
              { step: 'Pagi: Afirmasi & Visualisasi', detail: 'Saat bangun, sebelum membuka mata, rasakan perasaan keinginan yang telah terwujud selama 5 menit. Ulangi afirmasi pilihan Anda 3 kali dengan perasaan.' },
              { step: 'Siang: Cek Asumsi', detail: 'Tiga kali sehari, hentikan sejenak dan tanyakan: "Asumsi apa yang sedang saya pegang sekarang?" Jika negatif, segera alihkan.' },
              { step: 'Malam: SATS', detail: 'Sebelum tidur, masuk kondisi rileks. Konstruksi adegan 3-5 detik yang mengimplikasikan keinginan sudah terwujud. Putar berulang sampai tertidur.' },
              { step: 'Revisi Malam', detail: 'Tinjau hari ini. Setiap kejadian yang tidak sesuai keinginan, revisilah di imajinasi Anda. Bayangkan versi yang Anda inginkan.' },
            ],
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
 
  return (
    <div className="nv-ai-page">
      {/* Header */}
      <header className="nv-ai-header">
        <div className="nv-ai-header-inner">
          <button className="nv-back-btn" onClick={() => setView('landing')}>
            {language === 'en' ? '← Back' : '← Kembali'}
          </button>
          <span className="nv-ai-free-badge">{t('freeBadge')}</span>
        </div>
      </header>
 
      {/* Title Section */}
      <motion.section className="nv-ai-hero" {...fadeIn}>
        <div className="nv-ai-hero-glow" />
        <div className="nv-ai-hero-content">
          <span className="nv-ai-hero-icon">✦</span>
          <h1 className="nv-ai-hero-title">{language === 'en' ? 'Manifestation Analysis' : 'Analisa Manifestasi'}</h1>
          <p className="nv-ai-hero-subtitle">{language === 'en' ? 'Find your biggest handicap and get a personalized guide' : 'Temukan handicap terbesar dan dapatkan panduan personal'}</p>
        </div>
      </motion.section>
 
      {/* Form Section */}
      <motion.section className="nv-ai-form-section" {...fadeIn} transition={{ delay: 0.1 }}>
        <div className="nv-ai-form nv-glass">
          <label className="nv-ai-label">{language === 'en' ? 'What do you want to manifest?' : 'Apa yang ingin Anda manifestasikan?'}</label>
          <textarea
            className="nv-ai-textarea"
            rows={4}
            placeholder={language === 'en' ? 'Example: I want to have a successful business that provides financial freedom...' : 'Contoh: Saya ingin memiliki bisnis yang sukses dan memberikan kebebasan finansial...'}
            value={manifestation}
            onChange={(e) => setManifestation(e.target.value)}
          />
 
          <label className="nv-ai-label" style={{ marginTop: 20 }}>{language === 'en' ? 'Choose Category' : 'Pilih Kategori'}</label>
          <div className="nv-ai-chips">
            {activeCategories.map((cat) => (
              <motion.button
                key={cat.id}
                className={`nv-ai-chip ${category === cat.id ? 'nv-ai-chip-active' : ''}`}
                onClick={() => setCategory(cat.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="nv-ai-chip-icon">{cat.icon}</span>
                {cat.label}
              </motion.button>
            ))}
          </div>
 
          <motion.button
            className="nv-cta-button nv-ai-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.03, y: loading ? 0 : -2 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
          >
            {loading ? (
              <span className="nv-ai-loading">
                <span className="nv-ai-spinner" />
                {language === 'en' ? 'Analyzing...' : 'Menganalisa...'}
              </span>
            ) : (
              <>{language === 'en' ? 'Analyze Now ✦' : 'Analisa Sekarang ✦'}</>
            )}
          </motion.button>
        </div>
      </motion.section>
 
      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Handicap Cards */}
            <section className="nv-ai-results-section">
              <h2 className="nv-ai-results-title">{language === 'en' ? '🚧 3 Biggest Handicaps' : '🚧 3 Handicap Terbesar'}</h2>
              <div className="nv-ai-handicap-grid">
                {results.handicaps.map((h, i) => (
                  <motion.div
                    key={i}
                    className="nv-ai-handicap-card nv-glass"
                    variants={staggerItem}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="nv-ai-handicap-icon">{h.icon}</span>
                    <h3 className="nv-ai-handicap-title">{h.title}</h3>
                    <p className="nv-ai-handicap-desc">{h.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>
 
            {/* Afirmasi List */}
            <section className="nv-ai-results-section">
              <h2 className="nv-ai-results-title">{language === 'en' ? '✦ 5 Empowering Affirmations' : '✦ 5 Afirmasi Penguatan'}</h2>
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
                    <p className="nv-ai-afirmasi-text">&ldquo;{af}&rdquo;</p>
                    <button
                      className="nv-ai-copy-btn"
                      onClick={() => handleCopy(af, i)}
                      title="Salin afirmasi"
                    >
                      {copiedIdx === i ? '✓' : '📋'}
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
 
            {/* Durasi & Frekuensi */}
            <section className="nv-ai-results-section">
              <h2 className="nv-ai-results-title">{language === 'en' ? '⏱ Duration & Frequency' : '⏱ Durasi & Frekuensi'}</h2>
              <div className="nv-ai-durasi-box nv-glass">
                <div className="nv-ai-durasi-item">
                  <span className="nv-ai-durasi-label">{language === 'en' ? 'Practice Duration' : 'Durasi Praktik'}</span>
                  <span className="nv-ai-durasi-value">{results.durasi.durasi}</span>
                </div>
                <div className="nv-ai-durasi-divider" />
                <div className="nv-ai-durasi-item">
                  <span className="nv-ai-durasi-label">{language === 'en' ? 'Frequency' : 'Frekuensi'}</span>
                  <span className="nv-ai-durasi-value">{results.durasi.frekuensi}</span>
                </div>
              </div>
            </section>
 
            {/* Ritual Harian */}
            <section className="nv-ai-results-section">
              <h2 className="nv-ai-results-title">{language === 'en' ? '🕯 Daily Ritual' : '🕯 Ritual Harian'}</h2>
              <div className="nv-ai-ritual-list">
                {results.ritual.map((r, i) => (
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
                      <h4 className="nv-ai-ritual-title">{r.step}</h4>
                      <p className="nv-ai-ritual-detail">{r.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
 
            {/* CTA to Premium */}
            <motion.div className="nv-ai-premium-cta nv-glass" {...fadeIn}>
              <div className="nv-ai-premium-cta-glow" />
              <h3 className="nv-ai-premium-cta-title">{language === 'en' ? 'Want a deeper analysis?' : 'Mau analisa lebih dalam?'}</h3>
              <p className="nv-ai-premium-cta-desc">
                {language === 'en'
                  ? 'Unlock the Limiting Belief Diagnosis and Shadow Diagnosis to discover the root fears and shadow patterns blocking your manifestation.'
                  : 'Buka Diagnosa Limiting Belief dan Diagnosa Shadow untuk menemukan akar ketakutan dan pola bayangan yang menghalangi manifestasi Anda.'
                }
              </p>
              <motion.button
                className="nv-cta-button"
                onClick={() => window.open('https://cohort.nevgoinstitute.com', '_blank', 'noopener')}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="nv-cta-icon">✦</span>
                {language === 'en' ? 'Join the Cohort Program →' : 'Ikut Program Cohort →'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Footer spacing */}
      <div style={{ height: 80 }} />
    </div>
  )
}

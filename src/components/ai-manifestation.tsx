'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { MANIFESTATION_PROMPT } from '@/lib/ai-prompts'
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

  const handleSubmit = async () => {
    if (!manifestation.trim() || !category) {
      toast('Harap isi manifestasi dan pilih kategori')
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
          payload: { manifestation, category },
        }),
      })
      const data = await res.json()
      if (data.results) {
        setResults(data.results)
      } else {
        // Fallback mock results
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
    } catch {
      toast('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    toast('Afirmasi disalin!')
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div className="nv-ai-page">
      {/* Header */}
      <header className="nv-ai-header">
        <div className="nv-ai-header-inner">
          <button className="nv-back-btn" onClick={() => setView('landing')}>
            ← Kembali
          </button>
          <span className="nv-ai-free-badge">GRATIS ✦</span>
        </div>
      </header>

      {/* Title Section */}
      <motion.section className="nv-ai-hero" {...fadeIn}>
        <div className="nv-ai-hero-glow" />
        <div className="nv-ai-hero-content">
          <span className="nv-ai-hero-icon">✦</span>
          <h1 className="nv-ai-hero-title">Analisa Manifestasi</h1>
          <p className="nv-ai-hero-subtitle">Temukan handicap terbesar dan dapatkan panduan personal</p>
        </div>
      </motion.section>

      {/* Form Section */}
      <motion.section className="nv-ai-form-section" {...fadeIn} transition={{ delay: 0.1 }}>
        <div className="nv-ai-form nv-glass">
          <label className="nv-ai-label">Apa yang ingin Anda manifestasikan?</label>
          <textarea
            className="nv-ai-textarea"
            rows={4}
            placeholder="Contoh: Saya ingin memiliki bisnis yang sukses dan memberikan kebebasan finansial..."
            value={manifestation}
            onChange={(e) => setManifestation(e.target.value)}
          />

          <label className="nv-ai-label" style={{ marginTop: 20 }}>Pilih Kategori</label>
          <div className="nv-ai-chips">
            {CATEGORIES.map((cat) => (
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
                Menganalisa...
              </span>
            ) : (
              <>Analisa Sekarang ✦</>
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
              <h2 className="nv-ai-results-title">🚧 3 Handicap Terbesar</h2>
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
              <h2 className="nv-ai-results-title">✦ 5 Afirmasi Penguatan</h2>
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
              <h2 className="nv-ai-results-title">⏱ Durasi & Frekuensi</h2>
              <div className="nv-ai-durasi-box nv-glass">
                <div className="nv-ai-durasi-item">
                  <span className="nv-ai-durasi-label">Durasi Praktik</span>
                  <span className="nv-ai-durasi-value">{results.durasi.durasi}</span>
                </div>
                <div className="nv-ai-durasi-divider" />
                <div className="nv-ai-durasi-item">
                  <span className="nv-ai-durasi-label">Frekuensi</span>
                  <span className="nv-ai-durasi-value">{results.durasi.frekuensi}</span>
                </div>
              </div>
            </section>

            {/* Ritual Harian */}
            <section className="nv-ai-results-section">
              <h2 className="nv-ai-results-title">🕯 Ritual Harian</h2>
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
              <h3 className="nv-ai-premium-cta-title">Mau analisa lebih dalam?</h3>
              <p className="nv-ai-premium-cta-desc">
                Buka Diagnosa Limiting Belief dan Diagnosa Shadow untuk menemukan akar ketakutan dan pola bayangan yang menghalangi manifestasi Anda.
              </p>
              <motion.button
                className="nv-cta-button"
                onClick={() => useAppStore.getState().setView('pricing')}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="nv-cta-icon">✦</span>
                Buka Fitur Premium →
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

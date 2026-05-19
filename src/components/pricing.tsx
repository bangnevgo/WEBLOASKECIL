'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Check, Sparkles, Crown, BookOpen, X, Key, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

const LYNK_ID_URL = 'https://lynk.id/bangnevgo'

interface PricingTier {
  name: string
  nameEn: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  featured: boolean
  icon: React.ReactNode
  tierKey: string // key for activation code lookup
}

const TIERS: PricingTier[] = [
  {
    name: 'Penggemar',
    nameEn: 'Enthusiast',
    price: 'Gratis',
    period: '',
    description: 'Jelajahi dasar-dasar ajaran Neville',
    features: [
      '3 pelajaran pertama gratis',
      'Ringkasan ajaran',
      'Kutipan pilihan',
    ],
    cta: 'Jelajahi Gratis',
    featured: false,
    icon: <BookOpen className="nv-pricing-icon-svg" />,
    tierKey: 'free',
  },
  {
    name: 'Pelajar',
    nameEn: 'Scholar',
    price: 'Rp 99K',
    period: '/bulan',
    description: 'Akses kurikulum lengkap',
    features: [
      'Semua 49 pelajaran',
      'Konten lengkap & kutipan bersumber',
      'Praktik harian',
      'Poin-poin penting',
      'Pembaruan materi baru',
    ],
    cta: 'Berlangganan',
    featured: true,
    icon: <Sparkles className="nv-pricing-icon-svg" />,
    tierKey: 'pelajar',
  },
  {
    name: 'Master',
    nameEn: 'Master',
    price: 'Rp 299K',
    period: '/bulan',
    description: 'Perjalanan transformasi mendalam',
    features: [
      'Semua fitur Pelajar',
      'Sesi panduan audio (segera hadir)',
      'Jurnal praktik harian',
      'Akses komunitas privat (segera hadir)',
      'Mendukung pengembangan konten',
    ],
    cta: 'Berlangganan',
    featured: false,
    icon: <Crown className="nv-pricing-icon-svg" />,
    tierKey: 'master',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

export default function Pricing() {
  const { setView, subscribe, openFreeLesson, setAdmin } = useAppStore()
  const [showActivationModal, setShowActivationModal] = useState(false)
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null)
  const [activationCode, setActivationCode] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [isActivating, setIsActivating] = useState(false)
  const [activationError, setActivationError] = useState('')

  const handleSubscribe = (tier: PricingTier) => {
    // Free tier: go directly to free lesson 1.1
    if (tier.name === 'Penggemar') {
      openFreeLesson('1.1')
      toast('✦ Mulai jelajahi pelajaran gratis!')
      return
    }
    // Paid tier: open Lynk.id in new tab, then show activation modal
    window.open(LYNK_ID_URL, '_blank', 'noopener')
    setSelectedTier(tier)
    setActivationCode('')
    setNameInput('')
    setActivationError('')
    setShowActivationModal(true)
  }

  const handleActivate = async () => {
    if (!activationCode.trim()) {
      setActivationError('Masukkan kode aktivasi Anda')
      return
    }

    setIsActivating(true)
    setActivationError('')

    try {
      const res = await fetch('/api/activation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: activationCode.trim(),
          userName: nameInput.trim() || 'Pengguna',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setActivationError(data.error || 'Kode tidak valid')
        return
      }

      // Check admin bypass — if name is "neville" in Master tier
      if (selectedTier?.name === 'Master' && nameInput.trim().toLowerCase() === 'neville') {
        setAdmin(true)
      }

      const name = nameInput.trim() || 'Pengguna'
      subscribe(name)
      toast(`✦ Selamat datang, ${name}! Akses penuh telah aktif.`)
      setShowActivationModal(false)
    } catch {
      setActivationError('Terjadi kesalahan jaringan. Silakan coba lagi.')
    } finally {
      setIsActivating(false)
    }
  }

  return (
    <div className="nv-pricing-page">
      {/* Background decorative elements */}
      <div className="nv-pricing-bg-orb nv-pricing-bg-orb-1" />
      <div className="nv-pricing-bg-orb nv-pricing-bg-orb-2" />

      {/* Header */}
      <motion.header
        className="nv-pricing-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          className="nv-back-btn"
          onClick={() => setView('landing')}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Kembali ke Beranda
        </motion.button>
        <div className="nv-pricing-header-text">
          <h1 className="nv-pricing-title">Pilih Paket Berlangganan</h1>
          <p className="nv-pricing-subtitle">
            Buka potensi penuh ajaran Neville Goddard melalui kurikulum terstruktur
          </p>
        </div>
      </motion.header>

      {/* Pricing Grid */}
      <div className="nv-pricing-grid">
        {TIERS.map((tier, i) => (
          <motion.div
            key={tier.name}
            className={`nv-pricing-card ${tier.featured ? 'nv-pricing-card-featured' : ''}`}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
          >
            {/* Featured badge */}
            {tier.featured && (
              <div className="nv-pricing-badge">POPULER</div>
            )}

            {/* Card content */}
            <div className="nv-pricing-card-inner">
              {/* Icon */}
              <div className={`nv-pricing-icon ${tier.featured ? 'nv-pricing-icon-featured' : ''}`}>
                {tier.icon}
              </div>

              {/* Tier name */}
              <div className="nv-pricing-card-name">{tier.name}</div>
              <div className="nv-pricing-card-name-en">{tier.nameEn}</div>

              {/* Price */}
              <div className="nv-pricing-price-row">
                <span className="nv-pricing-card-price">{tier.price}</span>
                {tier.period && (
                  <span className="nv-pricing-card-period">{tier.period}</span>
                )}
              </div>

              {/* Description */}
              <p className="nv-pricing-card-desc">{tier.description}</p>

              {/* Divider */}
              <div className="nv-pricing-divider" />

              {/* Features */}
              <ul className="nv-pricing-card-features">
                {tier.features.map((feature, fi) => (
                  <motion.li
                    key={fi}
                    className="nv-pricing-feature-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + fi * 0.08, duration: 0.3 }}
                  >
                    <Check className="nv-pricing-check-icon" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.button
                className={`nv-cta-button nv-pricing-cta ${tier.featured ? 'nv-pricing-cta-featured' : ''}`}
                onClick={() => handleSubscribe(tier)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {tier.name === 'Penggemar' ? (
                  tier.cta
                ) : (
                  <>
                    <span className="nv-cta-icon">✦</span>
                    {tier.cta} via Lynk.id
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* How it works section */}
      <motion.div
        className="nv-activation-how nv-glass"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h3 className="nv-activation-how-title">Cara Berlangganan</h3>
        <div className="nv-activation-steps">
          <div className="nv-activation-step">
            <div className="nv-activation-step-num">1</div>
            <div>
              <div className="nv-activation-step-label">Pilih Paket</div>
              <div className="nv-activation-step-desc">Klik &quot;Berlangganan&quot; pada paket yang diinginkan</div>
            </div>
          </div>
          <div className="nv-activation-step-connector" />
          <div className="nv-activation-step">
            <div className="nv-activation-step-num">2</div>
            <div>
              <div className="nv-activation-step-label">Bayar di Lynk.id</div>
              <div className="nv-activation-step-desc">Anda akan diarahkan ke halaman pembayaran</div>
            </div>
          </div>
          <div className="nv-activation-step-connector" />
          <div className="nv-activation-step">
            <div className="nv-activation-step-num">3</div>
            <div>
              <div className="nv-activation-step-label">Masukkan Kode Aktivasi</div>
              <div className="nv-activation-step-desc">Setelah bayar, masukkan kode yang Anda terima</div>
            </div>
          </div>
          <div className="nv-activation-step-connector" />
          <div className="nv-activation-step">
            <div className="nv-activation-step-num">✦</div>
            <div>
              <div className="nv-activation-step-label">Akses Penuh Aktif!</div>
              <div className="nv-activation-step-desc">Selamat menikmati seluruh kurikulum</div>
            </div>
          </div>
        </div>

        {/* Already have a code? */}
        <div className="nv-activation-have-code">
          <span>Sudah punya kode aktivasi?</span>
          <button
            className="nv-activation-enter-code-btn"
            onClick={() => {
              setSelectedTier(null)
              setActivationCode('')
              setNameInput('')
              setActivationError('')
              setShowActivationModal(true)
            }}
          >
            <Key style={{ width: 14, height: 14 }} />
            Masukkan Kode di Sini
          </button>
        </div>
      </motion.div>

      {/* Footer note */}
      <motion.p
        className="nv-pricing-footer-note"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Pembayaran melalui Lynk.id · Kode aktivasi otomatis · Akses langsung aktif
      </motion.p>

      {/* Activation Code Modal */}
      <AnimatePresence>
        {showActivationModal && (
          <motion.div
            className="nv-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowActivationModal(false)}
          >
            <motion.div
              className="nv-modal-content nv-activation-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="nv-modal-close"
                onClick={() => setShowActivationModal(false)}
                aria-label="Close"
              >
                <X style={{ width: 18, height: 18 }} />
              </button>

              <div className="nv-modal-icon nv-activation-modal-icon">
                <Key style={{ width: 22, height: 22 }} />
              </div>

              <h3 className="nv-modal-title">
                {selectedTier ? `Aktivasi Paket ${selectedTier.name}` : 'Masukkan Kode Aktivasi'}
              </h3>
              <p className="nv-modal-desc">
                Masukkan kode aktivasi yang Anda terima setelah pembayaran di Lynk.id
              </p>

              {/* Activation code input */}
              <div className="nv-modal-input-group">
                <label className="nv-modal-label" htmlFor="activation-code">
                  KODE AKTIVASI
                </label>
                <input
                  id="activation-code"
                  type="text"
                  className="nv-modal-input nv-activation-code-input"
                  placeholder="NVG-PEL-XXXX-XXXX"
                  value={activationCode}
                  onChange={(e) => {
                    setActivationCode(e.target.value.toUpperCase())
                    setActivationError('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleActivate()
                  }}
                  autoFocus
                />
              </div>

              {/* Name input */}
              <div className="nv-modal-input-group">
                <label className="nv-modal-label" htmlFor="name-input">
                  NAMA ANDA
                </label>
                <input
                  id="name-input"
                  type="text"
                  className="nv-modal-input"
                  placeholder="Nama panggilan Anda"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleActivate()
                  }}
                />
              </div>

              {/* Error message */}
              {activationError && (
                <motion.div
                  className="nv-activation-error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {activationError}
                </motion.div>
              )}

              <div className="nv-modal-actions">
                <motion.button
                  className="nv-cta-button nv-pricing-cta nv-pricing-cta-featured"
                  onClick={handleActivate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isActivating}
                  style={{ opacity: isActivating ? 0.7 : 1 }}
                >
                  {isActivating ? 'Memverifikasi...' : '✦ Aktivasi Sekarang'}
                </motion.button>

                {/* Lynk.id link */}
                <a
                  href={LYNK_ID_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nv-activation-lynk-link"
                >
                  <ExternalLink style={{ width: 14, height: 14 }} />
                  Belum punya kode? Bayar di Lynk.id
                </a>

                <button
                  className="nv-modal-cancel"
                  onClick={() => setShowActivationModal(false)}
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

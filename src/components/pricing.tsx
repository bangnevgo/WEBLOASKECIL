'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Check, Sparkles, Crown, BookOpen, X } from 'lucide-react'
import { toast } from 'sonner'

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
  },
  {
    name: 'Pelajar',
    nameEn: 'Scholar',
    price: '$9',
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
  },
  {
    name: 'Master',
    nameEn: 'Master',
    price: '$27',
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
  const { setView, subscribe, openFreeLesson } = useAppStore()
  const [showNameModal, setShowNameModal] = useState(false)
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null)
  const [nameInput, setNameInput] = useState('')

  const handleSubscribe = (tier: PricingTier) => {
    // Free tier: go directly to free lesson 1.1
    if (tier.name === 'Penggemar') {
      openFreeLesson('1.1')
      toast('✦ Mulai jelajahi pelajaran gratis!')
      return
    }
    setSelectedTier(tier)
    setNameInput('')
    setShowNameModal(true)
  }

  const confirmSubscribe = () => {
    const name = nameInput.trim() || 'Pengguna'
    subscribe(name)
    toast(`✦ Selamat datang, ${name}! Langganan aktif.`)
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
                {tier.cta}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <motion.p
        className="nv-pricing-footer-note"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Semua harga dalam USD. Batalkan kapan saja.
      </motion.p>

      {/* Name Input Modal */}
      <AnimatePresence>
        {showNameModal && selectedTier && (
          <motion.div
            className="nv-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowNameModal(false)}
          >
            <motion.div
              className="nv-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="nv-modal-close"
                onClick={() => setShowNameModal(false)}
                aria-label="Close"
              >
                <X style={{ width: 18, height: 18 }} />
              </button>

              <div className="nv-modal-icon">
                {selectedTier.icon}
              </div>

              <h3 className="nv-modal-title">
                Berlangganan {selectedTier.name}
              </h3>
              <p className="nv-modal-desc">
                Masukkan nama Anda untuk memulai perjalanan
              </p>

              <div className="nv-modal-input-group">
                <label className="nv-modal-label" htmlFor="name-input">
                  Nama Anda
                </label>
                <input
                  id="name-input"
                  type="text"
                  className="nv-modal-input"
                  placeholder="Pengguna"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmSubscribe()
                  }}
                  autoFocus
                />
              </div>

              <div className="nv-modal-actions">
                <motion.button
                  className="nv-cta-button nv-pricing-cta nv-pricing-cta-featured"
                  onClick={confirmSubscribe}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Mulai Sekarang
                </motion.button>
                <button
                  className="nv-modal-cancel"
                  onClick={() => setShowNameModal(false)}
                >
                  Batal
                </button>
              </div>

              <p className="nv-modal-footer-text">
                {nameInput.trim() || 'Pengguna'} akan berlangganan paket {selectedTier.name} ({selectedTier.price}{selectedTier.period})
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

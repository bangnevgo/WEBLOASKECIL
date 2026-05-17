'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'

const FEATURES = [
  {
    id: 'ai-manifestation',
    icon: '✦',
    title: 'Analisa Manifestasi',
    badge: 'GRATIS',
    badgeType: 'free' as const,
    desc: 'Temukan handicap terbesar dalam manifestasi Anda dan dapatkan afirmasi penguatan serta ritual harian yang dipersonalisasi',
    view: 'ai-manifestation' as const,
  },
  {
    id: 'ai-limiting-belief',
    icon: '🔍',
    title: 'Diagnosa Limiting Belief',
    badge: '🔒 PREMIUM',
    badgeType: 'premium' as const,
    desc: 'Identifikasi keyakinan tersembunyi yang menghalangi manifestasi Anda melalui kuesioner dan analisis AI mendalam',
    view: 'ai-limiting-belief' as const,
  },
  {
    id: 'ai-shadow',
    icon: '🌑',
    title: 'Diagnosa Shadow',
    badge: '🔒 PREMIUM',
    badgeType: 'premium' as const,
    desc: 'Temukan pola bayangan yang menghambat dan pelajari langkah integrasi untuk membebaskan potensi penuh Anda',
    view: 'ai-shadow' as const,
  },
  {
    id: 'ai-private-session',
    icon: '💬',
    title: 'Private Session',
    badge: '🔒 PREMIUM',
    badgeType: 'premium' as const,
    desc: 'Sesi konsultasi personal dengan AI untuk mengidentifikasi bottleneck dan mendapatkan rencana aksi yang disesuaikan',
    view: 'ai-private-session' as const,
  },
]

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

const cardVariant = {
  initial: { opacity: 0, y: 24, scale: 0.95 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
}

export default function AiHubSection() {
  const { setView, isSubscribed, isAdmin } = useAppStore()

  const handleCardClick = (feature: typeof FEATURES[0]) => {
    if (feature.badgeType === 'free') {
      setView(feature.view)
    } else if (isSubscribed || isAdmin) {
      setView(feature.view)
    } else {
      setView('pricing')
    }
  }

  return (
    <section className="nv-ai-hub" id="ai-mentor">
      {/* Dramatic gold glow background */}
      <div className="nv-ai-hub-bg" />
      <div className="nv-ai-hub-glow-1" />
      <div className="nv-ai-hub-glow-2" />

      <div className="nv-container">
        <motion.div
          className="nv-ai-hub-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="nv-ai-hub-badge">AI MENTOR</span>
          <h2 className="nv-ai-hub-title">✦ AI Mentor — Panduan Personal Manifestasi</h2>
          <p className="nv-ai-hub-subtitle">
            Analisis mendalam berdasarkan ajaran Neville Goddard, dipandu oleh kecerdasan buatan
          </p>
        </motion.div>

        <motion.div
          className="nv-ai-hub-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.id}
              className={`nv-ai-hub-card nv-glass nv-glow-border ${feature.badgeType === 'free' ? 'nv-ai-hub-card-free' : 'nv-ai-hub-card-premium'}`}
              variants={cardVariant}
              whileHover={{
                y: -6,
                transition: { duration: 0.2 },
                boxShadow: feature.badgeType === 'free'
                  ? '0 8px 40px rgba(212, 160, 83, 0.2)'
                  : '0 8px 40px rgba(167, 139, 250, 0.15)',
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(feature)}
              style={{ cursor: 'pointer' }}
            >
              {/* Card accent glow */}
              {feature.badgeType === 'free' && <div className="nv-ai-hub-card-glow" />}

              <div className="nv-ai-hub-card-icon-wrap">
                <span className="nv-ai-hub-card-icon">{feature.icon}</span>
              </div>

              <div className="nv-ai-hub-card-content">
                <div className="nv-ai-hub-card-top">
                  <h3 className="nv-ai-hub-card-title">{feature.title}</h3>
                  <span className={`nv-ai-hub-card-badge ${feature.badgeType === 'free' ? 'nv-ai-hub-badge-free' : 'nv-ai-hub-badge-premium'}`}>
                    {feature.badge}
                  </span>
                </div>
                <p className="nv-ai-hub-card-desc">{feature.desc}</p>
              </div>

              {/* Hover border glow effect */}
              <div className="nv-ai-hub-card-border-glow" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

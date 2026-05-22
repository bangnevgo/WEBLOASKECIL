'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Users, MessageCircle, TrendingUp, Star, Lock, Check } from 'lucide-react'

const COMMUNITY_STATS = {
  totalMembers: 2400,
  activeToday: 87,
  discussions: 156,
  successStories: 320,
}

const TESTIMONIALS = [
  {
    name: 'Toni Martin',
    role: 'Pelajar Premium',
    avatar: 'TM',
    content: '£7.5k project closed berkat teknik SATS yang dipelajari di komunitas!',
    achievement: '✨ Sukses Manifesasi',
  },
  {
    name: 'Sarah Wijaya',
    role: 'Master Member',
    avatar: 'SW',
    content: 'Komunitas ini memberikan support system yang tak ternilai. Selalu ada yang membangunkan saya saat down.',
    achievement: '🎯 6 Bulan Konsisten',
  },
  {
    name: 'Budi Santoso',
    role: 'Premium Member',
    avatar: 'BS',
    content: 'Dari skeptic jadi convert. Diskusi di grup membuka perspective yang tak pernah terpikirkan sebelumnya.',
    achievement: '🌟 Transformation',
  },
  {
    name: 'Maya Devi',
    role: 'Pelajar Premium',
    avatar: 'MD',
    content: 'Akses ke sesi Q&A mingguan benar-benar mengubah cara pandang saya terhadap imajinasi.',
    achievement: '💫 Breakthrough',
  },
]

const FEATURES = [
  {
    icon: <MessageCircle className="nv-community-feature-icon" />,
    title: 'Diskusi Eksklusif',
    desc: 'Bergabung dengan ribuan pencari kebenaran berbagi pengalaman manifestasi',
  },
  {
    icon: <TrendingUp className="nv-community-feature-icon" />,
    title: 'Live Sessions',
    desc: 'Sesi langsung dengan ahli dan peer mentoring setiap minggu',
  },
  {
    icon: <Star className="nv-community-feature-icon" />,
    title: 'Success Stories',
    desc: 'Baca dan dapatkan inspirasi dari anggota yang sudah sukses',
  },
  {
    icon: <Users className="nv-community-feature-icon" />,
    title: 'Network Platform',
    desc: 'Sambungkan dengan sesama peserta dari seluruh Indonesia',
  },
]

export default function CommunityPage() {
  const { setView, hasCommunityAccess } = useAppStore()

  const isAccessAllowed = hasCommunityAccess()

  const handleUnlock = () => {
    setView('pricing')
  }

  return (
    <div className="nv-community-page">
      {/* Hero Section */}
      <section className="nv-community-hero">
        <div className="nv-community-hero-bg">
          <div className="nv-community-orb nv-community-orb-1" />
          <div className="nv-community-orb nv-community-orb-2" />
        </div>

        <div className="nv-community-container">
          <motion.div
            className="nv-community-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {isAccessAllowed ? (
              <>
                <div className="nv-community-badge nv-community-badge-access">
                  <Check size={16} /> Anda sudah memiliki akses
                </div>
                <h1 className="nv-community-title">
                  Selamat Datang di <span className="nv-community-title-highlight">Komunitas Privat</span>
                </h1>
              </>
            ) : (
              <>
                <div className="nv-community-badge nv-community-badge-locked">
                  <Lock size={16} /> Premium Member Area
                </div>
                <h1 className="nv-community-title">
                  Komunitas Privat <span className="nv-community-title-highlight">Hukum Asumsi</span>
                </h1>
                <p className="nv-community-subtitle">
                  Bergabung dengan 2,400+ builder yang bertransformasi melalui hukum asumsi
                </p>
                <motion.button
                  className="nv-community-cta nv-cta-button"
                  onClick={handleUnlock}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Lock size={18} /> Unlock Now →
                </motion.button>
              </>
            )}

            <div className="nv-community-stats">
              {[
                {
                  label: 'Total Members',
                  value: COMMUNITY_STATS.totalMembers.toLocaleString(),
                  icon: <Users size={20} />,
                },
                {
                  label: 'Aktif Hari Ini',
                  value: COMMUNITY_STATS.activeToday,
                  icon: <Star size={20} />,
                },
                {
                  label: 'Diskusi Aktif',
                  value: COMMUNITY_STATS.discussions,
                  icon: <MessageCircle size={20} />,
                },
                {
                  label: 'Success Stories',
                  value: COMMUNITY_STATS.successStories,
                  icon: <TrendingUp size={20} />,
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="nv-community-stat-card nv-glass"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="nv-community-stat-icon">{stat.icon}</div>
                  <div className="nv-community-stat-value">{stat.value}</div>
                  <div className="nv-community-stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {isAccessAllowed && (
        <>
          {/* Features Grid */}
          <section className="nv-community-features">
            <div className="nv-community-container">
              <motion.h2
                className="nv-community-section-title"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Apa yang Dapat Anda Akses?
              </motion.h2>
              <div className="nv-community-features-grid">
                {FEATURES.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="nv-community-feature-card nv-glass"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="nv-community-feature-icon-wrapper">{feature.icon}</div>
                    <h3 className="nv-community-feature-title">{feature.title}</h3>
                    <p className="nv-community-feature-desc">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Member Testimonials */}
          <section className="nv-community-testimonials">
            <div className="nv-community-container">
              <motion.h2
                className="nv-community-section-title"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Testimonial Anggota
              </motion.h2>
              <div className="nv-community-testimonials-grid">
                {TESTIMONIALS.map((testimonial, idx) => (
                  <motion.div
                    key={idx}
                    className="nv-community-testimonial-card nv-glass"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="nv-community-testimonial-header">
                      <div className="nv-community-testimonial-avatar">{testimonial.avatar}</div>
                      <div>
                        <div className="nv-community-testimonial-name">{testimonial.name}</div>
                        <div className="nv-community-testimonial-role">{testimonial.role}</div>
                      </div>
                      <div className="nv-community-testimonial-badge">{testimonial.achievement}</div>
                    </div>
                    <p className="nv-community-testimonial-content">&ldquo;{testimonial.content}&rdquo;</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Active Members */}
          <section className="nv-community-members">
            <div className="nv-community-container">
              <motion.h2
                className="nv-community-section-title"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Anggota Aktif
              </motion.h2>
              <div className="nv-community-members-avatars">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="nv-community-member-avatar"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 100}`}
                      alt={`Member ${i + 1}`}
                      width={48}
                      height={48}
                    />
                    <div className="nv-community-member-status" />
                  </motion.div>
                ))}
                <div className="nv-community-member-count">
                  +{COMMUNITY_STATS.totalMembers.toLocaleString()}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Tier Promo for non-access users */}
      {!isAccessAllowed && (
        <section className="nv-community-prompt">
          <div className="nv-community-container">
            <motion.div
              className="nv-community-prompt-card nv-glass"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2>Dapatkan Akses Komunitas Sekarang</h2>
              <p>
                Bangun jaringan dengan sesama pencari kebenaran, dapatkan support system,
                dan tingkatkan perjalanan manifestasi Anda.
              </p>
              <div className="nv-community-pricing-highlight">
                <div className="nv-community-tier-badge">Premium</div>
                <div className="nv-community-tier-price">
                  Rp 149K<span>/bulan</span>
                </div>
                <ul className="nv-community-tier-features">
                  <li>✓ Semua fitur Pelajar</li>
                  <li>✓ Akses komunitas privat aktif</li>
                  <li>✓ Profil anggota & koneksi</li>
                  <li>✓ Diskusi eksklusif</li>
                </ul>
              </div>
              <motion.button
                className="nv-cta-button nv-community-cta"
                onClick={handleUnlock}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Lock size={18} /> Upgrade ke Premium
              </motion.button>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
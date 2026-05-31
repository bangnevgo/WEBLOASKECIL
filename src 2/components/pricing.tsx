 'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, SubscriptionTier } from '@/lib/store'
import { Check, Sparkles, Crown, BookOpen, X, Mail, User, Phone, Users } from 'lucide-react'
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
  tierKey: string
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
    name: 'Premium',
    nameEn: 'Premium',
    price: 'Rp 149K',
    period: '/bulan',
    description: 'Kurikulum lengkap + akses komunitas privat aktif',
    features: [
      'Semua 49 pelajaran',
      'Konten lengkap & kutipan bersumber',
      'Praktik harian',
      'Poin-poin penting',
      'Pembaruan materi baru',
      'Akses komunitas privat aktif',
      'Profil anggota dan koneksi dengan sesama peserta',
    ],
    cta: 'Berlangganan',
    featured: false,
    icon: <Users className="nv-pricing-icon-svg" />,
    tierKey: 'premium',
  },
  {
    name: 'Master',
    nameEn: 'Master',
    price: 'Rp 299K',
    period: '/bulan',
    description: 'Perjalanan transformasi lengkap dengan dukungan eksklusif',
    features: [
      'Semua fitur Premium',
      'Sesi panduan audio eksklusif',
      'Akses Rekaman Webinar VIP',
      'Jurnal praktik harian pribadi',
      'Konsultasi bulanan dengan ahli',
      'Akses awal ke konten baru',
      'BadgeMaster dan sertifikat akhir',
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
  const { setView, setSubscriptionTier, openFreeLesson } = useAppStore()
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubscribe = async (tier: PricingTier) => {
    if (tier.name === 'Penggemar') {
      openFreeLesson('1.1')
      toast('✦ Mulai jelajahi pelajaran gratis!')
      return
    }
    // For paid tiers, call setSubscriptionTier with the tier key and collect user info
    setSelectedTier(tier) // This will show the modal to collect name, email, phone
  }

  const processPayment = async () => {
    if (!email || !name || !phone) {
      toast.error('Mohon lengkapi nama, email dan nomor WhatsApp Anda')
      return
    }
    if (!selectedTier) return

    try {
      setIsProcessing(true)
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedTier.tierKey,
          email: email,
          name: name,
          phone: phone,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal membuat transaksi')

      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: () => {
            toast.success('Pembayaran Berhasil! Akses Anda akan aktif secara otomatis.')
            setSubscriptionTier(selectedTier.tierKey as SubscriptionTier, name)
            setView('dashboard')
          },
          onPending: () => toast.info('Menunggu pembayaran Anda...'),
          onError: () => toast.error('Pembayaran gagal. Silakan coba lagi.'),
          onClose: () => toast.info('Pembayaran dibatalkan.'),
        })
      } else if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="nv-pricing-page">
      <div className="nv-pricing-bg-orb nv-pricing-bg-orb-1" />
      <div className="nv-pricing-bg-orb nv-pricing-bg-orb-2" />

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
            {tier.featured && <div className="nv-pricing-badge">POPULER</div>}
            <div className="nv-pricing-card-inner">
              <div className={`nv-pricing-icon ${tier.featured ? 'nv-pricing-icon-featured' : ''}`}>
                {tier.icon}
              </div>
              <div className="nv-pricing-card-name">{tier.name}</div>
              <div className="nv-pricing-card-name-en">{tier.nameEn}</div>
              <div className="nv-pricing-price-row">
                <span className="nv-pricing-card-price">{tier.price}</span>
                {tier.period && <span className="nv-pricing-card-period">{tier.period}</span>}
              </div>
              <p className="nv-pricing-card-desc">{tier.description}</p>
              <div className="nv-pricing-divider" />
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
              <motion.button
                className={`nv-cta-button nv-pricing-cta ${tier.featured ? 'nv-pricing-cta-featured' : ''}`}
                onClick={() => handleSubscribe(tier)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {tier.name === 'Penggemar' ? tier.cta : <><span className="nv-cta-icon">✦</span> {tier.cta} Sekarang</>}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedTier && (
          <motion.div 
            className="nv-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTier(null)}
          >
            <motion.div 
              className="nv-modal-content nv-glass" 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <button className="nv-modal-close" onClick={() => setSelectedTier(null)}>
                <X style={{ width: 18, height: 18 }} />
              </button>
              <h3 className="nv-modal-title">Konfirmasi Langganan</h3>
              <p className="nv-modal-desc">Lengkapi data Anda untuk melanjutkan ke pembayaran aman via Midtrans.</p>
              
              <div className="nv-modal-input-group" style={{marginTop: '20px'}}>
                <label className="nv-modal-label">NAMA LENGKAP</label>
                <div className="nv-modal-input-wrapper" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                  <User style={{position: 'absolute', left: 10, width: 16, height: 16, opacity: 0.5}} />
                  <input 
                    className="nv-modal-input" 
                    style={{paddingLeft: '35px'}}
                    placeholder="Nama panggilan Anda" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
              </div>

              <div className="nv-modal-input-group">
                <label className="nv-modal-label">ALAMAT EMAIL</label>
                <div className="nv-modal-input-wrapper" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                  <Mail style={{position: 'absolute', left: 10, width: 16, height: 16, opacity: 0.5}} />
                  <input 
                    className="nv-modal-input" 
                    style={{paddingLeft: '35px'}}
                    type="email" 
                    placeholder="email@anda.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              <div className="nv-modal-input-group">
                <label className="nv-modal-label">NOMOR WHATSAPP</label>
                <div className="nv-modal-input-wrapper" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                  <Phone style={{position: 'absolute', left: 10, width: 16, height: 16, opacity: 0.5}} />
                  <input 
                    className="nv-modal-input" 
                    style={{paddingLeft: '35px'}}
                    placeholder="Contoh: 08123456789" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </div>
              </div>

              <div className="nv-modal-actions" style={{marginTop: '30px'}}>
                <motion.button
                  className="nv-cta-button nv-pricing-cta nv-pricing-cta-featured"
                  onClick={processPayment}
                  disabled={isProcessing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isProcessing ? 'Memproses...' : `Selesaikan Pembayaran ${selectedTier.price}`}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="nv-activation-how nv-glass"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h3 className="nv-activation-how-title">Cara Berlangganan</h3>
        <div className="nv-activation-steps">
          <div className="nv-activation-step">
            <div className="nv-activation-step-num">1</div >
            <div>
              <div className="nv-activation-step-label">Pilih Paket</div>
              <div className="nv-activation-step-desc">Klik "Berlangganan" pada paket yang diinginkan</div>
            </div>
          </div>
          <div className="nv-activation-step-connector" />
          <div className="nv-activation-step">
            <div className="nv-activation-step-num">2</div>
            <div>
              <div className="nv-activation-step-label">Isi Data & Bayar</div>
              <div className="nv-activation-step-desc">Lengkapi email, WA & bayar via Midtrans Snap yang aman</div>
            </div>
          </div>
          <div className="nv-activation-step-connector" />
          <div className="nv-activation-step">
            <div className="nv-activation-step-num">3</div>
            <div>
              <div className="nv-activation-step-label">Akses Langsung Aktif</div>
              <div className="nv-activation-step-desc">Setelah bayar, akun Anda langsung terbuka otomatis</div>
            </div>
          </div>
          <div className="nv-activation-step-connector" />
          <div className="nv-activation-step">
            <div className="nv-activation-step-num">✦</div>
            <div>
              <div className="nv-activation-step-label">Mulai Transformasi</div>
              <div className="nv-activation-step-desc">Nikmati seluruh kurikulum Hukum Asumsi</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.p
        className="nv-pricing-footer-note"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Pembayaran via Midtrans Snap · Aktivasi Otomatis · Akses instan tanpa kode
      </motion.p>
    </div>
  )
}

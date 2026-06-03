 'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, SubscriptionTier } from '@/lib/store'
import { useTranslation } from '@/lib/translations'
import { Check, Sparkles, Crown, BookOpen, X, Mail, User, Phone, Users } from 'lucide-react'
import { toast } from 'sonner'
import { FREE_LESSON_NUMS } from '@/lib/curriculum-data'

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
      `${FREE_LESSON_NUMS.length} pelajaran pertama gratis`,
      'Unduh gratis 4 eBook materi pendukung',
      'Ringkasan ajaran & kutipan pilihan',
      '❌ Tanpa akses Bank Knowledge & Komunitas',
    ],
    cta: 'Jelajahi Gratis',
    featured: false,
    icon: <BookOpen className="nv-pricing-icon-svg" />,
    tierKey: 'free',
  },
  {
    name: 'Basic',
    nameEn: 'Basic',
    price: 'Rp 99K',
    period: '/bulan',
    description: 'Akses kurikulum lengkap & Bank Knowledge',
    features: [
      'Semua 49 pelajaran',
      'Akses Repositori Bank Knowledge (Non-VIP)',
      'Konten lengkap & kutipan bersumber',
      'Praktik SATS harian',
      'Poin-poin penting & update materi',
      '❌ Tanpa akses forum komunitas',
    ],
    cta: 'Berlangganan',
    featured: true,
    icon: <Sparkles className="nv-pricing-icon-svg" />,
    tierKey: 'basic',
  },
  {
    name: 'Premium',
    nameEn: 'Premium',
    price: 'Rp 149K',
    period: '/bulan',
    description: 'Kurikulum lengkap + akses komunitas privat aktif',
    features: [
      'Semua 49 pelajaran',
      'Akses Repositori Bank Knowledge & VIP',
      'Akses forum komunitas privat aktif',
      'Interaksi (likes, comments, posts)',
      'Sesi Meditasi Live Kelompok mingguan',
      'Leaderboard & rewards kenaikan level',
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
      'Badge Master dan sertifikat akhir',
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
  const { t, language } = useTranslation()
  const { setView, setSubscriptionTier, openFreeLesson } = useAppStore()
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const activeTiers = (() => {
    if (language === 'en') {
      return [
        {
          name: 'Enthusiast',
          nameEn: 'Enthusiast',
          price: 'Free',
          period: '',
          description: 'Explore the basics of Neville’s teachings',
          features: [
            `First ${FREE_LESSON_NUMS.length} lessons for free`,
            'Free download of 4 support eBooks',
            'Summary of teachings & selected quotes',
            '❌ No Knowledge Bank & Community access',
          ],
          cta: 'Explore for Free',
          featured: false,
          icon: <BookOpen className="nv-pricing-icon-svg" />,
          tierKey: 'free',
        },
        {
          name: 'Basic',
          nameEn: 'Basic',
          price: 'Rp 99K',
          period: '/month',
          description: 'Full curriculum access & Knowledge Bank',
          features: [
            'All 49 lessons',
            'Access to Knowledge Bank Repository (Non-VIP)',
            'Full content & sourced quotes',
            'Daily SATS practice',
            'Key takeaways & material updates',
            '❌ No community forum access',
          ],
          cta: 'Subscribe',
          featured: true,
          icon: <Sparkles className="nv-pricing-icon-svg" />,
          tierKey: 'basic',
        },
        {
          name: 'Premium',
          nameEn: 'Premium',
          price: 'Rp 149K',
          period: '/month',
          description: 'Full curriculum + active private community access',
          features: [
            'All 49 lessons',
            'Access to Knowledge Bank Repository & VIP',
            'Access to active private community forum',
            'Interaction (likes, comments, posts)',
            'Weekly Live Group Meditation sessions',
            'Leaderboard & level up rewards',
          ],
          cta: 'Subscribe',
          featured: false,
          icon: <Users className="nv-pricing-icon-svg" />,
          tierKey: 'premium',
        },
        {
          name: 'Master',
          nameEn: 'Master',
          price: 'Rp 299K',
          period: '/month',
          description: 'Complete transformation journey with exclusive support',
          features: [
            'All Premium features',
            'Exclusive guided audio sessions',
            'VIP Webinar Recordings access',
            'Personalized daily practice journal',
            'Premium Inner Programming Workbook',
            'Early access to new content',
            'Master badge and final certificate',
          ],
          cta: 'Subscribe',
          featured: false,
          icon: <Crown className="nv-pricing-icon-svg" />,
          tierKey: 'master',
        },
      ]
    }
    return TIERS
  })()

  const handleSubscribe = async (tier: PricingTier) => {
    if (tier.tierKey === 'free') {
      openFreeLesson('1.1')
      toast(language === 'en' ? '✦ Start exploring free lessons!' : '✦ Mulai jelajahi pelajaran gratis!')
      return
    }
    setSelectedTier(tier)
  }

  const processPayment = async () => {
    if (!email || !name || !phone) {
      toast.error(
        language === 'en'
          ? 'Please complete your name, email and WhatsApp number'
          : 'Mohon lengkapi nama, email dan nomor WhatsApp Anda'
      )
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
            toast.success(
              language === 'en'
                ? 'Payment Successful! Your access will be automatically activated.'
                : 'Pembayaran Berhasil! Akses Anda akan aktif secara otomatis.'
            )
            setSubscriptionTier(selectedTier.tierKey as SubscriptionTier, name)
            setView('dashboard')
          },
          onPending: () => toast.info(language === 'en' ? 'Waiting for your payment...' : 'Menunggu pembayaran Anda...'),
          onError: () => toast.error(language === 'en' ? 'Payment failed. Please try again.' : 'Pembayaran gagal. Silakan coba lagi.'),
          onClose: () => toast.info(language === 'en' ? 'Payment cancelled.' : 'Pembayaran dibatalkan.'),
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
          {language === 'en' ? '← Back to Home' : '← Kembali ke Beranda'}
        </motion.button>
        <div className="nv-pricing-header-text">
          <h1 className="nv-pricing-title">{language === 'en' ? 'Choose Subscription Plan' : 'Pilih Paket Berlangganan'}</h1>
          <p className="nv-pricing-subtitle">
            {language === 'en' ? 'Unlock the full potential of Neville Goddard’s teachings through a structured curriculum' : 'Buka potensi penuh ajaran Neville Goddard melalui kurikulum terstruktur'}
          </p>
        </div>
      </motion.header>

      <div className="nv-pricing-grid">
        {activeTiers.map((tier, i) => (
          <motion.div
            key={tier.tierKey}
            className={`nv-pricing-card ${tier.featured ? 'nv-pricing-card-featured' : ''}`}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
          >
            {tier.featured && <div className="nv-pricing-badge">{language === 'en' ? 'POPULAR' : 'POPULER'}</div>}
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
                {tier.tierKey === 'free' ? tier.cta : <><span className="nv-cta-icon">✦</span> {tier.cta} {language === 'en' ? 'Now' : 'Sekarang'}</>}
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
              <h3 className="nv-modal-title">{language === 'en' ? 'Confirm Subscription' : 'Konfirmasi Langganan'}</h3>
              <p className="nv-modal-desc">{language === 'en' ? 'Complete your details to proceed to secure payment via Midtrans.' : 'Lengkapi data Anda untuk melanjutkan ke pembayaran aman via Midtrans.'}</p>
              
              <div className="nv-modal-input-group" style={{marginTop: '20px'}}>
                <label className="nv-modal-label">{language === 'en' ? 'FULL NAME' : 'NAMA LENGKAP'}</label>
                <div className="nv-modal-input-wrapper" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                  <User style={{position: 'absolute', left: 10, width: 16, height: 16, opacity: 0.5}} />
                  <input 
                    className="nv-modal-input" 
                    style={{paddingLeft: '35px'}}
                    placeholder={language === 'en' ? 'Your name or nickname' : 'Nama panggilan Anda'} 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
              </div>

              <div className="nv-modal-input-group">
                <label className="nv-modal-label">{language === 'en' ? 'EMAIL ADDRESS' : 'ALAMAT EMAIL'}</label>
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
                <label className="nv-modal-label">{language === 'en' ? 'WHATSAPP NUMBER' : 'NOMOR WHATSAPP'}</label>
                <div className="nv-modal-input-wrapper" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                  <Phone style={{position: 'absolute', left: 10, width: 16, height: 16, opacity: 0.5}} />
                  <input 
                    className="nv-modal-input" 
                    style={{paddingLeft: '35px'}}
                    placeholder={language === 'en' ? 'Example: 08123456789' : 'Contoh: 08123456789'} 
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
                  {isProcessing 
                    ? (language === 'en' ? 'Processing...' : 'Memproses...') 
                    : (language === 'en' ? `Complete Payment ${selectedTier.price}` : `Selesaikan Pembayaran ${selectedTier.price}`)}
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
        <h3 className="nv-activation-how-title">{language === 'en' ? 'How to Subscribe' : 'Cara Berlangganan'}</h3>
        <div className="nv-activation-steps">
          <div className="nv-activation-step">
            <div className="nv-activation-step-num">1</div >
            <div>
              <div className="nv-activation-step-label">{language === 'en' ? 'Choose Plan' : 'Pilih Paket'}</div>
              <div className="nv-activation-step-desc">{language === 'en' ? 'Click "Subscribe" on the desired plan' : 'Klik "Berlangganan" pada paket yang diinginkan'}</div>
            </div>
          </div>
          <div className="nv-activation-step-connector" />
          <div className="nv-activation-step">
            <div className="nv-activation-step-num">2</div>
            <div>
              <div className="nv-activation-step-label">{language === 'en' ? 'Fill Details & Pay' : 'Isi Data & Bayar'}</div>
              <div className="nv-activation-step-desc">{language === 'en' ? 'Fill email, WA & pay via secure Midtrans Snap' : 'Lengkapi email, WA & bayar via Midtrans Snap yang aman'}</div>
            </div>
          </div>
          <div className="nv-activation-step-connector" />
          <div className="nv-activation-step">
            <div className="nv-activation-step-num">3</div>
            <div>
              <div className="nv-activation-step-label">{language === 'en' ? 'Active Instantly' : 'Akses Langsung Aktif'}</div>
              <div className="nv-activation-step-desc">{language === 'en' ? 'After payment, your account is immediately opened automatically' : 'Setelah bayar, akun Anda langsung terbuka otomatis'}</div>
            </div>
          </div>
          <div className="nv-activation-step-connector" />
          <div className="nv-activation-step">
            <div className="nv-activation-step-num">✦</div>
            <div>
              <div className="nv-activation-step-label">{language === 'en' ? 'Start Transformation' : 'Mulai Transformasi'}</div>
              <div className="nv-activation-step-desc">{language === 'en' ? 'Enjoy the complete Law of Assumption curriculum' : 'Nikmati seluruh kurikulum Hukum Asumsi'}</div>
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
        {language === 'en' 
          ? 'Payment via Midtrans Snap · Automatic Activation · Instant access without code'
          : 'Pembayaran via Midtrans Snap · Aktivasi Otomatis · Akses instan tanpa kode'
        }
      </motion.p>
    </div>
  )
}

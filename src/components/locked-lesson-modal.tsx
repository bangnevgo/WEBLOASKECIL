'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ExternalLink } from 'lucide-react'

const LYNK_ID_URL = 'https://lynk.id/bangnevgo'

export default function LockedLessonModal() {
  const { lockedLesson, closeLockedLesson, setView, openFreeLesson } = useAppStore()

  if (!lockedLesson) return null

  const handleSubscribe = () => {
    closeLockedLesson()
    setView('pricing')
  }

  const handleTryFree = () => {
    closeLockedLesson()
    openFreeLesson('1.1')
  }

  const handleLynkPay = () => {
    window.open(LYNK_ID_URL, '_blank', 'noopener')
    closeLockedLesson()
    setView('pricing')
  }

  return (
    <AnimatePresence>
      <motion.div
        className="nv-locked-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeLockedLesson}
      >
        <motion.div
          className="nv-locked-modal"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="nv-locked-close" onClick={closeLockedLesson}>✕</button>

          <div className="nv-locked-lock-icon">🔒</div>

          <div className="nv-locked-num">{lockedLesson.num}</div>
          <h3 className="nv-locked-title">{lockedLesson.title}</h3>

          <ul className="nv-locked-bullets">
            {lockedLesson.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>

          {/* Blurred preview area */}
          <div className="nv-locked-blur-area">
            <div className="nv-locked-blur-text">
              Konten lengkap pelajaran ini tersedia untuk pelanggan. Dapatkan akses ke seluruh
              49 pelajaran dengan kutipan bersumber, praktik harian, dan poin-poin penting
              dari seluruh karya Neville Goddard...
            </div>
            <div className="nv-locked-blur-overlay">
              <span className="nv-locked-blur-lock">✦ Konten Terkunci</span>
            </div>
          </div>

          <div className="nv-locked-cta">
            <motion.button
              className="nv-cta-button nv-cta-pulse"
              onClick={handleLynkPay}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{ width: '100%' }}
            >
              <ExternalLink style={{ width: 16, height: 16 }} />
              <span className="nv-cta-icon">✦</span>
              Buka Pelajaran — Bayar via Lynk.id
            </motion.button>
          </div>

          <button className="nv-locked-free-link" onClick={handleTryFree}>
            Atau coba 3 pelajaran gratis →
          </button>

          <button className="nv-locked-have-code-link" onClick={handleSubscribe}>
            Sudah punya kode aktivasi? Masukkan di sini →
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

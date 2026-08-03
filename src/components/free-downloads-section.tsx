'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { FileText, Download, X, Mail } from 'lucide-react'
import { toast } from 'sonner'

const DOWNLOAD_ITEMS = [
  {
    key: '7-hari-kealamian',
    title: '7 Hari Mencapai Kealamian Manifestasi',
    description: 'Panduan langkah demi langkah selama seminggu untuk menyelaraskan asumsi batin agar manifestasi terasa natural dan tanpa paksaan.',
    file: '7 Hari Mencapai Kealamian Manifestasi.pdf',
    pages: 'Bootcamp',
    category: 'Ebook Utama',
    fileReady: false
  },
  {
    key: 'asumsimu-dahsyat',
    title: 'Asumsimu Itu Dahsyat',
    description: 'Membongkar kekuatan batin dari asumsi Anda yang mampu mendikte realitas luar dan menggerakkan jembatan kejadian secara instan.',
    file: 'Asumsimu Itu Dahsyat.pdf',
    pages: 'Bootcamp',
    category: 'Ebook Teaser',
    fileReady: false
  },
  {
    key: 'imajinasi-menciptakan',
    title: 'Imajinasi Menciptakan Realitas',
    description: 'Buku panduan dasar Hukum Asumsi untuk melatih visualisasi subyektif dan membuktikannya ke dalam dunia obyektif.',
    file: 'IMAJINASI MENCIPTAKAN REALITAS.pdf',
    pages: 'Bootcamp',
    category: 'Panduan Batin',
    fileReady: false
  },
  {
    key: 'somatic-zero',
    title: 'Somatic Zero: Jalur Cepat Manifestasi Impian',
    description: 'Teknik rilis beban tubuh (somatis) untuk menetralkan resistensi fisik agar kondisi batin I AM dapat tercapai dengan sempurna.',
    file: 'Somatic Zero - Jalur Cepat Menuju Manifestasi Impian.pdf',
    pages: 'Bootcamp',
    category: 'Workbook Somatis',
    fileReady: false
  }
]

export default function FreeDownloadsSection() {
  const { isAuthenticated, userEmail, language } = useAppStore()
  const [activeItem, setActiveItem] = useState<typeof DOWNLOAD_ITEMS[0] | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isIndo = language === 'id'

  const triggerDownload = (fileName: string) => {
    // Generate anchor tag to download file
    const link = document.createElement('a')
    link.href = `/api/media?type=pdf&file=${fileName}`
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Unduhan Anda telah dimulai! ✦')
  }

  const handleDownloadClick = (item: typeof DOWNLOAD_ITEMS[0]) => {
    if (!item.fileReady) {
      toast.info(isIndo ? 'File sedang dipersiapkan. Nantikan segera! ✨' : 'File is being prepared. Coming soon! ✨')
      return
    }
    if (isAuthenticated) {
      triggerDownload(item.file)
    } else {
      setActiveItem(item)
    }
  }

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput || !emailInput.includes('@')) {
      toast.error('Mohon masukkan alamat email yang valid')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      if (activeItem) {
        triggerDownload(activeItem.file)
      }
      setActiveItem(null)
      setEmailInput('')
    }, 1200)
  }

  return (
    <section className="nv-ebook-etalase-section" style={{ marginTop: '32px' }}>
      <motion.div
        className="nv-ebook-etalase-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="nv-ebook-etalase-badge">✦ DAFTAR FREE</span>
        <h2 className="nv-ebook-etalase-title">Sumber Daya Pelengkap</h2>
        <p className="nv-ebook-etalase-subtitle">
          Daftar Free untuk membuka panduan ringkas, cheatsheet, dan jurnal praktik pendukung.
        </p>
      </motion.div>

      <div className="nv-container">
        <div className="nv-pdf-grid">
          {DOWNLOAD_ITEMS.map((item, idx) => (
            <motion.div
              key={item.key}
              className="nv-pdf-card nv-premium-glass nv-premium-glass-hover"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <div className="nv-pdf-card-glow" />
              <div className="flex items-center justify-between">
                <span className="nv-pdf-meta">{item.category}</span>
                <div className="flex items-center gap-1.5">
                  {!item.fileReady && (
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {isIndo ? 'SEGERA ✨' : 'COMING SOON ✨'}
                    </span>
                  )}
                  <span className="nv-pdf-meta text-[#d4a053] font-bold">{item.pages}</span>
                </div>
              </div>
              <div className="flex gap-3 items-start mt-2">
                <div className="nv-pdf-icon-wrap">
                  <FileText size={20} />
                </div>
                <h3 className="text-sm font-bold text-[#e8e4dc] leading-snug m-0 flex-1">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed m-0 mt-1">
                {item.description}
              </p>
              
              <button 
                className="nv-pdf-download-btn mt-4"
                onClick={() => handleDownloadClick(item)}
              >
                <Download size={14} />
                <span>Daftar Free</span>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <a
            href="https://lynk.id/bangnevgo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-[#d4a053]/40 text-[#d4a053] font-bold text-xs sm:text-sm rounded-full transition shadow-md hover:scale-105"
          >
            <span>🛍️ Ingin Ebook Lengkap, Event & Produk Digital Bang Nevgo? Kunjungi Lynk.id/bangnevgo</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Email Gate Modal */}
      <AnimatePresence>
        {activeItem && (
          <div className="nv-modal-overlay" onClick={() => setActiveItem(null)}>
            <motion.div
              className="nv-modal-content nv-glass"
              style={{ maxWidth: '400px' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="nv-modal-close" onClick={() => setActiveItem(null)}>
                <X size={16} />
              </button>
              
              <div className="text-center">
                <div className="nv-auth-logo-badge">
                  <Mail size={22} />
                </div>
                <h3 className="nv-modal-title mt-2">Masukkan Email Anda</h3>
                <p className="nv-modal-desc mt-1">
                  Kami akan mengirimkan PDF **{activeItem.title}** langsung ke inbox Anda beserta pembaharuan materi belajar.
                </p>
              </div>

              <form onSubmit={handleGateSubmit} className="flex flex-col gap-4 mt-6">
                <div className="nv-auth-input-group">
                  <label className="nv-modal-label">ALAMAT EMAIL</label>
                  <div className="nv-auth-input-wrapper">
                    <Mail size={16} className="nv-auth-input-icon" />
                    <input
                      type="email"
                      required
                      placeholder="email@anda.com"
                      className="nv-auth-input"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="nv-auth-submit-btn mt-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Mengirim...' : 'Unduh Sekarang'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

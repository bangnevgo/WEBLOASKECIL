'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Phone, User, Sparkles } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { toast } from 'sonner'
import TestimoniModal from '@/components/testimoni-modal'

interface Props {
  isOpen: boolean
  onClose: () => void
  onRegistered?: () => void
  onStartLearning?: () => void
}

export default function LeadCaptureModal({ isOpen, onClose, onRegistered, onStartLearning }: Props) {
  const { language, registerLead } = useAppStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [justRegistered, setJustRegistered] = useState(false)
  const [showTestimoniGallery, setShowTestimoniGallery] = useState(false)
  const submitLock = useRef(false)

  const isIndo = language === 'id'

  useEffect(() => {
    if (isOpen) {
      setJustRegistered(false)
      setName('')
      setEmail('')
      setPhone('')
      submitLock.current = false
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (submitLock.current) return

    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error(isIndo ? 'Semua field wajib diisi' : 'All fields are required')
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast.error(isIndo ? 'Format email tidak valid' : 'Invalid email format')
      return
    }

    submitLock.current = true
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/lead/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim()
        })
      })

      const data = await res.json()

      if (data.success) {
        registerLead({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim()
        })

        // Direct lesson URLs send anonymous visitors back here with a safe,
        // same-origin destination. Return them to that lesson only after the
        // lead has been stored and the server has set the access cookie.
        const next = new URLSearchParams(window.location.search).get('next')
        if (next?.startsWith('/belajar/')) {
          window.location.assign(next)
          return
        }

        // When the form was opened by a locked lesson card, return the
        // visitor directly to that exact lesson rather than leaving them in
        // the success state and requiring a second click.
        if (onRegistered) {
          onRegistered()
          return
        }

        toast.success(
          data.duplicate
            ? (isIndo
              ? '✦ Anda sudah terdaftar sebelumnya. Akses penuh tetap dibuka.'
              : "✦ You're already registered. Full access is still unlocked.")
            : (isIndo ? '✦ Pendaftaran berhasil! Akses penuh ke semua modul telah dibuka.' : '✦ Registration successful! Full access to all modules is now unlocked.')
        )
        setJustRegistered(true)
      } else {
        toast.error(data.error || (isIndo ? 'Gagal mendaftar. Coba lagi.' : 'Registration failed. Try again.'))
        submitLock.current = false
      }
    } catch (err) {
      console.error('Lead registration error:', err)
      toast.error(isIndo ? 'Terjadi kesalahan. Coba lagi.' : 'An error occurred. Try again.')
      submitLock.current = false
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="nv-modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
          <motion.div
            role="dialog"
            aria-modal="true"
            className="nv-modal-content nv-glass"
            style={{ maxWidth: '440px' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="nv-modal-close" onClick={onClose}>
              <X size={16} />
            </button>

            {justRegistered ? (
              <div className="text-center">
                <div className="nv-auth-logo-badge" style={{ background: 'linear-gradient(135deg, #d4a053, #b8862d)' }}>
                  <Sparkles size={24} />
                </div>
                <h3 className="nv-modal-title mt-2" style={{ fontSize: '1.15rem' }}>
                  {isIndo ? '✦ Akses Penuh Terbuka!' : '✦ Full Access Unlocked!'}
                </h3>
                <p className="nv-modal-desc mt-2" style={{ fontSize: '0.85rem' }}>
                  {isIndo
                    ? 'Seluruh materi Hukum Asumsi sekarang sudah bisa kamu pelajari.'
                    : 'All Law of Assumption materials are now available for you to study.'
                  }
                </p>
                <button
                  type="button"
                  onClick={onStartLearning || onClose}
                  className="nv-auth-submit-btn mt-5"
                  style={{ display: 'block', width: '100%', background: 'linear-gradient(135deg, #d4a053, #b8862d)', color: '#000', fontWeight: 700 }}
                >
                  {isIndo ? '✦ Buka Semua Materi →' : '✦ Open All Lessons →'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[11px] text-neutral-500 mt-3 hover:text-neutral-300"
                >
                  {isIndo ? 'Tutup' : 'Close'}
                </button>
              </div>
            ) : (
              <>
              <div className="text-center">
              <div className="nv-auth-logo-badge">
                <Sparkles size={24} />
              </div>
              <h3 className="nv-modal-title mt-2" style={{ fontSize: '1.1rem' }}>
                {isIndo ? '✨ Daftar Free — Full Akses' : '✨ Register Free — Full Access'}
              </h3>
              <p className="nv-modal-desc mt-1" style={{ fontSize: '0.85rem' }}>
                {isIndo
                  ? 'Isi data Anda untuk membuka akses penuh ke seluruh modul Hukum Asumsi beserta materi pendukung.'
                  : 'Fill in your details to unlock full access to all Law of Assumption modules and supporting materials.'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
              {/* Name */}
              <div className="nv-auth-input-group">
                <label className="nv-modal-label">
                  {isIndo ? 'NAMA LENGKAP' : 'FULL NAME'}
                </label>
                <div className="nv-auth-input-wrapper">
                  <User size={16} className="nv-auth-input-icon" />
                  <input
                    type="text"
                    required
                    placeholder={isIndo ? 'Nama Anda' : 'Your name'}
                    className="nv-auth-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="nv-auth-input-group">
                <label className="nv-modal-label">EMAIL</label>
                <div className="nv-auth-input-wrapper">
                  <Mail size={16} className="nv-auth-input-icon" />
                  <input
                    type="email"
                    required
                    placeholder="email@anda.com"
                    className="nv-auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Phone/WA */}
              <div className="nv-auth-input-group">
                <label className="nv-modal-label">
                  {isIndo ? 'NO. HP / WHATSAPP' : 'PHONE / WHATSAPP NUMBER'}
                </label>
                <div className="nv-auth-input-wrapper">
                  <Phone size={16} className="nv-auth-input-icon" />
                  <input
                    type="tel"
                    required
                    placeholder={isIndo ? '08xxxxxxxxxx' : '08xxxxxxxxxx'}
                    className="nv-auth-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="nv-auth-submit-btn mt-2"
                style={{
                  background: 'linear-gradient(135deg, #d4a053, #b8862d)',
                  color: '#000',
                  fontWeight: 700
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting
                  ? (isIndo ? 'Mendaftarkan...' : 'Registering...')
                  : (isIndo ? '✦ Daftar Free — Buka Semua Modul' : '✦ Register Free — Unlock All Modules')
                }
              </motion.button>

              <div className="flex items-center justify-center gap-1.5 mt-2.5 px-2 py-1.5 rounded-lg bg-[#d4a053]/10 border border-[#d4a053]/20">
                <Sparkles size={13} className="text-[#d4a053] flex-shrink-0" />
                <p className="text-[11px] font-semibold text-[#e5b869] text-center leading-tight">
                  {isIndo
                    ? 'Akses langsung terbuka tanpa batas waktu & 100% gratis'
                    : 'Instant access unlocked with no time limit & 100% free'
                  }
                </p>
              </div>

              {/* WA Testimoni Teaser Card */}
              <div className="mt-3 pt-3 border-t border-[#d4a053]/20 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-center">
                  <span className="text-xs font-bold text-[#e5b869]">💬 {isIndo ? 'Bukti Hasil Nyata Murid' : 'Real Student Results'}</span>
                  <span className="text-[10px] text-neutral-400">(35+ Screenshot WA)</span>
                </div>
                <div className="flex items-center justify-center gap-2 w-full">
                  <div className="relative w-14 h-16 rounded-md overflow-hidden border border-[#d4a053]/30 flex-shrink-0 bg-black/40 cursor-pointer" onClick={() => setShowTestimoniGallery(true)}>
                    <img src="/testimoni/testimoni-01.jpeg" alt="Teaser 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="relative w-14 h-16 rounded-md overflow-hidden border border-[#d4a053]/30 flex-shrink-0 bg-black/40 cursor-pointer" onClick={() => setShowTestimoniGallery(true)}>
                    <img src="/testimoni/testimoni-05.jpeg" alt="Teaser 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="relative w-14 h-16 rounded-md overflow-hidden border border-[#d4a053]/30 flex-shrink-0 bg-black/40 cursor-pointer" onClick={() => setShowTestimoniGallery(true)}>
                    <img src="/testimoni/testimoni-10.jpeg" alt="Teaser 3" className="w-full h-full object-cover" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTestimoniGallery(true)}
                  className="text-[11px] font-bold text-[#d4a053] hover:underline flex items-center gap-1 mt-1"
                >
                  <span>💬 {isIndo ? 'Baca Testimoni WA Lengkap →' : 'Read Full WA Testimonials →'}</span>
                </button>
              </div>
            </form>

            <TestimoniModal isOpen={showTestimoniGallery} onClose={() => setShowTestimoniGallery(false)} />

            <p className="text-[10px] text-neutral-500 text-center mt-4 leading-relaxed">
              {isIndo
                ? 'Dengan mendaftar, Anda menyetujui bahwa data Anda akan disimpan dan digunakan untuk keperluan informasi program Cohort serta pengembangan materi belajar. Data Anda aman dan tidak akan dibagikan ke pihak ketiga.'
                : 'By registering, you agree that your data will be stored and used for Cohort program information and learning material development. Your data is safe and will not be shared with third parties.'
              }
            </p>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { User, Mail, Lock, Shield, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function RegisterView() {
  const { registerUser, setView } = useAppStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast.error('Mohon lengkapi semua field pendaftaran')
      return
    }

    setIsSubmitting(true)
    try {
      const success = await registerUser(name.trim(), email.trim().toLowerCase(), password)
      if (success) {
        toast.success(`Akun ${name} berhasil dibuat! Selamat menjelajah. ✦`)
      } else {
        toast.error('Alamat email sudah terdaftar. Silakan login.')
      }
    } catch {
      toast.error('Terjadi kesalahan saat pendaftaran.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="nv-auth-container">
      <div className="nv-hero-bg" />
      <div className="nv-orb nv-orb-1" />
      <div className="nv-orb nv-orb-2" />

      <motion.div 
        className="nv-auth-card nv-premium-glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button 
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white bg-transparent border-none cursor-pointer"
          onClick={() => setView('landing')}
        >
          <ArrowLeft size={12} /> Kembali
        </button>

        <div className="text-center mt-4">
          <div className="nv-auth-logo-badge">
            <Shield size={24} />
          </div>
          <h2 className="nv-auth-title text-xl font-bold text-[#e8e4dc] m-0 mt-3">Daftar Akun Baru</h2>
          <p className="text-xs text-neutral-400 m-0 mt-1.5">Mulai perjalanan pembelajaran terstruktur Anda hari ini.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="nv-auth-input-group">
            <label className="nv-modal-label">NAMA LENGKAP</label>
            <div className="nv-auth-input-wrapper">
              <User size={16} className="nv-auth-input-icon" />
              <input
                type="text"
                required
                placeholder="Nama panggilan Anda"
                className="nv-auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="nv-auth-input-group">
            <label className="nv-modal-label">ALAMAT EMAIL</label>
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

          <div className="nv-auth-input-group">
            <label className="nv-modal-label">PASSWORD</label>
            <div className="nv-auth-input-wrapper">
              <Lock size={16} className="nv-auth-input-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="nv-auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {isSubmitting ? 'Memproses...' : 'Daftar Sekarang'}
          </motion.button>
        </form>

        <div className="nv-auth-switch-link mt-2">
          Sudah punya akun? 
          <button onClick={() => setView('login')}>Masuk Di Sini</button>
        </div>
      </motion.div>
    </div>
  )
}

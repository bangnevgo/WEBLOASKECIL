'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Shield, Mail, Lock, Key, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function LoginView() {
  const { login, setView } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Mohon isi email dan password Anda')
      return
    }

    setIsSubmitting(true)
    try {
      const success = await login(email.trim().toLowerCase(), password)
      if (success) {
        toast.success('Selamat datang kembali! Akses dasbor terbuka. ✦')
      } else {
        toast.error('Email tidak terdaftar atau password salah.')
      }
    } catch {
      toast.error('Terjadi kesalahan saat masuk.')
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
          <h2 className="nv-auth-title text-xl font-bold text-[#e8e4dc] m-0 mt-3">Masuk ke Dasbor</h2>
          <p className="text-xs text-neutral-400 m-0 mt-1.5">Masuk untuk melanjutkan kurikulum dan meditasi Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
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
            {isSubmitting ? 'Memproses...' : 'Masuk Sekarang'}
          </motion.button>
        </form>

        <div className="nv-auth-switch-link mt-2">
          Belum punya akun? 
          <button onClick={() => setView('register')}>Daftar Baru</button>
        </div>
      </motion.div>
    </div>
  )
}

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { X, Check, Lock, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

const ADMIN_PASSWORD = 'neville2222'

export default function AdminLoginModal({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { setView } = useAppStore()
  const [password, setPassword] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    if (!password.trim()) {
      setError('Password tidak boleh kosong')
      return
    }

    setIsChecking(true)
    setError(null)

    try {
      // Simple password check - in a real app this would be more secure
      if (password === ADMIN_PASSWORD) {
        toast.success('Password benar! Mengakses panel admin...')
        setView('admin')
        onLoginSuccess()
      } else {
        setError('Password salah. Silakan coba lagi.')
        toast.error('Password salah')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      toast.error('Gagal memverifikasi password')
    } finally {
      setIsChecking(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
    if (e.key === 'Escape') {
      setView('landing')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="nv-admin-login-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={e => {
          // Only close if clicking on overlay, not on modal content
          if (e.target === e.currentTarget) {
            setView('landing')
          }
        }}
      >
        <motion.div
          className="nv-admin-login-modal nv-glass"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <button className="nv-admin-login-close" onClick={() => setView('landing')}>
            <X style={{ width: 20, height: 20 }} />
          </button>

          <div className="nv-admin-lock-icon">🔐</div>
          <h3 className="nv-admin-login-title">Panel Admin</h3>
          <p className="nv-admin-login-desc">Masukkan password untuk mengakses panel admin</p>

          {error && (
            <p className="nv-admin-login-error">{error}</p>
          )}

          <div className="nv-admin-login-input-group">
            <label className="nv-admin-login-label">PASSWORD</label>
            <div className="nv-admin-login-input-wrapper">
              <Lock style={{ position: 'absolute', left: 12, width: 16, height: 16, opacity: 0.7 }} />
              <input
                className="nv-admin-login-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <motion.button
            className={`nv-admin-login-button nv-cta-button ${isChecking ? 'nv-admin-login-button-loading' : ''}`}
            onClick={handleLogin}
            disabled={isChecking}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isChecking ? (
              <>
                <RefreshCw style={{ width: 16, height: 16 }} className="nv-spin" />
                Memeriksa...
              </>
            ) : (
              <>
                <Check style={{ width: 16, height: 16 }} />
                Masuk
              </>
            )}
          </motion.button>

          <p className="nv-admin-login-hint">
            Hint: Password adalah kombinasi nama dan angka yang spesifik
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
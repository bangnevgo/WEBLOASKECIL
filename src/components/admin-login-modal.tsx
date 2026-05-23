'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, X } from 'lucide-react'

const ADMIN_PASSWORD = 'admin123'

export default function AdminLoginModal({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [show, setShow] = useState(true)

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setError(false)
      setShow(false)
      onLoginSuccess()
    } else {
      setError(true)
    }
  }

  const handleClose = () => {
    setShow(false)
  }

  if (!show) return null

  return (
    <motion.div
      className="nv-locked-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        className="nv-locked-modal"
        style={{ maxWidth: 400, textAlign: 'center' }}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="nv-locked-close" onClick={handleClose}>✕</button>

        <div style={{ fontSize: 48, marginBottom: 12 }}>
          <Shield size={48} style={{ color: 'var(--nv-gold)' }} />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px', color: 'var(--nv-gold)' }}>
          Admin Login
        </h3>
        <p style={{ fontSize: 14, color: 'var(--nv-muted)', marginBottom: 20 }}>
          Masukkan password admin untuk mengakses panel
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false) }}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Password"
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 12,
            border: error ? '1px solid #ef4444' : '1px solid var(--nv-glass)',
            background: 'var(--nv-bg)',
            color: 'var(--nv-text)',
            fontSize: 16,
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: error ? 4 : 16,
          }}
          autoFocus
        />
        {error && (
          <p style={{ color: '#ef4444', fontSize: 13, margin: '0 0 16px', textAlign: 'left' }}>
            Password salah. Coba lagi.
          </p>
        )}

        <motion.button
          className="nv-cta-button nv-cta-pulse"
          onClick={handleLogin}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          style={{ width: '100%' }}
        >
          <Shield size={16} />
          Login
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

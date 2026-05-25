'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Key, Plus, Copy, RefreshCw, X, ArrowLeft, Check } from 'lucide-react'
import { toast } from 'sonner'

interface ActivationCodeEntry {
  id: string
  code: string
  tier: string
  used: boolean
  usedBy: string | null
  usedAt: string | null
  createdAt: string
}

interface Stats {
  total: number
  used: number
  available: number
  basic: number
  master: number
}

const ADMIN_SECRET = 'neville'

export default function AdminPanel() {
  const { setView, isAdmin } = useAppStore()

  // Check if user has admin access
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🔒 Akses Ditolak</h1>
          <p className="text-muted mb-4">Anda tidak memiliki akses ke panel admin</p>
          <button
            onClick={() => setView('landing')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }
  const [codes, setCodes] = useState<ActivationCodeEntry[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateTier, setGenerateTier] = useState<'basic' | 'master'>('basic')
  const [generateCount, setGenerateCount] = useState(5)
  const [newlyGenerated, setNewlyGenerated] = useState<string[]>([])
  const [filter, setFilter] = useState<'all' | 'available' | 'used'>('all')

  const fetchCodes = useCallback(async () => {
    try {
      const res = await fetch('/api/activation/list', {
        headers: { 'x-admin-key': ADMIN_SECRET },
      })
      const data = await res.json()
      if (res.ok) {
        setCodes(data.codes)
        setStats(data.stats)
      }
    } catch {
      toast('Gagal memuat data kode aktivasi')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCodes()
  }, [fetchCodes])

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/activation/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminKey: ADMIN_SECRET,
          tier: generateTier,
          count: generateCount,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setNewlyGenerated(data.codes)
        toast(`✦ ${data.codes.length} kode ${generateTier} berhasil dibuat!`)
        fetchCodes()
      } else {
        toast(data.error || 'Gagal membuat kode')
      }
    } catch {
      toast('Gagal membuat kode aktivasi')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast('Kode disalin ke clipboard!')
  }

  const copyAllNewCodes = () => {
    const text = newlyGenerated.join('\n')
    navigator.clipboard.writeText(text)
    toast(`${newlyGenerated.length} kode disalin ke clipboard!`)
  }

  const filteredCodes = codes.filter(c => {
    if (filter === 'available') return !c.used
    if (filter === 'used') return c.used
    return true
  })

  return (
    <div className="nv-admin-page">
      {/* Header */}
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
          <ArrowLeft style={{ width: 14, height: 14 }} />
          Kembali ke Beranda
        </motion.button>
        <div className="nv-pricing-header-text">
          <h1 className="nv-pricing-title">🔐 Panel Admin</h1>
          <p className="nv-pricing-subtitle">
            Kelola kode aktivasi untuk pelanggan
          </p>
        </div>
      </motion.header>

      {/* Stats Cards */}
      {stats && (
        <div className="nv-admin-stats">
          <div className="nv-admin-stat-card nv-glass">
            <span className="nv-admin-stat-num">{stats.total}</span>
            <span className="nv-admin-stat-label">Total Kode</span>
          </div>
          <div className="nv-admin-stat-card nv-glass">
            <span className="nv-admin-stat-num nv-admin-stat-available">{stats.available}</span>
            <span className="nv-admin-stat-label">Tersedia</span>
          </div>
          <div className="nv-admin-stat-card nv-glass">
            <span className="nv-admin-stat-num nv-admin-stat-used">{stats.used}</span>
            <span className="nv-admin-stat-label">Digunakan</span>
          </div>
          <div className="nv-admin-stat-card nv-glass">
            <span className="nv-admin-stat-num">{stats.basic}</span>
            <span className="nv-admin-stat-label">Basic</span>
          </div>
          <div className="nv-admin-stat-card nv-glass">
            <span className="nv-admin-stat-num">{stats.master}</span>
            <span className="nv-admin-stat-label">Master</span>
          </div>
        </div>
      )}

      {/* Generate Section */}
      <div className="nv-admin-generate nv-glass">
        <h3 className="nv-admin-section-title">
          <Key style={{ width: 18, height: 18 }} />
          Generate Kode Baru
        </h3>
        <p className="nv-admin-section-desc">
          Buat kode aktivasi yang bisa ditempatkan di halaman &quot;Terima Kasih&quot; Lynk.id sebagai konten digital
        </p>
        <div className="nv-admin-generate-form">
          <div className="nv-admin-generate-field">
            <label className="nv-modal-label">PAKET</label>
            <div className="nv-admin-tier-toggle">
              <button
                className={`nv-admin-tier-btn ${generateTier === 'basic' ? 'nv-admin-tier-btn-active' : ''}`}
                onClick={() => setGenerateTier('basic')}
              >
                Basic (Rp 99K)
              </button>
              <button
                className={`nv-admin-tier-btn ${generateTier === 'master' ? 'nv-admin-tier-btn-active' : ''}`}
                onClick={() => setGenerateTier('master')}
              >
                Master (Rp 299K)
              </button>
            </div>
          </div>
          <div className="nv-admin-generate-field">
            <label className="nv-modal-label">JUMLAH</label>
            <input
              type="number"
              className="nv-modal-input"
              min={1}
              max={50}
              value={generateCount}
              onChange={(e) => setGenerateCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
            />
          </div>
          <motion.button
            className="nv-cta-button"
            onClick={handleGenerate}
            disabled={isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{ opacity: isGenerating ? 0.7 : 1 }}
          >
            {isGenerating ? (
              <>
                <RefreshCw style={{ width: 16, height: 16 }} className="nv-spin" />
                Membuat...
              </>
            ) : (
              <>
                <Plus style={{ width: 16, height: 16 }} />
                Generate {generateCount} Kode
              </>
            )}
          </motion.button>
        </div>

        {/* Newly generated codes */}
        <AnimatePresence>
          {newlyGenerated.length > 0 && (
            <motion.div
              className="nv-admin-new-codes"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="nv-admin-new-codes-header">
                <span className="nv-admin-new-codes-title">✦ {newlyGenerated.length} Kode Baru</span>
                <button className="nv-admin-copy-all-btn" onClick={copyAllNewCodes}>
                  <Copy style={{ width: 14, height: 14 }} />
                  Salin Semua
                </button>
              </div>
              <div className="nv-admin-codes-list">
                {newlyGenerated.map((code, i) => (
                  <div key={i} className="nv-admin-code-item nv-admin-code-new">
                    <span className="nv-admin-code-text">{code}</span>
                    <button
                      className="nv-admin-code-copy"
                      onClick={() => copyToClipboard(code)}
                      title="Salin kode"
                    >
                      <Copy style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="nv-admin-lynk-hint">
                💡 Salin kode-kode ini dan tempelkan sebagai &quot;Konten Digital&quot; di halaman Lynk.id Anda.
                Setiap pembeli akan mendapat 1 kode unik.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* All Codes Section */}
      <div className="nv-admin-all-codes-section">
        <div className="nv-admin-all-codes-header">
          <h3 className="nv-admin-section-title">Semua Kode Aktivasi</h3>
          <div className="nv-admin-filter-group">
            {(['all', 'available', 'used'] as const).map((f) => (
              <button
                key={f}
                className={`nv-admin-filter-btn ${filter === f ? 'nv-admin-filter-btn-active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'Semua' : f === 'available' ? 'Tersedia' : 'Digunakan'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="nv-admin-loading">Memuat data...</div>
        ) : filteredCodes.length === 0 ? (
          <div className="nv-admin-empty">Belum ada kode aktivasi</div>
        ) : (
          <div className="nv-admin-codes-list nv-admin-codes-list-all">
            {filteredCodes.map((entry) => (
              <div
                key={entry.id}
                className={`nv-admin-code-item ${entry.used ? 'nv-admin-code-used' : 'nv-admin-code-available'}`}
              >
                <div className="nv-admin-code-left">
                  <span className="nv-admin-code-text">{entry.code}</span>
                  <span className={`nv-admin-code-tier nv-admin-code-tier-${entry.tier}`}>
                    {entry.tier.toUpperCase()}
                  </span>
                </div>
                <div className="nv-admin-code-right">
                  {entry.used ? (
                    <span className="nv-admin-code-status nv-admin-code-status-used">
                      <Check style={{ width: 12, height: 12 }} />
                      {entry.usedBy || 'Digunakan'}
                    </span>
                  ) : (
                    <button
                      className="nv-admin-code-copy"
                      onClick={() => copyToClipboard(entry.code)}
                      title="Salin kode"
                    >
                      <Copy style={{ width: 14, height: 14 }} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

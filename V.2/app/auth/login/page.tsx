'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { ArrowRight, Sparkles, Eye, EyeOff, X } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!data.success) {
        toast({
          variant: 'destructive',
          title: 'Login Gagal',
          description: data.error || 'Terjadi kesalahan',
        })
        return
      }

      toast({
        title: 'Login Berhasil',
        description: `Selamat datang, ${data.data.user.name}!`,
      })

      router.push('/dashboard')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Terjadi kesalahan koneksi',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/30 to-primary/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
            aria-label="Tutup dan kembali ke beranda"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg animate-pulse"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">HA</span>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Hukum Asumsi
                </h1>
                <p className="text-sm text-foreground/60 mt-2">
                  Lanjutkan perjalanan spiritual Anda
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="anda@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg h-11 px-4 text-foreground placeholder:text-foreground/40 focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-foreground">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-primary hover:text-primary/80 transition font-medium"
                  >
                    Lupa?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg h-11 px-4 pr-11 text-foreground placeholder:text-foreground/40 focus:border-primary/50 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground/80 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-white font-semibold text-base transition-all duration-300 group"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Masuk
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
              <span className="text-xs text-foreground/50">atau</span>
              <div className="flex-1 h-px bg-gradient-to-l from-white/20 to-transparent"></div>
            </div>

            {/* Register Link */}
            <div className="text-center space-y-3">
              <p className="text-sm text-foreground/70">
                Belum punya akun?{' '}
                <Link
                  href="/auth/register"
                  className="text-primary hover:text-primary/80 font-semibold transition"
                >
                  Daftar gratis
                </Link>
              </p>
              <p className="text-xs text-foreground/50">
                Dapatkan akses instan ke seluruh kurikulum kami
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2 text-xs text-foreground/50">
          <p>Platform pembelajaran Neville Goddard yang dipercaya</p>
          <p className="flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-primary" />
            Transformasi dimulai dari sini
          </p>
        </div>
      </div>
    </div>
  )
}

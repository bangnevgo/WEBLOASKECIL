'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Users, Award, Clock, Sparkles, TrendingUp, Target, Zap } from 'lucide-react'

interface UserStats {
  total_courses_enrolled: number
  total_courses_completed: number
  total_learning_minutes: number
  total_lessons_completed: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/profile')
        const data = await response.json()
        if (data.success) {
          setUserName(data.data.user.name)
        }
      } catch (error) {
        console.log('[v0] Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/10 border border-primary/20 p-8 md:p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/30 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold text-primary">Selamat datang kembali</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Halo, {userName || 'Pelajar'}! 👋
          </h1>
          <p className="text-lg text-foreground/70 mb-6">
            Lanjutkan perjalanan transformasi spiritual Anda. Setiap langkah membawa Anda lebih dekat ke kesadaran sejati.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/courses">
              <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-white font-semibold gap-2">
                <BookOpen className="w-4 h-4" />
                Lanjutkan Belajar
              </Button>
            </Link>
            <Link href="/dashboard/recommendations">
              <Button variant="outline" className="font-semibold gap-2 backdrop-blur-sm border-white/20">
                <Zap className="w-4 h-4" />
                Rekomendasi AI
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: BookOpen,
            label: 'Kursus Diambil',
            value: stats?.total_courses_enrolled || 0,
            gradient: 'from-blue-500 to-cyan-500'
          },
          {
            icon: Award,
            label: 'Kursus Selesai',
            value: stats?.total_courses_completed || 0,
            gradient: 'from-green-500 to-emerald-500'
          },
          {
            icon: Clock,
            label: 'Jam Belajar',
            value: stats ? Math.floor(stats.total_learning_minutes / 60) : 0,
            gradient: 'from-purple-500 to-pink-500'
          },
          {
            icon: TrendingUp,
            label: 'Pelajaran Selesai',
            value: stats?.total_lessons_completed || 0,
            gradient: 'from-orange-500 to-red-500'
          },
        ].map((stat, i) => (
          <div key={i} className="group rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-6 hover:border-white/40 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-foreground/70 font-medium">{stat.label}</p>
                <p className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Aksi Cepat
            </h2>
            <div className="space-y-2">
              <Link href="/dashboard/courses" className="block">
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-white font-semibold justify-start gap-2">
                  <BookOpen className="w-4 h-4" />
                  Jelajahi Kursus
                </Button>
              </Link>
              <Link href="/dashboard/forum" className="block">
                <Button variant="outline" className="w-full font-semibold justify-start gap-2 backdrop-blur-sm border-white/20 hover:bg-white/10">
                  <Users className="w-4 h-4" />
                  Komunitas Forum
                </Button>
              </Link>
              <Link href="/dashboard/classes" className="block">
                <Button variant="outline" className="w-full font-semibold justify-start gap-2 backdrop-blur-sm border-white/20 hover:bg-white/10">
                  <Clock className="w-4 h-4" />
                  Kelas Langsung
                </Button>
              </Link>
            </div>
          </div>

          {/* Progress Card */}
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Target Bulan Ini
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground/70">Pelajaran Selesai</span>
                  <span className="text-sm font-semibold text-primary">45%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[45%] bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground/70">Forum Aktif</span>
                  <span className="text-sm font-semibold text-accent">68%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[68%] bg-gradient-to-r from-accent to-primary rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Featured */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Content */}
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Panduan Memulai
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  number: '1',
                  title: 'Mulai dengan Dasar',
                  desc: 'Pelajari fondasi Hukum Asumsi',
                },
                {
                  number: '2',
                  title: 'Bergabung Forum',
                  desc: 'Diskusi dengan komunitas global',
                },
                {
                  number: '3',
                  title: 'Kelas Langsung',
                  desc: 'Interaksi dengan instruktur',
                },
                {
                  number: '4',
                  title: 'Terapkan Ilmu',
                  desc: 'Praktekkan setiap hari',
                },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/30 transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent text-white font-bold text-sm flex-shrink-0">
                      {item.number}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                      <p className="text-xs text-foreground/60 mt-1">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivation Card */}
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl border border-primary/30 p-6">
            <p className="text-lg font-semibold text-foreground leading-relaxed italic">
              "Setiap hari adalah kesempatan baru untuk mengasumsikan siapa yang ingin Anda menjadi. Transformasi dimulai dari pikiran Anda."
            </p>
            <p className="text-sm text-foreground/70 mt-4">— Neville Goddard</p>
          </div>
        </div>
      </div>
    </div>
  )
}

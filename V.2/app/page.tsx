'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Users, Zap, Award, Sparkles, Brain, Rocket, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Page() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <main className="w-full overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary via-accent to-primary rounded-lg flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-white font-bold text-sm relative z-10">HA</span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:inline">Hukum Asumsi</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm text-foreground/70 hover:text-primary transition duration-300 font-medium">
              Masuk
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-white font-semibold transition-all duration-300 gap-2">
                Daftar <Sparkles className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/hero-bg.jpg)',
            backgroundAttachment: 'fixed'
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/80"></div>

        {/* Animated overlay elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/15 rounded-full blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-gradient-to-tr from-accent/20 to-primary/15 rounded-full blur-3xl opacity-40 animate-pulse delay-700"></div>
        </div>

        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 py-20">
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Mulai Perjalanan Spiritual Anda</span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="text-balance text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-4">
                Kuasai <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                  Hukum Asumsi
                </span>
              </h1>
              <p className="text-balance text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed font-light">
                Transformasikan realitas dengan ajaran Neville Goddard. Kuasai kekuatan kesadaran melalui kurikulum mendalam, mentor berpengalaman, dan komunitas global yang mendukung perjalanan spiritual Anda.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/register">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/50 text-white font-bold text-base gap-2 transition-all duration-300 group">
                Mulai Belajar Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-base font-semibold backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                Lihat Fitur
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-12 max-w-2xl mx-auto">
            {[
              { label: '10,000+', desc: 'Pelajar Aktif' },
              { label: '49', desc: 'Pelajaran Lengkap' },
              { label: '95%', desc: 'Tingkat Kepuasan' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-colors">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.label}</div>
                <div className="text-xs text-foreground/60 mt-1">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Fitur Unggulan</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">Pembelajaran yang Dirancang untuk Kesuksesan</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-light">Platform pembelajaran komprehensif dengan tools modern untuk menguasai filosofi Neville Goddard</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: '49 Pelajaran Premium',
                description: 'Kurikulum terstruktur dalam 10 bagian yang dirancang untuk transformasi mendalam',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Zap,
                title: 'Pembelajaran Interaktif',
                description: 'Video berkualitas tinggi, quiz menarik, dan materi yang engaging untuk memaksimalkan pembelajaran',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Users,
                title: 'Komunitas Forum Global',
                description: 'Diskusi mendalam dengan pelajar dan mentor berpengalaman dari seluruh dunia',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: Award,
                title: 'Sertifikat Resmi',
                description: 'Dapatkan sertifikat yang diakui setelah menyelesaikan setiap kursus',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: Brain,
                title: 'AI Tutor Personal',
                description: 'Mentor AI yang memahami kebutuhan belajar Anda dan memberikan saran personal',
                gradient: 'from-indigo-500 to-purple-500'
              },
              {
                icon: Rocket,
                title: 'Live Classes Mingguan',
                description: 'Sesi pembelajaran langsung dengan instruktur ahli dan Q&A interaktif',
                gradient: 'from-red-500 to-pink-500'
              },
              {
                icon: TrendingUp,
                title: 'Progress Tracking',
                description: 'Pantau perjalanan belajar Anda dengan analitik detail dan rekomendasi personal',
                gradient: 'from-teal-500 to-cyan-500'
              },
              {
                icon: Sparkles,
                title: 'Materi Eksklusif',
                description: 'Akses ke materi bonus, webinar eksklusif, dan jurnal pembelajaran interaktif',
                gradient: 'from-amber-500 to-orange-500'
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                <div className="relative z-10 space-y-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-foreground/60 text-sm leading-relaxed mt-2">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview Section - Content First Approach */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <span className="text-sm font-semibold text-primary">Jelajahi Materi</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">Kurikulum Lengkap Kami</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">49 pelajaran komprehensif dalam 10 bagian, dirancang untuk transformasi spiritual mendalam</p>
          </div>

          {/* Featured Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                part: 'Bagian 1',
                title: 'Pengenalan Hukum Asumsi',
                description: 'Pahami fondasi dasar dari Hukum Asumsi dan konsep kesadaran menurut Neville Goddard',
                lessons: 5,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                part: 'Bagian 2',
                title: 'Kesadaran dan Realitas',
                description: 'Pelajari hubungan intim antara kesadaran dan manifestasi realitas fisik Anda',
                lessons: 6,
                color: 'from-purple-500 to-pink-500'
              },
              {
                part: 'Bagian 3',
                title: 'Imajinasi Kreatif',
                description: 'Kuasai kekuatan imajinasi sebagai alat paling kuat untuk menciptakan realitas',
                lessons: 5,
                color: 'from-orange-500 to-red-500'
              },
              {
                part: 'Bagian 4',
                title: 'Mengasumsikan Keadaan',
                description: 'Teknik praktis untuk mengasumsikan keadaan yang diinginkan dan merasakan realitasnya',
                lessons: 6,
                color: 'from-green-500 to-emerald-500'
              },
              {
                part: 'Bagian 5',
                title: 'Tidur dan Mimpi',
                description: 'Manfaatkan kekuatan tidur dan mimpi untuk pemrograman kesadaran yang efektif',
                lessons: 4,
                color: 'from-indigo-500 to-purple-500'
              },
              {
                part: 'Bagian 6',
                title: 'Kepercayaan Diri Sejati',
                description: 'Bangun kepercayaan diri yang timbul dari pemahaman mendalam tentang diri sejati',
                lessons: 5,
                color: 'from-rose-500 to-pink-500'
              },
            ].map((course, i) => (
              <div key={i} className="group relative rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-6 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
                {/* Gradient top accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${course.color}`}></div>
                
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${course.color} text-white`}>
                      {course.part}
                    </span>
                    <span className="text-xs font-semibold text-primary">{course.lessons} Pelajaran</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">{course.description}</p>
                  <div className="pt-3">
                    <button className="text-sm font-semibold text-primary group-hover:gap-2 flex items-center gap-1 transition-all">
                      Lihat Pelajaran
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Highlight */}
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl border border-primary/30 p-8 text-center space-y-4">
            <p className="text-lg font-semibold text-foreground">Semua materi langsung bisa diakses tanpa perlu menonton gimmick-gimmick berlebihan</p>
            <p className="text-foreground/70">Pembelajaran praktis dengan konten berkualitas tinggi yang langsung bisa diterapkan dalam hidup Anda</p>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">Struktur Pembelajaran yang Terstruktur</h2>
            <p className="text-lg text-foreground/70">Dari pemula hingga mahir dalam urutan yang logis dan efektif</p>
          </div>

          <div className="space-y-6">
            {[
              { step: 1, title: 'Fondasi Konsep', desc: 'Pahami prinsip dasar Hukum Asumsi', status: 'Mulai di sini' },
              { step: 2, title: 'Praktek Dasar', desc: 'Coba teknik sederhana dalam kehidupan sehari-hari', status: 'Bangun Kebiasaan' },
              { step: 3, title: 'Pendalaman', desc: 'Eksplorasi konsep lebih dalam dan aplikasi kompleks', status: 'Tingkatkan Level' },
              { step: 4, title: 'Transformasi Nyata', desc: 'Lihat hasil konkret dan bagikan pengalaman Anda', status: 'Capai Tujuan' },
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.step}
                  </div>
                  {i < 3 && <div className="w-1 h-12 bg-gradient-to-b from-primary/50 to-accent/30 mt-2"></div>}
                </div>
                <div className="pb-6 pt-2 flex-1">
                  <div className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 p-6 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                      <span className="text-xs font-semibold text-primary bg-primary/20 px-3 py-1 rounded-full">{item.status}</span>
                    </div>
                    <p className="text-foreground/70">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/50 text-white font-bold">
                Mulai Perjalanan Anda Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Apa Kata Pelajar Kami?</h2>
            <p className="text-lg text-foreground/70">Ribuan orang telah mengubah hidup mereka dengan platform kami</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Mahmud',
                role: 'Entrepreneur',
                text: 'Platform ini benar-benar mengubah cara saya berpikir. Hasilnya luar biasa!'
              },
              {
                name: 'Budi Santoso',
                role: 'Profesional Muda',
                text: 'Materi sangat mendalam dan komunitas sangat supportive. Highly recommended!'
              },
              {
                name: 'Dewi Putri',
                role: 'Content Creator',
                text: 'Saya sudah melihat perubahan nyata dalam hidup saya. Terima kasih Hukum Asumsi!'
              },
            ].map((testimonial, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-primary/30 transition-all duration-300">
                <p className="text-foreground/80 italic mb-4">{testimonial.text}</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-foreground/60">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.2),transparent_50%)]"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-foreground">Siap Bertransformasi?</h2>
            <p className="text-xl text-foreground/70 font-light">Gabung dengan ribuan pelajar yang telah menemukan kekuatan sejati mereka</p>
          </div>
          <Link href="/auth/register">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/50 text-white font-bold text-base gap-2 transition-all duration-300 group px-8">
              Mulai Gratis Hari Ini
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>
          </Link>
          <p className="text-sm text-foreground/60">Tidak perlu kartu kredit • Akses instan • Komunitas 24/7</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8 bg-background/50 backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">HA</span>
                </div>
                <span className="font-bold text-foreground">Hukum Asumsi</span>
              </div>
              <p className="text-sm text-foreground/60">Platform pembelajaran untuk menguasai hukum asumsi Neville Goddard</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-4">Produk</p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="#features" className="hover:text-primary transition">Fitur</Link></li>
                <li><Link href="#features" className="hover:text-primary transition">Harga</Link></li>
                <li><Link href="#features" className="hover:text-primary transition">Blog</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-4">Perusahaan</p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="#" className="hover:text-primary transition">Tentang</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Kontak</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Karir</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-4">Legal</p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="#" className="hover:text-primary transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 text-center text-foreground/60 text-sm">
            <p>&copy; 2024 Hukum Asumsi. Transforming lives through consciousness.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

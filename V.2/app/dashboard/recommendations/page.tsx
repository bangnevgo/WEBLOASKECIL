'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Star, Zap, BookOpen, Video, Clock, ArrowRight } from 'lucide-react'

interface Recommendation {
  id: string
  type: 'course' | 'lesson' | 'live_session' | 'resource'
  title: string
  description: string
  reason: string
  relevance_score: number
  target_id: string
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/ai/recommendations')
        const data = await response.json()

        if (data.success) {
          setRecommendations(data.data.recommendations)
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Gagal memuat rekomendasi',
          })
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Terjadi kesalahan',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [toast])

  const getIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-5 h-5" />
      case 'live_session':
        return <Video className="w-5 h-5" />
      case 'lesson':
        return <Clock className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      course: 'Kursus',
      lesson: 'Pelajaran',
      live_session: 'Sesi Langsung',
      resource: 'Sumber Daya',
    }
    return labels[type] || type
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      course: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      lesson: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
      live_session: 'bg-green-500/10 text-green-700 dark:text-green-400',
      resource: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    }
    return colors[type] || 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <p className="text-muted-foreground">Memuat rekomendasi...</p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rekomendasi untuk Anda</h1>
        <p className="text-muted-foreground">
          Konten yang dipersonalisasi berdasarkan progress pembelajaran Anda
        </p>
      </div>

      {/* Recommendations Grid */}
      {recommendations.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {recommendations.map((rec) => (
            <Card
              key={rec.id}
              className="border-border hover:border-primary/50 transition-all cursor-pointer group"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(rec.type)}>
                        {getTypeLabel(rec.type)}
                      </Badge>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4"
                            fill={
                              i < Math.round(rec.relevance_score * 5)
                                ? 'currentColor'
                                : 'none'
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {rec.title}
                    </CardTitle>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    {getIcon(rec.type)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground">{rec.description}</p>

                <div className="bg-muted/50 border border-border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Mengapa rekomendasi ini?</p>
                  <p className="text-sm text-foreground">{rec.reason}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${rec.relevance_score * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {Math.round(rec.relevance_score * 100)}%
                  </span>
                </div>

                <Link
                  href={`/dashboard/courses/${rec.target_id}`}
                  className="inline-block"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 gap-2 group">
                    Lihat {getTypeLabel(rec.type)}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent className="pt-12 text-center pb-12">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Mulai belajar terlebih dahulu</h3>
            <p className="text-muted-foreground mb-6">
              Lanjutkan pembelajaran Anda untuk mendapatkan rekomendasi personal yang disesuaikan
            </p>
            <Link href="/dashboard/courses">
              <Button className="bg-primary hover:bg-primary/90">
                Jelajahi Kursus
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* AI Tips */}
      <Card className="border-border mt-8 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Tips Belajar dari AI Tutor Anda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-3">
              <span className="text-primary font-bold">1.</span>
              <span>Konsistensi adalah kunci - belajar setiap hari untuk hasil maksimal</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">2.</span>
              <span>Ikuti sesi live untuk interaksi langsung dengan mentor berpengalaman</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">3.</span>
              <span>Bergabung dengan komunitas forum untuk berbagi pengalaman dengan pelajar lain</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">4.</span>
              <span>Gunakan AI tutor kapan saja untuk menjawab pertanyaan dan mendapat bimbingan</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

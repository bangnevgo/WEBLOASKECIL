'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Play, CheckCircle2, Clock, BookOpen } from 'lucide-react'
import type { Lesson, Course } from '@/lib/types/api'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [watchedDuration, setWatchedDuration] = useState(0)
  const { toast } = useToast()

  const courseSlug = params.slug as string
  const lessonSlug = params.lessonSlug as string

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await fetch(`/api/courses/${courseSlug}`)
        const data = await response.json()

        if (data.success) {
          setCourse(data.data.course)
          setLessons(data.data.lessons)

          const currentLesson = data.data.lessons.find(
            (l: Lesson) => l.slug === lessonSlug
          )
          setLesson(currentLesson || null)
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Gagal memuat pelajaran',
          })
          router.push('/dashboard/courses')
        }
      } catch (error) {
        console.log('[v0] Error fetching lesson:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Terjadi kesalahan',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLessonData()
  }, [courseSlug, lessonSlug, router, toast])

  const handleMarkComplete = async () => {
    try {
      // TODO: Implement progress API endpoint
      setCompleted(true)
      toast({
        title: 'Selesai!',
        description: 'Pelajaran ditandai sebagai selesai',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menyimpan progress',
      })
    }
  }

  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug)
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <p className="text-muted-foreground">Memuat pelajaran...</p>
      </div>
    )
  }

  if (!course || !lesson) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <p className="text-muted-foreground">Pelajaran tidak ditemukan</p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <Link href={`/dashboard/courses/${courseSlug}`}>
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke {course.title}
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <Card className="border-border overflow-hidden">
            <div className="w-full bg-black relative pb-[56.25%] overflow-hidden">
              {lesson.video_url ? (
                <video
                  src={lesson.video_url}
                  controls
                  className="absolute inset-0 w-full h-full"
                  onTimeUpdate={(e) => setWatchedDuration(e.currentTarget.currentTime)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-primary mx-auto mb-2" />
                    <p className="text-foreground">Video tidak tersedia</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Lesson Info */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl mb-2">{lesson.title}</CardTitle>
                  <CardDescription className="text-base">
                    {lesson.description}
                  </CardDescription>
                </div>
                {completed && (
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Selesai
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {lesson.video_duration && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Durasi: {Math.ceil(lesson.video_duration / 60)} menit</span>
                </div>
              )}

              {lesson.content && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-foreground whitespace-pre-wrap">{lesson.content}</p>
                </div>
              )}

              {!completed && (
                <Button
                  onClick={handleMarkComplete}
                  className="w-full bg-primary hover:bg-primary/90 gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Tandai Sebagai Selesai
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-3">
            {prevLesson && (
              <Link href={`/dashboard/courses/${courseSlug}/${prevLesson.slug}`} className="flex-1">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </Button>
              </Link>
            )}
            {nextLesson && (
              <Link href={`/dashboard/courses/${courseSlug}/${nextLesson.slug}`} className="flex-1">
                <Button className="w-full justify-end gap-2 bg-primary hover:bg-primary/90">
                  <span>Berikutnya</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {course.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Pelajaran {currentIndex + 1} dari {lessons.length}</p>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lessons List */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Pelajaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {lessons.map((l, idx) => (
                <Link
                  key={l.id}
                  href={`/dashboard/courses/${courseSlug}/${l.slug}`}
                  className={`block p-3 rounded-lg border transition-all ${
                    l.slug === lessonSlug
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted'
                  }`}
                >
                  <p className="text-sm font-medium">
                    {idx + 1}. {l.title}
                  </p>
                  {l.video_duration && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.ceil(l.video_duration / 60)} min
                    </p>
                  )}
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

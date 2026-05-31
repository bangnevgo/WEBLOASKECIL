'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, BookOpen, Clock, Users } from 'lucide-react'
import type { Course } from '@/lib/types/api'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses')
        const data = await response.json()
        if (data.success) {
          setCourses(data.data.courses)
        }
      } catch (error) {
        console.log('[v0] Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Kursus</h1>
        <p className="text-muted-foreground text-lg">
          Jelajahi berbagai kursus tentang Hukum Asumsi
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Cari kursus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-border"
          />
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Memuat kursus...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground text-lg">
            {searchQuery ? 'Tidak ada kursus yang sesuai' : 'Belum ada kursus'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link key={course.id} href={`/dashboard/courses/${course.slug}`}>
              <Card className="h-full border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group overflow-hidden">
                {course.thumbnail_url && (
                  <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="group-hover:text-primary transition">
                        {course.title}
                      </CardTitle>
                      {course.level && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded whitespace-nowrap">
                          {course.level}
                        </span>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {course.description || 'Pelajaran mendalam tentang Hukum Asumsi'}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.total_lessons} pelajaran</span>
                    </div>
                    {course.estimated_duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{Math.ceil(course.estimated_duration / 60)} jam</span>
                      </div>
                    )}
                  </div>
                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                    Lihat Kursus
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

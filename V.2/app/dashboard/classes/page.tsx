'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Users, Video } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function LiveClassesPage() {
  const upcomingSessions = [
    {
      id: '1',
      title: 'Teknik Visualisasi Lanjutan',
      instructor: 'Prof. Neville Academy',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      duration: 120,
      participants: 45,
      maxParticipants: 100,
      status: 'scheduled' as const,
    },
    {
      id: '2',
      title: 'Q&A Sesi dengan Mentor',
      instructor: 'Ahmad Wijaya',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      duration: 90,
      participants: 28,
      maxParticipants: 100,
      status: 'scheduled' as const,
    },
    {
      id: '3',
      title: 'Study Group: Bab 5',
      instructor: 'Komunitas Hukum Asumsi',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      duration: 60,
      participants: 15,
      maxParticipants: 50,
      status: 'scheduled' as const,
    },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Kelas Langsung</h1>
        <p className="text-muted-foreground text-lg">
          Bergabunglah dengan sesi pembelajaran interaktif
        </p>
      </div>

      {/* Live Notice */}
      <Card className="mb-6 border-accent/50 bg-accent/5">
        <CardContent className="pt-6 flex items-start gap-3">
          <Video className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-foreground mb-1">Tidak ada kelas yang sedang berlangsung</p>
            <p className="text-sm text-muted-foreground">
              Lihat jadwal di bawah dan daftarkan diri Anda untuk kelas mendatang
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['Semua', 'Teknik', 'Q&A', 'Study Group'].map((filter) => (
          <Badge
            key={filter}
            variant="outline"
            className="cursor-pointer whitespace-nowrap border-border hover:border-primary hover:bg-primary/10 transition"
          >
            {filter}
          </Badge>
        ))}
      </div>

      {/* Upcoming Classes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Jadwal Mendatang</h2>

        {upcomingSessions.map((session) => (
          <Card key={session.id} className="border-border hover:border-primary/50 hover:shadow-lg transition">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{session.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Instruktur: <span className="font-medium text-foreground">{session.instructor}</span>
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(session.date, 'EEEE, dd MMMM yyyy', { locale: id })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{format(session.date, 'HH:mm')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      <span>{session.duration} menit</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>
                        {session.participants}/{session.maxParticipants} peserta
                      </span>
                    </div>
                  </div>
                </div>

                <Button className="bg-primary hover:bg-primary/90 whitespace-nowrap">
                  Daftar Sekarang
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recording Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Rekaman Kelas Sebelumnya</h2>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada rekaman tersedia</p>
              <p className="text-sm">Rekaman kelas akan tersedia setelah sesi berakhir</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

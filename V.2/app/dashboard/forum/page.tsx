'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Plus, Search, TrendingUp } from 'lucide-react'

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Forum Diskusi</h1>
          <p className="text-muted-foreground text-lg">
            Bagikan pengalaman dan belajar dari komunitas
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Topik Baru</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Cari topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-border"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { name: 'Umum', count: 24 },
          { name: 'Teknik', count: 18 },
          { name: 'Aplikasi', count: 42 },
          { name: 'Pertanyaan', count: 31 },
        ].map((cat) => (
          <Card key={cat.name} className="border-border cursor-pointer hover:border-primary/50 hover:shadow-md transition">
            <CardContent className="pt-6">
              <p className="font-semibold text-foreground mb-1">{cat.name}</p>
              <p className="text-sm text-muted-foreground">{cat.count} diskusi</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Forum Topics List */}
      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Topik Populer
          </CardTitle>
          <CardDescription>Diskusi terbaru dari komunitas</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[
              {
                title: 'Bagaimana cara mengaplikasikan Hukum Asumsi dalam bisnis?',
                author: 'Ahmad Roni',
                replies: 12,
                views: 342,
              },
              {
                title: 'Pengalaman transformasi saya setelah 30 hari',
                author: 'Siti Nurhaliza',
                replies: 28,
                views: 658,
              },
              {
                title: 'Teknik visualisasi terbaik menurut Anda?',
                author: 'Budi Santoso',
                replies: 19,
                views: 445,
              },
              {
                title: 'Kesalahan umum yang sering dilakukan pemula',
                author: 'Dewi Lestari',
                replies: 15,
                views: 521,
              },
            ].map((topic, i) => (
              <div
                key={i}
                className="p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition mb-2">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Oleh <span className="font-medium text-foreground">{topic.author}</span>
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground whitespace-nowrap">
                    <div>
                      <p className="font-semibold text-foreground">{topic.replies}</p>
                      <p className="text-xs">balasan</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{topic.views}</p>
                      <p className="text-xs">views</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty State Info */}
      <Card className="mt-8 border-border bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <MessageSquare className="w-5 h-5" />
            Tips Berdiskusi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Bacalah topik serupa sebelum membuat pertanyaan baru</p>
          <p>• Jelaskan pertanyaan Anda sedetail mungkin</p>
          <p>• Hormati pendapat dan pengalaman anggota lain</p>
          <p>• Bagikan hasil dan pembelajaran Anda untuk menginspirasi orang lain</p>
        </CardContent>
      </Card>
    </div>
  )
}

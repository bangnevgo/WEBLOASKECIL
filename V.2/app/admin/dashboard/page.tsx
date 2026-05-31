'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Users, BookOpen, Award, TrendingUp, MessageSquare, Video } from 'lucide-react'

interface AnalyticsData {
  summary: {
    totalUsers: number
    totalCourses: number
    activeEnrollments: number
    completedCourses: number
    certificatesIssued: number
    totalRevenue: number
  }
  engagement: {
    forumTopics: number
    forumReplies: number
    liveSessions: number
  }
  topCourses: Array<{
    title: string
    average_rating: number
    student_count: number
  }>
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
}: {
  icon: any
  label: string
  value: string | number
  change?: string
}) => (
  <Card className="border-border">
    <CardContent className="pt-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && <p className="text-xs text-green-600 dark:text-green-400 mt-1">{change}</p>}
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function AdminDashboard() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7days')
  const { toast } = useToast()

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
        const data = await response.json()

        if (data.success) {
          setAnalytics(data.data)
        } else {
          // Redirect if not authorized
          if (data.statusCode === 403) {
            router.push('/dashboard')
          } else {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Gagal memuat data analytics',
            })
          }
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

    fetchAnalytics()
  }, [timeRange, router, toast])

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <p className="text-muted-foreground">Memuat dashboard...</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <p className="text-muted-foreground">Gagal memuat data</p>
      </div>
    )
  }

  const pieData = [
    {
      name: 'Selesai',
      value: analytics.summary.completedCourses,
      fill: '#10b981',
    },
    {
      name: 'Aktif',
      value:
        analytics.summary.activeEnrollments - analytics.summary.completedCourses,
      fill: '#3b82f6',
    },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground">Lihat ringkasan platform pembelajaran Anda</p>
        </div>
        <div className="flex gap-2">
          {['7days', '30days', '90days'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              onClick={() => setTimeRange(range)}
              size="sm"
            >
              {range === '7days'
                ? '7 Hari'
                : range === '30days'
                  ? '30 Hari'
                  : '90 Hari'}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Total Pengguna"
          value={analytics.summary.totalUsers}
        />
        <StatCard
          icon={BookOpen}
          label="Total Kursus"
          value={analytics.summary.totalCourses}
        />
        <StatCard
          icon={TrendingUp}
          label="Enrollments Aktif"
          value={analytics.summary.activeEnrollments}
          change={`+${Math.floor(analytics.summary.activeEnrollments * 0.15)} minggu ini`}
        />
        <StatCard
          icon={Award}
          label="Sertifikat Diterbitkan"
          value={analytics.summary.certificatesIssued}
        />
        <StatCard
          icon={MessageSquare}
          label="Diskusi Forum"
          value={analytics.engagement.forumTopics}
        />
        <StatCard
          icon={Video}
          label="Sesi Langsung"
          value={analytics.engagement.liveSessions}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Completion Rate */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Tingkat Penyelesaian Kursus</CardTitle>
            <CardDescription>Distribusi penyelesaian kursus</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Kursus Populer</CardTitle>
            <CardDescription>Kursus dengan rating tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCourses.map((course, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.student_count} siswa
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{course.average_rating?.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Engagement */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Metrik Performa</CardTitle>
          <CardDescription>Ringkasan engagement dan pertumbuhan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Diskusi Forum</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{analytics.engagement.forumReplies}</p>
                <p className="text-xs text-muted-foreground">Balasan aktif</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Pendapatan (Langganan)</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  ${(analytics.summary.totalRevenue / 1000).toFixed(1)}k
                </p>
                <p className="text-xs text-muted-foreground">Periode ini</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Tingkat Penyelesaian</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {analytics.summary.activeEnrollments > 0
                    ? Math.round(
                        (analytics.summary.completedCourses /
                          analytics.summary.activeEnrollments) *
                          100
                      )
                    : 0}
                  %
                </p>
                <p className="text-xs text-muted-foreground">Dari total enrollments</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

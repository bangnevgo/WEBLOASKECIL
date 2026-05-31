import { createClient } from '@/lib/supabase/server'
import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/lib/types/api'

// Get platform analytics
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth()
    if (!auth) {
      const response: ApiResponse = {
        success: false,
        error: 'Unauthorized',
        statusCode: 401,
      }
      return NextResponse.json(response, { status: 401 })
    }

    const supabase = await createClient()

    // Check if user is admin
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', auth.sub)
      .single()

    if (!user || user.role !== 'admin') {
      const response: ApiResponse = {
        success: false,
        error: 'Akses ditolak',
        statusCode: 403,
      }
      return NextResponse.json(response, { status: 403 })
    }

    const timeRange = request.nextUrl.searchParams.get('range') || '7days'
    let startDate = new Date()

    switch (timeRange) {
      case '7days':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30days':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90days':
        startDate.setDate(startDate.getDate() - 90)
        break
    }

    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact' })

    // Get total courses
    const { count: totalCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact' })

    // Get active enrollments
    const { count: activeEnrollments } = await supabase
      .from('course_enrollments')
      .select('*', { count: 'exact' })
      .gte('created_at', startDate.toISOString())

    // Get completed courses
    const { count: completedCourses } = await supabase
      .from('course_enrollments')
      .select('*', { count: 'exact' })
      .eq('is_completed', true)

    // Get issued certificates
    const { count: certificates } = await supabase
      .from('certificates')
      .select('*', { count: 'exact' })
      .gte('issued_at', startDate.toISOString())

    // Get forum activity
    const { count: forumTopics } = await supabase
      .from('forum_topics')
      .select('*', { count: 'exact' })
      .gte('created_at', startDate.toISOString())

    const { count: forumReplies } = await supabase
      .from('forum_replies')
      .select('*', { count: 'exact' })
      .gte('created_at', startDate.toISOString())

    // Get live session stats
    const { count: liveSessions } = await supabase
      .from('live_sessions')
      .select('*', { count: 'exact' })
      .gte('scheduled_start_time', startDate.toISOString())

    // Get course ratings
    const { data: courseRatings } = await supabase
      .from('courses')
      .select('title, average_rating, student_count')
      .order('average_rating', { ascending: false })
      .limit(5)

    // Get revenue (if payment system exists)
    const { data: revenue } = await supabase
      .from('subscriptions')
      .select('amount, created_at')
      .eq('status', 'active')
      .gte('created_at', startDate.toISOString())

    const totalRevenue = revenue?.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0

    const response: ApiResponse<any> = {
      success: true,
      data: {
        summary: {
          totalUsers: totalUsers || 0,
          totalCourses: totalCourses || 0,
          activeEnrollments: activeEnrollments || 0,
          completedCourses: completedCourses || 0,
          certificatesIssued: certificates || 0,
          totalRevenue: totalRevenue,
        },
        engagement: {
          forumTopics: forumTopics || 0,
          forumReplies: forumReplies || 0,
          liveSessions: liveSessions || 0,
        },
        topCourses: courseRatings || [],
        timeRange,
      },
      statusCode: 200,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Terjadi kesalahan server',
      statusCode: 500,
    }
    return NextResponse.json(response, { status: 500 })
  }
}

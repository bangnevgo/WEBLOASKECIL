import { createClient } from '@/lib/supabase/server'
import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/lib/types/api'

interface Recommendation {
  id: string
  type: 'course' | 'lesson' | 'live_session' | 'resource'
  title: string
  description: string
  reason: string
  relevance_score: number
  target_id: string
}

// Generate personalized recommendations
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
    const recommendations: Recommendation[] = []

    // Get user's enrolled courses
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select('course_id')
      .eq('user_id', auth.sub)
      .limit(5)

    // Get user's progress
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', auth.sub)
      .order('completed_at', { ascending: false })
      .limit(10)

    // Get available courses that user hasn't enrolled
    const { data: courses } = await supabase
      .from('courses')
      .select('*')
      .limit(10)

    if (courses) {
      for (const course of courses) {
        // Skip if already enrolled
        if (
          enrollments?.some((e) => e.course_id === course.id)
        ) {
          continue
        }

        recommendations.push({
          id: `rec-${course.id}`,
          type: 'course',
          title: course.title,
          description: course.description,
          reason: 'Kursus ini direkomendasikan berdasarkan topik yang mirip dengan kursus Anda',
          relevance_score: 0.85,
          target_id: course.id,
        })
      }
    }

    // Get upcoming live sessions
    const { data: sessions } = await supabase
      .from('live_sessions')
      .select('*')
      .eq('status', 'scheduled')
      .gte('scheduled_start_time', new Date().toISOString())
      .limit(5)

    if (sessions) {
      for (const session of sessions) {
        // Check if user is already registered
        const { data: registered } = await supabase
          .from('session_registrations')
          .select('id')
          .eq('user_id', auth.sub)
          .eq('session_id', session.id)
          .single()

        if (!registered) {
          recommendations.push({
            id: `rec-${session.id}`,
            type: 'live_session',
            title: session.title,
            description: session.description || 'Sesi pembelajaran langsung interaktif',
            reason: 'Sesi ini cocok untuk Anda berdasarkan progress pembelajaran',
            relevance_score: 0.8,
            target_id: session.id,
          })
        }
      }
    }

    // Sort by relevance score
    recommendations.sort((a, b) => b.relevance_score - a.relevance_score)

    const response: ApiResponse<{ recommendations: Recommendation[] }> = {
      success: true,
      data: { recommendations: recommendations.slice(0, 10) },
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

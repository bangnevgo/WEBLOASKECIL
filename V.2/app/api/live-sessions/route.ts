import { createClient } from '@/lib/supabase/server'
import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, LiveSession } from '@/lib/types/api'
import { z } from 'zod'

const sessionSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  description: z.string().optional(),
  course_id: z.string().uuid().optional(),
  scheduled_start_time: z.string().datetime(),
  scheduled_end_time: z.string().datetime(),
  zoom_url: z.string().url().optional(),
  meeting_id: z.string().optional(),
  passcode: z.string().optional(),
  max_participants: z.number().optional(),
})

// Get live sessions
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const status = request.nextUrl.searchParams.get('status') || 'scheduled'
    const page = request.nextUrl.searchParams.get('page') || '1'
    const limit = request.nextUrl.searchParams.get('limit') || '20'

    let query = supabase
      .from('live_sessions')
      .select('*', { count: 'exact' })
      .order('scheduled_start_time', { ascending: true })

    if (status) {
      query = query.eq('status', status)
    }

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const offset = (pageNum - 1) * limitNum

    const { data: sessions, count, error } = await query.range(
      offset,
      offset + limitNum - 1
    )

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal memuat sesi langsung',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse<{
      sessions: LiveSession[]
      total: number
      page: number
      pages: number
    }> = {
      success: true,
      data: {
        sessions: sessions || [],
        total: count || 0,
        page: pageNum,
        pages: Math.ceil((count || 0) / limitNum),
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

// Create live session (instructor only)
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const validation = sessionSchema.parse(body)

    const supabase = await createClient()

    // Check if user is instructor or admin
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', auth.sub)
      .single()

    if (!user || !['instructor', 'admin'].includes(user.role)) {
      const response: ApiResponse = {
        success: false,
        error: 'Hanya instruktur yang dapat membuat sesi langsung',
        statusCode: 403,
      }
      return NextResponse.json(response, { status: 403 })
    }

    const { data: session, error } = await supabase
      .from('live_sessions')
      .insert([
        {
          instructor_id: auth.sub,
          course_id: validation.course_id || null,
          title: validation.title,
          description: validation.description || null,
          scheduled_start_time: validation.scheduled_start_time,
          scheduled_end_time: validation.scheduled_end_time,
          zoom_url: validation.zoom_url || null,
          meeting_id: validation.meeting_id || null,
          passcode: validation.passcode || null,
          max_participants: validation.max_participants || 100,
          status: 'scheduled',
        },
      ])
      .select()
      .single()

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal membuat sesi langsung',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse<{ session: LiveSession }> = {
      success: true,
      data: { session },
      message: 'Sesi langsung berhasil dibuat',
      statusCode: 201,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: ApiResponse = {
        success: false,
        error: error.errors[0].message,
        statusCode: 400,
      }
      return NextResponse.json(response, { status: 400 })
    }

    const response: ApiResponse = {
      success: false,
      error: 'Terjadi kesalahan server',
      statusCode: 500,
    }
    return NextResponse.json(response, { status: 500 })
  }
}

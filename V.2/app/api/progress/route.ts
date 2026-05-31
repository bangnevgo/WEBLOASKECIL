import { createClient } from '@/lib/supabase/server'
import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, UserProgress } from '@/lib/types/api'
import { z } from 'zod'

const progressSchema = z.object({
  lesson_id: z.string().uuid(),
  course_id: z.string().uuid(),
  watched_duration: z.number().optional(),
  is_completed: z.boolean().optional(),
  completion_percentage: z.number().min(0).max(100).optional(),
})

// Get user's progress
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

    const courseId = request.nextUrl.searchParams.get('course_id')
    const supabase = await createClient()

    let query = supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', auth.sub)

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    const { data: progress, error } = await query

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal memuat progress',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse<{ progress: UserProgress[] }> = {
      success: true,
      data: { progress: progress || [] },
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

// Update progress
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
    const validation = progressSchema.parse(body)

    const supabase = await createClient()

    // Check if progress exists
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', auth.sub)
      .eq('lesson_id', validation.lesson_id)
      .single()

    const progressData: any = {
      user_id: auth.sub,
      lesson_id: validation.lesson_id,
      course_id: validation.course_id,
    }

    if (validation.watched_duration !== undefined) {
      progressData.watched_duration = validation.watched_duration
    }
    if (validation.is_completed !== undefined) {
      progressData.is_completed = validation.is_completed
      if (validation.is_completed) {
        progressData.completed_at = new Date().toISOString()
      }
    }
    if (validation.completion_percentage !== undefined) {
      progressData.completion_percentage = validation.completion_percentage
    }

    let response_data

    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('user_progress')
        .update(progressData)
        .eq('user_id', auth.sub)
        .eq('lesson_id', validation.lesson_id)
        .select()
        .single()

      if (error) throw error
      response_data = data
    } else {
      // Create new progress
      const { data, error } = await supabase
        .from('user_progress')
        .insert([progressData])
        .select()
        .single()

      if (error) throw error
      response_data = data
    }

    const response: ApiResponse<{ progress: UserProgress }> = {
      success: true,
      data: { progress: response_data },
      message: 'Progress berhasil disimpan',
      statusCode: 200,
    }

    return NextResponse.json(response, { status: 200 })
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

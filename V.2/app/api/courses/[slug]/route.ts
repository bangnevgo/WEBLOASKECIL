import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, Course, Lesson } from '@/lib/types/api'

// Get course detail with lessons
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createClient()

    // Get course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', params.slug)
      .eq('is_published', true)
      .single()

    if (courseError || !course) {
      const response: ApiResponse = {
        success: false,
        error: 'Kursus tidak ditemukan',
        statusCode: 404,
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Get lessons for this course
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', course.id)
      .eq('is_published', true)
      .order('order_index', { ascending: true })

    if (lessonsError) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal memuat pelajaran',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse<{ course: Course; lessons: Lesson[] }> = {
      success: true,
      data: {
        course,
        lessons: lessons || [],
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

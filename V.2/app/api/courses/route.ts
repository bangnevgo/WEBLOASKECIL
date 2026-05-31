import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, Course } from '@/lib/types/api'

// Get all published courses with pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const page = request.nextUrl.searchParams.get('page') || '1'
    const limit = request.nextUrl.searchParams.get('limit') || '12'
    const category = request.nextUrl.searchParams.get('category')

    let query = supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const offset = (pageNum - 1) * limitNum

    const { data: courses, count, error } = await query
      .range(offset, offset + limitNum - 1)

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal memuat kursus',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse<{
      courses: Course[]
      total: number
      page: number
      pages: number
    }> = {
      success: true,
      data: {
        courses: courses || [],
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

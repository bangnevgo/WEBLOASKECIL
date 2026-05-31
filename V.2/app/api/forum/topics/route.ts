import { createClient } from '@/lib/supabase/server'
import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, ForumTopic } from '@/lib/types/api'
import { z } from 'zod'

const topicSchema = z.object({
  category_id: z.string().uuid(),
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  content: z.string().min(10, 'Konten minimal 10 karakter'),
  course_id: z.string().uuid().optional(),
})

// Get forum topics with pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const page = request.nextUrl.searchParams.get('page') || '1'
    const limit = request.nextUrl.searchParams.get('limit') || '20'
    const category = request.nextUrl.searchParams.get('category')

    let query = supabase
      .from('forum_topics')
      .select('*', { count: 'exact' })
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category_id', category)
    }

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const offset = (pageNum - 1) * limitNum

    const { data: topics, count, error } = await query.range(
      offset,
      offset + limitNum - 1
    )

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal memuat topik forum',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse<{
      topics: ForumTopic[]
      total: number
      page: number
      pages: number
    }> = {
      success: true,
      data: {
        topics: topics || [],
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

// Create new forum topic
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
    const validation = topicSchema.parse(body)

    // Create slug from title
    const slug = validation.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    const supabase = await createClient()
    const { data: topic, error } = await supabase
      .from('forum_topics')
      .insert([
        {
          category_id: validation.category_id,
          user_id: auth.sub,
          course_id: validation.course_id || null,
          title: validation.title,
          slug,
          content: validation.content,
          views_count: 0,
          replies_count: 0,
          is_pinned: false,
          is_locked: false,
        },
      ])
      .select()
      .single()

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal membuat topik',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse<{ topic: ForumTopic }> = {
      success: true,
      data: { topic },
      message: 'Topik berhasil dibuat',
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

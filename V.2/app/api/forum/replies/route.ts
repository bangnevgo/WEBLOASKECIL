import { createClient } from '@/lib/supabase/server'
import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, ForumReply } from '@/lib/types/api'
import { z } from 'zod'

const replySchema = z.object({
  topic_id: z.string().uuid(),
  content: z.string().min(5, 'Komentar minimal 5 karakter'),
})

// Get replies for a topic
export async function GET(request: NextRequest) {
  try {
    const topicId = request.nextUrl.searchParams.get('topic_id')
    const page = request.nextUrl.searchParams.get('page') || '1'
    const limit = request.nextUrl.searchParams.get('limit') || '20'

    if (!topicId) {
      const response: ApiResponse = {
        success: false,
        error: 'Topic ID diperlukan',
        statusCode: 400,
      }
      return NextResponse.json(response, { status: 400 })
    }

    const supabase = await createClient()
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const offset = (pageNum - 1) * limitNum

    const { data: replies, count, error } = await supabase
      .from('forum_replies')
      .select('*', { count: 'exact' })
      .eq('topic_id', topicId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limitNum - 1)

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal memuat balasan',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse<{
      replies: ForumReply[]
      total: number
      page: number
      pages: number
    }> = {
      success: true,
      data: {
        replies: replies || [],
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

// Create reply
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
    const validation = replySchema.parse(body)

    const supabase = await createClient()

    // Create reply
    const { data: reply, error } = await supabase
      .from('forum_replies')
      .insert([
        {
          topic_id: validation.topic_id,
          user_id: auth.sub,
          content: validation.content,
          is_solution: false,
          likes_count: 0,
        },
      ])
      .select()
      .single()

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal membuat balasan',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    // Update topic's reply count and last reply time
    await supabase
      .from('forum_topics')
      .update({
        replies_count: supabase.rpc('increment_replies', { id: validation.topic_id }),
        last_reply_at: new Date().toISOString(),
      })
      .eq('id', validation.topic_id)

    const response: ApiResponse<{ reply: ForumReply }> = {
      success: true,
      data: { reply },
      message: 'Balasan berhasil dibuat',
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

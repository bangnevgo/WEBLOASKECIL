import { createClient } from '@/lib/supabase/server'
import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/lib/types/api'
import { z } from 'zod'

const chatSchema = z.object({
  message: z.string().min(1, 'Pesan tidak boleh kosong'),
  session_id: z.string().uuid().optional(),
  session_type: z.enum(['tutoring', 'recommendation', 'general_qa']).optional(),
  course_id: z.string().uuid().optional(),
})

// Simple AI response logic (can be replaced with actual AI API)
function generateAIResponse(
  userMessage: string,
  sessionType: string,
  courseId?: string
): string {
  const lowerMessage = userMessage.toLowerCase()

  // Simple keyword matching for demo
  if (sessionType === 'tutoring') {
    if (lowerMessage.includes('bagaimana') || lowerMessage.includes('cara')) {
      return 'Teknik visualisasi adalah fondasi dari Hukum Asumsi. Bayangkan diri Anda sudah memiliki apa yang ingin Anda raih dengan perasaan yang kuat seolah-olah sudah terjadi. Pertahankan gambar mental ini sampai menjadi kenyataan.'
    }
    if (lowerMessage.includes('kesulitan') || lowerMessage.includes('masalah')) {
      return 'Banyak orang mengalami tantangan yang sama. Kunci suksesnya adalah konsistensi dan keyakinan. Praktik teknik ini setiap hari dan percayakan hasilnya pada alam bawah sadar Anda.'
    }
  }

  if (sessionType === 'recommendation') {
    return 'Berdasarkan progress Anda, saya rekomendasikan untuk melanjutkan ke modul berikutnya tentang teknik manifestasi lanjutan. Anda sudah menguasai fondasi dengan baik!'
  }

  return 'Terima kasih atas pertanyaannya! Pertanyaan Anda sangat baik. Jika Anda ingin pembahasan lebih detail, saya rekomendasikan mengikuti live class kami dengan mentor berpengalaman.'
}

// Post message and get AI response
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
    const validation = chatSchema.parse(body)

    const supabase = await createClient()
    let sessionId = validation.session_id

    // Create new session if needed
    if (!sessionId) {
      const { data: session, error: sessionError } = await supabase
        .from('ai_chat_sessions')
        .insert([
          {
            user_id: auth.sub,
            session_type: validation.session_type || 'general_qa',
            course_id: validation.course_id || null,
            is_active: true,
          },
        ])
        .select()
        .single()

      if (sessionError) {
        const response: ApiResponse = {
          success: false,
          error: 'Gagal membuat sesi chat',
          statusCode: 500,
        }
        return NextResponse.json(response, { status: 500 })
      }

      sessionId = session.id
    }

    // Generate AI response
    const aiResponse = generateAIResponse(
      validation.message,
      validation.session_type || 'general_qa',
      validation.course_id
    )

    // Save message and response
    const { data: message, error: messageError } = await supabase
      .from('ai_messages')
      .insert([
        {
          session_id: sessionId,
          user_message: validation.message,
          ai_response: aiResponse,
          message_type: 'text',
          context_data: {
            courseId: validation.course_id,
            timestamp: new Date().toISOString(),
          },
        },
      ])
      .select()
      .single()

    if (messageError) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal menyimpan pesan',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse<{
      sessionId: string
      userMessage: string
      aiResponse: string
      messageId: string
    }> = {
      success: true,
      data: {
        sessionId,
        userMessage: validation.message,
        aiResponse,
        messageId: message.id,
      },
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

// Get chat history for a session
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

    const sessionId = request.nextUrl.searchParams.get('session_id')
    if (!sessionId) {
      const response: ApiResponse = {
        success: false,
        error: 'Session ID diperlukan',
        statusCode: 400,
      }
      return NextResponse.json(response, { status: 400 })
    }

    const supabase = await createClient()

    // Verify session ownership
    const { data: session } = await supabase
      .from('ai_chat_sessions')
      .select('user_id')
      .eq('id', sessionId)
      .single()

    if (!session || session.user_id !== auth.sub) {
      const response: ApiResponse = {
        success: false,
        error: 'Unauthorized',
        statusCode: 403,
      }
      return NextResponse.json(response, { status: 403 })
    }

    const { data: messages, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal memuat riwayat chat',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse<{ messages: any[] }> = {
      success: true,
      data: { messages: messages || [] },
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

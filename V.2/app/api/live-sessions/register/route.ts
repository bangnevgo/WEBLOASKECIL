import { createClient } from '@/lib/supabase/server'
import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/lib/types/api'
import { z } from 'zod'

const registrationSchema = z.object({
  session_id: z.string().uuid(),
  attendance_type: z.enum(['live', 'replay']).optional(),
})

// Register for live session
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
    const validation = registrationSchema.parse(body)

    const supabase = await createClient()

    // Check if session exists and has space
    const { data: session, error: sessionError } = await supabase
      .from('live_sessions')
      .select('max_participants')
      .eq('id', validation.session_id)
      .single()

    if (sessionError || !session) {
      const response: ApiResponse = {
        success: false,
        error: 'Sesi tidak ditemukan',
        statusCode: 404,
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Check if user already registered
    const { data: existingReg } = await supabase
      .from('session_registrations')
      .select('id')
      .eq('user_id', auth.sub)
      .eq('session_id', validation.session_id)
      .single()

    if (existingReg) {
      const response: ApiResponse = {
        success: false,
        error: 'Anda sudah terdaftar untuk sesi ini',
        statusCode: 400,
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Get current participant count
    const { count } = await supabase
      .from('session_registrations')
      .select('*', { count: 'exact' })
      .eq('session_id', validation.session_id)

    if (count && count >= session.max_participants) {
      const response: ApiResponse = {
        success: false,
        error: 'Sesi sudah penuh',
        statusCode: 400,
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Create registration
    const { data: registration, error } = await supabase
      .from('session_registrations')
      .insert([
        {
          user_id: auth.sub,
          session_id: validation.session_id,
          attendance_type: validation.attendance_type || 'live',
          registered_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal mendaftar untuk sesi',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse<{ registration: any }> = {
      success: true,
      data: { registration },
      message: 'Berhasil terdaftar untuk sesi',
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

// Get registered sessions for user
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

    const { data: registrations, error } = await supabase
      .from('session_registrations')
      .select(
        `
        *,
        live_sessions(
          id,
          title,
          description,
          scheduled_start_time,
          scheduled_end_time,
          zoom_url,
          status
        )
      `
      )
      .eq('user_id', auth.sub)
      .order('registered_at', { ascending: false })

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal memuat pendaftaran',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse<{ registrations: any[] }> = {
      success: true,
      data: { registrations: registrations || [] },
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

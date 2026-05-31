import { createClient } from '@/lib/supabase/server'
import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/lib/types/api'
import crypto from 'crypto'

// Get user's certificates
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
    const { data: certificates, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', auth.sub)
      .order('issued_at', { ascending: false })

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal memuat sertifikat',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse<{ certificates: any[] }> = {
      success: true,
      data: { certificates: certificates || [] },
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

// Issue certificate after course completion
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
    const { course_id } = body

    if (!course_id) {
      const response: ApiResponse = {
        success: false,
        error: 'Course ID diperlukan',
        statusCode: 400,
      }
      return NextResponse.json(response, { status: 400 })
    }

    const supabase = await createClient()

    // Check if user completed the course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('user_id', auth.sub)
      .eq('course_id', course_id)
      .single()

    if (enrollmentError || !enrollment || !enrollment.is_completed) {
      const response: ApiResponse = {
        success: false,
        error: 'Kursus belum diselesaikan atau tidak ditemukan',
        statusCode: 400,
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Check if certificate already exists
    const { data: existingCert } = await supabase
      .from('certificates')
      .select('id')
      .eq('user_id', auth.sub)
      .eq('course_id', course_id)
      .single()

    if (existingCert) {
      const response: ApiResponse = {
        success: false,
        error: 'Sertifikat sudah diterbitkan untuk kursus ini',
        statusCode: 400,
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Generate certificate
    const certificateNumber = `HA-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
    const verificationCode = crypto.randomBytes(16).toString('hex').toUpperCase()
    const certificateUrl = `/certificates/${certificateNumber}`

    const { data: certificate, error } = await supabase
      .from('certificates')
      .insert([
        {
          user_id: auth.sub,
          course_id,
          certificate_number: certificateNumber,
          verification_code: verificationCode,
          certificate_url: certificateUrl,
          issued_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal membuat sertifikat',
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse<{ certificate: any }> = {
      success: true,
      data: { certificate },
      message: 'Sertifikat berhasil diterbitkan',
      statusCode: 201,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Terjadi kesalahan server',
      statusCode: 500,
    }
    return NextResponse.json(response, { status: 500 })
  }
}

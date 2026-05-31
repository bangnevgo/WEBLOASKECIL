import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { ApiResponse, User } from '@/lib/types/api'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password diperlukan'),
})

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-min-32-chars'
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = loginSchema.parse(body)

    const supabase = await createClient()

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', validation.email)
      .single()

    if (error || !user) {
      const response: ApiResponse = {
        success: false,
        error: 'Email atau password salah',
        statusCode: 401,
      }
      return NextResponse.json(response, { status: 401 })
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(
      validation.password,
      user.password_hash
    )

    if (!passwordMatch) {
      const response: ApiResponse = {
        success: false,
        error: 'Email atau password salah',
        statusCode: 401,
      }
      return NextResponse.json(response, { status: 401 })
    }

    // Create JWT token
    const iat = Math.floor(Date.now() / 1000)
    const exp = iat + 24 * 60 * 60 // 24 hours

    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
      iat,
      exp,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
    })

    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      role: user.role,
      subscription_status: user.subscription_status,
      subscription_plan: user.subscription_plan,
      subscription_start_date: user.subscription_start_date,
      subscription_end_date: user.subscription_end_date,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }

    const response: ApiResponse<{ user: User; token: string }> = {
      success: true,
      data: { user: userData, token },
      message: 'Login berhasil',
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

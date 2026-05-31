import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { ApiResponse, User } from '@/lib/types/api'
import { NextRequest, NextResponse } from 'next/server'

const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = registerSchema.parse(body)

    const supabase = await createClient()

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', validation.email)
      .single()

    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        error: 'Email sudah terdaftar',
        statusCode: 400,
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validation.password, 10)

    // Create user in Supabase
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email: validation.email,
          name: validation.name,
          password_hash: hashedPassword,
          role: 'student',
          subscription_status: 'free',
          is_active: true,
        },
      ])
      .select()
      .single()

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal membuat akun: ' + error.message,
        statusCode: 500,
      }
      return NextResponse.json(response, { status: 500 })
    }

    const user: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      subscription_status: newUser.subscription_status,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    }

    const response: ApiResponse<{ user: User }> = {
      success: true,
      data: { user },
      message: 'Akun berhasil dibuat',
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

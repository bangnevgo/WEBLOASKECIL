import { createClient } from '@/lib/supabase/server'
import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, User } from '@/lib/types/api'

// Get current user profile
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
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', auth.sub)
      .single()

    if (error || !user) {
      const response: ApiResponse = {
        success: false,
        error: 'User tidak ditemukan',
        statusCode: 404,
      }
      return NextResponse.json(response, { status: 404 })
    }

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

    const response: ApiResponse<{ user: User }> = {
      success: true,
      data: { user: userData },
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

// Update user profile
export async function PATCH(request: NextRequest) {
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
    const { name, avatar_url, bio } = body

    const supabase = await createClient()
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        name: name || undefined,
        avatar_url: avatar_url || undefined,
        bio: bio || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', auth.sub)
      .select()
      .single()

    if (error || !updatedUser) {
      const response: ApiResponse = {
        success: false,
        error: 'Gagal update profil',
        statusCode: 400,
      }
      return NextResponse.json(response, { status: 400 })
    }

    const userData: User = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar_url: updatedUser.avatar_url,
      bio: updatedUser.bio,
      role: updatedUser.role,
      subscription_status: updatedUser.subscription_status,
      subscription_plan: updatedUser.subscription_plan,
      subscription_start_date: updatedUser.subscription_start_date,
      subscription_end_date: updatedUser.subscription_end_date,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
    }

    const response: ApiResponse<{ user: User }> = {
      success: true,
      data: { user: userData },
      message: 'Profil berhasil diupdate',
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

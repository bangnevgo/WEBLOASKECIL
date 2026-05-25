import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { signSession } from "@/lib/session"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: {
        completions: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Email tidak terdaftar atau password salah" },
        { status: 400 }
      )
    }

    const hashed = hashPassword(password)
    if (user.passwordHash !== hashed) {
      return NextResponse.json(
        { error: "Email tidak terdaftar atau password salah" },
        { status: 400 }
      )
    }

    // Sign session
    const sessionToken = signSession({
      userId: user.id,
      email: user.email,
      name: user.name || "User",
      tier: user.tier,
    })

    // Retrieve completed lessons
    const completedLessons = user.completions.map(c => c.lessonNum)

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tier: user.tier,
        completedLessons: completedLessons
      }
    })

    // Set secure HTTP-only cookie
    response.cookies.set("nv-session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Login API error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat masuk" },
      { status: 500 }
    )
  }
}

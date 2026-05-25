import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { signSession } from "@/lib/session"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Nama, email, dan password wajib diisi" },
        { status: 400 }
      )
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email ini sudah terdaftar. Silakan login." },
        { status: 400 }
      )
    }

    const hashedPassword = hashPassword(password)

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        tier: "free", // Default to free tier
      },
    })

    // Sign session
    const sessionToken = signSession({
      userId: user.id,
      email: user.email,
      name: user.name || "User",
      tier: user.tier,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tier: user.tier,
        completedLessons: []
      },
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
    console.error("Registration API error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat pendaftaran" },
      { status: 500 }
    )
  }
}

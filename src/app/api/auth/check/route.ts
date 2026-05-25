import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifySession, signSession } from "@/lib/session"

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("nv-session")?.value
    const session = verifySession(sessionCookie)

    if (!session) {
      return NextResponse.json({ authenticated: false })
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      include: { completions: true }
    })

    if (!user) {
      return NextResponse.json({ authenticated: false })
    }

    const completedLessons = user.completions.map(c => c.lessonNum)

    // Check if the database tier is different from the session cookie tier
    if (user.tier !== session.tier) {
      // Re-sign session with updated tier
      const sessionToken = signSession({
        userId: user.id,
        email: user.email,
        name: user.name || "User",
        tier: user.tier,
      })

      const response = NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          tier: user.tier,
          completedLessons: completedLessons
        },
        changed: true
      })

      // Set updated secure HTTP-only cookie
      response.cookies.set("nv-session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      })

      return response
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tier: user.tier,
        completedLessons: completedLessons
      },
      changed: false
    })
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

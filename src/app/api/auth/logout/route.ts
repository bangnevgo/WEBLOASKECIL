import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true })
  
  // Clear the session cookie
  response.cookies.set("nv-session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  })
  
  return response
}

import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-min-32-chars'
)

interface JWTPayload {
  sub: string
  email: string
  role: string
  iat: number
  exp: number
}

export async function verifyAuth() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const verified = await jwtVerify<JWTPayload>(token, secret)
    return verified.payload
  } catch (err) {
    return null
  }
}

export async function createJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 24 * 60 * 60 // 24 hours

  return new jose.SignJWT({ ...payload, iat, exp })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret)
}

export function getAuthFromRequest(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  return authHeader.slice(7)
}

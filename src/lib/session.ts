import crypto from 'crypto'

const SECRET = process.env.NEXTAUTH_SECRET || "neville-godgard-secret-key-loas-123"

export interface SessionPayload {
  userId: string
  email: string
  name: string
  tier: string
  expiresAt: number
}

/**
 * Sign session payload to a secure base64 token verified with an HMAC-SHA256 signature.
 */
export function signSession(payload: Omit<SessionPayload, 'expiresAt'>, maxAgeSeconds: number = 30 * 24 * 60 * 60): string {
  const expiresAt = Date.now() + maxAgeSeconds * 1000
  const fullPayload: SessionPayload = { ...payload, expiresAt }
  
  const data = JSON.stringify(fullPayload)
  const dataB64 = Buffer.from(data).toString('base64')
  
  const hmac = crypto.createHmac('sha256', SECRET).update(dataB64).digest('hex')
  return `${dataB64}.${hmac}`
}

/**
 * Verify and parse a signed session token. Returns the session payload if valid, null otherwise.
 */
export function verifySession(token: string | undefined): SessionPayload | null {
  if (!token) return null
  
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    
    const [dataB64, hmac] = parts
    
    // Verify HMAC signature
    const calculatedHmac = crypto.createHmac('sha256', SECRET).update(dataB64).digest('hex')
    if (hmac !== calculatedHmac) return null
    
    const data = Buffer.from(dataB64, 'base64').toString('utf-8')
    const payload: SessionPayload = JSON.parse(data)
    
    // Check expiration
    if (Date.now() > payload.expiresAt) {
      return null
    }
    
    return payload
  } catch (error) {
    console.error('Error verifying session:', error)
    return null
  }
}

import crypto from 'crypto'

const COOKIE_SECRET = process.env.NEXTAUTH_SECRET || 'neville-godgard-secret-key-loas-123'
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60

/**
 * Marks a browser that has successfully submitted the free-access form.
 * The payload is signed so visitors cannot unlock the curriculum by merely
 * writing a cookie in the browser.
 */
export function createLeadAccessToken(): string {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000
  const payload = Buffer.from(JSON.stringify({ scope: 'lead-access', expiresAt })).toString('base64url')
  const signature = crypto.createHmac('sha256', COOKIE_SECRET).update(payload).digest('hex')
  return `${payload}.${signature}`
}

export function hasValidLeadAccess(token: string | undefined): boolean {
  if (!token) return false

  try {
    const [payload, signature] = token.split('.')
    if (!payload || !signature) return false

    const expected = crypto.createHmac('sha256', COOKIE_SECRET).update(payload).digest('hex')
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return data.scope === 'lead-access' && typeof data.expiresAt === 'number' && Date.now() < data.expiresAt
  } catch {
    return false
  }
}

export const leadAccessMaxAge = MAX_AGE_SECONDS

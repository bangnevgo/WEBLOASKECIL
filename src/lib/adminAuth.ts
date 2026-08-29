import { NextRequest, NextResponse } from 'next/server'

/**
 * Shared guard for admin-only endpoints (leads, booking admin, lead import).
 * Caller must send header `x-admin-key` matching ADMIN_ACCESS_KEY (server-only
 * secret) — same pattern as /api/access/grant.
 */
export function isAdminRequest(req: NextRequest): boolean {
  const adminKey = process.env.ADMIN_ACCESS_KEY || ''
  if (!adminKey) return false
  return (req.headers.get('x-admin-key') || '') === adminKey
}

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  )
}

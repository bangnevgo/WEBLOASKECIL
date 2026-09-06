import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest, unauthorizedResponse } from '@/lib/adminAuth'
import { normalizeDistributionStatus } from '@/lib/access-tier-policy.mjs'

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorizedResponse()

  try {
    const body = await req.json()
    const email = String(body.email || '').trim().toLowerCase()
    if (!email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Email tidak valid.' }, { status: 400 })
    }

    const distributionStatus = normalizeDistributionStatus(body.distributionStatus)
    const user = await db.user.update({
      where: { email },
      data: {
        distributionStatus,
        distributedAt: distributionStatus === 'sent' ? new Date() : null,
      },
      select: { email: true, distributionStatus: true, distributedAt: true },
    })

    return NextResponse.json({ success: true, ...user })
  } catch (error: any) {
    const notFound = error?.code === 'P2025'
    return NextResponse.json(
      { success: false, error: notFound ? 'User tidak ditemukan.' : (error?.message || 'Gagal memperbarui status distribusi.') },
      { status: notFound ? 404 : 500 },
    )
  }
}

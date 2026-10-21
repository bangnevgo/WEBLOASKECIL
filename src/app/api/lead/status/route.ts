import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { hasValidLeadAccess } from '@/lib/lead-access'

/**
 * GET /api/lead/status?email=...
 *embalikan apakah email sudah pernah terdaftar sebagai Lead.
 * - Jika cookie nv-lead-access valid -> registered true (tanpa perlu email).
 * - Jika email ada di tabel Lead (case-insensitive) -> registered true.
 * - Hanya boolean, tanpa PII, agar aman dipanggil client untuk pulihkan akses.
 */
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    if (hasValidLeadAccess(cookieStore.get('nv-lead-access')?.value)) {
      return NextResponse.json({ success: true, registered: true, via: 'cookie' })
    }

    const email = (new URL(request.url).searchParams.get('email') || '').trim().toLowerCase()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: true, registered: false })
    }

    const lead = await db.lead.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      select: { id: true },
    })
    return NextResponse.json({ success: true, registered: !!lead })
  } catch (err) {
    console.error('Lead status error:', err)
    return NextResponse.json(
      { success: false, registered: false, error: 'Gagal memeriksa status.' },
      { status: 500 }
    )
  }
}

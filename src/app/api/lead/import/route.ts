import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest, unauthorizedResponse } from '@/lib/adminAuth'

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }
  try {
    const body = await request.json()
    const leads = Array.isArray(body.leads) ? body.leads : Array.isArray(body) ? body : null

    if (!leads || leads.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Payload harus berupa array lead (JSON) atau { leads: [...] }' },
        { status: 400 }
      )
    }

    let inserted = 0
    let skipped = 0
    const errors: string[] = []

    for (const item of leads) {
      const name = typeof item.name === 'string' ? item.name.trim() : ''
      const email = typeof item.email === 'string' ? item.email.trim().toLowerCase() : ''
      const phone = typeof item.phone === 'string' ? String(item.phone).trim() : ''
      const source = typeof item.source === 'string' && item.source.trim() ? item.source.trim() : 'landing'
      const createdAt = item.timestamp || item.createdAt ? new Date(item.timestamp || item.createdAt) : new Date()

      if (!name || !email) {
        skipped++
        continue
      }

      try {
        // Avoid duplicate imports by email
        const existing = await db.lead.findFirst({ where: { email } })
        if (existing) {
          skipped++
          continue
        }

        await db.lead.create({
          data: {
            name,
            email,
            phone,
            source,
            createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
          },
        })
        inserted++
      } catch (err: any) {
        errors.push(`Gagal import ${email}: ${err.message}`)
      }
    }

    return NextResponse.json({
      ok: true,
      summary: {
        totalReceived: leads.length,
        inserted,
        skipped,
        errorCount: errors.length,
      },
      errors: errors.slice(0, 10),
    })
  } catch (error: any) {
    console.error('Lead import error:', error)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

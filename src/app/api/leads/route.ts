import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/leads
// Fetch recent leads from Neon DB for the Nevgo OS Dashboard CRM
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500)

    const leads = await db.lead.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        source: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      ok: true,
      total: leads.length,
      leads,
    })
  } catch (error) {
    console.error('Fetch leads error:', error)
    return NextResponse.json({ ok: false, error: 'Failed to fetch leads' }, { status: 500 })
  }
}

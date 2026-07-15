import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/leads/stats
// Aggregate free-material lead volume + attribution. Public, but returns
// only counts (no PII) so the cohort command center can fetch it.
export async function GET() {
  try {
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [total, thisMonth, lastMonth, grouped] = await Promise.all([
      db.lead.count(),
      db.lead.count({ where: { createdAt: { gte: startOfThisMonth } } }),
      db.lead.count({
        where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
      }),
      db.lead.groupBy({ by: ['source'], _count: { _all: true } }),
    ])

    const bySource: Record<string, number> = {}
    for (const g of grouped) {
      bySource[g.source] = g._count._all
    }

    return NextResponse.json({
      ok: true,
      total,
      thisMonth,
      lastMonth,
      bySource,
    })
  } catch (error) {
    console.error('Lead stats error:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to load lead stats' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ADMIN_SECRET = 'neville'

// GET /api/activation/list — List all activation codes (admin only)
export async function GET(req: NextRequest) {
  try {
    const adminKey = req.headers.get('x-admin-key')

    if (adminKey !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    const codes = await db.activationCode.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const stats = {
      total: codes.length,
      used: codes.filter(c => c.used).length,
      available: codes.filter(c => !c.used).length,
      basic: codes.filter(c => c.tier === 'basic' || c.tier === 'pelajar').length,
      master: codes.filter(c => c.tier === 'master').length,
    }

    return NextResponse.json({ codes, stats })
  } catch (error) {
    console.error('List error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

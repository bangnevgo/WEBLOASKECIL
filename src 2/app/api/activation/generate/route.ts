import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Admin secret — same as the admin username for simplicity
const ADMIN_SECRET = 'neville2222'

// POST /api/activation/generate — Generate activation codes (admin only)
export async function POST(req: NextRequest) {
  try {
    const { adminKey, tier, count } = await req.json()

    // Verify admin access
    if (adminKey !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    const validTiers = ['pelajar', 'master']
    if (!tier || !validTiers.includes(tier)) {
      return NextResponse.json({ error: 'Tier tidak valid. Gunakan "pelajar" atau "master"' }, { status: 400 })
    }

    const codeCount = Math.min(Math.max(count || 1, 1), 50) // 1-50 codes at a time

    const codes: string[] = []

    for (let i = 0; i < codeCount; i++) {
      // Generate code like: NVG-PEL-XXXX-XXXX or NVG-MAS-XXXX-XXXX
      const prefix = tier === 'pelajar' ? 'PEL' : 'MAS'
      const randomPart = () => Math.random().toString(36).substring(2, 6).toUpperCase()
      const code = `NVG-${prefix}-${randomPart()}-${randomPart()}`

      try {
        await db.activationCode.create({
          data: { code, tier },
        })
        codes.push(code)
      } catch {
        // If duplicate (extremely rare), skip and try again
        i--
      }
    }

    return NextResponse.json({
      success: true,
      tier,
      codes,
      count: codes.length,
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

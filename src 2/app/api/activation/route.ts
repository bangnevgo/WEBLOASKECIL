import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/activation — Verify & use an activation code
export async function POST(req: NextRequest) {
  try {
    const { code, userName } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Kode aktivasi diperlukan' }, { status: 400 })
    }

    const normalizedCode = code.trim().toUpperCase()

    const activationCode = await db.activationCode.findUnique({
      where: { code: normalizedCode },
    })

    if (!activationCode) {
      return NextResponse.json({ error: 'Kode aktivasi tidak valid' }, { status: 404 })
    }

    if (activationCode.used) {
      return NextResponse.json({ error: 'Kode aktivasi sudah digunakan' }, { status: 410 })
    }

    // Mark code as used
    await db.activationCode.update({
      where: { id: activationCode.id },
      data: {
        used: true,
        usedBy: userName || 'Pengguna',
        usedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      tier: activationCode.tier,
      message: 'Aktivasi berhasil!',
    })
  } catch (error) {
    console.error('Activation error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

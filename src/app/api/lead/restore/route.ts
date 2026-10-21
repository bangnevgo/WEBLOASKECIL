import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createLeadAccessToken, leadAccessMaxAge } from '@/lib/lead-access'

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('62')) return `0${digits.slice(2)}`
  if (digits.startsWith('8')) return `0${digits}`
  return digits
}

/**
 * POST /api/lead/restore
 * Pulihkan akses member lama yang terkunci (ganti HP/browser/hapus data)
 * tanpa membuat baris Lead baru dan tanpa notifikasi Sheet/Telegram.
 * Body: { email, identifier }
 * - Jika email/nomor HP ada di tabel Lead atau User -> set cookie nv-lead-access + kembalikan nama.
 * - Jika tidak ada -> 404 agar client mengarahkan ke pendaftaran baru.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const rawInput = String(body.identifier || body.email || body.phone || '').trim()

    if (!rawInput) {
      return NextResponse.json(
        { success: false, error: 'Masukkan email atau nomor HP/WA yang pernah didaftarkan.' },
        { status: 400 }
      )
    }

    const isEmail = rawInput.includes('@')
    let matched: { name: string; email: string; phone: string } | null = null

    if (isEmail) {
      const email = rawInput.toLowerCase()
      if (!email.includes('.')) {
        return NextResponse.json(
          { success: false, error: 'Format email tidak valid.' },
          { status: 400 }
        )
      }

      const lead = await db.lead.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' },
      })

      if (lead) {
        matched = { name: lead.name, email: lead.email, phone: lead.phone }
      } else {
        const user = await db.user.findFirst({
          where: { email: { equals: email, mode: 'insensitive' } },
        })
        if (user) {
          matched = {
            name: user.name || user.email.split('@')[0],
            email: user.email,
            phone: '',
          }
        }
      }
    } else {
      const normalized = normalizePhone(rawInput)
      if (normalized.length < 8) {
        return NextResponse.json(
          { success: false, error: 'Masukkan email atau nomor HP/WA yang valid.' },
          { status: 400 }
        )
      }

      const candidates = await db.lead.findMany({
        where: { phone: { contains: normalized.slice(-8) } },
        orderBy: { createdAt: 'desc' },
        take: 25,
      })

      const lead =
        candidates.find((c) => normalizePhone(c.phone) === normalized) ||
        candidates[0] ||
        null

      if (lead) {
        matched = { name: lead.name, email: lead.email, phone: lead.phone }
      }
    }

    if (!matched) {
      return NextResponse.json(
        { success: false, error: 'Data member belum ditemukan. Silakan daftar baru.' },
        { status: 404 }
      )
    }

    const response = NextResponse.json({
      success: true,
      restored: true,
      data: matched,
    })
    response.cookies.set('nv-lead-access', createLeadAccessToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: leadAccessMaxAge,
      path: '/',
    })
    return response
  } catch (err) {
    console.error('Lead restore error:', err)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal.' },
      { status: 500 }
    )
  }
}

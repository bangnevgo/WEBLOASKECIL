import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createLeadAccessToken, leadAccessMaxAge } from '@/lib/lead-access'

const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || ''
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || ''

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Support Lynk.id Webhook Payload sent directly to /api/lead/register
    if (body.event === 'payment.received' || body.data?.message_data || body.test || body.source === 'lena_test') {
      const msgData = body.data?.message_data || body.message_data || body
      const customer = msgData.customer || body.customer || {}
      const items = msgData.items || body.items || []
      const totals = msgData.totals || body.totals || {}

      const email = (customer.email || body.email || '').trim().toLowerCase()
      let name = (customer.name || body.name || email.split('@')[0]).trim()
      let phone = (customer.phone || body.phone || '').trim()
      if (phone && phone !== '-' && !phone.startsWith('0') && !phone.startsWith('+')) {
        phone = '0' + phone
      }
      const itemTitle = items[0]?.title || body.product || 'Lynk.id Product'
      const source = `lynk.id (${itemTitle.slice(0, 30)})`

      if (email && email.includes('@')) {
        try {
          const existing = await db.lead.findFirst({ where: { email } })
          if (existing) {
            await db.lead.update({
              where: { id: existing.id },
              data: { source, phone: existing.phone || (phone === '-' ? '' : phone) }
            })
          } else {
            await db.lead.create({ data: { name, email, phone: phone === '-' ? '' : phone, source } })
          }
        } catch (dbErr) {
          console.error('Lynk webhook Neon save error:', dbErr)
        }

        return NextResponse.json({ success: true, message: 'Lynk.id webhook registered' })
      }
    }

    const { name, email, phone } = body

    // Attribution: explicit source -> utm_source -> referer -> default
    const utmSource = new URL(request.url).searchParams.get('utm_source')
    const referer = request.headers.get('referer') || ''
    const source =
      (typeof body.source === 'string' && body.source.trim()) ||
      (utmSource && utmSource.trim()) ||
      (referer.includes('tiktok') ? 'tiktok' : '') ||
      'landing'

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Nama, email, dan nomor HP/WA wajib diisi.' },
        { status: 400 }
      )
    }

    // Basic email validation
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'Format email tidak valid.' },
        { status: 400 }
      )
    }

    const timestamp = new Date().toISOString()
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // 1. Send to Google Sheet via POST
    let sheetResult = 'not_sent'
    if (GOOGLE_SHEET_URL) {
      try {
        const sheetRes = await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            timestamp,
            source,
            ip: ipAddress,
            userAgent
          })
        })
        sheetResult = sheetRes.ok ? 'sent' : `failed: ${sheetRes.status}`
      } catch (err) {
        console.error('Google Sheet send error:', err)
        sheetResult = 'error'
      }
    }

    // 2. Send Telegram notification
    let tgResult = 'not_sent'
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_ADMIN_CHAT_ID) {
      try {
        const tgMessage = `✦ *Lead Baru Akses Loas!* ✦\n\n👤 *Nama:* ${name}\n📧 *Email:* ${email}\n📱 *No HP/WA:* ${phone}\n🕐 *Waktu:* ${new Date(timestamp).toLocaleString('id-ID')}\n🌐 *Sumber:* ${source}\n🌐 *IP:* ${ipAddress}\n📱 *UA:* ${userAgent.slice(0, 80)}`

        const tgRes = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_ADMIN_CHAT_ID,
              text: tgMessage,
              parse_mode: 'Markdown'
            })
          }
        )
        tgResult = tgRes.ok ? 'sent' : `failed: ${tgRes.status}`
      } catch (err) {
        console.error('Telegram send error:', err)
        tgResult = 'error'
      }
    }

    // Neon is a downstream mirror for reporting. The Google Sheet intake is
    // the durable capture boundary while Neon is being repaired. A database
    // outage must not make a successfully captured lead disappear.
    let dbResult = 'not_saved'
    try {
      await db.lead.create({ data: { name, email, phone, source } })
      dbResult = 'saved'
    } catch (err) {
      console.error('Lead DB save error:', err)
      dbResult = 'error'
    }

    // Google Sheet is the intake system. If it accepted the lead, return
    // success even when the downstream Neon mirror is temporarily unavailable.
    if (GOOGLE_SHEET_URL && sheetResult !== 'sent') {
      return NextResponse.json(
        { success: false, error: 'Data belum diterima sistem. Silakan coba lagi.' },
        { status: 502 }
      )
    }

    const response = NextResponse.json({
      success: true,
      data: { sheet: sheetResult, telegram: tgResult, db: dbResult, syncPending: dbResult !== 'saved', source }
    })

    response.cookies.set('nv-lead-access', createLeadAccessToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: leadAccessMaxAge,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Lead registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal.' },
      { status: 500 }
    )
  }
}

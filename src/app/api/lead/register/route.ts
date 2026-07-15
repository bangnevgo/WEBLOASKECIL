import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || ''
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || ''

export async function POST(request: Request) {
  try {
    const body = await request.json()
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

    // Persist lead for command-center attribution (best-effort; do not
    // fail the request if the DB is unavailable — Sheet/Telegram already sent)
    let dbResult = 'not_saved'
    try {
      await db.lead.create({ data: { name, email, phone, source } })
      dbResult = 'saved'
    } catch (err) {
      console.error('Lead DB save error:', err)
      dbResult = 'error'
    }

    return NextResponse.json({
      success: true,
      data: { sheet: sheetResult, telegram: tgResult, db: dbResult, source }
    })
  } catch (error) {
    console.error('Lead registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal.' },
      { status: 500 }
    )
  }
}

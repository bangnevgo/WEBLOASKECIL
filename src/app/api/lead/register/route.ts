import { NextResponse } from 'next/server'

const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || ''
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || ''

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone } = body

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
            source: 'nevgo-landing-page',
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
        const tgMessage = `✦ *Lead Baru Terdaftar!* ✦\n\n👤 *Nama:* ${name}\n📧 *Email:* ${email}\n📱 *No HP/WA:* ${phone}\n🕐 *Waktu:* ${new Date(timestamp).toLocaleString('id-ID')}\n🌐 *IP:* ${ipAddress}\n📱 *UA:* ${userAgent.slice(0, 80)}`

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

    return NextResponse.json({
      success: true,
      data: { sheet: sheetResult, telegram: tgResult }
    })
  } catch (error) {
    console.error('Lead registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal.' },
      { status: 500 }
    )
  }
}

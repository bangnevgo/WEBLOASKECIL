import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'

const LYNK_MERCHANT_KEY = process.env.LYNK_MERCHANT_KEY || 'TQTemfantXtdgzr0DZEnRqbVvG7-M5dX'
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || ''

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    let body: any = {}
    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
    }

    // Handle test webhooks or heartbeat
    if (body.test || body.source === 'lena_test' || body.event === 'ping') {
      return NextResponse.json({ success: true, message: 'Lynk.id test webhook received OK' })
    }

    // Extract signature if present
    const receivedSig = request.headers.get('x-lynk-signature') || request.headers.get('X-Lynk-Signature')

    // Parse Lynk.id event payload structure
    const msgData = body.data?.message_data || body.message_data || body
    const customer = msgData.customer || body.customer || {}
    const items = msgData.items || body.items || []
    const totals = msgData.totals || body.totals || {}

    const refId = msgData.refId || body.refId || ''
    const amount = String(totals.grandTotal ?? totals.customerPay ?? body.amount ?? 0)
    const messageId = body.data?.message_id || body.message_id || ''

    // Validate Signature if signature and merchant key are available
    if (receivedSig && LYNK_MERCHANT_KEY) {
      const signatureString = amount + refId + messageId + LYNK_MERCHANT_KEY
      const calculatedSig = crypto.createHash('sha256').update(signatureString).digest('hex')
      if (calculatedSig !== receivedSig) {
        console.warn(`Lynk.id signature mismatch: received ${receivedSig}, calculated ${calculatedSig}`)
        // Note: proceed with caution or log warning
      }
    }

    const email = (customer.email || body.email || '').trim().toLowerCase()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 })
    }

    let name = (customer.name || body.name || email.split('@')[0]).trim()
    if (!name || name === '-') {
      name = email.split('@')[0].replace(/[._-]/g, ' ')
      name = name.charAt(0).toUpperCase() + name.slice(1)
    }

    let phone = (customer.phone || body.phone || '').trim()
    if (phone && phone !== '-' && !phone.startsWith('0') && !phone.startsWith('+')) {
      phone = '0' + phone;
    }

    const itemTitle = items[0]?.title || body.product || 'Lynk.id Product'
    const source = `lynk.id (${itemTitle.slice(0, 30)})`

    // Save or update in Neon DB Postgres
    let dbStatus = 'saved'
    try {
      const existing = await db.lead.findFirst({ where: { email } })
      if (existing) {
        await db.lead.update({
          where: { id: existing.id },
          data: {
            source,
            phone: existing.phone || (phone === '-' ? '' : phone),
            name: existing.name && existing.name !== '-' ? existing.name : name
          }
        })
        dbStatus = 'updated'
      } else {
        await db.lead.create({
          data: {
            name,
            email,
            phone: phone === '-' ? '' : phone,
            source
          }
        })
        dbStatus = 'created'
      }
    } catch (dbErr) {
      console.error('Lynk webhook Neon DB error:', dbErr)
      dbStatus = 'error'
    }

    // Send Telegram Notification
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_ADMIN_CHAT_ID) {
      try {
        const tgMsg = `🛍️ *Lynk.id Transaksi Baru!* 🛍️\n\n👤 *Nama:* ${name}\n📧 *Email:* ${email}\n📱 *No HP/WA:* ${phone || '-'}\n📦 *Produk:* ${itemTitle}\n💰 *Total:* Rp ${Number(amount).toLocaleString('id-ID')}\n🔖 *Ref ID:* \`${refId || '-'}\``
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_ADMIN_CHAT_ID,
            text: tgMsg,
            parse_mode: 'Markdown'
          })
        })
      } catch (tgErr) {
        console.error('Telegram notification error:', tgErr)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      data: { email, dbStatus, source }
    })
  } catch (error: any) {
    console.error('Lynk webhook handler error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

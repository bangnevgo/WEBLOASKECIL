import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzfZgwtmdFd5SYeNWQ5wquN4zjwzreEUB1vwXhT-pKgK4yts9Y-B3NYsUHUMq7FHY-9/exec'
const TELEGRAM_BOT_TOKEN = '8294932959:***'
const TELEGRAM_ADMIN_CHAT_ID = '5729835979'

async function sendToGoogleSheet(data: any) {
  try {
    await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  } catch (e) {
    console.error('Google Sheet Error:', e)
  }
}

async function sendTelegramNotification(data: any) {
  try {
    const message = `🚀 *NEW ORDER RECEIVED!*\n\n` +
                    `👤 *User:* ${data.name}\n` +
                    `📧 *Email:* ${data.email}\n` +
                    `📱 *WhatsApp:* ${data.phone}\n` +
                    `💎 *Tier:* ${data.tier.toUpperCase()}\n` +
                    `🆔 *Order ID:* ${data.orderId}\n\n` +
                    `_Segera hubungi user untuk onboarding!_`

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    })
  } catch (e) {
    console.error('Telegram Error:', e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const transactionStatus = body.transaction_status
    const orderId = body.order_id
    const customerDetails = body.customer_details || {}
    const email = customerDetails.email
    const name = customerDetails.first_name || 'Customer'
    const phone = customerDetails.phone || 'Not provided'

    console.log(`Midtrans Webhook Received: ${orderId} - Status: ${transactionStatus}`)

    if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
      const tier = orderId.includes('MASTER') ? 'master' : 'pelajar'

      // 1. Local DB Activation
      const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
      let code = ''
      for (let i = 0; i < 12; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length))
      }

      await db.activationCode.create({
        data: {
          code: code,
          tier: tier,
          used: false,
          usedBy: email,
        },
      })

      // 2. Send to Google Sheet
      await sendToGoogleSheet({
        name: name,
        email: email,
        phone: phone,
        tier: tier,
        orderId: orderId
      })

      // 3. Send Telegram Notification
      await sendTelegramNotification({
        name, email, phone, tier, orderId
      })

      console.log(`Successfully activated and synced ${email} to Google Sheet and Telegram.`)
    }
    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('Midtrans Webhook Error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

     1|import { NextRequest, NextResponse } from 'next/server'
     2|import { db } from '@/lib/db'
     3|
     4|const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzfZgwtmdFd5SYeNWQ5wquN4zjwzreEUB1vwXhT-pKgK4yts9Y-B3NYsUHUMq7FHY-9/exec'
     5|const TELEGRAM_BOT_TOKEN = '8294932959:***'
     6|const TELEGRAM_ADMIN_CHAT_ID = '5729835979' // This needs to be the actual chat_id of the target channel/user
     7|
     8|async function sendToGoogleSheet(data: any) {
     9|  try {
    10|    await fetch(GOOGLE_SHEET_URL, {
    11|      method: 'POST',
    12|      headers: { 'Content-Type': 'application/json' },
    13|      body: JSON.stringify(data),
    14|    })
    15|  } catch (e) {
    16|    console.error('Google Sheet Error:', e)
    17|  }
    18|}
    19|
    20|async function sendTelegramNotification(data: any) {
    21|  try {
    22|    const message = `🚀 *NEW ORDER RECEIVED!*\n\n` +
    23|                    `👤 *User:* ${data.name}\n` +
    24|                    `📧 *Email:* ${data.email}\n` +
    25|                    `📱 *WhatsApp:* ${data.phone}\n` +
    26|                    `💎 *Tier:* ${data.tier.toUpperCase()}\n` +
    27|                    `🆔 *Order ID:* ${data.orderId}\n\n` +
    28|                    `_Segera hubungi user untuk onboarding!_`
    29|    
    30|    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    31|      method: 'POST',
    32|      headers: { 'Content-Type': 'application/json' },
    33|      body: JSON.stringify({
    34|        chat_id: TELEGRAM_ADMIN_CHAT_ID,
    35|        text: message,
    36|        parse_mode: 'Markdown',
    37|      }),
    38|    })
    39|  } catch (e) {
    40|    console.error('Telegram Error:', e)
    41|  }
    42|}
    43|
    44|export async function POST(req: NextRequest) {
    45|  try {
    46|    const body = await req.json()
    47|    const transactionStatus = body.transaction_status
    48|    const orderId = body.order_id
    49|    const customerDetails = body.customer_details || {}
    50|    const email = customerDetails.email
    51|    const name = customerDetails.first_name || 'Customer'
    52|    const phone = customerDetails.phone || 'Not provided'
    53|
    54|    console.log(`Midtrans Webhook Received: ${orderId} - Status: ${transactionStatus}`)
    55|
    56|    if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
    57|      const tier = orderId.includes('MASTER') ? 'master' : 'pelajar'
    58|      
    59|      // 1. Local DB Activation
    60|      const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    61|      let code = ''
    62|      for (let i = 0; i < 12; i++) {
    63|        code += characters.charAt(Math.floor(Math.random() * characters.length))
    64|      }
    65|
    66|      await db.activationCode.create({
    67|        data: {
    68|          code: code,
    69|          tier: tier,
    70|          used: false,
    71|          usedBy: email,
    72|        },
    73|      })
    74|
    75|      // 2. Send to Google Sheet
    76|      await sendToGoogleSheet({
    77|        name: name,
    78|        email: email,
    79|        phone: phone,
    80|        tier: tier,
    81|        orderId: orderId
    82|      })
    83|
    84|      // 3. Send Telegram Notification
    85|      await sendTelegramNotification({
    86|        name, email, phone, tier, orderId
    87|      })
    88|
    89|      console.log(`Successfully activated and synced ${email} to Google Sheet and Telegram.`)
    90|    }
    91|    return NextResponse.json({ status: 'ok' })
    92|  } catch (error: any) {
    93|    console.error('Midtrans Webhook Error:', error)
    94|    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    95|  }
    96|}
    97|
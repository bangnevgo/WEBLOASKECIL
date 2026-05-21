import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const transactionStatus = body.transaction_status
    const orderId = body.order_id
    const customerEmail = body.customer_details?.email

    console.log(`Midtrans Webhook Received: ${orderId} - Status: ${transactionStatus}`)

    if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
      // Determine tier from orderId
      const tier = orderId.includes('MASTER') ? 'master' : 'pelajar'
      
      // Generate activation code but associate it with the email immediately
      const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
      let code = ''
      for (let i = 0; i < 12; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length))
      }

      // Save to Database with user email
      await db.activationCode.create({
        data: {
          code: code,
          tier: tier,
          used: false,
          usedBy: customerEmail || 'Customer',
        },
      })

      console.log(`Successfully activated access for ${customerEmail} via order ${orderId}. Code: ${code}`)
      
      // NOTE: In a full system, we would trigger an email here giving them the code
      // OR we would update a User table: await db.user.update({ where: { email }, data: { isSubscribed: true } })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('Midtrans Webhook Error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

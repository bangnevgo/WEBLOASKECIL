import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { crypto } from 'node:crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Midtrans sends different events. We only care about 'settlement' (paid)
    const transactionStatus = body.transaction_status
    const orderId = body.order_id

    console.log(`Midtrans Webhook Received: ${orderId} - Status: ${transactionStatus}`)

    if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
      // 1. Generate a random activation code
      const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
      let code = ''
      for (let i = 0; i < 12; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length))
      }

      // 2. Determine tier from orderId or metadata (for simplicity, let's use a default or encode in orderId)
      // In a real system, you'd store the orderId in a 'PendingPayment' table
      const tier = orderId.includes('MASTER') ? 'master' : 'pelajar'

      // 3. Save to Database
      await db.activationCode.create({
        data: {
          code: code,
          tier: tier,
          used: false,
          usedBy: body.customer_details?.first_name || 'Customer',
        },
      })

      console.log(`Successfully generated code ${code} for order ${orderId}`)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('Midtrans Webhook Error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

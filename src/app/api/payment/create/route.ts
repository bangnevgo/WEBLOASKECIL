import { NextRequest, NextResponse } from 'next/server'
import MidtransClient from 'midtrans-client'

const midclient = new MidtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { tier, email, name } = await req.json()

    if (!tier || !email) {
      return NextResponse.json({ error: 'Tier dan email diperlukan' }, { status: 400 })
    }

    const pricing: Record<string, number> = {
      pelajar: 99000,
      master: 299000,
    }

    const amount = pricing[tier] || 150000
    
    // Use a structured order_id that allows the webhook to identify the tier
    // Format: ORDER-{timestamp}-{tier}-{random}
    const orderId = `ORDER-${Date.now()}-${tier.toUpperCase()}-${Math.floor(Math.random() * 1000)}`

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: name || 'User',
        email: email,
      },
    }

    const snapToken = await midclient.createTransaction(parameter)

    return NextResponse.json({
      success: true,
      token: snapToken.token,
      redirectUrl: snapToken.redirect_url,
      orderId: orderId
    })
  } catch (error: any) {
    console.error('Midtrans Create Error:', error)
    return NextResponse.json({ error: error.message || 'Gagal membuat transaksi' }, { status: 500 })
  }
}

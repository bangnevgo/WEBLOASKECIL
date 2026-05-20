import { NextRequest, NextResponse } from 'next/server'
import MidtransClient from 'midtrans-client'
import { crypto } from 'node:crypto'

const midclient = new MidtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { tier, email, name } = await req.json()

    if (!tier || !email) {
      return NextResponse.json({ error: 'Tier dan email diperlukan' }, { status: 400 })
    }

    // Tentukan harga berdasarkan tier
    const pricing: Record<string, number> = {
      'pelajar': 150000, // Contoh harga
      'master': 500000,  // Contoh harga
    }

    const amount = pricing[tier] || 150000

    const transactionDetails = {
      order_id: `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      gross_amount: amount,
    }

    const customerDetails = {
      first_name: name || 'User',
      email: email,
    }

    const snapToken = await midclient.createTransaction(transactionDetails, customerDetails)

    return NextResponse.json({
      success: true,
      token: snapToken.token,
      redirectUrl: snapToken.redirect_url,
    })
  } catch (error: any) {
    console.error('Midtrans Create Error:', error)
    return NextResponse.json({ error: error.message || 'Gagal membuat transaksi' }, { status: 500 })
  }
}

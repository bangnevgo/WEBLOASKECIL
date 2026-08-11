import { NextRequest, NextResponse } from 'next/server';
import { getAvailableTimeSlots } from '@/lib/google-calendar';

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json(
        { success: false, error: 'Format tanggal wajib YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const slots = await getAvailableTimeSlots(dateStr);

    const response = NextResponse.json({
      success: true,
      date: dateStr,
      slots,
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error: any) {
    console.error('API booking/availability error:', error);
    const response = NextResponse.json(
      { success: false, error: 'Gagal mengambil ketersediaan slot jam.' },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}


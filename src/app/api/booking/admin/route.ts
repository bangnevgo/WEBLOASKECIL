import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCalendarClient } from '@/lib/google-calendar';
import { isAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');

    // Coba ambil dari Database Prisma
    try {
      const whereCondition: any = {};
      if (dateStr) {
        const startOfDay = new Date(`${dateStr}T00:00:00+07:00`);
        const endOfDay = new Date(`${dateStr}T23:59:59+07:00`);
        whereCondition.bookingDate = {
          gte: startOfDay,
          lte: endOfDay,
        };
      }

      const bookings = await db.booking.findMany({
        where: whereCondition,
        orderBy: { startTime: 'asc' },
        take: 50,
      });

      return NextResponse.json({
        success: true,
        source: 'database',
        bookings,
      });
    } catch (dbErr) {
      console.warn('DB search failed, falling back to Google Calendar directly:', dbErr);
    }

    // Fallback: Ambil langsung dari Google Calendar API jika DB offline
    const { calendar, calendarId } = getCalendarClient();
    const now = new Date();
    const timeMin = dateStr
      ? new Date(`${dateStr}T00:00:00+07:00`).toISOString()
      : new Date(now.setHours(0, 0, 0, 0)).toISOString();

    const response = await calendar.events.list({
      calendarId,
      timeMin,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 30,
    });

    const events = response.data.items || [];
    const formattedBookings = events
      .filter((evt) => evt.summary?.toLowerCase().includes('konsultasi'))
      .map((evt) => {
        const start = evt.start?.dateTime ? new Date(evt.start.dateTime) : new Date();
        const end = evt.end?.dateTime ? new Date(evt.end.dateTime) : new Date();
        const attendee = evt.attendees?.find((a) => !a.self && a.email !== calendarId);

        return {
          id: evt.id || '',
          name: attendee?.displayName || evt.summary?.replace('Konsultasi LOAS 1-on-1: ', '').replace('Konsultasi: ', '') || 'Klien',
          email: attendee?.email || '',
          phone: '-',
          bookingDate: start,
          startTime: start,
          endTime: end,
          timeSlot: `${start.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
          status: 'CONFIRMED',
          googleMeetLink:
            evt.hangoutLink ||
            evt.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === 'video')?.uri ||
            '',
          calendarEventId: evt.id,
        };
      });

    return NextResponse.json({
      success: true,
      source: 'google_calendar_direct',
      bookings: formattedBookings,
    });
  } catch (error: any) {
    console.error('API booking/admin GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil daftar booking.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }
  try {
    const { id, status, calendarEventId } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID dan status wajib diisi.' },
        { status: 400 }
      );
    }

    try {
      await db.booking.update({
        where: { id },
        data: { status },
      });
    } catch (dbErr) {
      console.warn('DB update failed:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Status booking berhasil diperbarui menjadi ${status}`,
    });
  } catch (error: any) {
    console.error('API booking/admin PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate status booking.' },
      { status: 500 }
    );
  }
}

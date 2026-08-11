import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createCalendarEvent, getAvailableTimeSlots } from '@/lib/google-calendar';

const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, dateStr, startTimeStr, endTimeStr, timeSlotLabel, notes, source } = body;

    if (!name || !email || !phone || !dateStr || !startTimeStr || !endTimeStr) {
      return NextResponse.json(
        { success: false, error: 'Semua field (nama, email, phone, tanggal, jam) wajib diisi.' },
        { status: 400 }
      );
    }

    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'Format email tidak valid.' },
        { status: 400 }
      );
    }

    // Check slot availability (enforces 3-limit per day and 1 day in advance rule)
    const availableSlots = await getAvailableTimeSlots(dateStr);
    const targetSlot = availableSlots.find((s) => s.startTime === startTimeStr);
    if (!targetSlot || !targetSlot.available) {
      return NextResponse.json(
        { success: false, error: 'Slot waktu ini sudah tidak tersedia atau kuota hari ini sudah penuh.' },
        { status: 400 }
      );
    }

    // 1. Buat Event di Google Calendar & Google Meet
    let calendarResult = { eventId: '', meetLink: '', htmlLink: '' };
    try {
      calendarResult = await createCalendarEvent({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        dateStr,
        startTimeStr,
        endTimeStr,
        timeSlotLabel: timeSlotLabel || `${startTimeStr} - ${endTimeStr} WIB`,
        notes: notes?.trim() || '',
      });
    } catch (gcalErr: any) {
      console.error('Google Calendar event creation error:', gcalErr);
    }

    const startDateTime = new Date(`${dateStr}T${startTimeStr}:00+07:00`);
    const endDateTime = new Date(`${dateStr}T${endTimeStr}:00+07:00`);
    const bookingDate = new Date(`${dateStr}T00:00:00+07:00`);

    // 2. Simpan ke Prisma DB jika server DB online
    let dbBookingId = '';
    try {
      const newBooking = await db.booking.create({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          notes: notes?.trim() || '',
          bookingDate,
          startTime: startDateTime,
          endTime: endDateTime,
          timeSlot: timeSlotLabel || `${startTimeStr} - ${endTimeStr} WIB`,
          status: 'CONFIRMED',
          googleMeetLink: calendarResult.meetLink,
          calendarEventId: calendarResult.eventId,
        },
      });
      dbBookingId = newBooking.id;

      // Juga simpan lead jika belum ada
      const existingLead = await db.lead.findFirst({ where: { email: email.trim().toLowerCase() } });
      if (!existingLead) {
        await db.lead.create({
          data: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            source: source || 'booking_konsultasi',
          },
        });
      }
    } catch (dbErr) {
      console.error('Database booking save error:', dbErr);
    }

    // 3. Kirim Notifikasi ke Telegram Admin
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_ADMIN_CHAT_ID) {
      try {
        const tgMessage =
          `📅 *BOOKING KONSULTASI BARU!* 📅\n\n` +
          `👤 *Nama:* ${name}\n` +
          `📧 *Email:* ${email}\n` +
          `📱 *No WA:* ${phone}\n` +
          `🗓 *Tanggal:* ${dateStr}\n` +
          `⏰ *Jam:* ${timeSlotLabel || startTimeStr + ' - ' + endTimeStr}\n` +
          `📝 *Catatan:* ${notes || '-'}\n` +
          `🎥 *Google Meet:* ${calendarResult.meetLink || 'Terjadwal di Google Calendar'}\n\n` +
          `✉️ *Status:* Email balasan & undangan kalender otomatis dikirim ke klien!`;

        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_ADMIN_CHAT_ID,
            text: tgMessage,
            parse_mode: 'Markdown',
          }),
        });
      } catch (tgErr) {
        console.error('Telegram notification error:', tgErr);
      }
    }

    // 4. Kirim ke Google Sheet Intake jika URL tersedia
    if (GOOGLE_SHEET_URL) {
      try {
        await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'booking_konsultasi',
            name,
            email,
            phone,
            dateStr,
            timeSlot: timeSlotLabel || `${startTimeStr} - ${endTimeStr} WIB`,
            notes,
            meetLink: calendarResult.meetLink,
            timestamp: new Date().toISOString(),
            source: 'booking_modal',
          }),
        });
      } catch (sheetErr) {
        console.error('Google Sheet send error:', sheetErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Booking berhasil dibuat dan terintegrasi dengan Google Calendar!',
      data: {
        bookingId: dbBookingId,
        eventId: calendarResult.eventId,
        meetLink: calendarResult.meetLink,
        dateStr,
        timeSlot: timeSlotLabel || `${startTimeStr} - ${endTimeStr} WIB`,
      },
    });
  } catch (error: any) {
    console.error('Create booking API error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal saat membuat booking.' },
      { status: 500 }
    );
  }
}

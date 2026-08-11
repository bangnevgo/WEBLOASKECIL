import { google } from 'googleapis';

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'bangnevgo@gmail.com';

function buildGoogleCredentials() {
  if (process.env.GA4_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.GA4_SERVICE_ACCOUNT_JSON);
    } catch {
      // Fallback to env vars
    }
  }

  const pk = process.env.GA4_PRIVATE_KEY;
  return {
    type: 'service_account',
    project_id: process.env.GA4_PROJECT_ID,
    private_key_id: process.env.GA4_PRIVATE_KEY_ID,
    private_key: pk ? pk.replace(/\\n/g, '\n') : undefined,
    client_email: process.env.GA4_SERVICE_ACCOUNT_EMAIL,
    client_id: process.env.GA4_CLIENT_ID || '',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      process.env.GA4_CLIENT_X509_CERT_URL ||
      `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(
        process.env.GA4_SERVICE_ACCOUNT_EMAIL || ''
      )}`,
  };
}

export function getCalendarClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: buildGoogleCredentials(),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  return { calendar: google.calendar({ version: 'v3', auth }), calendarId: CALENDAR_ID };
}

export interface TimeSlot {
  startTime: string; // e.g. "10:00"
  endTime: string;   // e.g. "11:00"
  label: string;     // e.g. "10:00 - 11:00 WIB"
  available: boolean;
}

// Slot jam default yang disediakan untuk konsultasi harian (WIB / UTC+7)
export const DEFAULT_DAILY_SLOTS = [
  { startTime: '10:00', endTime: '11:00', label: '10:00 - 11:00 WIB' },
  { startTime: '13:00', endTime: '14:00', label: '13:00 - 14:00 WIB' },
  { startTime: '15:00', endTime: '16:00', label: '15:00 - 16:00 WIB' },
  { startTime: '19:00', endTime: '20:00', label: '19:00 - 20:00 WIB' },
  { startTime: '20:00', endTime: '21:00', label: '20:00 - 21:00 WIB' },
];

/**
 * Mendapatkan ketersediaan slot jam pada tanggal tertentu (YYYY-MM-DD)
 */
export async function getAvailableTimeSlots(dateStr: string): Promise<TimeSlot[]> {
  try {
    const { calendar, calendarId } = getCalendarClient();

    // Enforce "booking only starting from next day" rule (relative to WIB / UTC+7 timezone)
    const wibNow = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const todayStr = wibNow.toISOString().split('T')[0];
    if (dateStr <= todayStr) {
      return DEFAULT_DAILY_SLOTS.map((slot) => ({
        ...slot,
        available: false,
      }));
    }

    // Waktu mulai & selesai hari (Asia/Jakarta = UTC+7)
    const timeMin = new Date(`${dateStr}T00:00:00+07:00`).toISOString();
    const timeMax = new Date(`${dateStr}T23:59:59+07:00`).toISOString();

    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];

    // Limit maximum 3 bookings per day (case-insensitive search for 'konsultasi' in event summaries)
    const consultationCount = events.filter((evt) =>
      evt.summary?.toLowerCase().includes('konsultasi')
    ).length;

    const MAX_DAILY_BOOKINGS = 3;
    if (consultationCount >= MAX_DAILY_BOOKINGS) {
      return DEFAULT_DAILY_SLOTS.map((slot) => ({
        ...slot,
        available: false,
      }));
    }

    return DEFAULT_DAILY_SLOTS.map((slot) => {
      const slotStart = new Date(`${dateStr}T${slot.startTime}:00+07:00`).getTime();
      const slotEnd = new Date(`${dateStr}T${slot.endTime}:00+07:00`).getTime();

      // Cek apakah slot ini bentrok dengan event yang sudah ada di Google Calendar
      const isOverlap = events.some((evt) => {
        if (!evt.start?.dateTime || !evt.end?.dateTime) return false;
        const evtStart = new Date(evt.start.dateTime).getTime();
        const evtEnd = new Date(evt.end.dateTime).getTime();

        return Math.max(slotStart, evtStart) < Math.min(slotEnd, evtEnd);
      });

      return {
        ...slot,
        available: !isOverlap,
      };
    });
  } catch (error) {
    console.error('Error fetching calendar availability:', error);
    // Fallback: anggap semua slot tersedia jika API error/offline
    return DEFAULT_DAILY_SLOTS.map((slot) => ({ ...slot, available: true }));
  }
}

export interface CreateBookingParams {
  name: string;
  email: string;
  phone: string;
  dateStr: string;     // YYYY-MM-DD
  startTimeStr: string; // e.g. "10:00"
  endTimeStr: string;   // e.g. "11:00"
  timeSlotLabel: string;
  notes?: string;
}

/**
 * Membuat event Google Calendar baru lengkap dengan link Google Meet dan mengundang email klien
 */
export async function createCalendarEvent(params: CreateBookingParams) {
  const { calendar, calendarId } = getCalendarClient();

  const startDateTime = new Date(`${params.dateStr}T${params.startTimeStr}:00+07:00`).toISOString();
  const endDateTime = new Date(`${params.dateStr}T${params.endTimeStr}:00+07:00`).toISOString();

  const eventRequestBody: any = {
    summary: `Konsultasi LOAS 1-on-1: ${params.name}`,
    description: `✦ **Sesi Konsultasi Private LOAS** ✦\n\n👤 **Nama:** ${params.name}\n📧 **Email:** ${params.email}\n📱 **WhatsApp:** ${params.phone}\n📝 **Catatan:** ${params.notes || '-'}\n\nLink Google Meet otomatis disertakan di bawah. Mohon hadir 5 menit sebelum sesi dimulai.`,
    start: {
      dateTime: startDateTime,
      timeZone: 'Asia/Jakarta',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Asia/Jakarta',
    },
    attendees: [
      { email: params.email, displayName: params.name },
      { email: CALENDAR_ID, displayName: 'Bang Nevgo (Mentor)' },
    ],
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 hari sebelum
        { method: 'email', minutes: 60 },      // 1 jam sebelum
        { method: 'popup', minutes: 15 },      // 15 menit sebelum
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId,
    requestBody: eventRequestBody,
    conferenceDataVersion: 1,
    sendUpdates: 'all', // Mengirim email balasan undangan ke semua attendee (klien + mentor)
  });

  const createdEvent = response.data;
  const meetLink =
    createdEvent.hangoutLink ||
    createdEvent.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === 'video')?.uri ||
    '';

  return {
    eventId: createdEvent.id || '',
    meetLink,
    htmlLink: createdEvent.htmlLink || '',
  };
}

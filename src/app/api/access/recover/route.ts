import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('62')) return `0${digits.slice(2)}`;
  if (digits.startsWith('8')) return `0${digits}`;
  return digits;
}

/**
 * Server-only identity recovery for the Mini Course worker. The public client
 * never receives the admin key and must provide an exact email or phone match.
 */
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorizedResponse();

  try {
    const body = await req.json();
    const identifier = String(body.identifier || '').trim().toLowerCase();
    if (!identifier) {
      return NextResponse.json({ success: false, error: 'Identifier wajib diisi.' }, { status: 400 });
    }

    let email = identifier.includes('@') ? identifier : '';
    let matchedLead: { name: string; email: string; phone: string } | null = null;

    if (!email) {
      const normalized = normalizePhone(identifier);
      if (normalized.length < 8) {
        return NextResponse.json({ success: false, error: 'Akses tidak ditemukan.' }, { status: 404 });
      }
      const candidates = await db.lead.findMany({
        where: { phone: { contains: normalized.slice(-8) } },
        select: { name: true, email: true, phone: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
      matchedLead = candidates.find((lead) => normalizePhone(lead.phone) === normalized) || null;
      email = matchedLead?.email.trim().toLowerCase() || '';
    }

    if (!email) {
      return NextResponse.json({ success: false, error: 'Akses tidak ditemukan.' }, { status: 404 });
    }

    const user = await db.user.findUnique({
      where: { email },
      select: { email: true, name: true, tier: true },
    });
    if (!user || !['premium', 'master'].includes(user.tier)) {
      return NextResponse.json({ success: false, error: 'Akses tidak ditemukan.' }, { status: 404 });
    }

    if (!matchedLead) {
      matchedLead = await db.lead.findFirst({
        where: { email: user.email },
        select: { name: true, email: true, phone: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({
      success: true,
      student: {
        name: user.name || matchedLead?.name || user.email.split('@')[0],
        email: user.email,
        phone: matchedLead?.phone || '',
        tier: user.tier,
      },
    });
  } catch (error: any) {
    console.error('Access recovery error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memulihkan akses.' },
      { status: 500 }
    );
  }
}

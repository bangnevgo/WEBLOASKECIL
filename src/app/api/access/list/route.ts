import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { normalizeDistributionStatus, normalizeTier } from '@/lib/access-tier-policy.mjs';

/**
 * GET /api/access/list
 * Admin-only: lists users who hold paid access (premium/master tiers) so the
 * Mini Course admin panel can show the real roster from the DB (source of
 * truth) instead of a client-side copy.
 * Auth: `x-admin-key` header must match ADMIN_ACCESS_KEY (server-only secret).
 */
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || '';

export async function GET(req: NextRequest) {
  const providedKey = req.headers.get('x-admin-key') || '';
  if (!ADMIN_ACCESS_KEY || providedKey !== ADMIN_ACCESS_KEY) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await db.user.findMany({
      where: { tier: { in: ['legacy', 'premium', 'bootcamp', 'master'] } },
      select: {
        email: true,
        name: true,
        tier: true,
        distributionStatus: true,
        distributedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    const leads = users.length > 0
      ? await db.lead.findMany({
          where: { email: { in: users.map((user) => user.email) } },
          select: { name: true, email: true, phone: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        })
      : [];
    const latestLeadByEmail = new Map<string, (typeof leads)[number]>();
    for (const lead of leads) {
      const email = lead.email.trim().toLowerCase();
      if (!latestLeadByEmail.has(email)) latestLeadByEmail.set(email, lead);
    }

    return NextResponse.json({
      success: true,
      total: users.length,
      students: users.map((u) => {
        const lead = latestLeadByEmail.get(u.email.trim().toLowerCase());
        return {
        name: u.name || lead?.name || u.email.split('@')[0],
        email: u.email,
        phone: lead?.phone || '',
        tier: normalizeTier(u.tier),
        distributionStatus: normalizeDistributionStatus(u.distributionStatus),
        distributedAt: u.distributedAt,
        joinedAt: u.createdAt,
      }}),
    });
  } catch (error: any) {
    console.error('Access list error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memuat daftar akses.' },
      { status: 500 }
    );
  }
}

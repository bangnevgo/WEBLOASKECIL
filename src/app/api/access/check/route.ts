import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hasProgramAccess, normalizeTier } from '@/lib/access-tier-policy.mjs';

/**
 * GET /api/access/check?email=...&program=MINI_COURSE|BOOTCAMP
 * Returns whether the email has access to the given program.
 * - Reads User.tier from the shared Neon DB.
 * - Auth: `x-admin-key` header must match PUBLIC_ACCESS_KEY (safe to expose to client;
 *   this endpoint only returns a boolean per email, no data leakage).
 */
const PUBLIC_ACCESS_KEY = process.env.PUBLIC_ACCESS_KEY || '';

export async function GET(req: NextRequest) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'x-admin-key',
  };

  try {
    const providedKey = req.headers.get('x-admin-key') || '';
    if (!PUBLIC_ACCESS_KEY || providedKey !== PUBLIC_ACCESS_KEY) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401, headers });
    }

    const { searchParams } = new URL(req.url);
    const email = (searchParams.get('email') || '').trim().toLowerCase();
    const program = (searchParams.get('program') || '').toUpperCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Email wajib diisi dan valid.' }, { status: 400, headers });
    }
    if (!['MINI_COURSE', 'BOOTCAMP'].includes(program)) {
      return NextResponse.json({ success: false, error: 'Program tidak valid.' }, { status: 400, headers });
    }

    const user = await db.user.findUnique({ where: { email } });

    const tier = normalizeTier(user?.tier || 'free');
    const granted = user ? hasProgramAccess(tier, program) : false;

    return NextResponse.json(
      { success: true, email, program, granted, tier },
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error('Access check error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan server.' },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'x-admin-key',
      },
    }
  );
}

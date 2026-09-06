import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { normalizeTier, resolveGrantTier, tierRank } from '@/lib/access-tier-policy.mjs';

/**
 * POST /api/access/grant
 * Admin grants/revokes program access for a student email.
 * - Sets User.tier in the shared Neon DB (works across all devices & sites).
 * - Auth: `x-admin-key` header must match ADMIN_ACCESS_KEY (server-only secret).
 *
 * Body: { email, program: "MINI_COURSE" | "BOOTCAMP", action: "grant" | "revoke" }
 */
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || '';

export async function POST(req: NextRequest) {
  // CORS for Mini Course admin UI
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-key',
  };

  try {
    const providedKey = req.headers.get('x-admin-key') || '';
    if (!ADMIN_ACCESS_KEY || providedKey !== ADMIN_ACCESS_KEY) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401, headers });
    }

    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const program = (body.program || '').toUpperCase();
    const action = (body.action || '').toLowerCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Email wajib diisi dan valid.' }, { status: 400, headers });
    }
    if (!['MINI_COURSE', 'BOOTCAMP'].includes(program)) {
      return NextResponse.json({ success: false, error: 'Program tidak valid.' }, { status: 400, headers });
    }
    if (!['grant', 'revoke'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Action tidak valid.' }, { status: 400, headers });
    }

    // Find existing user (email unique) or prepare to create one
    let user = await db.user.findUnique({ where: { email } });

    if (action === 'grant') {
      const targetTier = resolveGrantTier(program, body.tier);
      if (user) {
        // Grant: upgrade tier if the target tier is higher than current
        if (tierRank(targetTier) > tierRank(user.tier)) {
          user = await db.user.update({
            where: { id: user.id },
            data: { tier: targetTier },
          });
        }
      } else {
        // Create a minimal user record (passwordHash marks it as pending payment/manual grant)
        user = await db.user.create({
          data: {
            email,
            name: email.split('@')[0],
            passwordHash: 'pending_payment_registration',
            tier: targetTier,
          },
        });
      }
    } else if (program === 'MINI_COURSE') {
      // A Bootcamp account also holds Mini Course access. Refuse an ambiguous
      // schema cannot safely remove only Mini Course, so refuse the ambiguous
      // downgrade instead of silently destroying the stronger entitlement.
      if (normalizeTier(user?.tier) === 'bootcamp') {
        return NextResponse.json(
          { success: false, error: 'Akun Bootcamp tidak dapat dicabut lewat revoke Mini Course.' },
          { status: 409, headers }
        );
      }
      if (user && ['legacy', 'premium'].includes(normalizeTier(user.tier))) {
        user = await db.user.update({
          where: { id: user.id },
          data: { tier: 'free' },
        });
      }
    } else {
      // Removing Bootcamp preserves the lower Mini Course entitlement.
      if (user && normalizeTier(user.tier) === 'bootcamp') {
        user = await db.user.update({
          where: { id: user.id },
          data: { tier: 'premium' },
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User tidak ditemukan.' },
        { status: 404, headers }
      );
    }

    return NextResponse.json(
      {
        success: true,
        email: user.email,
        tier: normalizeTier(user.tier),
        program,
        action,
      },
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error('Access grant error:', error);
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
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-admin-key',
      },
    }
  );
}

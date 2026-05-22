import { NextResponse } from 'next/server';
import { normalizeEmail } from '@/lib/user-store';
import { findUserByEmailServer, toPublicUser } from '@/lib/users-repository.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const email = new URL(req.url).searchParams.get('email')?.trim() ?? '';
  if (!email) {
    return NextResponse.json({ ok: false as const, error: 'missing_email' }, { status: 400 });
  }
  const user = await findUserByEmailServer(normalizeEmail(email));
  if (!user) {
    return NextResponse.json({ ok: false as const, error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true as const, user: toPublicUser(user) });
}

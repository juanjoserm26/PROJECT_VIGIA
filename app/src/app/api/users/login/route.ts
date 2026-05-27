import { NextResponse } from 'next/server';
import { authenticateUserServer, toPublicUser } from '@/lib/users-repository.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = typeof body.email === 'string' ? body.email : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const result = await authenticateUserServer(email, password);
    if (!result.ok) {
      return NextResponse.json(result, { status: 401 });
    }
    if (result.user.authProvider === 'google') {
      return NextResponse.json({
        ok: false as const,
        error: 'Esta cuenta usa Google. Pulsa «Iniciar sesión con Google».',
      }, { status: 401 });
    }
    return NextResponse.json({ ok: true as const, user: toPublicUser(result.user) });
  } catch (e) {
    console.error('Login error:', e);
    return NextResponse.json(
      {
        ok: false as const,
        error: 'No pudimos verificar tu cuenta. Intenta de nuevo en unos segundos.',
      },
      { status: 500 },
    );
  }
}

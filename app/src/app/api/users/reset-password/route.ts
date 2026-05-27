import { NextResponse } from 'next/server';
import { normalizeEmail, validatePassword } from '@/lib/user-store';
import { updateUserPasswordServer } from '@/lib/users-repository.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = typeof body.email === 'string' ? body.email : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!normalizeEmail(email)) {
      return NextResponse.json(
        { ok: false as const, error: 'Ingresa tu correo electrónico.' },
        { status: 400 },
      );
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      return NextResponse.json({ ok: false as const, error: pwdError }, { status: 400 });
    }

    const result = await updateUserPasswordServer(email, password);
    if (!result.ok) {
      return NextResponse.json(result, { status: result.error.includes('Google') ? 400 : 404 });
    }

    return NextResponse.json({ ok: true as const });
  } catch (e) {
    console.error('Reset password error:', e);
    return NextResponse.json(
      { ok: false as const, error: 'No pudimos actualizar la contraseña. Intenta de nuevo.' },
      { status: 500 },
    );
  }
}

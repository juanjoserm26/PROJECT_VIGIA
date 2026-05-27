import { NextResponse } from 'next/server';
import type { RegisterUserInput } from '@/lib/user-store';
import { registerUserServer, toPublicUser } from '@/lib/users-repository.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterUserInput;
    const result = await registerUserServer(body);
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json({ ok: true as const, user: toPublicUser(result.user) });
  } catch (e) {
    console.error('Register error:', e);
    return NextResponse.json(
      {
        ok: false as const,
        error: 'No pudimos crear la cuenta en el servidor. Intenta de nuevo.',
      },
      { status: 500 },
    );
  }
}

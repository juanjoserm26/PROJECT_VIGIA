import { NextResponse } from 'next/server';

/**
 * Intercambia el código OAuth de Google Identity Services (ux_mode: popup, redirect_uri: postmessage)
 * por el perfil del usuario. El cliente debe comprobar que exista cuenta en PROJECT VIGIA.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { code?: string };
    const code = typeof body.code === 'string' ? body.code.trim() : '';
    if (!code) {
      return NextResponse.json({ ok: false as const, error: 'missing_code' }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID ?? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ ok: false as const, error: 'server_config' }, { status: 503 });
    }

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: 'postmessage',
        grant_type: 'authorization_code',
      }),
    });

    const tokenJson = (await tokenRes.json()) as {
      access_token?: string;
      error?: string;
    };

    if (!tokenRes.ok || !tokenJson.access_token) {
      return NextResponse.json(
        { ok: false as const, error: 'token_exchange_failed' },
        { status: 401 },
      );
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    });

    const profile = (await userRes.json()) as {
      email?: string;
      email_verified?: boolean;
      name?: string;
    };

    if (!userRes.ok || !profile.email) {
      return NextResponse.json({ ok: false as const, error: 'profile_failed' }, { status: 401 });
    }

    if (profile.email_verified === false) {
      return NextResponse.json({ ok: false as const, error: 'email_not_verified' }, { status: 403 });
    }

    return NextResponse.json({
      ok: true as const,
      email: profile.email,
      name: typeof profile.name === 'string' ? profile.name : '',
    });
  } catch {
    return NextResponse.json({ ok: false as const, error: 'internal' }, { status: 500 });
  }
}

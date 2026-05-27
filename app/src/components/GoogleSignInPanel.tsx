'use client';

import { useCallback, useEffect, useState } from 'react';
import PasswordField, { authInputClass } from '@/components/PasswordField';
import {
  authenticateUserAsync,
  cacheUserFromPublic,
  getGoogleRememberedEmail,
  setGoogleRememberedEmail,
  type PublicStoredUser,
  type StoredUser,
} from '@/lib/user-store';
import { clientLabelFromProfile, type DemoSession } from '@/lib/demo-session';

type GoogleSignInPanelProps = {
  onSuccess: (session: DemoSession) => void;
  onCancel?: () => void;
  compact?: boolean;
};

const GSI_SCRIPT_ID = 'google-gsi-script';
const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const OAUTH_SCOPE =
  'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

function GoogleLogo() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function sessionFromUser(user: StoredUser, freshAccount = false): DemoSession {
  return {
    email: user.email,
    clientLabel: clientLabelFromProfile(user.nombres, user.apellidos),
    createdAt: Date.now(),
    freshAccount,
  };
}

export function buildSessionForUser(user: StoredUser, freshAccount = false): DemoSession {
  return sessionFromUser(user, freshAccount);
}

function loadGsiScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('window'));
  if (window.google?.accounts?.oauth2) return Promise.resolve();

  const existing = document.getElementById(GSI_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.oauth2) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('gsi_load')), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.id = GSI_SCRIPT_ID;
    s.src = GSI_SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('gsi_load'));
    document.head.appendChild(s);
  });
}

export default function GoogleSignInPanel({ onSuccess, onCancel, compact }: GoogleSignInPanelProps) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? '';
  const oauthConfigured = Boolean(googleClientId);

  const [showVigiaForm, setShowVigiaForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [remembered, setRemembered] = useState<string | null>(null);
  useEffect(() => {
    setRemembered(getGoogleRememberedEmail());
  }, []);

  const loginWithUser = useCallback(
    (user: StoredUser, freshAccount = false) => {
      setGoogleRememberedEmail(user.email);
      setBannerError(null);
      setError(null);
      onSuccess(sessionFromUser(user, freshAccount));
    },
    [onSuccess],
  );

  const completeGoogleAuth = useCallback(
    (publicUser: PublicStoredUser, message?: string) => {
      const user = cacheUserFromPublic(publicUser, '');
      if (message) setBannerSuccess(message);
      loginWithUser(user, false);
    },
    [loginWithUser],
  );

  async function startGoogleOAuthPopup() {
    setBannerError(null);
    setBannerSuccess(null);
    setError(null);
    setBusy(true);
    try {
      await loadGsiScript();
      const oauth2 = window.google?.accounts?.oauth2;
      if (!oauth2) {
        setBannerError(
          'No se pudo cargar Google. Permite ventanas emergentes o usa el formulario de correo PROJECT VIGIA arriba.',
        );
        setBusy(false);
        return;
      }

      const client = oauth2.initCodeClient({
        client_id: googleClientId,
        scope: OAUTH_SCOPE,
        ux_mode: 'popup',
        select_account: true,
        callback: async (response) => {
          try {
            if (response.error) {
              const benign =
                response.error === 'popup_closed_by_user' ||
                response.error === 'user_closed_popup';
              if (!benign) {
                setBannerError(
                  response.error_description?.trim() ||
                    'No se pudo completar el inicio con Google. Intenta de nuevo.',
                );
              }
              return;
            }

            const code = response.code;
            if (!code) return;

            const tokenRes = await fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code }),
            });

            const data = (await tokenRes.json()) as
              | { ok: true; email: string; user: PublicStoredUser; created?: boolean }
              | { ok: false; error: string };

            if (!tokenRes.ok || !data.ok) {
              if ('error' in data && data.error === 'server_config') {
                setBannerError(
                  'Falta el secreto de Google en el servidor (GOOGLE_CLIENT_SECRET). En local: cópialo desde Google Cloud Console a app/.env.local (node scripts/setup-google-local.mjs --secret=…). En Vercel: Settings → Environment Variables y vuelve a pegar el secreto si quedó vacío. Mientras tanto usa correo y contraseña PROJECT VIGIA arriba.',
                );
                return;
              }
              setBannerError(
                'No se pudo validar tu cuenta de Google. Comprueba que elegiste la cuenta correcta e intenta otra vez.',
              );
              return;
            }

            completeGoogleAuth(
              data.user,
              data.created
                ? `Cuenta creada con ${data.email}. Ya puedes entrar con Google.`
                : `Sesión iniciada como ${data.email}`,
            );
          } finally {
            setBusy(false);
          }
        },
      });

      client.requestCode();
    } catch {
      setBusy(false);
      setBannerError(
        'No se pudo abrir Google. Permite ventanas emergentes en el navegador e intenta de nuevo.',
      );
    }
  }

  function handleGoogleButtonClick() {
    setBannerError(null);
    setBannerSuccess(null);
    setError(null);
    setShowVigiaForm(false);

    if (!oauthConfigured) {
      setBannerError(
        'Google OAuth no está configurado (falta NEXT_PUBLIC_GOOGLE_CLIENT_ID). Usa correo y contraseña PROJECT VIGIA en el formulario de arriba.',
      );
      return;
    }

    void startGoogleOAuthPopup();
  }

  async function handleVigiaFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await authenticateUserAsync(email, password);
    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }
    setRemembered(result.user.email);
    loginWithUser(result.user);
  }

  if (showVigiaForm) {
    return (
      <div className={`rounded-xl border border-slate-200 bg-slate-50/90 p-4 ${compact ? '' : ''}`}>
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <GoogleLogo />
          Correo y contraseña PROJECT VIGIA
        </p>
        <p className="mb-4 text-xs leading-relaxed text-slate-600">
          Esto <strong>no</strong> es la contraseña de Gmail: es la que definiste en{' '}
          <strong>Crear cuenta</strong>. Para entrar con tu cuenta Google real, usa el botón de
          Google abajo.
        </p>
        {error ? (
          <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
        <form onSubmit={handleVigiaFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="google-email" className="mb-2 block text-sm font-semibold text-slate-800">
              Correo electrónico
            </label>
            <input
              id="google-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInputClass}
              placeholder="tu.correo@gmail.com"
              required
            />
          </div>
          <PasswordField
            id="google-password"
            label="Contraseña PROJECT VIGIA"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            minLength={1}
            placeholder="La de tu registro"
          />
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            Continuar
          </button>
        </form>
        <button
          type="button"
          onClick={() => {
            setShowVigiaForm(false);
            setError(null);
            onCancel?.();
          }}
          className="mt-3 w-full text-center text-sm text-slate-600 hover:text-slate-900"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div>
      {remembered ? (
        <p className="mb-2 text-center text-xs text-slate-500">
          Último acceso con: <strong className="text-slate-700">{remembered}</strong>
        </p>
      ) : null}
      {bannerSuccess ? (
        <p className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs leading-snug text-emerald-900">
          {bannerSuccess}
        </p>
      ) : null}
      {bannerError ? (
        <p className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-snug text-amber-950">
          {bannerError}
        </p>
      ) : null}
      <button
        type="button"
        onClick={handleGoogleButtonClick}
        disabled={busy}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-blue-300 hover:bg-blue-50/50 disabled:opacity-60"
      >
        <GoogleLogo />
        {busy ? 'Abriendo Google…' : 'Iniciar sesión con Google'}
      </button>
      <p className="mt-2 text-center text-[11px] leading-relaxed text-slate-500">
        Se abre la ventana oficial de Google. Puedes usar cualquier cuenta de Gmail; en la ventana
        elige la tuya o «Usar otra cuenta».
      </p>
      <button
        type="button"
        onClick={() => {
          setBannerError(null);
          setError(null);
          const saved = getGoogleRememberedEmail();
          setShowVigiaForm(true);
          if (saved) setEmail(saved);
        }}
        className="mt-3 w-full text-center text-xs font-medium text-slate-600 underline-offset-2 hover:text-blue-700 hover:underline"
      >
        Usar correo y contraseña de PROJECT VIGIA (no es la de Gmail)
      </button>
    </div>
  );
}

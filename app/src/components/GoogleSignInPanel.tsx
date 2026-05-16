'use client';

import { useCallback, useEffect, useState } from 'react';
import PasswordField, { authInputClass } from '@/components/PasswordField';
import {
  authenticateUser,
  findUserByEmail,
  getGoogleRememberedEmail,
  isGoogleTrustedOnDevice,
  setGoogleRememberedEmail,
  setGoogleTrustedOnDevice,
} from '@/lib/user-store';
import { clientLabelFromProfile, type DemoSession } from '@/lib/demo-session';
import type { StoredUser } from '@/lib/user-store';

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

  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [remembered, setRemembered] = useState<string | null>(null);
  const [trusted, setTrusted] = useState(false);

  useEffect(() => {
    setRemembered(getGoogleRememberedEmail());
    setTrusted(isGoogleTrustedOnDevice());
  }, []);

  const loginWithUser = useCallback(
    (user: StoredUser) => {
      setGoogleRememberedEmail(user.email);
      setGoogleTrustedOnDevice(true);
      setBannerError(null);
      setError(null);
      onSuccess(sessionFromUser(user, false));
    },
    [onSuccess],
  );

  function tryQuickLogin(): boolean {
    const saved = getGoogleRememberedEmail();
    if (!saved || !isGoogleTrustedOnDevice()) return false;
    const user = findUserByEmail(saved);
    if (!user) return false;
    loginWithUser(user);
    return true;
  }

  async function startGoogleOAuthPopup() {
    setBannerError(null);
    setError(null);
    setBusy(true);
    try {
      await loadGsiScript();
      const oauth2 = window.google?.accounts?.oauth2;
      if (!oauth2) {
        setBannerError('No se pudo cargar el inicio de sesión de Google. Intenta de nuevo o usa tu correo PROJECT VIGIA.');
        setBusy(false);
        return;
      }

      const client = oauth2.initCodeClient({
        client_id: googleClientId,
        scope: OAUTH_SCOPE,
        ux_mode: 'popup',
        callback: async (response) => {
          try {
            if (response.error) {
              const benign =
                response.error === 'popup_closed_by_user' ||
                response.error === 'user_closed_popup';
              if (!benign) {
                setBannerError(
                  response.error_description?.trim() ||
                    'No se pudo completar el inicio con Google. Puedes usar tu correo PROJECT VIGIA abajo.',
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
              | { ok: true; email: string }
              | { ok: false; error: string };

            if (!tokenRes.ok || !data.ok) {
              if ('error' in data && data.error === 'server_config') {
                setShowForm(true);
                setBannerError(null);
                setError(
                  'Google OAuth no está configurado en el servidor (falta GOOGLE_CLIENT_SECRET). Usa correo y contraseña PROJECT VIGIA.',
                );
                return;
              }
              setBannerError(
                'Google no devolvió una sesión válida. Si estás en un equipo público, inicia sesión en tu cuenta Google en la ventana emergente o usa correo PROJECT VIGIA.',
              );
              return;
            }

            const user = findUserByEmail(data.email);
            if (!user) {
              setBannerError(
                `No hay cuenta PROJECT VIGIA registrada con ${data.email}. Crea tu cuenta con ese mismo correo o inicia sesión arriba.`,
              );
              return;
            }

            loginWithUser(user);
          } finally {
            setBusy(false);
          }
        },
      });

      client.requestCode();
    } catch {
      setBusy(false);
      setBannerError('No se pudo abrir Google. Comprueba que las ventanas emergentes estén permitidas o usa correo PROJECT VIGIA.');
    }
  }

  function handleGoogleButtonClick() {
    setBannerError(null);
    setError(null);
    if (tryQuickLogin()) return;

    if (!oauthConfigured) {
      const saved = getGoogleRememberedEmail();
      setShowForm(true);
      if (saved) setEmail(saved);
      return;
    }

    void startGoogleOAuthPopup();
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = authenticateUser(email, password);
    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }
    setRemembered(result.user.email);
    setTrusted(true);
    loginWithUser(result.user);
  }

  function openManualForm() {
    setBannerError(null);
    setError(null);
    const saved = getGoogleRememberedEmail();
    setShowForm(true);
    if (saved) setEmail(saved);
  }

  if (showForm) {
    return (
      <div className={`rounded-xl border border-slate-200 bg-slate-50/90 p-4 ${compact ? '' : ''}`}>
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <GoogleLogo />
          Cuenta PROJECT VIGIA
        </p>
        <p className="mb-4 text-xs leading-relaxed text-slate-600">
          Usa el <strong>mismo correo y contraseña</strong> con los que te registraste en PROJECT VIGIA. Si ya iniciaste
          sesión con Google en este navegador, la próxima vez podrás usar el botón de Google con un solo clic.
        </p>
        {error ? (
          <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
        <form onSubmit={handleFormSubmit} className="space-y-4">
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
            label="Contraseña"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            minLength={1}
            placeholder="Tu contraseña"
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
            setShowForm(false);
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
      {remembered && trusted ? (
        <p className="mb-2 text-center text-xs text-slate-500">
          Acceso rápido en este dispositivo: <strong className="text-slate-700">{remembered}</strong>
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
        className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
      >
        <GoogleLogo />
        {busy ? 'Conectando con Google…' : 'Iniciar sesión con Google'}
      </button>
      {oauthConfigured ? (
        <button
          type="button"
          onClick={openManualForm}
          className="mt-3 w-full text-center text-xs font-medium text-slate-600 underline-offset-2 hover:text-blue-700 hover:underline"
        >
          Usar correo y contraseña de PROJECT VIGIA
        </button>
      ) : !trusted ? (
        <p className="mt-2 text-center text-xs text-slate-500">
          También puedes usar tu cuenta PROJECT VIGIA: pulsa el botón de Google para continuar.
        </p>
      ) : null}
    </div>
  );
}

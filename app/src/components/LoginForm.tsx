'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import GoogleSignInPanel, { buildSessionForUser } from '@/components/GoogleSignInPanel';
import PasswordField, { authInputClass } from '@/components/PasswordField';
import { authenticateUserAsync } from '@/lib/user-store';
import { setDemoSession } from '@/lib/demo-session';
import { syncUserPlanOnLogin } from '@/lib/user-plan';
import { getSafeInternalRedirect } from '@/lib/auth-redirect';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectAfter = useMemo(
    () => getSafeInternalRedirect(searchParams.get('redirect')) ?? '/',
    [searchParams],
  );
  const crearCuentaHref = useMemo(() => {
    const r = getSafeInternalRedirect(searchParams.get('redirect'));
    return r ? `/crear-cuenta?redirect=${encodeURIComponent(r)}` : '/crear-cuenta';
  }, [searchParams]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function completeLogin(user: Parameters<typeof buildSessionForUser>[0]) {
    const session = buildSessionForUser(user, false);
    setDemoSession(session);
    syncUserPlanOnLogin(session.email);
    router.push(redirectAfter);
    router.refresh();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await authenticateUserAsync(email, password);
    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }
    completeLogin(result.user);
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-8 shadow-2xl shadow-black/40 ring-1 ring-white/30 backdrop-blur-md">
      <form onSubmit={onSubmit} className="space-y-5">
        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-slate-800">
            Correo electrónico
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
            required
          />
        </div>
        <PasswordField
          id="login-password"
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
          className="w-full rounded-lg bg-blue-600 py-3.5 text-center text-base font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-60"
        >
          Iniciar sesión
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link href={crearCuentaHref} className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
          Crear cuenta
        </Link>
      </p>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 font-medium text-slate-500">o</span>
        </div>
      </div>

      <GoogleSignInPanel
        onSuccess={(session) => {
          setDemoSession(session);
          syncUserPlanOnLogin(session.email);
          router.push(redirectAfter);
          router.refresh();
        }}
      />

      <p className="mt-6 text-center text-xs text-slate-500">
        Las cuentas se guardan en el servidor del proyecto y en este navegador. Google usa la ventana oficial
        de inicio de sesión (no la contraseña de Gmail en el formulario).
      </p>
    </div>
  );
}

import Link from 'next/link';
import { Suspense } from 'react';
import AuthShell from '@/components/AuthShell';
import LoginForm from '@/components/LoginForm';

function LoginFormFallback() {
  return <div className="h-[480px] w-full max-w-md animate-pulse rounded-2xl bg-white/10" aria-hidden />;
}

export default function IniciarSesionPage() {
  return (
    <AuthShell>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:gap-16 lg:py-16">
        <div className="lg:w-1/2 lg:pt-8">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/35 bg-blue-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-200">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500 vigia-blink" aria-hidden />
            Acceso monitoreo
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2rem] lg:leading-snug xl:text-4xl">
            Inicia sesión con tu correo y contraseña
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            Usa el mismo correo y contraseña que registraste. Si aún no tienes cuenta, créala en unos minutos.
          </p>
        </div>
        <div className="flex flex-1 justify-center lg:w-1/2 lg:justify-end lg:pt-4">
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/#contact"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-100 shadow-sm backdrop-blur-sm transition hover:border-white/25 hover:bg-white/10"
          >
            <span className="text-lg" aria-hidden>
              🛡️
            </span>
            Tengo un problema de seguridad
            <span className="text-slate-500" aria-hidden>
              ›
            </span>
          </Link>
          <Link href="/#contact" className="text-sm font-semibold text-blue-300 hover:text-white hover:underline">
            Necesito ayuda
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}

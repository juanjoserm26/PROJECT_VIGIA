import Link from 'next/link';
import { Suspense } from 'react';
import AuthShell from '@/components/AuthShell';
import RegisterForm from '@/components/RegisterForm';
import { LoginLinkWithRedirect } from '@/components/AuthRedirectLinks';

function RegisterFormFallback() {
  return <div className="h-[480px] w-full max-w-md animate-pulse rounded-2xl bg-white/10" aria-hidden />;
}

export default function CrearCuentaPage() {
  return (
    <AuthShell>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:gap-12 lg:py-16">
        <div className="lg:w-1/2 lg:pt-8">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/35 bg-blue-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-200">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500 vigia-blink" aria-hidden />
            Acceso monitoreo
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            Crea tu cuenta
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            Completa tus datos personales para acceder al panel de monitoreo. El correo y la contraseña serán
            los que uses para ingresar.
          </p>
          <p className="mt-6 text-sm text-slate-400">
            ¿Ya estás registrado?{' '}
            <Suspense
              fallback={
                <Link
                  href="/iniciar-sesion"
                  className="font-semibold text-blue-300 hover:text-white hover:underline"
                >
                  Inicia sesión
                </Link>
              }
            >
              <LoginLinkWithRedirect className="font-semibold text-blue-300 hover:text-white hover:underline">
                Inicia sesión
              </LoginLinkWithRedirect>
            </Suspense>
          </p>
        </div>
        <div className="flex flex-1 justify-center lg:w-1/2 lg:justify-end lg:pt-4">
          <Suspense fallback={<RegisterFormFallback />}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </AuthShell>
  );
}

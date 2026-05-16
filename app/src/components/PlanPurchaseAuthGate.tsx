'use client';

import Link from 'next/link';
import { useEffect } from 'react';

type PlanPurchaseAuthGateProps = {
  /** `/checkout?plan=…` para volver tras iniciar sesión o crear cuenta */
  checkoutReturnPath: string;
  variant?: 'modal' | 'panel';
  onDismiss?: () => void;
};

export default function PlanPurchaseAuthGate({
  checkoutReturnPath,
  variant = 'panel',
  onDismiss,
}: PlanPurchaseAuthGateProps) {
  const redirect = encodeURIComponent(checkoutReturnPath);
  const loginHref = `/iniciar-sesion?redirect=${redirect}`;
  const registerHref = `/crear-cuenta?redirect=${redirect}`;

  useEffect(() => {
    if (variant !== 'modal') return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onDismiss?.();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [variant, onDismiss]);

  const card = (
    <div
      className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl"
      role="dialog"
      aria-modal={variant === 'modal'}
      aria-labelledby="plan-auth-title"
      aria-describedby="plan-auth-desc"
    >
      <h2 id="plan-auth-title" className="text-xl font-bold text-slate-900">
        Cuenta requerida
      </h2>
      <p id="plan-auth-desc" className="mt-3 text-sm leading-relaxed text-slate-600">
        Para solicitar un plan y continuar con el proceso necesitas estar registrado en PROJECT VIGIA.
        Inicia sesión con tu cuenta o crea una nueva para seguir.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-stretch">
        <Link
          href={loginHref}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
        >
          Iniciar sesión
        </Link>
        <Link
          href={registerHref}
          className="flex-1 rounded-lg border-2 border-blue-600 px-4 py-3 text-center text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          Crear cuenta
        </Link>
      </div>
      {variant === 'modal' && onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="mt-6 w-full text-center text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          Cerrar
        </button>
      ) : null}
    </div>
  );

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <button
          type="button"
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => onDismiss?.()}
          aria-label="Cerrar aviso"
        />
        <div className="relative z-[101]">{card}</div>
      </div>
    );
  }

  return card;
}

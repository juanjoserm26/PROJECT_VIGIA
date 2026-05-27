'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getDemoSession, VIGIA_SESSION_CHANGED_EVENT, type DemoSession } from '@/lib/demo-session';
import { getMarketingPlan } from '@/lib/subscription-plans';
import {
  getPurchasedPlans,
  USER_PLAN_CHANGED_EVENT,
  type PurchasedPlanEntry,
} from '@/lib/user-plan';

function formatWhen(ts: number): string {
  try {
    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(ts));
  } catch {
    return '';
  }
}

export default function MisPlanesDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<DemoSession | null>(null);
  const [plans, setPlans] = useState<PurchasedPlanEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function sync() {
      const s = getDemoSession();
      if (!s) {
        setReady(false);
        setSession(null);
        router.replace('/iniciar-sesion?redirect=%2Fmis-planes');
        return;
      }
      setSession(s);
      setPlans(
        [...getPurchasedPlans(s.email)].sort((a, b) => b.purchasedAt - a.purchasedAt),
      );
      setReady(true);
    }

    sync();
    window.addEventListener(VIGIA_SESSION_CHANGED_EVENT, sync);
    window.addEventListener(USER_PLAN_CHANGED_EVENT, sync);
    window.addEventListener('focus', sync);
    return () => {
      window.removeEventListener(VIGIA_SESSION_CHANGED_EVENT, sync);
      window.removeEventListener(USER_PLAN_CHANGED_EVENT, sync);
      window.removeEventListener('focus', sync);
    };
  }, [router]);

  if (!ready || !session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-400">Cargando tus planes…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">Tu cuenta</p>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Mis planes</h1>
        <p className="mt-1 text-sm text-slate-400">{session.email}</p>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-900/50 px-6 py-14 text-center">
          <p className="text-lg font-semibold text-white">Aún no tienes planes contratados</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Cuando compres un plan, aparecerá aquí con el detalle de tu suscripción.
          </p>
          <Link
            href="/plans"
            className="mt-8 inline-flex rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500"
          >
            Comprar plan
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {plans.map((entry) => {
            const plan = getMarketingPlan(entry.planSlug);
            return (
              <li
                key={`${entry.planSlug}-${entry.purchasedAt}`}
                className="overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/80 shadow-lg"
              >
                <div className="border-b border-slate-700/80 bg-gradient-to-r from-blue-950/80 to-slate-900 px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    Plan contratado
                  </p>
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                  <p className="mt-1 text-sm text-slate-400">{plan.segment}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-2xl font-bold text-white">
                    {plan.price}{' '}
                    <span className="text-sm font-normal text-slate-400">{plan.priceNote}</span>
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Contratado el {formatWhen(entry.purchasedAt)}
                  </p>
                  <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {plan.features.slice(0, 4).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {plans.length > 0 ? (
        <div className="mt-8 text-center">
          <Link
            href="/plans"
            className="inline-flex rounded-lg border border-blue-500/50 bg-blue-600/20 px-6 py-3 text-sm font-semibold text-blue-200 transition hover:bg-blue-600/40 hover:text-white"
          >
            Adquirir otro plan
          </Link>
        </div>
      ) : null}
    </div>
  );
}

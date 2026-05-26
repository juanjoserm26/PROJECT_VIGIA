'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QRCode from '@/components/QRCode';
import PlanPurchaseAuthGate from '@/components/PlanPurchaseAuthGate';
import { getDemoSession } from '@/lib/demo-session';
import { activateUserPlan } from '@/lib/user-plan';
import {
  checkoutSummaryFeatures,
  getMarketingPlan,
  normalizePlanSlug,
  type PlanSlug,
} from '@/lib/subscription-plans';

interface PaymentState {
  step: 'form' | 'processing' | 'success' | 'error';
  error?: string;
  transactionId?: string;
}

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planSlug = useMemo(
    () => normalizePlanSlug(searchParams.get('plan')),
    [searchParams]
  );
  const selectedPlan = useMemo(() => getMarketingPlan(planSlug), [planSlug]);
  const summaryFeatures = checkoutSummaryFeatures[planSlug as PlanSlug];

  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [fullName, setFullName] = useState('');
  const [paymentState, setPaymentState] = useState<PaymentState>({
    step: 'form',
  });

  /** URL https://… para que el celular abra el navegador (no un editor de texto). */
  const checkoutQrUrl = useMemo(() => {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') ||
      (typeof window !== 'undefined' ? window.location.origin : '');
    if (!base) return 'https://projectvigia.vercel.app/plans';
    const url = new URL('/plans', base);
    url.searchParams.set('plan', planSlug);
    if (paymentState.step === 'success' && paymentState.transactionId) {
      url.searchParams.set('ref', paymentState.transactionId);
    }
    url.searchParams.set('utm_source', 'checkout_qr');
    return url.toString();
  }, [planSlug, paymentState.step, paymentState.transactionId]);

  const [checkoutAllowed, setCheckoutAllowed] = useState<boolean | undefined>(undefined);
  const planActivatedRef = useRef(false);

  useEffect(() => {
    setCheckoutAllowed(getDemoSession() !== null);
  }, []);

  useEffect(() => {
    if (paymentState.step !== 'success' || planActivatedRef.current) return;
    const session = getDemoSession();
    if (!session) return;
    planActivatedRef.current = true;
    activateUserPlan(session.email, planSlug);
  }, [paymentState.step, planSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !cardNumber || !cardExpiry || !cardCVC || !fullName) {
      setPaymentState({ step: 'error', error: 'Por favor completa todos los campos' });
      return;
    }

    setPaymentState({ step: 'processing' });

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan.name,
          planSlug,
          email,
          card: cardNumber.slice(-4),
          fullName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentState({
          step: 'success',
          transactionId: data.transactionId,
        });
      } else {
        setPaymentState({
          step: 'error',
          error: data.error || 'Payment failed. Please try again.',
        });
      }
    } catch {
      setPaymentState({
        step: 'error',
        error: 'An error occurred. Please try again.',
      });
    }
  };

  if (checkoutAllowed === undefined) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-slate-50 py-24">
          <p className="text-sm text-slate-500">Cargando checkout…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!checkoutAllowed) {
    const checkoutReturnPath = `/checkout?plan=${planSlug}`;
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-4 py-16">
          <PlanPurchaseAuthGate variant="panel" checkoutReturnPath={checkoutReturnPath} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="group mb-6 inline-flex items-center gap-3 rounded-full pl-1 pr-4 py-1 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-500/40 bg-white shadow-sm transition duration-300 ease-out group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:shadow-md group-hover:-translate-x-1">
                <svg
                  className="h-5 w-5 transition duration-300 text-blue-600 group-hover:text-white group-hover:-translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.25}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </span>
              <span className="text-sm font-semibold tracking-wide">Volver</span>
            </button>
            <h1 className="text-3xl font-bold text-slate-900">
              Solicitud de Suscripción
            </h1>
            <p className="text-slate-600 mt-2">
              {selectedPlan.name} — contactaremos para confirmar detalles e integración.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {paymentState.step === 'form' && (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b-2 border-blue-600 pb-2">
                      Información de Contacto
                    </h2>
                    <input
                      type="email"
                      placeholder="Correo electrónico corporativo"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-slate-50"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                      required
                    />
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b-2 border-blue-600 pb-2">
                      Información de Pago
                    </h2>

                    <input
                      type="text"
                      placeholder="Número de tarjeta"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      maxLength={16}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-slate-50"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) {
                            val = val.slice(0, 2) + '/' + val.slice(2, 4);
                          }
                          setCardExpiry(val);
                        }}
                        maxLength={5}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                        required
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        value={cardCVC}
                        onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ''))}
                        maxLength={4}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
                  >
                    Solicitar acceso — {selectedPlan.price} {selectedPlan.priceNote}
                  </button>

                  <p className="text-xs text-slate-500 text-center mt-4">
                    Nuestro equipo de ventas te contactará para completar el registro y confirmar detalles de integración.
                  </p>
                </form>
              )}

              {paymentState.step === 'processing' && (
                <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8 text-center">
                  <div className="inline-block relative">
                    <div className="w-12 h-12 bg-blue-600 rounded-full"></div>
                    <div className="animate-spin absolute inset-0 w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
                  </div>
                  <p className="text-slate-700 mt-4 font-semibold">
                    Enviando tu solicitud...
                  </p>
                </div>
              )}

              {paymentState.step === 'success' && (
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-300/30">
                  <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 px-6 py-10 text-center text-white sm:px-10">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/25 backdrop-blur-sm">
                      <svg
                        className="h-9 w-9 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      ¡Solicitud recibida!
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-blue-100 sm:text-base">
                      Registramos tu interés en{' '}
                      <span className="font-semibold text-white">{selectedPlan.name}</span>. Te
                      contactaremos para confirmar integración y capacitación.
                    </p>
                  </div>

                  <div className="space-y-6 p-6 sm:p-8">
                    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5">
                      <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Detalle de la solicitud
                      </p>
                      <dl className="space-y-4 text-sm">
                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                          <dt className="text-slate-500">Plan</dt>
                          <dd className="font-semibold text-slate-900">{selectedPlan.name}</dd>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                          <dt className="text-slate-500">Precio mensual</dt>
                          <dd className="font-semibold text-slate-900">
                            {selectedPlan.price}{' '}
                            <span className="font-normal text-slate-600">{selectedPlan.priceNote}</span>
                          </dd>
                        </div>
                        <div className="border-t border-slate-200 pt-4">
                          <dt className="mb-1.5 text-slate-500">Número de solicitud</dt>
                          <dd className="break-all rounded-lg border border-blue-100 bg-white px-3 py-2 font-mono text-xs text-blue-700 sm:text-sm">
                            {paymentState.transactionId}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5">
                      <p className="text-sm font-medium text-slate-700">
                        Confirmación al correo registrado
                      </p>
                      <p className="mt-2 break-all text-center text-base font-semibold text-slate-900">
                        {email}
                      </p>
                      <p className="mt-4 text-center text-xs leading-relaxed text-slate-600">
                        Respuesta del equipo en un plazo máximo de{' '}
                        <strong className="text-slate-800">24 horas hábiles</strong>.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => router.push('/')}
                      className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                    >
                      Volver al inicio
                    </button>
                  </div>
                </div>
              )}

              {paymentState.step === 'error' && (
                <div className="bg-red-50 rounded-lg border border-red-300 p-8">
                  <div className="text-center mb-6">
                    <div className="text-5xl text-red-500 mb-4">⚠</div>
                    <h2 className="text-2xl font-bold text-slate-900">Error en la Solicitud</h2>
                  </div>
                  <p className="text-red-700 text-center mb-6 font-medium">
                    {paymentState.error}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPaymentState({ step: 'form' })}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
                  >
                    Intentar de Nuevo
                  </button>
                </div>
              )}
            </div>

            <div className="md:col-span-1">
              <div className="sticky top-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
                <div className="border-b border-slate-100 bg-slate-50/90 px-5 py-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Resumen
                  </h2>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">{selectedPlan.name}</h3>
                  <p className="mt-1 text-2xl font-bold leading-tight text-blue-600">
                    {selectedPlan.price}{' '}
                    <span className="text-sm font-medium text-slate-500">{selectedPlan.priceNote}</span>
                  </p>
                </div>

                <div className="border-b border-slate-100 px-5 py-6">
                  <div className="flex justify-center">
                    <QRCode data={checkoutQrUrl} size={150} />
                  </div>
                  <p className="mt-3 text-center text-xs font-medium text-slate-600">
                    Escanea el código QR para ver el plan en PROJECT VIGIA
                  </p>
                  {paymentState.step === 'success' && paymentState.transactionId ? (
                    <p className="mt-1 text-center text-[10px] text-slate-500">
                      Incluye referencia de tu solicitud al abrir el enlace
                    </p>
                  ) : null}
                </div>

                <div className="border-t border-slate-100 px-5 py-5">
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Incluye
                  </h4>
                  <ul className="space-y-2.5 text-sm text-slate-700">
                    {summaryFeatures.map((line) => (
                      <li key={line} className="flex items-start gap-2">
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700"
                          aria-hidden
                        >
                          ✓
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
                  <p className="text-center text-[11px] leading-relaxed text-slate-500">
                    Validación de datos corporativos antes del acceso al sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

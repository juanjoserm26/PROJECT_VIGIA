'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QRCode from '@/components/QRCode';
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
                <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">
                  <div className="text-center mb-8">
                    <div className="text-5xl text-green-500 mb-4">✓</div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      ¡Solicitud Recibida!
                    </h2>
                    <p className="text-slate-600 mt-2">
                      Tu solicitud para {selectedPlan.name} ha sido registrada
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6 mb-8 border border-slate-200">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Plan:</span>
                        <span className="font-semibold text-slate-900">{selectedPlan.name}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-600">Precio mensual:</span>
                        <span className="font-semibold text-slate-900 text-right">
                          {selectedPlan.price} {selectedPlan.priceNote}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-3">
                        <span className="text-slate-600">Número de Solicitud:</span>
                        <span className="font-mono text-sm text-blue-600">
                          {paymentState.transactionId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-slate-700 mb-2">
                      Pronto recibirás un correo de confirmación en:
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                      <p className="text-center font-semibold text-slate-900">{email}</p>
                    </div>
                    <p className="text-sm text-slate-600 mb-6">
                      Nos pondremos en contacto dentro de 24 horas para ayudarte con la implementación y capacitación.
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push('/')}
                      className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
                    >
                      Volver al Inicio
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
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg shadow-lg border border-slate-200 p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-slate-900 mb-6 border-b-2 border-blue-600 pb-3">
                  Resumen
                </h2>

                <div className="border-b border-slate-200 pb-6 mb-6">
                  <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                    {selectedPlan.name}
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 leading-tight">
                    {selectedPlan.price}{' '}
                    <span className="text-sm text-slate-600 font-normal">{selectedPlan.priceNote}</span>
                  </p>

                  <div className="mt-6 flex justify-center">
                    <QRCode
                      data={`PROJECT VIGIA | ${selectedPlan.name} | ${selectedPlan.price} ${selectedPlan.priceNote}`}
                      size={150}
                    />
                  </div>
                  <p className="text-xs text-slate-600 text-center mt-3 font-medium">
                    Escanea el código QR para más información
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">
                    Incluye:
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {summaryFeatures.map((line) => (
                      <li key={line}>✓ {line}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-600 text-center font-medium">
                    Se requiere validación de datos corporativos para acceso al sistema.
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

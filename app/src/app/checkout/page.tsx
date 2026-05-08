'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QRCode from '@/components/QRCode';

interface PaymentState {
  step: 'form' | 'processing' | 'success' | 'error';
  error?: string;
  transactionId?: string;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get('plan') || 'professional';

  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [fullName, setFullName] = useState('');
  const [paymentState, setPaymentState] = useState<PaymentState>({
    step: 'form',
  });

  const planDetails: Record<string, { name: string; price: number }> = {
    inicio: { name: 'Inicio', price: 99 },
    profesional: { name: 'Profesional', price: 299 },
    empresarial: { name: 'Empresarial', price: 999 },
  };

  const selectedPlan = planDetails[plan] || planDetails.profesional;

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
    } catch (error) {
      setPaymentState({
        step: 'error',
        error: 'An error occurred. Please try again.',
      });
    }
  };

  const maskCardNumber = (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    if (cleaned.length < 4) return cleaned;
    return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
            >
              ← Volver
            </button>
            <h1 className="text-3xl font-bold text-slate-900">
              Solicitud de Suscripción
            </h1>
            <p className="text-slate-600 mt-2">
              Plan {selectedPlan.name} - Contactaremos para confirmar detalles
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="md:col-span-2">
              {paymentState.step === 'form' && (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">
                  {/* Contact Information */}
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

                  {/* Payment Information */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b-2 border-blue-600 pb-2">
                      Información de Pago
                    </h2>

                    {/* Card Number */}
                    <input
                      type="text"
                      placeholder="Número de tarjeta"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      maxLength={16}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-slate-50"
                      required
                    />

                    {/* Expiry and CVC */}
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
                  >
                    Solicitar Acceso - ${selectedPlan.price}/mes
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
                      Tu solicitud para el Plan {selectedPlan.name} ha sido registrada
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6 mb-8 border border-slate-200">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Plan:</span>
                        <span className="font-semibold text-slate-900">{selectedPlan.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Precio Mensual:</span>
                        <span className="font-semibold text-slate-900">${selectedPlan.price}/mes</span>
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
                    onClick={() => setPaymentState({ step: 'form' })}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
                  >
                    Intentar de Nuevo
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg shadow-lg border border-slate-200 p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-slate-900 mb-6 border-b-2 border-blue-600 pb-3">
                  Resumen
                </h2>

                {/* Plan Details */}
                <div className="border-b border-slate-200 pb-6 mb-6">
                  <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                    Plan {selectedPlan.name}
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">
                    ${selectedPlan.price}
                    <span className="text-sm text-slate-600 font-normal">/mes</span>
                  </p>

                  {/* QR Code */}
                  <div className="mt-6 flex justify-center">
                    <QRCode
                      data={`VIGIA-${selectedPlan.name}-${selectedPlan.price}`}
                      size={150}
                    />
                  </div>
                  <p className="text-xs text-slate-600 text-center mt-3 font-medium">
                    Escanea el código QR para más información
                  </p>
                </div>

                {/* Features Preview */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">
                    Incluye:
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {selectedPlan.name === 'Inicio' && (
                      <>
                        <li>✓ Hasta 5 cámaras</li>
                        <li>✓ Almacenamiento de 100 GB</li>
                        <li>✓ Soporte básico</li>
                      </>
                    )}
                    {selectedPlan.name === 'Profesional' && (
                      <>
                        <li>✓ Hasta 20 cámaras</li>
                        <li>✓ Almacenamiento de 1 TB</li>
                        <li>✓ Soporte prioritario</li>
                        <li>✓ Detección de IA</li>
                      </>
                    )}
                    {selectedPlan.name === 'Empresarial' && (
                      <>
                        <li>✓ Cámaras ilimitadas</li>
                        <li>✓ Almacenamiento ilimitado</li>
                        <li>✓ Soporte 24/7</li>
                        <li>✓ Suite de IA completa</li>
                        <li>✓ Integraciones personalizadas</li>
                      </>
                    )}
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

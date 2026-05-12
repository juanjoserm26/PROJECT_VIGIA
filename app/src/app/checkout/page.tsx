import { Suspense } from 'react';
import CheckoutClient from './checkout-client';

function CheckoutFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="h-16 bg-white border-b border-slate-200 animate-pulse" />
      <div className="flex-1 flex items-center justify-center px-4">
        <p className="text-slate-500 text-sm">Cargando checkout…</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutClient />
    </Suspense>
  );
}

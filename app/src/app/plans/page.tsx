import Header from '@/components/Header';
import PricingPlans from '@/components/PricingPlans';
import Footer from '@/components/Footer';

export default function PlansPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
              Planes de Suscripción
            </h1>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              Soluciones escalables de vigilancia inteligente para empresas de todos los tamaños. Elige la opción que mejor se adapte a tu organización.
            </p>
          </div>
        </div>
        <PricingPlans />
      </main>
      <Footer />
    </div>
  );
}

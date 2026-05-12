import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PortalClientePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Portal de clientes</h1>
          <p className="text-lg text-slate-600 mb-8">
            El acceso al panel de monitoreo y analítica se habilita por invitación después de
            contratar el servicio. Si ya eres cliente y necesitas credenciales o soporte técnico,
            escríbenos y te respondemos de inmediato.
          </p>

          <div className="rounded-xl bg-white border border-slate-200 shadow-lg p-8 space-y-6">
            <div>
              <h2 className="font-semibold text-slate-900 mb-2">Contacto directo</h2>
              <p className="text-slate-600 text-sm mb-3">
                Correo:{' '}
                <a
                  href="mailto:contacto@projectvigia.co"
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  contacto@projectvigia.co
                </a>
              </p>
              <p className="text-slate-600 text-sm">
                Teléfono:{' '}
                <a href="tel:+573150502630" className="text-blue-600 font-medium hover:text-blue-700">
                  +57 315 050 2630
                </a>
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="font-semibold text-slate-900 mb-2">¿Aún no tienes plan?</h2>
              <p className="text-slate-600 text-sm mb-4">
                Desde la página de planes puedes solicitar asesoría y elegir el volumen de cámaras
                que necesitas.
              </p>
              <Link
                href="/plans"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Ver planes y precios
              </Link>
            </div>
          </div>

          <p className="text-sm text-slate-500 mt-8">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

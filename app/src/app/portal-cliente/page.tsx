import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function IconSupport({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function IconAccess({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function IconPlans({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );
}

const faqItems = [
  {
    q: '¿Aún no soy cliente de PROJECT VIGIA?',
    a: 'Puedes revisar planes y precios o dejarnos tus datos en el formulario de contacto del inicio. Te orientamos sobre integración ONVIF/RTSP y el volumen de cámaras que necesitas.',
  },
  {
    q: 'Ya contraté pero no tengo acceso al panel',
    a: 'El alta de usuarios en producción la coordinamos por canales seguros. Escríbenos a contacto@projectvigia.co o llama al +57 315 050 2630 indicando entidad y correo corporativo; te respondemos con prioridad.',
  },
  {
    q: '¿Puedo ver cómo se ve el monitoreo antes de contratar?',
    a: 'En el sitio hay una vista de demostración. Si creas una cuenta de prueba, podrás explorar el flujo de ingreso y el apartado Mis cámaras con contenido de ejemplo en tu navegador.',
  },
];

export default function PortalClientePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-slate-100 via-slate-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Área clientes</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.35rem] lg:leading-tight">
            Portal de clientes
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
            Acceso al panel de monitoreo y analítica{' '}
            <strong className="font-semibold text-slate-800">por invitación</strong>, una vez contratado el
            servicio y completada la configuración con tu equipo. Desde aquí tienes los canales oficiales de
            soporte y los enlaces útiles mientras formalizamos o amplías tu plan.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <IconSupport className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-900">Soporte y credenciales</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                Canal prioritario para clientes activos: altas de usuario, recuperación de acceso, incidentes y
                coordinación técnica.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:contacto@projectvigia.co"
                    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    contacto@projectvigia.co
                  </a>
                </li>
                <li>
                  <a href="tel:+573150502630" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                    +57 315 050 2630
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-xs leading-snug text-slate-500">
                Horario sujeto a acuerdo comercial; urgencias críticas escríbelas en el asunto del correo.
              </p>
            </article>

            <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-white">
                <IconAccess className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-900">Acceso al entorno</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                Si ya cuentas con usuario (incluida una cuenta de exploración en este sitio), ingresa desde aquí.
                El panel de cámaras en vivo en producción se habilita según tu contrato.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/iniciar-sesion"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/monitoreo"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Mis cámaras
                </Link>
              </div>
              <p className="mt-4 text-xs leading-snug text-slate-500">
                Mis cámaras requiere sesión iniciada. Sin cuenta, regístrate o usa el contacto para una cuenta
                corporativa.
              </p>
            </article>

            <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <IconPlans className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-900">Contratar o ampliar</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                Revisa volumen de flujos (cámaras IP compatibles ONVIF/RTSP), alcance del plan y siguiente paso
                comercial. No vendemos hardware: integramos sobre tu infraestructura existente.
              </p>
              <Link
                href="/plans"
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ver planes y precios
              </Link>
              <p className="mt-4 text-xs leading-snug text-slate-500">
                ¿Necesitas una cotización a medida? Usa el contacto del primer bloque o el formulario en la página
                de inicio.
              </p>
            </article>
          </div>

          <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold text-slate-900">Preguntas frecuentes</h2>
            <p className="mt-1 text-sm text-slate-600">
              Respuestas breves; para casos puntuales usa siempre el correo o la línea de soporte.
            </p>
            <div className="mt-6 divide-y divide-slate-200 border-t border-slate-200">
              {faqItems.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="cursor-pointer list-none pr-8 text-sm font-semibold text-slate-900 outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start justify-between gap-3">
                      {item.q}
                      <span className="mt-0.5 shrink-0 text-blue-600 transition group-open:rotate-180">▼</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-8 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <Link href="/" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
              ← Volver al inicio
            </Link>
            <Link href="/#contact" className="font-semibold text-slate-700 hover:text-blue-700 hover:underline">
              Ir al formulario de contacto
            </Link>
            <Link href="/demostracion" className="font-semibold text-slate-700 hover:text-blue-700 hover:underline">
              Ver demostración
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

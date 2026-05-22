import Link from 'next/link';

const CONTACT_ITEMS = [
  {
    label: 'Escríbenos',
    title: 'Correo',
    lines: ['contacto@projectvigia.co'],
    href: 'mailto:contacto@projectvigia.co',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
  {
    label: 'Llámanos',
    title: 'Teléfono',
    lines: ['+57 315 050 2630'],
    href: 'tel:+573150502630',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    ),
  },
  {
    label: 'Visítanos',
    title: 'Sede',
    lines: ['Barrio Fontana, Bucaramanga', 'Santander, Colombia'],
    detail: 'Cra. 21 #101-25',
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </>
    ),
  },
] as const;

export default function ContactInfoSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(37, 99, 235, 0.08), transparent)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-8 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] sm:p-10 lg:p-12">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-slate-400/10 blur-3xl"
            aria-hidden
          />

          <div className="relative mx-auto max-w-2xl text-center">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
              Bucaramanga · Colombia
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Contáctanos</h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Canales directos del equipo PROJECT VIGIA. Para propuestas técnicas y cotización, el paso siguiente
              es <strong className="text-slate-900">Solicitar asesoría</strong> más abajo.
            </p>
          </div>

          <div className="relative mt-10 grid gap-5 sm:grid-cols-3 sm:gap-6">
            {CONTACT_ITEMS.map((item) => {
              const content = (
                <>
                  <p className="text-lg font-bold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                    {item.title}
                  </p>
                  {'detail' in item && item.detail ? (
                    <p className="mt-3 text-sm text-slate-500">{item.detail}</p>
                  ) : null}
                  <div
                    className={`mt-2 space-y-0.5 text-sm font-medium ${
                      'href' in item && item.href ? 'text-blue-600 group-hover:text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    {item.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </>
              );

              const cardClass =
                'group relative flex flex-col items-center rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50/80 to-white px-5 py-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200/80 hover:shadow-lg hover:shadow-blue-500/10';

              return 'href' in item && item.href ? (
                <a key={item.label} href={item.href} className={cardClass}>
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-600/25 transition group-hover:scale-105">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      {item.icon}
                    </svg>
                  </div>
                  {content}
                </a>
              ) : (
                <div key={item.label} className={cardClass}>
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-600/25">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      {item.icon}
                    </svg>
                  </div>
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-center text-white shadow-xl shadow-blue-900/20 sm:p-10">
          <h3 className="text-xl font-bold sm:text-2xl">¿Listo para integrar IA en tus cámaras?</h3>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-blue-100 sm:text-base">
            Cuéntanos volumen de cámaras IP, tipo de organización y objetivos. No vendemos hardware: conectamos
            a tu infraestructura ONVIF/RTSP.
          </p>
          <Link
            href="/asesoria"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-800 shadow-lg transition hover:bg-blue-50"
          >
            Solicitar asesoría
            <span aria-hidden>→</span>
          </Link>
          <p className="mt-4 text-xs text-blue-200/90">
            Mismo formulario que el botón azul del menú · respuesta en 24–48 h hábiles
          </p>
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          PQRS (peticiones, quejas, reclamos y sugerencias) desde el enlace{' '}
          <strong className="text-slate-700">PQRS</strong> en la barra superior del sitio.
        </p>
      </div>
    </section>
  );
}

import Image from 'next/image';

export default function BusinessPlan() {
  return (
    <section id="business-plan" className="py-20 sm:py-24 bg-white">
      {/* Título y texto: ancho de lectura habitual */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
          Plan de Negocios
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
          Modelo de Negocios Canvas
        </h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Visualización completa del modelo de negocios de PROJECT VIGIA basado en la metodología
          de Osterwalder &amp; Pigneur (2010). Incluye propuesta de valor, segmentos de clientes,
          canales, estructura de costos y proyección de ingresos.
        </p>
      </div>

      {/* Canvas: casi ancho completo del viewport (más grande que max-w-7xl) */}
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <figure className="mx-auto w-full max-w-[min(100vw-1rem,1920px)] rounded-xl overflow-hidden border border-slate-200 shadow-xl bg-white">
          <Image
            src="/PROJECT_VIGIA_Canvas_v2.jpg"
            alt="Modelo de Negocios Canvas - PROJECT VIGIA"
            width={2978}
            height={2105}
            className="block w-full h-auto align-middle"
            priority
            sizes="(min-width: 1920px) 1904px, (min-width: 1280px) 95vw, (min-width: 768px) 96vw, 100vw"
          />
        </figure>
      </div>

      {/* Pie */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
        <p>
          Jhoan S. García Reyes &middot; Juan J. Rincón Méndez &middot; UIS &middot; Fondo
          Emprender &middot; 2026
        </p>
        <a
          href="/PROJECT_VIGIA_Canvas_v2.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
            />
          </svg>
          Descargar PDF
        </a>
      </div>
    </section>
  );
}

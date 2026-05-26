import Image from 'next/image';
import { readFile } from 'fs/promises';
import path from 'path';

async function getCanvasImageMeta(): Promise<{ width: number; height: number }> {
  const fallback = { width: 2526, height: 1786 };
  try {
    const raw = await readFile(
      path.join(process.cwd(), 'public', 'canvas-v3-image-meta.json'),
      'utf8',
    );
    const m = JSON.parse(raw) as { width?: number; height?: number };
    if (typeof m.width === 'number' && typeof m.height === 'number' && m.width > 0 && m.height > 0) {
      return { width: m.width, height: m.height };
    }
  } catch {
    /* sin meta */
  }
  return fallback;
}

const CANVAS_ASSET_VERSION = 'canvas-prof-final-20260526';

export default async function BusinessPlan() {
  const { width: imgWidth, height: imgHeight } = await getCanvasImageMeta();
  const pngSrc = `/PROJECT_VIGIA_Canvas_v3.png?v=${CANVAS_ASSET_VERSION}`;
  const pdfHref = `/PROJECT_VIGIA_Canvas_v3.pdf?v=${CANVAS_ASSET_VERSION}`;

  return (
    <section id="business-plan" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
          Plan de Negocios
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
          Modelo de Negocios Canvas
        </h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Versión 3 del canvas, alineada al Plan de Negocios (Módulos Completos 2.0), en la
          metodología de Osterwalder &amp; Pigneur (2010). Incluye propuesta de valor, segmentos,
          canales, estructura de costos y proyección de ingresos. El negocio es{' '}
          <strong className="text-slate-800 font-semibold">software en suscripción</strong> que se
          integra a las cámaras IP que ya posee cada cliente; no contemplamos la venta de
          cámaras ni kits de hardware.
        </p>
        <p className="text-sm text-slate-500 mt-3 max-w-2xl mx-auto">
          Hacé clic en la imagen para ampliarla. El archivo PDF completo se descarga con el botón
          inferior.
        </p>
      </div>

      <div className="w-full px-2 sm:px-4 lg:px-6">
        <figure className="mx-auto w-full max-w-[min(100vw-1rem,1920px)] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xl">
          <a
            href={pngSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            title="Abrir imagen en tamaño completo"
          >
            <Image
              src={pngSrc}
              alt="Modelo de Negocios Canvas PROJECT VIGIA — versión 3"
              width={imgWidth}
              height={imgHeight}
              className="block h-auto w-full align-middle"
              priority
              unoptimized
              sizes="(min-width: 1920px) 1904px, (min-width: 1280px) 95vw, (min-width: 768px) 96vw, 100vw"
            />
          </a>
        </figure>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
        <p>
          Jhoan S. García Reyes &middot; Juan José Rincón Méndez &middot; UIS &middot; Fondo
          Emprender &middot; 2026
        </p>
        <a
          href={pdfHref}
          download="PROJECT_VIGIA_Canvas_v3.pdf"
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

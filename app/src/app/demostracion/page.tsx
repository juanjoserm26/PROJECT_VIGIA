import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DemoMedia from '@/components/DemoMedia';
import { demoVideosDemostracion } from '@/lib/demo-videos';

export const metadata: Metadata = {
  title: 'Demostración en vivo | PROJECT VIGIA',
  description:
    'Vídeos del prototipo: análisis de video con IA (YOLOv8), detección y flujo de alertas. Bucaramanga, Colombia.',
};

export default function DemostracionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <section className="border-b border-slate-200 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Prototipo técnico</p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Demostración en vivo</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300 leading-relaxed">
              Escenas grabadas desde el prototipo: en cada vídeo ves la salida del análisis con IA (cajas de
              detección, seguimiento). Es la misma línea técnica que aplicamos después a tus cámaras IP por ONVIF/RTSP.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#contact"
                className="inline-flex rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500"
              >
                Solicitar prueba de 14 días
              </Link>
              <Link
                href="/plans"
                className="inline-flex rounded-lg border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Ver planes
              </Link>
            </div>
          </div>
        </section>

        {/* Navegación rápida entre vídeos */}
        <nav
          aria-label="Saltar a cada vídeo"
          className="border-b border-slate-200 bg-white py-3 shadow-sm"
        >
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 px-4 sm:px-6 lg:px-8">
            <span className="mr-1 hidden text-xs font-semibold uppercase tracking-wide text-slate-400 sm:inline">
              Ir a
            </span>
            {demoVideosDemostracion.map((v) => (
              <a
                key={v.id}
                href={`#video-${v.id}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800"
              >
                {v.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="mx-auto max-w-4xl space-y-14 px-4 py-14 sm:px-6 lg:max-w-5xl lg:px-8">
          {demoVideosDemostracion.map((item, index) => (
            <article
              key={item.id}
              id={`video-${item.id}`}
              className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-md ring-1 ring-slate-900/5 sm:p-8"
            >
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-blue-600">{item.label}</p>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      YOLOv8 · demo
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
                </div>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-sm font-bold text-white shadow-md">
                  {index + 1}
                </span>
              </div>
              <p className="mb-6 text-slate-600 leading-relaxed">{item.description}</p>
              <DemoMedia
                videoSrc={item.videoSrc}
                iframeSrc={item.iframeSrc}
                label={item.label}
                scenarioIndex={item.id - 1}
              />
            </article>
          ))}
        </div>

        <section className="border-t border-slate-200 bg-white py-12">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="text-slate-700">
              ¿Listo para llevar esto a <strong className="text-slate-900">tus</strong> cámaras? Activa la{' '}
              <strong className="text-slate-900">prueba de 14 días</strong> y te acompañamos en la integración.
            </p>
            <Link
              href="/#contact"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Hablar con el equipo
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

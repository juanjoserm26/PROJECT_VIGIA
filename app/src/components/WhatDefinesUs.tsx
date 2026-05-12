import Image from 'next/image';
import Reveal from './Reveal';

export default function WhatDefinesUs() {
  const stats = [
    { value: '99.5%', label: 'SLA de disponibilidad' },
    { value: '24/7', label: 'Motor de IA analizando tus flujos de forma continua' },
    { value: '<2s', label: 'Tiempo de detección' },
    {
      value: 'ONVIF',
      label: 'Tus cámaras IP actuales: sin reemplazar infraestructura ni hardware de VIGIA',
    },
  ];

  return (
    <section
      id="what-defines-us"
      className="relative py-20 sm:py-24 overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/vigia-defines-us-bg.jpg"
          alt="Bucaramanga conectada con vigilancia inteligente"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <Reveal>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3">
              ¿Qué nos define?
            </h2>
            <div className="w-24 h-1 bg-blue-400 mb-6"></div>
            <p className="text-lg text-slate-200 leading-relaxed mb-6">
              Somos una plataforma SaaS de análisis inteligente de video con IA en Bucaramanga,
              pensada para <strong className="text-white font-semibold">múltiples segmentos</strong>
              : fuerza pública y entidades territoriales, empresas y comercio, conjuntos
              residenciales, instituciones educativas y la comunidad en general. No sustituimos tu
              infraestructura: la potenciamos.
            </p>
            <p className="text-lg text-slate-200 leading-relaxed mb-6">
              Integramos con <strong className="text-white font-semibold">tus</strong> cámaras IP
              existentes mediante ONVIF/RTSP para detectar conductas de riesgo en tiempo real.
              <strong className="text-white font-semibold"> No vendemos cámaras</strong> ni kits de
              hardware: vendemos el software y el servicio de análisis y alertas.
            </p>
            <p className="text-lg text-slate-200 leading-relaxed mb-8">
              El enfoque del producto prioriza{' '}
              <strong className="text-white font-semibold">eventos objetivos</strong> (por ejemplo
              presencia de armas y patrones de agresión física) con revisión humana de las alertas, y
              operamos con un <strong className="text-white font-semibold">piloto en Bucaramanga</strong>{' '}
              (entorno cercano a la UIS). Puedes validar el valor con una{' '}
              <strong className="text-white font-semibold">demo gratuita de 14 días</strong> en planes
              Básico y Avanzado sobre tus propias cámaras.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Conoce más
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </Reveal>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Reveal
                key={index}
                variant="zoom"
                delay={((index + 1) as 1 | 2 | 3 | 4)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8 text-center hover:bg-white/15 hover:-translate-y-1 transition-all duration-300"
              >
                <p className="text-4xl sm:text-5xl font-bold text-white mb-2 tabular-nums">
                  {stat.value}
                </p>
                <p className="text-base text-blue-100 leading-snug normal-case tracking-normal">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

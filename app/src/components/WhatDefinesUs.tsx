import Image from 'next/image';
import Reveal from './Reveal';

export default function WhatDefinesUs() {
  const stats = [
    { value: '99.5%', label: 'SLA de disponibilidad' },
    { value: '24/7', label: 'Monitoreo continuo' },
    { value: '<2s', label: 'Tiempo de detección' },
    { value: '+808', label: 'Cámaras en Bucaramanga' },
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
              Somos la primera plataforma SaaS de análisis inteligente de video con IA en
              Bucaramanga, orientada al sector público y privado, sin requerir reemplazo de
              infraestructura existente.
            </p>
            <p className="text-lg text-slate-200 leading-relaxed mb-8">
              Nuestra propuesta convierte la videovigilancia tradicional en una herramienta
              inteligente de prevención, integrándose con cámaras existentes mediante el
              estándar ONVIF para detectar comportamientos sospechosos en tiempo real.
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
                <p className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-blue-200 uppercase tracking-wider">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

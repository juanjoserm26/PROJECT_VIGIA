import Image from 'next/image';
import Header from '@/components/Header';
import Reveal from '@/components/Reveal';
import Features from '@/components/Features';
import WhatDefinesUs from '@/components/WhatDefinesUs';
import Team from '@/components/Team';
import PricingPlans from '@/components/PricingPlans';
import Testimonials from '@/components/Testimonials';
import Blog from '@/components/Blog';
import Newsletter from '@/components/Newsletter';
import ContactForm from '@/components/ContactForm';
import Certifications from '@/components/Certifications';
import BusinessPlan from '@/components/BusinessPlan';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Hero Section - Sevicol style */}
      <section className="relative w-full min-h-[640px] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/vigia-hero.jpg"
            alt="Centro de monitoreo con IA"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-28">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-400/30">
                <span className="w-2 h-2 bg-red-500 rounded-full vigia-blink"></span>
                <p className="text-blue-200 font-semibold uppercase tracking-widest text-xs">
                  SaaS de vigilancia con IA · Bucaramanga
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-3 leading-tight">
                Somos más que
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-blue-400 mb-8 leading-tight">
                vigilancia
              </h1>
            </Reveal>
            <Reveal delay={3}>
              <p className="text-lg sm:text-xl text-slate-200 mb-6 leading-relaxed max-w-2xl">
                Software en la nube que analiza el video de <strong className="text-white font-semibold">tus</strong>{' '}
                cámaras IP ya instaladas (ONVIF/RTSP) y alerta en tiempo real con IA YOLOv8 ante
                robos, atracos, riñas y conductas sospechosas.{' '}
                <strong className="text-white font-semibold">No vendemos cámaras ni equipos:</strong>{' '}
                integramos la inteligencia a la infraestructura que tú o tu entidad ya tienen.
              </p>
              <p className="text-base text-slate-300 mb-10 leading-relaxed max-w-2xl border-l-4 border-blue-500/60 pl-4">
                Trabajamos con <strong className="text-white font-semibold">varios tipos de clientes</strong>: fuerza
                pública y alcaldías, empresas y comercio, conjuntos residenciales, instituciones
                educativas y comunidad en general — no es un producto pensado para un solo sector.
              </p>
            </Reveal>
            <Reveal delay={4}>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="px-8 py-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 hover:-translate-y-0.5 transition inline-block text-center shadow-xl hover:shadow-2xl"
                >
                  <span className="block">Prueba 14 días gratis</span>
                  <span className="mt-1 block text-sm font-normal text-blue-100">
                    Te contactamos para activar el periodo sin complicaciones
                  </span>
                </a>
                <a
                  href="#what-we-do"
                  className="px-8 py-4 bg-transparent text-white rounded-md font-semibold border-2 border-white/40 hover:bg-white/10 hover:border-white hover:-translate-y-0.5 transition inline-block text-center"
                >
                  Conoce nuestros servicios
                </a>
              </div>
            </Reveal>

            {/* Trust indicators */}
            <Reveal delay={5}>
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl">
                <div>
                  <p className="text-3xl font-bold text-white">99.5%</p>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">SLA</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">YOLOv8</p>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">IA en tiempo real</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">ONVIF</p>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">Tus cámaras</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ¿Qué hacemos? */}
      <Features />

      {/* ¿Qué nos define? */}
      <WhatDefinesUs />

      {/* Pricing */}
      <PricingPlans />

      {/* Testimonials */}
      <Testimonials />

      {/* Team */}
      <Team />

      {/* Plan de Negocios (Canvas) */}
      <BusinessPlan />

      {/* Blog */}
      <Blog />

      {/* Newsletter */}
      <Newsletter />

      {/* Contact Form */}
      <ContactForm />

      {/* Certifications */}
      <Certifications />

      {/* Footer */}
      <Footer />
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import Reveal from './Reveal';
import type { ServiceSlug } from '@/lib/services-content';

export default function Features() {
  const services: {
    slug: ServiceSlug;
    image: string;
    title: string;
    description: string;
  }[] = [
    {
      slug: 'vigilancia-con-ia',
      image: '/images/vigia-service-ai.jpg',
      title: 'Vigilancia con IA',
      description:
        'Detección automática en tiempo real de robos, atracos, riñas y agresiones físicas con YOLOv8 sobre el video que ya capturan tus cámaras (criterios objetivos documentados).',
    },
    {
      slug: 'monitoreo-en-tiempo-real',
      image: '/images/vigia-service-monitoring.jpg',
      title: 'Monitoreo en tiempo real',
      description:
        'Panel web para visualizar flujos y gestionar alertas; integración ONVIF/RTSP con tus cámaras IP existentes sin software adicional en tu PC.',
    },
    {
      slug: 'analitica-avanzada',
      image: '/images/vigia-service-analytics.jpg',
      title: 'Analítica avanzada',
      description:
        'Eventos almacenados en base de datos para consulta histórica, patrones de riesgo por zona y horario, y reportes ejecutivos.',
    },
    {
      slug: 'innovacion',
      image: '/images/vigia-service-innovation.jpg',
      title: 'Innovación',
      description:
        'Suscripción SaaS (sin licencias perpetuas obligatorias): IA sobre tus cámaras IP ONVIF sin proyecto masivo de renovación de CCTV.',
    },
  ];

  return (
    <section id="what-we-do" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
            ¿Qué hacemos?
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Ofrecemos vigilancia inteligente como servicio en la nube para{' '}
            <strong className="text-slate-800 font-semibold">
              sector público, empresas, comercio, conjuntos residenciales, educación y comunidad
            </strong>
            . La propuesta es la misma: analizar el video de{' '}
            <strong className="text-slate-800 font-semibold">tus</strong> cámaras ya instaladas —
            PROJECT VIGIA no comercializa cámaras ni equipos de videovigilancia.
          </p>
        </Reveal>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Reveal
              key={index}
              delay={((index + 1) as 1 | 2 | 3 | 4)}
              className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm mb-5">
                  {service.description}
                </p>
                <Link
                  href={`/servicios/${service.slug}`}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm group/link"
                >
                  Ver servicio
                  <svg
                    className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

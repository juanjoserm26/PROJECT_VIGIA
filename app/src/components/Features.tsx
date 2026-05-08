import Link from 'next/link';
import Image from 'next/image';
import Reveal from './Reveal';

export default function Features() {
  const services = [
    {
      image: '/images/vigia-service-ai.jpg',
      title: 'Vigilancia con IA',
      description:
        'Detección automática en tiempo real de robos, atracos, riñas y comportamientos sospechosos con tecnología YOLOv8.',
    },
    {
      image: '/images/vigia-service-monitoring.jpg',
      title: 'Monitoreo en tiempo real',
      description:
        'Acceso instantáneo a múltiples flujos de video. Panel centralizado para supervisar cámaras IP existentes mediante ONVIF.',
    },
    {
      image: '/images/vigia-service-analytics.jpg',
      title: 'Analítica avanzada',
      description:
        'Análisis histórico de eventos, patrones de riesgo por zona y horario. Reportes ejecutivos para toma de decisiones.',
    },
    {
      image: '/images/vigia-service-innovation.jpg',
      title: 'Innovación',
      description:
        'Plataforma SaaS 100% software. Sin reemplazar tu infraestructura. Aprovecha tus cámaras IP Hikvision, Dahua o Axis.',
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
            En PROJECT VIGIA estamos comprometidos con la vigilancia inteligente, basados en la
            gestión del riesgo, con el apoyo de procesos innovadores y tecnológicos que nos
            permiten brindar soluciones para promover entornos seguros y tranquilos.
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
                  href="#what-defines-us"
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

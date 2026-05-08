import Image from 'next/image';
import Reveal from './Reveal';

export default function Blog() {
  const articles = [
    {
      category: 'IA en seguridad',
      title: 'YOLOv8 y vigilancia: cómo la IA detecta comportamientos sospechosos',
      date: '23 de abril de 2026',
      excerpt:
        'La detección de objetos en tiempo real con YOLOv8 transforma cámaras pasivas en sistemas inteligentes. Análisis técnico de la arquitectura.',
      image: '/images/vigia-blog-detection.jpg',
    },
    {
      category: 'Tecnología',
      title: 'Integración ONVIF: aprovecha tus cámaras IP existentes',
      date: '8 de abril de 2026',
      excerpt:
        'Hikvision, Dahua, Axis... todas las marcas compatibles con ONVIF se conectan a PROJECT VIGIA en menos de 10 minutos. Sin reemplazar hardware.',
      image: '/images/vigia-blog-cameras.jpg',
    },
    {
      category: 'Caso de éxito',
      title: 'Piloto barrio UIS: validación en entorno real de Bucaramanga',
      date: '16 de febrero de 2026',
      excerpt:
        'Cómo validamos PROJECT VIGIA en el sector cercano a la Universidad Industrial de Santander con apoyo de comercios y conjuntos residenciales.',
      image: '/images/vigia-service-innovation.jpg',
    },
    {
      category: 'Sector público',
      title: '808 cámaras municipales: el reto de la videovigilancia inteligente',
      date: '11 de febrero de 2026',
      excerpt:
        'Bucaramanga ha invertido más de $10.000M en cámaras CCTV. Cómo PROJECT VIGIA convierte esta infraestructura en una red activa de prevención.',
      image: '/images/vigia-service-monitoring.jpg',
    },
    {
      category: 'Conjuntos residenciales',
      title: 'Vigilancia para conjuntos: alertas WhatsApp y email automáticas',
      date: '5 de febrero de 2026',
      excerpt:
        'Reduce la dependencia del monitoreo humano constante. La administradora recibe notificación inmediata clasificada por tipo de evento.',
      image: '/images/vigia-service-ai.jpg',
    },
    {
      category: 'Analítica',
      title: 'Reportes de patrones de riesgo por zona y horario',
      date: '29 de enero de 2026',
      excerpt:
        'El módulo de analítica histórica identifica tendencias de eventos sospechosos. Decisiones operativas basadas en datos reales.',
      image: '/images/vigia-service-analytics.jpg',
    },
  ];

  return (
    <section id="blog" className="py-20 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
            Blog VIGIA
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Artículos, casos de éxito e insights sobre vigilancia inteligente, IA aplicada a la
            seguridad y experiencias de implementación en Bucaramanga y Colombia.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Reveal
              key={index}
              as="article"
              delay={(((index % 3) + 1) as 1 | 2 | 3)}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-white/95 text-slate-900 text-xs font-semibold px-3 py-1 rounded-full">
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-xs text-slate-500 mb-2">{article.date}</p>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition leading-snug">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  Leer más
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-blue-600 hover:text-white transition"
          >
            Ver todos los artículos
          </a>
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';
import Reveal from './Reveal';

/** Avatar sin foto: escudo tipo placa / seguridad (estrella en círculo), inspiración visual clásica de insignia policial. */
function InstitutionalSecurityAvatar() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      className="h-full w-full"
      role="img"
      aria-label="Insignia de seguridad institucional"
    >
      <circle cx="64" cy="64" r="64" fill="#0f172a" />
      {/* Escudo simétrico, punta inferior */}
      <path
        d="M64 16 L78 22 L90 36 L98 56 L100 74 L92 94 L64 112 L36 94 L28 74 L30 56 L38 36 L50 22 Z"
        fill="#facc15"
        stroke="#0a0a0a"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <circle
        cx="64"
        cy="58"
        r="24"
        fill="#fef9c3"
        stroke="#0a0a0a"
        strokeWidth="2.6"
      />
      <path
        d="M64 43 L67.8 55.2 H80.6 L70.4 62.8 L74.2 75.6 L64 68.4 L53.8 75.6 L57.6 62.8 L47.4 55.2 H60.2 L64 43z"
        fill="#0a0a0a"
      />
    </svg>
  );
}

type TestimonialPhoto = {
  name: string;
  title: string;
  text: string;
  avatar: string;
  institutional?: false;
};

type TestimonialInstitutional = {
  name: string;
  title: string;
  text: string;
  institutional: true;
};

type Testimonial = TestimonialPhoto | TestimonialInstitutional;

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: 'Capitán Andrés Ramírez',
      title: 'Coordinador Operativos · Policía Nacional, Bucaramanga',
      text: 'PROJECT VIGIA nos permite priorizar alertas con inteligencia artificial sin reemplazar las cámaras IP que ya opera la institución. La detección automática de comportamientos sospechosos optimiza nuestros recursos y mejora los tiempos de respuesta operativa.',
      avatar: '/images/avatar-capitan.jpg',
    },
    {
      name: 'Laura Gómez',
      title: 'Administradora · Conjunto Residencial, Bucaramanga',
      text: 'La integración con nuestras cámaras Hikvision fue inmediata mediante ONVIF. Ahora recibimos alertas automáticas por WhatsApp y email cuando se detectan eventos sospechosos. Redujimos la dependencia del monitoreo manual del personal de portería.',
      avatar: '/images/avatar-laura.jpg',
    },
    {
      name: 'Carlos Martínez',
      title: 'Estudiante · Universidad Industrial de Santander',
      text: 'Como residente del barrio cerca de la UIS, me siento más seguro sabiendo que las cámaras IP que ya había en el sector ahora se analizan en tiempo real con IA. La respuesta ante eventos como robos y riñas es notablemente más rápida.',
      avatar: '/images/avatar-carlos.jpg',
    },
    {
      name: 'Equipo Sec. de Seguridad',
      title: 'Alcaldía de Bucaramanga · Plan piloto institucional',
      text: 'La plataforma se conecta a la red de videovigilancia que ya opera la ciudad, con cientos de cámaras instaladas por la administración. Para nosotros es prioritario poder apoyar la seguridad ciudadana con análisis inteligente sobre la infraestructura que ya tenemos, sin obligarnos a reemplazar equipos; las pruebas en el entorno cercano a la UIS nos dieron la confianza de que la solución responde a lo que necesitamos en la práctica.',
      institutional: true,
    },
  ];

  return (
    <section id="testimonials" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
            Lo que dicen nuestros clientes
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Fuerza pública, administración municipal, conjuntos residenciales, comercios,
            instituciones educativas y personas de la comunidad confían en PROJECT VIGIA. No
            estamos pensados para un solo tipo de cliente: la misma plataforma sirve a varios
            sectores, siempre conectada a <strong className="text-slate-800 font-semibold">sus</strong>{' '}
            propias cámaras IP.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Reveal
              key={index}
              delay={((index % 2) + 1) as 1 | 2}
              className="relative bg-slate-50 rounded-lg p-8 border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Quote mark */}
              <div className="absolute top-6 right-6 text-6xl text-blue-100 font-serif leading-none">
                &ldquo;
              </div>

              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-lg">
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-700 leading-relaxed mb-6 relative z-10">
                {testimonial.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-blue-200 bg-slate-100">
                  {'institutional' in testimonial && testimonial.institutional ? (
                    <InstitutionalSecurityAvatar />
                  ) : (
                    <Image
                      src={(testimonial as TestimonialPhoto).avatar}
                      alt={testimonial.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.title}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-slate-700 text-lg mb-5 max-w-2xl mx-auto">
            ¿Representas a una entidad pública, una empresa, un conjunto, una institución educativa
            u otra organización? Cuéntanos cuántas cámaras IP quieres integrar — no vendemos
            equipos; conectamos nuestro software a las tuyas.
          </p>
          <a
            href="#pricing"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Contratar mi plan ahora
          </a>
        </div>
      </div>
    </section>
  );
}

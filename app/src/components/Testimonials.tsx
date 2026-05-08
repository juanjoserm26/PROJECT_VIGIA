import Image from 'next/image';
import Reveal from './Reveal';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Capitán Andrés Ramírez',
      title: 'Coordinador Operativos · Policía Nacional, Bucaramanga',
      text: 'PROJECT VIGIA nos permite priorizar alertas con inteligencia artificial sin reemplazar las cámaras existentes. La detección automática de comportamientos sospechosos optimiza nuestros recursos y mejora los tiempos de respuesta operativa.',
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
      text: 'Como residente del barrio cerca de la UIS, me siento más seguro sabiendo que las cámaras del sector ahora analizan video en tiempo real. La respuesta ante eventos como robos y riñas es notablemente más rápida.',
      avatar: '/images/avatar-carlos.jpg',
    },
    {
      name: 'Equipo Sec. de Seguridad',
      title: 'Alcaldía de Bucaramanga · Plan piloto institucional',
      text: 'La plataforma demuestra el potencial de las 808 cámaras instaladas en la ciudad. El piloto en el barrio UIS validó la viabilidad técnica y operativa para escalar a todo el sistema municipal de videovigilancia.',
      avatar: '/images/avatar-capitan.jpg',
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
            Entidades de seguridad pública, conjuntos residenciales y la comunidad universitaria
            confían en PROJECT VIGIA. Conoce las experiencias reales de quienes ya transformaron
            su vigilancia.
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
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-200">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
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
          <p className="text-slate-700 text-lg mb-5">
            ¿Tu empresa o entidad busca mejorar su sistema de vigilancia?
          </p>
          <a
            href="#contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Solicitar demo gratuita 30 días
          </a>
        </div>
      </div>
    </section>
  );
}

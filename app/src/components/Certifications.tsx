import Reveal from './Reveal';

export default function Certifications() {
  const certs = [
    {
      code: 'ISO/IEC 27001:2022',
      title: 'Seguridad de la Información',
      description:
        'Estándar internacional para la implementación, mantenimiento y mejora continua de un Sistema de Gestión de la Seguridad de la Información.',
    },
    {
      code: 'ISO 9001:2015',
      title: 'Gestión de la Calidad',
      description:
        'Norma internacional basada en la gestión y los requisitos de control de los procesos destinada a alcanzar la mejora continua.',
    },
    {
      code: 'ISO 14001:2015',
      title: 'Gestión Ambiental',
      description:
        'Marco con el que protegemos el medio ambiente y respondemos a las condiciones ambientales cambiantes en nuestras operaciones cloud.',
    },
    {
      code: 'GDPR',
      title: 'Protección de Datos',
      description:
        'Cumplimiento total con el Reglamento General de Protección de Datos europeo y la Ley 1581 de Habeas Data en Colombia.',
    },
    {
      code: 'SOC 2 Type II',
      title: 'Controles de Seguridad',
      description:
        'Auditoría externa que verifica la seguridad, disponibilidad e integridad de los datos del cliente en nuestra infraestructura SaaS.',
    },
    {
      code: 'ONVIF Profile S/T',
      title: 'Interoperabilidad',
      description:
        'Compatibilidad certificada con el estándar abierto de la industria para integración con cámaras IP de cualquier fabricante.',
    },
    {
      code: 'AWS Partner',
      title: 'Infraestructura Cloud',
      description:
        'Partner verificado de Amazon Web Services con arquitectura validada para cargas de trabajo de IA y video en tiempo real.',
    },
    {
      code: 'Pacto Global',
      title: 'Responsabilidad Social',
      description:
        'Adheridos a los diez principios de Naciones Unidas en derechos humanos, estándares laborales, medio ambiente y anticorrupción.',
    },
  ];

  return (
    <section id="certifications" className="py-20 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
            Certificaciones y Agremiaciones
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Cumplimos los más altos estándares internacionales de seguridad, calidad y
            responsabilidad social para garantizar la confianza de nuestros clientes.
          </p>
        </div>

        {/* Cert Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certs.map((cert, index) => (
            <Reveal
              key={index}
              variant="zoom"
              delay={(((index % 4) + 1) as 1 | 2 | 3 | 4)}
              className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-md flex items-center justify-center mb-4">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <p className="text-xs uppercase tracking-wider text-blue-700 font-bold mb-1">
                {cert.code}
              </p>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{cert.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{cert.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

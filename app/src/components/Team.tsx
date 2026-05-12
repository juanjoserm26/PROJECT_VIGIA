import Image from 'next/image';
import Reveal from './Reveal';

export default function Team() {
  const members = [
    {
      name: 'Jhoan Sebastián García Reyes',
      role: 'CTO · Director de Tecnología',
      description:
        'Estudiante de décimo semestre de Ingeniería de Sistemas en la UIS. Experiencia en desarrollo de software (Python, FastAPI, React, Spring Boot, Docker), inteligencia artificial y visión por computador.',
      skills: ['Python', 'YOLOv8', 'FastAPI', 'Docker', 'PostgreSQL'],
    },
    {
      name: 'Juan José Rincón Méndez',
      role: 'CEO · Gerente General',
      description:
        'Estudiante de décimo semestre de Ingeniería de Sistemas en la UIS. Conocimientos en desarrollo de software, análisis de datos, gestión de proyectos y habilidades comerciales. Enfocado en emprendimiento tecnológico.',
      skills: ['Estrategia', 'Gestión', 'Analítica', 'React', 'Liderazgo'],
    },
  ];

  return (
    <section id="team" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
            Conoce al equipo
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Dos estudiantes de Ingeniería de Sistemas de la UIS desarrollando una plataforma SaaS
            para <strong className="text-slate-800 font-semibold">varios sectores</strong>: desde
            fuerza pública y municipios hasta comercio, conjuntos residenciales y educación. El
            foco es el software de análisis de video; las cámaras siguen siendo de cada cliente.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Team photo */}
          <Reveal variant="zoom" className="relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl">
            <Image
              src="/images/vigia-team.png"
              alt="Juan José Rincón y Jhoan Sebastián García — equipo PROJECT VIGIA"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </Reveal>

          {/* Members list */}
          <div className="space-y-8">
            {members.map((member, index) => (
              <Reveal
                key={index}
                variant="slide"
                delay={((index + 1) as 1 | 2)}
                className="bg-slate-50 border-l-4 border-blue-600 rounded-r-lg p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-blue-700 font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {member.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}

            <Reveal delay={3} className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-sm text-slate-700">
              <p className="font-semibold mb-1">📍 Universidad Industrial de Santander</p>
              <p>
                PROJECT VIGIA es respaldado por el Fondo Emprender del SENA y desarrollado en
                el ecosistema de innovación de la UIS en Bucaramanga.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

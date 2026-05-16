import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Logo size={48} circleMask />
              <div className="flex flex-col leading-tight">
                <span className="text-white font-bold text-lg">PROJECT VIGIA</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">
                  SaaS · múltiples sectores
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Plataforma SaaS de análisis de video con IA: conectamos a las cámaras IP que ya
              tienes (no vendemos hardware). Atendemos fuerza pública y municipios, empresas y
              comercio, conjuntos residenciales, educación y comunidad en general.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 bg-slate-800 hover:bg-blue-600 transition rounded flex items-center justify-center text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://wa.me/573150502630"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 bg-slate-800 hover:bg-green-600 transition rounded flex items-center justify-center text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Dirección */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Dirección
            </h4>
            <div className="space-y-4 text-sm text-slate-400">
              <div>
                <p className="font-semibold text-slate-300 mb-1">Sede principal</p>
                <p>Universidad Industrial de Santander</p>
                <p>Cra. 27 #9, Bucaramanga</p>
                <p>Santander, Colombia</p>
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Servicios
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/servicios/vigilancia-con-ia" className="text-slate-400 hover:text-white transition">
                  Vigilancia con IA
                </Link>
              </li>
              <li>
                <Link href="/servicios/monitoreo-en-tiempo-real" className="text-slate-400 hover:text-white transition">
                  Monitoreo en tiempo real
                </Link>
              </li>
              <li>
                <Link href="/servicios/analitica-avanzada" className="text-slate-400 hover:text-white transition">
                  Analítica avanzada
                </Link>
              </li>
              <li>
                <Link href="/servicios/innovacion" className="text-slate-400 hover:text-white transition">
                  Innovación
                </Link>
              </li>
              <li>
                <Link href="/plans" className="text-slate-400 hover:text-white transition">
                  Planes y precios
                </Link>
              </li>
              <li>
                <Link href="/#business-plan" className="text-slate-400 hover:text-white transition">
                  Plan de negocios
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <p className="text-slate-500 text-xs mb-1">Línea Única Nacional</p>
                <a
                  href="tel:+573150502630"
                  className="text-slate-300 hover:text-white transition text-base font-semibold"
                >
                  315 050 2630
                </a>
              </li>
              <li>
                <p className="text-slate-500 text-xs mb-1">Correo</p>
                <a
                  href="mailto:contacto@projectvigia.co"
                  className="text-slate-300 hover:text-white transition"
                >
                  contacto@projectvigia.co
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/asesoria"
                  className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm transition"
                >
                  Solicitar asesoría
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; 2026 PROJECT VIGIA. Todos los derechos reservados.</p>
            <div className="flex flex-wrap gap-5">
              <Link href="#" className="hover:text-white transition">
                Política de tratamiento de datos
              </Link>
              <Link href="#" className="hover:text-white transition">
                Términos y condiciones
              </Link>
              <Link href="#" className="hover:text-white transition">
                Cumplimiento GDPR
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

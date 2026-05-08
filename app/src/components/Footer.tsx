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
              <Logo size={48} />
              <div className="flex flex-col leading-tight">
                <span className="text-white font-bold text-lg">PROJECT VIGIA</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">
                  Vigilancia inteligente
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Plataforma SaaS de vigilancia inteligente con IA. Monitoreo en tiempo real,
              detección automática y analítica avanzada para empresas modernas.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 bg-slate-800 hover:bg-blue-600 transition rounded flex items-center justify-center"
              >
                <span className="text-sm">in</span>
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 bg-slate-800 hover:bg-blue-600 transition rounded flex items-center justify-center"
              >
                <span className="text-sm">𝕏</span>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 bg-slate-800 hover:bg-blue-600 transition rounded flex items-center justify-center"
              >
                <span className="text-sm">📷</span>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 bg-slate-800 hover:bg-blue-600 transition rounded flex items-center justify-center"
              >
                <span className="text-sm">▶</span>
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
              <div>
                <p className="font-semibold text-slate-300 mb-1">Sede Bogotá</p>
                <p>Calle 71a No. 29 - 44</p>
                <p>Barrio La Merced Norte</p>
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
                <Link href="#what-we-do" className="text-slate-400 hover:text-white transition">
                  Vigilancia con IA
                </Link>
              </li>
              <li>
                <Link href="#what-we-do" className="text-slate-400 hover:text-white transition">
                  Monitoreo en tiempo real
                </Link>
              </li>
              <li>
                <Link href="#what-we-do" className="text-slate-400 hover:text-white transition">
                  Analítica avanzada
                </Link>
              </li>
              <li>
                <Link href="#what-we-do" className="text-slate-400 hover:text-white transition">
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
                  href="tel:+573152228982"
                  className="text-slate-300 hover:text-white transition text-base font-semibold"
                >
                  315 222 8982
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
                  href="#contact"
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

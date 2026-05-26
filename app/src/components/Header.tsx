'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useState } from 'react';
import type { FocusEvent } from 'react';
import Logo from './Logo';
import PqrsDialog from './PqrsDialog';
import PqrsNotificationsBell from './PqrsNotificationsBell';
import CameraAlertsBell from './CameraAlertsBell';
import { clearDemoSession, DEMO_SESSION_KEY, getDemoSession, type DemoSession, VIGIA_SESSION_CHANGED_EVENT } from '@/lib/demo-session';

/** Puerta entreabierta + salida (línea fina, para “cerrar sesión”) */
function DoorExitIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 4h9v16H5a1 1 0 01-1-1V5a1 1 0 011-1z" opacity={0.35} />
      <path d="M14 6l7 3v12l-7 3V6z" />
      <circle cx="17.5" cy="12" r={0.9} fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [pqrsOpen, setPqrsOpen] = useState(false);
  const [session, setSession] = useState<DemoSession | null>(null);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const servicesMenuPanelId = useId();

  function handleServicesBlur(e: FocusEvent<HTMLDivElement>) {
    const next = e.relatedTarget;
    if (next instanceof Node && e.currentTarget.contains(next)) return;
    setServicesMenuOpen(false);
  }

  const refreshSession = useCallback(() => {
    setSession(getDemoSession());
  }, []);

  useEffect(() => {
    refreshSession();
  }, [pathname, refreshSession]);

  useEffect(() => {
    function onSessionSync() {
      refreshSession();
    }
    window.addEventListener(VIGIA_SESSION_CHANGED_EVENT, onSessionSync);
    return () => window.removeEventListener(VIGIA_SESSION_CHANGED_EVENT, onSessionSync);
  }, [refreshSession]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === DEMO_SESSION_KEY || e.key === null) refreshSession();
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshSession]);

  function handleLogout() {
    clearDemoSession();
    setSession(null);
    setIsOpen(false);
    router.refresh();
    router.push('/');
  }

  const topLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Nosotros', href: '/#what-defines-us' },
    { label: 'Equipo', href: '/#team' },
    { label: 'Plan de negocios', href: '/#business-plan' },
    { label: 'Testimonios', href: '/#testimonials' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contacto', href: '/#contact' },
    { label: 'Demostración', href: '/demostracion' },
    { label: 'Mis cámaras', href: '/monitoreo' },
  ];

  const serviceLinks = [
    { label: 'Vigilancia con IA', href: '/servicios/vigilancia-con-ia' },
    { label: 'Monitoreo en tiempo real', href: '/servicios/monitoreo-en-tiempo-real' },
    { label: 'Analítica avanzada', href: '/servicios/analitica-avanzada' },
    { label: 'Innovación', href: '/servicios/innovacion' },
    { label: 'Planes y precios', href: '/#pricing' },
    { label: 'Certificaciones', href: '/#certifications' },
  ];

  const serviceMenuLinks = serviceLinks.slice(0, -1);
  const certificacionesLink = serviceLinks[serviceLinks.length - 1]!;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top utility bar */}
      <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-9">
          <div className="flex gap-4">
            <span>📞 +57 315 050 2630</span>
            <span>✉ contacto@projectvigia.co</span>
          </div>
          <div className="flex gap-5 items-center">
            <button
              type="button"
              onClick={() => setPqrsOpen(true)}
              className="hover:text-white transition text-left"
            >
              PQRS
            </button>
            {session ? (
              <>
                <div className="flex min-w-0 max-w-[min(28rem,46vw)] items-center gap-2 border-r border-slate-600 pr-4 mr-1">
                  <span className="truncate text-xs font-semibold text-white">{session.clientLabel}</span>
                  <span className="shrink-0 text-slate-500" aria-hidden>
                    ·
                  </span>
                  <span className="truncate text-xs text-slate-300" title={session.email}>
                    {session.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-white transition hover:bg-white/10 hover:text-white"
                >
                  <DoorExitIcon className="h-4 w-4 shrink-0 opacity-90" />
                  <span className="font-medium">Cerrar sesión</span>
                </button>
              </>
            ) : (
              <Link href="/iniciar-sesion" className="hover:text-white transition font-medium text-blue-300">
                Ingresa
              </Link>
            )}
            <Link href="/portal-cliente" className="hover:text-white transition shrink-0">
              Portal cliente
            </Link>
            {session ? (
              <>
                <CameraAlertsBell />
                <PqrsNotificationsBell />
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main bar with logo + nav */}
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20 gap-3 lg:gap-4">
            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center gap-3 group">
              <Logo size={48} className="transition-transform group-hover:scale-105" />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-xl font-bold text-slate-900">
                  PROJECT <span className="text-blue-600">VIGIA</span>
                </span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">
                  SaaS · varios sectores
                </span>
              </div>
            </Link>

            {/* Desktop: enlaces repartidos entre logo y CTA */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-x-4 xl:gap-x-6 min-w-0 px-2 xl:px-4 flex-wrap">
              {topLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="whitespace-nowrap text-center text-sm text-slate-700 hover:text-blue-700 transition font-medium shrink-0"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/asesoria"
              className="hidden lg:inline-flex shrink-0 items-center px-5 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow"
            >
              Solicitar asesoría
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-700 ml-auto"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Services / categories bar */}
      <div className="hidden lg:block bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Servicios y certificaciones"
            className="flex items-center justify-center gap-12 xl:gap-14 h-12"
          >
            <div
              className={`relative z-50 ${servicesMenuOpen ? 'z-[60]' : ''}`}
              onMouseEnter={() => setServicesMenuOpen(true)}
              onMouseLeave={() => setServicesMenuOpen(false)}
              onFocusCapture={() => setServicesMenuOpen(true)}
              onBlur={handleServicesBlur}
            >
              <button
                type="button"
                className={`flex h-12 items-center gap-1.5 text-sm font-medium outline-none transition hover:text-blue-700 ${servicesMenuOpen ? 'text-blue-700' : 'text-slate-700'}`}
                aria-expanded={servicesMenuOpen}
                aria-haspopup="true"
                aria-controls={servicesMenuPanelId}
              >
                Servicios
                <svg
                  className={`h-4 w-4 shrink-0 text-slate-500 transition duration-200 ${servicesMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                id={servicesMenuPanelId}
                role="region"
                aria-label="Enlaces de servicios"
                hidden={!servicesMenuOpen}
                className="absolute left-0 top-full z-50 min-w-[min(100vw-2rem,17rem)] -mt-2 pt-2"
              >
                <div className="rounded-xl border border-slate-200/90 bg-gradient-to-b from-white via-white to-slate-50/90 py-2 shadow-xl shadow-slate-900/[0.08] ring-1 ring-slate-900/[0.05]">
                  <ul className="space-y-0.5 px-1.5 py-1">
                    {serviceMenuLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group mx-0 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-blue-50/90 hover:text-blue-800 active:bg-blue-100/80"
                        >
                          <span
                            className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center"
                            aria-hidden
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/40 transition-all duration-200 group-hover:scale-125 group-hover:bg-blue-600 group-hover:shadow-[0_0_10px_rgba(37,99,235,0.35)]" />
                          </span>
                          <span className="min-w-0 flex-1 leading-snug">{link.label}</span>
                          <svg
                            className="h-4 w-4 shrink-0 text-blue-600 opacity-0 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-90"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <Link
              href={certificacionesLink.href}
              className="relative whitespace-nowrap text-sm font-medium text-slate-700 transition hover:text-blue-700 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-blue-600 after:transition-transform hover:after:scale-x-100"
            >
              {certificacionesLink.label}
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200">
          <nav className="px-4 py-3 space-y-1">
            {topLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block px-3 py-2 rounded text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-slate-200 my-2" />
            <p className="px-3 pt-1 pb-1 text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Servicios
            </p>
            {serviceMenuLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block px-3 py-2 rounded text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <p className="px-3 pt-3 pb-1 text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Certificaciones
            </p>
            <Link
              href={certificacionesLink.href}
              className="block px-3 py-2 rounded text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition"
              onClick={() => setIsOpen(false)}
            >
              {certificacionesLink.label}
            </Link>
            <Link
              href="/asesoria"
              onClick={() => setIsOpen(false)}
              className="block mt-3 px-3 py-2 rounded bg-blue-600 text-white font-semibold text-center hover:bg-blue-700 transition"
            >
              Solicitar asesoría
            </Link>
            <div className="border-t border-slate-200 my-3" />
            <p className="px-3 pt-1 pb-1 text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Enlaces rápidos
            </p>
            <button
              type="button"
              onClick={() => {
                setPqrsOpen(true);
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition"
            >
              PQRS
            </button>
            {session ? (
              <>
                <div className="mx-3 my-2 min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p
                    className="truncate text-xs text-slate-800"
                    title={`${session.clientLabel} · ${session.email}`}
                  >
                    <span className="font-semibold">{session.clientLabel}</span>
                    <span className="text-slate-400"> · </span>
                    <span className="text-slate-600">{session.email}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition"
                >
                  <DoorExitIcon className="h-5 w-5 shrink-0" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href="/iniciar-sesion"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition"
              >
                Ingresa
              </Link>
            )}
            <Link
              href="/portal-cliente"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition"
            >
              Portal cliente
            </Link>
            {session ? (
              <div className="mx-3 my-2 space-y-3 rounded-lg bg-slate-900 px-3 py-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Alertas de monitoreo
                  </p>
                  <CameraAlertsBell className="inline-block" />
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Notificaciones PQRS
                  </p>
                  <PqrsNotificationsBell className="inline-block" />
                </div>
              </div>
            ) : null}
          </nav>
        </div>
      )}
      <PqrsDialog open={pqrsOpen} onClose={() => setPqrsOpen(false)} />
    </header>
  );
}

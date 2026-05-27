'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Logo from './Logo';
import PqrsDialog from './PqrsDialog';
import NotificationsBell from './NotificationsBell';
import { DEMO_SESSION_KEY, getDemoSession, logoutVigiaSession, type DemoSession, VIGIA_SESSION_CHANGED_EVENT } from '@/lib/demo-session';

/** Puerta entreabierta + salida (línea fina, para “cerrar sesión”) */
function NavChevronIcon({ direction, className }: { direction: 'left' | 'right'; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
      />
    </svg>
  );
}

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
  const [activeNavHref, setActiveNavHref] = useState('/');
  const [navOverflow, setNavOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [servicesMenuPos, setServicesMenuPos] = useState({ top: 0, left: 0 });
  const navScrollRef = useRef<HTMLDivElement>(null);
  const navScrollSavedRef = useRef<number | null>(null);
  const servicesNavItemRef = useRef<HTMLLIElement>(null);
  const servicesAnchorRef = useRef<HTMLButtonElement>(null);
  const servicesCloseTimerRef = useRef<number | null>(null);
  const servicesMenuPanelId = useId();

  const updateNavScrollState = useCallback(() => {
    const el = navScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const overflow = scrollWidth > clientWidth + 2;
    setNavOverflow(overflow);
    setCanScrollLeft(overflow && scrollLeft > 4);
    setCanScrollRight(overflow && scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  function scrollNav(direction: 'left' | 'right') {
    const el = navScrollRef.current;
    if (!el) return;
    const step = Math.max(160, Math.floor(el.clientWidth * 0.55));
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  }

  const scrollNavToServicios = useCallback((smooth = false) => {
    const container = navScrollRef.current;
    const item = servicesNavItemRef.current;
    if (!container || !item) return;

    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;

    const itemLeft = item.offsetLeft;
    const itemRight = itemLeft + item.offsetWidth;
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;
    const padding = 20;

    if (itemLeft >= viewLeft + padding && itemRight <= viewRight - padding) return;

    let target = itemRight - container.clientWidth + padding;
    target = Math.max(0, Math.min(target, maxScroll));
    container.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    updateNavScrollState();
    const el = navScrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateNavScrollState, { passive: true });
    const observer = new ResizeObserver(updateNavScrollState);
    observer.observe(el);

    window.addEventListener('resize', updateNavScrollState);
    const t = window.setTimeout(updateNavScrollState, 120);

    return () => {
      el.removeEventListener('scroll', updateNavScrollState);
      observer.disconnect();
      window.removeEventListener('resize', updateNavScrollState);
      window.clearTimeout(t);
    };
  }, [updateNavScrollState]);

  useEffect(() => {
    if (!pathname.startsWith('/servicios/')) return;
    const el = navScrollRef.current;
    if (!el) return;

    const saveScroll = () => {
      navScrollSavedRef.current = el.scrollLeft;
    };
    saveScroll();
    el.addEventListener('scroll', saveScroll, { passive: true });
    return () => el.removeEventListener('scroll', saveScroll);
  }, [pathname]);

  useLayoutEffect(() => {
    if (!pathname.startsWith('/servicios/')) return;

    const el = navScrollRef.current;
    if (!el) return;

    const saved = navScrollSavedRef.current;
    if (saved != null) {
      el.scrollLeft = saved;
      updateNavScrollState();
      return;
    }

    scrollNavToServicios(false);
    navScrollSavedRef.current = el.scrollLeft;
    updateNavScrollState();
  }, [pathname, scrollNavToServicios, updateNavScrollState]);

  const syncActiveFromUrl = useCallback(() => {
    const hash = window.location.hash;
    if (pathname === '/' || pathname === '') {
      setActiveNavHref(hash ? `/${hash}` : '/');
      return;
    }
    setActiveNavHref(pathname);
  }, [pathname]);

  useEffect(() => {
    syncActiveFromUrl();
    window.addEventListener('hashchange', syncActiveFromUrl);
    window.addEventListener('popstate', syncActiveFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncActiveFromUrl);
      window.removeEventListener('popstate', syncActiveFromUrl);
    };
  }, [syncActiveFromUrl]);

  function linkIsActive(href: string): boolean {
    if (activeNavHref === href) return true;
    if (!href.startsWith('/#') && href !== '/') {
      return pathname === href || pathname.startsWith(`${href}/`);
    }
    return false;
  }

  function handleNavClick(href: string) {
    setActiveNavHref(href);
    if (typeof window === 'undefined') return;
    if (href.startsWith('/#')) {
      window.history.replaceState(null, '', href);
    } else if (href === '/' && (pathname === '/' || pathname === '')) {
      window.history.replaceState(null, '', '/');
    }
  }

  const updateServicesMenuPos = useCallback(() => {
    const btn = servicesAnchorRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setServicesMenuPos({
      top: rect.bottom + 6,
      left: rect.left + rect.width / 2,
    });
  }, []);

  function cancelServicesClose() {
    if (servicesCloseTimerRef.current) {
      window.clearTimeout(servicesCloseTimerRef.current);
      servicesCloseTimerRef.current = null;
    }
  }

  function scheduleServicesClose() {
    cancelServicesClose();
    servicesCloseTimerRef.current = window.setTimeout(() => setServicesMenuOpen(false), 160);
  }

  function openServicesMenu() {
    cancelServicesClose();
    updateServicesMenuPos();
    setServicesMenuOpen(true);
  }

  useEffect(() => {
    if (!servicesMenuOpen) return;
    updateServicesMenuPos();
    window.addEventListener('resize', updateServicesMenuPos);
    window.addEventListener('scroll', updateServicesMenuPos, true);
    return () => {
      window.removeEventListener('resize', updateServicesMenuPos);
      window.removeEventListener('scroll', updateServicesMenuPos, true);
    };
  }, [servicesMenuOpen, updateServicesMenuPos]);

  function navLinkClass(href: string): string {
    const active = linkIsActive(href);
    return [
      'relative inline-flex whitespace-nowrap px-2 py-2 text-[13px] font-medium text-slate-700 transition-colors xl:text-sm',
      'after:pointer-events-none after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:rounded-full after:bg-blue-600 after:transition-transform after:duration-200',
      active
        ? 'font-semibold text-blue-700 after:!scale-x-100'
        : 'after:scale-x-0 hover:text-blue-700',
    ].join(' ');
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
    logoutVigiaSession();
    setSession(null);
    setIsOpen(false);
    router.refresh();
    router.push('/');
  }

  const siteNavLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Nosotros', href: '/#what-defines-us' },
    { label: 'Equipo', href: '/#team' },
    { label: 'Plan de negocios', href: '/#business-plan' },
    { label: 'Testimonios', href: '/#testimonials' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contacto', href: '/#contact' },
  ];

  const accountNavLinks = [
    { label: 'Demostración', href: '/demostracion' },
    { label: 'Mis cámaras', href: '/monitoreo' },
    { label: 'Mis planes', href: '/mis-planes' },
  ];

  const topLinks = [...siteNavLinks, ...accountNavLinks];

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
  const servicesNavActive = serviceMenuLinks.some((l) => linkIsActive(l.href));

  const servicesMenuPortal =
    servicesMenuOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            id={servicesMenuPanelId}
            role="region"
            aria-label="Enlaces de servicios"
            className="fixed z-[200] min-w-[min(100vw-2rem,17rem)] -translate-x-1/2"
            style={{ top: servicesMenuPos.top, left: servicesMenuPos.left }}
            onMouseEnter={cancelServicesClose}
            onMouseLeave={scheduleServicesClose}
          >
            <div className="rounded-xl border border-slate-200/90 bg-gradient-to-b from-white via-white to-slate-50/90 py-2 shadow-xl shadow-slate-900/[0.08] ring-1 ring-slate-900/[0.05]">
              <ul className="space-y-0.5 px-1.5 py-1">
                {serviceMenuLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group mx-0 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-blue-50/90 hover:text-blue-800"
                      onClick={() => {
                        const nav = navScrollRef.current;
                        if (nav) navScrollSavedRef.current = nav.scrollLeft;
                        setServicesMenuOpen(false);
                        handleNavClick(link.href);
                      }}
                    >
                      <span
                        className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center"
                        aria-hidden
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 transition-all group-hover:scale-125 group-hover:bg-blue-600" />
                      </span>
                      <span className="min-w-0 flex-1 leading-snug">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top utility bar */}
      <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs">
        <div className="mx-auto flex h-9 w-full max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
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
            {session ? <NotificationsBell /> : null}
          </div>
        </div>
      </div>

      {/* Fila 1: logo (izq) · menú principal (centro) · CTA (der) */}
      <div className="border-b border-slate-200">
        <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex h-20 items-center justify-between gap-4 lg:gap-6">
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-3"
              onClick={() => handleNavClick('/')}
            >
              <Logo size={48} className="transition-transform group-hover:scale-105" />
              <div className="hidden flex-col leading-tight sm:flex">
                <span className="text-xl font-bold text-slate-900">
                  PROJECT <span className="text-blue-600">VIGIA</span>
                </span>
                <span className="text-xs uppercase tracking-wider text-slate-500">SaaS · varios sectores</span>
              </div>
            </Link>

            <nav
              className="hidden min-w-0 flex-1 items-center lg:flex"
              aria-label="Navegación principal"
            >
              <div className="flex min-w-0 flex-1 items-center gap-1">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                  {navOverflow ? (
                    <button
                      type="button"
                      onClick={() => scrollNav('left')}
                      disabled={!canScrollLeft}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-30"
                      aria-label="Ver enlaces anteriores"
                    >
                      <NavChevronIcon direction="left" className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                <div
                  ref={navScrollRef}
                  className="min-w-0 flex-1 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  <ul className="flex w-max flex-nowrap items-center gap-x-2 px-1 xl:gap-x-3">
                    {siteNavLinks.map((link) => (
                      <li key={link.label} className="shrink-0">
                        <Link
                          href={link.href}
                          className={navLinkClass(link.href)}
                          onClick={() => handleNavClick(link.href)}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    <li className="mx-0.5 h-4 w-px shrink-0 bg-slate-300" aria-hidden />
                    {accountNavLinks.map((link) => (
                      <li key={link.label} className="shrink-0">
                        <Link
                          href={link.href}
                          className={navLinkClass(link.href)}
                          onClick={() => handleNavClick(link.href)}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    <li className="mx-0.5 h-4 w-px shrink-0 bg-slate-300" aria-hidden />
                    <li
                      ref={servicesNavItemRef}
                      className="relative shrink-0"
                      onMouseEnter={openServicesMenu}
                      onMouseLeave={scheduleServicesClose}
                    >
                      <button
                        ref={servicesAnchorRef}
                        type="button"
                        className={[
                          'relative inline-flex items-center gap-1 px-2 py-2 text-[13px] font-medium transition-colors xl:text-sm',
                          'after:pointer-events-none after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:rounded-full after:bg-blue-600 after:transition-transform after:duration-200',
                          servicesMenuOpen || servicesNavActive
                            ? 'font-semibold text-blue-700 after:!scale-x-100'
                            : 'text-slate-700 after:scale-x-0 hover:text-blue-700',
                        ].join(' ')}
                        aria-expanded={servicesMenuOpen}
                        aria-haspopup="true"
                        aria-controls={servicesMenuPanelId}
                        onClick={() => {
                          if (servicesMenuOpen) setServicesMenuOpen(false);
                          else openServicesMenu();
                        }}
                      >
                        Servicios
                        <svg
                          className={`h-3.5 w-3.5 shrink-0 transition duration-200 ${servicesMenuOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </li>
                    <li className="shrink-0">
                      <Link
                        href={certificacionesLink.href}
                        className={navLinkClass(certificacionesLink.href)}
                        onClick={() => handleNavClick(certificacionesLink.href)}
                      >
                        {certificacionesLink.label}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                  {navOverflow ? (
                    <button
                      type="button"
                      onClick={() => scrollNav('right')}
                      disabled={!canScrollRight}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-30"
                      aria-label="Ver más enlaces"
                    >
                      <NavChevronIcon direction="right" className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/asesoria"
                className="hidden items-center rounded-md bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow transition hover:bg-blue-700 lg:inline-flex xl:px-5 xl:py-2.5 xl:text-sm"
              >
                Solicitar asesoría
              </Link>
              <button
                type="button"
                className="p-2 text-slate-700 lg:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Abrir menú"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200">
          <nav className="px-4 py-3 space-y-1">
            {siteNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`block border-l-[3px] px-3 py-2 transition ${
                  linkIsActive(link.href)
                    ? 'border-blue-600 bg-blue-50 font-semibold text-blue-700'
                    : 'border-transparent text-slate-700 hover:bg-slate-100 hover:text-blue-700'
                }`}
                onClick={() => {
                  handleNavClick(link.href);
                  setIsOpen(false);
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-slate-200 my-2" />
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tu cuenta
            </p>
            {accountNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`block border-l-[3px] px-3 py-2 transition ${
                  linkIsActive(link.href)
                    ? 'border-blue-600 bg-blue-50 font-semibold text-blue-700'
                    : 'border-transparent text-slate-700 hover:bg-slate-100 hover:text-blue-700'
                }`}
                onClick={() => {
                  handleNavClick(link.href);
                  setIsOpen(false);
                }}
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
              <div className="mx-3 my-2 rounded-lg bg-slate-900 px-3 py-2">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Notificaciones
                </p>
                <NotificationsBell className="inline-block" />
              </div>
            ) : null}
          </nav>
        </div>
      )}
      <PqrsDialog open={pqrsOpen} onClose={() => setPqrsOpen(false)} />
      {servicesMenuPortal}
    </header>
  );
}

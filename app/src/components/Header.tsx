'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const topLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Nosotros', href: '/#what-defines-us' },
    { label: 'Equipo', href: '/#team' },
    { label: 'Plan de negocios', href: '/#business-plan' },
    { label: 'Testimonios', href: '/#testimonials' },
    { label: 'Blog', href: '/#blog' },
    { label: 'Contacto', href: '/#contact' },
  ];

  const serviceLinks = [
    { label: 'Vigilancia con IA', href: '/#what-we-do' },
    { label: 'Monitoreo en tiempo real', href: '/#what-we-do' },
    { label: 'Analítica avanzada', href: '/#what-we-do' },
    { label: 'Innovación', href: '/#what-we-do' },
    { label: 'Planes y precios', href: '/#pricing' },
    { label: 'Certificaciones', href: '/#certifications' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top utility bar */}
      <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-9">
          <div className="flex gap-4">
            <span>📞 +57 315 222 8982</span>
            <span>✉ contacto@projectvigia.co</span>
          </div>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-white transition">Línea Ética</Link>
            <Link href="#" className="hover:text-white transition">PQRS</Link>
            <Link href="#" className="hover:text-white transition">Portal cliente</Link>
          </div>
        </div>
      </div>

      {/* Main bar with logo + nav */}
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Logo size={48} className="transition-transform group-hover:scale-105" />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-xl font-bold text-slate-900">PROJECT VIGIA</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">
                  Vigilancia inteligente
                </span>
              </div>
            </Link>

            {/* Desktop Top Navigation */}
            <nav className="hidden lg:flex gap-6 items-center">
              {topLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-slate-700 hover:text-blue-700 transition font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex">
              <Link
                href="/plans"
                className="px-5 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow"
              >
                Solicitar asesoría
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-700"
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
          <nav className="flex gap-8 items-center h-12 overflow-x-auto">
            {serviceLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="whitespace-nowrap text-sm text-slate-700 hover:text-blue-700 transition font-medium"
              >
                {link.label}
              </Link>
            ))}
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
            {serviceLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block px-3 py-2 rounded text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/plans"
              onClick={() => setIsOpen(false)}
              className="block mt-3 px-3 py-2 rounded bg-blue-600 text-white font-semibold text-center hover:bg-blue-700 transition"
            >
              Solicitar asesoría
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

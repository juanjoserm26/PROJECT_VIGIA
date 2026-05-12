'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    organizationType: '',
    service: '',
    message: '',
    accepted: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.accepted) return;
    setSubmitted(true);
    setForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      organizationType: '',
      service: '',
      message: '',
      accepted: false,
    });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Info */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
              Reservar una asesoría
            </h2>
            <div className="w-24 h-1 bg-blue-600 mb-6"></div>
            <p className="text-lg text-slate-600 mb-4 leading-relaxed">
              ¿Tienes preguntas o quieres una cotización? Atendemos a{' '}
              <strong className="text-slate-800 font-semibold">
                fuerza pública y municipios, empresas, comercio, conjuntos residenciales,
                instituciones educativas, ONG y otros actores de la comunidad
              </strong>
              . No es un servicio exclusivo de un solo sector: la misma plataforma se adapta al
              perfil de tu organización.
            </p>
            <p className="text-base text-slate-600 mb-8 leading-relaxed border-l-4 border-blue-600 pl-4">
              <strong className="text-slate-800 font-semibold">Importante:</strong> integramos
              software a las <strong className="text-slate-800 font-semibold">cámaras IP que ya tengas</strong>{' '}
              (ONVIF/RTSP). PROJECT VIGIA{' '}
              <strong className="text-slate-800 font-semibold">no vende cámaras ni equipos</strong>{' '}
              de videovigilancia.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-md flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Sede principal</h4>
                  <p className="text-sm text-slate-600">
                    Universidad Industrial de Santander<br />
                    Cra. 27 #9, Bucaramanga
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-md flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Línea Única Nacional</h4>
                  <p className="text-sm text-slate-600">+57 315 050 2630</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-md flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Correo</h4>
                  <p className="text-sm text-slate-600">contacto@projectvigia.co</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-slate-50 border border-slate-200 rounded-lg p-6 sm:p-8 space-y-4"
          >
            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded text-sm">
                Gracias por contactarnos. Le responderemos lo antes posible.
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="tel"
                name="phone"
                placeholder="Número de contacto"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                name="company"
                placeholder="Empresa, conjunto, entidad u organización"
                value={form.company}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              name="organizationType"
              value={form.organizationType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tipo de organización que representa</option>
              <option value="public-security">Fuerza pública / seguridad del Estado</option>
              <option value="municipal">Alcaldía u otra entidad territorial</option>
              <option value="enterprise">Empresa o industria</option>
              <option value="retail">Comercio (tienda, centro comercial, cadena)</option>
              <option value="residential">Conjunto residencial o propiedad horizontal</option>
              <option value="education">Institución educativa</option>
              <option value="ngo">ONG, fundación o asociación comunitaria</option>
              <option value="other">Otro perfil</option>
            </select>

            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">¿Qué te gustaría saber?</option>
              <option value="vigilancia">Vigilancia con IA</option>
              <option value="monitoreo">Monitoreo en tiempo real</option>
              <option value="analitica">Analítica avanzada</option>
              <option value="innovacion">Innovación e integración</option>
              <option value="otro">Otro</option>
            </select>

            <textarea
              name="message"
              placeholder="Cuéntanos cuántas cámaras IP aproximadas quieres integrar y cualquier detalle útil (no vendemos equipos; solo conectamos a las tuyas)."
              value={form.message}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            <label className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
              <input
                type="checkbox"
                name="accepted"
                checked={form.accepted}
                onChange={handleChange}
                required
                className="mt-0.5"
              />
              <span>
                Autorizo de manera previa, expresa e informada a PROJECT VIGIA, el tratamiento
                de mis datos personales de acuerdo a las finalidades previstas en la Política
                de Tratamiento de Información.
              </span>
            </label>

            <button
              type="submit"
              className="w-full px-8 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition shadow"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

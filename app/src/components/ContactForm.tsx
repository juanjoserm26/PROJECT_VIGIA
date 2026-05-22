'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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
    <section
      id="asesoria"
      className="py-16 sm:py-20 bg-gradient-to-b from-slate-100 via-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-2">
              Canal comercial único
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
              Solicitar asesoría
            </h1>
            <div className="w-24 h-1 bg-blue-600 mb-6 rounded-full" />
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Paso previo a contratar: alineamos tu contexto operativo con la plataforma SaaS de PROJECT
              VIGIA. Partimos de tus{' '}
              <strong className="text-slate-800">cámaras IP existentes u operación ONVIF/RTSP</strong> —{' '}
              <strong className="text-slate-800">no vendemos equipos</strong>; integramos análisis con IA sobre
              tu infraestructura o la que estés licitando.
            </p>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-blue-700 mb-3">
                Qué revisamos contigo
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700 list-disc list-inside leading-relaxed">
                <li>Volumen aproximado de flujos y escenarios críticos (robos, concurridos, perímetros).</li>
                <li>Compatibilidad técnica, conectividad y arquitectura razonable hacia la nube.</li>
                <li>Expectativas de analítica, panel y notificaciones.</li>
                <li>Siguientes pasos: propuesta comercial y hoja de ruta de activación.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 mb-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Cómo avanzamos</h3>
              <ol className="space-y-3 text-sm text-slate-700">
                {[
                  'Envías el formulario con datos de tu entidad y el detalle del requerimiento.',
                  'Evaluamos alcance técnico y perfil de cliente (público, privado, residencial, educación, etc.).',
                  'Te contactamos con orientación y, si aplica, cotización alineada a un plan de suscripción.',
                ].map((text, i) => (
                  <li key={text} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-base text-slate-600 mb-8 leading-relaxed border-l-4 border-blue-600 pl-4">
              <strong className="text-slate-800 font-semibold">Importante:</strong> somos{' '}
              <strong className="text-slate-800 font-semibold">software en la nube</strong>; no comercializamos
              videovigilancia. Nos conectamos a lo que ya cumpla ONVIF/RTSP o lo que acuerdes instalar.
            </p>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Teléfono:</span> +57 315 050 2630
              </p>
              <p>
                <span className="font-semibold text-slate-900">Correo:</span> contacto@projectvigia.co
              </p>
              <p>
                <span className="font-semibold text-slate-900">Sede:</span> Cra. 21 #101-25, Barrio Fontana,
                Bucaramanga
              </p>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                ¿Solo datos de contacto?{' '}
                <Link href="/#contact" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                  Ver sección Contacto en el inicio
                </Link>
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="lg:sticky lg:top-28 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg shadow-slate-200/60 ring-1 ring-slate-900/5"
          >
            <div className="border-b border-slate-100 pb-4 mb-2">
              <h2 className="text-lg font-bold text-slate-900">Formulario de asesoría</h2>
              <p className="text-xs text-slate-500 mt-1">
                Todos los campos marcados con el formulario son necesarios para orientarte.
              </p>
            </div>

            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-lg text-sm">
                Gracias. Recibimos tu solicitud; te contactaremos para alinear alcance técnico y el siguiente
                paso.
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="tel"
                name="phone"
                placeholder="Número de contacto"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                name="company"
                placeholder="Empresa, conjunto, entidad u organización"
                value={form.company}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              name="organizationType"
              value={form.organizationType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                Autorizo de manera previa, expresa e informada a PROJECT VIGIA, el tratamiento de mis datos
                personales de acuerdo a las finalidades previstas en la Política de Tratamiento de Información.
              </span>
            </label>

            <button
              type="submit"
              className="w-full px-8 py-3.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-600/20"
            >
              Enviar solicitud de asesoría
            </button>
          </form>
        </div>

        <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h3 className="text-lg font-bold text-slate-900">¿Ya tienes claro el volumen de flujos?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Compara planes <strong className="text-slate-800">Básico</strong>,{' '}
                <strong className="text-slate-800">Avanzado</strong> y{' '}
                <strong className="text-slate-800">Enterprise</strong>: número de cámaras IP integradas con IA,
                mismo modelo SaaS sobre tu infraestructura ONVIF/RTSP.
              </p>
            </div>
            <Link
              href="/plans"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Ver planes y precios
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

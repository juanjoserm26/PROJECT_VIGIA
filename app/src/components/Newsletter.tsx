'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !accepted) return;
    setSubmitted(true);
    setEmail('');
    setName('');
    setAccepted(false);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="py-16 bg-blue-700 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Suscríbete a nuestro boletín de Seguridad
            </h2>
            <p className="text-blue-100 leading-relaxed">
              Recibe contenido exclusivo sobre vigilancia inteligente, mejores prácticas de
              seguridad y novedades de PROJECT VIGIA directamente en tu correo.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Nombre y apellidos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md text-slate-900 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md text-slate-900 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <label className="flex items-start gap-2 text-xs text-blue-100 leading-relaxed">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
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
              className="w-full sm:w-auto px-8 py-3 bg-white text-blue-700 rounded-md font-semibold hover:bg-blue-50 transition shadow"
            >
              {submitted ? '¡Bienvenido! Ya estás suscrito' : 'Suscribirme'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

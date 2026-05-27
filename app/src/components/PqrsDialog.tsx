'use client';

import { useEffect, useState } from 'react';
import { PQRS_UPDATED_EVENT, type PqrsType } from '@/lib/pqrs-types';

interface PqrsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function PqrsDialog({ open, onClose }: PqrsDialogProps) {
  const [tipo, setTipo] = useState<PqrsType>('peticion');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setStatus('idle');
      setErrorMessage(null);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !mensaje.trim()) return;

    setStatus('sending');
    setErrorMessage(null);
    try {
      const res = await fetch('/api/pqrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          nombre: nombre.trim(),
          email: email.trim(),
          telefono: telefono.trim() || undefined,
          mensaje: mensaje.trim(),
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        success?: boolean;
        error?: string;
      };

      if (res.ok && (data.ok === true || data.success === true)) {
        setStatus('sent');
        setNombre('');
        setEmail('');
        setTelefono('');
        setMensaje('');
        setTipo('peticion');
        window.dispatchEvent(new CustomEvent(PQRS_UPDATED_EVENT));
        return;
      }

      setErrorMessage(
        typeof data.error === 'string' && data.error
          ? data.error
          : 'No pudimos enviar el formulario. Intenta de nuevo.',
      );
      setStatus('error');
    } catch {
      setErrorMessage('Error de conexión. Comprueba tu internet e intenta de nuevo.');
      setStatus('error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pqrs-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm pqrs-backdrop-enter"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl pqrs-panel-enter">
        <div className="rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-[0_0_60px_-12px_rgba(59,130,246,0.45)]">
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_20%,#fff_0%,transparent_50%),radial-gradient(circle_at_80%_60%,#3b82f6_0%,transparent_45%)] pointer-events-none" />

          <div className="relative px-6 pt-8 pb-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300/90 mb-1">
                  Atención al ciudadano
                </p>
                <h2 id="pqrs-title" className="text-2xl sm:text-3xl font-bold tracking-tight">
                  PQRS
                </h2>
                <p className="text-sm text-slate-300 mt-1 max-w-sm">
                  Peticiones, quejas, reclamos y sugerencias. Tu mensaje llega a nuestro equipo de
                  cumplimiento.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition"
                aria-label="Cerrar ventana"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative px-6 pb-8 pt-2">
            {status === 'sent' ? (
              <div className="rounded-xl bg-white/10 border border-emerald-400/30 p-6 text-center backdrop-blur-sm">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-2xl text-emerald-300">
                  ✓
                </div>
                <p className="text-lg font-semibold text-emerald-100">¡PQRS enviada con éxito!</p>
                <p className="text-sm text-slate-300 mt-2">
                  Tu solicitud quedó registrada. Si tienes sesión iniciada, verás la notificación en la campana.
                  Te responderemos al correo indicado lo antes posible.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 w-full rounded-lg bg-blue-500 py-3 font-semibold text-white hover:bg-blue-400 transition"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Tipo</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as PqrsType)}
                    className="w-full rounded-lg border border-white/20 bg-slate-900/80 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="peticion">Petición</option>
                    <option value="queja">Queja</option>
                    <option value="reclamo">Reclamo</option>
                    <option value="sugerencia">Sugerencia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Nombre completo</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-slate-900/80 px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Correo electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-slate-900/80 px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="correo@empresa.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Teléfono <span className="text-slate-500 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-slate-900/80 px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+57 ..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Mensaje</label>
                  <textarea
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-white/20 bg-slate-900/80 px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[100px]"
                    placeholder="Describe tu petición, queja, reclamo o sugerencia con el mayor detalle posible."
                    required
                  />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-rose-300" role="alert">
                    {errorMessage ??
                      'No pudimos enviar el formulario. Intenta de nuevo o escríbenos a contacto@projectvigia.co'}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 py-3 font-semibold text-white shadow-lg shadow-blue-900/40 hover:from-blue-500 hover:to-blue-400 disabled:opacity-60 transition"
                >
                  {status === 'sending' ? 'Enviando…' : 'Enviar PQRS'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

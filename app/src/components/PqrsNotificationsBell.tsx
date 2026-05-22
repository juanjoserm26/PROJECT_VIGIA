'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  PQRS_CLASSIFICATION,
  PQRS_TYPE_LABELS,
  PQRS_UPDATED_EVENT,
  type PqrsSubmission,
  type PqrsType,
} from '@/lib/pqrs-types';

const TYPE_STYLES: Record<PqrsType, string> = {
  peticion: 'bg-blue-500/25 text-blue-200 border-blue-400/30',
  queja: 'bg-amber-500/25 text-amber-100 border-amber-400/30',
  reclamo: 'bg-rose-500/25 text-rose-100 border-rose-400/30',
  sugerencia: 'bg-emerald-500/25 text-emerald-100 border-emerald-400/30',
};

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-6-6 6 6 0 00-6 6v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

type PqrsNotificationsBellProps = {
  className?: string;
};

export default function PqrsNotificationsBell({ className = '' }: PqrsNotificationsBellProps) {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PqrsSubmission[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/pqrs', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as {
        ok: boolean;
        items?: PqrsSubmission[];
        unreadCount?: number;
      };
      if (data.ok && data.items) {
        setItems(data.items);
        setUnreadCount(data.unreadCount ?? 0);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void refresh();
    const onUpdate = () => void refresh();
    window.addEventListener(PQRS_UPDATED_EVENT, onUpdate);
    const interval = window.setInterval(() => void refresh(), 45000);
    return () => {
      window.removeEventListener(PQRS_UPDATED_EVENT, onUpdate);
      window.clearInterval(interval);
    };
  }, [refresh]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (!next) return;
    setLoading(true);
    await refresh();
    try {
      await fetch('/api/pqrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markRead: true }),
      });
      setUnreadCount(0);
      setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }

  const badge = unreadCount > 99 ? '99+' : String(unreadCount);

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        onClick={() => void handleOpen()}
        className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-300 transition hover:bg-white/10 hover:text-white"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={
          unreadCount > 0
            ? `Notificaciones PQRS, ${unreadCount} sin leer`
            : 'Notificaciones PQRS'
        }
      >
        <BellIcon className="h-[18px] w-[18px]" />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-slate-900">
            {badge}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Bandeja de PQRS"
          className="absolute right-0 top-full z-[60] mt-2 w-[min(100vw-2rem,22rem)] sm:w-96 origin-top-right"
        >
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-2xl shadow-blue-900/40">
            <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_20%,#fff_0%,transparent_50%),radial-gradient(circle_at_80%_60%,#3b82f6_0%,transparent_45%)] pointer-events-none" />
            <div className="relative border-b border-white/10 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300/90">
                Notificaciones
              </p>
              <h3 className="text-lg font-bold tracking-tight">PQRS recibidas</h3>
              <p className="mt-0.5 text-xs text-slate-400">{PQRS_CLASSIFICATION}</p>
            </div>

            <div className="relative max-h-[min(70vh,420px)] overflow-y-auto">
              {loading && items.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-400">Cargando…</p>
              ) : items.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-slate-400">
                  No hay peticiones registradas aún.
                </p>
              ) : (
                <ul className="divide-y divide-white/10">
                  {items.map((item) => {
                    const expanded = expandedId === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setExpandedId(expanded ? null : item.id)}
                          className={`w-full px-4 py-3 text-left transition hover:bg-white/5 ${
                            !item.read ? 'bg-blue-500/10' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TYPE_STYLES[item.tipo]}`}
                            >
                              {PQRS_TYPE_LABELS[item.tipo]}
                            </span>
                            <time className="shrink-0 text-[10px] text-slate-500">
                              {formatWhen(item.receivedAt)}
                            </time>
                          </div>
                          <p className="mt-2 text-sm font-semibold text-white">{item.nombre}</p>
                          <p className="text-xs text-slate-400 truncate">{item.email}</p>
                          <p
                            className={`mt-2 text-xs leading-relaxed text-slate-300 ${
                              expanded ? '' : 'line-clamp-2'
                            }`}
                          >
                            {item.mensaje}
                          </p>
                          {item.telefono ? (
                            <p className="mt-1 text-[11px] text-slate-500">Tel: {item.telefono}</p>
                          ) : null}
                          <span className="mt-2 inline-block text-[11px] font-medium text-blue-300">
                            {expanded ? 'Ver menos' : 'Ver mensaje completo'}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="relative border-t border-white/10 px-4 py-2.5">
              <p className="text-center text-[10px] text-slate-500">
                Las nuevas PQRS aparecen aquí al enviar el formulario.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

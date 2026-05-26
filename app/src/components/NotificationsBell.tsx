'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  CAMERA_ALERTS_UPDATED_EVENT,
  getCameraAlertsForEmail,
  getUnreadCameraAlertCount,
  markCameraAlertsRead,
  runPendingAlertEffects,
  type CameraAlert,
} from '@/lib/camera-alerts';
import { getDemoSession } from '@/lib/demo-session';
import {
  PQRS_CLASSIFICATION,
  PQRS_TYPE_LABELS,
  PQRS_UPDATED_EVENT,
  type PqrsSubmission,
  type PqrsType,
} from '@/lib/pqrs-types';
import { USER_PLAN_CHANGED_EVENT } from '@/lib/user-plan';

const PQRS_TYPE_STYLES: Record<PqrsType, string> = {
  peticion: 'bg-blue-500/25 text-blue-200 border-blue-400/30',
  queja: 'bg-amber-500/25 text-amber-100 border-amber-400/30',
  reclamo: 'bg-rose-500/25 text-rose-100 border-rose-400/30',
  sugerencia: 'bg-emerald-500/25 text-emerald-100 border-emerald-400/30',
};

const SECTION_PREVIEW = 4;

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

type NotificationsBellProps = {
  className?: string;
};

export default function NotificationsBell({ className = '' }: NotificationsBellProps) {
  const router = useRouter();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const [cameraItems, setCameraItems] = useState<CameraAlert[]>([]);
  const [cameraUnread, setCameraUnread] = useState(0);

  const [pqrsItems, setPqrsItems] = useState<PqrsSubmission[]>([]);
  const [pqrsUnread, setPqrsUnread] = useState(0);

  const [expandedPqrsId, setExpandedPqrsId] = useState<string | null>(null);
  const [expandedCameraId, setExpandedCameraId] = useState<string | null>(null);
  const [showAllMonitoreo, setShowAllMonitoreo] = useState(false);
  const [showAllPqrs, setShowAllPqrs] = useState(false);

  const totalUnread = cameraUnread + pqrsUnread;

  const refreshCamera = useCallback(() => {
    const session = getDemoSession();
    if (!session) {
      setCameraItems([]);
      setCameraUnread(0);
      return;
    }
    const email = session.email;
    setCameraItems(getCameraAlertsForEmail(email));
    setCameraUnread(getUnreadCameraAlertCount(email));

    if (runPendingAlertEffects(email)) {
      setShake(true);
      window.setTimeout(() => setShake(false), 700);
    }
  }, []);

  const refreshPqrs = useCallback(async () => {
    try {
      const res = await fetch('/api/pqrs', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as {
        ok: boolean;
        items?: PqrsSubmission[];
        unreadCount?: number;
      };
      if (data.ok && data.items) {
        setPqrsItems(data.items);
        setPqrsUnread(data.unreadCount ?? 0);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const refreshAll = useCallback(async () => {
    refreshCamera();
    await refreshPqrs();
  }, [refreshCamera, refreshPqrs]);

  useEffect(() => {
    void refreshAll();
    const onCamera = () => refreshCamera();
    const onPqrs = () => void refreshPqrs();
    window.addEventListener(CAMERA_ALERTS_UPDATED_EVENT, onCamera);
    window.addEventListener(USER_PLAN_CHANGED_EVENT, onCamera);
    window.addEventListener(PQRS_UPDATED_EVENT, onPqrs);
    const interval = window.setInterval(() => void refreshPqrs(), 45000);
    return () => {
      window.removeEventListener(CAMERA_ALERTS_UPDATED_EVENT, onCamera);
      window.removeEventListener(USER_PLAN_CHANGED_EVENT, onCamera);
      window.removeEventListener(PQRS_UPDATED_EVENT, onPqrs);
      window.clearInterval(interval);
    };
  }, [refreshAll, refreshCamera, refreshPqrs]);

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
    await refreshAll();

    const session = getDemoSession();
    if (session) {
      markCameraAlertsRead(session.email);
      setCameraUnread(0);
      setCameraItems((prev) => prev.map((i) => ({ ...i, read: true, effectsPending: false })));
    }

    try {
      await fetch('/api/pqrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markRead: true }),
      });
      setPqrsUnread(0);
      setPqrsItems((prev) => prev.map((i) => ({ ...i, read: true })));
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }

  function goToMonitoreo() {
    setOpen(false);
    router.push('/monitoreo');
  }

  const visibleCamera = showAllMonitoreo
    ? cameraItems
    : cameraItems.slice(0, SECTION_PREVIEW);
  const visiblePqrs = showAllPqrs ? pqrsItems : pqrsItems.slice(0, SECTION_PREVIEW);

  const hasAny = cameraItems.length > 0 || pqrsItems.length > 0;
  const badge = totalUnread > 99 ? '99+' : String(totalUnread);

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        onClick={() => void handleOpen()}
        className={`relative inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-300 transition hover:bg-white/10 hover:text-white ${
          shake ? 'vigia-bell-shake-once' : ''
        }`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={
          totalUnread > 0
            ? `Notificaciones, ${totalUnread} sin leer`
            : 'Notificaciones'
        }
      >
        <BellIcon className="h-[18px] w-[18px]" />
        {totalUnread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-slate-900">
            {badge}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Notificaciones"
          className="absolute right-0 top-full z-[60] mt-2 w-[min(100vw-2rem,22rem)] origin-top-right sm:w-96"
        >
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-2xl shadow-blue-900/40">
            <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[radial-gradient(circle_at_30%_20%,#fff_0%,transparent_50%),radial-gradient(circle_at_80%_60%,#3b82f6_0%,transparent_45%)]" />

            <div className="relative border-b border-white/10 px-4 py-3">
              <h3 className="text-lg font-bold tracking-tight">Notificaciones</h3>
              <p className="mt-0.5 text-xs text-slate-400">
                Monitoreo, PQRS y actividad de tu cuenta
              </p>
            </div>

            <div className="relative max-h-[min(70vh,480px)] overflow-y-auto">
              {loading && !hasAny ? (
                <p className="px-4 py-8 text-center text-sm text-slate-400">Cargando…</p>
              ) : !hasAny ? (
                <p className="px-4 py-10 text-center text-sm text-slate-400">
                  No tienes notificaciones nuevas.
                </p>
              ) : (
                <>
                  {/* —— Monitoreo —— */}
                  <section className="border-b border-white/10">
                    <div className="sticky top-0 z-10 bg-slate-900/95 px-4 py-2 backdrop-blur-sm">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300/90">
                        Monitoreo
                      </p>
                      <p className="text-xs font-semibold text-slate-300">Alertas de Mis cámaras</p>
                    </div>
                    {cameraItems.length === 0 ? (
                      <p className="px-4 py-4 text-xs text-slate-500">Sin alertas de cámaras.</p>
                    ) : (
                      <>
                        <ul className="divide-y divide-white/5">
                          {visibleCamera.map((item) => {
                            const expanded = expandedCameraId === item.id;
                            return (
                              <li key={item.id}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (expanded) {
                                      setExpandedCameraId(null);
                                    } else {
                                      setExpandedCameraId(item.id);
                                    }
                                  }}
                                  className={`w-full px-4 py-3 text-left transition hover:bg-white/5 ${
                                    !item.read ? 'bg-blue-500/10' : ''
                                  }`}
                                >
                                  <p className="text-sm font-semibold text-white">{item.message}</p>
                                  <time className="mt-1 block text-[10px] text-slate-500">
                                    {formatWhen(item.createdAt)}
                                  </time>
                                  {expanded ? (
                                    <span
                                      role="link"
                                      tabIndex={0}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        goToMonitoreo();
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.stopPropagation();
                                          goToMonitoreo();
                                        }
                                      }}
                                      className="mt-2 inline-block text-[11px] font-medium text-blue-300 hover:text-white"
                                    >
                                      Ver Mis cámaras →
                                    </span>
                                  ) : (
                                    <span className="mt-2 inline-block text-[11px] text-slate-500">
                                      Toca para ver más
                                    </span>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                        {cameraItems.length > SECTION_PREVIEW ? (
                          <button
                            type="button"
                            onClick={() => setShowAllMonitoreo((v) => !v)}
                            className="w-full border-t border-white/5 px-4 py-2 text-center text-[11px] font-semibold text-blue-300 hover:bg-white/5"
                          >
                            {showAllMonitoreo
                              ? 'Ver menos'
                              : `Ver todas (${cameraItems.length})`}
                          </button>
                        ) : null}
                      </>
                    )}
                  </section>

                  {/* —— PQRS —— */}
                  <section>
                    <div className="sticky top-0 z-10 bg-slate-900/95 px-4 py-2 backdrop-blur-sm">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300/90">
                        PQRS
                      </p>
                      <p className="text-xs font-semibold text-slate-300">Peticiones y solicitudes</p>
                      <p className="mt-0.5 text-[10px] text-slate-500">{PQRS_CLASSIFICATION}</p>
                    </div>
                    {pqrsItems.length === 0 ? (
                      <p className="px-4 py-4 text-xs text-slate-500">Sin PQRS registradas.</p>
                    ) : (
                      <>
                        <ul className="divide-y divide-white/5">
                          {visiblePqrs.map((item) => {
                            const expanded = expandedPqrsId === item.id;
                            return (
                              <li key={item.id}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedPqrsId(expanded ? null : item.id)
                                  }
                                  className={`w-full px-4 py-3 text-left transition hover:bg-white/5 ${
                                    !item.read ? 'bg-blue-500/10' : ''
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <span
                                      className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${PQRS_TYPE_STYLES[item.tipo]}`}
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
                                  {expanded && item.telefono ? (
                                    <p className="mt-1 text-[11px] text-slate-500">
                                      Tel: {item.telefono}
                                    </p>
                                  ) : null}
                                  <span className="mt-2 inline-block text-[11px] font-medium text-blue-300">
                                    {expanded ? 'Ver menos' : 'Ver mensaje completo'}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                        {pqrsItems.length > SECTION_PREVIEW ? (
                          <button
                            type="button"
                            onClick={() => setShowAllPqrs((v) => !v)}
                            className="w-full border-t border-white/5 px-4 py-2 text-center text-[11px] font-semibold text-blue-300 hover:bg-white/5"
                          >
                            {showAllPqrs ? 'Ver menos' : `Ver todas (${pqrsItems.length})`}
                          </button>
                        ) : null}
                      </>
                    )}
                  </section>
                </>
              )}
            </div>

            {cameraItems.length > 0 ? (
              <div className="relative border-t border-white/10 px-4 py-2.5 text-center">
                <Link
                  href="/monitoreo"
                  onClick={() => setOpen(false)}
                  className="text-[11px] font-semibold text-blue-300 hover:text-white"
                >
                  Ir a Mis cámaras
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

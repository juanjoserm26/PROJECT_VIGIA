'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  CAMERA_ALERTS_UPDATED_EVENT,
  clearCameraAlerts,
  deleteCameraAlert,
  getCameraAlertsForEmail,
  getUnreadCameraAlertCount,
  markCameraAlertsRead,
  runPendingAlertEffects,
  type CameraAlert,
} from '@/lib/camera-alerts';
import { getDemoSession } from '@/lib/demo-session';
import {
  clearPlanNotifications,
  deletePlanNotification,
  getPlanNotificationsForEmail,
  getUnreadPlanNotificationCount,
  markPlanNotificationsRead,
  PLAN_NOTIFICATIONS_UPDATED_EVENT,
  type PlanNotification,
} from '@/lib/plan-notifications';
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
type DeleteSection = 'monitoreo' | 'planes' | 'pqrs' | null;

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
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-6-6 6 6 0 00-6 6v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
  const [deleteMode, setDeleteMode] = useState<DeleteSection>(null);

  const [cameraItems, setCameraItems] = useState<CameraAlert[]>([]);
  const [cameraUnread, setCameraUnread] = useState(0);
  const [planItems, setPlanItems] = useState<PlanNotification[]>([]);
  const [planUnread, setPlanUnread] = useState(0);
  const [pqrsItems, setPqrsItems] = useState<PqrsSubmission[]>([]);
  const [pqrsUnread, setPqrsUnread] = useState(0);

  const [expandedPqrsId, setExpandedPqrsId] = useState<string | null>(null);
  const [expandedCameraId, setExpandedCameraId] = useState<string | null>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [showAllMonitoreo, setShowAllMonitoreo] = useState(false);
  const [showAllPlanes, setShowAllPlanes] = useState(false);
  const [showAllPqrs, setShowAllPqrs] = useState(false);

  const totalUnread = cameraUnread + planUnread + pqrsUnread;

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

  const refreshPlans = useCallback(() => {
    const session = getDemoSession();
    if (!session) {
      setPlanItems([]);
      setPlanUnread(0);
      return;
    }
    setPlanItems(getPlanNotificationsForEmail(session.email));
    setPlanUnread(getUnreadPlanNotificationCount(session.email));
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
    refreshPlans();
    await refreshPqrs();
  }, [refreshCamera, refreshPlans, refreshPqrs]);

  useEffect(() => {
    void refreshAll();
    const onCamera = () => refreshCamera();
    const onPlans = () => refreshPlans();
    const onPlanChanged = () => {
      refreshCamera();
      refreshPlans();
    };
    const onPqrs = () => {
      void refreshPqrs();
      window.setTimeout(() => void refreshPqrs(), 800);
    };
    window.addEventListener(CAMERA_ALERTS_UPDATED_EVENT, onCamera);
    window.addEventListener(USER_PLAN_CHANGED_EVENT, onPlanChanged);
    window.addEventListener(PLAN_NOTIFICATIONS_UPDATED_EVENT, onPlans);
    window.addEventListener(PQRS_UPDATED_EVENT, onPqrs);
    const interval = window.setInterval(() => void refreshPqrs(), 4000);
    return () => {
      window.removeEventListener(CAMERA_ALERTS_UPDATED_EVENT, onCamera);
      window.removeEventListener(USER_PLAN_CHANGED_EVENT, onPlanChanged);
      window.removeEventListener(PLAN_NOTIFICATIONS_UPDATED_EVENT, onPlans);
      window.removeEventListener(PQRS_UPDATED_EVENT, onPqrs);
      window.clearInterval(interval);
    };
  }, [refreshAll, refreshCamera, refreshPlans, refreshPqrs]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setDeleteMode(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        setDeleteMode(null);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function toggleDeleteMode(section: DeleteSection) {
    setDeleteMode((prev) => (prev === section ? null : section));
  }

  async function handleDeleteAll() {
    const session = getDemoSession();
    if (!session) return;
    const email = session.email;
    clearCameraAlerts(email);
    clearPlanNotifications(email);
    try {
      await fetch('/api/pqrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteAll: true }),
      });
    } catch {
      /* ignore */
    }
    setDeleteMode(null);
    setExpandedCameraId(null);
    setExpandedPlanId(null);
    setExpandedPqrsId(null);
    await refreshAll();
    window.dispatchEvent(new CustomEvent(PQRS_UPDATED_EVENT));
  }

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (!next) {
      setDeleteMode(null);
      return;
    }

    setLoading(true);
    await refreshAll();

    const session = getDemoSession();
    if (session) {
      markCameraAlertsRead(session.email);
      markPlanNotificationsRead(session.email);
      setCameraUnread(0);
      setPlanUnread(0);
      setCameraItems((prev) => prev.map((i) => ({ ...i, read: true, effectsPending: false })));
      setPlanItems((prev) => prev.map((i) => ({ ...i, read: true })));
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
    setDeleteMode(null);
    router.push('/monitoreo');
  }

  function deleteCameraItem(id: string) {
    const session = getDemoSession();
    if (!session) return;
    deleteCameraAlert(session.email, id);
    refreshCamera();
  }

  function deletePlanItem(id: string) {
    const session = getDemoSession();
    if (!session) return;
    deletePlanNotification(session.email, id);
    refreshPlans();
  }

  async function deletePqrsItem(id: string) {
    try {
      const res = await fetch('/api/pqrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteIds: [id] }),
      });
      if (res.ok) {
        const data = (await res.json()) as { items?: PqrsSubmission[]; unreadCount?: number };
        if (data.items) setPqrsItems(data.items);
        setPqrsUnread(data.unreadCount ?? 0);
      }
    } catch {
      /* ignore */
    }
  }

  const visibleCamera = showAllMonitoreo ? cameraItems : cameraItems.slice(0, SECTION_PREVIEW);
  const visiblePlans = showAllPlanes ? planItems : planItems.slice(0, SECTION_PREVIEW);
  const visiblePqrs = showAllPqrs ? pqrsItems : pqrsItems.slice(0, SECTION_PREVIEW);
  const hasAny = cameraItems.length > 0 || planItems.length > 0 || pqrsItems.length > 0;
  const badge = totalUnread > 99 ? '99+' : String(totalUnread);

  function SectionDeleteToggle({
    section,
    label,
  }: {
    section: Exclude<DeleteSection, null>;
    label: string;
  }) {
    const active = deleteMode === section;
    return (
      <button
        type="button"
        onClick={() => toggleDeleteMode(section)}
        className={`rounded-md p-1.5 transition ${
          active
            ? 'bg-rose-500/25 text-rose-200 ring-1 ring-rose-400/40'
            : 'text-slate-400 hover:bg-white/10 hover:text-white'
        }`}
        aria-label={active ? `Salir de borrar ${label}` : `Borrar notificaciones de ${label}`}
        title={active ? 'Listo' : 'Borrar una a una'}
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    );
  }

  function ItemDeleteButton({ onDelete }: { onDelete: () => void }) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-rose-600/90 text-white shadow-lg opacity-0 transition group-hover:opacity-100 hover:bg-rose-500"
        aria-label="Eliminar notificación"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
    );
  }

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
        aria-label={totalUnread > 0 ? `Notificaciones, ${totalUnread} sin leer` : 'Notificaciones'}
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

            <div className="relative flex items-start justify-between gap-2 border-b border-white/10 px-4 py-3">
              <div>
                <h3 className="text-lg font-bold tracking-tight">Notificaciones</h3>
                <p className="mt-0.5 text-xs text-slate-400">Planes, monitoreo y PQRS</p>
              </div>
              {hasAny ? (
                <button
                  type="button"
                  onClick={() => void handleDeleteAll()}
                  className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-200"
                  aria-label="Borrar todas las notificaciones"
                  title="Borrar todas"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            {deleteMode ? (
              <p className="relative border-b border-rose-500/20 bg-rose-500/10 px-4 py-2 text-center text-[11px] font-medium text-rose-200">
                Modo eliminar — pasa el cursor sobre una notificación y pulsa ✕
              </p>
            ) : null}

            <div className="relative max-h-[min(70vh,480px)] overflow-y-auto">
              {loading && !hasAny ? (
                <p className="px-4 py-8 text-center text-sm text-slate-400">Cargando…</p>
              ) : !hasAny ? (
                <p className="px-4 py-10 text-center text-sm text-slate-400">No tienes notificaciones nuevas.</p>
              ) : (
                <>
                  {/* Planes */}
                  <section className="border-b border-white/10">
                    <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-slate-900/95 px-4 py-2 backdrop-blur-sm">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300/90">Planes</p>
                        <p className="text-xs font-semibold text-slate-300">Compras y suscripciones</p>
                      </div>
                      {planItems.length > 0 ? <SectionDeleteToggle section="planes" label="planes" /> : null}
                    </div>
                    {planItems.length === 0 ? (
                      <p className="px-4 py-4 text-xs text-slate-500">Sin notificaciones de planes.</p>
                    ) : (
                      <>
                        <ul className="divide-y divide-white/5">
                          {visiblePlans.map((item) => {
                            const expanded = expandedPlanId === item.id;
                            return (
                              <li key={item.id} className="group relative">
                                {deleteMode === 'planes' ? (
                                  <ItemDeleteButton onDelete={() => deletePlanItem(item.id)} />
                                ) : null}
                                <button
                                  type="button"
                                  onClick={() => setExpandedPlanId(expanded ? null : item.id)}
                                  className={`w-full px-4 py-3 text-left transition hover:bg-white/5 ${
                                    !item.read ? 'bg-violet-500/10' : ''
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2 pr-6">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      {!item.read ? (
                                        <span className="rounded bg-violet-500/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-200">
                                          Nueva
                                        </span>
                                      ) : null}
                                      <span
                                        className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${
                                          item.kind === 'purchase'
                                            ? 'border-emerald-400/30 bg-emerald-500/20 text-emerald-200'
                                            : 'border-amber-400/30 bg-amber-500/20 text-amber-200'
                                        }`}
                                      >
                                        {item.kind === 'purchase' ? 'Compra' : 'Plan activo'}
                                      </span>
                                    </div>
                                    <time className="shrink-0 text-[10px] text-slate-500">
                                      {formatWhen(item.createdAt)}
                                    </time>
                                  </div>
                                  <p className="mt-2 text-sm font-semibold text-white">{item.message}</p>
                                  {expanded ? (
                                    <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3 text-xs">
                                      <p className="font-semibold text-slate-200">{item.planName}</p>
                                      <p className="mt-1 text-slate-400">
                                        {item.price}{' '}
                                        <span className="text-slate-500">{item.priceNote}</span>
                                      </p>
                                      {item.kind === 'already_owned' ? (
                                        <p className="mt-2 text-amber-200/90">
                                          Ya tienes este plan. Si necesitas más capacidad, elige otro plan en la
                                          página de planes.
                                        </p>
                                      ) : null}
                                      <ul className="mt-2 list-disc space-y-0.5 pl-4 text-slate-400">
                                        {item.summary.map((line) => (
                                          <li key={line}>{line}</li>
                                        ))}
                                      </ul>
                                      <Link
                                        href="/plans"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpen(false);
                                        }}
                                        className="mt-3 inline-block font-medium text-blue-300 hover:text-white"
                                      >
                                        Ver planes →
                                      </Link>
                                    </div>
                                  ) : (
                                    <span className="mt-2 inline-block text-[11px] text-slate-500">
                                      Toca para ver resumen de compra
                                    </span>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                        {planItems.length > SECTION_PREVIEW ? (
                          <button
                            type="button"
                            onClick={() => setShowAllPlanes((v) => !v)}
                            className="w-full border-t border-white/5 px-4 py-2 text-center text-[11px] font-semibold text-blue-300 hover:bg-white/5"
                          >
                            {showAllPlanes ? 'Ver menos' : `Ver todas (${planItems.length})`}
                          </button>
                        ) : null}
                      </>
                    )}
                  </section>

                  {/* Monitoreo */}
                  <section className="border-b border-white/10">
                    <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-slate-900/95 px-4 py-2 backdrop-blur-sm">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300/90">Monitoreo</p>
                        <p className="text-xs font-semibold text-slate-300">Alertas de Mis cámaras</p>
                      </div>
                      {cameraItems.length > 0 ? (
                        <SectionDeleteToggle section="monitoreo" label="monitoreo" />
                      ) : null}
                    </div>
                    {cameraItems.length === 0 ? (
                      <p className="px-4 py-4 text-xs text-slate-500">Sin alertas de cámaras.</p>
                    ) : (
                      <>
                        <ul className="divide-y divide-white/5">
                          {visibleCamera.map((item) => {
                            const expanded = expandedCameraId === item.id;
                            return (
                              <li key={item.id} className="group relative">
                                {deleteMode === 'monitoreo' ? (
                                  <ItemDeleteButton onDelete={() => deleteCameraItem(item.id)} />
                                ) : null}
                                <button
                                  type="button"
                                  onClick={() => setExpandedCameraId(expanded ? null : item.id)}
                                  className={`w-full px-4 py-3 text-left transition hover:bg-white/5 ${
                                    !item.read ? 'bg-blue-500/10' : ''
                                  }`}
                                >
                                  <p className="pr-6 text-sm font-semibold text-white">{item.message}</p>
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
                            {showAllMonitoreo ? 'Ver menos' : `Ver todas (${cameraItems.length})`}
                          </button>
                        ) : null}
                      </>
                    )}
                  </section>

                  {/* PQRS */}
                  <section>
                    <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-slate-900/95 px-4 py-2 backdrop-blur-sm">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300/90">PQRS</p>
                        <p className="text-xs font-semibold text-slate-300">Peticiones y solicitudes</p>
                        <p className="mt-0.5 text-[10px] text-slate-500">{PQRS_CLASSIFICATION}</p>
                      </div>
                      {pqrsItems.length > 0 ? <SectionDeleteToggle section="pqrs" label="PQRS" /> : null}
                    </div>
                    {pqrsItems.length === 0 ? (
                      <p className="px-4 py-4 text-xs text-slate-500">Sin PQRS registradas.</p>
                    ) : (
                      <>
                        <ul className="divide-y divide-white/5">
                          {visiblePqrs.map((item) => {
                            const expanded = expandedPqrsId === item.id;
                            return (
                              <li key={item.id} className="group relative">
                                {deleteMode === 'pqrs' ? (
                                  <ItemDeleteButton onDelete={() => void deletePqrsItem(item.id)} />
                                ) : null}
                                <button
                                  type="button"
                                  onClick={() => setExpandedPqrsId(expanded ? null : item.id)}
                                  className={`w-full px-4 py-3 text-left transition hover:bg-white/5 ${
                                    !item.read ? 'bg-blue-500/10' : ''
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2 pr-6">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      {!item.read ? (
                                        <span className="rounded bg-blue-500/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-200">
                                          Nueva
                                        </span>
                                      ) : null}
                                      <span
                                        className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${PQRS_TYPE_STYLES[item.tipo]}`}
                                      >
                                        {PQRS_TYPE_LABELS[item.tipo]}
                                      </span>
                                    </div>
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
                  onClick={() => {
                    setOpen(false);
                    setDeleteMode(null);
                  }}
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

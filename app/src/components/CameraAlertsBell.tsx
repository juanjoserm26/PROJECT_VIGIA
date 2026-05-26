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
import { USER_PLAN_CHANGED_EVENT } from '@/lib/user-plan';

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

type CameraAlertsBellProps = {
  className?: string;
};

export default function CameraAlertsBell({ className = '' }: CameraAlertsBellProps) {
  const router = useRouter();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CameraAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [shake, setShake] = useState(false);

  const refresh = useCallback(() => {
    const session = getDemoSession();
    if (!session) {
      setItems([]);
      setUnreadCount(0);
      return;
    }
    const email = session.email;
    setItems(getCameraAlertsForEmail(email));
    setUnreadCount(getUnreadCameraAlertCount(email));

    if (runPendingAlertEffects(email)) {
      setShake(true);
      window.setTimeout(() => setShake(false), 700);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener(CAMERA_ALERTS_UPDATED_EVENT, onUpdate);
    window.addEventListener(USER_PLAN_CHANGED_EVENT, onUpdate);
    return () => {
      window.removeEventListener(CAMERA_ALERTS_UPDATED_EVENT, onUpdate);
      window.removeEventListener(USER_PLAN_CHANGED_EVENT, onUpdate);
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
    const session = getDemoSession();
    if (!session) return;

    const next = !open;
    setOpen(next);
    if (!next) return;

    refresh();
    markCameraAlertsRead(session.email);
    setUnreadCount(0);
    setItems((prev) => prev.map((i) => ({ ...i, read: true, effectsPending: false })));
  }

  function handleAlertClick() {
    setOpen(false);
    router.push('/monitoreo');
  }

  if (items.length === 0) return null;

  const badge = unreadCount > 99 ? '99+' : String(unreadCount);

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
          unreadCount > 0
            ? `Alertas de cámaras, ${unreadCount} sin leer`
            : 'Alertas de cámaras'
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
          aria-label="Alertas de monitoreo"
          className="absolute right-0 top-full z-[60] mt-2 w-[min(100vw-2rem,20rem)] origin-top-right sm:w-80"
        >
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-2xl shadow-blue-900/40">
            <div className="border-b border-white/10 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300/90">
                Monitoreo
              </p>
              <h3 className="text-lg font-bold tracking-tight">Alertas</h3>
            </div>
            <ul className="max-h-64 divide-y divide-white/10 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={handleAlertClick}
                    className={`w-full px-4 py-3 text-left transition hover:bg-white/5 ${
                      !item.read ? 'bg-blue-500/10' : ''
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{item.message}</p>
                    <time className="mt-1 block text-[10px] text-slate-500">
                      {formatWhen(item.createdAt)}
                    </time>
                    <span className="mt-2 inline-block text-[11px] font-medium text-blue-300">
                      Ver Mis cámaras →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-white/10 px-4 py-2.5 text-center">
              <Link
                href="/monitoreo"
                onClick={() => setOpen(false)}
                className="text-[11px] font-semibold text-blue-300 hover:text-white"
              >
                Ir a Mis cámaras
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

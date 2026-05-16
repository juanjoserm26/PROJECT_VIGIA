'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getDemoSession, type DemoSession } from '@/lib/demo-session';
import { monitorCameras } from '@/lib/monitor-cameras';

export default function MonitoreoDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<DemoSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getDemoSession();
    if (!s) {
      router.replace('/iniciar-sesion');
      return;
    }
    setSession(s);
    setReady(true);
  }, [router]);

  if (!ready || !session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-400">Cargando panel...</p>
      </div>
    );
  }

  const freshAccount = Boolean(session.freshAccount);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">Panel demo</p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Monitoreo — {session.clientLabel}</h1>
          <p className="mt-1 text-sm text-slate-400">{session.email}</p>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        >
          Ir a inicio
        </Link>
      </div>

      {freshAccount ? (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-950/40 p-8 text-center">
          <h2 className="text-xl font-semibold text-white">Bienvenido a PROJECT VIGIA</h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-300">
            Aquí aparecerán tus cámaras registradas cuando contrates un plan y activemos tus flujos en
            producción.
          </p>
          <Link
            href="/plans"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Adquiere tu plan
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-slate-400">
            Vista previa con los mismos vídeos del prototipo, etiquetados como cámaras. En producción aquí verías
            tus flujos en vivo.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {monitorCameras.map((cam) => (
              <div
                key={cam.id}
                className="overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/80 shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-700/80 px-3 py-2">
                  <span className="text-sm font-semibold text-white">{cam.label}</span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 vigia-blink" aria-hidden />
                    En vivo
                  </span>
                </div>
                <div className="relative aspect-video bg-black">
                  {cam.videoSrc ? (
                    <video
                      src={cam.videoSrc}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      autoPlay
                      loop
                      controls
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500">
                      Sin vídeo
                    </div>
                  )}
                </div>
                <p className="px-3 py-2 text-xs text-slate-400">{cam.location}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

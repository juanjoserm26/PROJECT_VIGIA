'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Una sola conexión a la vez entre todos los previews de la página */
let globalWs: WebSocket | null = null;

function closeGlobalWs() {
  if (globalWs && globalWs.readyState === WebSocket.OPEN) {
    globalWs.close();
  }
  globalWs = null;
}

function httpBaseToWs(base: string): string {
  const t = base.trim().replace(/\/$/, '');
  if (t.startsWith('ws://') || t.startsWith('wss://')) return t;
  return t.replace(/^http/, 'ws');
}

type LiveYoloPreviewProps = {
  /** 0 = escenario-1, … 4 = escenario-5 (coincide con el orden en `videos/`) */
  scenarioIndex: number;
};

export default function LiveYoloPreview({ scenarioIndex }: LiveYoloPreviewProps) {
  const base = process.env.NEXT_PUBLIC_VIGIA_WS_URL?.trim();
  const [connected, setConnected] = useState(false);
  const [frameUrl, setFrameUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const sendCmd = useCallback((payload: Record<string, unknown>) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }, []);

  const connect = useCallback(() => {
    if (!base) return;
    setError(null);
    closeGlobalWs();

    const url = `${httpBaseToWs(base)}/ws/demo-stream`;
    const ws = new WebSocket(url);
    wsRef.current = ws;
    globalWs = ws;

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ cmd: 'set_video', index: scenarioIndex }));
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data as string) as {
          type?: string;
          data?: string;
          videos?: string[];
        };
        if (msg.type === 'hello' && msg.videos) {
          setVideos(msg.videos);
        }
        if (msg.type === 'frame' && msg.data) {
          setFrameUrl(`data:image/jpeg;base64,${msg.data}`);
        }
      } catch {
        /* ignore */
      }
    };

    ws.onerror = () => {
      setError('No se pudo conectar al backend. ¿Está uvicorn en marcha?');
      setConnected(false);
    };

    ws.onclose = () => {
      if (wsRef.current === ws) {
        setConnected(false);
        setFrameUrl(null);
        wsRef.current = null;
      }
      if (globalWs === ws) globalWs = null;
    };
  }, [base, scenarioIndex]);

  const disconnect = useCallback(() => {
    closeGlobalWs();
    wsRef.current = null;
    setConnected(false);
    setFrameUrl(null);
  }, []);

  useEffect(() => {
    if (connected && wsRef.current?.readyState === WebSocket.OPEN) {
      sendCmd({ cmd: 'set_video', index: scenarioIndex });
    }
  }, [scenarioIndex, connected, sendCmd]);

  useEffect(() => {
    return () => {
      const w = wsRef.current;
      if (w) {
        w.close();
        wsRef.current = null;
        if (globalWs === w) globalWs = null;
      }
    };
  }, []);

  if (!base) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Para ver la inferencia YOLO en tiempo real, arranca el backend Python y define{' '}
        <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs ring-1 ring-slate-200">
          NEXT_PUBLIC_VIGIA_WS_URL=http://127.0.0.1:8000
        </code>{' '}
        en <code className="font-mono text-xs">app/.env.local</code>.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 ring-1 ring-emerald-900/5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-emerald-900">
          IA en tiempo real <span className="font-normal text-emerald-700">(YOLO en tu PC)</span>
        </p>
        {!connected ? (
          <button
            type="button"
            onClick={connect}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-500"
          >
            Conectar este escenario
          </button>
        ) : (
          <button
            type="button"
            onClick={disconnect}
            className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
          >
            Desconectar
          </button>
        )}
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {connected && videos.length > 0 ? (
        <p className="text-xs text-emerald-800">
          Archivos en el servidor: {videos.join(', ')}
        </p>
      ) : null}

      {frameUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-emerald-900/10 bg-black shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={frameUrl}
            alt="Salida del detector en tiempo real"
            className="h-full w-full object-contain"
          />
        </div>
      ) : connected ? (
        <p className="text-xs text-emerald-800">Esperando frames del servidor…</p>
      ) : null}

      <p className="text-xs leading-relaxed text-emerald-900/80">
        Requiere{' '}
        <code className="rounded bg-white/80 px-1 font-mono text-[11px]">uvicorn main:app</code> desde{' '}
        <code className="rounded bg-white/80 px-1 font-mono text-[11px]">prototipo/</code> con{' '}
        <code className="rounded bg-white/80 px-1 font-mono text-[11px]">VIGIA_HEADLESS=1</code> (por defecto).
        El navegador no ejecuta YOLO; solo muestra lo que envía tu backend.
      </p>
    </div>
  );
}

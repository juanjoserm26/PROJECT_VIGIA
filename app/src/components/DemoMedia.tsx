'use client';

import { useCallback, useState } from 'react';
import LiveYoloPreview from '@/components/LiveYoloPreview';

type DemoMediaProps = {
  videoSrc: string | null;
  iframeSrc: string | null;
  label: string;
  /** Índice 0..4 para el backend (escenario-1 … escenario-5). */
  scenarioIndex?: number;
};

/**
 * Reproduce MP4 del prototipo (la IA ya está “dibujada” en el vídeo)
 * o embebe una URL (GitHub Pages). Si el archivo no existe, muestra ayuda.
 */
export default function DemoMedia({ videoSrc, iframeSrc, label, scenarioIndex }: DemoMediaProps) {
  const [videoFailed, setVideoFailed] = useState(false);

  const onVideoError = useCallback(() => {
    setVideoFailed(true);
  }, []);

  if (iframeSrc) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-inner ring-1 ring-slate-900/5">
        <iframe
          src={iframeSrc}
          title={label}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (videoSrc && !videoFailed) {
    return (
      <div className="space-y-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-black shadow-lg ring-1 ring-slate-900/5">
          <video
            className="h-full w-full object-contain"
            controls
            playsInline
            preload="metadata"
            onError={onVideoError}
          >
            <source src={videoSrc} type="video/mp4" />
            <source src={videoSrc.replace(/\.mp4$/i, '.webm')} type="video/webm" />
          </video>
        </div>
        {scenarioIndex !== undefined ? (
          <LiveYoloPreview scenarioIndex={scenarioIndex} />
        ) : null}
        <p className="flex items-start gap-2 text-xs text-slate-500">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-100 text-[10px] font-bold text-blue-700">
            IA
          </span>
          <span>
            Este vídeo ya incluye la salida del prototipo (cajas / detecciones). La inferencia se ejecutó al
            generar la grabación; en producción la plataforma procesa tus flujos ONVIF/RTSP en tiempo real.
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-10 text-center shadow-inner">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md text-slate-400 ring-1 ring-slate-200">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div className="max-w-xl">
        <p className="text-base font-semibold text-slate-700">
          {videoFailed ? 'El archivo no es un vídeo válido o está incompleto' : 'Añade tu exportación del prototipo'}
        </p>
        {videoFailed ? (
          <div className="mx-auto mt-3 space-y-3 text-left text-sm text-slate-600 leading-relaxed">
            <p>
              Si en el Explorador el MP4 pesa <strong className="text-slate-800">unos pocos KB (por ejemplo 1 KB)</strong>,
              no es el vídeo real: suele ser un <strong>puntero de Git LFS</strong> (GitHub guarda el archivo grande aparte)
              o una copia vacía.
            </p>
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-amber-950 ring-1 ring-amber-200/80">
              <strong>Qué hacer:</strong> descarga los MP4 de verdad — desde{' '}
              <em>Releases</em> del repo, ejecutando <code className="rounded bg-white px-1 font-mono text-xs">git lfs pull</code>{' '}
              en la carpeta del clon, exportando el vídeo desde tu PC donde corre el prototipo, o subiendo los archivos
              grandes manualmente a GitHub y bajándolos con el navegador (no solo el ZIP si LFS no está incluido).
            </p>
            <p>
              Un MP4 válido suele pesar <strong>varios megabytes</strong>. Luego vuelve a copiarlo a{' '}
              <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs ring-1 ring-slate-200">
                public/demostracion/
              </code>{' '}
              sustituyendo <strong>escenario-1.mp4</strong> … <strong>escenario-5.mp4</strong>.
            </p>
          </div>
        ) : (
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500 leading-relaxed">
            Copia los MP4 en{' '}
            <code className="rounded-md bg-white px-2 py-0.5 text-xs font-mono text-slate-800 shadow-sm ring-1 ring-slate-200">
              app/public/demostracion/
            </code>{' '}
              con los nombres <strong className="text-slate-700">escenario-1.mp4</strong> …{' '}
              <strong className="text-slate-700">escenario-5.mp4</strong>, o cambia las rutas en{' '}
            <code className="rounded-md bg-white px-2 py-0.5 text-xs font-mono text-slate-800 shadow-sm ring-1 ring-slate-200">
              src/lib/demo-videos.ts
            </code>
            .
          </p>
        )}
      </div>
    </div>
  );
}

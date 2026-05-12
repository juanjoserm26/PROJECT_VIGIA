'use client';

import { useEffect, useState } from 'react';
import QRCode from '@/components/QRCode';

type Props = {
  /** URL pública desde el servidor (misma fuente que NEXT_PUBLIC_SITE_URL en build). */
  initialSiteUrl?: string;
};

function urlFromEnvOrProp(initial: string | undefined): string {
  const raw = initial?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return '';
  return raw.replace(/\/$/, '');
}

/**
 * Franja con QR a la URL del sitio.
 * Sin variable de entorno, la URL final se completa en el cliente con `window.location.origin`.
 */
export default function MobileSiteQr({ initialSiteUrl = '' }: Props) {
  const [url, setUrl] = useState(() => urlFromEnvOrProp(initialSiteUrl));

  useEffect(() => {
    const fromBuild = urlFromEnvOrProp(initialSiteUrl);
    if (fromBuild) {
      setUrl(fromBuild);
      return;
    }
    setUrl(typeof window !== 'undefined' ? window.location.origin : '');
  }, [initialSiteUrl]);

  return (
    <section
      id="acceso-movil"
      className="border-t border-slate-200 bg-slate-100/90 ring-1 ring-inset ring-slate-200/80"
      aria-labelledby="mobile-qr-heading"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-10">
          <div className="max-w-lg text-center sm:text-left order-2 sm:order-1">
            <h2
              id="mobile-qr-heading"
              className="text-slate-800 text-base sm:text-lg font-semibold leading-snug"
            >
              ¡Ingresa desde tu celular sin complicaciones escaneando nuestro QR!
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Te lleva directo a esta misma página. También puedes usar el enlace del navegador o
              agregarla a favoritos.
            </p>
          </div>
          <div className="order-1 sm:order-2 shrink-0 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-300/80">
            {url ? (
              <QRCode data={url} size={132} level="M" className="rounded-md border-0" />
            ) : (
              <div
                className="rounded-md bg-slate-100 animate-pulse"
                style={{ width: 132, height: 132 }}
                aria-hidden
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

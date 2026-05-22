'use client';

import { useEffect, useState } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  data: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
  /** Azul de marca y mayor margen — ideal para checkout / resumen de plan */
  variant?: 'default' | 'brand';
}

/**
 * QR escaneable vía `qrcode` → PNG en data URL (más estable que canvas en algunos entornos).
 */
export default function QRCode({
  data,
  size = 200,
  level = 'M',
  className = 'rounded-lg border border-slate-200 bg-white',
  variant = 'default',
}: QRCodeProps) {
  const [src, setSrc] = useState<string | null>(null);
  const isBrand = variant === 'brand';
  const correction = isBrand ? 'H' : level;
  const imgClass =
    className ||
    (isBrand
      ? 'rounded-xl bg-white'
      : 'rounded-lg border border-slate-200 bg-white');

  useEffect(() => {
    if (!data.trim()) {
      setSrc(null);
      return;
    }
    let cancelled = false;
    QRCodeLib.toDataURL(data, {
      width: size,
      margin: isBrand ? 2 : 1,
      errorCorrectionLevel: correction,
      color: isBrand
        ? { dark: '#1d4ed8', light: '#ffffff' }
        : { dark: '#0f172a', light: '#ffffff' },
    })
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setSrc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [data, size, level, correction, isBrand]);

  if (!src) {
    return (
      <div
        className={`${imgClass} bg-slate-100 animate-pulse`}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }

  return (
    <img
      src={src}
      alt="Código QR PROJECT VIGIA"
      width={size}
      height={size}
      className={imgClass}
      style={{ width: size, height: size, maxWidth: '100%' }}
      decoding="async"
    />
  );
}

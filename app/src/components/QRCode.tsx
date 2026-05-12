'use client';

import { useEffect, useState } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  data: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
}

/**
 * QR escaneable vía `qrcode` → PNG en data URL (más estable que canvas en algunos entornos).
 */
export default function QRCode({
  data,
  size = 200,
  level = 'M',
  className = 'rounded-lg border border-slate-200 bg-white',
}: QRCodeProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!data.trim()) {
      setSrc(null);
      return;
    }
    let cancelled = false;
    QRCodeLib.toDataURL(data, {
      width: size,
      margin: 1,
      errorCorrectionLevel: level,
      color: { dark: '#0f172a', light: '#ffffff' },
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
  }, [data, size, level]);

  if (!src) {
    return (
      <div
        className={`${className} bg-slate-100 animate-pulse`}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }

  return (
    <img
      src={src}
      alt="Código QR"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, maxWidth: '100%' }}
      decoding="async"
    />
  );
}

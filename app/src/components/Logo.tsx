import Image from 'next/image';

const LOGO_SRC = '/images/brand/project-vigia-logo.png';

interface LogoProps {
  size?: number;
  className?: string;
  /**
   * Recorte circular real (clip-path + object-cover): el PNG llena un cuadrado y se corta
   * a círculo; desaparece el cuadrado blanco exterior. Usar en pie sobre fondo oscuro.
   */
  circleMask?: boolean;
  /** Reservado por compatibilidad; el logo es imagen estática. */
  animated?: boolean;
  /** Reservado por compatibilidad; una sola versión de marca. */
  variant?: 'gradient' | 'mono-light' | 'mono-dark';
}

export default function Logo({ size = 48, className = '', circleMask = false }: LogoProps) {
  const px = Math.max(size * 2, 96);
  const dim = { width: size, height: size, minWidth: size, minHeight: size };
  const half = size / 2;
  const circleClip =
    circleMask
      ? {
          clipPath: `circle(${half}px at ${half}px ${half}px)`,
          WebkitClipPath: `circle(${half}px at ${half}px ${half}px)` as const,
        }
      : {};

  const frameClass = circleMask
    ? `relative block shrink-0 overflow-hidden rounded-full leading-none ${className}`.trim()
    : `relative inline-block shrink-0 align-middle ${className}`.trim();

  const imageClass = circleMask
    ? 'object-cover object-center'
    : 'object-contain';

  return (
    <span className={frameClass} style={{ ...dim, ...circleClip }}>
      <Image
        src={LOGO_SRC}
        alt="PROJECT VIGIA"
        fill
        className={imageClass}
        sizes={`${px}px`}
        quality={95}
        priority
      />
    </span>
  );
}

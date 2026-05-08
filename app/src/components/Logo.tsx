interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
  variant?: 'gradient' | 'mono-light' | 'mono-dark';
}

export default function Logo({
  size = 48,
  className = '',
  animated = true,
  variant = 'gradient',
}: LogoProps) {
  const id = `vigia-logo-${variant}`;

  const colors =
    variant === 'mono-light'
      ? { primary: '#ffffff', secondary: '#e2e8f0', accent: '#ffffff' }
      : variant === 'mono-dark'
      ? { primary: '#0f172a', secondary: '#334155', accent: '#0f172a' }
      : { primary: '#2563eb', secondary: '#1e40af', accent: '#60a5fa' };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={`vigia-logo ${animated ? 'vigia-logo-animated' : ''} ${className}`}
      aria-label="PROJECT VIGIA logo"
    >
      <defs>
        {/* Hexagon gradient */}
        <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>

        {/* Iris radial gradient */}
        <radialGradient id={`${id}-iris`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.accent} stopOpacity="0.9" />
          <stop offset="60%" stopColor={colors.primary} stopOpacity="0.4" />
          <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
        </radialGradient>

        {/* Clip for scan line */}
        <clipPath id={`${id}-iris-clip`}>
          <circle cx="32" cy="32" r="14" />
        </clipPath>
      </defs>

      {/* Hexagonal shield (rotated) */}
      <path
        d="M32 2 L58 17 L58 47 L32 62 L6 47 L6 17 Z"
        fill={`url(#${id}-bg)`}
        stroke={colors.primary}
        strokeWidth="1"
      />

      {/* Inner accent border */}
      <path
        d="M32 7 L53 19.5 L53 44.5 L32 57 L11 44.5 L11 19.5 Z"
        fill="none"
        stroke="white"
        strokeOpacity="0.18"
        strokeWidth="0.8"
      />

      {/* Outer ring (lens body) */}
      <circle
        cx="32"
        cy="32"
        r="20"
        fill="none"
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="1"
        className="vigia-logo-ring-outer"
      />

      {/* Mid ring */}
      <circle
        cx="32"
        cy="32"
        r="16"
        fill="none"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="1"
        className="vigia-logo-ring-mid"
      />

      {/* Inner ring (iris) */}
      <circle
        cx="32"
        cy="32"
        r="13"
        fill={`url(#${id}-iris)`}
        stroke="white"
        strokeOpacity="0.85"
        strokeWidth="1.2"
      />

      {/* Scan line (animated) */}
      <g clipPath={`url(#${id}-iris-clip)`}>
        <line
          x1="18"
          y1="32"
          x2="46"
          y2="32"
          stroke="white"
          strokeWidth="1.2"
          strokeOpacity="0.85"
          className="vigia-logo-scan"
        />
      </g>

      {/* V mark (the pupil) */}
      <path
        d="M25 27 L32 39 L39 27"
        fill="none"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Corner ticks (camera viewfinder cues) */}
      <path
        d="M14 22 L14 18 L18 18 M50 18 L46 18 M50 18 L50 22 M14 42 L14 46 L18 46 M50 46 L46 46 M50 46 L50 42"
        fill="none"
        stroke="white"
        strokeOpacity="0.6"
        strokeWidth="1.2"
        strokeLinecap="round"
        className="vigia-logo-ticks"
      />
    </svg>
  );
}

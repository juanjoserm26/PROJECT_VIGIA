'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getSafeInternalRedirect } from '@/lib/auth-redirect';

type LinkProps = {
  className?: string;
  children: React.ReactNode;
};

export function LoginLinkWithRedirect({ className, children }: LinkProps) {
  const searchParams = useSearchParams();
  const r = getSafeInternalRedirect(searchParams.get('redirect'));
  const href = r ? `/iniciar-sesion?redirect=${encodeURIComponent(r)}` : '/iniciar-sesion';
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function RegisterLinkWithRedirect({ className, children }: LinkProps) {
  const searchParams = useSearchParams();
  const r = getSafeInternalRedirect(searchParams.get('redirect'));
  const href = r ? `/crear-cuenta?redirect=${encodeURIComponent(r)}` : '/crear-cuenta';
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

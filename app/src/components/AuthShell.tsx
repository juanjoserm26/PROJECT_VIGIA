import Image from 'next/image';
import Link from 'next/link';
import Logo from './Logo';

type AuthShellProps = {
  children: React.ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/vigia-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.9)_0%,rgba(30,58,138,0.35)_50%,rgba(15,23,42,0.95)_100%)]" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-slate-950/50 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Logo size={40} circleMask />
            <span className="hidden text-sm font-bold text-white sm:inline">PROJECT VIGIA</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-300 transition hover:text-white">
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col">{children}</main>
    </div>
  );
}

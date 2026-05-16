import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monitoreo | PROJECT VIGIA',
  description: 'Panel de monitoreo con tus cámaras.',
};

export default function MonitoreoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      {children}
    </div>
  );
}

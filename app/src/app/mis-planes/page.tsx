import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MisPlanesDashboard from '@/components/MisPlanesDashboard';

export const metadata: Metadata = {
  title: 'Mis planes | PROJECT VIGIA',
  description: 'Planes contratados en tu cuenta PROJECT VIGIA.',
};

export default function MisPlanesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        <MisPlanesDashboard />
      </main>
      <Footer />
    </div>
  );
}

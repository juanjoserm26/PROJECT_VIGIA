import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Solicitar asesoría | PROJECT VIGIA',
  description:
    'Asesoría técnica previa a contratar: integración ONVIF/RTSP, volumen de cámaras IP y planes SaaS PROJECT VIGIA. Sin venta de hardware.',
};

export default function AsesoriaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ContactForm variant="asesoria" />
      </main>
      <Footer />
    </div>
  );
}

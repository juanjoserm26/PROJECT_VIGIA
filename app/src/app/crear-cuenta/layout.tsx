import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear cuenta | PROJECT VIGIA',
  description: 'Regístrate para acceder al panel de monitoreo.',
};

export default function CrearCuentaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

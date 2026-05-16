import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar sesión | PROJECT VIGIA',
  description: 'Accede a tu panel de monitoreo con correo y contraseña.',
};

export default function IniciarSesionLayout({ children }: { children: React.ReactNode }) {
  return children;
}

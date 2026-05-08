import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PROJECT VIGIA - Vigilancia inteligente con IA",
  description:
    "Plataforma SaaS de análisis inteligente de video con IA YOLOv8. Detección automática de robos, atracos y comportamientos sospechosos. Compatible con cámaras IP existentes mediante ONVIF. Bucaramanga, Colombia.",
  keywords: [
    "vigilancia inteligente",
    "IA",
    "YOLOv8",
    "ONVIF",
    "videovigilancia",
    "Bucaramanga",
    "seguridad SaaS",
    "Policía Nacional",
  ],
  authors: [
    { name: "Jhoan Sebastián García Reyes" },
    { name: "Juan José Rincón Méndez" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

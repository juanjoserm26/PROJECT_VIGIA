/**
 * Demostración — vídeos del prototipo (salida con IA ya renderizada en el MP4).
 *
 * PASOS RÁPIDOS (desde tu repo de GitHub):
 * 1. Descarga el último prototipo y exporta los 5 vídeos en MP4 (o WebM).
 * 2. En tu PC, copia los archivos a esta carpeta del proyecto:
 *      app/public/demostracion/escenario-1.mp4
 *      … hasta escenario-5.mp4
 *    (La carpeta `public` es la que sirve Next.js en la raíz del sitio como `/demostracion/...`.)
 * 3. Guarda y recarga la página — no hace falta tocar código si respetas esos nombres.
 *
 * Alternativas:
 * - Si los vídeos están en GitHub sin copiarlos: usa URL raw en `videoSrc`, por ejemplo:
 *   https://raw.githubusercontent.com/USUARIO/REPO/rama/carpeta/video.mp4
 * - Si el demo es una web (GitHub Pages): pon la URL pública en `iframeSrc` y deja `videoSrc` en null.
 */

export type DemoVideoItem = {
  id: number;
  label: string;
  title: string;
  description: string;
  /** Ruta pública: archivo en `public/` o URL absoluta al MP4/WebM */
  videoSrc: string | null;
  /** Demo embebido (página completa), opcional */
  iframeSrc: string | null;
};

/** Nombres de archivo esperados si trabajas solo con archivos locales */
export const DEMO_VIDEO_FILES = [
  'escenario-1.mp4',
  'escenario-2.mp4',
  'escenario-3.mp4',
  'escenario-4.mp4',
  'escenario-5.mp4',
] as const;

export const demoVideos: DemoVideoItem[] = [
  {
    id: 1,
    label: 'Video 1',
    title: 'Escena 1',
    description:
      'Procesamiento con modelo YOLOv8 sobre el flujo: detección y seguimiento en tiempo real.',
    videoSrc: '/demostracion/escenario-1.mp4',
    iframeSrc: null,
  },
  {
    id: 2,
    label: 'Video 2',
    title: 'Escena 2',
    description: 'Análisis de movimiento y eventos en otra condición de iluminación o ángulo.',
    videoSrc: '/demostracion/escenario-2.mp4',
    iframeSrc: null,
  },
  {
    id: 3,
    label: 'Video 3',
    title: 'Escena 3',
    description: 'Continuidad del análisis con cajas de detección y reglas del prototipo.',
    videoSrc: '/demostracion/escenario-3.mp4',
    iframeSrc: null,
  },
  {
    id: 4,
    label: 'Video 4',
    title: 'Escena 4',
    description: 'Comportamiento del pipeline de inferencia en escena compuesta.',
    videoSrc: '/demostracion/escenario-4.mp4',
    iframeSrc: null,
  },
  {
    id: 5,
    label: 'Video 5',
    title: 'Escena 5',
    description: 'Cierre de la serie de pruebas del demo técnico integrado a la web.',
    videoSrc: '/demostracion/escenario-5.mp4',
    iframeSrc: null,
  },
];

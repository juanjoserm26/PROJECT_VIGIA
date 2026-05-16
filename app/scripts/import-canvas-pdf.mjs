/**
 * Importa un PDF externo del canvas:
 * - Copia el PDF a public/ (descarga idéntica)
 * - Genera PNG (pdfjs; fondo oscuro si el nombre incluye "dark")
 *
 * Uso: node scripts/import-canvas-pdf.mjs "ruta/al/archivo.pdf"
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const pdfPath = join(publicDir, 'PROJECT_VIGIA_Canvas_v3.pdf');
const pngPath = join(publicDir, 'PROJECT_VIGIA_Canvas_v3.png');
const metaPath = join(publicDir, 'canvas-v3-image-meta.json');

const SCALE = Number(process.env.CANVAS_PDF_SCALE || 3);
const sourcePdf = process.argv[2];

if (!sourcePdf || !existsSync(sourcePdf)) {
  console.error('Uso: node scripts/import-canvas-pdf.mjs "<ruta-del-pdf>"');
  process.exit(1);
}

const sourceSize = readFileSync(sourcePdf).length;
const isDarkCanvas = /dark/i.test(basename(sourcePdf));

if (sourceSize < 50_000) {
  console.warn(
    `Advertencia: el PDF pesa solo ${sourceSize} bytes. Si no se ve bien en el navegador, ` +
      'vuelve a exportarlo desde Canva/PowerPoint como PDF (descarga completa, no enlace).',
  );
}

copyFileSync(sourcePdf, pdfPath);
console.log('PDF copiado a:', pdfPath, `(${sourceSize} bytes, dark=${isDarkCanvas})`);

const skipPng = process.env.SKIP_PNG_RENDER === '1';
if (skipPng) {
  console.log('SKIP_PNG_RENDER=1: no se regenera el PNG (queda el de generate:canvas-pdf u otro).');
  process.exit(0);
}

const data = new Uint8Array(readFileSync(pdfPath));
const pdf = await getDocument({ data, useSystemFonts: true }).promise;
const page = await pdf.getPage(1);
const viewport = page.getViewport({ scale: SCALE });
const width = Math.round(viewport.width);
const height = Math.round(viewport.height);

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');
context.fillStyle = isDarkCanvas ? '#0f172a' : '#ffffff';
context.fillRect(0, 0, width, height);

await page.render({ canvasContext: context, viewport }).promise;
writeFileSync(pngPath, canvas.toBuffer('image/png'));

writeFileSync(
  metaPath,
  JSON.stringify(
    {
      width,
      height,
      cssWidth: Math.round(width / SCALE),
      cssHeight: Math.round(height / SCALE),
      source: 'import-canvas-pdf',
      isDarkCanvas,
    },
    null,
    2,
  ),
);

console.log('PNG:', pngPath, width, 'x', height, 'fondo', isDarkCanvas ? '#0f172a' : '#fff');
console.log('Meta:', metaPath);

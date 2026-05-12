/**
 * Genera desde PROJECT_VIGIA_Canvas_v3.html:
 * - public/PROJECT_VIGIA_Canvas_v3.pdf  (una sola página)
 * - public/PROJECT_VIGIA_Canvas_v3.png  (imagen alta resolución para la web)
 * - public/canvas-v3-image-meta.json   (dimensiones intrínsecas del PNG)
 *
 * Uso: npm run generate:canvas-pdf
 */
import puppeteer from 'puppeteer-core';
import { existsSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const htmlPath = join(publicDir, 'PROJECT_VIGIA_Canvas_v3.html');
const pdfPath = join(publicDir, 'PROJECT_VIGIA_Canvas_v3.pdf');
const pngPath = join(publicDir, 'PROJECT_VIGIA_Canvas_v3.png');
const metaPath = join(publicDir, 'canvas-v3-image-meta.json');

const DEVICE_SCALE = 2;

function findBrowser() {
  const env = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (env && existsSync(env)) return env;
  const candidates = [
    join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  ];
  for (const p of candidates) {
    if (p && existsSync(p)) return p;
  }
  return null;
}

function clipSheet() {
  const el = document.querySelector('.sheet');
  if (!el) return { x: 0, y: 0, width: 1600, height: 2000 };
  const r = el.getBoundingClientRect();
  return {
    x: Math.max(0, Math.round(r.left)),
    y: Math.max(0, Math.round(r.top)),
    width: Math.round(r.width),
    height: Math.round(r.height),
  };
}

const executablePath = findBrowser();
if (!executablePath) {
  console.error(
    'No se encontró Chrome ni Edge. Define PUPPETEER_EXECUTABLE_PATH con la ruta al ejecutable.',
  );
  process.exit(1);
}

const fileUrl = pathToFileURL(htmlPath).href;
const browser = await puppeteer.launch({
  executablePath,
  headless: true,
});
try {
  const page = await browser.newPage();
  await page.setViewport({
    width: 2000,
    height: 1200,
    deviceScaleFactor: DEVICE_SCALE,
  });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  let clip = await page.evaluate(clipSheet);

  await page.setViewport({
    width: Math.min(clip.width + clip.x + 32, 4096),
    height: Math.min(clip.height + clip.y + 32, 14000),
    deviceScaleFactor: DEVICE_SCALE,
  });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  clip = await page.evaluate(clipSheet);

  await page.pdf({
    path: pdfPath,
    width: `${clip.width}px`,
    height: `${clip.height}px`,
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    pageRanges: '1',
  });
  console.log('PDF (1 página):', pdfPath, clip.width, 'x', clip.height, 'px');

  await page.screenshot({
    path: pngPath,
    type: 'png',
    clip,
  });
  console.log('PNG:', pngPath);

  const intrinsicW = clip.width * DEVICE_SCALE;
  const intrinsicH = clip.height * DEVICE_SCALE;
  writeFileSync(
    metaPath,
    JSON.stringify(
      { width: intrinsicW, height: intrinsicH, cssWidth: clip.width, cssHeight: clip.height },
      null,
      2,
    ),
  );
  console.log('Meta:', metaPath, intrinsicW, 'x', intrinsicH);
} finally {
  await browser.close();
}

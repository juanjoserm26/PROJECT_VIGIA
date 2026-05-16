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
import { readFile } from 'fs/promises';
import { createServer } from 'node:http';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

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

async function serveCanvasHtml(htmlAbsolutePath) {
  const server = createServer((req, res) => {
    if (req.method !== 'GET') {
      res.statusCode = 404;
      res.end();
      return;
    }
    const pathOnly = (req.url || '/').split('?')[0];
    if (pathOnly !== '/' && pathOnly !== '') {
      res.statusCode = 404;
      res.end();
      return;
    }
    readFile(htmlAbsolutePath)
      .then((buf) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(buf);
      })
      .catch(() => {
        res.statusCode = 500;
        res.end();
      });
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : 0;
  return {
    pageUrl: `http://127.0.0.1:${port}/`,
    close() {
      return new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    },
  };
}

const executablePath = findBrowser();
if (!executablePath) {
  console.error(
    'No se encontró Chrome ni Edge. Define PUPPETEER_EXECUTABLE_PATH con la ruta al ejecutable.',
  );
  process.exit(1);
}

const { pageUrl, close: closeServer } = await serveCanvasHtml(htmlPath);
const browser = await puppeteer.launch({
  executablePath,
  headless: true,
});
try {
  const page = await browser.newPage();
  const vpW = 2400;
  const vpH = 12000;
  await page.setViewport({
    width: vpW,
    height: vpH,
    deviceScaleFactor: DEVICE_SCALE,
  });
  await page.goto(pageUrl, { waitUntil: 'load', timeout: 90_000 });
  await page.waitForSelector('.sheet', { timeout: 20_000 });
  await new Promise((r) => setTimeout(r, 500));

  const clip = await page.evaluate(clipSheet);

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
      {
        width: intrinsicW,
        height: intrinsicH,
        cssWidth: clip.width,
        cssHeight: clip.height,
        source: 'generate-canvas-html',
      },
      null,
      2,
    ),
  );
  console.log('Meta:', metaPath, intrinsicW, 'x', intrinsicH);
} finally {
  await browser.close();
  await closeServer().catch(() => {});
}

/**
 * Arregla GOOGLE_CLIENT_ID en .env.local y opcionalmente el secret.
 * Uso:
 *   node scripts/setup-google-local.mjs
 *   node scripts/setup-google-local.mjs --secret=GOCSPX-tu-secreto
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const envPath = join(process.cwd(), '.env.local');
const secretArg = process.argv.find((a) => a.startsWith('--secret='));
const secretFromCli = secretArg ? secretArg.slice('--secret='.length).trim() : '';

if (!existsSync(envPath)) {
  console.error('No existe .env.local. Ejecuta antes: npx vercel env pull .env.local --environment=production --yes');
  process.exit(1);
}

let text = readFileSync(envPath, 'utf8');

function readKey(key) {
  const m = text.match(new RegExp(`^${key}=(.*)$`, 'm'));
  if (!m) return '';
  let v = m[1].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  return v;
}

function setKey(key, value) {
  const line = `${key}=${value.includes(' ') ? `"${value}"` : value}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  if (re.test(text)) {
    text = text.replace(re, line);
  } else {
    text += `\n${line}\n`;
  }
}

const publicId = readKey('NEXT_PUBLIC_GOOGLE_CLIENT_ID');
if (!publicId) {
  console.error('Falta NEXT_PUBLIC_GOOGLE_CLIENT_ID en .env.local');
  process.exit(1);
}

setKey('GOOGLE_CLIENT_ID', publicId);

const currentSecret = readKey('GOOGLE_CLIENT_SECRET');

if (secretFromCli) {
  setKey('GOOGLE_CLIENT_SECRET', secretFromCli);
}

if (!readKey('NEXT_PUBLIC_SITE_URL')) {
  setKey('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000');
}

writeFileSync(envPath, text);

if (secretFromCli) {
  console.log('Listo: GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env.local');
  console.log('Reinicia: npm run dev');
  process.exit(0);
}

if (!currentSecret && !secretFromCli) {
  console.log('GOOGLE_CLIENT_ID guardado en .env.local.');
  console.log('');
  console.log('Falta GOOGLE_CLIENT_SECRET. Opción A (recomendada en local):');
  console.log('1. https://console.cloud.google.com/apis/credentials');
  console.log('2. Cliente OAuth → Secreto del cliente → copiar');
  console.log('3. node scripts/setup-google-local.mjs --secret=PEGAR_SECRETO');
  console.log('');
  console.log('Opción B: en Vercel (tu captura), edita cada variable y marca también Development.');
  process.exit(0);
}

console.log('Listo. Reinicia: npm run dev');

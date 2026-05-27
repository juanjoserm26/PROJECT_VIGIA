import { promises as fs } from 'fs';
import path from 'path';
import { getServerDataDir } from '@/lib/server-data-path';
import type { PqrsSubmission, PqrsType } from '@/lib/pqrs-types';

const DATA_DIR = getServerDataDir();
const PQRS_FILE = path.join(DATA_DIR, 'pqrs-submissions.json');

const TIPOS = new Set<PqrsType>(['peticion', 'queja', 'reclamo', 'sugerencia']);

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(PQRS_FILE);
  } catch {
    await fs.writeFile(PQRS_FILE, '[]', 'utf8');
  }
}

export async function readPqrsServer(): Promise<PqrsSubmission[]> {
  await ensureFile();
  try {
    const raw = await fs.readFile(PQRS_FILE, 'utf8');
    const parsed = JSON.parse(raw) as PqrsSubmission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writePqrs(items: PqrsSubmission[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(PQRS_FILE, JSON.stringify(items, null, 2), 'utf8');
}

export async function createPqrsServer(input: {
  tipo: string;
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
}): Promise<PqrsSubmission | null> {
  if (!TIPOS.has(input.tipo as PqrsType)) return null;
  const items = await readPqrsServer();
  const entry: PqrsSubmission = {
    id: crypto.randomUUID(),
    tipo: input.tipo as PqrsType,
    nombre: String(input.nombre).slice(0, 200).trim(),
    email: String(input.email).slice(0, 200).trim(),
    telefono: input.telefono ? String(input.telefono).slice(0, 50).trim() : undefined,
    mensaje: String(input.mensaje).slice(0, 8000).trim(),
    receivedAt: new Date().toISOString(),
    read: false,
  };
  await writePqrs([entry, ...items]);
  return entry;
}

export async function markPqrsReadServer(ids?: string[]): Promise<void> {
  const items = await readPqrsServer();
  const next = items.map((item) => {
    if (ids?.length && !ids.includes(item.id)) return item;
    return { ...item, read: true };
  });
  await writePqrs(next);
}

export function countUnreadPqrs(items: PqrsSubmission[]): number {
  return items.filter((i) => !i.read).length;
}

export async function deletePqrsServer(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const items = await readPqrsServer();
  const idSet = new Set(ids);
  await writePqrs(items.filter((item) => !idSet.has(item.id)));
}

export async function clearPqrsServer(): Promise<void> {
  await writePqrs([]);
}

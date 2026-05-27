import os from 'os';
import path from 'path';

/**
 * Carpeta persistente para JSON del servidor.
 * En Vercel el filesystem del proyecto es de solo lectura; usamos /tmp.
 */
export function getServerDataDir(): string {
  if (process.env.VIGIA_DATA_DIR?.trim()) {
    return process.env.VIGIA_DATA_DIR.trim();
  }
  if (process.env.VERCEL === '1' || process.env.VERCEL_ENV) {
    return path.join(os.tmpdir(), 'vigia-data');
  }
  return path.join(process.cwd(), 'data');
}

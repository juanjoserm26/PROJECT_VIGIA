/** Rutas internas válidas tras login/registro (?redirect=…) */
const ALLOWED_PREFIXES = ['/', '/monitoreo', '/checkout', '/plans'];

export function getSafeInternalRedirect(value: string | null | undefined): string | null {
  if (!value || typeof value !== 'string') return null;
  const path = value.trim();
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  if (ALLOWED_PREFIXES.some((p) => path === p || path.startsWith(`${p}?`) || path.startsWith(`${p}/`))) {
    return path;
  }
  return null;
}

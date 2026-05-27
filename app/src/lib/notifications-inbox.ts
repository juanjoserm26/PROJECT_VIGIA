/** Marca de “bandeja vaciada”: solo se muestran notificaciones posteriores a esta fecha. */

export const INBOX_CLEARED_STORAGE_KEY = 'vigia_inbox_cleared_v1';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function readCleared(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(INBOX_CLEARED_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeCleared(store: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(INBOX_CLEARED_STORAGE_KEY, JSON.stringify(store));
}

export function markInboxCleared(email: string): void {
  const key = normalizeEmail(email);
  const store = readCleared();
  store[key] = new Date().toISOString();
  writeCleared(store);
}

export function getInboxClearedAt(email: string): string | null {
  return readCleared()[normalizeEmail(email)] ?? null;
}

export function isNotificationVisibleAfterClear(email: string, createdAtIso: string): boolean {
  const clearedAt = getInboxClearedAt(email);
  if (!clearedAt) return true;
  return new Date(createdAtIso).getTime() > new Date(clearedAt).getTime();
}

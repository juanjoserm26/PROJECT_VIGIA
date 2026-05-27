import { getDemoSession } from '@/lib/demo-session';

export const CAMERA_ALERTS_STORAGE_KEY = 'vigia_camera_alerts_v1';
export const CAMERA_ALERTS_UPDATED_EVENT = 'vigia-camera-alerts-updated';
const EFFECTS_PLAYED_KEY = 'vigia_camera_alert_fx_played';

export type CameraAlert = {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  effectsPending: boolean;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function readStore(): Record<string, CameraAlert[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CAMERA_ALERTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, CameraAlert[]>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, CameraAlert[]>): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CAMERA_ALERTS_STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(CAMERA_ALERTS_UPDATED_EVENT));
}

function readEffectsPlayed(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.sessionStorage.getItem(EFFECTS_PLAYED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function markEffectsPlayed(alertId: string): void {
  if (typeof window === 'undefined') return;
  const played = readEffectsPlayed();
  played.add(alertId);
  window.sessionStorage.setItem(EFFECTS_PLAYED_KEY, JSON.stringify([...played]));
}

export function getCameraAlertsForEmail(email: string): CameraAlert[] {
  const store = readStore();
  return store[normalizeEmail(email)] ?? [];
}

export function getUnreadCameraAlertCount(email: string): number {
  return getCameraAlertsForEmail(email).filter((a) => !a.read).length;
}

function pushAlert(
  email: string,
  message: string,
  options: { withEffects: boolean },
): CameraAlert | null {
  if (typeof window === 'undefined') return null;
  const session = getDemoSession();
  if (!session) return null;

  const key = normalizeEmail(email);
  const store = readStore();
  const list = store[key] ?? [];

  const existing = list.find((a) => a.message === message);
  if (existing) return existing;

  const alert: CameraAlert = {
    id: `cam-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    message,
    read: false,
    createdAt: new Date().toISOString(),
    effectsPending: options.withEffects,
  };

  store[key] = [alert, ...list].slice(0, 20);
  writeStore(store);
  return alert;
}

export function notifyCamerasActivated(
  email: string,
  options: { withEffects: boolean },
): CameraAlert | null {
  return pushAlert(email, 'Se han generado alertas', options);
}

export function ensureCameraAlertsForActivePlan(email: string): void {
  const key = normalizeEmail(email);
  const existing = getCameraAlertsForEmail(key);
  if (existing.length > 0) return;
  pushAlert(key, 'Se han generado alertas', { withEffects: false });
}

export function markCameraAlertsRead(email: string): void {
  const key = normalizeEmail(email);
  const store = readStore();
  const list = store[key];
  if (!list?.length) return;
  store[key] = list.map((a) => ({ ...a, read: true, effectsPending: false }));
  writeStore(store);
}

export function deleteCameraAlert(email: string, id: string): void {
  const key = normalizeEmail(email);
  const store = readStore();
  const list = store[key];
  if (!list) return;
  store[key] = list.filter((a) => a.id !== id);
  writeStore(store);
}

export function clearCameraAlerts(email: string): void {
  const key = normalizeEmail(email);
  const store = readStore();
  if (!store[key]?.length) return;
  store[key] = [];
  writeStore(store);
}

export function clearAlertEffectsPending(email: string, alertId: string): void {
  const key = normalizeEmail(email);
  const store = readStore();
  const list = store[key];
  if (!list) return;
  store[key] = list.map((a) => (a.id === alertId ? { ...a, effectsPending: false } : a));
  writeStore(store);
}

export function playNotificationChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    const t = ctx.currentTime;
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(640, t + 0.1);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    osc.start(t);
    osc.stop(t + 0.3);
    osc.onended = () => void ctx.close();
  } catch {
    /* sin audio */
  }
}

/** Dispara sonido + marca efectos solo una vez por alerta nueva (no al recargar). */
export function runPendingAlertEffects(email: string): boolean {
  if (typeof window === 'undefined') return false;
  const session = getDemoSession();
  if (!session) return false;

  const key = normalizeEmail(email);
  const played = readEffectsPlayed();
  const pending = getCameraAlertsForEmail(key).find(
    (a) => a.effectsPending && !played.has(a.id),
  );
  if (!pending) return false;

  playNotificationChime();
  markEffectsPlayed(pending.id);
  clearAlertEffectsPending(key, pending.id);
  return true;
}

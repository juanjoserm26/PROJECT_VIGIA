export const DEMO_SESSION_KEY = 'vigia_demo_session';

/** Se dispara en esta pestaña cuando cambia la sesión demo (login/logout). */
export const VIGIA_SESSION_CHANGED_EVENT = 'vigia-demo-session-changed';

export type DemoSession = {
  email: string;
  clientLabel: string;
  createdAt: number;
  /** Cuenta recién creada: panel sin cámaras hasta contratar plan */
  freshAccount?: boolean;
};

export function clientLabelFromProfile(nombres: string, apellidos: string): string {
  const full = `${nombres.trim()} ${apellidos.trim()}`.trim();
  return full || 'Cliente VIGIA';
}

export function getDemoSession(): DemoSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

export function setDemoSession(session: DemoSession): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent(VIGIA_SESSION_CHANGED_EVENT));
}

export function clearDemoSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DEMO_SESSION_KEY);
  window.dispatchEvent(new CustomEvent(VIGIA_SESSION_CHANGED_EVENT));
}

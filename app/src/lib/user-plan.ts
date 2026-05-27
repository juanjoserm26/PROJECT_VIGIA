import type { PlanSlug } from '@/lib/subscription-plans';
import { getDemoSession } from '@/lib/demo-session';
import {
  ensureCameraAlertsForActivePlan,
  getCameraAlertsForEmail,
  notifyCamerasActivated,
} from '@/lib/camera-alerts';
import { notifyPlanAlreadyOwned, notifyPlanPurchased } from '@/lib/plan-notifications';

export const USER_PLAN_STORAGE_KEY = 'vigia_user_plans_v2';
export const USER_PLAN_LEGACY_KEY = 'vigia_active_plans_v1';
export const USER_PLAN_CHANGED_EVENT = 'vigia-user-plan-changed';

export type PurchasedPlanEntry = {
  planSlug: PlanSlug;
  purchasedAt: number;
};

export type UserPlansBundle = {
  purchased: PurchasedPlanEntry[];
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function migrateLegacy(): Record<string, UserPlansBundle> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(USER_PLAN_LEGACY_KEY);
    if (!raw) return {};
    const legacy = JSON.parse(raw) as Record<string, { planSlug: PlanSlug; activatedAt: number }>;
    const next: Record<string, UserPlansBundle> = {};
    for (const [email, plan] of Object.entries(legacy)) {
      if (plan?.planSlug) {
        next[email] = { purchased: [{ planSlug: plan.planSlug, purchasedAt: plan.activatedAt }] };
      }
    }
    if (Object.keys(next).length > 0) {
      window.localStorage.removeItem(USER_PLAN_LEGACY_KEY);
    }
    return next;
  } catch {
    return {};
  }
}

function readBundles(): Record<string, UserPlansBundle> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(USER_PLAN_STORAGE_KEY);
    if (!raw) return migrateLegacy();
    const parsed = JSON.parse(raw) as Record<string, UserPlansBundle>;
    if (!parsed || typeof parsed !== 'object') return migrateLegacy();
    return parsed;
  } catch {
    return migrateLegacy();
  }
}

function writeBundles(bundles: Record<string, UserPlansBundle>): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USER_PLAN_STORAGE_KEY, JSON.stringify(bundles));
  window.dispatchEvent(new CustomEvent(USER_PLAN_CHANGED_EVENT));
}

export function getPurchasedPlans(email: string): PurchasedPlanEntry[] {
  const bundle = readBundles()[normalizeEmail(email)];
  return bundle?.purchased ?? [];
}

export function userOwnsPlan(email: string, planSlug: PlanSlug): boolean {
  return getPurchasedPlans(email).some((p) => p.planSlug === planSlug);
}

export function hasActiveUserPlan(email: string): boolean {
  return getPurchasedPlans(email).length > 0;
}

/** Plan más reciente (compatibilidad con flujos que usan un solo plan). */
export function getActiveUserPlan(email: string): PurchasedPlanEntry | null {
  const list = getPurchasedPlans(email);
  if (!list.length) return null;
  return [...list].sort((a, b) => b.purchasedAt - a.purchasedAt)[0] ?? null;
}

export type ActivateUserPlanResult = 'activated' | 'already_owned' | 'no_session';

/** Tras comprar/simular checkout — solo con sesión activa. */
export function activateUserPlan(email: string, planSlug: PlanSlug): ActivateUserPlanResult {
  if (typeof window === 'undefined') return 'no_session';
  const session = getDemoSession();
  if (!session) return 'no_session';

  const key = normalizeEmail(email);
  const bundles = readBundles();
  const bundle = bundles[key] ?? { purchased: [] };

  if (userOwnsPlan(key, planSlug)) {
    notifyPlanAlreadyOwned(key, planSlug);
    return 'already_owned';
  }

  bundle.purchased = [...bundle.purchased, { planSlug, purchasedAt: Date.now() }];
  bundles[key] = bundle;
  writeBundles(bundles);

  notifyPlanPurchased(key, planSlug);
  if (!hasCameraAlertOnce(key)) {
    notifyCamerasActivated(key, { withEffects: true });
  }
  return 'activated';
}

function hasCameraAlertOnce(email: string): boolean {
  return getCameraAlertsForEmail(email).length > 0;
}

/** Cuenta con plan previo: cámaras + alerta en campana sin sonido al recargar. */
export function syncUserPlanOnLogin(email: string): void {
  if (typeof window === 'undefined') return;
  if (!hasActiveUserPlan(email)) return;
  ensureCameraAlertsForActivePlan(normalizeEmail(email));
}

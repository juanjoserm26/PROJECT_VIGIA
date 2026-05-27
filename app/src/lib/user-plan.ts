import type { PlanSlug } from '@/lib/subscription-plans';
import { getDemoSession } from '@/lib/demo-session';
import { ensureCameraAlertsForActivePlan, notifyCamerasActivated } from '@/lib/camera-alerts';
import { notifyPlanAlreadyOwned, notifyPlanPurchased } from '@/lib/plan-notifications';

export const USER_PLAN_STORAGE_KEY = 'vigia_active_plans_v1';
export const USER_PLAN_CHANGED_EVENT = 'vigia-user-plan-changed';

export type ActiveUserPlan = {
  planSlug: PlanSlug;
  activatedAt: number;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function readPlans(): Record<string, ActiveUserPlan> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(USER_PLAN_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ActiveUserPlan>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writePlans(plans: Record<string, ActiveUserPlan>): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USER_PLAN_STORAGE_KEY, JSON.stringify(plans));
  window.dispatchEvent(new CustomEvent(USER_PLAN_CHANGED_EVENT));
}

export function hasActiveUserPlan(email: string): boolean {
  const plans = readPlans();
  return Boolean(plans[normalizeEmail(email)]);
}

export function getActiveUserPlan(email: string): ActiveUserPlan | null {
  const plans = readPlans();
  return plans[normalizeEmail(email)] ?? null;
}

export type ActivateUserPlanResult = 'activated' | 'already_owned' | 'no_session';

/** Tras comprar/simular checkout — solo con sesión activa. */
export function activateUserPlan(email: string, planSlug: PlanSlug): ActivateUserPlanResult {
  if (typeof window === 'undefined') return 'no_session';
  const session = getDemoSession();
  if (!session) return 'no_session';

  const key = normalizeEmail(email);
  const plans = readPlans();
  const current = plans[key];

  if (current?.planSlug === planSlug) {
    notifyPlanAlreadyOwned(key, planSlug);
    return 'already_owned';
  }

  plans[key] = { planSlug, activatedAt: Date.now() };
  writePlans(plans);

  notifyPlanPurchased(key, planSlug);
  notifyCamerasActivated(key, { withEffects: true });
  return 'activated';
}

/** Cuenta con plan previo: cámaras + alerta en campana sin sonido al recargar. */
export function syncUserPlanOnLogin(email: string): void {
  if (typeof window === 'undefined') return;
  if (!hasActiveUserPlan(email)) return;
  ensureCameraAlertsForActivePlan(normalizeEmail(email));
}

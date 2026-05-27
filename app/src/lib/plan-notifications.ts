import { getDemoSession } from '@/lib/demo-session';
import {
  checkoutSummaryFeatures,
  getMarketingPlan,
  type PlanSlug,
} from '@/lib/subscription-plans';

export const PLAN_NOTIFICATIONS_STORAGE_KEY = 'vigia_plan_notifications_v1';
export const PLAN_NOTIFICATIONS_UPDATED_EVENT = 'vigia-plan-notifications-updated';

export type PlanNotificationKind = 'purchase' | 'already_owned';

export type PlanNotification = {
  id: string;
  kind: PlanNotificationKind;
  planSlug: PlanSlug;
  planName: string;
  price: string;
  priceNote: string;
  summary: string[];
  message: string;
  read: boolean;
  createdAt: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function readStore(): Record<string, PlanNotification[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(PLAN_NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, PlanNotification[]>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, PlanNotification[]>): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PLAN_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(PLAN_NOTIFICATIONS_UPDATED_EVENT));
}

export function getPlanNotificationsForEmail(email: string): PlanNotification[] {
  return readStore()[normalizeEmail(email)] ?? [];
}

export function getUnreadPlanNotificationCount(email: string): number {
  return getPlanNotificationsForEmail(email).filter((n) => !n.read).length;
}

function buildSummary(slug: PlanSlug): string[] {
  return checkoutSummaryFeatures[slug] ?? [];
}

function pushNotification(
  email: string,
  notification: Omit<PlanNotification, 'id' | 'read' | 'createdAt'>,
): PlanNotification | null {
  if (typeof window === 'undefined') return null;
  const session = getDemoSession();
  if (!session) return null;

  const key = normalizeEmail(email);
  const store = readStore();
  const list = store[key] ?? [];

  const duplicate = list.find(
    (n) =>
      n.kind === notification.kind &&
      n.planSlug === notification.planSlug &&
      n.message === notification.message,
  );
  if (duplicate) return duplicate;

  const entry: PlanNotification = {
    ...notification,
    id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    read: false,
    createdAt: new Date().toISOString(),
  };

  store[key] = [entry, ...list].slice(0, 30);
  writeStore(store);
  return entry;
}

export function notifyPlanPurchased(email: string, planSlug: PlanSlug): PlanNotification | null {
  const plan = getMarketingPlan(planSlug);
  return pushNotification(email, {
    kind: 'purchase',
    planSlug,
    planName: plan.name,
    price: plan.price,
    priceNote: plan.priceNote,
    summary: buildSummary(planSlug),
    message: `Compraste el ${plan.name}`,
  });
}

export function notifyPlanAlreadyOwned(email: string, planSlug: PlanSlug): PlanNotification | null {
  const plan = getMarketingPlan(planSlug);
  return pushNotification(email, {
    kind: 'already_owned',
    planSlug,
    planName: plan.name,
    price: plan.price,
    priceNote: plan.priceNote,
    summary: buildSummary(planSlug),
    message: `Ya tienes activo el ${plan.name}`,
  });
}

export function markPlanNotificationsRead(email: string): void {
  const key = normalizeEmail(email);
  const store = readStore();
  const list = store[key];
  if (!list?.length) return;
  store[key] = list.map((n) => ({ ...n, read: true }));
  writeStore(store);
}

export function deletePlanNotification(email: string, id: string): void {
  const key = normalizeEmail(email);
  const store = readStore();
  const list = store[key];
  if (!list) return;
  store[key] = list.filter((n) => n.id !== id);
  writeStore(store);
}

export function clearPlanNotifications(email: string): void {
  const key = normalizeEmail(email);
  const store = readStore();
  if (!store[key]?.length) return;
  store[key] = [];
  writeStore(store);
}

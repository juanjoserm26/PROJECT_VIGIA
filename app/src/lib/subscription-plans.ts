export type PlanSlug = 'basico' | 'avanzado' | 'enterprise';

export interface MarketingPlan {
  slug: PlanSlug;
  name: string;
  description: string;
  price: string;
  priceNote: string;
  segment: string;
  features: string[];
  highlighted?: boolean;
}

/** Planes mostrados en la landing y en /plans — fuente única de precios y slugs. */
export const marketingPlans: MarketingPlan[] = [
  {
    slug: 'basico',
    name: 'Plan Básico',
    description: 'Pequeños comercios y tiendas',
    price: '$350.000',
    priceNote: 'COP / mes',
    segment: 'Monitoreo de hasta 4 cámaras',
    features: [
      'Conexión y análisis de hasta 4 de tus cámaras IP (ONVIF/RTSP)',
      'Detección básica: robos y atracos',
      'Notificaciones por email',
      'Panel web de visualización',
      'Soporte por correo (48h)',
      'Almacenamiento de eventos 30 días',
    ],
  },
  {
    slug: 'avanzado',
    name: 'Plan Avanzado',
    description: 'Conjuntos residenciales e instituciones educativas',
    price: '$950.000',
    priceNote: 'COP / mes',
    segment: 'Monitoreo de hasta 16 cámaras',
    features: [
      'Conexión y análisis de hasta 16 de tus cámaras IP (ONVIF/RTSP)',
      'Detección avanzada + análisis de patrones',
      'Alertas por email, WhatsApp y panel web',
      'Análisis histórico por zona y horario',
      'Soporte prioritario (24h)',
      'Almacenamiento de eventos 90 días',
      'Reportes mensuales automáticos',
    ],
    highlighted: true,
  },
  {
    slug: 'enterprise',
    name: 'Plan Enterprise',
    description: 'Fuerza pública, municipios, grandes empresas y redes con muchas cámaras',
    price: '$2.500.000+',
    priceNote: 'COP / mes',
    segment: 'Monitoreo de cámaras ilimitadas',
    features: [
      'Conexión sin límite a tus cámaras IP existentes',
      'Detección completa + reportes personalizados',
      'API de integración con sistemas del cliente',
      'Multicanal: email, WhatsApp, SMS, webhook',
      'Soporte dedicado 24/7 + SLA personalizado',
      'Almacenamiento ilimitado de eventos',
      'Facturación a 30 días',
      'Configuración on-premise opcional',
    ],
  },
];

/** Bullets cortos para el resumen lateral del checkout */
export const checkoutSummaryFeatures: Record<PlanSlug, string[]> = {
  basico: [
    'Hasta 4 cámaras',
    'Almacenamiento de eventos 30 días',
    'Soporte por correo (48h)',
  ],
  avanzado: [
    'Hasta 16 cámaras',
    'Almacenamiento de eventos 90 días',
    'Soporte prioritario (24h)',
    'Detección de IA avanzada',
  ],
  enterprise: [
    'Cámaras ilimitadas',
    'Almacenamiento ilimitado',
    'Soporte 24/7 + SLA',
    'Integraciones y API',
  ],
};

/**
 * Normaliza ?plan= de la URL (incluye slugs antiguos y variantes con guiones).
 */
export function normalizePlanSlug(raw: string | null | undefined): PlanSlug {
  if (!raw || raw.trim() === '') return 'avanzado';

  const s = raw
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, '-');

  const aliases: Record<string, PlanSlug> = {
    basico: 'basico',
    'plan-basico': 'basico',
    inicio: 'basico',
    avanzado: 'avanzado',
    'plan-avanzado': 'avanzado',
    profesional: 'avanzado',
    professional: 'avanzado',
    enterprise: 'enterprise',
    'plan-enterprise': 'enterprise',
    empresarial: 'enterprise',
  };

  return aliases[s] ?? 'avanzado';
}

export function getMarketingPlan(slug: PlanSlug): MarketingPlan {
  const found = marketingPlans.find((p) => p.slug === slug);
  return found ?? marketingPlans[1];
}

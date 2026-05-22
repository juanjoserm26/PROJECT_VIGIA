export type PqrsType = 'peticion' | 'queja' | 'reclamo' | 'sugerencia';

export const PQRS_TYPE_LABELS: Record<PqrsType, string> = {
  peticion: 'Petición',
  queja: 'Queja',
  reclamo: 'Reclamo',
  sugerencia: 'Sugerencia',
};

export const PQRS_CLASSIFICATION = 'PQRS — Atención al ciudadano';

export type PqrsSubmission = {
  id: string;
  tipo: PqrsType;
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  receivedAt: string;
  read: boolean;
};

export const PQRS_UPDATED_EVENT = 'vigia-pqrs-updated';

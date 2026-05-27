/**
 * Cuentas de demostración en localStorage (mismo navegador).
 * En producción esto iría a un backend con hash de contraseñas.
 */

export const USERS_STORAGE_KEY = 'vigia_registered_users';
export const GOOGLE_REMEMBER_KEY = 'vigia_google_remember_email';
export const GOOGLE_TRUSTED_KEY = 'vigia_google_trusted_device';

export type DocumentType = 'CC' | 'CE' | 'TI' | 'PA' | 'NIT';

export type StoredUser = {
  id: string;
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  telefono: string;
  celular: string;
  tipoDocumento: DocumentType;
  numeroDocumento: string;
  createdAt: number;
  /** Cuenta creada vía Google OAuth (no usa contraseña local en el login manual). */
  authProvider?: 'local' | 'google';
};

export type PublicStoredUser = Omit<StoredUser, 'password'>;

export type RegisterUserInput = Omit<StoredUser, 'id' | 'createdAt' | 'email' | 'password'> & {
  email: string;
  password: string;
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Solo dígitos, para detectar celular duplicado */
export function normalizeCelularForMatch(value: string): string {
  return value.replace(/\D/g, '');
}

/** Documento sin espacios extras (mayúsculas para comparar pasaportes/NIT) */
export function normalizeDocumentoForMatch(value: string): string {
  return value.trim().replace(/\s+/g, '').toUpperCase();
}

/** Todos los problemas de contraseña (para mostrar varios avisos a la vez en el registro) */
export function passwordValidationMessages(password: string): string[] {
  const m: string[] = [];
  if (password.length < 10) {
    m.push('La contraseña debe tener al menos 10 caracteres.');
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    m.push('Incluye al menos un carácter especial (!@#$…).');
  }
  return m;
}

export function validatePassword(password: string): string | null {
  const parts = passwordValidationMessages(password);
  return parts.length ? parts[0] : null;
}

function readUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function upsertUserInBrowserCache(user: StoredUser): void {
  const users = readUsers();
  const idx = users.findIndex((u) => u.email === user.email);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  writeUsers(users);
}

export function cacheUserFromPublic(publicUser: PublicStoredUser, password = ''): StoredUser {
  const user: StoredUser = { ...publicUser, password };
  upsertUserInBrowserCache(user);
  return user;
}

async function fetchUserFromServer(email: string): Promise<StoredUser | null> {
  try {
    const res = await fetch(`/api/users?email=${encodeURIComponent(normalizeEmail(email))}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { ok: boolean; user?: PublicStoredUser };
    if (!data.ok || !data.user) return null;
    return cacheUserFromPublic(data.user, '');
  } catch {
    return null;
  }
}

export function findUserByEmail(email: string): StoredUser | null {
  const key = normalizeEmail(email);
  return readUsers().find((u) => u.email === key) ?? null;
}

export async function findUserByEmailAsync(email: string): Promise<StoredUser | null> {
  const local = findUserByEmail(email);
  if (local) return local;
  return fetchUserFromServer(email);
}

function findUserByDocumentPair(tipo: DocumentType, numero: string): StoredUser | null {
  const n = normalizeDocumentoForMatch(numero);
  if (!n) return null;
  return (
    readUsers().find(
      (u) => u.tipoDocumento === tipo && normalizeDocumentoForMatch(u.numeroDocumento) === n,
    ) ?? null
  );
}

function findUserByCelularPhone(celular: string): StoredUser | null {
  const digits = normalizeCelularForMatch(celular);
  if (digits.length < 7) return null;
  return readUsers().find((u) => normalizeCelularForMatch(u.celular) === digits) ?? null;
}

/** Validación previa en cliente: correo válido y ya usado por otra cuenta */
export function isRegisteredEmail(rawEmail: string): boolean {
  const raw = rawEmail.trim();
  if (!raw) return false;
  const email = normalizeEmail(raw);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  return findUserByEmail(email) !== null;
}

export function isRegisteredCelular(raw: string): boolean {
  if (!raw.trim()) return false;
  return findUserByCelularPhone(raw) !== null;
}

export function isRegisteredDocument(tipo: DocumentType, raw: string): boolean {
  if (!raw.trim()) return false;
  return findUserByDocumentPair(tipo, raw) !== null;
}

export type RegisterFailureField =
  | 'email'
  | 'celular'
  | 'numeroDocumento'
  | 'password'
  | 'nombres'
  | 'apellidos'
  | 'fecha';

export function registerUser(
  input: RegisterUserInput
):
  | { ok: true; user: StoredUser }
  | { ok: false; error: string; field: RegisterFailureField } {
  if (!input.nombres.trim()) {
    return { ok: false, field: 'nombres', error: 'Completa este campo.' };
  }
  if (!input.apellidos.trim()) {
    return { ok: false, field: 'apellidos', error: 'Completa este campo.' };
  }
  if (!input.birthDay || !input.birthMonth || !input.birthYear) {
    return { ok: false, field: 'fecha', error: 'Completa tu fecha de nacimiento.' };
  }
  if (!input.celular.trim()) {
    return { ok: false, field: 'celular', error: 'Completa este campo.' };
  }
  if (!input.numeroDocumento.trim()) {
    return {
      ok: false,
      field: 'numeroDocumento',
      error: 'Completa este campo.',
    };
  }

  const rawEmail = input.email.trim();
  if (!rawEmail) {
    return { ok: false, field: 'email', error: 'Completa este campo.' };
  }
  const email = normalizeEmail(rawEmail);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, field: 'email', error: 'Ingresa un correo electrónico válido.' };
  }

  if (findUserByEmail(email)) {
    return {
      ok: false,
      field: 'email',
      error: 'Este correo ya está en uso. Digita otro para crear la cuenta o inicia sesión.',
    };
  }

  const pwdError = validatePassword(input.password);
  if (pwdError) return { ok: false, field: 'password', error: pwdError };

  if (findUserByCelularPhone(input.celular)) {
    return {
      ok: false,
      field: 'celular',
      error: 'Este número de celular ya está en uso. Digita otro para crear la cuenta.',
    };
  }

  if (findUserByDocumentPair(input.tipoDocumento, input.numeroDocumento)) {
    return {
      ok: false,
      field: 'numeroDocumento',
      error: 'Este número de documento ya está registrado. Digita otro para crear la cuenta.',
    };
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    email,
    password: input.password,
    nombres: input.nombres.trim(),
    apellidos: input.apellidos.trim(),
    birthDay: input.birthDay,
    birthMonth: input.birthMonth,
    birthYear: input.birthYear,
    telefono: input.telefono.trim(),
    celular: input.celular.trim(),
    tipoDocumento: input.tipoDocumento,
    numeroDocumento: input.numeroDocumento.trim(),
    createdAt: Date.now(),
    authProvider: 'local',
  };

  writeUsers([...readUsers(), user]);
  return { ok: true, user };
}

export async function registerUserAsync(
  input: RegisterUserInput,
): Promise<
  | { ok: true; user: StoredUser }
  | { ok: false; error: string; field: RegisterFailureField }
> {
  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (data.ok && data.user) {
      const user = cacheUserFromPublic(data.user as PublicStoredUser, input.password);
      return { ok: true, user };
    }
    if (!data.ok && data.field) {
      return { ok: false, error: data.error, field: data.field };
    }
  } catch {
    /* servidor no disponible: registro local */
  }
  return registerUser(input);
}

export async function authenticateUserAsync(
  email: string,
  password: string,
): Promise<{ ok: true; user: StoredUser } | { ok: false; error: string }> {
  const key = normalizeEmail(email);
  const localUser = findUserByEmail(key);
  const localResult = authenticateUser(email, password);

  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json()) as
      | { ok: true; user: PublicStoredUser }
      | { ok: false; error?: string };

    if (res.ok && data.ok && 'user' in data && data.user) {
      const user = cacheUserFromPublic(data.user, password);
      return { ok: true, user };
    }

    if (res.status === 401 && !data.ok && typeof data.error === 'string') {
      if (localResult.ok) return localResult;

      if (localUser) {
        return { ok: false, error: 'Contraseña incorrecta. Verifica e intenta de nuevo.' };
      }

      try {
        const lookup = await fetch(`/api/users?email=${encodeURIComponent(key)}`);
        if (lookup.ok) {
          const lookupData = (await lookup.json()) as { ok?: boolean; user?: PublicStoredUser };
          if (lookupData.ok && lookupData.user) {
            return { ok: false, error: 'Contraseña incorrecta. Verifica e intenta de nuevo.' };
          }
        }
      } catch {
        /* ignore */
      }

      return { ok: false, error: data.error };
    }
  } catch {
    /* servidor no disponible */
  }

  return localResult;
}

export function authenticateUser(
  email: string,
  password: string
): { ok: true; user: StoredUser } | { ok: false; error: string } {
  const key = normalizeEmail(email);
  if (!key) return { ok: false, error: 'Ingresa tu correo electrónico.' };

  const user = findUserByEmail(key);
  if (!user) {
    return { ok: false, error: 'No hay cuenta con este correo. Crea una cuenta primero.' };
  }
  if (user.password !== password) {
    return { ok: false, error: 'Contraseña incorrecta. Verifica e intenta de nuevo.' };
  }
  return { ok: true, user };
}

export function getGoogleRememberedEmail(): string | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(GOOGLE_REMEMBER_KEY);
  return v?.trim() || null;
}

export function setGoogleRememberedEmail(email: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(GOOGLE_REMEMBER_KEY, normalizeEmail(email));
}

export function clearGoogleRememberedEmail(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(GOOGLE_REMEMBER_KEY);
  window.localStorage.removeItem(GOOGLE_TRUSTED_KEY);
}

export function isGoogleTrustedOnDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(GOOGLE_TRUSTED_KEY) === '1';
}

export function setGoogleTrustedOnDevice(trusted: boolean): void {
  if (typeof window === 'undefined') return;
  if (trusted) {
    window.localStorage.setItem(GOOGLE_TRUSTED_KEY, '1');
  } else {
    window.localStorage.removeItem(GOOGLE_TRUSTED_KEY);
  }
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  CC: 'Cédula de ciudadanía',
  CE: 'Cédula de extranjería',
  TI: 'Tarjeta de identidad',
  PA: 'Pasaporte',
  NIT: 'NIT',
};

export const DOCUMENT_TYPE_OPTIONS = Object.entries(DOCUMENT_TYPE_LABELS) as [DocumentType, string][];

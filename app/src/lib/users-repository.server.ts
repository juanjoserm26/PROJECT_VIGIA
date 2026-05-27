import { promises as fs } from 'fs';
import path from 'path';
import { getServerDataDir } from '@/lib/server-data-path';
import type {
  DocumentType,
  PublicStoredUser,
  RegisterUserInput,
  StoredUser,
} from '@/lib/user-store';
import {
  normalizeCelularForMatch,
  normalizeDocumentoForMatch,
  normalizeEmail,
  validatePassword,
} from '@/lib/user-store';

const DATA_DIR = getServerDataDir();
const USERS_FILE = path.join(DATA_DIR, 'vigia-users.json');

export function toPublicUser(user: StoredUser): PublicStoredUser {
  const { password: _p, ...rest } = user;
  return rest;
}

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, '[]', 'utf8');
  }
}

export async function readUsersServer(): Promise<StoredUser[]> {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf8');
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUsersServer(users: StoredUser[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

export async function findUserByEmailServer(email: string): Promise<StoredUser | null> {
  const key = normalizeEmail(email);
  const users = await readUsersServer();
  return users.find((u) => u.email === key) ?? null;
}

function findUserByDocumentPairServer(
  users: StoredUser[],
  tipo: DocumentType,
  numero: string,
): StoredUser | null {
  const n = normalizeDocumentoForMatch(numero);
  if (!n) return null;
  return (
    users.find(
      (u) => u.tipoDocumento === tipo && normalizeDocumentoForMatch(u.numeroDocumento) === n,
    ) ?? null
  );
}

function findUserByCelularServer(users: StoredUser[], celular: string): StoredUser | null {
  const digits = normalizeCelularForMatch(celular);
  if (digits.length < 7) return null;
  return users.find((u) => normalizeCelularForMatch(u.celular) === digits) ?? null;
}

export async function registerUserServer(
  input: RegisterUserInput,
): Promise<
  | { ok: true; user: StoredUser }
  | { ok: false; error: string; field: 'email' | 'celular' | 'numeroDocumento' | 'password' | 'nombres' | 'apellidos' | 'fecha' }
> {
  const users = await readUsersServer();
  const email = normalizeEmail(input.email.trim());
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, field: 'email', error: 'Ingresa un correo electrónico válido.' };
  }
  if (users.some((u) => u.email === email)) {
    return {
      ok: false,
      field: 'email',
      error: 'Este correo ya está en uso. Digita otro para crear la cuenta o inicia sesión.',
    };
  }
  const pwdError = validatePassword(input.password);
  if (pwdError) return { ok: false, field: 'password', error: pwdError };
  if (findUserByCelularServer(users, input.celular)) {
    return {
      ok: false,
      field: 'celular',
      error: 'Este número de celular ya está en uso. Digita otro para crear la cuenta.',
    };
  }
  if (findUserByDocumentPairServer(users, input.tipoDocumento, input.numeroDocumento)) {
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

  await writeUsersServer([...users, user]);
  return { ok: true, user };
}

export async function updateUserPasswordServer(
  email: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = normalizeEmail(email);
  if (!key) return { ok: false, error: 'Ingresa tu correo electrónico.' };
  const pwdError = validatePassword(newPassword);
  if (pwdError) return { ok: false, error: pwdError };

  const users = await readUsersServer();
  const idx = users.findIndex((u) => u.email === key);
  if (idx < 0) {
    return { ok: false, error: 'No hay cuenta con este correo. Crea una cuenta primero.' };
  }
  if (users[idx]!.authProvider === 'google') {
    return {
      ok: false,
      error: 'Esta cuenta usa Google. Inicia sesión con el botón de Google.',
    };
  }

  users[idx] = { ...users[idx]!, password: newPassword };
  await writeUsersServer(users);
  return { ok: true };
}

export async function authenticateUserServer(
  email: string,
  password: string,
): Promise<{ ok: true; user: StoredUser } | { ok: false; error: string }> {
  const key = normalizeEmail(email);
  if (!key) return { ok: false, error: 'Ingresa tu correo electrónico.' };
  const user = await findUserByEmailServer(key);
  if (!user || user.password !== password) {
    return {
      ok: false,
      error: 'Correo y/o contraseña incorrectos. Verifica los datos e intenta de nuevo.',
    };
  }
  return { ok: true, user };
}

export async function findOrCreateUserFromGoogleServer(
  email: string,
  displayName: string,
): Promise<StoredUser> {
  const key = normalizeEmail(email);
  const existing = await findUserByEmailServer(key);
  if (existing) return existing;

  const users = await readUsersServer();
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  const nombres = parts[0] ?? 'Usuario';
  const apellidos = parts.length > 1 ? parts.slice(1).join(' ') : 'VIGIA';
  const stamp = Date.now().toString(36);

  const user: StoredUser = {
    id: crypto.randomUUID(),
    email: key,
    password: `google-oauth:${crypto.randomUUID()}`,
    nombres,
    apellidos,
    birthDay: '01',
    birthMonth: '01',
    birthYear: '1990',
    telefono: '',
    celular: `300${stamp.replace(/\D/g, '').slice(0, 7).padEnd(7, '0')}`.slice(0, 10),
    tipoDocumento: 'CC',
    numeroDocumento: `G-${stamp.toUpperCase()}`,
    createdAt: Date.now(),
    authProvider: 'google',
  };

  await writeUsersServer([...users, user]);
  return user;
}

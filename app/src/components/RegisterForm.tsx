'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { type ReactNode, useMemo, useState } from 'react';
import PasswordField, { authInputClass } from '@/components/PasswordField';
import { buildSessionForUser } from '@/components/GoogleSignInPanel';
import { getSafeInternalRedirect } from '@/lib/auth-redirect';
import { setDemoSession } from '@/lib/demo-session';
import {
  DOCUMENT_TYPE_OPTIONS,
  type DocumentType,
  type RegisterFailureField,
  isRegisteredCelular,
  isRegisteredDocument,
  isRegisteredEmail,
  normalizeEmail,
  passwordValidationMessages,
  registerUserAsync,
} from '@/lib/user-store';

const MONTHS = [
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1940 + 1 }, (_, i) => String(currentYear - i));
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

const selectClass = `${authInputClass} appearance-none`;

function parseBirthDate(day: string, month: string, year: string): Date | null {
  const d = Number.parseInt(day, 10);
  const m = Number.parseInt(month, 10);
  const y = Number.parseInt(year, 10);
  if (!day || !month || !year || Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(y)) return null;
  const birth = new Date(y, m - 1, d);
  if (birth.getFullYear() !== y || birth.getMonth() !== m - 1 || birth.getDate() !== d) return null;
  return birth;
}

function ageYears(birth: Date, ref = new Date()): number {
  let age = ref.getFullYear() - birth.getFullYear();
  const mdiff = ref.getMonth() - birth.getMonth();
  if (mdiff < 0 || (mdiff === 0 && ref.getDate() < birth.getDate())) age--;
  return age;
}

/** Mensaje si falta mayoría de edad (18+) o la fecha es inválida (con día/mes/año elegidos) */
function birthDateFeedback(day: string, month: string, year: string): string | null {
  if (!day || !month || !year) return null;
  const birth = parseBirthDate(day, month, year);
  if (!birth) return 'Selecciona una fecha de nacimiento válida.';
  if (ageYears(birth) < 18) return 'Debes ser mayor de edad (18 años o más) para crear una cuenta.';
  return null;
}

/** Rojo: solo correo inválido/d repetido, celular repetido, documento repetido */
function buildRegisterValidationSplit(p: {
  nombres: string;
  apellidos: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  celular: string;
  email: string;
  numeroDocumento: string;
  password: string;
  tipoDocumento: DocumentType;
}): {
  red: Partial<Record<RegisterFailureField, string>>;
  warn: Partial<Record<RegisterFailureField, string>>;
} {
  const red: Partial<Record<RegisterFailureField, string>> = {};
  const warn: Partial<Record<RegisterFailureField, string>> = {};

  if (!p.nombres.trim()) warn.nombres = 'Completa este campo.';
  if (!p.apellidos.trim()) warn.apellidos = 'Completa este campo.';
  if (!p.birthDay || !p.birthMonth || !p.birthYear) {
    warn.fecha = 'Completa tu fecha de nacimiento.';
  } else {
    const bd = birthDateFeedback(p.birthDay, p.birthMonth, p.birthYear);
    if (bd) warn.fecha = bd;
  }

  if (!p.celular.trim()) warn.celular = 'Completa este campo.';
  else if (isRegisteredCelular(p.celular)) {
    red.celular = 'Este número de celular ya está en uso. Digita otro para crear la cuenta.';
  }

  const raw = p.email.trim();
  if (!raw) warn.email = 'Completa este campo.';
  else {
    const em = normalizeEmail(raw);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      red.email = 'Ingresa un correo electrónico válido.';
    } else if (isRegisteredEmail(raw)) {
      red.email =
        'Este correo ya está en uso. Digita otro para crear la cuenta o inicia sesión.';
    }
  }

  if (!p.numeroDocumento.trim()) warn.numeroDocumento = 'Completa este campo.';
  else if (isRegisteredDocument(p.tipoDocumento, p.numeroDocumento)) {
    red.numeroDocumento =
      'Este número de documento ya está registrado. Digita otro para crear la cuenta.';
  }

  const pw = passwordValidationMessages(p.password);
  if (pw.length) warn.password = pw.join(' ');

  return { red, warn };
}

const fieldAlertClass =
  'mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium leading-snug text-red-900 sm:text-[0.9375rem]';

function OrangeInlineHint({ children }: { children: ReactNode }) {
  return (
    <div
      className="mt-2 flex items-start gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.12)]"
      role="status"
    >
      <span
        className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded bg-amber-500 text-[13px] font-bold leading-none text-white shadow-sm"
        aria-hidden
      >
        !
      </span>
      <span className="min-w-0 leading-snug pt-0.5">{children}</span>
    </div>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectAfter = useMemo(
    () => getSafeInternalRedirect(searchParams.get('redirect')) ?? '/',
    [searchParams],
  );
  const loginHref = useMemo(() => {
    const r = getSafeInternalRedirect(searchParams.get('redirect'));
    return r ? `/iniciar-sesion?redirect=${encodeURIComponent(r)}` : '/iniciar-sesion';
  }, [searchParams]);

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [telefono, setTelefono] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState<DocumentType>('CC');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<RegisterFailureField, string>>>(
    {},
  );
  const [fieldWarnings, setFieldWarnings] = useState<
    Partial<Record<RegisterFailureField, string>>
  >({});
  const [busy, setBusy] = useState(false);

  function clearFieldError(field: RegisterFailureField) {
    setFieldErrors((prev) => {
      if (prev[field] === undefined) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function clearFieldWarning(field: RegisterFailureField) {
    setFieldWarnings((prev) => {
      if (prev[field] === undefined) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function clearFieldMessages(field: RegisterFailureField) {
    clearFieldError(field);
    clearFieldWarning(field);
  }

  const fechaLiveWarn =
    birthDay && birthMonth && birthYear
      ? birthDateFeedback(birthDay, birthMonth, birthYear)
      : null;
  /** Tras blur/envío puede quedar mensaje de “completa”; con trippleta completa mostramos inválida/menor en vivo */
  const fechaDisplayWarn = fieldWarnings.fecha ?? fechaLiveWarn;

  /** Solo advertencias ámbar al salir del campo; los mensajes rojos solo tras «Crear cuenta» y hasta que corrijan el valor. */
  function validateEmailOnBlur(rawEmail: string) {
    const raw = rawEmail.trim();
    if (!raw) {
      setFieldWarnings((w) => ({ ...w, email: 'Completa este campo.' }));
      return;
    }
    const em = normalizeEmail(raw);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setFieldWarnings((w) => ({
        ...w,
        email: 'Revisa que el correo tenga un formato válido (ejemplo@correo.com).',
      }));
      return;
    }
    clearFieldWarning('email');
  }

  function validateCelularOnBlur(raw: string) {
    if (!raw.trim()) {
      setFieldWarnings((w) => ({ ...w, celular: 'Completa este campo.' }));
      return;
    }
    clearFieldWarning('celular');
  }

  function validateDocumentoOnBlur(raw: string) {
    if (!raw.trim()) {
      setFieldWarnings((w) => ({ ...w, numeroDocumento: 'Completa este campo.' }));
      return;
    }
    clearFieldWarning('numeroDocumento');
  }

  function validatePasswordOnBlur() {
    const msgs = passwordValidationMessages(password);
    if (msgs.length) {
      setFieldWarnings((w) => ({ ...w, password: msgs.join(' ') }));
    } else {
      clearFieldWarning('password');
    }
  }

  function onFechaSectionBlur(e: React.FocusEvent<HTMLDivElement>) {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;

    if (!birthDay || !birthMonth || !birthYear) {
      setFieldWarnings((w) => ({ ...w, fecha: 'Completa tu fecha de nacimiento.' }));
      return;
    }
    const bd = birthDateFeedback(birthDay, birthMonth, birthYear);
    if (bd) setFieldWarnings((w) => ({ ...w, fecha: bd }));
    else clearFieldWarning('fecha');
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setFieldWarnings({});

    const { red, warn } = buildRegisterValidationSplit({
      nombres,
      apellidos,
      birthDay,
      birthMonth,
      birthYear,
      celular,
      email,
      numeroDocumento,
      password,
      tipoDocumento,
    });

    if (Object.keys(red).length > 0 || Object.keys(warn).length > 0) {
      setFieldErrors(red);
      setFieldWarnings(warn);
      return;
    }

    setBusy(true);

    const result = await registerUserAsync({
      nombres,
      apellidos,
      birthDay,
      birthMonth,
      birthYear,
      telefono,
      celular,
      email,
      tipoDocumento,
      numeroDocumento,
      password,
    });

    if (!result.ok) {
      const { field, error } = result;
      const dupCelular = field === 'celular' && error.includes('ya está');
      const dupDoc = field === 'numeroDocumento' && error.includes('registrado');

      if (field === 'email' || dupCelular || dupDoc) {
        setFieldErrors({ [field]: error });
      } else {
        setFieldWarnings({ [field]: error });
      }
      setBusy(false);
      return;
    }

    const session = buildSessionForUser(result.user, false);
    setDemoSession(session);
    router.push(redirectAfter);
    router.refresh();
  }

  return (
    <div className="w-full max-w-xl rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl shadow-black/40 ring-1 ring-white/30 backdrop-blur-md sm:p-8">
      <h2 className="mb-6 text-xl font-bold text-slate-900">Completa tus datos</h2>
      <form
        id="register-form-scroll"
        noValidate
        onSubmit={onSubmit}
        className="max-h-[min(70vh,720px)] space-y-4 overflow-y-auto pr-1"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="reg-nombres" className="mb-2 block text-sm font-semibold text-slate-800">
              Nombres
            </label>
            <input
              id="reg-nombres"
              value={nombres}
              onChange={(e) => {
                setNombres(e.target.value);
                clearFieldWarning('nombres');
              }}
              onBlur={() => {
                if (!nombres.trim()) {
                  setFieldWarnings((w) => ({ ...w, nombres: 'Completa este campo.' }));
                }
              }}
              className={authInputClass}
              placeholder="Nombre"
              autoComplete="given-name"
            />
            {fieldWarnings.nombres ? (
              <OrangeInlineHint>{fieldWarnings.nombres}</OrangeInlineHint>
            ) : null}
          </div>
          <div>
            <label htmlFor="reg-apellidos" className="mb-2 block text-sm font-semibold text-slate-800">
              Apellidos
            </label>
            <input
              id="reg-apellidos"
              value={apellidos}
              onChange={(e) => {
                setApellidos(e.target.value);
                clearFieldWarning('apellidos');
              }}
              onBlur={() => {
                if (!apellidos.trim()) {
                  setFieldWarnings((w) => ({ ...w, apellidos: 'Completa este campo.' }));
                }
              }}
              className={authInputClass}
              placeholder="Apellido"
              autoComplete="family-name"
            />
            {fieldWarnings.apellidos ? (
              <OrangeInlineHint>{fieldWarnings.apellidos}</OrangeInlineHint>
            ) : null}
          </div>
        </div>

        <div onBlur={onFechaSectionBlur}>
          <span className="mb-2 block text-sm font-semibold text-slate-800">Fecha de nacimiento</span>
          <div className="grid grid-cols-3 gap-2">
            <select
              id="reg-day"
              value={birthDay}
              onChange={(e) => {
                setBirthDay(e.target.value);
                clearFieldWarning('fecha');
              }}
              className={selectClass}
              aria-label="Día"
            >
              <option value="">Día</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              id="reg-month"
              value={birthMonth}
              onChange={(e) => {
                setBirthMonth(e.target.value);
                clearFieldWarning('fecha');
              }}
              className={selectClass}
              aria-label="Mes"
            >
              <option value="">Mes</option>
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              id="reg-year"
              value={birthYear}
              onChange={(e) => {
                setBirthYear(e.target.value);
                clearFieldWarning('fecha');
              }}
              className={selectClass}
              aria-label="Año"
            >
              <option value="">Año</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          {fechaDisplayWarn ? (
            <OrangeInlineHint>{fechaDisplayWarn}</OrangeInlineHint>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="reg-telefono" className="mb-2 block text-sm font-semibold text-slate-800">
              Teléfono <span className="font-normal text-slate-500">(opcional)</span>
            </label>
            <input
              id="reg-telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={authInputClass}
              placeholder="Teléfono fijo"
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="reg-celular" className="mb-2 block text-sm font-semibold text-slate-800">
              Celular
            </label>
            <input
              id="reg-celular"
              type="tel"
              value={celular}
              onChange={(e) => {
                setCelular(e.target.value);
                clearFieldMessages('celular');
              }}
              onBlur={() => validateCelularOnBlur(celular)}
              className={authInputClass}
              placeholder="Celular"
              autoComplete="tel-national"
            />
            {fieldErrors.celular ? (
              <p className={fieldAlertClass} role="alert">
                {fieldErrors.celular}
              </p>
            ) : fieldWarnings.celular ? (
              <OrangeInlineHint>{fieldWarnings.celular}</OrangeInlineHint>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="reg-email" className="mb-2 block text-sm font-semibold text-slate-800">
            Correo electrónico
          </label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldMessages('email');
            }}
            onBlur={() => validateEmailOnBlur(email)}
            className={authInputClass}
            placeholder="correo@ejemplo.com"
            autoComplete="email"
          />
          {fieldErrors.email ? (
            <p className={fieldAlertClass} role="alert">
              {fieldErrors.email}
            </p>
          ) : fieldWarnings.email ? (
            <OrangeInlineHint>{fieldWarnings.email}</OrangeInlineHint>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="reg-tipo-doc" className="mb-2 block text-sm font-semibold text-slate-800">
              Tipo de documento
            </label>
            <select
              id="reg-tipo-doc"
              value={tipoDocumento}
              onChange={(e) => {
                setTipoDocumento(e.target.value as DocumentType);
                clearFieldMessages('numeroDocumento');
              }}
              className={selectClass}
            >
              {DOCUMENT_TYPE_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="reg-num-doc" className="mb-2 block text-sm font-semibold text-slate-800">
              Número de documento
            </label>
            <input
              id="reg-num-doc"
              value={numeroDocumento}
              onChange={(e) => {
                setNumeroDocumento(e.target.value);
                clearFieldMessages('numeroDocumento');
              }}
              onBlur={() => validateDocumentoOnBlur(numeroDocumento)}
              className={authInputClass}
              placeholder="Sin puntos ni espacios"
            />
            {fieldErrors.numeroDocumento ? (
              <p className={fieldAlertClass} role="alert">
                {fieldErrors.numeroDocumento}
              </p>
            ) : fieldWarnings.numeroDocumento ? (
              <OrangeInlineHint>{fieldWarnings.numeroDocumento}</OrangeInlineHint>
            ) : null}
          </div>
        </div>

        <PasswordField
          id="reg-password"
          label="Contraseña"
          value={password}
          onChange={(v) => {
            setPassword(v);
            clearFieldWarning('password');
          }}
          autoComplete="new-password"
          minLength={10}
          nativeRequired={false}
          nativeMinLength={false}
          errorMessage={null}
          warningMessage={fieldWarnings.password ?? null}
          onBlurField={validatePasswordOnBlur}
        />

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-blue-600 py-3.5 text-center text-base font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-60"
        >
          Crear cuenta
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        ¿Ya tienes cuenta?{' '}
        <Link href={loginHref} className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
          Ingresa
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-slate-500">
        Tus datos se guardan solo en este navegador.
      </p>
    </div>
  );
}

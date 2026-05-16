'use client';

import { useState } from 'react';

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

export const authInputClass =
  'w-full rounded-lg border border-slate-300 bg-slate-50/50 px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200/80';

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  errorMessage?: string | null;
  /** Advertencia tipo tooltip (icono ámbar); solo si no hay errorMessage */
  warningMessage?: string | null;
  /** Se llama al salir del campo (evita disparar al pasar al botón del ojo) */
  onBlurField?: () => void;
  /** Si es false, no usa validación HTML5 (útil con form noValidate + mensajes propios) */
  nativeRequired?: boolean;
  nativeMinLength?: boolean;
};

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = 'Mínimo 10 caracteres e incluye 1 carácter especial',
  autoComplete = 'current-password',
  minLength = 10,
  errorMessage,
  warningMessage,
  onBlurField,
  nativeRequired = true,
  nativeMinLength = true,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  const orangeHint =
    !errorMessage && warningMessage ? (
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
        <span className="min-w-0 leading-snug pt-0.5">{warningMessage}</span>
      </div>
    ) : null;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <div className="password-field-wrap relative" id={`${id}-pw-wrap`}>
        <input
          id={id}
          name={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            if (!onBlurField) return;
            window.setTimeout(() => {
              const wrap = document.getElementById(`${id}-pw-wrap`);
              const ae = document.activeElement;
              if (wrap && ae && wrap.contains(ae)) return;
              onBlurField();
            }, 0);
          }}
          minLength={nativeMinLength ? minLength : undefined}
          className={`${authInputClass} pr-12`}
          placeholder={placeholder}
          required={nativeRequired}
        />
        <button
          type="button"
          className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <EyeIcon open={show} />
        </button>
      </div>
      {errorMessage ? (
        <p
          className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium leading-snug text-red-900 sm:text-[0.9375rem]"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}
      {orangeHint}
    </div>
  );
}

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  id: string;
}

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id">, FieldProps {}

export function Input({ label, hint, error, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-[7px]">
      <label htmlFor={id} className="text-xs font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`h-12 w-full rounded-md border bg-white px-3.5 text-sm text-ink outline-none placeholder:text-line focus:border-2 focus:border-matcha disabled:bg-[#fcf6df] disabled:text-line ${error ? "border-error" : "border-line"} ${className}`}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-[11px] text-error">
          {error}
        </p>
      ) : null}
      {!error && hint ? (
        <p id={`${id}-hint`} className="text-[11px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">, FieldProps {}

export function TextArea({ label, hint, error, id, className = "", ...props }: TextAreaProps) {
  return (
    <div className="flex w-full flex-col gap-[7px]">
      <label htmlFor={id} className="text-xs font-semibold text-ink">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        className={`min-h-12 w-full rounded-md border bg-white px-3.5 py-3 text-sm text-ink outline-none focus:border-2 focus:border-matcha ${error ? "border-error" : "border-line"} ${className}`}
        {...props}
      />
      {error ? <p className="text-[11px] text-error">{error}</p> : null}
      {!error && hint ? <p className="text-[11px] text-muted">{hint}</p> : null}
    </div>
  );
}

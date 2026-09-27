import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: Option[];
  error?: string;
}

export function Select({ label, id, options, error, className = "", ...props }: SelectProps) {
  return (
    <div className="flex w-full flex-col gap-[7px]">
      <label htmlFor={id} className="text-xs font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={`h-12 w-full appearance-none rounded-md border bg-white px-3.5 pr-10 text-sm text-ink outline-none focus:border-2 focus:border-matcha ${error ? "border-error" : "border-line"} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink" aria-hidden />
      </div>
      {error ? <p className="text-[11px] text-error">{error}</p> : null}
    </div>
  );
}

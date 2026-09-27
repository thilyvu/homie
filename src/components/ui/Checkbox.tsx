import { Check } from "lucide-react";

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export function Checkbox({ id, checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label htmlFor={id} className={`flex items-start gap-3 text-xs leading-relaxed text-ink ${disabled ? "opacity-50" : "cursor-pointer"}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span className="mt-0.5 flex size-[22px] shrink-0 items-center justify-center border border-line bg-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-matcha peer-checked:border-matcha peer-checked:bg-matcha">
        {checked ? <Check className="size-3.5 text-white" aria-hidden /> : null}
      </span>
      <span>{label}</span>
    </label>
  );
}

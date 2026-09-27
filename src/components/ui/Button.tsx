import { ArrowRight, LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "danger" | "light";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  withArrow?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-matcha-deep text-white border-transparent hover:bg-[#6d2b16]",
  outline: "bg-paper text-matcha-deep border-matcha hover:bg-cream",
  ghost: "bg-transparent text-matcha border-transparent hover:underline",
  danger: "bg-error text-white border-transparent hover:bg-[#a83226]",
  light: "bg-white text-matcha-deep border-cms-line hover:bg-cms-bg",
};

export function Button({
  variant = "primary",
  withArrow = false,
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-[3px] border px-5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-line disabled:text-white ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {isLoading ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : null}
      {children}
      {withArrow && !isLoading ? <ArrowRight className="size-[15px]" aria-hidden /> : null}
    </button>
  );
}

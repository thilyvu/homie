import { BOOKING_STEPS } from "@/data/catalog";
import type { Locale } from "@/types";

interface StepIndicatorProps {
  current: number;
  locale: Locale;
}

export function StepIndicator({ current, locale }: StepIndicatorProps) {
  return (
    <ol className="flex w-full gap-2.5">
      {BOOKING_STEPS.map((step) => {
        const done = step.id <= current;
        return (
          <li key={step.id} className="flex min-w-0 flex-1 flex-col gap-[7px]" aria-current={step.id === current ? "step" : undefined}>
            <span className={`h-[3px] w-full ${done ? "bg-matcha" : "bg-line"}`} />
            <span className={`truncate text-[11px] ${done ? "text-matcha" : "text-muted"} ${step.id === current ? "font-bold" : "font-medium"}`}>
              {step.id} · {locale === "vi" ? step.vi : step.en}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

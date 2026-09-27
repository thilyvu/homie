"use client";

import { TIME_GROUPS, UNAVAILABLE_TIMES } from "@/data/catalog";
import type { Locale } from "@/types";

interface TimeSlotProps {
  value: string;
  onChange: (time: string) => void;
  locale: Locale;
  isLoading?: boolean;
}

export function TimeSlot({ value, onChange, locale, isLoading }: TimeSlotProps) {
  if (isLoading) {
    return (
      <p className="bg-warn-bg p-4 text-[13px] font-bold text-matcha" role="status">
        {locale === "vi" ? "Đang tải khung giờ" : "Loading time slots"}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {TIME_GROUPS.map((group) => (
        <div key={group.id} className="flex flex-col gap-2.5">
          <p className="text-xs font-bold text-black">{locale === "vi" ? group.labelVi : group.labelEn}</p>
          <div className="flex flex-wrap gap-2">
            {group.slots.map((slot) => {
              const unavailable = UNAVAILABLE_TIMES.includes(slot);
              const selected = slot === value;
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={unavailable}
                  aria-pressed={selected}
                  onClick={() => onChange(slot)}
                  className={`flex h-11 w-24 items-center justify-center border text-[13px] ${
                    unavailable
                      ? "border-line bg-cream text-line line-through"
                      : selected
                        ? "border-line bg-matcha text-white"
                        : "border-line bg-white text-ink hover:border-matcha"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

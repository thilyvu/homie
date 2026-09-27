"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { CLOSED_DATES } from "@/data/catalog";
import { monthTitle, toIso, weekdayChip } from "@/lib/format";
import type { Locale } from "@/types";

interface DatePickerProps {
  year: number;
  month: number;
  selected: string;
  onSelect: (iso: string) => void;
  onMonth: (year: number, month: number) => void;
  locale: Locale;
}

export function DatePicker({ year, month, selected, onSelect, onMonth, locale }: DatePickerProps) {
  const days = new Date(year, month, 0).getDate();
  const dates = Array.from({ length: days }, (_, index) => toIso(new Date(year, month - 1, index + 1)));

  const shift = (delta: number) => {
    const next = new Date(year, month - 1 + delta, 1);
    onMonth(next.getFullYear(), next.getMonth() + 1);
  };

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex items-center justify-between">
        <button type="button" aria-label={locale === "vi" ? "Tháng trước" : "Previous month"} onClick={() => shift(-1)} className="p-1">
          <ChevronLeft className="size-[18px]" />
        </button>
        <p className="font-serif text-xl font-semibold text-black">{monthTitle(year, month, locale)}</p>
        <button type="button" aria-label={locale === "vi" ? "Tháng sau" : "Next month"} onClick={() => shift(1)} className="p-1">
          <ChevronRight className="size-[18px]" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {dates.map((iso) => {
          const closed = CLOSED_DATES.includes(iso);
          const isSelected = iso === selected;
          return (
            <button
              key={iso}
              type="button"
              disabled={closed}
              aria-pressed={isSelected}
              onClick={() => onSelect(iso)}
              className={`flex h-[60px] w-[72px] items-center justify-center border text-xs ${
                closed
                  ? "border-line bg-cream text-line line-through"
                  : isSelected
                    ? "border-line bg-matcha text-white"
                    : "border-line bg-white text-ink hover:border-matcha"
              }`}
            >
              {weekdayChip(iso)}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-muted">07/10 · Đóng cửa bảo trì thiết bị</p>
    </div>
  );
}

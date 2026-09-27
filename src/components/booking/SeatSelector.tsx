"use client";

import { Check, Circle, X } from "lucide-react";
import { AREAS } from "@/data/catalog";
import type { Locale, Seat } from "@/types";

interface SeatSelectorProps {
  areaId: string;
  seatId: string;
  seats: Seat[];
  onArea: (areaId: string) => void;
  onSeat: (seatId: string) => void;
  locale: Locale;
  notice?: { title: string; body: string };
}

export function SeatSelector({ areaId, seatId, seats, onArea, onSeat, locale, notice }: SeatSelectorProps) {
  const visible = seats.filter((seat) => seat.areaId === areaId);
  const counter = areaId === "bar" ? (locale === "vi" ? "QUẦY PHA TRÀ" : "TEA COUNTER") : locale === "vi" ? "KHU NGỒI" : "SEATING";

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={locale === "vi" ? "Khu vực" : "Area"}>
        {AREAS.map((area) => {
          const active = area.id === areaId;
          return (
            <button
              key={area.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onArea(area.id)}
              className={`border px-[13px] py-[9px] text-xs ${active ? "border-line bg-matcha text-white" : "border-line bg-white text-ink"}`}
            >
              {locale === "vi" ? area.nameVi : area.nameEn}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col items-center gap-6 bg-cream p-7">
        <div className="flex h-12 w-full items-center justify-center bg-sand">
          <p className="text-[11px] font-bold tracking-[2px] text-black">{counter}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-7">
          {visible.map((seat) => {
            const selected = seat.id === seatId && seat.state !== "unavailable";
            const unavailable = seat.state === "unavailable";
            return (
              <button
                key={seat.id}
                type="button"
                aria-pressed={selected}
                aria-disabled={unavailable}
                onClick={() => onSeat(seat.id)}
                className={`flex size-[58px] flex-col items-center justify-center gap-0.5 border ${
                  selected
                    ? "border-2 border-matcha bg-matcha text-white"
                    : unavailable
                      ? "border-line bg-white text-ink"
                      : "border-matcha bg-paper text-ink"
                }`}
              >
                {selected ? <Check className="size-[15px]" aria-hidden /> : null}
                {unavailable ? <X className="size-[15px]" aria-hidden /> : null}
                {!selected && !unavailable ? <Circle className="size-[15px]" aria-hidden /> : null}
                <span className="text-[11px] font-bold">{seat.id}</span>
                <span className="sr-only">
                  {selected ? (locale === "vi" ? "đang chọn" : "selected") : unavailable ? (locale === "vi" ? "không khả dụng" : "unavailable") : locale === "vi" ? "trống" : "open"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {notice ? (
        <div className="flex gap-3 bg-error-bg p-4" role="alert">
          <span>
            <span className="block text-[13px] font-bold text-error">{notice.title}</span>
            <span className="mt-1 block text-xs text-error">{notice.body}</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}

import { AREAS } from "@/data/catalog";
import { formatLongDate } from "@/lib/format";
import type { Locale } from "@/types";

interface BookingSummaryProps {
  date?: string;
  time?: string;
  guests?: number;
  areaId?: string;
  seatId?: string;
  locale: Locale;
  hold?: string;
  compact?: boolean;
}

export function BookingSummary({ date, time, guests, areaId, seatId, locale, hold = "08:42", compact }: BookingSummaryProps) {
  const area = AREAS.find((entry) => entry.id === areaId);
  const rows = [
    { label: locale === "vi" ? "Ngày" : "Date", value: date ? formatLongDate(date, locale) : "—" },
    { label: locale === "vi" ? "Giờ" : "Time", value: time || "—" },
    { label: locale === "vi" ? "Số khách" : "Guests", value: guests ? (locale === "vi" ? `${guests} người` : `${guests} guests`) : "—" },
    {
      label: locale === "vi" ? "Khu vực" : "Area",
      value: area ? `${locale === "vi" ? area.nameVi : area.nameEn}${seatId ? ` · ${locale === "vi" ? "Ghế" : "Seat"} ${seatId}` : ""}` : "—",
    },
  ];

  return (
    <aside className={`flex flex-col gap-3.5 border border-line bg-cream ${compact ? "p-4" : "p-6"}`}>
      <h2 className={`font-serif font-semibold text-ink ${compact ? "text-lg" : "text-[23px]"}`}>
        {locale === "vi" ? "Tóm tắt đặt chỗ" : "Reservation summary"}
      </h2>
      {rows.map((row) => (
        <div key={row.label} className="flex items-start justify-between gap-4 text-xs">
          <span className="text-muted">{row.label}</span>
          <span className="text-right font-semibold text-ink">{row.value}</span>
        </div>
      ))}
      <div className="h-px bg-line" />
      <p className="text-[11px] leading-relaxed text-muted whitespace-normal">
        {locale === "vi"
          ? `Lựa chọn được giữ trong ${hold}. Quán giữ bàn tối đa 15 phút sau giờ hẹn.`
          : `This selection is held for ${hold}. Tables are kept for 15 minutes after the booked time.`}
      </p>
    </aside>
  );
}

import type { Locale, ServeMode } from "@/types";

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function isValidPhone(value: string) {
  return /^0\d{9}$/.test(digitsOnly(value));
}

export function formatPhone(value: string) {
  const digits = digitsOnly(value).slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

const WEEKDAYS_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function parseDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toIso(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function weekdayChip(iso: string) {
  const date = parseDate(iso);
  const label = WEEKDAYS_VI[date.getDay()];
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${label} ${day}`;
}

export function formatLongDate(iso: string, locale: Locale) {
  const date = parseDate(iso);
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function monthTitle(year: number, month: number, locale: Locale) {
  if (locale === "vi") return `Tháng ${month} · ${year}`;
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
}

export function serveLabel(serve: ServeMode, locale: Locale) {
  const map = {
    hot: locale === "vi" ? "Nóng" : "Hot",
    cold: locale === "vi" ? "Lạnh" : "Iced",
    both: locale === "vi" ? "Nóng / Lạnh" : "Hot / Iced",
    none: "—",
  };
  return map[serve];
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

import type { Area, MediaAsset, Reservation, Seat } from "@/types";
import { SEED_CATEGORIES, SEED_ITEMS } from "@/data/menuFromShop";

export { SEED_CATEGORIES, SEED_ITEMS };

export const CLOSED_DATES = ["2026-10-01", "2026-10-07"];

export const UNAVAILABLE_TIMES = ["12:00"];

export const TIME_GROUPS = [
  { id: "morning", labelVi: "Buổi sáng", labelEn: "Morning", slots: ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30"] },
  { id: "midday", labelVi: "Buổi trưa", labelEn: "Midday", slots: ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30"] },
  { id: "afternoon", labelVi: "Buổi chiều", labelEn: "Afternoon", slots: ["13:30", "14:00", "14:30", "15:00", "16:00", "17:30"] },
] as const;

export const AREAS: Area[] = [
  { id: "bar", nameVi: "Quầy bar", nameEn: "Bar" },
  { id: "communal", nameVi: "Bàn chung", nameEn: "Communal table" },
  { id: "quiet", nameVi: "Khu yên tĩnh", nameEn: "Quiet zone" },
];

export const SEED_SEATS: Seat[] = [
  { id: "B1", areaId: "bar", state: "available" },
  { id: "B2", areaId: "bar", state: "available" },
  { id: "B3", areaId: "bar", state: "unavailable" },
  { id: "B4", areaId: "bar", state: "available" },
  { id: "W1", areaId: "bar", state: "available" },
  { id: "W2", areaId: "bar", state: "unavailable" },
  { id: "C1", areaId: "communal", state: "available" },
  { id: "C2", areaId: "communal", state: "unavailable" },
  { id: "C3", areaId: "communal", state: "available" },
  { id: "C4", areaId: "communal", state: "available" },
  { id: "Q1", areaId: "quiet", state: "available" },
  { id: "Q2", areaId: "quiet", state: "available" },
  { id: "Q3", areaId: "quiet", state: "unavailable" },
  { id: "Q4", areaId: "quiet", state: "available" },
];

export const DRINK_CATEGORY_IDS = SEED_CATEGORIES.map((category) => category.id);

export function isDrinkCategory(categoryId: string) {
  return (DRINK_CATEGORY_IDS as readonly string[]).includes(categoryId);
}

export function drinkPath(item: { categoryId: string; slug: string }) {
  if (!isDrinkCategory(item.categoryId)) return null;
  const known = SEED_ITEMS.some((entry) => entry.slug === item.slug && isDrinkCategory(entry.categoryId));
  return known ? `/menu/${item.slug}` : `/menu/product?slug=${encodeURIComponent(item.slug)}`;
}

export const SEED_MEDIA: MediaAsset[] = [
  { id: "logo", name: "logo.png", src: "/images/logo.png", alt: "Logo Homies Coffee", width: 1000, height: 1000, sizeLabel: "24 KB" },
  { id: "cover", name: "anh-bia.jpg", src: "/images/tu-lieu/thuong-hieu/anh-bia.jpg", alt: "Ảnh bìa Homies Coffee", width: 1640, height: 624, sizeLabel: "63 KB" },
  { id: "space", name: "anh-24.jpg", src: "/images/tu-lieu/hinh-anh/anh-24.jpg", alt: "Không gian quán", width: 1200, height: 900, sizeLabel: "131 KB" },
  { id: "tea", name: "anh-22.jpg", src: "/images/tu-lieu/hinh-anh/anh-22.jpg", alt: "Góc trà cụ", width: 1200, height: 900, sizeLabel: "123 KB" },
  { id: "seats", name: "anh-23.jpg", src: "/images/tu-lieu/hinh-anh/anh-23.jpg", alt: "Bàn ghế", width: 1200, height: 900, sizeLabel: "138 KB" },
  { id: "coffee", name: "anh-02.jpg", src: "/images/tu-lieu/hinh-anh/anh-02.jpg", alt: "Cà phê Homies", width: 1200, height: 900, sizeLabel: "228 KB" },
  { id: "matcha", name: "anh-17.jpg", src: "/images/tu-lieu/hinh-anh/anh-17.jpg", alt: "Câu chuyện EM Matcha", width: 1200, height: 900, sizeLabel: "466 KB" },
  { id: "menu", name: "menu-01.jpg", src: "/images/tu-lieu/menu/01.jpg", alt: "Bìa menu", width: 1200, height: 1600, sizeLabel: "236 KB" },
];

export const SEED_RESERVATIONS: Reservation[] = [
  {
    code: "TK-1048",
    name: "Nguyễn Minh An",
    phone: "0901234567",
    date: "2026-10-10",
    time: "10:30",
    guests: 2,
    areaId: "bar",
    seatId: "B2",
    note: "Ưu tiên chỗ ít nắng.",
    status: "confirmed",
  },
  {
    code: "TK-2201",
    name: "Trần Hà My",
    phone: "0912345678",
    date: "2026-09-27",
    time: "16:30",
    guests: 2,
    areaId: "quiet",
    seatId: "Q1",
    note: "",
    status: "locked",
  },
];

export const BOOKING_STEPS = [
  { id: 1, vi: "Ngày & số khách", en: "Date & guests" },
  { id: 2, vi: "Khung giờ", en: "Time" },
  { id: 3, vi: "Khu vực / ghế", en: "Area / seat" },
  { id: 4, vi: "Thông tin", en: "Details" },
  { id: 5, vi: "Kiểm tra", en: "Review" },
  { id: 6, vi: "Xác nhận", en: "Confirm" },
] as const;

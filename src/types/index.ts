export type Locale = "vi" | "en";

export type PublishStatus = "published" | "draft" | "unpublished";

export type ServeMode = "hot" | "cold" | "both" | "none";

export type MenuLabel = "featured" | "new" | "seasonal" | "signature" | "none";

export interface MenuItem {
  id: string;
  code: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  descriptionEn: string;
  price: number;
  categoryId: string;
  serve: ServeMode;
  label: MenuLabel;
  inStock: boolean;
  featured: boolean;
  status: PublishStatus;
  order: number;
  image: string;
  alt: string;
  gallery: string[];
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
  updatedBy: string;
  publishedAt?: string;
  version: number;
}

export interface Category {
  id: string;
  nameVi: string;
  nameEn: string;
  order: number;
  visible: boolean;
}

export interface MediaAsset {
  id: string;
  name: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  sizeLabel: string;
  usedBy?: string;
}

export type ReservationStatus = "confirmed" | "cancelled" | "locked";

export interface Reservation {
  code: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  areaId: string;
  seatId: string;
  note: string;
  status: ReservationStatus;
}

export type SeatState = "available" | "selected" | "unavailable";

export interface Seat {
  id: string;
  areaId: string;
  state: SeatState;
}

export interface Area {
  id: string;
  nameVi: string;
  nameEn: string;
}

export interface BookingDraft {
  date: string;
  guests: number;
  time: string;
  areaId: string;
  seatId: string;
  name: string;
  phone: string;
  note: string;
  agreed: boolean;
}

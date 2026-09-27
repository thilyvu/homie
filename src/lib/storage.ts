"use client";

import { SEED_CATEGORIES, SEED_ITEMS, SEED_MEDIA, SEED_RESERVATIONS } from "@/data/catalog";
import type { Category, MediaAsset, MenuItem, Reservation } from "@/types";

const CMS_KEY = "homies-cms-v2";
const BOOKING_KEY = "homies-reservations-v1";

export interface CmsState {
  items: MenuItem[];
  categories: Category[];
  media: MediaAsset[];
}

function canUseStorage() {
  return typeof window !== "undefined";
}

export function loadCms(): CmsState {
  if (!canUseStorage()) {
    return { items: SEED_ITEMS, categories: SEED_CATEGORIES, media: SEED_MEDIA };
  }
  const raw = window.localStorage.getItem(CMS_KEY);
  if (!raw) return { items: SEED_ITEMS, categories: SEED_CATEGORIES, media: SEED_MEDIA };
  try {
    const parsed = JSON.parse(raw) as CmsState;
    if (!parsed.items?.length) throw new Error("empty");
    return parsed;
  } catch {
    return { items: SEED_ITEMS, categories: SEED_CATEGORIES, media: SEED_MEDIA };
  }
}

export function saveCms(state: CmsState) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(CMS_KEY, JSON.stringify(state));
}

export function loadReservations(): Reservation[] {
  if (!canUseStorage()) return SEED_RESERVATIONS;
  const raw = window.localStorage.getItem(BOOKING_KEY);
  if (!raw) return SEED_RESERVATIONS;
  try {
    return JSON.parse(raw) as Reservation[];
  } catch {
    return SEED_RESERVATIONS;
  }
}

export function saveReservations(items: Reservation[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(BOOKING_KEY, JSON.stringify(items));
}

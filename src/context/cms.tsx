"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SEED_CATEGORIES, SEED_ITEMS, SEED_MEDIA } from "@/data/catalog";
import { loadCms, saveCms } from "@/lib/storage";
import type { Category, MediaAsset, MenuItem, PublishStatus } from "@/types";

interface CmsContextValue {
  ready: boolean;
  items: MenuItem[];
  categories: Category[];
  media: MediaAsset[];
  saveItem: (item: MenuItem, status?: PublishStatus) => "saved" | "conflict";
  removeItems: (ids: string[]) => void;
  bulkUpdate: (ids: string[], patch: Partial<MenuItem>) => void;
  saveCategories: (categories: Category[]) => void;
  addMedia: (asset: MediaAsset) => void;
  removeMedia: (id: string) => void;
}

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<MenuItem[]>(SEED_ITEMS);
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [media, setMedia] = useState<MediaAsset[]>(SEED_MEDIA);

  useEffect(() => {
    const state = loadCms();
    setItems(state.items);
    setCategories(state.categories);
    setMedia(state.media);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveCms({ items, categories, media });
  }, [ready, items, categories, media]);

  const saveItem = useCallback((item: MenuItem, status?: PublishStatus) => {
    let result: "saved" | "conflict" = "saved";
    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing && existing.version > item.version) {
        result = "conflict";
        return current;
      }
      const next: MenuItem = {
        ...item,
        status: status ?? item.status,
        version: (existing?.version ?? item.version) + 1,
        updatedAt: new Date().toISOString(),
        updatedBy: "Mai Anh",
        publishedAt: (status ?? item.status) === "published" ? new Date().toISOString() : item.publishedAt,
      };
      if (!existing) return [next, ...current];
      return current.map((entry) => (entry.id === item.id ? next : entry));
    });
    return result;
  }, []);

  const removeItems = useCallback((ids: string[]) => {
    setItems((current) => current.filter((item) => !ids.includes(item.id)));
  }, []);

  const bulkUpdate = useCallback((ids: string[], patch: Partial<MenuItem>) => {
    setItems((current) =>
      current.map((item) =>
        ids.includes(item.id)
          ? { ...item, ...patch, version: item.version + 1, updatedAt: new Date().toISOString(), updatedBy: "Mai Anh" }
          : item,
      ),
    );
  }, []);

  const saveCategories = useCallback((next: Category[]) => setCategories(next), []);
  const addMedia = useCallback((asset: MediaAsset) => setMedia((current) => [asset, ...current]), []);
  const removeMedia = useCallback((id: string) => setMedia((current) => current.filter((asset) => asset.id !== id)), []);

  const value = useMemo(
    () => ({ ready, items, categories, media, saveItem, removeItems, bulkUpdate, saveCategories, addMedia, removeMedia }),
    [ready, items, categories, media, saveItem, removeItems, bulkUpdate, saveCategories, addMedia, removeMedia],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) throw new Error("useCms must be used within CmsProvider");
  return context;
}

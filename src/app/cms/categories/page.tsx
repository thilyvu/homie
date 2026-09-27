"use client";

import { useState } from "react";
import { useCms } from "@/context/cms";
import { useToast } from "@/context/ui";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const { categories, saveCategories, ready } = useCms();
  const { pushToast } = useToast();
  const [draft, setDraft] = useState<Category[] | null>(null);
  const rows = draft ?? categories;

  const move = (index: number, delta: number) => {
    const next = [...rows];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    const [row] = next.splice(index, 1);
    next.splice(target, 0, row);
    setDraft(next.map((category, order) => ({ ...category, order: order + 1 })));
  };

  if (!ready) return <p>Đang tải danh mục…</p>;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[11px] font-bold tracking-[2px] text-matcha">PHÂN LOẠI</p>
        <h1 className="mt-2 font-serif text-3xl">Danh mục</h1>
        <p className="mt-1 text-sm text-cms-muted">Thứ tự hiển thị trên bộ lọc menu công khai. Danh mục “Món nhẹ” dùng trong CMS.</p>
      </div>
      <ol className="overflow-hidden rounded-xl bg-white shadow-[var(--cms-shadow)]">
        {rows.map((category, index) => (
          <li key={category.id} className="flex items-center justify-between gap-3 border-b border-cms-line px-4 py-3">
            <div>
              <p className="text-sm font-medium">{category.nameVi}</p>
              <p className="text-[11px] text-cms-muted">{category.nameEn} · thứ tự {category.order}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="h-8 rounded-lg border border-cms-line px-2 text-xs" onClick={() => move(index, -1)} aria-label={`Đưa ${category.nameVi} lên`}>Lên</button>
              <button type="button" className="h-8 rounded-lg border border-cms-line px-2 text-xs" onClick={() => move(index, 1)} aria-label={`Đưa ${category.nameVi} xuống`}>Xuống</button>
              <button
                type="button"
                className="h-8 rounded-lg border border-cms-line px-2 text-xs"
                onClick={() => setDraft(rows.map((entry) => (entry.id === category.id ? { ...entry, visible: !entry.visible } : entry)))}
              >
                {category.visible ? "Đang hiện" : "Đang ẩn"}
              </button>
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="h-10 w-fit rounded-lg bg-matcha-deep px-4 text-sm text-white"
        onClick={() => {
          saveCategories(rows);
          setDraft(null);
          pushToast({ tone: "success", title: "Đã lưu thứ tự danh mục" });
        }}
      >
        Lưu thứ tự
      </button>
    </div>
  );
}

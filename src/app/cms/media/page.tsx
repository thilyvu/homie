"use client";

import { useState } from "react";
import { useCms } from "@/context/cms";
import { useToast } from "@/context/ui";

export default function MediaPage() {
  const { media, addMedia, removeMedia, ready } = useCms();
  const { pushToast } = useToast();
  const [query, setQuery] = useState("");
  const visible = media.filter((asset) => asset.name.toLowerCase().includes(query.toLowerCase()) || asset.alt.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <p className="text-[11px] font-bold tracking-[2px] text-matcha">TÀI NGUYÊN</p>
          <h1 className="mt-2 font-serif text-3xl">Thư viện ảnh</h1>
          <p className="mt-1 text-sm text-cms-muted">{media.length} ảnh. Tệp tải lên được lưu trên trình duyệt này.</p>
        </div>
        <label className="inline-flex h-10 cursor-pointer items-center rounded-lg bg-matcha-deep px-4 text-sm text-white">
          Tải ảnh
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result !== "string") return;
                addMedia({
                  id: `upload-${Date.now()}`,
                  name: file.name,
                  src: reader.result,
                  alt: file.name.replace(/\.[^.]+$/, ""),
                  width: 0,
                  height: 0,
                  sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
                });
                pushToast({ tone: "success", title: "Đã thêm ảnh", description: file.name });
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
      </div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên hoặc alt text" aria-label="Tìm ảnh" className="h-12 max-w-md rounded-md border border-line px-3 text-sm" />
      {!ready ? <p>Đang tải thư viện…</p> : null}
      {!visible.length ? <p className="border border-dashed border-cms-line p-8 text-center text-sm text-cms-muted">Không có ảnh khớp.</p> : null}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visible.map((asset) => (
          <li key={asset.id} className="overflow-hidden rounded-xl bg-white shadow-[var(--cms-shadow)]">
            <img src={asset.src} alt={asset.alt} className="h-40 w-full object-cover" />
            <div className="p-3 text-xs">
              <p className="truncate font-medium">{asset.name}</p>
              <p className="mt-1 text-cms-muted">{asset.alt}</p>
              <p className="mt-1 text-cms-muted">{asset.sizeLabel}{asset.usedBy ? ` · ${asset.usedBy}` : ""}</p>
              <button type="button" className="mt-2 text-error" onClick={() => { removeMedia(asset.id); pushToast({ tone: "info", title: "Đã xóa ảnh khỏi thư viện" }); }}>Xóa</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

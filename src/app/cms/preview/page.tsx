"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { MenuCard } from "@/components/site/blocks";
import { useCms } from "@/context/cms";

function PreviewBody() {
  const params = useSearchParams();
  const { items } = useCms();
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const focus = params.get("item");
  const published = items.filter((item) => item.status === "published").sort((a, b) => a.order - b.order);
  const highlighted = published.find((item) => item.id === focus);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <p className="text-[11px] font-bold tracking-[2px] text-matcha">XEM TRƯỚC</p>
          <h1 className="mt-2 font-serif text-3xl">Nội dung đang xuất bản</h1>
          <p className="mt-1 text-sm text-cms-muted">Bản nháp không xuất hiện ở đây. Khung desktop 1440 và mobile 390.</p>
        </div>
        <div className="flex gap-2" role="tablist" aria-label="Kích thước xem trước">
          {(["desktop", "mobile"] as const).map((value) => (
            <button key={value} type="button" role="tab" aria-selected={device === value} onClick={() => setDevice(value)} className={`h-10 rounded-lg px-4 text-sm ${device === value ? "bg-matcha-deep text-white" : "border border-cms-line bg-white"}`}>
              {value === "desktop" ? "Desktop" : "Mobile"}
            </button>
          ))}
        </div>
      </div>
      <div className={`mx-auto overflow-hidden rounded-xl border border-cms-line bg-paper ${device === "mobile" ? "w-[390px]" : "w-full"}`}>
        <div className="border-b border-line px-4 py-3 text-xs text-muted">homies.vn/menu</div>
        <div className={`grid gap-4 p-4 ${device === "desktop" ? "sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1"}`}>
          {(highlighted ? [highlighted, ...published.filter((item) => item.id !== highlighted.id)] : published).slice(0, 8).map((item) => (
            <MenuCard key={item.id} item={item} locale="vi" />
          ))}
        </div>
        {!published.length ? <p className="p-8 text-center text-sm text-muted">Chưa có món xuất bản.</p> : null}
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<p>Đang dựng bản xem trước…</p>}>
      <PreviewBody />
    </Suspense>
  );
}

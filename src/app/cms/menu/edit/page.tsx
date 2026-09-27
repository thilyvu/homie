"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ItemForm } from "@/components/cms/ItemForm";
import { useCms } from "@/context/cms";

function EditMenuItemBody() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { items, ready } = useCms();
  const item = items.find((entry) => entry.id === id);

  if (!ready) return <p className="text-sm text-cms-muted">Đang tải món…</p>;
  if (!item) return <p className="bg-error-bg p-4 text-sm text-error" role="alert">Không tìm thấy món này.</p>;
  return <ItemForm key={item.id} initial={item} />;
}

export default function EditMenuItemPage() {
  return (
    <Suspense fallback={<p className="text-sm text-cms-muted">Đang tải món…</p>}>
      <EditMenuItemBody />
    </Suspense>
  );
}

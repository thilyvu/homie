"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DrinkDetail } from "@/components/site/DrinkDetail";

function ProductBody() {
  const params = useSearchParams();
  return <DrinkDetail slug={params.get("slug") ?? ""} />;
}

export default function ProductPage() {
  return (
    <Suspense fallback={<main className="px-5 py-16 text-sm text-muted">Đang tải món…</main>}>
      <ProductBody />
    </Suspense>
  );
}

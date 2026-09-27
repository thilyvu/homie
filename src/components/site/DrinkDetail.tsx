"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { isDrinkCategory } from "@/data/catalog";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { Eyebrow, MenuCard } from "@/components/site/blocks";
import { useCms } from "@/context/cms";
import { useLocale } from "@/context/ui";
import { formatPrice, serveLabel } from "@/lib/format";

export function DrinkDetail({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const { items, categories, ready } = useCms();
  const vi = locale === "vi";
  const item = items.find((entry) => entry.slug === slug && isDrinkCategory(entry.categoryId) && entry.status === "published");
  const photos = item ? [item.image, ...item.gallery.filter((src) => src !== item.image)] : [];
  const [active, setActive] = useState(0);
  const category = categories.find((entry) => entry.id === item?.categoryId);
  const related = useMemo(
    () =>
      items
        .filter((entry) => entry.status === "published" && isDrinkCategory(entry.categoryId) && entry.slug !== slug)
        .sort((a, b) => Number(b.categoryId === item?.categoryId) - Number(a.categoryId === item?.categoryId) || a.order - b.order)
        .slice(0, 3),
    [items, slug, item?.categoryId],
  );

  return (
    <>
      <SiteHeader />
      <main>
        <article className="motion-static mx-auto w-full max-w-[1440px] px-5 py-10 lg:px-16 lg:py-16">
          <Link href="/menu" className="text-sm font-semibold text-matcha">
            ← {vi ? "Quay lại menu" : "Back to menu"}
          </Link>
          {!ready && !item ? <p className="mt-10 text-sm text-muted">{vi ? "Đang tải món…" : "Loading…"}</p> : null}
          {ready && !item ? (
            <div className="mt-10 max-w-xl">
              <h1 className="font-serif text-4xl">{vi ? "Không thấy món này." : "This drink is not on the menu."}</h1>
              <p className="mt-3 text-sm text-muted">{vi ? "Món có thể đang là bản nháp hoặc đã gỡ khỏi website." : "It may be a draft or no longer published."}</p>
            </div>
          ) : null}
          {item ? (
            <div className="mt-8 grid items-start gap-10 lg:grid-cols-2">
              <div>
                <div className="overflow-hidden rounded-lg">
                  <img src={photos[active] ?? item.image} alt={item.alt} className="motion-hero h-[320px] w-full object-cover sm:h-[460px]" />
                </div>
                {photos.length > 1 ? (
                  <div className="mt-3 flex gap-3">
                    {photos.map((src, index) => (
                      <button key={`${src}-${index}`} type="button" onClick={() => setActive(index)} aria-label={vi ? `Ảnh ${index + 1}` : `Photo ${index + 1}`} aria-pressed={index === active} className={`h-20 w-24 overflow-hidden rounded-lg ${index === active ? "ring-2 ring-matcha" : ""}`}>
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="motion-rise flex flex-col gap-4">
                <Eyebrow>{category ? (vi ? category.nameVi : category.nameEn) : "MENU"}</Eyebrow>
                <h1 className="font-serif text-4xl leading-[1.12] font-medium lg:text-5xl">{vi ? item.nameVi : item.nameEn}</h1>
                <p className="text-lg font-bold text-matcha-deep">{formatPrice(item.price)}</p>
                <p className="text-[15px] leading-relaxed text-muted">{vi ? item.descriptionVi : item.descriptionEn}</p>
                <p className="text-sm leading-relaxed text-ink">{item.seoDescription}</p>
                <p className="text-[11px] font-bold tracking-[1px] text-matcha">{item.inStock ? serveLabel(item.serve, locale).toUpperCase() : vi ? "HẾT MÓN" : "SOLD OUT"}</p>
                {item.inStock ? null : (
                  <p className="bg-error-bg p-3 text-sm text-error" role="status">
                    {vi ? "Món đang hết. Bạn vẫn có thể xem vị và đặt chỗ để hỏi món khác." : "This drink is sold out. You can still read about it and reserve a seat."}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-3">
                  <Link href="/booking" className="inline-flex h-12 items-center gap-2 rounded-[3px] bg-matcha-deep px-5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5">
                    {vi ? "Đặt chỗ" : "Reserve"} <span aria-hidden>→</span>
                  </Link>
                  <Link href="/menu" className="inline-flex h-12 items-center rounded-[3px] border border-matcha px-5 text-sm font-semibold text-matcha-deep transition duration-200 hover:-translate-y-0.5">
                    {vi ? "Món khác" : "More drinks"}
                  </Link>
                </div>
                <p className="text-[11px] text-muted">{item.code}</p>
              </div>
            </div>
          ) : null}
        </article>
        {related.length ? (
          <section className="bg-cream">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 py-16 lg:px-16">
              <h2 className="font-serif text-3xl font-medium">{vi ? "Món khác" : "More from the menu"}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((entry) => (
                  <MenuCard key={entry.id} item={entry} locale={locale} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}

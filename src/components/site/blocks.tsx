"use client";

import Link from "next/link";
import { drinkPath } from "@/data/catalog";
import { formatPrice, serveLabel } from "@/lib/format";
import type { Locale, MenuItem, MenuLabel } from "@/types";

const labelText: Record<MenuLabel, { vi: string; en: string }> = {
  featured: { vi: "NỔI BẬT", en: "FEATURED" },
  new: { vi: "MỚI", en: "NEW" },
  seasonal: { vi: "THEO MÙA", en: "SEASONAL" },
  signature: { vi: "SIGNATURE", en: "SIGNATURE" },
  none: { vi: "", en: "" },
};

export function MenuCard({ item, locale }: { item: MenuItem; locale: Locale }) {
  const badge = item.inStock ? labelText[item.label][locale] || (item.serve === "both" ? (locale === "vi" ? "NÓNG / LẠNH" : "HOT / ICED") : "") : locale === "vi" ? "HẾT MÓN" : "SOLD OUT";
  const href = drinkPath(item);
  const card = (
    <article className={`group flex w-full flex-col gap-3 ${item.inStock ? "" : "opacity-55"}`}>
      <div className="overflow-hidden rounded-lg">
        <img src={item.image} alt={item.alt} className="h-[220px] w-full object-cover transition duration-700 ease-out group-hover:scale-105 sm:h-[260px]" />
      </div>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-[19px] font-semibold text-ink">{locale === "vi" ? item.nameVi : item.nameEn}</h3>
        <p className="text-[13px] font-bold text-matcha-deep">{formatPrice(item.price)}</p>
      </div>
      <p className="text-[13px] text-muted">{locale === "vi" ? item.descriptionVi : item.descriptionEn}</p>
      {badge ? (
        <p className={`text-[10px] font-bold tracking-[1px] ${item.inStock ? "text-matcha" : "text-error"}`}>{badge}</p>
      ) : (
        <p className="text-[10px] font-bold tracking-[1px] text-matcha">{serveLabel(item.serve, locale).toUpperCase()}</p>
      )}
    </article>
  );
  if (!href) return card;
  return (
    <Link href={href} className="block rounded-lg">
      {card}
    </Link>
  );
}

export function MenuRow({ item, locale }: { item: MenuItem; locale: Locale }) {
  const href = drinkPath(item);
  const name = locale === "vi" ? item.nameVi : item.nameEn;
  return (
    <div className="flex items-start gap-4 border-b border-line py-5">
      <p className="w-[42%] font-serif text-[17px] text-ink sm:w-[260px]">
        {href ? (
          <Link href={href} className="underline-offset-4 hover:text-matcha hover:underline">
            {name}
          </Link>
        ) : (
          name
        )}
      </p>
      <p className="flex-1 text-[13px] text-muted">{locale === "vi" ? item.descriptionVi : item.descriptionEn}</p>
      <p className="text-[13px] font-bold text-black">{formatPrice(item.price)}</p>
    </div>
  );
}

export function Eyebrow({ children }: { children: string }) {
  return <p className="text-[11px] font-bold tracking-[2px] text-matcha uppercase">{children}</p>;
}

export function PageHero({
  kicker,
  title,
  body,
  image,
  alt,
  primary,
  secondary,
}: {
  kicker: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
}) {
  return (
    <section className="motion-static mx-auto flex w-full max-w-[1440px] flex-col lg:min-h-[610px] lg:flex-row lg:items-stretch">
      <div className="motion-rise flex flex-col gap-5 px-5 pt-12 pb-10 lg:w-[590px] lg:pt-[110px] lg:pr-[70px] lg:pb-[90px] lg:pl-16">
        <Eyebrow>{kicker}</Eyebrow>
        <h1 className="font-serif text-[40px] leading-[1.08] font-medium text-ink sm:text-5xl lg:text-[64px]">{title}</h1>
        <p className="text-[17px] leading-[1.65] text-muted">{body}</p>
        <div className="flex flex-wrap gap-3">
          <Link href={primary.href} className="inline-flex h-12 items-center gap-2 rounded-[3px] bg-matcha-deep px-5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5">
            {primary.label} <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
          </Link>
          <Link href={secondary.href} className="inline-flex h-12 items-center rounded-[3px] border border-matcha bg-paper px-5 text-sm font-semibold text-matcha-deep transition duration-200 hover:-translate-y-0.5 hover:bg-cream">
            {secondary.label}
          </Link>
        </div>
      </div>
      <div className="overflow-hidden sm:rounded-none lg:w-[850px] lg:rounded-lg">
        <img src={image} alt={alt} className="motion-hero h-[280px] w-full object-cover sm:h-[420px] lg:h-[610px]" />
      </div>
    </section>
  );
}

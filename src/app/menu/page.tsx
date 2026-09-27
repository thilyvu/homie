"use client";

import { Info } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { Eyebrow, MenuCard, MenuRow, PageHero } from "@/components/site/blocks";
import { Tabs } from "@/components/ui/Tabs";
import { shop } from "@/data/shop";
import { useCms } from "@/context/cms";
import { useLocale } from "@/context/ui";

export default function MenuPage() {
  const { locale } = useLocale();
  const { items, categories } = useCms();
  const [filter, setFilter] = useState("all");
  const vi = locale === "vi";
  const publicCategories = categories.filter((category) => category.visible && category.id !== "light").sort((a, b) => a.order - b.order);
  const published = useMemo(
    () =>
      items
        .filter((item) => item.status === "published")
        .filter((item) => (filter === "all" ? true : item.categoryId === filter))
        .sort((a, b) => a.order - b.order),
    [items, filter],
  );
  const cards = published.filter((item) => item.featured).slice(0, 4);
  const cardIds = new Set(cards.map((item) => item.id));
  const rows = published.filter((item) => !cardIds.has(item.id));

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          kicker="MENU"
          title={vi ? "Menu Homies." : "The Homies menu."}
          body={vi ? "Matcha theo dòng, cà phê, cold brew, trà oolong, bánh, mochi và gelato. Size và giá lấy từ ảnh menu." : "Matcha by line, coffee, cold brew, oolong, pastry, mochi and gelato. Sizes and prices come from the menu photos."}
          image="/images/tu-lieu/menu/01.jpg"
          alt="Bìa menu Homies Coffee"
          primary={{ href: shop.grab, label: "GrabFood" }}
          secondary={{ href: "/space", label: vi ? "Xem địa chỉ" : "Find us" }}
        />
        <div className="border-b border-line">
          <div className="mx-auto w-full max-w-[1440px] overflow-x-auto px-5 py-5 lg:px-16">
            <Tabs
              label={vi ? "Bộ lọc menu" : "Menu filters"}
              variant="chip"
              value={filter}
              onChange={setFilter}
              items={[{ id: "all", label: vi ? "Tất cả" : "All" }, ...publicCategories.map((category) => ({ id: category.id, label: vi ? category.nameVi : category.nameEn }))]}
            />
          </div>
        </div>
        <section className="bg-cream">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 py-16 lg:px-16 lg:py-[90px]">
            <div className="flex flex-col gap-2.5">
              <Eyebrow>{vi ? "MENU CHỌN LỌC" : "SELECTED MENU"}</Eyebrow>
              <h2 className="font-serif text-3xl leading-[1.18] font-medium lg:text-[42px]">{vi ? "Matcha, cà phê và món theo mùa" : "Matcha, coffee and seasonal drinks"}</h2>
            </div>
            {cards.length ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((item) => (
                  <MenuCard key={item.id} item={item} locale={locale} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">{vi ? "Không có món trong bộ lọc này." : "Nothing in this filter."}</p>
            )}
          </div>
        </section>
        {rows.length ? (
          <section className="mx-auto w-full max-w-[1060px] px-5 py-16 lg:px-0 lg:py-20">
            {rows.map((item) => (
              <MenuRow key={item.id} item={item} locale={locale} />
            ))}
          </section>
        ) : null}
        <div className="bg-cream px-5 py-8 lg:px-16">
          <div className="mx-auto flex max-w-[1440px] gap-2.5 border-l-[3px] border-sand bg-note p-3 text-xs leading-relaxed text-muted">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>{vi ? "Giá chép từ ảnh menu fanpage, chưa gồm mọi phụ thu. Cần xác nhận trước khi bán. Menu chỉ để xem, không có giỏ hàng." : "Prices are copied from the fanpage menu photos and omit some surcharges. Confirm before sale. This menu is for reading; there is no cart."}</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

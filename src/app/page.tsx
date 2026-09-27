"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { Eyebrow, MenuCard, PageHero } from "@/components/site/blocks";
import { shop } from "@/data/shop";
import { useCms } from "@/context/cms";
import { useLocale } from "@/context/ui";

export default function HomePage() {
  const { locale } = useLocale();
  const { items } = useCms();
  const featured = items
    .filter((item) => item.status === "published" && item.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);
  const vi = locale === "vi";

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          kicker={shop.descriptorVi}
          title={shop.tagline}
          body={vi ? "Matcha nhiều dòng, cà phê và bánh mang đi. Quán ở tầng 1, 83 Hùng Vương, Buôn Ma Thuột." : "Matcha, coffee and pastry to go. Floor 1, 83 Hung Vuong, Buon Ma Thuot."}
          image="/images/tu-lieu/hinh-anh/anh-24.jpg"
          alt="Không gian Homies Coffee"
          primary={{ href: "/menu", label: vi ? "Xem menu" : "View menu" }}
          secondary={{ href: shop.grab, label: "GrabFood" }}
        />
        <section className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-8 px-5 py-16 lg:flex-row lg:gap-[90px] lg:px-[120px] lg:py-24">
          <div className="flex flex-1 flex-col gap-4">
            <Eyebrow>{vi ? "VỀ HOMIES" : "ABOUT HOMIES"}</Eyebrow>
            <h2 className="font-serif text-3xl leading-[1.18] font-medium text-ink lg:text-[42px]">{vi ? "Cà phê trong tay, dễ chịu trong lòng." : "Coffee in hand, comfort at heart."}</h2>
            <p className="text-[15px] leading-[1.7] text-muted">
              {vi
                ? "Homies pha matcha theo nhiều dòng — Haru, Homies, Ikigai, MH3/Nekome, Hisui/Kyoto, EM và Samidori — cùng cà phê, cold brew, trà oolong, bánh và mochi."
                : "Homies serves matcha across Haru, Homies, Ikigai, MH3/Nekome, Hisui/Kyoto, EM and Samidori, plus coffee, cold brew, oolong, pastry and mochi."}
            </p>
          </div>
          <img src="/images/tu-lieu/hinh-anh/anh-17.jpg" alt="EM Matcha tại Homies Coffee" className="h-[280px] w-full rounded-lg object-cover lg:h-[430px] lg:w-[560px]" />
        </section>
        <section className="bg-cream">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 py-16 lg:px-16 lg:py-[90px]">
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
              <div className="flex max-w-[700px] flex-col gap-2.5">
                <Eyebrow>{vi ? "MENU CHỌN LỌC" : "SELECTED MENU"}</Eyebrow>
                <h2 className="font-serif text-3xl leading-[1.18] font-medium lg:text-[42px]">{vi ? "Một vài món trên menu" : "A few things from the menu"}</h2>
              </div>
              <Link href="/menu" className="inline-flex h-12 items-center gap-2 text-sm font-semibold text-matcha">
                {vi ? "Xem toàn bộ menu" : "See the full menu"} <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {featured.map((item) => (
                <MenuCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          </div>
        </section>
        <section className="bg-matcha-deep text-paper">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-10 px-5 py-16 lg:flex-row lg:gap-[70px] lg:px-16 lg:py-24">
            <img src="/images/tu-lieu/hinh-anh/anh-02.jpg" alt="Cà phê tại Homies Coffee" className="h-[280px] w-full rounded-lg object-cover lg:h-[440px] lg:w-[650px]" />
            <div className="flex flex-1 flex-col gap-[18px]">
              <p className="text-[11px] font-bold tracking-[2px] text-sand">{vi ? "CÀ PHÊ & MATCHA" : "COFFEE & MATCHA"}</p>
              <h2 className="font-serif text-3xl leading-[1.2] lg:text-[42px]">{vi ? "Mang đi, hoặc gọi GrabFood và ShopeeFood." : "Take it away, or order on GrabFood and ShopeeFood."}</h2>
              <p className="text-[15px] leading-[1.7] text-[#fffddc]">
                {vi
                  ? "Quầy mở 06:45–18:00. Hotline quầy 0919 768 409. Gyokuro và món theo mùa có thể hết hàng."
                  : "The counter is open 06:45–18:00. Counter line 0919 768 409. Gyokuro and seasonal drinks may sell out."}
              </p>
              <Link href="/story" className="inline-flex h-12 w-fit items-center rounded-[3px] border border-matcha bg-paper px-5 text-sm font-semibold text-matcha-deep">
                {vi ? "Đọc câu chuyện" : "Read the story"}
              </Link>
            </div>
          </div>
        </section>
        <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 py-16 lg:px-16 lg:py-24">
          <Eyebrow>{vi ? "KHÔNG GIAN" : "THE ROOM"}</Eyebrow>
          <h2 className="font-serif text-3xl leading-[1.18] font-medium lg:text-[42px]">{vi ? "Một chỗ ngồi cho từng nhịp điệu." : "A seat for every pace."}</h2>
          <div className="grid gap-4 lg:grid-cols-3 lg:items-end">
            {[
              ["/images/tu-lieu/hinh-anh/anh-22.jpg", vi ? "Góc trà cụ" : "Tea corner", "h-[320px]"],
              ["/images/tu-lieu/hinh-anh/anh-23.jpg", vi ? "Bàn ghế" : "Seating", "h-[320px] lg:h-[390px]"],
              ["/images/tu-lieu/hinh-anh/anh-24.jpg", vi ? "Không gian quán" : "The room", "h-[320px]"],
            ].map(([src, label, height]) => (
              <figure key={label} className="flex flex-col gap-2.5">
                <img src={src} alt={label} className={`${height} w-full rounded-lg object-cover`} />
                <figcaption className="font-serif text-lg text-ink">{label}</figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section className="bg-cream">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-8 px-5 py-16 lg:flex-row lg:gap-[90px] lg:px-[120px] lg:py-[88px]">
            <div className="flex flex-1 flex-col gap-4">
              <Eyebrow>{vi ? "GHÉ HOMIES" : "VISIT HOMIES"}</Eyebrow>
              <h2 className="font-serif text-3xl leading-[1.18] font-medium lg:text-[42px]">{vi ? "Lên tầng 1, ngay Hùng Vương." : "Floor 1, on Hung Vuong."}</h2>
              <p className="text-[15px] text-ink">{vi ? shop.addressVi : shop.addressEn}</p>
              <p className="text-sm leading-[1.7] text-muted">
                {vi ? shop.directionsVi : shop.directionsEn}
                <br />
                {vi ? shop.hoursVi : shop.hoursEn}
              </p>
              <Link href="/space" className="inline-flex h-12 w-fit items-center gap-2 rounded-[3px] bg-matcha-deep px-5 text-sm font-semibold text-white">
                {vi ? "Xem đường đến" : "How to find us"} <span aria-hidden>→</span>
              </Link>
            </div>
            <img src="/images/tu-lieu/thuong-hieu/anh-bia.jpg" alt="Ảnh bìa Homies Coffee" className="h-[240px] w-full rounded-lg object-cover lg:h-[340px] lg:w-[560px]" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

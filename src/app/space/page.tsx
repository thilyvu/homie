"use client";

import Link from "next/link";
import { Info, X } from "lucide-react";
import { useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { Eyebrow, PageHero } from "@/components/site/blocks";
import { shop } from "@/data/shop";
import { useLocale } from "@/context/ui";

const GALLERY = [
  { src: "/images/tu-lieu/hinh-anh/anh-22.jpg", alt: "Góc trà cụ", wide: true },
  { src: "/images/tu-lieu/hinh-anh/anh-23.jpg", alt: "Bàn ghế", wide: false },
  { src: "/images/tu-lieu/hinh-anh/anh-12.jpg", alt: "Ảnh sản phẩm", wide: false },
  { src: "/images/tu-lieu/hinh-anh/anh-19.jpg", alt: "Đồ uống", wide: true },
  { src: "/images/tu-lieu/hinh-anh/anh-24.jpg", alt: "Không gian quán", wide: true },
];

export default function SpacePage() {
  const { locale } = useLocale();
  const vi = locale === "vi";
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          kicker={vi ? "KHÔNG GIAN & GHÉ QUÁN" : "SPACE & VISIT"}
          title={vi ? "Tầng 1, 83 Hùng Vương." : "Floor 1, 83 Hung Vuong."}
          body={vi ? shop.directionsVi : shop.directionsEn}
          image="/images/tu-lieu/hinh-anh/anh-24.jpg"
          alt="Không gian Homies Coffee"
          primary={{ href: "/booking", label: vi ? "Đặt chỗ" : "Reserve" }}
          secondary={{ href: "#visit", label: vi ? "Xem địa chỉ" : "Find us" }}
        />
        <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 py-16 lg:px-16 lg:py-24">
          <Eyebrow>{vi ? "KHÔNG GIAN" : "THE ROOM"}</Eyebrow>
          <h2 className="font-serif text-3xl leading-[1.18] font-medium lg:text-[42px]">{vi ? "Một chỗ ngồi cho từng nhịp điệu." : "A seat for every pace."}</h2>
          <div className="grid gap-4 lg:grid-cols-3 lg:items-end">
            {[
              ["/images/tu-lieu/hinh-anh/anh-22.jpg", vi ? "Góc trà cụ" : "Tea corner", "h-[320px]"],
              ["/images/tu-lieu/hinh-anh/anh-23.jpg", vi ? "Bàn ghế" : "Seating", "h-[320px] lg:h-[390px]"],
              ["/images/tu-lieu/hinh-anh/anh-24.jpg", vi ? "Không gian quán" : "The room", "h-[320px]"],
            ].map(([src, label, height]) => (
              <figure key={label}>
                <button type="button" className="block w-full text-left" onClick={() => setActive(GALLERY.findIndex((item) => item.src === src) >= 0 ? GALLERY.findIndex((item) => item.src === src) : 0)}>
                  <img src={src} alt={label} className={`${height} w-full rounded-lg object-cover`} />
                </button>
                <figcaption className="mt-2.5 font-serif text-lg">{label}</figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section className="bg-cream" aria-label={vi ? "Thư viện ảnh" : "Gallery"}>
          <div className="mx-auto grid w-full max-w-[1440px] gap-3 px-5 py-10 sm:grid-cols-2 lg:px-16">
            {GALLERY.map((image, index) => (
              <button key={image.src} type="button" onClick={() => setActive(index)} className={image.wide ? "sm:col-span-1 lg:col-span-1" : ""}>
                <img src={image.src} alt={image.alt} className={`w-full rounded-lg object-cover ${image.wide ? "h-[220px] lg:h-[350px]" : "h-[220px] lg:h-[350px]"}`} />
              </button>
            ))}
          </div>
        </section>
        <section id="visit" className="bg-cream">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-8 px-5 py-16 lg:flex-row lg:gap-[90px] lg:px-[120px]">
            <div className="flex flex-1 flex-col gap-4">
              <Eyebrow>{vi ? "GHÉ HOMIES" : "VISIT"}</Eyebrow>
              <h2 className="font-serif text-3xl leading-[1.18] font-medium lg:text-[42px]">{vi ? "Quầy ở tầng trên lớp Trẻ Trâu." : "The counter is upstairs from Tre Trau."}</h2>
              <p>{vi ? shop.addressVi : shop.addressEn}</p>
              <p className="text-sm leading-[1.7] text-muted">
                {vi ? shop.hoursVi : shop.hoursEn}
                <br />
                {vi ? `Quầy ${shop.phone} · Admin ${shop.admin}` : `Counter ${shop.phone} · Admin ${shop.admin}`}
              </p>
              <Link href="/booking" className="inline-flex h-12 w-fit items-center gap-2 rounded-[3px] bg-matcha-deep px-5 text-sm font-semibold text-white">
                {vi ? "Đặt chỗ" : "Reserve"} →
              </Link>
            </div>
            <img src="/images/tu-lieu/thuong-hieu/anh-bia.jpg" alt="Ảnh bìa Homies Coffee" className="h-[240px] w-full rounded-lg object-cover lg:h-[340px] lg:w-[560px]" />
          </div>
        </section>
        <section className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-6 px-5 py-16 lg:flex-row lg:items-center lg:px-[120px]">
          <div>
            <h2 className="font-serif text-3xl font-medium lg:text-[42px]">{vi ? "Ghé quán hôm nay." : "Come by today."}</h2>
            <p className="mt-3 text-sm leading-[1.8] text-muted">
              <a href={`tel:${shop.phoneTel}`}>{shop.phone}</a>
              {" · "}
              <a href={shop.zalo} target="_blank" rel="noreferrer">Zalo</a>
              <br />
              <a href={shop.grab} target="_blank" rel="noreferrer">GrabFood</a>
              {" · "}
              <a href={shop.shopee} target="_blank" rel="noreferrer">ShopeeFood</a>
            </p>
          </div>
          <Link href="/booking" className="inline-flex h-12 items-center gap-2 rounded-[3px] bg-matcha-deep px-5 text-sm font-semibold text-white">
            {vi ? "Đặt chỗ" : "Reserve"} →
          </Link>
        </section>
        <div className="bg-cream px-5 py-8 lg:px-16">
          <div className="mx-auto flex max-w-[1440px] gap-2.5 border-l-[3px] border-sand bg-note p-3 text-xs text-muted">
            <Info className="size-4 shrink-0" aria-hidden />
            <p>{vi ? "Giá trên website chép từ ảnh menu fanpage và chưa gồm mọi phụ thu. Món theo mùa và Gyokuro có thể hết hàng." : "Prices are copied from the fanpage menu photos and do not include every surcharge. Seasonal items and Gyokuro may sell out."}</p>
          </div>
        </div>
      </main>
      <SiteFooter />
      {active !== null ? (
        <div className="motion-fade fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4" role="dialog" aria-modal="true" aria-label="Ảnh phóng to">
          <button type="button" className="absolute top-4 right-4 text-white" onClick={() => setActive(null)} aria-label="Đóng">
            <X />
          </button>
          <img key={GALLERY[active].src} src={GALLERY[active].src} alt={GALLERY[active].alt} className="motion-pop max-h-[85vh] max-w-[1100px] rounded-lg object-contain" />
          <div className="absolute bottom-6 flex gap-3">
            <button type="button" className="text-white" onClick={() => setActive((active + GALLERY.length - 1) % GALLERY.length)}>
              Trước
            </button>
            <button type="button" className="text-white" onClick={() => setActive((active + 1) % GALLERY.length)}>
              Sau
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

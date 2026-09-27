"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { Eyebrow, PageHero } from "@/components/site/blocks";
import { useLocale } from "@/context/ui";

const CHAPTERS = [
  {
    kickerVi: "QUÁN",
    kickerEn: "THE BAR",
    titleVi: "Take-away coffee và matcha bar.",
    titleEn: "A take-away coffee and matcha bar.",
    bodyVi: "Homies Coffee ở tầng 1, 83 Hùng Vương, phường Buôn Ma Thuột. Quầy nhận mang đi và giao qua GrabFood, ShopeeFood. Mở cửa 06:45–18:00 mỗi ngày.",
    bodyEn: "Homies Coffee is on floor 1, 83 Hung Vuong, Buon Ma Thuot. The counter is take-away, with GrabFood and ShopeeFood delivery. Open 06:45–18:00 every day.",
    image: "/images/tu-lieu/hinh-anh/anh-24.jpg",
    alt: "Không gian Homies Coffee",
    tone: "bg-paper",
  },
  {
    kickerVi: "MATCHA",
    kickerEn: "MATCHA",
    titleVi: "Nhiều dòng matcha trên cùng một menu.",
    titleEn: "Several matcha lines on one menu.",
    bodyVi: "Menu có Haru, Homies, Ikigai, MH3/Nekome, Hisui/Kyoto, EM và Samidori, cùng hojicha, wakoucha và Gyokuro limited. Mỗi dòng có latte, cold-whisked và các biến tấu.",
    bodyEn: "The menu lists Haru, Homies, Ikigai, MH3/Nekome, Hisui/Kyoto, EM and Samidori, plus hojicha, wakoucha and limited Gyokuro. Each line has latte, cold-whisked and variations.",
    image: "/images/tu-lieu/hinh-anh/anh-17.jpg",
    alt: "EM Matcha tại Homies",
    tone: "bg-cream",
  },
  {
    kickerVi: "CÀ PHÊ",
    kickerEn: "COFFEE",
    titleVi: "Espresso, cold brew và trà ủ lạnh.",
    titleEn: "Espresso, cold brew and iced tea.",
    bodyVi: "Cà phê có size S và M. Cold brew mặc định Arabica, Ethiopia phụ thu. Trà oolong ủ lạnh và các món trái cây theo mùa đứng cạnh bánh, mochi và gelato.",
    bodyEn: "Coffee comes in S and M. Cold brew is Arabica by default, with an Ethiopia surcharge. Iced oolong and seasonal fruit drinks sit beside pastry, mochi and gelato.",
    image: "/images/tu-lieu/hinh-anh/anh-06.jpg",
    alt: "Cà phê Fine Robusta Búp Tím",
    tone: "bg-paper",
  },
];

export default function StoryPage() {
  const { locale } = useLocale();
  const vi = locale === "vi";
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          kicker={vi ? "CÂU CHUYỆN" : "STORY"}
          title={vi ? "Coffee in Hand, Comfort at Heart." : "Coffee in Hand, Comfort at Heart."}
          body={vi ? "Homies Coffee pha matcha và cà phê để mang đi, ngay tầng 1 trên đường Hùng Vương." : "Homies Coffee makes matcha and coffee to go, on floor 1 of Hung Vuong."}
          image="/images/tu-lieu/hinh-anh/anh-15.jpg"
          alt="Đồ uống và tráng miệng Homies Coffee"
          primary={{ href: "/menu", label: vi ? "Xem menu" : "View menu" }}
          secondary={{ href: "/space", label: vi ? "Ghé quán" : "Visit" }}
        />
        {CHAPTERS.map((chapter) => (
          <section key={chapter.kickerVi} className={chapter.tone}>
            <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-8 px-5 py-16 lg:flex-row lg:gap-20 lg:px-[100px] lg:py-[90px]">
              <div className="flex flex-1 flex-col gap-4">
                <Eyebrow>{vi ? chapter.kickerVi : chapter.kickerEn}</Eyebrow>
                <h2 className="font-serif text-3xl leading-[1.18] font-medium lg:text-[42px]">{vi ? chapter.titleVi : chapter.titleEn}</h2>
                <p className="text-[15px] leading-[1.75] text-muted">{vi ? chapter.bodyVi : chapter.bodyEn}</p>
              </div>
              <img src={chapter.image} alt={chapter.alt} className="h-[260px] w-full rounded-lg object-cover lg:h-[420px] lg:w-[570px]" />
            </div>
          </section>
        ))}
        <section className="bg-warn-bg">
          <div className="mx-auto flex max-w-[880px] flex-col items-center gap-5 px-5 py-16 text-center lg:py-20">
            <h2 className="font-serif text-3xl leading-[1.18] font-medium lg:text-[42px]">{vi ? "Hãy bắt đầu bằng chén trà hợp với bạn." : "Start with the bowl that fits you."}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/menu" className="inline-flex h-12 items-center gap-2 rounded-[3px] bg-matcha-deep px-5 text-sm font-semibold text-white">
                {vi ? "Khám phá menu" : "Explore the menu"} <span aria-hidden>→</span>
              </Link>
              <Link href="/booking" className="inline-flex h-12 items-center rounded-[3px] border border-matcha bg-paper px-5 text-sm font-semibold text-matcha-deep">
                {vi ? "Đặt chỗ" : "Reserve"}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

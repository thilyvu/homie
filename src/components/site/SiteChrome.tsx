"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useLocale } from "@/context/ui";
import { shop } from "@/data/shop";
import { t } from "@/lib/i18n";

const LINKS = [
  { href: "/", key: "home" },
  { href: "/menu", key: "menu" },
  { href: "/story", key: "story" },
  { href: "/space", key: "space" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { locale, toggleLocale } = useLocale();
  const labels = t(locale);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-5 lg:h-[82px] lg:px-16">
        <Link href="/" aria-label="Homies Coffee">
          <img src="/images/logo.png" alt="Homies Coffee" width={36} height={36} className="size-9 object-contain" />
        </Link>
        <nav className="hidden items-center gap-[30px] lg:flex" aria-label="Chính">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors duration-200 ${active ? "font-bold text-matcha underline underline-offset-4" : "font-medium text-ink hover:text-matcha"}`}
              >
                {labels.nav[link.key]}
              </Link>
            );
          })}
          <button type="button" onClick={toggleLocale} className="text-[13px] text-muted">
            {labels.nav.lang}
          </button>
          <Link href="/booking">
            <Button withArrow>{labels.nav.book}</Button>
          </Link>
        </nav>
        <button type="button" className="lg:hidden" aria-expanded={open} aria-label="Mở menu" onClick={() => setOpen(true)}>
          <Menu className="size-6" />
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="motion-fade absolute inset-0 bg-ink/40" aria-label="Đóng menu" onClick={() => setOpen(false)} />
          <nav className="motion-drawer absolute top-0 right-0 flex h-full w-[290px] flex-col gap-5 bg-matcha-deep p-6 text-paper" aria-label="Di động">
            <div className="flex items-center justify-between">
              <img src="/images/logo.png" alt="" width={36} height={36} className="size-9 object-contain" />
              <button type="button" onClick={() => setOpen(false)} aria-label="Đóng">
                <X className="size-5" />
              </button>
            </div>
            {[...LINKS, { href: "/reservation-lookup", key: "lookup" as const }].map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-base">
                {labels.nav[link.key]}
              </Link>
            ))}
            <button type="button" onClick={toggleLocale} className="text-left text-base">
              {labels.nav.lang}
            </button>
            <Link href="/booking" onClick={() => setOpen(false)}>
              <Button withArrow fullWidth>
                {labels.nav.book}
              </Button>
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  const { locale } = useLocale();
  const labels = t(locale);
  const [modal, setModal] = useState<"rules" | "privacy" | null>(null);

  return (
    <footer className="bg-matcha-deep text-paper">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-5 py-14 lg:px-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_1fr] lg:gap-6">
          <img src="/images/logo.png" alt="Homies Coffee" width={36} height={36} className="size-9 object-contain" />
          <div className="flex w-full max-w-[210px] flex-col gap-2 text-[13px]">
            <p className="text-[11px] font-bold tracking-[1.5px] text-sand">{labels.footer.visit}</p>
            <p>{labels.footer.address}</p>
            <p>{labels.footer.hours}</p>
          </div>
          <div className="flex flex-col gap-2 text-[13px]">
            <p className="text-[11px] font-bold tracking-[1.5px] text-sand">{labels.footer.contact}</p>
            <a href={`tel:${shop.phoneTel}`}>{shop.phone}</a>
            <a href={`tel:${shop.adminTel}`}>Admin {shop.admin}</a>
            <a href={shop.zalo} target="_blank" rel="noreferrer">Zalo</a>
          </div>
          <div className="flex flex-col gap-2 text-[13px]">
            <p className="text-[11px] font-bold tracking-[1.5px] text-sand">{labels.footer.follow}</p>
            <a href={shop.facebook} target="_blank" rel="noreferrer">Facebook</a>
            <a href={shop.grab} target="_blank" rel="noreferrer">GrabFood</a>
            <a href={shop.shopee} target="_blank" rel="noreferrer">ShopeeFood</a>
          </div>
          <div className="flex flex-col gap-2 text-[13px]">
            <p className="text-[11px] font-bold tracking-[1.5px] text-sand">{labels.footer.info}</p>
            <Link href="/reservation-lookup">{labels.nav.lookup}</Link>
            <button type="button" className="text-left" onClick={() => setModal("rules")}>
              {labels.footer.rules}
            </button>
          </div>
        </div>
        <p className="text-[11px] text-sand">{labels.footer.copyright}</p>
      </div>
      <Modal
        open={modal !== null}
        title={modal === "privacy" ? labels.privacyTitle : labels.rulesTitle}
        onClose={() => setModal(null)}
      >
        <p className="text-[13px] leading-relaxed text-muted">{modal === "privacy" ? labels.privacyBody : labels.rulesBody}</p>
        <div className="mt-4 flex gap-2">
          <Button withArrow fullWidth onClick={() => setModal(null)}>
            {labels.rulesRead}
          </Button>
        </div>
        {modal === "rules" ? (
          <button type="button" className="mt-3 text-xs text-matcha" onClick={() => setModal("privacy")}>
            {labels.privacyTitle}
          </button>
        ) : null}
      </Modal>
    </footer>
  );
}

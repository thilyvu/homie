"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LayoutDashboard, Images, Layers3, Menu, Search, Settings, UtensilsCrossed, CalendarDays } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/cms", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/cms/menu", label: "Nội dung món", icon: UtensilsCrossed, badge: "12" },
  { href: "/cms/categories", label: "Danh mục", icon: Layers3 },
  { href: "/cms/media", label: "Thư viện", icon: Images },
  { href: "/cms/preview", label: "Trang website", icon: Menu },
  { href: "/cms/reservations", label: "Đặt chỗ", icon: CalendarDays },
  { href: "/cms/settings", label: "Cài đặt", icon: Settings },
];

export function CmsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = [...NAV].reverse().find((item) => pathname === item.href || (item.href !== "/cms" && pathname.startsWith(item.href)));

  return (
    <div className="min-h-screen bg-cms-bg text-cms-ink lg:grid lg:grid-cols-[244px_1fr]">
      <aside className={`${open ? "fixed inset-0 z-40 flex" : "hidden"} w-full flex-col border-r border-[#f0ddae] bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[244px]`}>
        <div className="px-5 py-6">
          <p className="font-serif text-lg font-semibold">Homies Coffee</p>
          <p className="text-[10px] tracking-[1.5px] text-cms-muted">CONTENT STUDIO</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="CMS">
          {NAV.map((item) => {
            const active = item.href === "/cms" ? pathname === "/cms" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex h-10 items-center justify-between rounded-lg px-3 text-sm ${active ? "bg-[#f7e7db] font-semibold text-matcha-deep" : "text-cms-ink"}`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4" aria-hidden />
                  {item.label}
                </span>
                {item.badge ? <span className="rounded-full bg-matcha-deep px-1.5 text-[10px] text-white">{item.badge}</span> : null}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-5 text-[11px] text-cms-muted">
          <p className="font-semibold text-[#2f7354]">Website đang hoạt động</p>
          <p>Đồng bộ 2 phút trước</p>
          <p className="mt-2">CMS v2.4 · Tiếng Việt</p>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between gap-3 border-b border-cms-line bg-white px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" className="lg:hidden" aria-label="Mở điều hướng" onClick={() => setOpen(true)}>
              <Menu className="size-5" />
            </button>
            <p className="truncate text-sm text-cms-muted">
              Homies CMS <span aria-hidden>›</span> <span className="text-cms-ink">{current?.label ?? "Tổng quan"}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden h-9 items-center gap-2 rounded-lg border border-cms-line px-3 text-xs text-cms-muted md:flex">
              <Search className="size-3.5" aria-hidden />
              <input aria-label="Tìm trong CMS" placeholder="Tìm món, danh mục, ảnh..." className="w-44 bg-transparent outline-none" />
              <span className="text-[10px]">⌘ K</span>
            </label>
            <button type="button" aria-label="Thông báo" className="relative">
              <Bell className="size-4" />
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-error" />
            </button>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#f7e7db] text-xs font-bold text-matcha-deep">MA</span>
              <span className="hidden text-xs sm:block">
                Mai Anh
                <span className="block text-[10px] text-cms-muted">Quản trị nội dung</span>
              </span>
            </div>
          </div>
        </header>
        <div className="px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </div>
      {open ? <button type="button" className="fixed inset-0 z-30 bg-ink/30 lg:hidden" aria-label="Đóng" onClick={() => setOpen(false)} /> : null}
    </div>
  );
}

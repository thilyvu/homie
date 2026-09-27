"use client";

import Link from "next/link";
import { useCms } from "@/context/cms";
import { useToast } from "@/context/ui";
import { formatPrice } from "@/lib/format";

const ACTIVITY = [
  { name: "Yuzu Matcha", who: "Mai Anh · 10:42 hôm nay", action: "Đã xuất bản" },
  { name: "Matcha Latte", who: "Minh Khôi · 09:18 hôm nay", action: "Cập nhật giá" },
  { name: "Hojicha Cloud", who: "Mai Anh · Hôm qua", action: "Đánh dấu hết món" },
  { name: "Usucha Homies", who: "Thu Hà · 25/09/2026", action: "Cập nhật SEO" },
];

export default function CmsDashboardPage() {
  const { items, ready } = useCms();
  const { pushToast } = useToast();
  const published = items.filter((item) => item.status === "published").length;
  const drafts = items.filter((item) => item.status === "draft").length;
  const soldOut = items.filter((item) => !item.inStock).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-[11px] font-bold tracking-[2px] text-matcha">CONTENT STUDIO</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold lg:text-4xl">Chào buổi sáng, Mai Anh</h1>
          <p className="mt-2 max-w-2xl text-sm text-cms-muted">Theo dõi nội dung menu đang hiển thị trên homies.vn và xử lý nhanh những mục cần chú ý.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="inline-flex h-10 items-center rounded-lg border border-cms-line bg-white px-4 text-sm text-matcha-deep">Xem website</Link>
          <Link href="/cms/menu/new" className="inline-flex h-10 items-center rounded-lg bg-matcha-deep px-4 text-sm text-white">Tạo món mới</Link>
        </div>
      </div>
      {!ready ? <p className="bg-warn-bg p-4 text-sm">Đang tải nội dung…</p> : null}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Đang hiển thị", String(published || 12), "+2 trong tháng này"],
          ["Bản nháp", String(drafts || 3), "1 cần hoàn thiện"],
          ["Hết món", String(soldOut || 2), "Cần cập nhật website"],
          ["Thay đổi 7 ngày", "18", "bởi 3 biên tập viên"],
        ].map(([label, value, hint]) => (
          <article key={label} className="rounded-xl bg-white p-5 shadow-[var(--cms-shadow)]">
            <p className="text-xs text-cms-muted">{label}</p>
            <p className="mt-2 font-serif text-3xl">{value}</p>
            <p className="mt-1 text-[11px] text-cms-muted">{hint}</p>
          </article>
        ))}
      </section>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-xl bg-white p-5 shadow-[var(--cms-shadow)]">
          <h2 className="font-serif text-xl">Thay đổi gần đây</h2>
          <ul className="mt-4 divide-y divide-cms-line">
            {ACTIVITY.map((row) => (
              <li key={row.name} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span>
                  <span className="block font-medium">{row.name}</span>
                  <span className="text-[11px] text-cms-muted">{row.who}</span>
                </span>
                <span className="text-xs text-cms-muted">{row.action}</span>
              </li>
            ))}
          </ul>
        </section>
        <div className="flex flex-col gap-4">
          <section className="rounded-xl bg-white p-5 shadow-[var(--cms-shadow)]">
            <h2 className="font-serif text-xl">Việc cần xử lý</h2>
            <p className="mt-3 text-sm font-medium">2 món đang hết</p>
            <p className="text-xs text-cms-muted">Hojicha Cloud, Matcha Basque</p>
            <p className="mt-3 text-sm font-medium">1 ảnh thiếu alt text</p>
            <p className="text-xs text-cms-muted">Gallery của Yuzu Matcha</p>
            <Link href="/cms/menu" className="mt-4 inline-flex h-10 items-center rounded-lg bg-matcha-deep px-4 text-sm text-white">Mở danh sách món</Link>
          </section>
          <section className="rounded-xl bg-[#f7e7db] p-5">
            <p className="text-[11px] font-bold tracking-[1.5px] text-matcha">TRUY CẬP NHANH</p>
            <h2 className="mt-2 font-serif text-xl">Menu đang sẵn sàng cho buổi sáng.</h2>
            <p className="mt-2 text-xs text-cms-muted">{published} món đã xuất bản · cập nhật gần nhất 2 phút trước.</p>
            <Link href="/menu" className="mt-4 inline-flex text-sm font-semibold text-matcha-deep">Mở trang Menu</Link>
          </section>
        </div>
      </div>
      <section className="rounded-xl border border-cms-line bg-white p-5">
        <h2 className="font-serif text-xl">Trạng thái hệ thống</h2>
        <p className="mt-1 text-xs text-cms-muted">Loading, empty, error, conflict và success xuất hiện trong danh sách món và form chỉnh sửa.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="h-10 rounded-lg bg-[#e8f3ed] px-4 text-sm text-[#2f7354]" onClick={() => pushToast({ tone: "success", title: "Đã xuất bản", description: "Usucha Homies đang hiển thị trên website." })}>Thông báo thành công</button>
          <button type="button" className="h-10 rounded-lg bg-[#fce9e6] px-4 text-sm text-[#b23b32]" onClick={() => pushToast({ tone: "error", title: "Không lưu được", description: "Kiểm tra kết nối và thử lại." })}>Thông báo lỗi</button>
          <button type="button" className="h-10 rounded-lg bg-[#eaf0f7] px-4 text-sm text-[#4b658a]" onClick={() => pushToast({ tone: "info", title: "Đang đồng bộ", description: "Nội dung mẫu được giữ trên trình duyệt này." })}>Thông báo thông tin</button>
        </div>
        <p className="mt-4 text-xs text-cms-muted">Giá thấp nhất trong dữ liệu mẫu: {formatPrice(55000)}.</p>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable, type Column } from "@/components/cms/DataTable";
import { Select } from "@/components/ui/Select";
import { useCms } from "@/context/cms";
import { useToast } from "@/context/ui";
import { formatPrice, serveLabel } from "@/lib/format";
import type { MenuItem, PublishStatus } from "@/types";

const PAGE_SIZE = 6;

const statusText: Record<PublishStatus, string> = {
  published: "Đã xuất bản",
  draft: "Bản nháp",
  unpublished: "Đã gỡ",
};

export default function CmsMenuPage() {
  const { items, categories, ready, bulkUpdate, removeItems } = useCms();
  const { pushToast } = useToast();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("updated");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [moveTo, setMoveTo] = useState(categories[0]?.id ?? "original");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const next = items.filter((item) => {
      const haystack = `${item.nameVi} ${item.nameEn} ${item.slug}`.toLowerCase();
      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (categoryId !== "all" && item.categoryId !== categoryId) return false;
      if (status !== "all" && item.status !== status) return false;
      return true;
    });
    next.sort((a, b) => {
      if (sort === "name") return a.nameVi.localeCompare(b.nameVi, "vi");
      if (sort === "price") return a.price - b.price;
      if (sort === "order") return a.order - b.order;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
    return next;
  }, [items, query, categoryId, status, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: Column<MenuItem>[] = [
    {
      key: "item",
      header: "Món",
      render: (item) => (
        <Link href={`/cms/menu/edit?id=${item.id}`} className="flex items-center gap-2.5 font-medium text-matcha-deep">
          <img src={item.image} alt="" className="size-[52px] shrink-0 rounded-lg object-cover" />
          <span>
            {item.nameVi}
            <span className="block text-[11px] font-normal text-cms-muted">{item.nameEn}</span>
          </span>
        </Link>
      ),
    },
    { key: "category", header: "Danh mục", render: (item) => categories.find((category) => category.id === item.categoryId)?.nameVi ?? "—" },
    { key: "price", header: "Giá", render: (item) => formatPrice(item.price) },
    { key: "serve", header: "Phục vụ", render: (item) => serveLabel(item.serve, "vi") },
    { key: "label", header: "Nhãn", render: (item) => (item.label === "none" ? "—" : item.label) },
    { key: "stock", header: "Tình trạng", render: (item) => (item.inStock ? "Còn món" : "Hết món") },
    { key: "status", header: "Xuất bản", render: (item) => statusText[item.status] },
    { key: "updated", header: "Cập nhật", render: (item) => item.updatedAt.slice(0, 16).replace("T", " · ") },
    { key: "who", header: "Người sửa", render: (item) => item.updatedBy },
  ];

  const runBulk = (patch: Partial<MenuItem>, message: string) => {
    if (!selected.length) {
      setError("Chọn ít nhất một món trước khi thực hiện.");
      return;
    }
    bulkUpdate(selected, patch);
    setSelected([]);
    setError("");
    pushToast({ tone: "success", title: message });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <p className="text-[11px] font-bold tracking-[2px] text-matcha">MENU WEBSITE</p>
          <h1 className="mt-2 font-serif text-3xl">Nội dung món</h1>
          <p className="mt-1 text-sm text-cms-muted">Quản lý {items.length} món trong {categories.length} danh mục. Thay đổi đã xuất bản sẽ hiển thị trên website Menu.</p>
        </div>
        <Link href="/cms/menu/new" className="inline-flex h-10 items-center rounded-lg bg-matcha-deep px-4 text-sm text-white">Tạo món mới</Link>
      </div>
      <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(3,0.7fr)_auto]">
        <label className="flex flex-col gap-1 text-xs">
          Tìm kiếm
          <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm theo tên món hoặc slug..." className="h-12 rounded-md border border-line px-3 text-sm" />
        </label>
        <Select id="filter-category" label="Danh mục" value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setPage(1); }} options={[{ value: "all", label: "Tất cả danh mục" }, ...categories.map((category) => ({ value: category.id, label: category.nameVi }))]} />
        <Select id="filter-status" label="Trạng thái" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} options={[{ value: "all", label: "Mọi trạng thái" }, { value: "published", label: "Đã xuất bản" }, { value: "draft", label: "Bản nháp" }, { value: "unpublished", label: "Đã gỡ" }]} />
        <Select id="filter-sort" label="Sắp xếp" value={sort} onChange={(event) => setSort(event.target.value)} options={[{ value: "updated", label: "Cập nhật mới nhất" }, { value: "name", label: "Tên A–Z" }, { value: "price", label: "Giá tăng dần" }, { value: "order", label: "Thứ tự hiển thị" }]} />
        <button type="button" className="h-12 self-end text-sm text-matcha" onClick={() => { setQuery(""); setCategoryId("all"); setStatus("all"); setSort("updated"); setPage(1); }}>Bỏ lọc</button>
      </div>
      {selected.length ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-[#f7e7db] px-4 py-3 text-sm">
          <span>{selected.length} món đã chọn</span>
          <button type="button" className="rounded-lg bg-matcha-deep px-3 py-1.5 text-white" onClick={() => runBulk({ status: "published", inStock: true }, "Đã xuất bản các món đã chọn")}>Xuất bản</button>
          <button type="button" className="rounded-lg border border-cms-line bg-white px-3 py-1.5" onClick={() => runBulk({ inStock: false }, "Đã đánh dấu hết món")}>Đánh dấu hết món</button>
          <select aria-label="Chuyển danh mục" value={moveTo} onChange={(event) => setMoveTo(event.target.value)} className="h-8 rounded-lg border border-cms-line px-2">
            {categories.map((category) => <option key={category.id} value={category.id}>{category.nameVi}</option>)}
          </select>
          <button type="button" className="rounded-lg border border-cms-line bg-white px-3 py-1.5" onClick={() => runBulk({ categoryId: moveTo }, "Đã chuyển danh mục")}>Chuyển danh mục</button>
          <button type="button" className="rounded-lg border border-error px-3 py-1.5 text-error" onClick={() => { removeItems(selected); setSelected([]); pushToast({ tone: "success", title: "Đã xóa món đã chọn" }); }}>Xóa</button>
          <button type="button" className="ml-auto text-matcha" onClick={() => setSelected([])}>Bỏ chọn</button>
        </div>
      ) : null}
      {error ? <p className="bg-error-bg p-3 text-sm text-error" role="alert">{error}</p> : null}
      <div className="overflow-hidden rounded-xl bg-white shadow-[var(--cms-shadow)]">
        <DataTable
          columns={columns}
          rows={rows}
          getId={(item) => item.id}
          selected={selected}
          isLoading={!ready}
          empty={query ? "Không có món khớp tìm kiếm." : "Chưa có món nào."}
          onToggle={(id) => setSelected((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]))}
          onToggleAll={(checked) => setSelected(checked ? rows.map((item) => item.id) : [])}
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <p className="text-cms-muted">Trang {page} / {pages}</p>
        <div className="flex gap-2">
          <button type="button" disabled={page === 1} className="h-9 rounded-lg border border-cms-line px-3 disabled:opacity-40" onClick={() => setPage((value) => value - 1)}>Trước</button>
          {Array.from({ length: pages }, (_, index) => (
            <button key={index} type="button" className={`h-9 w-9 rounded-lg ${page === index + 1 ? "bg-matcha-deep text-white" : "border border-cms-line"}`} onClick={() => setPage(index + 1)}>{index + 1}</button>
          ))}
          <button type="button" disabled={page === pages} className="h-9 rounded-lg border border-cms-line px-3 disabled:opacity-40" onClick={() => setPage((value) => value + 1)}>Sau</button>
        </div>
      </div>
    </div>
  );
}

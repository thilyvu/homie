"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MediaUploader } from "@/components/cms/MediaUploader";
import { PublishPanel } from "@/components/cms/PublishPanel";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useCms } from "@/context/cms";
import { useToast } from "@/context/ui";
import { slugify } from "@/lib/format";
import type { MenuItem, MenuLabel, PublishStatus, ServeMode } from "@/types";

const schema = z.object({
  nameVi: z.string().trim().min(1, "Nhập tên tiếng Việt"),
  nameEn: z.string().trim().min(1, "Nhập tên tiếng Anh"),
  slug: z.string().trim().min(1, "Nhập slug"),
  descriptionVi: z.string().trim().min(1, "Nhập mô tả tiếng Việt"),
  descriptionEn: z.string().trim().min(1, "Nhập mô tả tiếng Anh"),
  price: z.number().positive("Giá phải lớn hơn 0"),
  order: z.number().int().min(1, "Thứ tự bắt đầu từ 1"),
  categoryId: z.string().min(1),
  seoTitle: z.string().max(60, "SEO title tối đa 60 ký tự"),
  seoDescription: z.string().max(160, "SEO description tối đa 160 ký tự"),
});

type ItemFields = z.infer<typeof schema>;

const LABELS: { id: MenuLabel; label: string }[] = [
  { id: "featured", label: "Nổi bật" },
  { id: "new", label: "Mới" },
  { id: "seasonal", label: "Theo mùa" },
  { id: "signature", label: "Signature" },
  { id: "none", label: "Không nhãn" },
];

export function ItemForm({ initial }: { initial: MenuItem }) {
  const router = useRouter();
  const { categories, saveItem, media } = useCms();
  const { pushToast } = useToast();
  const [serve, setServe] = useState<ServeMode>(initial.serve === "none" ? "hot" : initial.serve);
  const [label, setLabel] = useState<MenuLabel>(initial.label);
  const [inStock, setInStock] = useState(initial.inStock);
  const [image, setImage] = useState(initial.image);
  const [gallery, setGallery] = useState(initial.gallery.length ? initial.gallery : [initial.image]);
  const [alt, setAlt] = useState(initial.alt);
  const [version, setVersion] = useState(initial.version);
  const [conflict, setConflict] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const form = useForm<ItemFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameVi: initial.nameVi,
      nameEn: initial.nameEn,
      slug: initial.slug,
      descriptionVi: initial.descriptionVi,
      descriptionEn: initial.descriptionEn,
      price: initial.price,
      order: initial.order,
      categoryId: initial.categoryId,
      seoTitle: initial.seoTitle,
      seoDescription: initial.seoDescription,
    },
  });

  const watched = form.watch();
  const snapshot = JSON.stringify({ ...watched, serve, label, inStock, image, alt, gallery });
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify({
      nameVi: initial.nameVi,
      nameEn: initial.nameEn,
      slug: initial.slug,
      descriptionVi: initial.descriptionVi,
      descriptionEn: initial.descriptionEn,
      price: initial.price,
      order: initial.order,
      categoryId: initial.categoryId,
      seoTitle: initial.seoTitle,
      seoDescription: initial.seoDescription,
      serve: initial.serve === "none" ? "hot" : initial.serve,
      label: initial.label,
      inStock: initial.inStock,
      image: initial.image,
      alt: initial.alt,
      gallery: initial.gallery.length ? initial.gallery : [initial.image],
    }),
  );
  const dirty = snapshot !== savedSnapshot;

  useEffect(() => {
    const onLeave = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const buildItem = (values: ItemFields, status: PublishStatus): MenuItem => ({
    ...initial,
    ...values,
    serve,
    label,
    featured: label === "featured",
    inStock,
    image,
    alt,
    status,
    version,
    gallery: gallery.length ? gallery : [image],
  });

  const persist = (status: PublishStatus) => {
    void form.handleSubmit((values) => {
      if (!alt.trim()) {
        pushToast({ tone: "error", title: "Thiếu alt text", description: "Ảnh đại diện cần mô tả." });
        return;
      }
      const result = saveItem(buildItem(values, status), status);
      if (result === "conflict") {
        setConflict("Một phiên bản mới hơn đã được lưu. Tải lại trang trước khi ghi đè.");
        pushToast({ tone: "error", title: "Xung đột phiên bản" });
        return;
      }
      setVersion((value) => value + 1);
      setSavedSnapshot(JSON.stringify({ ...values, serve, label, inStock, image, alt, gallery }));
      setConflict("");
      pushToast({
        tone: "success",
        title: status === "published" ? "Đã xuất bản" : status === "draft" ? "Đã lưu bản nháp" : "Đã gỡ xuất bản",
      });
      if (!initial.nameVi) router.push(`/cms/menu/edit?id=${initial.id}`);
    })();
  };

  const seoTitle = form.watch("seoTitle");
  const seoDescription = form.watch("seoDescription");
  const nameVi = form.watch("nameVi");

  return (
    <div className="flex flex-col gap-5">
      {dirty ? <p className="border-l-[3px] border-[#a76612] bg-[#fff2d6] p-3 text-sm text-[#a76612]" role="status">Có thay đổi chưa lưu.</p> : null}
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <p className="text-[11px] font-bold tracking-[2px] text-matcha">{initial.nameVi ? "ĐANG CHỈNH SỬA" : "TẠO MÓN MỚI"}</p>
          <h1 className="mt-2 font-serif text-3xl">{nameVi || "Món mới"}</h1>
          <p className="mt-1 text-xs text-cms-muted">Mã món {initial.code} · phiên bản {version}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/cms/preview?item=${initial.id}`} className="inline-flex h-10 items-center rounded-lg border border-cms-line bg-white px-4 text-sm">Xem trước</Link>
          <button type="button" className="h-10 rounded-lg border border-cms-line bg-white px-4 text-sm" onClick={() => persist("draft")}>Lưu bản nháp</button>
          <button type="button" className="h-10 rounded-lg bg-matcha-deep px-4 text-sm text-white" onClick={() => persist("published")}>Xuất bản</button>
        </div>
      </div>
      <div className="grid items-start gap-5 xl:grid-cols-[1fr_322px]">
        <form className="flex flex-col gap-4" onSubmit={(event) => event.preventDefault()} noValidate>
          <section className="rounded-xl bg-white p-5 shadow-[var(--cms-shadow)]">
            <h2 className="font-serif text-lg">Thông tin cơ bản</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input id="name-vi" label="Tên tiếng Việt *" {...form.register("nameVi")} error={form.formState.errors.nameVi?.message} />
              <Input id="name-en" label="Tên tiếng Anh *" {...form.register("nameEn")} error={form.formState.errors.nameEn?.message} />
            </div>
            <div className="mt-4">
              <Input id="slug" label="Slug *" {...form.register("slug")} error={form.formState.errors.slug?.message} hint={`Đường dẫn: homies.vn/menu/${form.watch("slug") || "slug"}`} />
              <button type="button" className="mt-2 text-xs text-matcha" onClick={() => form.setValue("slug", slugify(form.getValues("nameVi")), { shouldDirty: true })}>Tạo slug từ tên Việt</button>
            </div>
            <div className="mt-4 grid gap-4">
              <TextArea id="desc-vi" label="Mô tả hương vị (VI) *" {...form.register("descriptionVi")} error={form.formState.errors.descriptionVi?.message} />
              <TextArea id="desc-en" label="Taste notes (EN) *" {...form.register("descriptionEn")} error={form.formState.errors.descriptionEn?.message} />
            </div>
          </section>
          <section className="rounded-xl bg-white p-5 shadow-[var(--cms-shadow)]">
            <h2 className="font-serif text-lg">Phân loại & giá</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Select id="category" label="Danh mục" {...form.register("categoryId")} options={categories.map((category) => ({ value: category.id, label: category.nameVi }))} />
              <Input id="price" label="Giá bán *" type="number" {...form.register("price", { valueAsNumber: true })} error={form.formState.errors.price?.message} />
              <Input id="order" label="Thứ tự hiển thị" type="number" hint="Số nhỏ hiển thị trước" {...form.register("order", { valueAsNumber: true })} error={form.formState.errors.order?.message} />
            </div>
            <fieldset className="mt-4">
              <legend className="text-xs font-semibold">Phục vụ</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["hot", "cold", "both"] as ServeMode[]).map((mode) => (
                  <button key={mode} type="button" aria-pressed={serve === mode} onClick={() => setServe(mode)} className={`rounded-lg border px-3 py-2 text-xs ${serve === mode ? "border-matcha bg-[#f7e7db]" : "border-cms-line bg-white"}`}>
                    {mode === "hot" ? "Nóng" : mode === "cold" ? "Lạnh" : "Nóng & lạnh"}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-4">
              <legend className="text-xs font-semibold">Nhãn nổi bật</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {LABELS.map((entry) => (
                  <button key={entry.id} type="button" aria-pressed={label === entry.id} onClick={() => setLabel(entry.id)} className={`rounded-lg border px-3 py-2 text-xs ${label === entry.id ? "border-matcha bg-[#f7e7db]" : "border-cms-line bg-white"}`}>
                    {entry.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <button type="button" aria-pressed={inStock} onClick={() => setInStock((value) => !value)} className="mt-4 flex w-full items-center justify-between rounded-lg border border-cms-line p-3 text-left">
              <span>
                <span className="block text-sm font-medium">Trạng thái còn hàng</span>
                <span className="text-[11px] text-cms-muted">Món có thể phục vụ và hiển thị bình thường trên website.</span>
              </span>
              <span className={`rounded-full px-2 py-1 text-[11px] ${inStock ? "bg-[#e8f3ed] text-[#2f7354]" : "bg-error-bg text-error"}`}>{inStock ? "Còn món" : "Hết món"}</span>
            </button>
          </section>
          <section className="rounded-xl bg-white p-5 shadow-[var(--cms-shadow)]">
            <h2 className="font-serif text-lg">Hình ảnh</h2>
            <div className="mt-4">
              <MediaUploader preview={image} alt={alt} onAlt={setAlt} onFile={(src) => setImage(src)} />
            </div>
            <div className="mt-4">
              <p className="text-xs text-cms-ink">Gallery</p>
              <div className="mt-2 flex flex-wrap gap-2.5">
                {gallery.map((src, index) => (
                  <button
                    key={`${src.slice(0, 24)}-${index}`}
                    type="button"
                    onClick={() => setImage(src)}
                    className={`h-[90px] w-[124px] overflow-hidden rounded-lg ${src === image ? "ring-2 ring-matcha" : ""}`}
                    aria-label={`Chọn ảnh ${index + 1} làm ảnh đại diện`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
                <label className="flex h-[90px] w-[124px] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-cms-line text-[11px] text-matcha">
                  <Plus className="size-4" aria-hidden />
                  Thêm ảnh
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        const src = reader.result;
                        if (typeof src !== "string") return;
                        setGallery((current) => [...current, src]);
                        setImage(src);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
            </div>
            <button type="button" className="mt-3 text-sm text-matcha" onClick={() => setLibraryOpen((value) => !value)}>Mở thư viện</button>
            {libraryOpen ? (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {media.map((asset) => (
                  <button key={asset.id} type="button" onClick={() => { setImage(asset.src); setAlt(asset.alt); setLibraryOpen(false); }}>
                    <img src={asset.src} alt={asset.alt} className="h-20 w-full rounded-lg object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </section>
          <section className="rounded-xl bg-white p-5 shadow-[var(--cms-shadow)]">
            <h2 className="font-serif text-lg">SEO</h2>
            <div className="mt-4 flex flex-col gap-4">
              <Input id="seo-title" label={`Tiêu đề tìm kiếm ${seoTitle.length}/60`} {...form.register("seoTitle")} error={form.formState.errors.seoTitle?.message} />
              <TextArea id="seo-desc" label={`Mô tả tìm kiếm ${seoDescription.length}/160`} {...form.register("seoDescription")} error={form.formState.errors.seoDescription?.message} />
            </div>
            <div className="mt-4 rounded-lg bg-cms-bg p-4">
              <p className="text-sm text-[#4b658a]">{seoTitle || nameVi}</p>
              <p className="text-xs text-[#2f7354]">homies.vn/menu/{form.watch("slug")}</p>
              <p className="mt-1 text-xs text-cms-muted">{seoDescription}</p>
            </div>
          </section>
        </form>
        <PublishPanel
          status={initial.status}
          publishedAt={initial.publishedAt}
          conflict={conflict}
          checks={[
            { label: "Đủ nội dung VI/EN", ok: Boolean(nameVi && form.watch("nameEn") && form.watch("descriptionVi") && form.watch("descriptionEn")) },
            { label: "Ảnh có alt text", ok: Boolean(alt.trim()) },
            { label: "Giá và danh mục hợp lệ", ok: Number(form.watch("price")) > 0 && Boolean(form.watch("categoryId")) },
            { label: "SEO trong giới hạn", ok: seoTitle.length <= 60 && seoDescription.length <= 160 },
          ]}
          onPublish={() => persist("published")}
          onDraft={() => persist("draft")}
          onUnpublish={() => persist("unpublished")}
        />
      </div>
    </div>
  );
}

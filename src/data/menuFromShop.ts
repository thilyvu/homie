import type { Category, MenuItem, MenuLabel, ServeMode } from "@/types";
import menuFile from "./menu-du-lieu.json";

interface RawItem {
  category: string;
  name: string;
  variant: string;
  price_vnd: number;
  source_image: string;
  note: string;
}

const CATEGORY_ORDER = [
  "Coffee",
  "Matcha Haru",
  "Matcha Homies",
  "Matcha Ikigai",
  "Matcha MH3 / Nekome",
  "Matcha Hisui / Kyoto",
  "Matcha EM",
  "Matcha Samidori",
  "Hojicha Inucha",
  "Hojicha Rich",
  "Wakoucha",
  "Gyokuro",
  "Kem Rum",
  "Cold Brew",
  "Trà Oolong",
  "Bánh",
  "Mochi & Gelato",
] as const;

const PHOTO: Record<string, string> = {
  "Coffee|Latte": "/images/tu-lieu/hinh-anh/anh-02.jpg",
  "Matcha Homies|Matcha Latte": "/images/tu-lieu/hinh-anh/anh-19.jpg",
  "Cold Brew|Cold Brew truyền thống": "/images/tu-lieu/hinh-anh/anh-21.jpg",
  "Trà Oolong|Trà Khế Mật Dừa": "/images/tu-lieu/hinh-anh/anh-13.jpg",
};

const FEATURED = new Set([
  "Coffee|Latte",
  "Matcha Homies|Matcha Latte",
  "Cold Brew|Cold Brew truyền thống",
  "Trà Oolong|Trà Khế Mật Dừa",
]);

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function categoryId(name: string) {
  return slugify(name);
}

function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

function cleanNote(note: string) {
  return note
    .replace("Seasonal menu; xem ảnh nguồn cho phụ thu.", "Theo mùa. Phụ thu xem trên ảnh menu.")
    .replace("Xem ảnh nguồn để xác nhận lựa chọn kem Rum/kem Rum Matcha.", "Kem Rum hoặc kem Rum Matcha xem trên ảnh menu.")
    .replace("Limited Edition 2026; cần xác nhận còn hàng.", "Limited Edition 2026, cần xác nhận còn hàng.")
    .trim();
}

function serveFor(category: string, name: string): ServeMode {
  if (category === "Bánh" || category === "Mochi & Gelato") return "none";
  if (category === "Cold Brew" || category === "Trà Oolong" || category === "Kem Rum") return "cold";
  if (name.includes("Usucha")) return "hot";
  return "both";
}

function labelFor(key: string, category: string): MenuLabel {
  if (FEATURED.has(key)) return "featured";
  if (category === "Gyokuro" || category === "Kem Rum") return "seasonal";
  return "none";
}

function preferredPrice(rows: RawItem[]) {
  const medium = rows.find((row) => row.variant === "M");
  return (medium ?? rows[0]).price_vnd;
}

function buildItems(): MenuItem[] {
  const raw = menuFile.items as RawItem[];
  const groups = new Map<string, RawItem[]>();
  for (const row of raw) {
    const key = `${row.category}|${row.name}`;
    const current = groups.get(key) ?? [];
    current.push(row);
    groups.set(key, current);
  }

  const featuredKeys = [...FEATURED];
  const restKeys = [...groups.keys()].filter((key) => !FEATURED.has(key));
  const ordered = [...featuredKeys, ...restKeys];

  return ordered.map((key, index) => {
    const rows = groups.get(key);
    if (!rows) throw new Error(`Missing menu group ${key}`);
    const first = rows[0];
    const note = cleanNote(first.note);
    const sizes = rows.map((row) => `${row.variant} ${formatVnd(row.price_vnd)}`).join(" · ");
    const description = note ? `${sizes}. ${note}` : sizes;
    const image = PHOTO[key] ?? `/images/tu-lieu/${first.source_image}`;
    const id = slugify(`${first.category}-${first.name}`);
    return {
      id,
      code: `HM-${String(index + 1).padStart(3, "0")}`,
      slug: id,
      nameVi: first.name,
      nameEn: first.name,
      descriptionVi: description,
      descriptionEn: description,
      price: preferredPrice(rows),
      categoryId: categoryId(first.category),
      serve: serveFor(first.category, first.name),
      label: labelFor(key, first.category),
      inStock: true,
      featured: FEATURED.has(key),
      status: "published",
      order: index + 1,
      image,
      alt: `${first.name} — ${first.category}`,
      gallery: [image],
      seoTitle: `${first.name} | Homies Coffee`,
      seoDescription: `${first.name}, ${first.category}. ${description}`,
      updatedAt: "2026-09-27T16:00:00",
      updatedBy: "Homies Coffee",
      publishedAt: "2026-09-27T16:00:00",
      version: 1,
    };
  });
}

export const SEED_CATEGORIES: Category[] = CATEGORY_ORDER.map((name, index) => ({
  id: categoryId(name),
  nameVi: name,
  nameEn: name,
  order: index + 1,
  visible: true,
}));

export const SEED_ITEMS: MenuItem[] = buildItems();

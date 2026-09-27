"use client";

import { useState } from "react";
import { ItemForm } from "@/components/cms/ItemForm";
import type { MenuItem } from "@/types";

const blank: MenuItem = {
  id: "",
  code: "HM-NEW",
  slug: "",
  nameVi: "",
  nameEn: "",
  descriptionVi: "",
  descriptionEn: "",
  price: 0,
  categoryId: "original",
  serve: "hot",
  label: "none",
  inStock: true,
  featured: false,
  status: "draft",
  order: 99,
  image: "/images/usucha.jpg",
  alt: "",
  gallery: [],
  seoTitle: "",
  seoDescription: "",
  updatedAt: "",
  updatedBy: "Mai Anh",
  version: 0,
};

export default function NewMenuItemPage() {
  const [item] = useState<MenuItem>(() => ({ ...blank, id: `item-${Date.now()}` }));
  return <ItemForm initial={item} />;
}

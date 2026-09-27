import { DrinkDetail } from "@/components/site/DrinkDetail";
import { SEED_ITEMS, isDrinkCategory } from "@/data/catalog";

export function generateStaticParams() {
  return SEED_ITEMS.filter((item) => isDrinkCategory(item.categoryId)).map((item) => ({ slug: item.slug }));
}

export default async function DrinkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DrinkDetail slug={slug} />;
}

import { TOOL_CATEGORIES } from "@/data/toolCatalog";

export const categoryToSlug = (category: string): string =>
  category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const slugToCategory = (slug?: string): string | null => {
  if (!slug) return null;
  const normalized = slug.trim().toLowerCase();
  const category = TOOL_CATEGORIES.find(
    (item) => item !== "All" && categoryToSlug(item) === normalized,
  );

  return category ?? null;
};

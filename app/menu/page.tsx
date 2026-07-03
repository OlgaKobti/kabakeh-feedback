import { MENU, type MenuCategory, type MenuCategoryId } from "@/data/menu";

export const dynamic = "force-dynamic";
import { supabaseAdmin } from "@/lib/supabase";
import MenuClient from "./MenuClient";

async function fetchMenuFromDb(): Promise<MenuCategory[] | null> {
  try {
    const supabase = supabaseAdmin();

    const [{ data: categories, error: catError }, { data: items, error: itemError }] =
      await Promise.all([
        supabase.from("menu_categories").select("*").order("sort_order"),
        supabase.from("menu_items").select("*").eq("available", true).order("sort_order"),
      ]);

    if (catError) throw catError;
    if (itemError) throw itemError;
    if (!categories?.length) return null;

    return categories.map((cat) => ({
      id: cat.id as MenuCategoryId,
      title: { he: cat.title_he, ar: cat.title_ar, en: cat.title_en },
      items: (items ?? [])
        .filter((it) => it.category_id === cat.id)
        .map((it) => ({
          id: it.id as string,
          category: it.category_id as MenuCategoryId,
          name: { he: it.name_he, ar: it.name_ar, en: it.name_en },
          description:
            it.description_he || it.description_ar || it.description_en
              ? {
                  he: it.description_he ?? "",
                  ar: it.description_ar ?? "",
                  en: it.description_en ?? "",
                }
              : undefined,
          price: it.price ?? undefined,
          image: it.image,
          available: it.available,
          featured: it.featured,
        })),
    }));
  } catch (err) {
    console.error("[menu] Supabase fetch failed, using static fallback:", err);
    return null;
  }
}

export default async function MenuPage() {
  const dbMenu = await fetchMenuFromDb();
  return <MenuClient menu={dbMenu ?? MENU} />;
}

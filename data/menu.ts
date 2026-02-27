// data/menu.ts
export type Lang = "he" | "ar" | "en";
export type MenuCategoryId = "starters" | "from_our_kitchen" | "main_dishes" | "plates";

export type MenuItem = {
  id: string;
  category: MenuCategoryId;
  price?: number;
  image?: string | null; // filename only
  name: Record<Lang, string>;
  description?: Record<Lang, string>;
};

export type MenuCategory = {
  id: MenuCategoryId;
  title: Record<Lang, string>;
  items: MenuItem[];
};

const IMG_BASE = (process.env.NEXT_PUBLIC_MENU_IMAGE_BASE_URL || "").replace(/\/$/, "");

export function menuImageUrl(filename?: string | null) {
  if (!filename) return null;
  // If someone already provided full URL, keep it
  if (filename.startsWith("http://") || filename.startsWith("https://")) return filename;
  if (!IMG_BASE) return filename; // fallback
  return `${IMG_BASE}/${encodeURIComponent(filename)}`;
}

export const MENU_CATEGORIES = [
  { id: "starters", title: { en: "Starters", he: "ראשונות", ar: "مقبلات" } },
  { id: "from_our_kitchen", title: { en: "From our kitchen", he: "מהמטבח שלנו", ar: "من مطبخنا" } },
  { id: "main_dishes", title: { en: "Main dishes", he: "עיקריות", ar: "وجبات رئيسية" } },
  // ✅ change "בצלחת" -> "מנות"
  { id: "plates", title: { en: "Plates", he: "מנות", ar: "بالنص" } },
] as const;

export const MENU_ITEMS: MenuItem[] = [
  /* ---------------- Starters ---------------- */
  {
    id: "salad_set",
    category: "starters",
    price: 55,
    image: null, // ✅ remove picture
    name: { en: "Salad set", he: "סט סלטים", ar: "تشكيلة سلطات" },
    description: { en: "Assorted fresh salads", he: "מבחר סלטים טריים", ar: "تشكيلة من السلطات الطازجة" },
  },
  {
    id: "million_salad",
    category: "starters",
    price: 68,
    image: "Million_$.jpg",
    name: { en: "Million $ salad", he: "סלט מיליון $", ar: "سلطة مليون $" },
    // ✅ remove description
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "quinoa_salad",
    category: "starters",
    price: 68,
    image: "Kenowa_Sallad.jpg",
    name: { en: "Quinoa salad", he: "סלט קינואה", ar: "سلطة كينوا" },
    description: { en: "Quinoa with fresh vegetables", he: "קינואה עם ירקות טריים", ar: "كينوا مع خضار طازجة" },
  },
  {
    id: "caesar_salad",
    category: "starters",
    price: 72,
    image: "ceasar_salad.jpg",
    name: { en: "Caesar salad", he: "סלט קיסר", ar: "سلطة سيزر" },
    description: { en: "With grilled chicken and parmesan", he: "עם עוף על הגריל ופרמזן", ar: "مع دجاج مشوي وبارميزان" },
  },
  {
    id: "fattoush",
    category: "starters",
    price: 54, // ✅ 54 not 54.5
    image: "Fatoush.jpg",
    name: { en: "Fattoush", he: "פטוש", ar: "فتوش" },
    description: {
      en: "Cucumber, tomato, lettuce, onion, mint & sumac",
      he: "מלפפון, עגבנייה, חסה, בצל, נענע וסומאק",
      ar: "خيار، بندورة، خس، بصل، نعنع وسماق",
    },
  },
  {
    id: "jarjir_salad",
    category: "starters",
    price: 45,
    image: "Jarjir_Salad.jpg",
    name: { en: "Jarjir (Rocket) salad", he: "סלט ג׳רג׳יר (רוקט)", ar: "سلطة جرجير" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "tabbouleh_salad",
    category: "starters",
    price: 49,
    image: "tabuleh2.jpg",
    name: { en: "Tabbouleh salad", he: "טאבולה סלט", ar: "تبولة (سلطة)" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "moajanat",
    category: "starters",
    price: 65,
    image: "moajanat.jpg",
    name: { en: "Moajanat (4 pastries)", he: "מואג׳נאת", ar: "معجنات" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "homemade_hummus",
    category: "starters",
    price: 36,
    image: "hummus.jpg",
    name: { en: "Homemade hummus", he: "חומוס ביתי", ar: "حمص" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "labaneh",
    category: "starters",
    price: 35,
    image: "labaneh.jpg",
    name: { en: "Labaneh", he: "לבאנה", ar: "لبنة" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "fried_cauliflower_tahini",
    category: "starters",
    price: 46,
    image: null,
    name: { en: "Fried cauliflower with tahini", he: "זהרה", ar: "قرنبيط مقلي مع طحينة" },
    description: { en: "", he: "כרובית עם טחינה", ar: "" },
  },
  {
    id: "jibneh",
    category: "starters",
    price: 45,
    image: "jebneh_fingers.jpg",
    name: { en: "Jibneh", he: "ג׳יבנה", ar: "جبنة" },
    description: { en: "Fried Arabic cheese", he: "גבינה ערבית צרובה", ar: "جبنة عربية مقلية" },
  },
  {
    id: "baba_ghanouj",
    category: "starters",
    price: 53,
    image: "Baba_Ghanouj.jpg",
    name: { en: "Baba ghanouj", he: "באבא ג׳נוז׳", ar: "بابا غنوج" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "french_fries",
    category: "starters",
    price: 25,
    image: null,
    name: { en: "French fries", he: "צ׳יפס", ar: "بطاطا مقلية" },
    description: { en: "", he: "", ar: "" },
  },

  /* ---------------- From our kitchen ---------------- */
  {
    id: "dish_of_the_day",
    category: "from_our_kitchen",
    image: null,
    name: { en: "Dish of the day", he: "מנת היום", ar: "طبق اليوم" },
    description: { en: "Ask the waiters", he: "שאל את המלצר", ar: "اسألوا النُدُل" },
  },
  {
    id: "mujadara",
    category: "from_our_kitchen",
    price: 48,
    image: "Mjaddarah.jpg",
    name: { en: "Mujadara", he: "מג׳דרה", ar: "مجدّرة" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "mlokhia",
    category: "from_our_kitchen",
    price: 52,
    image: "Mlokheyyeh.jpg",
    name: { en: "Molokhia", he: "מלוחיה", ar: "ملوخية" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "freekeh",
    category: "from_our_kitchen",
    price: 55,
    image: "Freekeh.jpg",
    name: { en: "Freekeh", he: "פריקה", ar: "فريكة" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "shish_barak",
    category: "from_our_kitchen",
    price: 92,
    image: "shishbarak.jpg",
    name: { en: "Shish Barak", he: "שיש ברק", ar: "شيشبرك" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "baked_kibbeh",
    category: "from_our_kitchen",
    price: 78,
    image: "Kubbeh.jpg",
    name: { en: "Baked kibbeh", he: "קובה אפויה", ar: "كبة بالفرن" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "mansaf",
    category: "from_our_kitchen",
    price: 138,
    image: "mansaf.jpg",
    name: { en: "Mansaf", he: "מנסף", ar: "منسف" },
    description: { en: "", he: "", ar: "" },
  },

  /* ---------------- Main dishes ---------------- */
  {
    id: "mixed_grill",
    category: "main_dishes",
    price: 200,
    image: null,
    name: { en: "Mixed grill", he: "פלטת בשרים על האש", ar: "مشكل مشاوي" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "entrecote_300g",
    category: "main_dishes",
    price: 148,
    image: "antricot.jpg",
    name: { en: "Entrecote 300g", he: "אנטריקוט 300 גרם", ar: "ستيك انتريكوت 300 غرام" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "fish_fillet",
    category: "main_dishes",
    price: 71,
    image: "Fish_Fillet.jpg",
    name: { en: "Fish fillet", he: "פילה דג", ar: "فيليه سمك" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "grilled_shrimp",
    category: "main_dishes",
    price: 95,
    image: "shrimp_grill.jpg",
    name: { en: "Grilled shrimp", he: "שרימפס על הגריל", ar: "روبيان مشوي" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "salmon_fillet",
    category: "main_dishes",
    price: 128,
    image: "salmon.jpg",
    name: { en: "Salmon fillet", he: "פילה סלמון", ar: "فيليه سلمون" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "fish_of_the_day_with_freekeh",
    category: "main_dishes",
    price: 98,
    image: "Dennis_Fillet.jpg",
    name: { en: "Fish of the day with freekeh", he: "דג היום עם פריקה", ar: "سمكة اليوم مع فريكة" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "shrimp_with_garlic_sauce",
    category: "main_dishes",
    price: 98,
    image: "cream_shrimp.jpg",
    name: { en: "Shrimp with garlic sauce", he: "שרימפס ברוטב שום", ar: "روبيان بصلصة الثوم" },
    description: { en: "Shrimp with garlic sauce", he: "קדירת שרימפס עם לימון, פלפל חריף ורטוב שום", ar: "روبيان بصلصة الثوم" },
  },

  /* ---------------- Plates ---------------- */
  {
    id: "tongue",
    category: "plates",
    price: 70,
    image: "Toung.jpg",
    name: { en: "Tounge", he: "לשונות", ar: "لسنات" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "asian",
    category: "plates",
    price: 72,
    image: "Asian.jpg",
    name: { en: "Asian", he: "אסייתי", ar: "آسيوي" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "fahita",
    category: "plates",
    price: 70,
    image: "Fahita.jpg",
    name: { en: "Fahita", he: "פחיטה", ar: "فاهيتا" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "ravioli",
    category: "plates",
    price: 65,
    image: "Raviolle.jpg",
    name: { en: "Ravioli", he: "רביולי", ar: "رافيولي" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "fish_and_chips",
    category: "plates",
    image: null,
    name: { en: "Fish & chips", he: "פיש אנד צ׳יפס", ar: "فيش أند تشيبس" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "shami_arayes",
    category: "plates",
    price: 70,
    image: "Arayes_Shami.jpg",
    name: { en: "Shamia", he: "שאמיה", ar: "شامية" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "sushi_arayes",
    category: "plates",
    price: 70,
    image: "Sushi_Arayes.jpg",
    name: { en: "Arayes", he: "עראיס", ar: "عرايس" },
    description: { en: "", he: "", ar: "" },
  },
  {
    id: "schnitzel",
    category: "plates",
    price: 72,
    image: "shnitzel.jpg",
    name: { en: "Schnitzel", he: "שניצל", ar: "شنيتسل" },
    description: { en: "", he: "", ar: "" },
  },
];

/** The shape your page expects: categories with items[] */
export const MENU: MenuCategory[] = MENU_CATEGORIES.map((cat) => ({
  id: cat.id,
  title: cat.title,
  items: MENU_ITEMS.filter((it) => it.category === cat.id),
}));
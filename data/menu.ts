export type Lang = "en" | "he" | "ar";

export type MenuItem = {
  id: string;
  name: Record<Lang, string>;
  description?: Record<Lang, string>;
  price?: number;
  image?: string;
};

export type MenuCategory = {
  id: string;
  title: Record<Lang, string>;
  items: MenuItem[];
};

const MENU_IMG_BASE =
  "https://yrmpgbqmkytwiczsennh.supabase.co/storage/v1/object/public/menu";

const img = (file: string) => `${MENU_IMG_BASE}/${file}`;

const item = (
  id: string,
  name: Record<Lang, string>,
  opts?: {
    description?: Record<Lang, string>;
    price?: number;
    imageFile?: string;
  }
): MenuItem => ({
  id,
  name,
  description: opts?.description,
  price: opts?.price,
  image: opts?.imageFile ? img(opts.imageFile) : undefined,
});

export const MENU: MenuCategory[] = [
  // ================== STARTERS ==================
  {
    id: "starters",
    title: { ar: "مقبلات", he: "ראשונות", en: "Starters" },
    items: [
      item(
        "salads_assortment",
        { ar: "تشكيلة سلطات", he: "מבחר סלטים", en: "Salad assortment" },
        {
          description: {
            ar: "تشكيلة سلطات متنوعة",
            he: "מבחר סלטים מגוונים",
            en: "Assorted fresh salads",
          },
          price: 55,
          imageFile: "_DSF0303.jpg",
        }
      ),

      item(
        "milion_salad",
        { ar: "سلطة مليون", he: "סלט מיליון", en: "Million salad" },
        {
          description: {
            ar: "مزيج من الحمص والخضار الطازجة",
            he: "שילוב חומוס וירקות טריים",
            en: "Chickpeas and fresh vegetables mix",
          },
          price: 68,
          imageFile: "Million_$.jpg",
        }
      ),

      item(
        "quinoa_salad",
        { ar: "سلطة كينوا", he: "סלט קינואה", en: "Quinoa salad" },
        {
          description: {
            ar: "كينوا مع خضار طازجة",
            he: "קינואה עם ירקות טריים",
            en: "Quinoa with fresh vegetables",
          },
          price: 68,
          imageFile: "Kenowa_Sallad.jpg",
        }
      ),

      item(
        "caesar_salad",
        { ar: "سلطة القيصر", he: "סלט קיסר", en: "Caesar salad" },
        {
          description: {
            ar: "مع دجاج مشوي وجبنة بارميزان",
            he: "עם עוף ופרמזן",
            en: "With grilled chicken and parmesan",
          },
          price: 72,
          imageFile: "ceasar_salad.jpg",
        }
      ),

      item(
        "fatoush",
        { ar: "جاط فوش", he: "פטוש", en: "Fatoush" },
        {
          description: {
            ar: "خيار، بندورة، خس، بصل، نعنع وسماق",
            he: "מלפפון, עגבניה, חסה, בצל, נענע וסומאק",
            en: "Cucumber, tomato, lettuce, onion, mint & sumac",
          },
          price: 54.5,
          imageFile: "Fatoush.jpg",
        }
      ),

      item(
        "jarjir_salad",
        { ar: "جاط جرجير", he: "סלט רוקט", en: "Arugula salad" },
        {
          price: 45,
          imageFile: "Jarjir_Salad.jpg",
        }
      ),

      item(
        "tabbouleh",
        { ar: "جاط تبولة", he: "טבולה", en: "Tabbouleh" },
        {
          price: 49,
          imageFile: "tabuleh2.jpg",
        }
      ),

      item(
        "sambusak",
        { ar: "معجنات 4 سمبوسك", he: "4 סמבוסק", en: "4 Sambusak pastries" },
        {
          price: 65,
          imageFile: "moajanat.jpg",
        }
      ),

      item(
        "hummus",
        { ar: "حمص بيتي", he: "חומוס ביתי", en: "Homemade hummus" },
        {
          price: 36,
          imageFile: "hummus.jpg",
        }
      ),

      item(
        "labaneh",
        { ar: "لبنة", he: "לבנה", en: "Labaneh" },
        {
          price: 35,
          imageFile: "labaneh.jpg",
        }
      ),

      item(
        "fried_cauliflower",
        { ar: "زهرة قرنبيط مقلي", he: "כרובית מטוגנת", en: "Fried cauliflower" },
        {
          price: 46,
        }
      ),

      item(
        "fried_arab_cheese",
        { ar: "جبنة عربية مقلية", he: "גבינה ערבית מטוגנת", en: "Fried Arabic cheese" },
        {
          price: 45,
          imageFile: "jebneh_fingers.jpg",
        }
      ),

      item(
        "grilled_eggplant",
        { ar: "باذنجان مشوي", he: "חציל על האש", en: "Grilled eggplant" },
        {
          price: 53,
          imageFile: "Baba_Ghanouj.jpg",
        }
      ),

      item(
        "french_fries",
        { ar: "بطاطا مقلية", he: "צ׳יפס", en: "French fries" },
        {
          price: 25,
        }
      ),
    ],
  },

  // ================== FROM OUR KITCHEN ==================
  {
    id: "from_our_kitchen",
    title: { ar: "من مطبخنا", he: "ממטבחנו", en: "From our kitchen" },
    items: [
      item("dish_of_the_day",
        { ar: "طبخة اليوم", he: "תבשיל היום", en: "Dish of the day" }),

      item("lentil_mujadara",
        { ar: "مجدرة عدس", he: "מג׳דרה עדשים", en: "Lentil mujadara" },
        { price: 48, imageFile: "Mjaddarah.jpg" }),

      item("mlokhia",
        { ar: "ملوخية", he: "מלוחיה", en: "Molokhia" },
        { price: 52, imageFile: "Mlokheyyeh.jpg" }),

      item("freekeh_almonds",
        { ar: "فريكة تقدم مع اللوز", he: "פריקה עם שקדים", en: "Freekeh with almonds" },
        { price: 55, imageFile: "Freekeh.jpg" }),

      item("shishbarak",
        { ar: "شيشبرك", he: "שישברק", en: "Shish Barak" },
        { price: 65, imageFile: "shishbarak.jpg" }),

      item("kibbeh_baked",
        { ar: "كبة بالصينية", he: "קובה בתבנית", en: "Baked kibbeh" },
        { price: 78, imageFile: "Kubbeh.jpg" }),

      item("mansaf",
        { ar: "منسف", he: "מנסף", en: "Mansaf" },
        { price: 138, imageFile: "mansaf.jpg" }),
    ],
  },

  // ================== MAIN DISHES ==================
  {
    id: "mains",
    title: { ar: "وجبات رئيسية", he: "עיקריות", en: "Main dishes" },
    items: [
      item("mixed_grill",
        { ar: "مشكل مشاوي", he: "מגש מעורב", en: "Mixed grill" },
        { price: 200 }),

      item("entrecote_300",
        { ar: "ستيك انتركوت 300 جرام", he: "אנטריקוט 300 גרם", en: "Entrecote 300g" },
        { price: 148 }),

      item("fried_fish",
        { ar: "فيليه سمك مقلي / كلماري", he: "פילה דג מטוגן / קלמרי", en: "Fried fish / calamari" },
        { price: 120, imageFile: "Fish_Fillet.jpg" }),

      item("grilled_shrimp",
        { ar: "قريدس مشوي", he: "שרימפס על הגריל", en: "Grilled shrimp" },
        { price: 95, imageFile: "shrimp_grill.jpg" }),

      item("salmon",
        { ar: "فيليه سلمون", he: "פילה סלמון", en: "Salmon fillet" },
        { price: 128, imageFile: "salmon.jpg" }),

      item("fish_of_the_day",
        { ar: "سمكة اليوم مع فريكة", he: "דג היום עם פריקה", en: "Fish of the day with freekeh" },
        { price: 98, imageFile: "Dennis_Fillet.jpg" }),

      item("chinese_shrimp",
        { ar: "قريدس صيني", he: "שרימפס סיני", en: "Chinese shrimp" },
        { price: 98, imageFile: "cream_shrimp.jpg" }),
    ],
  },

  // ================== PLATES ==================
  {
    id: "plates",
    title: { ar: "بالنص", he: "בצלחת", en: "Plates" },
    items: [
      item("sanat",
        { ar: "لسنات", he: "לסנאת", en: "Lsanat" },
        { price: 70, imageFile: "Toung.jpg" }),

      item("asian",
        { ar: "آسياتي", he: "אסיאתי", en: "Asian" },
        { price: 72, imageFile: "Asian.jpg" }),

      item("fajita",
        { ar: "فهيتا", he: "פחיטה", en: "Fajita" },
        { price: 70, imageFile: "Fahita.jpg" }),

      item("ravioli",
        { ar: "رافيولي", he: "רביולי", en: "Ravioli" },
        { price: 65, imageFile: "Raviolle.jpg" }),

      item("fish_and_chips",
        { ar: "فش اند تشيبس", he: "פיש אנד צ׳יפס", en: "Fish & chips" },
        { imageFile: "Fish_Fillet.jpg" }),

      item("arayes_shami",
        { ar: "عرايس شامية", he: "עראיס שמייה", en: "Shami arayes" },
        { price: 70, imageFile: "Arayes_Shami.jpg" }),

      item("sushi_arayes",
        { ar: "سوشي عرايس", he: "סושי ערייס", en: "Sushi arayes" },
        { price: 70, imageFile: "Sushi_Arayes.jpg" }),

      item("shnitzel",
        { ar: "شنيتسل", he: "שניצל", en: "Schnitzel" },
        { price: 72, imageFile: "shnitzel.jpg" }),

      item("chicken_breast",
        { ar: "صدر دجاج", he: "חזה עוף", en: "Chicken breast" },
        { price: 75 }),
    ],
  },
];
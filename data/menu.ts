// data/menu.ts
export type Lang = "he" | "ar" | "en";
export type MenuCategoryId =
  | "starters"
  | "seasonal"
  | "mains"
  | "cold_drinks"
  | "hot_drinks"
  | "desserts"
  | "hookah"
  | "white_wine"
  | "rose_wine"
  | "red_wine"
  | "arak"
  | "alcohol";

export type MenuItem = {
  id: string;
  category: MenuCategoryId;
  price?: number;
  image?: string | null;
  name: Record<Lang, string>;
  description?: Record<Lang, string>;
  tags?: string[];
  available?: boolean;
  featured?: boolean;
};

export type MenuCategory = {
  id: MenuCategoryId;
  title: Record<Lang, string>;
  items: MenuItem[];
};

const IMG_BASE = (process.env.NEXT_PUBLIC_MENU_IMAGE_BASE_URL || "").replace(/\/$/, "");

export function menuImageUrl(filename?: string | null) {
  if (!filename) return null;
  if (filename.startsWith("http://") || filename.startsWith("https://")) return filename;
  if (!IMG_BASE) return filename;
  return `${IMG_BASE}/${encodeURIComponent(filename)}`;
}

const item = (
  id: string,
  category: MenuCategoryId,
  name: Record<Lang, string>,
  opts?: {
    description?: Record<Lang, string>;
    price?: number;
    image?: string | null;
    tags?: string[];
    available?: boolean;
    featured?: boolean;
  }
): MenuItem => ({
  id,
  category,
  name,
  description: opts?.description,
  price: opts?.price,
  image: opts?.image ?? null,
  tags: opts?.tags,
  available: opts?.available ?? true,
  featured: opts?.featured ?? false,
});

export const MENU_CATEGORIES: Omit<MenuCategory, "items">[] = [
  { id: "starters", title: { he: "מנות פתיחה", ar: "مقبلات", en: "Starters" } },
  { id: "seasonal", title: { he: "תבשילים מהעונה", ar: "أطباق موسمية", en: "Seasonal dishes" } },
  { id: "mains", title: { he: "עיקריות", ar: "أطباق رئيسية", en: "Main dishes" } },
  { id: "cold_drinks", title: { he: "שתיה קרה", ar: "مشروبات باردة", en: "Cold drinks" } },
  { id: "hot_drinks", title: { he: "שתיה חמה", ar: "مشروبات ساخنة", en: "Hot drinks" } },
  { id: "desserts", title: { he: "קינוח", ar: "حلويات", en: "Desserts" } },
  { id: "hookah", title: { he: "נרגילה", ar: "أرجيلة", en: "Hookah" } },
  { id: "white_wine", title: { he: "יין לבן", ar: "نبيذ أبيض", en: "White wine" } },
  { id: "rose_wine", title: { he: "יין רוזה", ar: "نبيذ روزيه", en: "Rosé wine" } },
  { id: "red_wine", title: { he: "יין אדום", ar: "نبيذ أحمر", en: "Red wine" } },
  { id: "arak", title: { he: "ערק עזבה", ar: "عرق عزبة", en: "Arak Ezba" } },
  { id: "alcohol", title: { he: "אלכוהול", ar: "كحول", en: "Alcohol" } },
];

export const MENU_ITEMS: MenuItem[] = [
  // ---------------- Starters ----------------
  item("fattoush", "starters", { he: "פתוש", ar: "فتوش", en: "Fattoush" }, {
    price: 54,
    image: "Fatoush.jpg",
    tags: ["vegetarian"],
    description: {
      he: "מלפפונים, עגבניות, בצל, חסה, נענע עם קרוטוני פיתה",
      ar: "خيار، بندورة، بصل، خس، نعنع مع كروتوني خبز",
      en: "Cucumber, tomato, onion, lettuce, mint and pita croutons",
    },
  }),
  item("jarjir_salad", "starters", { he: "סלט ג׳רג׳יר", ar: "سلطة جرجير", en: "Jarjir salad" }, {
    price: 45,
    image: "Jarjir_Salad.jpg",
    tags: ["vegetarian"],
    description: {
      he: "בצל אדום, מתובל בשמן זית, לימון ורוטב רימונים",
      ar: "جرجير مع بصل أحمر، زيت زيتون، ليمون ودبس رمان",
      en: "Rocket leaves with red onion, olive oil, lemon and pomegranate dressing",
    },
  }),
  item("tabbouleh", "starters", { he: "סלט תבולה", ar: "تبولة", en: "Tabbouleh salad" }, {
    price: 49,
    image: "tabuleh2.jpg",
    tags: ["vegetarian"],
    description: {
      he: "פטרוזיליה חתוכה דק עם בורגול, מלפפון ועגבניות",
      ar: "بقدونس مفروم ناعم مع برغل، خيار وبندورة",
      en: "Finely chopped parsley with bulgur, cucumber and tomato",
    },
  }),
  item("moajanat", "starters", { he: "מועג׳נאת", ar: "معجنات", en: "Moajanat" }, {
    price: 62,
    image: "moajanat.jpg",
    description: {
      he: "בצקים ממולאים בגבינה, זעתר ובשר",
      ar: "معجنات محشوة بالجبنة، الزعتر واللحم",
      en: "Pastries filled with cheese, zaatar and meat",
    },
  }),
  item("hummus", "starters", { he: "חומוס", ar: "حمص", en: "Hummus" }, {
    price: 36,
    image: "hummus.jpg",
    tags: ["vegetarian"],
    description: {
      he: "גרגירים, פטרוזיליה, פפריקה ושמן זית, עם שתי פיתות",
      ar: "حمص مع حبوب، بقدونس، بابريكا وزيت زيتون، يقدم مع رغيفين",
      en: "With chickpeas, parsley, paprika and olive oil, served with two pitas",
    },
  }),
  item("labaneh", "starters", { he: "לבנה", ar: "لبنة", en: "Labaneh" }, {
    price: 35,
    image: "labaneh.jpg",
    tags: ["vegetarian"],
    description: {
      he: "מעוטרת בשמן זית כפר ראמה, מוגשת עם שתי פיתות",
      ar: "لبنة مع زيت زيتون من كفر راما، تقدم مع رغيفين",
      en: "Labaneh with Kfar Rama olive oil, served with two pitas",
    },
  }),
  item("zahra", "starters", { he: "זהרה", ar: "زهرة", en: "Fried cauliflower" }, {
    price: 46,
    image: null,
    tags: ["vegetarian"],
    description: {
      he: "כרובית מטוגנת עם רוטב טחינה, פטרוזיליה מעל",
      ar: "قرنبيط مقلي مع صلصة طحينة وبقدونس",
      en: "Fried cauliflower with tahini sauce and parsley",
    },
  }),
  item("jibneh", "starters", { he: "ג׳יבנה", ar: "جبنة", en: "Jibneh" }, {
    price: 45,
    image: "jebneh_fingers.jpg",
    tags: ["vegetarian"],
    description: {
      he: "צרובה בשמן זית, זעתר מעל",
      ar: "جبنة مشوية بزيت الزيتون مع زعتر",
      en: "Seared Arabic cheese with olive oil and zaatar",
    },
  }),
  item("grilled_eggplant", "starters", { he: "חציל בלדי על האש", ar: "باذنجان بلدي مشوي", en: "Grilled baladi eggplant" }, {
    price: 53,
    image: "Baba_Ghanouj.jpg",
    tags: ["vegetarian"],
    description: {
      he: "עם טחינה, לימון ושמן זית",
      ar: "مع طحينة، ليمون وزيت زيتون",
      en: "With tahini, lemon and olive oil",
    },
  }),
  item("potato_salad", "starters", { he: "סלט תפוחי אדמה", ar: "سلطة بطاطا", en: "Potato salad" }, {
    price: 34,
    image: "Poteto_Sallad.jpg",
    tags: ["vegetarian"],
    description: {
      he: "קוביות מתובלות בלימון, שום ושמן זית",
      ar: "مكعبات بطاطا متبلة بالليمون، الثوم وزيت الزيتون",
      en: "Seasoned potato cubes with lemon, garlic and olive oil",
    },
  }),

  // ---------------- Seasonal dishes ----------------
  item("dish_of_the_day", "seasonal", { he: "תבשיל היום", ar: "طبخة اليوم", en: "Dish of the day" }, {
    image: null,
    description: { he: "לשאול את המלצר", ar: "اسألوا النادل", en: "Ask the waiter" },
  }),
  item("khubeiza", "seasonal", { he: "חוביזה", ar: "خبيزة", en: "Khubeiza" }, {
    price: 48,
    image: "Khubbezeh.jpg",
    tags: ["vegetarian"],
    description: {
      he: "עם בורגול ובצל מקורמל בשמן זית כפר ראמה",
      ar: "مع برغل وبصل مكرمل بزيت زيتون كفر راما",
      en: "With bulgur and caramelized onion in Kfar Rama olive oil",
    },
  }),
  item("mujadara", "seasonal", { he: "מג׳דרה עדשים", ar: "مجدرة عدس", en: "Lentil mujadara" }, {
    price: 48,
    image: "Mjaddarah.jpg",
    tags: ["vegetarian"],
    description: {
      he: "עדשים עם בורגול ובצל מקורמל בשמן זית כפר ראמה",
      ar: "عدس مع برغل وبصل مكرمل بزيت زيتون كفر راما",
      en: "Lentils with bulgur and caramelized onion in Kfar Rama olive oil",
    },
  }),
  item("molokhia", "seasonal", { he: "עלי מלוכיה", ar: "ملوخية", en: "Molokhia" }, {
    price: 52,
    image: "Mlokheyyeh.jpg",
    description: {
      he: "עם שום, לימון וציר עוף, מוגשת על אורז לבן ואטריות",
      ar: "مع ثوم، ليمون ومرق دجاج، تقدم على أرز أبيض وشعيرية",
      en: "With garlic, lemon and chicken stock, served over white rice and vermicelli",
    },
  }),

  // ---------------- Main dishes ----------------
  item("mahshi", "mains", { he: "מחאשי", ar: "محاشي", en: "Mahshi" }, {
    price: 82,
    image: "mahashi.jpg",
    description: {
      he: "במילוי בשרי / טבעוני ברוטב עגבניות טריות. לשאול את המלצר. קטן 74 / גדול 82",
      ar: "محشي بحشوة لحم أو نباتي بصلصة بندورة طازجة. اسألوا النادل. صغير 74 / كبير 82",
      en: "Meat or vegan stuffed vegetables in fresh tomato sauce. Ask the waiter. Small 74 / large 82",
    },
  }),
  item("kubeh_laban", "mains", { he: "קובה בלבן", ar: "كبة بلبن", en: "Kubeh laban" }, {
    price: 88,
    image: "Kubbeh.jpg",
    description: {
      he: "כדורי קובה במילוי צמחוני / בשר ברוטב יוגורט. צמחוני 82 / בשרי 88",
      ar: "كرات كبة بحشوة نباتية أو لحم بصلصة لبن. نباتي 82 / لحم 88",
      en: "Kubeh balls with vegetarian or meat filling in yogurt sauce. Vegetarian 82 / meat 88",
    },
  }),
  item("laban_imo", "mains", { he: "לבן - אמו", ar: "لبن أمو", en: "Laban imo" }, {
    price: 95,
    image: null,
    description: {
      he: "בשר עגלה ברוטב יוגורט, אורז ואטריות בצד",
      ar: "لحم عجل بصلصة لبن، مع أرز وشعيرية جانباً",
      en: "Veal in yogurt sauce, served with rice and vermicelli on the side",
    },
  }),
  item("shishbarak", "mains", { he: "שישברק", ar: "شيشبرك", en: "Shishbarak" }, {
    price: 92,
    image: "shishbarak.jpg",
    description: {
      he: "כיסוני בצק במילוי בשר עגל בתיבול ביתי ביוגורט חם, שום ונענע. קטן 4 יח׳ 65 / גדול 7 יח׳ 92",
      ar: "كيس عجين محشو بلحم عجل بتتبيلة بيتية مع لبن ساخن، ثوم ونعنع. صغير 4 قطع 65 / كبير 7 قطع 92",
      en: "Dough pockets filled with seasoned veal in warm yogurt, garlic and mint. Small 4 pcs 65 / large 7 pcs 92",
    },
  }),
  item("kubeh_siniyeh", "mains", { he: "קובה סינייה", ar: "كبة صينية", en: "Kubeh siniyeh" }, {
    price: 86,
    image: "Kubbeh.jpg",
    description: {
      he: "במילוי בשרי / טבעוני, אפויה בתנור. קטן 78 / גדול 86",
      ar: "بحشوة لحم أو نباتية، مخبوزة بالفرن. صغير 78 / كبير 86",
      en: "Meat or vegan filling, baked in the oven. Small 78 / large 86",
    },
  }),
  item("ozi_beef_freekeh", "mains", { he: "אוזי בקר עם פריקה / חשווה", ar: "أوزي لحم مع فريكة / حشوة", en: "Beef ouzi – freekeh or hashwe" }, {
    price: 94,
    image: "Freekeh.jpg",
    description: {
      he: "פריקה (חיטה ירוקה מעושנת) או חשווה (אורז ובשר טחון), שקדים מעל",
      ar: "فريكة (قمح أخضر مدخن) أو حشوة (أرز ولحم مفروم)، مع لوز فوقه",
      en: "With freekeh (smoked green wheat) or hashwe (rice and minced meat), topped with almonds",
    },
  }),
  item("harimeh", "mains", { he: "פרגית סטייק בגריל", ar: "ستيك فخذ دجاج مشوي", en: "Grilled chicken thigh steak" }, {
    price: 79,
    image: null,
    description: {
      he: "מוגש עם אורז לבן ואטריות",
      ar: "يقدم مع أرز أبيض وشعيرية",
      en: "Served with white rice and vermicelli",
    },
  }),
  item("kebab_siniyeh", "mains", { he: "קבב סינייה", ar: "كباب صينية", en: "Kebab siniyeh" }, {
    price: 92,
    image: "Kebab_Tahini_Kufta.jpg",
    description: {
      he: "קציצות אפויות בטחינה",
      ar: "كفتة مشوية بالطحينة",
      en: "Baked kebab patties in tahini",
    },
  }),
  item("fish_of_the_day", "mains", { he: "דג היום", ar: "سمك اليوم", en: "Fish of the day" }, {
    price: 98,
    image: "Dennis_Fillet.jpg",
    description: {
      he: "פילה דג טרי מתובל עם שבבי בצל, עשבים וכורכום בתוספת פריקה",
      ar: "فيليه سمك طازج متبل مع رقائق بصل، أعشاب وكركم، مع فريكة",
      en: "Fresh fish fillet with onion flakes, herbs and turmeric, served with freekeh",
    },
  }),
  item("spicy_garlic_shrimp", "mains", { he: "שרימפס מוקפץ", ar: "روبيان مقلي", en: "Sautéed shrimp" }, {
    price: 98,
    image: "cream_shrimp.jpg",
    description: {
      he: "ברוטב שום, לימון ופלפל חריף",
      ar: "بصلصة ثوم، ليمون وفلفل حار",
      en: "With garlic sauce, lemon and hot pepper",
    },
  }),

  // ---------------- Cold drinks ----------------
  item("coca_cola", "cold_drinks", { he: "קוקה קולה / זירו", ar: "كوكا كولا / زيرو", en: "Coca-Cola / Zero" }, { price: 14 }),
  item("sprite", "cold_drinks", { he: "ספרייט ליים / זירו", ar: "سبرايت لايم / زيرو", en: "Sprite Lime / Zero" }, { price: 14 }),
  item("nordic_soda", "cold_drinks", { he: "נורדיק מיסט סודה", ar: "نورديك ميست صودا", en: "Nordic Mist soda" }, { price: 12 }),
  item("mineral_water", "cold_drinks", { he: "נביעות מים מינרלים", ar: "مياه معدنية", en: "Mineral water" }, { price: 11, description: { he: "קטן / גדול 18", ar: "صغير / كبير 18", en: "Small / large 18" } }),
  item("perelle", "cold_drinks", { he: "פרללה 750מ״ל", ar: "بيرليه 750 مل", en: "Perelle 750ml" }, { price: 22 }),
  item("black_beer", "cold_drinks", { he: "מאלטי בירה שחורה", ar: "بيرة سوداء مالتي", en: "Malty black beer" }, { price: 15 }),
  item("natural_lemonade", "cold_drinks", { he: "לימונדה טבעית", ar: "ليمونادة طبيعية", en: "Natural lemonade" }, { price: 16, description: { he: "קטן / גדול 32", ar: "صغير / كبير 32", en: "Small / large 32" } }),
  item("rosetta", "cold_drinks", { he: "מיץ שקדים רוזטה", ar: "شراب لوز روزاتا", en: "Rosetta almond drink" }, { price: 16, description: { he: "קטן / גדול 35", ar: "صغير / كبير 35", en: "Small / large 35" } }),
  item("virgin_mojito", "cold_drinks", { he: "מוחיטו ללא אלכוהול", ar: "موهيتو بدون كحول", en: "Virgin mojito" }, { price: 42 }),

  // ---------------- Hot drinks ----------------
  item("espresso", "hot_drinks", { he: "אספרסו / כפול", ar: "إسبريسو / دبل", en: "Espresso / double" }, { price: 12, description: { he: "כפול 14", ar: "دبل 14", en: "Double 14" } }),
  item("cappuccino", "hot_drinks", { he: "הפוך", ar: "كابتشينو", en: "Cappuccino" }, { price: 16 }),
  item("americano", "hot_drinks", { he: "אמריקאנו", ar: "أمريكانو", en: "Americano" }, { price: 15 }),
  item("iced_coffee", "hot_drinks", { he: "קפה קר", ar: "قهوة باردة", en: "Iced coffee" }, { price: 18 }),
  item("black_coffee", "hot_drinks", { he: "קפה שחור", ar: "قهوة سوداء", en: "Black coffee" }, { price: 10, description: { he: "קטן / גדול 27", ar: "صغير / كبير 27", en: "Small / large 27" } }),
  item("hot_or_cold_chocolate", "hot_drinks", { he: "שוקו חם / קר", ar: "شوكو ساخن / بارد", en: "Hot / cold chocolate" }, { price: 18 }),
  item("tea", "hot_drinks", { he: "תה נענע / צמחים", ar: "شاي نعنع / أعشاب", en: "Mint / herbal tea" }, { price: 12, description: { he: "צמחים 16", ar: "أعشاب 16", en: "Herbal 16" } }),

  // ---------------- Desserts ----------------
  item("sufle", "desserts", { he: "סופלה שוקולד", ar: "سوفليه شوكولاتة", en: "Chocolate soufflé" }, { price: 45, image: null }),
  item("malabi", "desserts", { he: "מלבי", ar: "مهلبية", en: "Malabi" }, { price: 22, image: "malabi.jpg", description: { he: "סירופ, טחינה ואגוזים", ar: "شراب وطحينة ومكسرات", en: "Syrup, tahini and nuts" } }),
  item("layali_beirut", "desserts", { he: "ליאלי ביירות", ar: "ليالي بيروت", en: "Layali Beirut" }, { price: 38, image: "Layali_Beyrout.jpg", description: { he: "עוגת סולת קרה עם קרם וניל, סירופ מי סוכר ופיסטוקים מעל", ar: "كعكة سميد باردة مع كريمة فانيلا وقطر وفستق", en: "Cold semolina cake with vanilla cream, syrup and pistachios" } }),
  item("minerva_cake", "desserts", { he: "עוגת מינרווה", ar: "كيكة مينيرفا", en: "Minerva cake" }, { price: 52, image: "Minervas_Cake.jpg", description: { he: "עוגת סולת וגבינה, מוגשת חמה עם סירופ מתוק", ar: "كيكة سميد وجبنة تقدم ساخنة مع شراب حلو", en: "Semolina and cheese cake, served warm with sweet syrup" } }),

  // ---------------- Hookah ----------------
  item("hookah", "hookah", { he: "לימונענע / לאב", ar: "ليمون نعنع / لاف", en: "Lemon-mint / Love" }, { price: 66 }),
  item("hookah_apple", "hookah", { he: "תפוחים", ar: "تفاح", en: "Apple" }, { price: 50 }),

  // ---------------- Wine ----------------
  item("white_teperberg", "white_wine", { he: "סוביניון בלאן - שרדונה, טפרברג", ar: "سوفينيون بلان - شاردونيه، تبرغ", en: "Sauvignon Blanc - Chardonnay, Teperberg" }, { price: 31, description: { he: "כוס / בקבוק 112", ar: "كأس / زجاجة 112", en: "Glass / bottle 112" } }),
  item("white_shvo", "white_wine", { he: "סוביניון בלאן, שבו", ar: "سوفينيون بلان، شڤو", en: "Sauvignon Blanc, Shvo" }, { price: 179 }),
  item("white_ashkar", "white_wine", { he: "שרדונה, אשקר", ar: "شاردونيه، أشكر", en: "Chardonnay, Ashkar" }, { price: 163 }),
  item("rose_teperberg", "rose_wine", { he: "טפרברג", ar: "تبرغ", en: "Teperberg" }, { price: 33, description: { he: "כוס / בקבוק 115", ar: "كأس / زجاجة 115", en: "Glass / bottle 115" } }),
  item("rose_shvo", "rose_wine", { he: "שבו", ar: "شڤو", en: "Shvo" }, { price: 173 }),
  item("rose_ashkar", "rose_wine", { he: "אשקר", ar: "أشكر", en: "Ashkar" }, { price: 169 }),
  item("red_teperberg", "red_wine", { he: "קברנה סוביניון - מרלו, טפרברג", ar: "كابرنيه سوفينيون - ميرلو، تبرغ", en: "Cabernet Sauvignon - Merlot, Teperberg" }, { price: 31, description: { he: "כוס / בקבוק 109", ar: "كأس / زجاجة 109", en: "Glass / bottle 109" } }),
  item("red_ashkar", "red_wine", { he: "קברנה סוביניון, אשקר", ar: "كابرنيه سوفينيون، أشكر", en: "Cabernet Sauvignon, Ashkar" }, { price: 185 }),
  item("red_shvo", "red_wine", { he: "אדום, שבו", ar: "أحمر، شڤو", en: "Red, Shvo" }, { price: 193 }),

  // ---------------- Arak / alcohol ----------------
  item("arak_glass", "arak", { he: "כוס ערק", ar: "كأس عرق", en: "Arak glass" }, { price: 35, image: "arak_small.jpg", description: { he: "ערק בייצור ביתי מענבים ואניס ירוק", ar: "عرق محلي من العنب واليانسون الأخضر", en: "Homemade arak from grapes and green anise" } }),
  item("arak_pitcher", "arak", { he: "קנקן ערק", ar: "إبريق عرق", en: "Arak pitcher" }, { price: 110, image: "arak_big.jpg", description: { he: "עם מים וקרח", ar: "مع ماء وثلج", en: "With water and ice" } }),
  item("arak_bottle", "arak", { he: "בקבוק ערק 750מ״ל", ar: "زجاجة عرق 750 مل", en: "Arak bottle 750ml" }, { price: 190 }),
  item("arak_pomegranate", "arak", { he: "קוקטייל ערק רימונים", ar: "كوكتيل عرق رمان", en: "Pomegranate arak cocktail" }, { price: 44 }),
  item("arak_lemon", "arak", { he: "קוקטייל ערק לימונים", ar: "كوكتيل عرق ليمون", en: "Lemon arak cocktail" }, { price: 42 }),
  item("sheleg_beer", "alcohol", { he: "בירה טייבה שליש", ar: "بيرة طيبة ثلث", en: "Taybeh beer 1/3" }, { price: 33 }),
  item("aperol_campari", "alcohol", { he: "אפרול / קמפרי", ar: "أبيرول / كامباري", en: "Aperol / Campari" }, { price: 24, description: { he: "כפול 44", ar: "دبل 44", en: "Double 44" } }),
  item("gin_gordon", "alcohol", { he: "ג׳ין גורדונס", ar: "جن غوردونز", en: "Gordon's gin" }, { price: 24, description: { he: "כפול 44", ar: "دبل 44", en: "Double 44" } }),
  item("vodka_grey_goose", "alcohol", { he: "וודקה גריי גוס", ar: "فودكا غراي غوس", en: "Grey Goose vodka" }, { price: 25, description: { he: "כפול 45", ar: "دبل 45", en: "Double 45" } }),
  item("vodka_finlandia", "alcohol", { he: "וודקה פינלנדיה", ar: "فودكا فنلنديا", en: "Finlandia vodka" }, { price: 22, description: { he: "כפול 38", ar: "دبل 38", en: "Double 38" } }),
  item("tequila", "alcohol", { he: "טקילה", ar: "تيكيلا", en: "Tequila" }, { price: 24, description: { he: "כפול 42", ar: "دبل 42", en: "Double 42" } }),
  item("jagermeister", "alcohol", { he: "ייגרמייסטר", ar: "ياغرمايستر", en: "Jägermeister" }, { price: 29, description: { he: "כפול 50", ar: "دبل 50", en: "Double 50" } }),
  item("whiskey_jack", "alcohol", { he: "וודקה / ג׳ין עם ערבוב", ar: "فودكا / جن مع مشروب", en: "Vodka / gin with mixer" }, { price: 48 }),
  item("aperol_spritz", "alcohol", { he: "אפרול שפריץ / נגרוני", ar: "أبيرول سبريتز / نيغروني", en: "Aperol Spritz / Negroni" }, { price: 48 }),
  item("mojito", "alcohol", { he: "מוחיטו", ar: "موهيتو", en: "Mojito" }, { price: 48 }),
  item("black_label", "alcohol", { he: "בלאק לייבל", ar: "بلاك ليبل", en: "Black Label" }, { price: 27, description: { he: "כפול 46 / בקבוק 320", ar: "دبل 46 / زجاجة 320", en: "Double 46 / bottle 320" } }),
  item("macallan_12", "alcohol", { he: "מקאלן 12", ar: "ماكالان 12", en: "Macallan 12" }, { price: 75, description: { he: "בקבוק 825", ar: "زجاجة 825", en: "Bottle 825" } }),
  item("chasers", "alcohol", { he: "8 צ׳ייסרים", ar: "8 شوتات", en: "8 chasers" }, { price: 120 }),
];

export const MENU: MenuCategory[] = MENU_CATEGORIES.map((cat) => ({
  id: cat.id,
  title: cat.title,
  items: MENU_ITEMS.filter((it) => it.category === cat.id),
}));

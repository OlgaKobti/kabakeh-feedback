-- Run this second in Supabase SQL Editor (after 01_schema.sql)
-- Seeds all menu categories and items

-- ── Categories ──────────────────────────────────────────
insert into menu_categories (id, title_he, title_ar, title_en, sort_order) values
  ('starters',    'מנות פתיחה',       'مقبلات',            'Starters',        1),
  ('seasonal',    'תבשילים מהעונה',   'أطباق موسمية',      'Seasonal dishes', 2),
  ('mains',       'עיקריות',          'أطباق رئيسية',      'Main dishes',     3),
  ('cold_drinks', 'שתיה קרה',         'مشروبات باردة',     'Cold drinks',     4),
  ('hot_drinks',  'שתיה חמה',         'مشروبات ساخنة',     'Hot drinks',      5),
  ('desserts',    'קינוח',            'حلويات',            'Desserts',        6),
  ('hookah',      'נרגילה',           'أرجيلة',            'Hookah',          7),
  ('white_wine',  'יין לבן',          'نبيذ أبيض',         'White wine',      8),
  ('rose_wine',   'יין רוזה',         'نبيذ روزيه',        'Rosé wine',       9),
  ('red_wine',    'יין אדום',         'نبيذ أحمر',         'Red wine',        10),
  ('arak',        'ערק עזבה',         'عرق عزبة',          'Arak Ezba',       11),
  ('alcohol',     'אלכוהול',          'كحول',              'Alcohol',         12);

-- ── Starters ────────────────────────────────────────────
insert into menu_items (id, category_id, name_he, name_ar, name_en, description_he, description_ar, description_en, price, image, sort_order) values
  ('fattoush',         'starters', 'פתוש',              'فتوش',             'Fattoush',               'מלפפונים, עגבניות, בצל, חסה, נענע עם קרוטוני פיתה', 'خيار، بندورة، بصل، خس، نعنع مع كروتوني خبز', 'Cucumber, tomato, onion, lettuce, mint and pita croutons', 54,   'Fatoush.jpg',        1),
  ('jarjir_salad',     'starters', 'סלט ג׳רג׳יר',       'سلطة جرجير',       'Jarjir salad',           'בצל אדום, מתובל בשמן זית, לימון ורוטב רימונים', 'جرجير مع بصل أحمر، زيت زيتون، ليمون ودبس رمان', 'Rocket leaves with red onion, olive oil, lemon and pomegranate dressing', 45, 'Jarjir_Salad.jpg',   2),
  ('tabbouleh',        'starters', 'סלט תבולה',         'تبولة',            'Tabbouleh salad',        'פטרוזיליה חתוכה דק עם בורגול, מלפפון ועגבניות', 'بقدونس مفروم ناعم مع برغل، خيار وبندورة', 'Finely chopped parsley with bulgur, cucumber and tomato', 49, 'tabuleh2.jpg',       3),
  ('moajanat',         'starters', 'מועג׳נאת',          'معجنات',           'Moajanat',               'בצקים ממולאים בגבינה, זעתר ובשר', 'معجنات محشوة بالجبنة، الزعتر واللحم', 'Pastries filled with cheese, zaatar and meat', 62, 'moajanat.jpg',       4),
  ('hummus',           'starters', 'חומוס',             'حمص',              'Hummus',                 'גרגירים, פטרוזיליה, פפריקה ושמן זית, עם שתי פיתות', 'حمص مع حبوب، بقدونس، بابريكا وزيت زيتون، يقدم مع رغيفين', 'With chickpeas, parsley, paprika and olive oil, served with two pitas', 36, 'hummus.jpg',         5),
  ('labaneh',          'starters', 'לבנה',              'لبنة',             'Labaneh',                'מעוטרת בשמן זית כפר ראמה, מוגשת עם שתי פיתות', 'لبنة مع زيت زيتون من كفر راما، تقدم مع رغيفين', 'Labaneh with Kfar Rama olive oil, served with two pitas', 35, 'labaneh.jpg',        6),
  ('zahra',            'starters', 'זהרה',              'زهرة',             'Fried cauliflower',      'כרובית מטוגנת עם רוטב טחינה, פטרוזיליה מעל', 'قرنبيط مقلي مع صلصة طحينة وبقدونس', 'Fried cauliflower with tahini sauce and parsley', 46, null,                 7),
  ('jibneh',           'starters', 'ג׳יבנה',            'جبنة',             'Jibneh',                 'צרובה בשמן זית, זעתר מעל', 'جبنة مشوية بزيت الزيتون مع زعتر', 'Seared Arabic cheese with olive oil and zaatar', 45, 'jebneh_fingers.jpg', 8),
  ('grilled_eggplant', 'starters', 'חציל בלדי על האש', 'باذنجان بلدي مشوي','Grilled baladi eggplant','עם טחינה, לימון ושמן זית', 'مع طحينة، ليمون وزيت زيتون', 'With tahini, lemon and olive oil', 53, 'Baba_Ghanouj.jpg',   9),
  ('potato_salad',     'starters', 'סלט תפוחי אדמה',   'سلطة بطاطا',       'Potato salad',           'קוביות מתובלות בלימון, שום ושמן זית', 'مكعبات بطاطا متبلة بالليمون، الثوم وزيت الزيتون', 'Seasoned potato cubes with lemon, garlic and olive oil', 34, 'Poteto_Sallad.jpg',  10);

-- ── Seasonal ─────────────────────────────────────────────
insert into menu_items (id, category_id, name_he, name_ar, name_en, description_he, description_ar, description_en, price, image, sort_order) values
  ('dish_of_the_day', 'seasonal', 'תבשיל היום',    'طبخة اليوم', 'Dish of the day',  'לשאול את המלצר', 'اسألوا النادل', 'Ask the waiter', null, null,            1),
  ('khubeiza',        'seasonal', 'חוביזה',        'خبيزة',      'Khubeiza',         'עם בורגול ובצל מקורמל בשמן זית כפר ראמה', 'مع برغل وبصل مكرمل بزيت زيتون كفر راما', 'With bulgur and caramelized onion in Kfar Rama olive oil', 48, 'Khubbezeh.jpg', 2),
  ('mujadara',        'seasonal', 'מג׳דרה עדשים', 'مجدرة عدس',  'Lentil mujadara',  'עדשים עם בורגול ובצל מקורמל בשמן זית כפר ראמה', 'عدس مع برغل وبصل مكرمل بزيت زيتون كفر راما', 'Lentils with bulgur and caramelized onion in Kfar Rama olive oil', 48, 'Mjaddarah.jpg', 3),
  ('molokhia',        'seasonal', 'עלי מלוכיה',   'ملوخية',     'Molokhia',         'עם שום, לימון וציר עוף, מוגשת על אורז לבן ואטריות', 'مع ثوم، ليمون ومرق دجاج، تقدم على أرز أبيض وشعيرية', 'With garlic, lemon and chicken stock, served over white rice and vermicelli', 52, 'Mlokheyyeh.jpg', 4);

-- ── Mains ────────────────────────────────────────────────
insert into menu_items (id, category_id, name_he, name_ar, name_en, description_he, description_ar, description_en, price, image, sort_order) values
  ('mahshi',            'mains', 'מחאשי',                     'محاشي',                   'Mahshi',                      'במילוי בשרי / טבעוני ברוטב עגבניות טריות. לשאול את המלצר. קטן 74 / גדול 82', 'محشي بحشوة لحم أو نباتي بصلصة بندورة طازجة. اسألوا النادل. صغير 74 / كبير 82', 'Meat or vegan stuffed vegetables in fresh tomato sauce. Ask the waiter. Small 74 / large 82', 82, 'mahashi.jpg',           1),
  ('kubeh_laban',       'mains', 'קובה בלבן',                 'كبة بلبن',                'Kubeh laban',                 'כדורי קובה במילוי צמחוני / בשר ברוטב יוגורט. צמחוני 82 / בשרי 88', 'كرات كبة بحشوة نباتية أو لحم بصلصة لبن. نباتي 82 / لحم 88', 'Kubeh balls with vegetarian or meat filling in yogurt sauce. Vegetarian 82 / meat 88', 88, 'Kubbeh.jpg',            2),
  ('laban_imo',         'mains', 'לבן - אמו',                 'لبن أمو',                 'Laban imo',                   'בשר עגלה ברוטב יוגורט, אורז ואטריות בצד', 'لحم عجل بصلصة لبن، مع أرز وشعيرية جانباً', 'Veal in yogurt sauce, served with rice and vermicelli on the side', 95, null,                    3),
  ('shishbarak',        'mains', 'שישברק',                    'شيشبرك',                  'Shishbarak',                  'כיסוני בצק במילוי בשר עגל בתיבול ביתי ביוגורט חם, שום ונענע. קטן 4 יח׳ 65 / גדול 7 יח׳ 92', 'كيس عجين محشو بلحم عجل بتتبيلة بيتية مع لبن ساخن، ثوم ونعنع. صغير 4 قطع 65 / كبير 7 قطع 92', 'Dough pockets filled with seasoned veal in warm yogurt, garlic and mint. Small 4 pcs 65 / large 7 pcs 92', 92, 'shishbarak.jpg',        4),
  ('kubeh_siniyeh',     'mains', 'קובה סינייה',               'كبة صينية',               'Kubeh siniyeh',               'במילוי בשרי / טבעוני, אפויה בתנור. קטן 78 / גדול 86', 'بحشوة لحم أو نباتية، مخبوزة بالفرن. صغير 78 / كبير 86', 'Meat or vegan filling, baked in the oven. Small 78 / large 86', 86, 'Kubbeh.jpg',            5),
  ('ozi_beef_freekeh',  'mains', 'אוזי בקר עם פריקה / חשווה', 'أوزي لحم مع فريكة / حشوة','Beef ouzi – freekeh or hashwe','פריקה (חיטה ירוקה מעושנת) או חשווה (אורז ובשר טחון), שקדים מעל', 'فريكة (قمح أخضر مدخن) أو حشوة (أرز ولحم مفروم)، مع لوز فوقه', 'With freekeh (smoked green wheat) or hashwe (rice and minced meat), topped with almonds', 94, 'Freekeh.jpg',           6),
  ('harimeh',           'mains', 'פרגית סטייק בגריל',        'ستيك فخذ دجاج مشوي',     'Grilled chicken thigh steak', 'מוגש עם אורז לבן ואטריות', 'يقدم مع أرز أبيض وشعيرية', 'Served with white rice and vermicelli', 79, null,                    7),
  ('kebab_siniyeh',     'mains', 'קבב סינייה',                'كباب صينية',              'Kebab siniyeh',               'קציצות אפויות בטחינה', 'كفتة مشوية بالطحينة', 'Baked kebab patties in tahini', 92, 'Kebab_Tahini_Kufta.jpg', 8),
  ('fish_of_the_day',   'mains', 'דג היום',                   'سمك اليوم',               'Fish of the day',             'פילה דג טרי מתובל עם שבבי בצל, עשבים וכורכום בתוספת פריקה', 'فيليه سمك طازج متبل مع رقائق بصل، أعشاب وكركم، مع فريكة', 'Fresh fish fillet with onion flakes, herbs and turmeric, served with freekeh', 98, 'Dennis_Fillet.jpg',     9),
  ('spicy_garlic_shrimp','mains','שרימפס מוקפץ',              'روبيان مقلي',             'Sautéed shrimp',              'ברוטב שום, לימון ופלפל חריף', 'بصلصة ثوم، ليمون وفلفل حار', 'With garlic sauce, lemon and hot pepper', 98, 'cream_shrimp.jpg',     10);

-- ── Cold drinks ──────────────────────────────────────────
insert into menu_items (id, category_id, name_he, name_ar, name_en, description_he, description_ar, description_en, price, sort_order) values
  ('coca_cola',        'cold_drinks', 'קוקה קולה / זירו',   'كوكا كولا / زيرو',    'Coca-Cola / Zero',     null,            null,            null,               14, 1),
  ('sprite',           'cold_drinks', 'ספרייט ליים / זירו', 'سبرايت لايم / زيرو',  'Sprite Lime / Zero',   null,            null,            null,               14, 2),
  ('nordic_soda',      'cold_drinks', 'נורדיק מיסט סודה',   'نورديك ميست صودا',     'Nordic Mist soda',     null,            null,            null,               12, 3),
  ('mineral_water',    'cold_drinks', 'נביעות מים מינרלים', 'مياه معدنية',          'Mineral water',        'קטן / גדול 18', 'صغير / كبير 18','Small / large 18', 11, 4),
  ('perelle',          'cold_drinks', 'פרללה 750מ״ל',       'بيرليه 750 مل',        'Perelle 750ml',        null,            null,            null,               22, 5),
  ('black_beer',       'cold_drinks', 'מאלטי בירה שחורה',   'بيرة سوداء مالتي',     'Malty black beer',     null,            null,            null,               15, 6),
  ('natural_lemonade', 'cold_drinks', 'לימונדה טבעית',      'ليمونادة طبيعية',      'Natural lemonade',     'קטן / גדול 32', 'صغير / كبير 32','Small / large 32', 16, 7),
  ('rosetta',          'cold_drinks', 'מיץ שקדים רוזטה',    'شراب لوز روزاتا',      'Rosetta almond drink', 'קטן / גדול 35', 'صغير / كبير 35','Small / large 35', 16, 8),
  ('virgin_mojito',    'cold_drinks', 'מוחיטו ללא אלכוהול', 'موهيتو بدون كحول',     'Virgin mojito',        null,            null,            null,               42, 9);

-- ── Hot drinks ───────────────────────────────────────────
insert into menu_items (id, category_id, name_he, name_ar, name_en, description_he, description_ar, description_en, price, sort_order) values
  ('espresso',              'hot_drinks', 'אספרסו / כפול',   'إسبريسو / دبل',     'Espresso / double',    'כפול 14',       'دبل 14',        'Double 14',        12, 1),
  ('cappuccino',            'hot_drinks', 'הפוך',             'كابتشينو',           'Cappuccino',           null,            null,            null,               16, 2),
  ('americano',             'hot_drinks', 'אמריקאנו',         'أمريكانو',           'Americano',            null,            null,            null,               15, 3),
  ('iced_coffee',           'hot_drinks', 'קפה קר',           'قهوة باردة',         'Iced coffee',          null,            null,            null,               18, 4),
  ('black_coffee',          'hot_drinks', 'קפה שחור',         'قهوة سوداء',         'Black coffee',         'קטן / גדול 27', 'صغير / كبير 27','Small / large 27', 10, 5),
  ('hot_or_cold_chocolate', 'hot_drinks', 'שוקו חם / קר',     'شوكو ساخن / بارد',   'Hot / cold chocolate', null,            null,            null,               18, 6),
  ('tea',                   'hot_drinks', 'תה נענע / צמחים',  'شاي نعنع / أعشاب',  'Mint / herbal tea',    'צמחים 16',      'أعشاب 16',      'Herbal 16',        12, 7);

-- ── Desserts ─────────────────────────────────────────────
insert into menu_items (id, category_id, name_he, name_ar, name_en, description_he, description_ar, description_en, price, image, sort_order) values
  ('sufle',         'desserts', 'סופלה שוקולד', 'سوفليه شوكولاتة', 'Chocolate soufflé', null,                                                        null,                                          null,                                                          45, null,                 1),
  ('malabi',        'desserts', 'מלבי',         'مهلبية',           'Malabi',            'סירופ, טחינה ואגוזים',                                      'شراب وطحينة ومكسرات',                         'Syrup, tahini and nuts',                                      22, 'malabi.jpg',         2),
  ('layali_beirut', 'desserts', 'ליאלי ביירות', 'ليالي بيروت',      'Layali Beirut',     'עוגת סולת קרה עם קרם וניל, סירופ מי סוכר ופיסטוקים מעל', 'كعكة سميد باردة مع كريمة فانيلا وقطر وفستق', 'Cold semolina cake with vanilla cream, syrup and pistachios', 38, 'Layali_Beyrout.jpg', 3),
  ('minerva_cake',  'desserts', 'עוגת מינרווה', 'كيكة مينيرفا',     'Minerva cake',      'עוגת סולת וגבינה, מוגשת חמה עם סירופ מתוק',               'كيكة سميد وجبنة تقدم ساخنة مع شراب حلو',     'Semolina and cheese cake, served warm with sweet syrup',     52, 'Minervas_Cake.jpg',  4);

-- ── Hookah ───────────────────────────────────────────────
insert into menu_items (id, category_id, name_he, name_ar, name_en, price, sort_order) values
  ('hookah',       'hookah', 'לימונענע / לאב', 'ليمون نعنع / لاف', 'Lemon-mint / Love', 66, 1),
  ('hookah_apple', 'hookah', 'תפוחים',         'تفاح',              'Apple',             50, 2);

-- ── White wine ───────────────────────────────────────────
insert into menu_items (id, category_id, name_he, name_ar, name_en, description_he, description_ar, description_en, price, sort_order) values
  ('white_teperberg', 'white_wine', 'סוביניון בלאן - שרדונה, טפרברג', 'سوفينيون بلان - شاردونيه، تبرغ', 'Sauvignon Blanc - Chardonnay, Teperberg', 'כוס / בקבוק 112', 'كأس / زجاجة 112', 'Glass / bottle 112',  31,  1),
  ('white_shvo',      'white_wine', 'סוביניון בלאן, שבו',              'سوفينيون بلان، شڤو',              'Sauvignon Blanc, Shvo',                  null,               null,               null,                 179, 2),
  ('white_ashkar',    'white_wine', 'שרדונה, אשקר',                    'شاردونيه، أشكر',                  'Chardonnay, Ashkar',                     null,               null,               null,                 163, 3);

-- ── Rosé wine ────────────────────────────────────────────
insert into menu_items (id, category_id, name_he, name_ar, name_en, description_he, description_ar, description_en, price, sort_order) values
  ('rose_teperberg', 'rose_wine', 'טפרברג', 'تبرغ',  'Teperberg', 'כוס / בקבוק 115', 'كأس / زجاجة 115', 'Glass / bottle 115',  33,  1),
  ('rose_shvo',      'rose_wine', 'שבו',    'شڤو',   'Shvo',      null,               null,               null,                 173, 2),
  ('rose_ashkar',    'rose_wine', 'אשקר',   'أشكر',  'Ashkar',    null,               null,               null,                 169, 3);

-- ── Red wine ─────────────────────────────────────────────
insert into menu_items (id, category_id, name_he, name_ar, name_en, description_he, description_ar, description_en, price, sort_order) values
  ('red_teperberg', 'red_wine', 'קברנה סוביניון - מרלו, טפרברג', 'كابرنيه سوفينيون - ميرلو، تبرغ', 'Cabernet Sauvignon - Merlot, Teperberg', 'כוס / בקבוק 109', 'كأس / زجاجة 109', 'Glass / bottle 109',  31,  1),
  ('red_ashkar',    'red_wine', 'קברנה סוביניון, אשקר',           'كابرنيه سوفينيون، أشكر',          'Cabernet Sauvignon, Ashkar',             null,               null,               null,                 185, 2),
  ('red_shvo',      'red_wine', 'אדום, שבו',                      'أحمر، شڤو',                       'Red, Shvo',                             null,               null,               null,                 193, 3);

-- ── Arak ─────────────────────────────────────────────────
insert into menu_items (id, category_id, name_he, name_ar, name_en, description_he, description_ar, description_en, price, sort_order) values
  ('arak_glass',        'arak', 'כוס ערק',           'كأس عرق',          'Arak glass',               'ערק בייצור ביתי מענבים ואניס ירוק', 'عرق محلي من العنب واليانسون الأخضر', 'Homemade arak from grapes and green anise', 35,  1),
  ('arak_pitcher',      'arak', 'קנקן ערק',           'إبريق عرق',        'Arak pitcher',             'עם מים וקרח',                       'مع ماء وثلج',                         'With water and ice',                        110, 2),
  ('arak_bottle',       'arak', 'בקבוק ערק 750מ״ל',  'زجاجة عرق 750 مل', 'Arak bottle 750ml',        null,                                null,                                  null,                                        190, 3),
  ('arak_pomegranate',  'arak', 'קוקטייל ערק רימונים','كوكتيل عرق رمان',  'Pomegranate arak cocktail',null,                                null,                                  null,                                        44,  4),
  ('arak_lemon',        'arak', 'קוקטייל ערק לימונים','كوكتيل عرق ليمون', 'Lemon arak cocktail',      null,                                null,                                  null,                                        42,  5);

-- ── Alcohol ──────────────────────────────────────────────
insert into menu_items (id, category_id, name_he, name_ar, name_en, description_he, description_ar, description_en, price, sort_order) values
  ('sheleg_beer',    'alcohol', 'בירה טייבה שליש',         'بيرة طيبة ثلث',          'Taybeh beer 1/3',         null,                    null,                null,                    33,  1),
  ('aperol_campari', 'alcohol', 'אפרול / קמפרי',           'أبيرول / كامباري',        'Aperol / Campari',        'כפול 44',               'دبل 44',            'Double 44',             24,  2),
  ('gin_gordon',     'alcohol', 'ג׳ין גורדונס',            'جن غوردونز',              'Gordon''s gin',           'כפול 44',               'دبل 44',            'Double 44',             24,  3),
  ('vodka_grey_goose','alcohol','וודקה גריי גוס',           'فودكا غراي غوس',          'Grey Goose vodka',        'כפול 45',               'دبل 45',            'Double 45',             25,  4),
  ('vodka_finlandia', 'alcohol','וודקה פינלנדיה',           'فودكا فنلنديا',           'Finlandia vodka',         'כפול 38',               'دبل 38',            'Double 38',             22,  5),
  ('tequila',        'alcohol', 'טקילה',                   'تيكيلا',                  'Tequila',                 'כפול 42',               'دبل 42',            'Double 42',             24,  6),
  ('jagermeister',   'alcohol', 'ייגרמייסטר',              'ياغرمايستر',              'Jägermeister',            'כפול 50',               'دبل 50',            'Double 50',             29,  7),
  ('whiskey_jack',   'alcohol', 'וודקה / ג׳ין עם ערבוב',  'فودكا / جن مع مشروب',    'Vodka / gin with mixer',  null,                    null,                null,                    48,  8),
  ('aperol_spritz',  'alcohol', 'אפרול שפריץ / נגרוני',   'أبيرول سبريتز / نيغروني', 'Aperol Spritz / Negroni', null,                    null,                null,                    48,  9),
  ('mojito',         'alcohol', 'מוחיטו',                  'موهيتو',                  'Mojito',                  null,                    null,                null,                    48,  10),
  ('black_label',    'alcohol', 'בלאק לייבל',              'بلاك ليبل',               'Black Label',             'כפול 46 / בקבוק 320',   'دبل 46 / زجاجة 320','Double 46 / bottle 320',27,  11),
  ('macallan_12',    'alcohol', 'מקאלן 12',                'ماكالان 12',              'Macallan 12',             'בקבוק 825',             'زجاجة 825',         'Bottle 825',            75,  12),
  ('chasers',        'alcohol', '8 צ׳ייסרים',             '8 شوتات',                 '8 chasers',               null,                    null,                null,                    120, 13);

-- ─── Site settings (opening hours, about text) ──────────────────────────────
-- Run once in Supabase SQL editor.

create table if not exists site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

create policy "Public read settings"
  on site_settings for select using (true);

-- Default opening hours (update these to match the actual restaurant schedule)
insert into site_settings (key, value) values (
  'opening_hours',
  '{
    "sun": {"open": "12:00", "close": "23:00", "closed": false},
    "mon": {"open": "12:00", "close": "23:00", "closed": false},
    "tue": {"open": "12:00", "close": "23:00", "closed": false},
    "wed": {"open": "12:00", "close": "23:00", "closed": false},
    "thu": {"open": "12:00", "close": "23:00", "closed": false},
    "fri": {"open": "12:00", "close": "01:00", "closed": false},
    "sat": {"open": "18:00", "close": "01:00", "closed": false}
  }'::jsonb
) on conflict (key) do nothing;

-- Default about text (edit via admin panel after setup)
insert into site_settings (key, value) values
  ('about_he', '"מסעדת קבאקה מציעה מטבח ערבי אותנטי בלב יפו. אנו מתמחים בגריל, מזה ומנות מסורתיות המוכנות מחומרי גלם טריים ואיכותיים."'::jsonb),
  ('about_ar', '"يقدم مطعم كباكة مطبخاً عربياً أصيلاً في قلب يافا. نتخصص في المشويات والمزة والأطباق التقليدية المصنوعة من مكونات طازجة وعالية الجودة."'::jsonb),
  ('about_en', '"Kabakeh restaurant offers authentic Arab cuisine in the heart of Jaffa. We specialize in grilled meats, mezze, and traditional dishes made with fresh, high-quality ingredients."'::jsonb)
on conflict (key) do nothing;

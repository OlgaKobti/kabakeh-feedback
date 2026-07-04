-- ─── Events table ────────────────────────────────────────────────────────────
-- Run this once in Supabase SQL editor to set up the events feature.
-- To restore from scratch, run this file followed by any seed data you have.

create table if not exists events (
  id            uuid primary key default gen_random_uuid(),
  title_he      text not null,
  title_ar      text not null default '',
  title_en      text not null default '',
  description_he text,
  description_ar text,
  description_en text,
  event_date    date not null,
  event_time    text,          -- e.g. "20:00", nullable
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Public visitors can read published events
alter table events enable row level security;

create policy "Public read published events"
  on events for select
  using (is_published = true);

-- Service role (admin) can do everything — no extra policy needed
-- because the service role bypasses RLS.

-- ─── Example data (optional, delete before running in production) ──────────
-- insert into events (title_he, title_ar, title_en, event_date, event_time, description_he)
-- values (
--   'ערב מוזיקה חיה',
--   'أمسية موسيقية حية',
--   'Live Music Evening',
--   '2026-07-20',
--   '19:00',
--   'הצטרפו אלינו לערב מוזיקה חיה עם אמנים מקומיים'
-- );

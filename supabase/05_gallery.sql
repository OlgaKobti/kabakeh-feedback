-- ─── Gallery photos ───────────────────────────────────────────────────────────
-- Run once in Supabase SQL editor.
-- Also create a Supabase Storage bucket named "gallery" (public).

create table if not exists gallery_photos (
  id            uuid primary key default gen_random_uuid(),
  url           text not null,
  caption_he    text,
  caption_ar    text,
  caption_en    text,
  display_order integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table gallery_photos enable row level security;

create policy "Public read published gallery"
  on gallery_photos for select
  using (is_published = true);

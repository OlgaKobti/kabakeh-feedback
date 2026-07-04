-- ─── Private event inquiries ─────────────────────────────────────────────────
-- Run once in Supabase SQL editor.

create table if not exists private_inquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  contact      text not null,        -- phone or email
  event_type   text,                 -- birthday / corporate / wedding / other
  guests_count text,                 -- approximate
  preferred_date text,               -- flexible text field
  message      text,
  is_read      boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Inquiries are write-only for the public (no read access)
alter table private_inquiries enable row level security;

create policy "Public insert inquiries"
  on private_inquiries for insert
  with check (true);

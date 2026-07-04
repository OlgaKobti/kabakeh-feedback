-- Event booking requests
create table if not exists event_bookings (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid references events(id) on delete set null,
  event_title   text not null,          -- snapshot of event title at booking time
  event_date    date,                   -- snapshot
  name          text not null,
  phone         text not null,
  guests_count  text,
  message       text,
  status        text not null default 'pending', -- pending | confirmed | cancelled
  is_read       boolean not null default false,
  created_at    timestamptz not null default now()
);

-- RLS
alter table event_bookings enable row level security;

-- Public: insert only (submit a booking)
create policy "public_insert_bookings"
  on event_bookings for insert
  to anon, authenticated
  with check (true);

-- Service role: full access (admin API uses service key)
create policy "service_all_bookings"
  on event_bookings for all
  to service_role
  using (true)
  with check (true);

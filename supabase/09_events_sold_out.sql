-- Add sold-out flag to events
alter table events add column if not exists is_sold_out boolean not null default false;

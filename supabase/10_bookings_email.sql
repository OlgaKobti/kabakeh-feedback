-- Add email field to event_bookings (optional, for customer notifications)
alter table event_bookings add column if not exists email text;

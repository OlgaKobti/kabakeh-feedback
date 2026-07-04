-- Add image_url column to events table
-- Run in Supabase SQL editor

alter table events add column if not exists image_url text;

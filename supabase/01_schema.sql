-- Run this first in Supabase SQL Editor
-- Creates the menu_categories and menu_items tables with RLS

-- Categories table
create table menu_categories (
  id           text primary key,
  title_he     text not null,
  title_ar     text not null,
  title_en     text not null,
  sort_order   int  not null default 0
);

-- Items table
create table menu_items (
  id              text primary key,
  category_id     text not null references menu_categories(id),
  name_he         text not null,
  name_ar         text not null,
  name_en         text not null,
  description_he  text,
  description_ar  text,
  description_en  text,
  price           numeric,
  image           text,
  available       boolean not null default true,
  featured        boolean not null default false,
  sort_order      int not null default 0
);

-- Public can read both tables
alter table menu_categories enable row level security;
alter table menu_items      enable row level security;

create policy "Public read categories" on menu_categories
  for select using (true);

create policy "Public read items" on menu_items
  for select using (true);

# Supabase SQL files

Run these in order in the Supabase SQL Editor (supabase.com → your project → SQL Editor).

| File | What it does | Run when |
|------|-------------|----------|
| `01_schema.sql` | Creates `menu_categories` and `menu_items` tables + RLS policies | First time setup, or after data loss |
| `02_seed.sql` | Inserts all menu data into the tables | After schema, or to restore data |

## To restore after data loss

1. Go to [supabase.com](https://supabase.com) → your project → SQL Editor
2. Run `01_schema.sql` (skip if tables already exist)
3. Run `02_seed.sql`
4. Done — menu is restored

## To reset everything

```sql
drop table if exists menu_items;
drop table if exists menu_categories;
```

Then re-run `01_schema.sql` and `02_seed.sql`.

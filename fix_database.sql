-- Fix destinations table by adding potential missing columns
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS image text;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS price numeric;

-- Reload the schema cache (notify PostgREST)
NOTIFY pgrst, 'reload config';

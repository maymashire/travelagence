-- comprehensive repair for bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS destination_id bigint REFERENCES destinations(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_type text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price numeric;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS travelers integer;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS start_date date;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS end_date date;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_name text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_email text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS phone text;

-- Force schema cache reload
NOTIFY pgrst, 'reload config';

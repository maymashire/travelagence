-- Update bookings table to match requirements
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_type text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price numeric;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS travelers integer;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS start_date date;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS end_date date;

-- Refresh the API cache
NOTIFY pgrst, 'reload config';

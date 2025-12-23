-- Add user details directly to bookings table for simplicity
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_name text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_email text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS phone text;

-- Refresh the API cache
NOTIFY pgrst, 'reload config';

-- Add the missing destination_id column
-- We use bigint to match the destinations table. 
-- If this fails due to type mismatch, try changing bigint to uuid.
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS destination_id bigint;

-- Reload schema cache
NOTIFY pgrst, 'reload config';

-- Drop the restrictive check constraint on booking_type
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_booking_type_check;

-- Reload schema cache
NOTIFY pgrst, 'reload config';

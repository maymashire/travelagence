-- Fix the relationship between bookings and destinations
-- We suspect destinations.id is UUID based on previous errors.
-- We previously changed bookings.destination_id to TEXT. Now we convert it to UUID and restore the FK.

-- 1. Convert column to UUID
ALTER TABLE bookings ALTER COLUMN destination_id TYPE uuid USING destination_id::uuid;

-- 2. Restore Foreign Key (assuming destinations.id is UUID)
ALTER TABLE bookings ADD CONSTRAINT bookings_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES destinations(id);

-- Reload schema
NOTIFY pgrst, 'reload config';

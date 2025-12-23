-- Create a storage bucket for avatars
-- Note: This usually needs to be done via the Supabase Dashboard, but we can try to set policies here.
-- If the bucket doesn't exist, the upload will fail. The user MUST create a public bucket named 'avatars' in Supabase Storage.

-- Policy to allow anyone to view avatars (public)
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'avatars' );

-- Policy to allow authenticated users to upload avatars
-- CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Policy to allow users to update their own avatars
-- CREATE POLICY "User Update Own" ON storage.objects FOR UPDATE USING ( bucket_id = 'avatars' AND auth.uid() = owner );

-- Since we can't easily create buckets via SQL in all Supabase versions, we'll provide instructions.
-- This file serves as a reminder/instruction set.

SELECT 'Please create a public storage bucket named "avatars" in your Supabase Dashboard.' as instruction;

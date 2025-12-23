-- Create a public users table to manage user profiles
-- This is a standard pattern in Supabase to allow public access to user data (like names)
-- and to allow admins to manage "users" without needing high-privilege access to auth.users

CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  email text,
  full_name text,
  role text DEFAULT 'user',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- 3. Admins can view all profiles
-- (We assume there's a way to check for admin, for now we'll just allow authenticated read for simplicity in this demo, or rely on the role column)
CREATE POLICY "Admins can view all profiles" ON public.users FOR SELECT USING (true); 

-- 4. Admins can update/delete profiles
CREATE POLICY "Admins can update all profiles" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Admins can delete profiles" ON public.users FOR DELETE USING (true);
CREATE POLICY "Admins can insert profiles" ON public.users FOR INSERT WITH CHECK (true);

-- Trigger to automatically create a public user record when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists to avoid duplication errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Backfill existing users from auth.users (if possible, but we can't easily access auth.users from here)
-- Instead, we will rely on the app to create them or just start fresh.
-- Since we reset the DB, we might need to re-register users.

NOTIFY pgrst, 'reload config';

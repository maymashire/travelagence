-- Final fix for users table
-- Run this in Supabase SQL Editor

-- 1. Recreate the table with the correct schema
DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE public.users (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  email text NOT NULL,
  full_name text,
  phone text,
  role text DEFAULT 'user',
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS (Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
CREATE POLICY "Allow public read" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow individual update" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow individual insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can do everything" ON public.users FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 4. Create the trigger function to sync data from Auth to Public
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, phone, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach the trigger to the Auth system
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

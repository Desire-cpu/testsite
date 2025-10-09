
-- Add columns to profiles table for artist information
ALTER TABLE public.profiles 
ADD COLUMN artist_name TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN website TEXT,
ADD COLUMN social_links JSONB DEFAULT '{}';

-- Add columns to magazines table for cover art and reading options
ALTER TABLE public.magazines 
ADD COLUMN cover_image_url TEXT,
ADD COLUMN is_downloadable BOOLEAN DEFAULT true,
ADD COLUMN is_readable_online BOOLEAN DEFAULT true;

-- Update the handle_new_user function to capture artist name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, artist_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'artist_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to count registered users
CREATE OR REPLACE FUNCTION public.get_registered_users_count()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER FROM auth.users WHERE email_confirmed_at IS NOT NULL;
$$;

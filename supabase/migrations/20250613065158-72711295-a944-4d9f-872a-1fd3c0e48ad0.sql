
-- Add missing columns to the magazines table
ALTER TABLE public.magazines 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS is_downloadable BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_readable_online BOOLEAN DEFAULT true;

-- Update RLS policies to allow public viewing of magazines
DROP POLICY IF EXISTS "Users can view all magazines" ON public.magazines;

CREATE POLICY "Anyone can view magazines" 
  ON public.magazines 
  FOR SELECT 
  USING (true);

-- Update storage policies to be more permissive for viewing
DROP POLICY IF EXISTS "Anyone can view magazine files" ON storage.objects;

CREATE POLICY "Anyone can view magazine files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'magazines');

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('magazines', 'magazines', true)
ON CONFLICT (id) DO NOTHING;

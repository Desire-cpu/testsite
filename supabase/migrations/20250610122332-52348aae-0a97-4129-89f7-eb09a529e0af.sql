
-- Create a table for storing magazines
CREATE TABLE public.magazines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.magazines ENABLE ROW LEVEL SECURITY;

-- Create policies for magazines table
CREATE POLICY "Users can view all magazines" 
  ON public.magazines 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own magazines" 
  ON public.magazines 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own magazines" 
  ON public.magazines 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own magazines" 
  ON public.magazines 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a storage bucket for magazine files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('magazines', 'magazines', true);

-- Create storage policies for the magazines bucket
CREATE POLICY "Anyone can view magazine files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'magazines');

CREATE POLICY "Authenticated users can upload magazine files" 
  ON storage.objects 
  FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'magazines');

CREATE POLICY "Users can update their own magazine files" 
  ON storage.objects 
  FOR UPDATE 
  TO authenticated
  USING (bucket_id = 'magazines' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own magazine files" 
  ON storage.objects 
  FOR DELETE 
  TO authenticated
  USING (bucket_id = 'magazines' AND auth.uid()::text = (storage.foldername(name))[1]);

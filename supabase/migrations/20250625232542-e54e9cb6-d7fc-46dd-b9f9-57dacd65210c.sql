
-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true);

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Create policy to allow public read access to images
CREATE POLICY "Allow public read access to images" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'images');

-- Create policy to allow authenticated users to update their own images
CREATE POLICY "Allow authenticated users to update images" 
ON storage.objects 
FOR UPDATE 
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'images' AND auth.role() = 'authenticated');

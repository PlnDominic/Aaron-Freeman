-- Supabase Storage setup for file uploads (blog images, project PDFs, resume, certificates)
-- Run this in your Supabase SQL Editor

-- Create a public bucket for portfolio uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access to files in this bucket
CREATE POLICY "Public read access for uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- Admin write access (no separate auth layer yet, matching schema.sql's policies)
CREATE POLICY "Admin write access for uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Admin update access for uploads"
ON storage.objects FOR UPDATE
USING (bucket_id = 'uploads');

CREATE POLICY "Admin delete access for uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'uploads');

-- Allow public access to published landing pages
CREATE POLICY "Public can read published landing pages"
ON public.landing_pages
FOR SELECT
USING (status = 'published');


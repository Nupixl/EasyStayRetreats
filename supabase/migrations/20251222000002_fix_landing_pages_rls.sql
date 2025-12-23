-- Drop existing policy
DROP POLICY IF EXISTS "Affiliates manage their own landing pages." ON public.landing_pages;

-- Create separate policies for better clarity and debugging
CREATE POLICY "Affiliates can view their own landing pages" 
ON public.landing_pages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.affiliate_links
        WHERE affiliate_links.id = landing_pages.affiliate_link_id
          AND affiliate_links.affiliate_id = auth.uid()
    )
);

CREATE POLICY "Affiliates can insert their own landing pages" 
ON public.landing_pages FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.affiliate_links
        WHERE affiliate_links.id = landing_pages.affiliate_link_id
          AND affiliate_links.affiliate_id = auth.uid()
    )
);

CREATE POLICY "Affiliates can update their own landing pages" 
ON public.landing_pages FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.affiliate_links
        WHERE affiliate_links.id = landing_pages.affiliate_link_id
          AND affiliate_links.affiliate_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.affiliate_links
        WHERE affiliate_links.id = landing_pages.affiliate_link_id
          AND affiliate_links.affiliate_id = auth.uid()
    )
);

CREATE POLICY "Affiliates can delete their own landing pages" 
ON public.landing_pages FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.affiliate_links
        WHERE affiliate_links.id = landing_pages.affiliate_link_id
          AND affiliate_links.affiliate_id = auth.uid()
    )
);


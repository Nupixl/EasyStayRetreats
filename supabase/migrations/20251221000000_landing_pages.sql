-- Create landing_pages table for affiliate landing builder
CREATE TABLE IF NOT EXISTS public.landing_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_link_id UUID REFERENCES public.affiliate_links(id) UNIQUE NOT NULL,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT FALSE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates manage their own landing pages." ON public.landing_pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.affiliate_links
            WHERE affiliate_links.id = landing_pages.affiliate_link_id
              AND affiliate_links.affiliate_id = auth.uid()
        )
    );





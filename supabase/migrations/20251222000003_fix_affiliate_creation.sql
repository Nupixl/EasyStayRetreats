-- Ensure all existing affiliate profiles have an affiliates entry
INSERT INTO public.affiliates (id, display_name, status)
SELECT 
    p.id, 
    COALESCE(p.email, 'Affiliate'), 
    'active'
FROM public.profiles p
LEFT JOIN public.affiliates a ON a.id = p.id
WHERE p.role = 'affiliate' 
  AND a.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Update the trigger function to also create affiliates entry
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'affiliate');
  
  -- Also insert into affiliates for affiliate users
  INSERT INTO public.affiliates (id, display_name, status)
  VALUES (new.id, COALESCE(new.email, 'Affiliate'), 'active');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add policy to allow affiliates to insert their own records
DROP POLICY IF EXISTS "Affiliates can manage own links." ON public.affiliate_links;

CREATE POLICY "Affiliates can view own links" 
ON public.affiliate_links FOR SELECT
USING (affiliate_id = auth.uid());

CREATE POLICY "Affiliates can insert own links" 
ON public.affiliate_links FOR INSERT
WITH CHECK (affiliate_id = auth.uid());

CREATE POLICY "Affiliates can update own links" 
ON public.affiliate_links FOR UPDATE
USING (affiliate_id = auth.uid())
WITH CHECK (affiliate_id = auth.uid());

CREATE POLICY "Affiliates can delete own links" 
ON public.affiliate_links FOR DELETE
USING (affiliate_id = auth.uid());


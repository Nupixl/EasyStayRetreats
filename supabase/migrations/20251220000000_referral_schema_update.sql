-- Add customization fields to affiliate_links
ALTER TABLE public.affiliate_links
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS subheadline TEXT,
ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

-- Extend referrals with more detailed owner metadata
ALTER TABLE public.referrals
ADD COLUMN IF NOT EXISTS first_name TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS last_name TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS properties_count INTEGER,
ADD COLUMN IF NOT EXISTS listing_links TEXT;

-- Clean up deprecated columns
ALTER TABLE public.referrals
DROP COLUMN IF EXISTS owner_name,
DROP COLUMN IF EXISTS property_location,
DROP COLUMN IF EXISTS property_size;



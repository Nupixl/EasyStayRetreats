-- Migration: Add support for multiple properties per referral
-- Date: 2025-12-22
-- Description: Adds properties_count and properties JSONB column to store array of property details

-- Add new columns
ALTER TABLE referrals 
ADD COLUMN IF NOT EXISTS properties_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS properties JSONB;

-- Create index for better query performance on properties_count
CREATE INDEX IF NOT EXISTS idx_referrals_properties_count 
ON referrals(properties_count);

-- Create GIN index for JSONB queries (useful for searching within properties)
CREATE INDEX IF NOT EXISTS idx_referrals_properties_gin 
ON referrals USING GIN (properties);

-- Add comment for documentation
COMMENT ON COLUMN referrals.properties_count IS 'Total number of properties submitted by the property owner';
COMMENT ON COLUMN referrals.properties IS 'Array of property objects containing type, location, management interest, listing status, and links';

-- Optional: Migrate existing data if you have old single-property records
-- This converts old single property fields to the new array format
-- Uncomment if you have existing data to migrate:

/*
UPDATE referrals 
SET 
    properties_count = 1,
    properties = jsonb_build_array(
        jsonb_build_object(
            'propertyType', COALESCE(property_type, ''),
            'propertyLocation', COALESCE(property_location, ''),
            'managementInterest', COALESCE(management_interest, ''),
            'currentlyListed', COALESCE(currently_listed, ''),
            'listingLinks', COALESCE(listing_links, '')
        )
    )
WHERE properties IS NULL 
  AND (property_type IS NOT NULL OR property_location IS NOT NULL);
*/

-- Add check constraint to ensure properties_count matches array length
ALTER TABLE referrals 
ADD CONSTRAINT check_properties_count_matches_array 
CHECK (
    properties IS NULL OR 
    properties_count = jsonb_array_length(properties)
);

-- Add check constraint for maximum properties (10)
ALTER TABLE referrals 
ADD CONSTRAINT check_max_properties 
CHECK (properties_count <= 10 AND properties_count >= 1);


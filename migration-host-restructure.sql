-- Migration script to restructure hosts table to app_hosts
-- This script will:
-- 1. Rename hosts table to app_hosts
-- 2. Add new host-related fields from App Properties
-- 3. Update foreign key references

-- Step 1: Add new columns to existing hosts table
ALTER TABLE hosts 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS card_image_url TEXT,
ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
ADD COLUMN IF NOT EXISTS agent_location TEXT,
ADD COLUMN IF NOT EXISTS short_bio TEXT,
ADD COLUMN IF NOT EXISTS vacation_image_first_url TEXT,
ADD COLUMN IF NOT EXISTS vacation_image_second_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS instagram_link TEXT,
ADD COLUMN IF NOT EXISTS facebook_link TEXT,
ADD COLUMN IF NOT EXISTS linkedin_link TEXT,
ADD COLUMN IF NOT EXISTS youtube_link TEXT,
ADD COLUMN IF NOT EXISTS super_host BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS plus_host BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS premium_host BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verified_host BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS accolade_icon_url TEXT,
ADD COLUMN IF NOT EXISTS host_accolades_switch BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS host_accolade_image_switch BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS account_owner TEXT,
ADD COLUMN IF NOT EXISTS whalesync_postgres_id TEXT;

-- Step 2: Create unique constraint on slug
ALTER TABLE hosts ADD CONSTRAINT hosts_slug_unique UNIQUE (slug);

-- Step 3: Rename table from hosts to app_hosts
ALTER TABLE hosts RENAME TO app_hosts;

-- Step 4: Update foreign key references in property_hosts table
-- First, drop the existing foreign key constraint
ALTER TABLE property_hosts DROP CONSTRAINT IF EXISTS property_hosts_host_id_fkey;

-- Add the new foreign key constraint pointing to app_hosts
ALTER TABLE property_hosts 
ADD CONSTRAINT property_hosts_host_id_fkey 
FOREIGN KEY (host_id) REFERENCES app_hosts(id) ON DELETE CASCADE;

-- Step 5: Update RLS policies
DROP POLICY IF EXISTS "Public read access for hosts" ON app_hosts;
CREATE POLICY "Public read access for app_hosts" ON app_hosts FOR SELECT USING (true);

-- Step 6: Update trigger
DROP TRIGGER IF EXISTS update_hosts_updated_at ON app_hosts;
CREATE TRIGGER update_app_hosts_updated_at BEFORE UPDATE ON app_hosts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Create new indexes
CREATE INDEX IF NOT EXISTS idx_app_hosts_slug ON app_hosts(slug);
CREATE INDEX IF NOT EXISTS idx_property_hosts_host_id ON property_hosts(host_id);

-- Step 8: Update any existing data to have proper slugs
UPDATE app_hosts 
SET slug = LOWER(REPLACE(REPLACE(name, ' ', '-'), '.', ''))
WHERE slug IS NULL OR slug = '';

-- Step 9: Add NOT NULL constraint to slug after populating
ALTER TABLE app_hosts ALTER COLUMN slug SET NOT NULL;


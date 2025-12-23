-- Add a status column to landing_pages table
-- Status can be: 'draft', 'paused', or 'published'

-- Add the status column with default 'draft'
ALTER TABLE public.landing_pages
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';

-- Set status based on existing is_published value
UPDATE public.landing_pages
SET status = CASE 
    WHEN is_published = true THEN 'published'
    ELSE 'draft'
END
WHERE status = 'draft'; -- Only update if it's still the default

-- Add a check constraint to ensure only valid statuses
ALTER TABLE public.landing_pages
ADD CONSTRAINT landing_pages_status_check 
CHECK (status IN ('draft', 'paused', 'published'));

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS landing_pages_status_idx 
ON public.landing_pages(status);

-- We'll keep is_published for backward compatibility, but status is the source of truth
-- Add a trigger to sync is_published with status
CREATE OR REPLACE FUNCTION sync_is_published()
RETURNS TRIGGER AS $$
BEGIN
    NEW.is_published = (NEW.status = 'published');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_is_published_trigger ON public.landing_pages;
CREATE TRIGGER sync_is_published_trigger
    BEFORE INSERT OR UPDATE ON public.landing_pages
    FOR EACH ROW
    EXECUTE FUNCTION sync_is_published();


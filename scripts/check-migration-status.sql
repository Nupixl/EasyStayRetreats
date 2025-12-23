-- Check if the status column exists in landing_pages table
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'landing_pages'
  AND column_name = 'status';

-- If the above returns a row, the migration has been applied
-- If it returns nothing, you need to run the migration

-- Check current landing page statuses (if column exists)
SELECT 
    status,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE is_published = true) as published_count
FROM public.landing_pages 
GROUP BY status;

-- List all columns in landing_pages table for reference
SELECT 
    column_name,
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'landing_pages'
ORDER BY ordinal_position;


-- Debug and fix relationships

-- 1. Check if landing_pages table exists and has correct structure
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'landing_pages'
    ) THEN
        RAISE NOTICE 'landing_pages table does not exist!';
    ELSE
        RAISE NOTICE 'landing_pages table exists';
    END IF;
END $$;

-- 2. Verify foreign key relationship exists
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'landing_pages' 
    AND tc.constraint_type = 'FOREIGN KEY';

-- 3. Check RLS policies on landing_pages
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'landing_pages';

-- 4. Show sample data (if any exists)
SELECT 
    'affiliate_links' as table_name,
    COUNT(*) as count
FROM affiliate_links
UNION ALL
SELECT 
    'landing_pages' as table_name,
    COUNT(*) as count
FROM landing_pages;


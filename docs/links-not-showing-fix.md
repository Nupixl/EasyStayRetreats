# Fix for Links Not Showing Up

## Problem
Links list shows "No links created yet" even after creating links, and console shows "Error fetching links: {}".

## Root Causes
This can happen due to several reasons:
1. Missing `affiliates` table entry (foreign key constraint fails)
2. RLS policies blocking the query
3. Missing `landing_pages` table or incorrect relationship
4. Join query failing

## Solution Steps

### Step 1: Apply All Migrations

Make sure ALL migrations are applied in order:

```bash
cd /Users/elijahwilliams/Documents/GitHub/EasyStayRetreats
supabase db push
```

Or manually apply these in Supabase Dashboard > SQL Editor (in this order):
1. `20251222000002_fix_landing_pages_rls.sql`
2. `20251222000003_fix_affiliate_creation.sql`
3. `20251222000004_debug_and_fix_relationships.sql` (diagnostic only)

### Step 2: Run Diagnostics

1. **Refresh your browser** (Cmd+Shift+R or Ctrl+Shift+F5)
2. Open browser console (F12)
3. Click **"🔍 Run Diagnostics"** button on the page
4. Check the console output

Look for these results:
- ✓ **User ID present**
- ✓ **Profile exists**
- ✓ **Affiliate entry exists** ← This is critical!
- Number of links found

### Step 3: Check Error Details in Console

After refreshing, the console will now show detailed error information:
- `message`: Human-readable error
- `details`: Specific details about what failed
- `hint`: Postgres hint about how to fix it
- `code`: Error code

Common error codes and fixes:

#### `42P01` - Undefined table
**Error**: "relation 'landing_pages' does not exist"
**Fix**: Run the landing pages migration:
```sql
-- Run in Supabase SQL Editor
\i supabase/migrations/20251221000000_landing_pages.sql
```

#### `23503` - Foreign key violation
**Error**: "violates foreign key constraint"
**Fix**: Create your affiliates entry:
```sql
INSERT INTO affiliates (id, display_name, status)
SELECT id, email, 'active' 
FROM profiles 
WHERE id = auth.uid() AND role = 'affiliate'
ON CONFLICT (id) DO NOTHING;
```

#### `42501` - Insufficient privilege
**Error**: "permission denied for table"
**Fix**: Check and fix RLS policies:
```sql
-- Run migration 20251222000002_fix_landing_pages_rls.sql
```

### Step 4: Manual Verification in Supabase

Go to Supabase Dashboard > SQL Editor and run:

```sql
-- 1. Check your user ID
SELECT auth.uid();

-- 2. Verify you have a profile
SELECT * FROM profiles WHERE id = auth.uid();

-- 3. Verify you have an affiliates entry (REQUIRED!)
SELECT * FROM affiliates WHERE id = auth.uid();

-- 4. Check your links
SELECT * FROM affiliate_links WHERE affiliate_id = auth.uid();

-- 5. Test the join query
SELECT 
    al.*,
    lp.id as landing_page_id,
    lp.is_published
FROM affiliate_links al
LEFT JOIN landing_pages lp ON lp.affiliate_link_id = al.id
WHERE al.affiliate_id = auth.uid();
```

### Step 5: Quick Fixes

#### If you don't have an affiliates entry:
```sql
INSERT INTO affiliates (id, display_name, status)
SELECT id, email, 'active' 
FROM profiles 
WHERE id = auth.uid()
ON CONFLICT (id) DO NOTHING;
```

#### If join query fails but simple query works:
The updated code now has a fallback mechanism that will:
1. Try the join query
2. If it fails, fetch links and landing pages separately
3. Manually combine the data

#### If RLS policies are blocking:
```sql
-- Check what policies exist
SELECT * FROM pg_policies WHERE tablename IN ('affiliate_links', 'landing_pages');

-- Re-apply policies
-- Run migrations 20251222000002 and 20251222000003
```

## What the Code Now Does

### Improved Error Handling
Shows detailed error information including:
- Error message
- Details
- Hint from Postgres
- Error code

### Fallback Query Mechanism
1. **First attempt**: Try join query with landing_pages
2. **If join fails**: Fall back to simple query without join
3. **Then**: Fetch landing_pages separately and combine
4. **Result**: Links will show even if join fails!

### Better Logging
Console shows:
- "Component mounted, fetching links..."
- "Fetching links for user: [id]"
- "Raw data from Supabase: [data]"
- "Transformed data: [data]"
- Detailed error info if something fails

## Testing the Fix

After applying migrations and refreshing:

1. **Open Console (F12)**
2. **Check for errors** - Should see detailed error messages now
3. **Try creating a link** - Should work and show in list immediately
4. **Run diagnostics** - Should show all checkmarks
5. **Refresh page** - Links should persist and load

## Common Scenarios

### Scenario 1: Fresh Database
1. User signs up
2. `profiles` created automatically ✓
3. `affiliates` NOT created automatically ✗
4. Link creation fails ✗

**Fix**: Run migration `20251222000003_fix_affiliate_creation.sql`

### Scenario 2: Existing User
1. User already exists
2. Has `profiles` entry ✓
3. Missing `affiliates` entry ✗
4. Can't create or view links ✗

**Fix**: Run the SQL to create affiliates entry (see Step 5)

### Scenario 3: Join Query Issues
1. `affiliate_links` table works ✓
2. `landing_pages` table missing or misconfigured ✗
3. Join query fails ✗

**Fix**: Code now falls back to separate queries automatically

## Still Having Issues?

Run this comprehensive check:

```sql
-- Comprehensive diagnostic
SELECT 
    'User ID' as check_name,
    auth.uid()::text as value
UNION ALL
SELECT 
    'Has Profile',
    CASE WHEN EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid()) 
         THEN 'YES' ELSE 'NO' END
UNION ALL
SELECT 
    'Has Affiliate',
    CASE WHEN EXISTS(SELECT 1 FROM affiliates WHERE id = auth.uid()) 
         THEN 'YES' ELSE 'NO' END
UNION ALL
SELECT 
    'Links Count',
    COUNT(*)::text 
FROM affiliate_links 
WHERE affiliate_id = auth.uid()
UNION ALL
SELECT 
    'Landing Pages Table Exists',
    CASE WHEN EXISTS(
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'landing_pages'
    ) THEN 'YES' ELSE 'NO' END;
```

If any show "NO", follow the fixes in Step 5.

## Support

Check these locations for error details:
- Browser Console (F12) - Client-side errors and logs
- Network Tab - API request/response details
- Supabase Dashboard > Logs - Database query logs
- Server console (if running locally) - API route errors


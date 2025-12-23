# Fix for Landing Page Publish Error

## Problem
When clicking "Publish" in the Landing Page Builder, you get the error: "Unexpected error saving landing page"

## Root Cause
The Row Level Security (RLS) policies on the `landing_pages` table may not be properly configured for UPSERT operations.

## Solution

### Step 1: Apply the Migration
Run the new migration to fix the RLS policies:

```bash
# If using Supabase CLI
supabase db push

# Or apply manually in Supabase Dashboard > SQL Editor
```

The migration file is located at:
`supabase/migrations/20251222000002_fix_landing_pages_rls.sql`

### Step 2: Verify in Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run this query to check if your user can access their links:

```sql
SELECT 
    al.id as link_id,
    al.name as link_name,
    al.affiliate_id,
    lp.id as landing_page_id,
    lp.is_published
FROM affiliate_links al
LEFT JOIN landing_pages lp ON lp.affiliate_link_id = al.id
WHERE al.affiliate_id = auth.uid();
```

### Step 3: Test the Fix

1. Refresh your browser
2. Go to the Landing Page Builder
3. Click "Publish"
4. Check the browser console for detailed error messages (if any)

## What Changed

### Before:
- Single `FOR ALL` policy that might not handle UPSERT correctly

### After:
- Separate policies for SELECT, INSERT, UPDATE, and DELETE
- Each policy explicitly checks that the user owns the affiliate link
- Better error handling in the API to show specific error messages

## Improved Error Messages

The code now:
- Logs detailed error information to the server console
- Shows specific error messages in the UI toast notifications
- Provides better debugging information in the browser console

## If the Error Persists

Check these things:

1. **Verify the affiliate_link exists:**
   ```sql
   SELECT * FROM affiliate_links WHERE id = 'YOUR_LINK_ID';
   ```

2. **Check if a landing_page already exists:**
   ```sql
   SELECT * FROM landing_pages WHERE affiliate_link_id = 'YOUR_LINK_ID';
   ```

3. **Verify your user ID:**
   ```sql
   SELECT auth.uid();
   ```

4. **Check the server logs** in your terminal/console where Next.js is running for detailed error messages.

## Support

If issues persist, check:
- Browser console (F12) for client-side errors
- Server console for API errors
- Supabase Dashboard > Logs for database errors


# Landing Page Save Error Fix

**Date**: December 22, 2025  
**Error**: "Unable to save layout" in LandingPageBuilder  
**Component**: `src/components/landing/LandingPageBuilder.tsx`

---

## Issue

The landing page builder shows error: **"Unable to save layout"** when trying to save or publish.

---

## Root Causes

### 1. Database Table Not Created
The `landing_pages` table may not exist in your Supabase database.

### 2. RLS Policy Blocking Inserts
Row Level Security policy requires authenticated user to own the affiliate link.

### 3. Missing Authentication
User may not be properly authenticated when saving.

---

## Solutions

### Solution 1: Run Database Migration

**Go to Supabase SQL Editor:**
https://supabase.com/dashboard/project/sfkadunhnyaeycfdnvfv/sql

**Run this SQL:**
```sql
-- Create landing_pages table
CREATE TABLE IF NOT EXISTS public.landing_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_link_id UUID REFERENCES public.affiliate_links(id) UNIQUE NOT NULL,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT FALSE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

-- Create policy for affiliates to manage their own pages
CREATE POLICY "Affiliates manage their own landing pages" ON public.landing_pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.affiliate_links
            WHERE affiliate_links.id = landing_pages.affiliate_link_id
              AND affiliate_links.affiliate_id = auth.uid()
        )
    );
```

### Solution 2: Verify Affiliate Link Ownership

Make sure the user is logged in and owns the affiliate link they're trying to edit.

**Check in Supabase:**
1. Go to Table Editor → `affiliate_links`
2. Find the link being edited
3. Verify `affiliate_id` matches the logged-in user's `auth.uid()`

### Solution 3: Temporarily Disable RLS (Development Only)

**⚠️ ONLY FOR TESTING - DO NOT USE IN PRODUCTION**

```sql
-- Temporarily disable RLS to test
ALTER TABLE public.landing_pages DISABLE ROW LEVEL SECURITY;

-- After testing, re-enable it
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
```

### Solution 4: Add Public Insert Policy (If Needed)

If you want to allow unauthenticated saves (not recommended for production):

```sql
-- Allow public inserts (use with caution)
CREATE POLICY "Allow public landing page updates" ON public.landing_pages
    FOR ALL USING (true)
    WITH CHECK (true);
```

---

## Improved Error Handling

The error handling has been improved to show the actual error message from the API:

**Before:**
```typescript
if (!response.ok) throw new Error('Unable to save layout.');
```

**After:**
```typescript
if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || 'Unable to save layout.');
}
```

Now you'll see the actual error in the console, such as:
- "Link not found"
- "new row violates row-level security policy"
- "relation 'landing_pages' does not exist"

---

## Debugging Steps

### 1. Check Browser Console
Open DevTools (F12) → Console tab and look for the detailed error message.

### 2. Check Network Tab
- Open DevTools → Network tab
- Try to save
- Click on the `/api/landing-pages` request
- Check the Response tab for error details

### 3. Check Supabase Logs
- Go to Supabase Dashboard → Logs → API
- Look for errors related to `landing_pages` table

### 4. Verify Table Exists
```sql
-- Run in Supabase SQL Editor
SELECT * FROM information_schema.tables 
WHERE table_name = 'landing_pages';
```

Should return 1 row if table exists.

### 5. Test Insert Manually
```sql
-- Try manual insert (replace with real UUID)
INSERT INTO landing_pages (affiliate_link_id, sections, is_published)
VALUES ('your-link-id-here', '[]'::jsonb, false);
```

If this fails, you'll see the exact error.

---

## Common Error Messages

### "relation 'landing_pages' does not exist"
**Fix**: Run the migration SQL (Solution 1)

### "new row violates row-level security policy"
**Fix**: 
- Ensure user is logged in
- Verify user owns the affiliate link
- Check RLS policy (Solution 2)

### "Link not found"
**Fix**: Verify the `linkId` being passed is valid and exists in `affiliate_links` table

### "duplicate key value violates unique constraint"
**Fix**: A landing page already exists for this link. The upsert should handle this, but if not:
```sql
-- Delete existing landing page
DELETE FROM landing_pages WHERE affiliate_link_id = 'your-link-id';
```

---

## Testing After Fix

1. **Login as affiliate user**
2. **Navigate to link builder**: `/affiliate/links/[linkId]/builder`
3. **Make changes to landing page**
4. **Click "Publish"**
5. **Check console** - should show "saved" state, no errors
6. **Verify in Supabase** - check `landing_pages` table for new/updated row

---

## Prevention

### For Development:
1. Always run migrations before testing features
2. Use proper authentication in development
3. Check console for errors immediately

### For Production:
1. Run all migrations before deployment
2. Test save functionality in staging first
3. Monitor Supabase logs for RLS errors
4. Ensure proper authentication flow

---

## Files Modified

- `src/components/landing/LandingPageBuilder.tsx` - Improved error handling
- `docs/landing-page-save-error-fix.md` - This documentation

---

## Quick Fix Checklist

- [ ] Run landing_pages migration in Supabase
- [ ] Verify table exists in Supabase Table Editor
- [ ] Check user is logged in
- [ ] Verify user owns the affiliate link
- [ ] Test save functionality
- [ ] Check browser console for detailed errors
- [ ] Verify data appears in landing_pages table

---

## Need More Help?

1. Check browser console for detailed error
2. Check Supabase API logs
3. Verify all migrations have been run
4. Test with RLS temporarily disabled (dev only)
5. Check that affiliate_links table has proper data


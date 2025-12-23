# Fix for Link Creation Not Working

## Problem
When trying to create a new affiliate link, nothing happens or it fails silently.

## Root Cause
The `affiliate_links` table has a foreign key constraint that references `affiliates.id`, but when users sign up, only a `profiles` entry is created, not an `affiliates` entry. This causes the INSERT to fail due to the foreign key constraint.

## Solution

### Step 1: Apply the Migration

Run the new migration to fix the affiliates table and trigger:

```bash
# If using Supabase CLI
cd /Users/elijahwilliams/Documents/GitHub/EasyStayRetreats
supabase db push

# Or apply manually in Supabase Dashboard > SQL Editor
```

The migration file is located at:
`supabase/migrations/20251222000003_fix_affiliate_creation.sql`

### Step 2: What the Migration Does

1. **Creates missing affiliates entries** - Backfills the `affiliates` table for all existing users with the 'affiliate' role
2. **Updates the signup trigger** - Ensures new users get both a `profiles` AND an `affiliates` entry
3. **Fixes RLS policies** - Splits the generic policy into specific SELECT, INSERT, UPDATE, and DELETE policies

### Step 3: Test the Fix

1. **Refresh your browser** (Cmd+Shift+R or Ctrl+Shift+F5)
2. Go to the Affiliate Links page
3. Try creating a new link
4. You should now see:
   - A success message "Link created successfully!"
   - The new link appears in the list immediately

## Improved Error Handling

The code now includes:
- ✅ Better error messages showing exactly what went wrong
- ✅ Console logging for debugging
- ✅ Validation of user authentication before attempting to create
- ✅ Proper loading states
- ✅ Success confirmation

## Debugging

If link creation still fails:

### 1. Check if you have an affiliates entry:
```sql
SELECT * FROM profiles WHERE id = auth.uid();
SELECT * FROM affiliates WHERE id = auth.uid();
```

Both queries should return a row. If the second one doesn't, run:
```sql
INSERT INTO affiliates (id, display_name, status)
SELECT id, email, 'active' FROM profiles 
WHERE id = auth.uid() AND role = 'affiliate';
```

### 2. Check the browser console (F12):
Look for messages like:
- "Creating link with: ..." - Shows the data being sent
- "Link created successfully: ..." - Shows the created link data
- Any error messages

### 3. Check RLS policies are working:
```sql
-- This should show your affiliate links
SELECT * FROM affiliate_links WHERE affiliate_id = auth.uid();

-- This should work (try inserting a test link)
INSERT INTO affiliate_links (affiliate_id, name, slug)
VALUES (auth.uid(), 'Test Link', 'test-' || floor(random() * 1000000));
```

### 4. Verify foreign key constraint:
```sql
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
WHERE tc.table_name = 'affiliate_links' 
    AND tc.constraint_type = 'FOREIGN KEY';
```

This should show that `affiliate_id` references `affiliates(id)`.

## What Changed in the Code

### Before:
```javascript
const { error } = await supabase.from('affiliate_links').insert([...]);
if (!error) {
    fetchLinks();
} else {
    alert(error.message);
}
```

### After:
```javascript
const { data, error } = await supabase
    .from('affiliate_links')
    .insert([...])
    .select();

if (error) {
    console.error('Error creating link:', error);
    alert(`Failed to create link: ${error.message}`);
    return;
}

console.log('Link created successfully:', data);
await fetchLinks();
alert('Link created successfully!');
```

Now you get:
- Detailed error messages
- Console logs for debugging
- Success confirmation
- Proper error handling

## Support

If issues persist after applying the migration:
1. Check browser console for detailed error messages
2. Check server console if running locally
3. Check Supabase Dashboard > Logs > Postgres Logs for database errors
4. Verify your user has both a `profiles` and `affiliates` entry


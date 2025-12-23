# How to Apply the Status Column Migration

## The Problem
You're seeing "draft" and can't change the status. This is because the database migration hasn't been applied yet.

## Quick Check
**Open your browser console** (F12 or Cmd+Option+I) and look for this warning:
```
Landing page [id] has no status field - defaulting to 'draft'. You may need to run the migration.
```

If you see this, follow the steps below.

---

## 🚀 Solution: Apply the Migration

Choose **ONE** of these methods:

### Method 1: Supabase Dashboard (Easiest)

1. **Go to your Supabase Dashboard**
   - Navigate to: https://app.supabase.com
   - Select your project: `EasyStayRetreats`

2. **Open SQL Editor**
   - Click on **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Copy and Paste the Migration**
   - Open this file: `supabase/migrations/20251222000005_add_status_column.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

4. **Run the Migration**
   - Click **Run** or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)
   - You should see: "Success. No rows returned"

5. **Verify It Worked**
   - Create a new query
   - Paste this:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'landing_pages' 
     AND column_name = 'status';
   ```
   - Click **Run**
   - You should see one row showing the `status` column exists

6. **Refresh Your App**
   - Go back to your app
   - Refresh the page (Cmd+R or Ctrl+R)
   - Try changing the status - it should work now!

---

### Method 2: Supabase CLI (For Developers)

If you have Supabase CLI installed:

```bash
# Navigate to project directory
cd /Users/elijahwilliams/Documents/GitHub/EasyStayRetreats

# Make sure you're linked to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply all pending migrations
supabase db push

# Or apply this specific migration
supabase migration up
```

---

### Method 3: Manual SQL (Alternative)

If you prefer to run the SQL manually:

1. Go to Supabase Dashboard → SQL Editor
2. Run this simplified version:

```sql
-- Add status column
ALTER TABLE public.landing_pages
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';

-- Set status based on existing is_published
UPDATE public.landing_pages
SET status = CASE 
    WHEN is_published = true THEN 'published'
    ELSE 'draft'
END;

-- Add constraint
ALTER TABLE public.landing_pages
ADD CONSTRAINT landing_pages_status_check 
CHECK (status IN ('draft', 'paused', 'published'));

-- Sync trigger
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
```

3. Click **Run**

---

## ✅ Verify It Worked

After running the migration:

### 1. Check in Supabase Dashboard
Go to **Table Editor** → `landing_pages` table → You should see a new `status` column

### 2. Check in Your App
1. Open browser console (F12)
2. Refresh the page
3. Look for this log: `Sample landing page fields: [...]`
4. It should include `status` in the list

### 3. Try Changing Status
1. Click on a link's status dropdown
2. Select "Paused" or "Published"
3. You should see a toast notification confirming the change
4. The dropdown should update to show the new status

---

## 🐛 Troubleshooting

### Error: "column 'status' does not exist"
**Solution**: The migration wasn't applied. Follow Method 1 above.

### Error: "new row violates check constraint"
**Solution**: You might have an invalid status value. Run:
```sql
UPDATE landing_pages SET status = 'draft' WHERE status NOT IN ('draft', 'paused', 'published');
```

### Status dropdown is disabled
**Solution**: Make sure a landing page exists for that link. Click "Landing Builder" first to create one.

### Console shows "has no status field"
**Solution**: The migration wasn't applied. Follow Method 1 above.

### Changes don't persist
**Solution**: Check RLS policies. Run:
```sql
-- Check if you have update permission
SELECT * FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'landing_pages';
```

---

## 📊 Check Migration Status Anytime

Run this query in Supabase SQL Editor:

```sql
-- Copy and paste from: scripts/check-migration-status.sql
-- Or use this quick check:

SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'landing_pages' 
              AND column_name = 'status'
        ) THEN '✅ Migration Applied - Status column exists'
        ELSE '❌ Migration NOT Applied - Status column missing'
    END as migration_status;
```

---

## 🎯 After Migration Success

You should now be able to:
- ✅ Change status from dropdown (Draft, Paused, Published)
- ✅ See color-coded status badges (Yellow, Orange, Green)
- ✅ Get toast notifications when status changes
- ✅ Cycle through statuses with the eye button
- ✅ Change status from analytics section

---

## Need Help?

1. **Check browser console** for error messages
2. **Check Supabase logs** in Dashboard → Logs
3. **Verify RLS policies** allow updates
4. **Ensure you're authenticated** as the link owner

If status still won't change after applying migration:
- Check console for detailed error messages
- The error will include `message`, `details`, `hint`, and `code`
- Share this information for further debugging


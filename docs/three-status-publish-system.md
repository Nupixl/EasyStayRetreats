# Three-Status Publishing System

## Overview
Added support for three publishing statuses for landing pages: **Draft**, **Paused**, and **Published**.

## Changes Made

### 1. Database Migration
**File**: `supabase/migrations/20251222000005_add_status_column.sql`

- Added `status` column to `landing_pages` table with values: `'draft'`, `'paused'`, or `'published'`
- Migrated existing data: `is_published = true` → `status = 'published'`, otherwise `status = 'draft'`
- Added check constraint to ensure only valid statuses
- Created trigger to sync `is_published` field with `status` (for backward compatibility)
- Added index on `status` column for performance

### 2. TypeScript Types
**File**: `src/app/affiliate/links/page.tsx`

Updated `AffiliateLink` type to include status:
```typescript
landing_page?: {
    is_published: boolean;
    status: 'draft' | 'paused' | 'published';
    id: string;
}
```

### 3. UI Components

#### Status Dropdown (Main Card)
- Shows current status next to link name
- Color-coded:
  - 🟡 Yellow for Draft
  - 🟠 Orange for Paused
  - 🟢 Green for Published
- Icons: 📝 Draft, ⏸️ Paused, ✓ Published

#### Quick Toggle Button (Eye Icon)
- Cycles through statuses: Draft → Paused → Published → Draft
- Visual indicators:
  - `EyeOff` icon (yellow) for Draft
  - ⏸️ emoji (orange) for Paused
  - `Eye` icon (green) for Published

#### Analytics Section Dropdown
- Full-width dropdown in expanded analytics
- Same three status options
- Color-coded background matching status

### 4. Status Update Logic
**Function**: `togglePublishStatus(link, newStatus)`

- Accepts new status as parameter
- Updates both `status` and `is_published` fields
- Shows toast notification with status emoji
- Updates local state immediately

### 5. Data Fetching
Updated queries to fetch the new `status` field:
```typescript
landing_pages(id, is_published, status)
```

## Status Meanings

### Draft 📝
- Landing page is not public
- Only visible to the creator
- Default status for new pages

### Paused ⏸️
- Landing page was previously published
- Temporarily disabled without deleting
- Can be quickly re-enabled
- Useful for seasonal campaigns or testing

### Published ✓
- Landing page is live and public
- Accessible via the referral link
- Actively tracking clicks and conversions

## How to Use

### Option 1: Dropdown (Recommended)
1. Click the dropdown next to the link name
2. Select desired status: Draft, Paused, or Published
3. Change takes effect immediately

### Option 2: Quick Toggle Button
1. Click the eye icon button in the action bar
2. Status cycles through: Draft → Paused → Published → Draft
3. Hover to see current status

### Option 3: Analytics Section
1. Click the analytics icon (📊) to expand metrics
2. Use the "Publish Status" dropdown
3. Select desired status

## Migration Instructions

### Step 1: Apply Database Migration
Run the migration to add the status column:

```bash
# If using Supabase CLI
supabase migration up

# Or apply manually in Supabase Dashboard SQL Editor
# Copy and paste contents of:
# supabase/migrations/20251222000005_add_status_column.sql
```

### Step 2: Verify Migration
Check that the migration was successful:

```sql
-- Verify status column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'landing_pages' 
  AND column_name = 'status';

-- Check existing statuses
SELECT status, COUNT(*) 
FROM landing_pages 
GROUP BY status;
```

### Step 3: Deploy Code
After migration is applied, deploy the updated code to use the new status system.

## Backward Compatibility

The `is_published` boolean field is maintained for backward compatibility:
- Automatically synced via database trigger
- `status = 'published'` → `is_published = true`
- Other statuses → `is_published = false`

This ensures any existing queries or logic using `is_published` continue to work.

## Toast Notifications

Status changes show a success message:
- ✓ "[Link Name] is now published!"
- ⏸️ "[Link Name] is now paused!"
- 📝 "[Link Name] is now draft!"

## Color Scheme

| Status | Background | Text | Border |
|--------|-----------|------|--------|
| Draft | `bg-yellow-500/10` | `text-yellow-600` | `border-yellow-500/20` |
| Paused | `bg-orange-500/10` | `text-orange-600` | `border-orange-500/20` |
| Published | `bg-green-500/10` | `text-green-600` | `border-green-500/20` |

## Future Enhancements

Potential additions:
- Scheduled publishing (set future publish date)
- Status history/audit log
- Automatic pausing based on conditions
- Bulk status updates
- Status filters in links list

## Notes

- **Status field is the source of truth** - Always use `status` for new logic
- **is_published syncs automatically** - Don't update it directly
- **Disabled dropdown** - If no landing page exists, dropdown is disabled with tooltip
- **Real-time updates** - Status changes reflect immediately without page refresh

